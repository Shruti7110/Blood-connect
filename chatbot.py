import os
import json
from openai import OpenAI
from typing import Dict, List, Any
from datetime import datetime, timedelta
import dotenv # Import dotenv to load environment variables from .env file
class BloodDonationChatbot:
    def __init__(self):
        self.openai_api_key = os.getenv('OPENAI_API_KEY')
        if not self.openai_api_key:
            raise ValueError("OpenAI API key not found. Please set OPENAI_API_KEY in your environment variables.")

        self.client = OpenAI(api_key=self.openai_api_key)  # Updated to new client initialization
        self.user_context = {}

    def get_system_prompt(self) -> str:
        return """
        You are a helpful assistant for a Blood Donation Management System. Your role is to help users navigate the system and perform various tasks.

        You can help with:
        1. Scheduling appointments (for patients and donors)
        2. Canceling appointments
        3. Navigating through the website
        4. Providing information about blood donation
        5. Explaining how to use different features

        First, ask the user what type of user they are:
        - Patient: Someone who needs blood transfusions
        - Donor: Someone who donates blood
        - Healthcare Provider: Hospital staff managing the system

        Based on their role, guide them through the appropriate features:

        For Patients:
        - Schedule transfusion appointments
        - View health metrics
        - See their donor family
        - Access educational content
        - View upcoming appointments

        For Donors:
        - Schedule donation appointments
        - View donation history
        - See assigned patients
        - Cancel appointments
        - View upcoming donations

        For Healthcare Providers:
        - View hospital dashboard
        - Manage patients and donors
        - View appointments
        - Update patient health metrics

        Navigation guidance:
        - Dashboard: Main overview page
        - Health/Donations: View health data or donation history
        - Family: View assigned donors/patients
        - Schedule: Book new appointments
        - Education: Learning resources

        If you don't know something specific about the system or cannot help with a particular task, clearly state that you don't know and suggest they contact support or check the relevant page.

        Always be helpful, clear, and concise in your responses.
        """

    def chat(self, user_message: str, user_type: str = None) -> str:
        try:
            messages = [
                {"role": "system", "content": self.get_system_prompt()},
            ]

            # Add user type context if provided
            if user_type:
                messages.append({
                    "role": "system", 
                    "content": f"The user has identified themselves as a {user_type}. Tailor your responses accordingly."
                })

            messages.append({"role": "user", "content": user_message})

            # Updated to new API format
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=messages,
                max_tokens=500,
                temperature=0.7
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            return f"I'm sorry, I'm having trouble responding right now. Error: {str(e)}. Please try again or contact support."

    def get_navigation_help(self, user_type: str) -> str:
        navigation_guides = {
            "patient": {
                "dashboard": "Your main page showing health overview, upcoming appointments, and quick actions",
                "health": "View and track your health metrics like hemoglobin levels and transfusion history",
                "family": "See your assigned donor family members and their availability",
                "schedule": "Book new transfusion appointments with your healthcare provider",
                "education": "Access educational content about blood disorders and treatments"
            },
            "donor": {
                "dashboard": "Your main page showing donation overview, assigned patients, and quick actions",
                "donations": "View your donation history and upcoming donation appointments",
                "family": "See the patients you're assigned to help",
                "schedule": "Book new donation appointments at available locations",
                "education": "Learn about blood donation and health requirements"
            },
            "healthcare_provider": {
                "dashboard": "Hospital overview with patient/donor statistics and blood inventory",
                "patients": "Manage patient records, appointments, and health metrics",
                "donors": "View donor information and upcoming donation appointments",
                "blood_inventory": "Monitor blood stock levels and availability"
            }
        }

        if user_type.lower() in navigation_guides:
            guide = navigation_guides[user_type.lower()]
            response = f"Here's how to navigate as a {user_type}:\n\n"
            for page, description in guide.items():
                response += f"• {page.title()}: {description}\n"
            return response
        else:
            return "Please specify if you're a Patient, Donor, or Healthcare Provider so I can give you the right navigation guide."

    def get_appointment_help(self, user_type: str, action: str) -> str:
        if user_type.lower() == "patient" and action.lower() == "schedule":
            return """
            To schedule a transfusion appointment as a Patient:
            1. Go to your Dashboard
            2. Click on "Schedule Appointment" button
            3. Select your preferred date and time
            4. Choose the hospital location
            5. Add any special notes if needed
            6. Confirm your appointment

            Your healthcare provider will review and approve the appointment.
            """
        elif user_type.lower() == "donor" and action.lower() == "schedule":
            return """
            To schedule a donation appointment as a Donor:
            1. Go to your Dashboard
            2. Click on "Schedule Donation" button
            3. Select your preferred date and time
            4. Choose the hospital location
            5. Add any notes if needed
            6. Confirm your donation appointment

            Make sure you meet the health requirements for donation.
            """
        elif action.lower() == "cancel":
            return """
            To cancel an appointment:
            1. Go to your Donations page (for donors) or Dashboard (for patients)
            2. Find your upcoming appointment
            3. Click the "Cancel" or "X" button next to the appointment
            4. Confirm the cancellation

            Note: Please cancel at least 24 hours in advance when possible.
            """
        else:
            return "I need to know if you're a Patient or Donor, and whether you want to schedule or cancel an appointment."

def main():
    print("🩸 Blood Donation System Chatbot")
    print("=" * 40)
    print("Hi! I'm here to help you navigate the Blood Donation Management System.")
    print("Type 'quit' to exit, 'help' for navigation guide, or 'appointment' for appointment help.\n")

    chatbot = BloodDonationChatbot()
    user_type = None

    while True:
        try:
            user_input = input("You: ").strip()

            if user_input.lower() == 'quit':
                print("Goodbye! Take care! 🩸❤️")
                break

            elif user_input.lower() == 'help':
                if not user_type:
                    print("Bot: Please tell me first - are you a Patient, Donor, or Healthcare Provider?")
                else:
                    print(f"Bot: {chatbot.get_navigation_help(user_type)}")
                continue

            elif user_input.lower() == 'appointment':
                if not user_type:
                    print("Bot: Please tell me first - are you a Patient, Donor, or Healthcare Provider?")
                else:
                    print("Bot: Do you want to 'schedule' or 'cancel' an appointment?")
                    action = input("You: ").strip()
                    print(f"Bot: {chatbot.get_appointment_help(user_type, action)}")
                continue

            # Detect user type
            if not user_type:
                if any(word in user_input.lower() for word in ['patient', 'need blood', 'transfusion']):
                    user_type = "patient"
                elif any(word in user_input.lower() for word in ['donor', 'donate blood', 'donation']):
                    user_type = "donor"
                elif any(word in user_input.lower() for word in ['healthcare', 'hospital', 'provider', 'staff']):
                    user_type = "healthcare_provider"

            response = chatbot.chat(user_input, user_type)
            print(f"Bot: {response}")

        except KeyboardInterrupt:
            print("\nGoodbye! Take care! 🩸❤️")
            break
        except Exception as e:
            print(f"Bot: Sorry, I encountered an error: {str(e)}. Please try again.")

if __name__ == "__main__":
    main()