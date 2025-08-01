#!/usr/bin/env python3
"""
Setup script for the Blood Donor Assignment System
This script helps configure the environment and test the connection.
"""

import os
import sys
import subprocess
from pathlib import Path

def install_requirements():
    """Install required packages"""
    try:
        print("Installing required packages...")
        subprocess.check_call([sys.executable, "-m", "pip", "install", "-r", "requirements_donor_assignment.txt"])
        print("✓ Requirements installed successfully")
        return True
    except subprocess.CalledProcessError as e:
        print(f"✗ Failed to install requirements: {e}")
        return False

def create_env_file():
    """Create .env file with Supabase credentials"""
    env_file = Path(".env")
    
    print("\n=== Supabase Configuration ===")
    print("You need your Supabase project URL and anonymous key.")
    print("You can find these in your Supabase project settings under 'API'.")
    
    url = input("\nEnter your Supabase URL: ").strip()
    key = input("Enter your Supabase anonymous key: ").strip()
    
    if not url or not key:
        print("✗ Both URL and key are required")
        return False
    
    # Read existing .env file if it exists
    env_content = ""
    if env_file.exists():
        with open(env_file, 'r') as f:
            lines = f.readlines()
        
        # Remove existing Supabase entries
        filtered_lines = [line for line in lines if not line.startswith(('SUPABASE_URL=', 'SUPABASE_ANON_KEY='))]
        env_content = ''.join(filtered_lines)
    
    # Add new Supabase configuration
    env_content += f"\n# Supabase Configuration for Donor Assignment\n"
    env_content += f"SUPABASE_URL={url}\n"
    env_content += f"SUPABASE_ANON_KEY={key}\n"
    
    with open(env_file, 'w') as f:
        f.write(env_content)
    
    print("✓ Environment file updated")
    return True

def test_connection():
    """Test Supabase connection"""
    try:
        print("\nTesting Supabase connection...")
        
        # Load environment variables
        from dotenv import load_dotenv
        load_dotenv()
        
        # Import and test the system
        from donor_assignment_system import BloodDonorAssignmentSystem
        
        system = BloodDonorAssignmentSystem()
        patients = system.fetch_patients()
        donors = system.fetch_donors()
        
        print(f"✓ Connection successful!")
        print(f"  Found {len(patients)} patients")
        print(f"  Found {len(donors)} available donors")
        
        return True
    except Exception as e:
        print(f"✗ Connection failed: {e}")
        return False

def create_systemd_service():
    """Create a systemd service file for automatic scheduling"""
    service_content = f"""[Unit]
Description=Blood Donor Assignment System
After=network.target

[Service]
Type=simple
User={os.getenv('USER', 'www-data')}
WorkingDirectory={os.getcwd()}
Environment=PATH={os.environ.get('PATH')}
ExecStart={sys.executable} {os.path.join(os.getcwd(), 'donor_assignment_system.py')} --schedule
Restart=always
RestartSec=30

[Install]
WantedBy=multi-user.target
"""
    
    service_file = Path("blood-donor-assignment.service")
    with open(service_file, 'w') as f:
        f.write(service_content)
    
    print(f"\n✓ Systemd service file created: {service_file}")
    print("\nTo install the service (requires sudo):")
    print(f"  sudo cp {service_file} /etc/systemd/system/")
    print("  sudo systemctl daemon-reload")
    print("  sudo systemctl enable blood-donor-assignment.service")
    print("  sudo systemctl start blood-donor-assignment.service")

def main():
    print("=== Blood Donor Assignment System Setup ===\n")
    
    # Install requirements
    if not install_requirements():
        return
    
    # Configure environment
    if not create_env_file():
        return
    
    # Test connection
    if not test_connection():
        print("\nSetup completed with connection issues.")
        print("Please check your Supabase credentials and try again.")
        return
    
    # Create service file
    create_systemd_service()
    
    print("\n=== Setup Complete! ===")
    print("\nYou can now run the donor assignment system:")
    print("  python donor_assignment_system.py --now        # Run once immediately")
    print("  python donor_assignment_system.py --schedule   # Start scheduled service")
    print("\nThe system will automatically assign donors to patients every Monday at 9:00 AM")

if __name__ == "__main__":
    main()