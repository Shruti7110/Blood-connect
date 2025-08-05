import { Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs'; // Import fs module

interface ChatRequest {
  message: string;
  userId: string;
  userRole: 'donor' | 'patient' | 'healthcare_provider';
  userName: string;
  userEmail: string;
}

export async function handleAIChat(req: any, res: any, options: any = {}) {
  try {
    console.log('=== AI Chat Request ===');
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    console.log('Request headers:', JSON.stringify(req.headers, null, 2));

    const { message, userId, userRole, userName, userEmail }: ChatRequest = req.body;

    console.log('Extracted fields:', {
      message: message ? 'Present' : 'Missing',
      userId: userId ? 'Present' : 'Missing',
      userRole: userRole ? 'Present' : 'Missing',
      userName: userName ? 'Present' : 'Missing',
      userEmail: userEmail ? 'Present' : 'Missing'
    });

    if (!message || !userId || !userRole || !userName) {
      console.error('Missing required fields:', {
        message: !!message,
        userId: !!userId,
        userRole: !!userRole,
        userName: !!userName
      });
      return res.status(400).json({
        error: "Missing required fields",
        required: ["message", "userId", "userRole", "userName"],
        received: {
          message: !!message,
          userId: !!userId,
          userRole: !!userRole,
          userName: !!userName
        }
      });
    }

    // Import storage to get role-specific IDs
    const { SupabaseStorage } = await import('./supabase-storage');
    const storage = new SupabaseStorage();

    console.log('Fetching user details for userId:', userId);
    // Get user details from database
    const user = await storage.getUser(userId);
    if (!user) {
      console.error('User not found in database:', userId);
      return res.status(404).json({ error: "User not found" });
    }

    console.log('User found:', {
      id: user.id,
      role: user.role,
      name: user.name
    });

    // Get additional IDs based on role
    let donorId = null;
    let patientId = null;
    let providerId = null;

    try {
      if (userRole === 'donor') {
        console.log('Fetching donor details for userId:', userId);
        const donor = await storage.getDonorByUserId(userId);
        donorId = donor?.id;
        console.log('Donor details fetched:', donorId ? 'Present' : 'Missing');
      } else if (userRole === 'patient') {
        console.log('Fetching patient details for userId:', userId);
        const patient = await storage.getPatientByUserId(userId);
        patientId = patient?.id;
        console.log('Patient details fetched:', patientId ? 'Present' : 'Missing');
      } else if (userRole === 'healthcare_provider') {
        console.log('Fetching healthcare provider details for userId:', userId);
        const provider = await storage.getHealthcareProviderByUserId(userId);
        providerId = provider?.id;
        console.log('Healthcare provider details fetched:', providerId ? 'Present' : 'Missing');
      }
    } catch (error) {
      console.warn('Failed to get role-specific ID:', error);
    }

    // Prepare user data for Python script
    const userData = {
      userId,
      userName,
      userEmail,
      userRole,
      donorId,
      patientId,
      providerId
    };
    console.log('UserData prepared for Python script:', userData);

    // Determine the Python script path
    const scriptPath = path.join(__dirname, 'talking_assistant.py');
    console.log('Python script path:', scriptPath);

    if (!fs.existsSync(scriptPath)) {
      console.error('Python script not found:', scriptPath);
      return res.status(500).json({ error: "AI assistant script not found" });
    }

    console.log('Python script exists, proceeding with execution');

    // Run the Python script with user data and message
    const pythonProcess = spawn('python3', [
      scriptPath,
      JSON.stringify(userData),
      message
    ], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        SUPABASE_ACCESS_TOKEN: process.env.SUPABASE_ACCESS_TOKEN,
        SUPABASE_PROJECT_REF: process.env.SUPABASE_PROJECT_REF
      }
    });

    console.log('Python process spawned with PID:', pythonProcess.pid);

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      console.log('Python stdout:', data.toString());
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error('Python stderr:', data.toString());
      errorOutput += data.toString();
    });

    let responseSent = false; // Flag to track if response has been sent

    pythonProcess.on('close', (code) => {
      console.log(`Python process exited with code ${code}`);
      if (responseSent) {
        console.log('Response already sent, closing process.');
        return; // Prevent further responses
      }

      if (code !== 0) {
        console.error('Python process error:', errorOutput || 'No stderr output');
        responseSent = true;
        return res.status(500).json({
          error: 'AI Assist error',
          details: errorOutput || 'Unknown error'
        });
      }

      // Handle successful response
      try {
        console.log('Python process closed successfully. Processing output...');
        const lines = output.trim().split('\n');
        if (lines.length === 0 || lines[lines.length - 1].trim() === '') {
          console.error('No valid output from Python script.');
          responseSent = true;
          return res.status(500).json({
            error: 'AI Assist error',
            details: 'No valid output received from AI assistant.'
          });
        }
        const lastLine = lines[lines.length - 1];
        console.log('Last line of Python output:', lastLine);

        const result = JSON.parse(lastLine);

        if (result.error) {
          console.error('AI returned an error:', result.error);
          responseSent = true;
          return res.status(500).json({ error: result.error });
        }

        console.log('AI response received successfully:', result.response);
        responseSent = true;
        return res.json({ response: result.response });
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        console.error('Raw Python output:', output);
        responseSent = true;
        return res.status(500).json({
          error: 'Failed to parse AI response',
          rawOutput: output
        });
      }
    });

    // Set a timeout for the process
    const timeoutId = setTimeout(() => {
      if (!pythonProcess.killed && !responseSent) {
        console.warn('AI Assistant request timed out. Killing process.');
        pythonProcess.kill();
        responseSent = true;
        return res.status(408).json({ error: 'Request timeout' });
      }
    }, 120000); // 120 second timeout

    // Clean up timeout when process closes
    pythonProcess.on('close', () => {
      clearTimeout(timeoutId);
    });

  } catch (error) {
    console.error('Internal Server Error in AI Assistant handler:', error);
    // Ensure response is sent only once
    if (!res.headersSent) {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}