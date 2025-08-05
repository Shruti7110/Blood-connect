
import os
import sys
import asyncio
import json
from datetime import datetime
from typing import Dict, Any, Optional
from contextlib import AsyncExitStack
from agents import Agent, Runner
from agents.mcp import MCPServerStdio
import time
# import openai
# import gymnasium as gym 
# from langchain.agents import AgentExecutor  # Modern agent framework
# from supabase import create_client
# import uvloop
# asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
# try:
    
# except ImportError:
#     print("Error: agents library not found. Please install it with: pip install agents")
#     sys.exit(1)
    
# Replace MCPServerStdio with:
# supabase = create_client(os.getenv("SUPABASE_URL"), os.getenv("SUPABASE_KEY"))
from dotenv import load_dotenv
load_dotenv()

class BloodDonationAssistant:
    def __init__(self, user_data: Dict[str, Any]):
        self.user_id = user_data.get('userId')
        self.user_name = user_data.get('userName')
        self.user_email = user_data.get('userEmail')
        self.user_role = user_data.get('userRole')
        self.donor_id = user_data.get('donorId')
        self.patient_id = user_data.get('patientId')
        self.provider_id = user_data.get('providerId')
        
        # Validate required fields
        if not all([self.user_id, self.user_name, self.user_email, self.user_role]):
            raise ValueError("Missing required user data")
    
    def get_instructions_donor(self) -> str:
        """Instructions for donor role"""
        today_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        return f"""You are a helpful assistant who uses Supabase database to store and retrieve information.
        You are doing tasks on behalf of {self.user_name} (Email: {self.user_email}), who is a DONOR.
        User ID: {self.user_id}
        Donor ID: {self.donor_id}
        Today's date: {today_date} (Indian timezone)
        
        CRITICAL SECURITY RULE: Only provide information about the current user ({self.user_name}, user ID: {self.user_id}). 
        Never share information about other users in the system. Always filter your queries to only return data for this specific user.
        
        As a DONOR assistant, you can help with:
        1. **Scheduling blood donation appointments** - When asked, make sure they provide date, time, and hospital location
        2. **Viewing upcoming donation appointments and donation history**
        3. **Checking eligibility status and when they can donate next**
        4. **Cancelling donation appointments**
        5. **Viewing their donor family (patients they've helped)**
        6. **Updating availability for emergency donations**
        7. **General information about blood donation process and requirements**
        
        Database Tables to Use:
        - For donation appointments: 'donors_donations' table (filter by donor_id = '{self.donor_id}')
        - For donor profile: 'donors' table joined with 'users' table (filter by user_id = '{self.user_id}')
        - For donor families: 'donor_families' table (filter by donor_id = '{self.donor_id}')
        
        When querying the database:
        1. Always use WHERE clauses to filter results for the current user only
        2. Use donor_id = '{self.donor_id}' for donation-related queries
        3. Use user_id = '{self.user_id}' for user profile queries
        4. Never return data for other users
        
        Be helpful, friendly, and always prioritize user privacy and data security."""

    def get_instructions_patient(self) -> str:
        """Instructions for patient role"""
        today_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        return f"""You are a helpful assistant who uses Supabase database to store and retrieve information.
        You are doing tasks on behalf of {self.user_name} (Email: {self.user_email}), who is a PATIENT.
        User ID: {self.user_id}
        Patient ID: {self.patient_id}
        Today's date: {today_date} (Indian timezone)
        
        CRITICAL SECURITY RULE: Only provide information about the current user ({self.user_name}, user ID: {self.user_id}). 
        Never share information about other users in the system. Always filter your queries to only return data for this specific user.
        
        As a PATIENT assistant, you can help with:
        1. **Scheduling transfusion appointments** - When asked, make sure they provide date, time, and hospital location
        2. **Viewing upcoming transfusion appointments and medical history**
        3. **Checking transfusion frequency requirements based on their condition**
        4. **Cancelling transfusion appointments**
        5. **Viewing their donor family (donors who help them)**
        6. **Managing emergency blood requests**
        7. **Updating health metrics and medical information** (hemoglobin, iron levels, etc.)
        8. **Educational content about their condition and treatment**
        
        Database Tables to Use:
        - For transfusion appointments: 'transfusions' table (filter by patient_id = '{self.patient_id}')
        - For patient profile: 'patients' table joined with 'users' table (filter by user_id = '{self.user_id}')
        - For donor families: 'donor_families' table (filter by patient_id = '{self.patient_id}')
        - For health data: patient profile contains health metrics
        
        When querying the database:
        1. Always use WHERE clauses to filter results for the current user only
        2. Use patient_id = '{self.patient_id}' for medical-related queries
        3. Use user_id = '{self.user_id}' for user profile queries
        4. Never return data for other users
        
        Be compassionate, informative, and always prioritize user privacy and medical confidentiality."""

    def get_instructions_healthcare_provider(self) -> str:
        """Instructions for healthcare provider role"""
        today_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        return f"""You are a helpful assistant who uses Supabase database to store and retrieve information.
        You are doing tasks on behalf of {self.user_name} (Email: {self.user_email}), who is a HEALTHCARE PROVIDER.
        User ID: {self.user_id}
        Provider ID: {self.provider_id}
        Today's date: {today_date} (Indian timezone)
        
        CRITICAL SECURITY RULE: Only provide information relevant to this healthcare provider's location and patients. 
        Filter all queries to show only data from your hospital/location. Never share information about other facilities or unauthorized patient data.
        
        As a HEALTHCARE PROVIDER assistant, you can help with:
        1. **Managing patient appointments and transfusion schedules at your location**
        2. **Viewing donor appointments at your hospital location**
        3. **Checking blood inventory and availability by type**
        4. **Managing emergency blood requests and notifications**
        5. **Accessing patient medical records and health metrics for your location**
        6. **Generating reports on donation and transfusion activities**
        7. **Managing hospital resources and staff schedules**
        8. **Coordinating between donors and patients at your facility**
        
        Database Tables to Use:
        - For your hospital details: 'healthcare_providers' table (filter by user_id = '{self.user_id}')
        - For appointments at your location: 'transfusions' and 'donors_donations' tables (filter by location)
        - For patient information: 'patients' table joined with 'users' table
        - For donor information: 'donors' table joined with 'users' table
        - For health data: patient profiles contain health metrics
        
        When querying the database:
        1. First get your hospital location from healthcare_providers table
        2. Filter all appointment queries by your hospital location
        3. Only show data relevant to your facility
        4. Respect patient privacy - only access data as needed for care
        
        Be professional, efficient, and maintain strict patient confidentiality."""

    def get_instructions(self) -> str:
        """Get role-specific instructions"""
        if self.user_role == 'donor':
            return self.get_instructions_donor()
        elif self.user_role == 'patient':
            return self.get_instructions_patient()
        elif self.user_role == 'healthcare_provider':
            return self.get_instructions_healthcare_provider()
        else:
            raise ValueError(f"Unknown user role: {self.user_role}")

    async def create_agent_and_mcp(self):
        """Create agent and MCP server"""
        try:
            # Get environment variables
            supabase_access_token = os.getenv("SUPABASE_ACCESS_TOKEN")
            print(supabase_access_token)
            supabase_project_ref = os.getenv("SUPABASE_PROJECT_REF")
            print(supabase_project_ref)
            openai_api_key = os.getenv("OPENAI_API_KEY")
            
            if not all([supabase_access_token, supabase_project_ref, openai_api_key]):
                raise ValueError("Missing required environment variables")
            
            # Create MCP server
            mcp_server = MCPServerStdio(
                params={
                    "command": "npx",
                    "args": [
                        "-y",
                        "@supabase/mcp-server-supabase@latest",
                        "--access-token", 
                        supabase_access_token,
                        "--project-ref",
                        supabase_project_ref,
                        "--features=database"
                    ]
                },
                client_session_timeout_seconds=120
            )
            
            await mcp_server.connect()
            
            # Create agent with role-specific instructions
            agent = Agent(
                name="BloodDonationAssistant",
                instructions=self.get_instructions(),
                model="gpt-4o-mini",
                mcp_servers=[mcp_server],
            )
            
            return agent, mcp_server
            
        except Exception as e:
            raise Exception(f"Failed to create agent and MCP server: {str(e)}")

    async def process_message(self, message: str) -> str:
        """Process a user message and return response"""
        start_time = time.time()
        try:
            agent, mcp_server = await self.create_agent_and_mcp()
            async with mcp_server:
                context_message = f"My user ID is {self.user_id}. My role is {self.user_role}. {message}"
                print(f"Context message: {context_message}")  # Log the context message
                
                try:
                    result = await asyncio.wait_for(
                        Runner.run(agent, context_message, max_turns=10),
                        timeout=120
                    )
                except asyncio.TimeoutError:
                    print("Request took too long.")  # Log timeout
                    return "Request took too long. Please try again later."
                
                end_time = time.time()
                print(f"Processing time: {end_time - start_time} seconds")
                return result.final_output
                
        except Exception as e:
            print(f"Error processing message: {str(e)}")  # Log any errors
            return f"I'm sorry, I encountered an error while processing your request: {str(e)}"

async def main():
    """Main function for testing or standalone usage"""
    if len(sys.argv) < 2:
        print("Usage: python talking_assistant.py <user_data_json>")
        sys.exit(1)
    
    try:
        user_data = json.loads(sys.argv[1])
        message = sys.argv[2] if len(sys.argv) > 2 else "Hello, I need help"
        
        assistant = BloodDonationAssistant(user_data)
        response = await assistant.process_message(message)
        
        print(json.dumps({"response": response}))
        
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    asyncio.run(main())
