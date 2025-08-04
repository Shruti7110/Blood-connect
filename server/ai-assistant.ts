
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

function getInstructionsByRole(role: string, userName: string, userId: string): string {
  const today_date = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  const baseInstructions = `You are a helpful assistant who uses Supabase database to store and retrieve information.
    You are doing task on behalf of ${userName}, who is a ${role}.
    Today's date: ${today_date} (Indian timezone)
    
    IMPORTANT SECURITY RULE: Only provide information about the current user (${userName}, user ID: ${userId}). 
    Never share information about other users in the system. Always filter your queries to only return data for this specific user.
    
    Your primary goal is to answer questions by querying the Supabase database.
    When asked to find details, such as appointments, for a user, you should:
    1. If you are unsure about the table names in the database, use the 'list_tables' tool to get a list of available tables.
    2. Formulate an appropriate SQL SELECT query to retrieve the necessary information from the database.
    3. Use the 'execute_sql' tool to execute this SQL query.
    4. Always include WHERE clauses to filter results for the current user only.
    5. If the 'execute_sql' tool is not available, or you encounter an error, you may need to ask the user for the SQL query.`;

  switch (role) {
    case 'donor':
      return `${baseInstructions}

      As a DONOR assistant, you can help with:
      1. Scheduling blood donation appointments - when asked make sure they provide date, time and hospital location.
      2. Viewing upcoming donation appointments and donation history.
      3. Checking eligibility status and when they can donate next.
      4. Cancelling donation appointments.
      5. Viewing their donor family (patients they've helped).
      6. Updating availability for emergency donations.
      7. General information about blood donation process and requirements.
      
      For donation appointments, use the 'donors_donations' table.
      For donor profile information, use the 'donors' table joined with 'users' table.
      For donor families, use the 'donor_families' table.`;

    case 'patient':
      return `${baseInstructions}

      As a PATIENT assistant, you can help with:
      1. Scheduling transfusion appointments - when asked make sure they provide date, time and hospital location.
      2. Viewing upcoming transfusion appointments and medical history.
      3. Checking transfusion frequency requirements based on their condition.
      4. Cancelling transfusion appointments.
      5. Viewing their donor family (donors who help them).
      6. Managing emergency blood requests.
      7. Updating health metrics and medical information.
      8. Educational content about their condition and treatment.
      
      For transfusion appointments, use the 'patient_transfusions' table.
      For patient profile information, use the 'patients' table joined with 'users' table.
      For donor families, use the 'donor_families' table.
      For health metrics, use the 'health_metrics' table.`;

    case 'healthcare_provider':
      return `${baseInstructions}

      As a HEALTHCARE PROVIDER assistant, you can help with:
      1. Managing patient appointments and transfusion schedules.
      2. Viewing donor appointments at your hospital location.
      3. Checking blood inventory and availability by type.
      4. Managing emergency blood requests and notifications.
      5. Accessing patient medical records and health metrics.
      6. Generating reports on donation and transfusion activities.
      7. Managing hospital resources and staff schedules.
      8. Coordinating between donors and patients.
      
      For your hospital location, use the 'healthcare_providers' table to get your hospital details.
      You can access all appointments at your hospital location from 'patient_transfusions' and 'donors_donations' tables.
      For patient information, use 'patients' table joined with 'users' table.
      For donor information, use 'donors' table joined with 'users' table.
      For health metrics, use the 'health_metrics' table.`;

    default:
      return baseInstructions;
  }
}

export async function handleAIChat(req: Request, res: Response) {
  try {
    const { message, userId, userRole, userName, userEmail }: ChatRequest = req.body;

    if (!message || !userId || !userRole || !userName) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Create a Python script to run the AI assistant
    const pythonScript = `
import os
import sys
import asyncio
import json
from datetime import datetime
from agents import Agent, Runner
from agents.mcp import MCPServerStdio

# Set environment variables
os.environ['OPENAI_API_KEY'] = '${process.env.OPENAI_API_KEY}'

async def run_assistant():
    try:
        # Create MCP server
        mcp_server = MCPServerStdio(
            params={
                "command": "npx",
                "args": [
                    "-y",
                    "@supabase/mcp-server-supabase@latest",
                    "--access-token", 
                    "${process.env.SUPABASE_ACCESS_TOKEN}",
                    "--project-ref",
                    "${process.env.SUPABASE_PROJECT_REF}",
                    "--features=database"
                ]
            },
            client_session_timeout_seconds=30
        )
        
        await mcp_server.connect()
        
        # Create agent with role-specific instructions
        instructions = """${getInstructionsByRole(userRole, userName, userId).replace(/"/g, '\\"')}"""
        
        agent = Agent(
            name="BloodDonationAssistant",
            instructions=instructions,
            model="gpt-4o-mini",
            mcp_servers=[mcp_server],
        )
        
        # Run the assistant
        async with mcp_server:
            user_message = "My user ID is ${userId}. ${message.replace(/"/g, '\\"')}"
            result = await Runner.run(agent, user_message, max_turns=10)
            print(json.dumps({"response": result.final_output}))
            
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    asyncio.run(run_assistant())
`;

    // Write the Python script to a temporary file
    const tempScriptPath = path.join(__dirname, '..', 'temp_ai_script.py');
    require('fs').writeFileSync(tempScriptPath, pythonScript);

    // Run the Python script
    const pythonProcess = spawn('python3', [tempScriptPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: { ...process.env }
    });

    let output = '';
    let errorOutput = '';

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    pythonProcess.on('close', (code) => {
      // Clean up temp file
      try {
        require('fs').unlinkSync(tempScriptPath);
      } catch (e) {
        console.warn('Failed to clean up temp file:', e);
      }

      if (code !== 0) {
        console.error('Python process error:', errorOutput);
        return res.status(500).json({ 
          error: 'AI assistant encountered an error',
          details: errorOutput 
        });
      }

      try {
        // Parse the last line of output as JSON
        const lines = output.trim().split('\n');
        const lastLine = lines[lines.length - 1];
        const result = JSON.parse(lastLine);
        
        if (result.error) {
          return res.status(500).json({ error: result.error });
        }
        
        res.json({ response: result.response });
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        console.log('Raw output:', output);
        res.status(500).json({ 
          error: 'Failed to parse AI response',
          rawOutput: output 
        });
      }
    });

  } catch (error) {
    console.error('AI Assistant error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
