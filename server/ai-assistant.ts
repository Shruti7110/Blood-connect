import { Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';

interface ChatRequest {
  message: string;
  userId: string;
  userRole: 'donor' | 'patient' | 'healthcare_provider';
  userName: string;
  userEmail: string;
}

export async function handleAIChat(req: Request, res: Response) {
  try {
    const { message, userId, userRole, userName, userEmail }: ChatRequest = req.body;

    if (!message || !userId || !userRole || !userName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get additional IDs based on role
    let donorId = null;
    let patientId = null;
    let providerId = null;

    // Import storage to get role-specific IDs
    const { SupabaseStorage } = await import('./supabase-storage');
    const storage = new SupabaseStorage();

    try {
      if (userRole === 'donor') {
        const donor = await storage.getDonorByUserId(userId);
        donorId = donor?.id;
      } else if (userRole === 'patient') {
        const patient = await storage.getPatientByUserId(userId);
        patientId = patient?.id;
      } else if (userRole === 'healthcare_provider') {
        const provider = await storage.getHealthcareProviderByUserId(userId);
        providerId = provider?.id;
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

    // Path to the Python script
    const pythonScriptPath = path.join(import.meta.dirname, 'talking_assistant.py');

    // Run the Python script with user data and message
    const pythonProcess = spawn('python3', [
      pythonScriptPath,
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

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    let responseSent = false; // Flag to track if response has been sent

    pythonProcess.on('close', (code) => {
      if (responseSent) return; // Prevent further responses

      if (code !== 0) {
        console.error('Python process error:', errorOutput);
        responseSent = true;
        return res.status(500).json({ 
          error: 'AI Assist error',
          details: errorOutput 
        });
      }

      // Handle successful response
      try {
        const lines = output.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        const result = JSON.parse(lastLine);

        if (result.error) {
          responseSent = true;
          return res.status(500).json({ error: result.error });
        }

        responseSent = true;
        return res.json({ response: result.response });
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        responseSent = true;
        return res.status(500).json({ 
          error: 'Failed to parse AI response',
          rawOutput: output 
        });
      }
    });

    // Set a timeout for the process
    setTimeout(() => {
      if (!pythonProcess.killed && !responseSent) {
        pythonProcess.kill();
        responseSent = true;
        return res.status(408).json({ error: 'Request timeout' });
      }
    }, 120000); // 120 second timeout

  } catch (error) {
    console.error('AI Assistant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}