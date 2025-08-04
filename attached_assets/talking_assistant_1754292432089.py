# -------------library-------------------
import os
from dotenv import load_dotenv
from openai import AsyncOpenAI
from agents import Agent, Runner, trace, OpenAIChatCompletionsModel
from agents.mcp import MCPServerStdio
from datetime import datetime
import asyncio
from supabase import create_client, Client # Keep if you use it elsewhere, otherwise can be removed.
import gradio as gr
from contextlib import AsyncExitStack # Import AsyncExitStack

load_dotenv(override=True)
model = "gpt-4o-mini"
today_date = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
# -------------inputs---------------------
user_email = "donor21@gmail.com"
user_name = "Prakash Desai"
user_donor_id = "41266716-7771-4b7d-9fec-5edb7a948915"
database_project_id = os.getenv("database_project_id")
user_role = "donor"

# The mcp_server instance will now be managed by AsyncExitStack
# and assigned to connected_mcp_servers later.
# Removed direct global initialization here.

# -------------gemini model setup---------------------
# google_api_key = os.getenv("GOOGLE_API_KEY")
# GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta/openai/"
# gemini_client = AsyncOpenAI(base_url=GEMINI_BASE_URL, api_key=google_api_key)
# model = OpenAIChatCompletionsModel(model="gemini-2.0-flash-001", openai_client=gemini_client)

def get_instructions(user_query=""):
    return f"""you are a helpful assitant who uses supabase database to store and retrieve information.
    The project id is {database_project_id}.
    you are doing task on behalf of {user_name}, who is a {user_role}.
    Today's date: {today_date} (Indian timezone)
    note: Only tell the user details about him and not about the rest of the users.

    Your primary goal is to answer questions by querying the Supabase database.
    When asked to find details, such as appointments, for a user, you should:
    1. If you are unsure about the table names in the database, use the 'list_tables' tool to get a list of available tables.
    2. Formulate an appropriate SQL SELECT query to retrieve the necessary information from the database.
    3. Use the 'execute_sql' tool to execute this SQL query.
    4. If the 'execute_sql' tool is not available, or you encounter an error, you may need to ask the user for the SQL query.

    Here are the specific tasks you can perform:
    1. Storing information in the database.
    2. Finding details for donors, patients, and hospitals from the database using SQL queries and the 'execute_sql' tool.
    3. Scheduling appointments for blood donations and transfusions - when asked make sure they provide with date, time and hopital location.
    4. Cancelling appointments for blood donations and transfusions.
    5. Managing emergency blood requests.
    6. Sending notifications to users.
    
    Current query: {user_query}
    """

# Global variable to hold the connected MCP server instance(s)
# It will be assigned within the main_app_lifecycle function
# connected_mcp_servers: list[MCPServerStdio] = []

# -------------assistant---------------------
async def create_agent():
    """Initialize agent and MCP server"""
    mcp_server = MCPServerStdio(
        params={
            "command": "npx",
            "args": [
                "-y",
                "@supabase/mcp-server-supabase@latest",
                "--access-token", 
                os.getenv("SUPABASE_ACCESS_TOKEN"),
                "--project-ref",
                database_project_id,
                "--features=database"
            ]
        },
        client_session_timeout_seconds=30
    )
    await mcp_server.connect()
    
    return Agent(
        name="BloodDonationAssistant",
        instructions=get_instructions(),
        model=model,
        mcp_servers=[mcp_server],
    ), mcp_server

async def respond(message, chat_history):
    """Gradio chat interface handler"""
    agent, mcp = await create_agent()
    
    try:
        async with mcp:
            result = await Runner.run(
                agent,
                f"My donor ID is {user_donor_id}. {message}",
                max_turns=10
            )
            response = result.final_output
    except Exception as e:
        response = f"Error: {str(e)}"
    
    chat_history.append((message, response))
    return "", chat_history

# Create Gradio interface
with gr.Blocks(title="Blood Donation Assistant") as demo:
    gr.Markdown("## 🩸 Blood Donation Management System")
    gr.Markdown(f"Welcome back, {user_name}")
    
    chatbot = gr.Chatbot(height=400)
    msg = gr.Textbox(label="Your request")
    clear = gr.Button("Clear Chat")
    
    msg.submit(
        respond,
        [msg, chatbot],
        [msg, chatbot]
    )
    clear.click(lambda: None, None, chatbot, queue=False)

# Run the app
if __name__ == "__main__":
    demo.launch()
    
# async def helper() -> Agent:
#     """Creates a research agent with connected MCP servers."""
#     researcher = Agent(
#         name="Researcher",
#         instructions=instructions,
#         model=model,
#         mcp_servers=connected_mcp_servers, # Use the globally connected servers
#     )
#     return researcher

# async def process_request(user_message: str):
#     """Refactored main function to process a single request."""
#     with trace("BloodConnect"):
#         agent_instance = await helper()
#         result = await Runner.run(agent_instance, user_message, max_turns=15)
#     return result.final_output

# # Gradio chat function
# async def chat_interface(message, history):
#     # history is a list of lists, e.g. [[user_msg, bot_msg], [user_msg, bot_msg], ...]
#     # We only need the current message for the agent
#     print(f"User message: {message}")
#     response = await process_request(message)
#     print(f"Agent response: {response}")
#     return response

# async def main_app_lifecycle():
#     """Manages the lifecycle of the Gradio app and MCP servers."""
#     global connected_mcp_servers # Declare intent to modify global variable

#     async with AsyncExitStack() as stack:
#         # Create and enter the MCP server context
#         # This ensures the server is connected and stays alive for the duration of the stack
#         supabase_server = MCPServerStdio(
#             params={
#                 "command": "npx",
#                 "args": [
#                     "-y",
#                     "@supabase/mcp-server-supabase@latest",
#                     "--access-token",
#                     f"{os.getenv("SUPABASE_ACCESS_TOKEN")}",
#                     "--project-ref",
#                     database_project_id,
#                     "--features=database"
#                 ]
#             },
#             client_session_timeout_seconds=30
#         )
#         # Enter the async context, which will call connect() and keep it alive
#         await stack.enter_async_context(supabase_server)
#         connected_mcp_servers = [supabase_server]
#         print("Connected to Supabase MCP server via AsyncExitStack.")

#         # Launch Gradio app
#         # Use a Queue to enable concurrent requests and keep the server running
#         demo = gr.ChatInterface(
#             fn=chat_interface,
#             title="BloodConnect AI Assistant",
#             description="Ask me questions about your appointments, to set up an appointment, or just the blood donation related queries."
#         )
#         # Enable queueing for better asynchronous handling with Gradio
#         demo.queue()
#         # Launch the Gradio application. It will run until explicitly stopped.
#         await demo.launch(share=True, quiet=True) # quiet=True to suppress some Gradio output

# if __name__ == "__main__":
#     # Run the main application lifecycle
#     asyncio.run(main_app_lifecycle())