#!/usr/bin/env python3
"""
Enhanced Blood Donor Assignment System with Supabase Integration
Automatically assigns compatible donors to patients based on blood group and location.
Runs weekly to maintain up-to-date donor family assignments.
"""

import os
import sys
import datetime
import logging
from typing import List, Dict, Optional
from dataclasses import dataclass

try:
    from supabase import create_client, Client
    import schedule
    import time
except ImportError:
    print("Installing required packages...")
    os.system("pip install supabase schedule")
    from supabase import create_client, Client
    import schedule
    import time

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('donor_assignment.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

@dataclass
class Patient:
    id: str
    user_id: str
    name: str
    blood_group: str
    location: str

@dataclass
class Donor:
    id: str
    user_id: str
    name: str
    blood_group: str
    location: str
    last_donation: Optional[str]
    available_for_donation: bool
    total_donations: int

@dataclass
class DonorFamilyAssignment:
    patient_id: str
    donor_id: str
    assigned_at: str
    is_active: bool

class BloodDonorAssignmentSystem:
    """Enhanced Blood Donor Assignment System with Supabase Integration"""
    
    # Blood group compatibility mapping
    BLOOD_GROUP_COMPATIBILITY = {
        "A+": ["A+", "A-", "O+", "O-"],
        "A-": ["A-", "O-"],
        "B+": ["B+", "B-", "O+", "O-"],
        "B-": ["B-", "O-"],
        "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
        "AB-": ["A-", "B-", "AB-", "O-"],
        "O+": ["O+", "O-"],
        "O-": ["O-"]
    }
    
    def __init__(self, supabase_url: Optional[str] = None, supabase_key: Optional[str] = None):
        """Initialize the assignment system with Supabase connection"""
        self.supabase_url = supabase_url or os.getenv('SUPABASE_URL')
        self.supabase_key = supabase_key or os.getenv('SUPABASE_ANON_KEY')
        
        if not self.supabase_url or not self.supabase_key:
            raise ValueError("Supabase URL and key must be provided via environment variables or parameters")
        
        self.supabase: Client = create_client(self.supabase_url, self.supabase_key)
        logger.info("Supabase client initialized successfully")
    
    def fetch_patients(self) -> List[Patient]:
        """Fetch all active patients from Supabase"""
        try:
            # Join users and patients tables to get complete patient info
            response = self.supabase.table('patients').select('''
                id,
                user_id,
                users!inner(name, blood_group, location)
            ''').execute()
            
            patients = []
            for row in response.data:
                if row['users'] and row['users']['blood_group'] and row['users']['location']:
                    patients.append(Patient(
                        id=row['id'],
                        user_id=row['user_id'],
                        name=row['users']['name'],
                        blood_group=row['users']['blood_group'],
                        location=row['users']['location']
                    ))
            
            logger.info(f"Fetched {len(patients)} patients from database")
            return patients
            
        except Exception as e:
            logger.error(f"Error fetching patients: {str(e)}")
            return []
    
    def fetch_donors(self) -> List[Donor]:
        """Fetch all eligible donors from Supabase"""
        try:
            # Join users and donors tables to get complete donor info
            response = self.supabase.table('donors').select('''
                id,
                user_id,
                last_donation,
                available_for_donation,
                total_donations,
                users!inner(name, blood_group, location)
            ''').eq('available_for_donation', True).execute()
            
            donors = []
            for row in response.data:
                if row['users'] and row['users']['blood_group'] and row['users']['location']:
                    donors.append(Donor(
                        id=row['id'],
                        user_id=row['user_id'],
                        name=row['users']['name'],
                        blood_group=row['users']['blood_group'],
                        location=row['users']['location'],
                        last_donation=row['last_donation'],
                        available_for_donation=row['available_for_donation'],
                        total_donations=row['total_donations'] or 0
                    ))
            
            logger.info(f"Fetched {len(donors)} available donors from database")
            return donors
            
        except Exception as e:
            logger.error(f"Error fetching donors: {str(e)}")
            return []
    
    def days_since_last_donation(self, donation_date_str: Optional[str]) -> float:
        """Calculate days since last donation"""
        if not donation_date_str:
            return float('inf')  # Never donated
        
        try:
            # Handle both date and datetime formats from Supabase
            if 'T' in donation_date_str:
                donation_date = datetime.datetime.fromisoformat(donation_date_str.replace('Z', '+00:00')).date()
            else:
                donation_date = datetime.datetime.strptime(donation_date_str, "%Y-%m-%d").date()
            
            today = datetime.date.today()
            return (today - donation_date).days
        except Exception as e:
            logger.warning(f"Error parsing donation date {donation_date_str}: {str(e)}")
            return float('inf')
    
    def get_compatible_donors(self, patient: Patient, all_donors: List[Donor]) -> List[Donor]:
        """Filter donors compatible with patient's blood group and location"""
        compatible_groups = self.BLOOD_GROUP_COMPATIBILITY.get(patient.blood_group, [])
        
        # Filter by blood group compatibility and location
        compatible_donors = [
            donor for donor in all_donors
            if donor.blood_group in compatible_groups and donor.location == patient.location
        ]
        
        # Sort by recency of donation (recent donors first, then by total donations)
        compatible_donors.sort(key=lambda x: (
            self.days_since_last_donation(x.last_donation),
            -x.total_donations  # Higher total donations first for tie-breaking
        ))
        
        return compatible_donors
    
    def get_current_assignments(self, patient_id: str) -> List[str]:
        """Get current donor assignments for a patient"""
        try:
            response = self.supabase.table('donor_families').select('donor_id').eq(
                'patient_id', patient_id
            ).eq('is_active', True).execute()
            
            return [row['donor_id'] for row in response.data]
        except Exception as e:
            logger.error(f"Error fetching current assignments for patient {patient_id}: {str(e)}")
            return []
    
    def deactivate_old_assignments(self, patient_id: str) -> bool:
        """Deactivate old donor assignments for a patient"""
        try:
            self.supabase.table('donor_families').update({
                'is_active': False
            }).eq('patient_id', patient_id).execute()
            
            logger.info(f"Deactivated old assignments for patient {patient_id}")
            return True
        except Exception as e:
            logger.error(f"Error deactivating assignments for patient {patient_id}: {str(e)}")
            return False
    
    def create_donor_assignments(self, patient_id: str, donor_ids: List[str]) -> bool:
        """Create new donor family assignments"""
        try:
            assignments = []
            current_time = datetime.datetime.now().isoformat()
            
            for donor_id in donor_ids:
                assignments.append({
                    'patient_id': patient_id,
                    'donor_id': donor_id,
                    'assigned_at': current_time,
                    'is_active': True
                })
            
            if assignments:
                self.supabase.table('donor_families').insert(assignments).execute()
                logger.info(f"Created {len(assignments)} new assignments for patient {patient_id}")
            
            return True
        except Exception as e:
            logger.error(f"Error creating assignments for patient {patient_id}: {str(e)}")
            return False
    
    def assign_donors_to_patient(self, patient: Patient, all_donors: List[Donor], max_donors: int = 20) -> int:
        """Assign donors to a specific patient"""
        # Get compatible donors
        compatible_donors = self.get_compatible_donors(patient, all_donors)
        
        if not compatible_donors:
            logger.warning(f"No compatible donors found for patient {patient.name} ({patient.blood_group}) in {patient.location}")
            return 0
        
        # Prioritize recent donors (within 6 months)
        recent_donors = []
        other_donors = []
        
        for donor in compatible_donors:
            days_since = self.days_since_last_donation(donor.last_donation)
            if days_since <= 180:  # 6 months
                recent_donors.append(donor)
            else:
                other_donors.append(donor)
        
        # Combine recent donors first, then others
        selected_donors = (recent_donors + other_donors)[:max_donors]
        donor_ids = [donor.id for donor in selected_donors]
        
        # Update database
        success = True
        success &= self.deactivate_old_assignments(patient.id)
        success &= self.create_donor_assignments(patient.id, donor_ids)
        
        if success:
            logger.info(f"Successfully assigned {len(donor_ids)} donors to patient {patient.name}")
            
            # Log assignment details
            for i, donor in enumerate(selected_donors, 1):
                days_since = self.days_since_last_donation(donor.last_donation)
                logger.info(f"  {i}. {donor.name} ({donor.blood_group}) - Last donated: {days_since} days ago")
        
        return len(donor_ids) if success else 0
    
    def run_assignment_process(self) -> Dict[str, int]:
        """Run the complete donor assignment process"""
        logger.info("Starting weekly donor assignment process...")
        
        # Fetch data
        patients = self.fetch_patients()
        donors = self.fetch_donors()
        
        if not patients:
            logger.warning("No patients found. Skipping assignment process.")
            return {"patients_processed": 0, "total_assignments": 0}
        
        if not donors:
            logger.warning("No donors found. Skipping assignment process.")
            return {"patients_processed": 0, "total_assignments": 0}
        
        logger.info(f"Processing {len(patients)} patients with {len(donors)} available donors")
        
        # Process assignments
        results = {"patients_processed": 0, "total_assignments": 0}
        
        # Create a copy of donors list for assignment tracking
        available_donors = donors.copy()
        
        for patient in patients:
            try:
                assigned_count = self.assign_donors_to_patient(patient, available_donors)
                results["total_assignments"] += assigned_count
                results["patients_processed"] += 1
                
                # Remove assigned donors from pool to avoid conflicts
                if assigned_count > 0:
                    current_assignments = self.get_current_assignments(patient.id)
                    available_donors = [d for d in available_donors if d.id not in current_assignments]
                
            except Exception as e:
                logger.error(f"Error processing patient {patient.name}: {str(e)}")
                continue
        
        logger.info(f"Assignment process completed. Processed {results['patients_processed']} patients, "
                   f"created {results['total_assignments']} total assignments.")
        
        return results

def setup_environment():
    """Setup environment variables if not already set"""
    if not os.getenv('SUPABASE_URL'):
        print("SUPABASE_URL environment variable not found.")
        url = input("Please enter your Supabase URL: ").strip()
        if url:
            os.environ['SUPABASE_URL'] = url
    
    if not os.getenv('SUPABASE_ANON_KEY'):
        print("SUPABASE_ANON_KEY environment variable not found.")
        key = input("Please enter your Supabase anonymous key: ").strip()
        if key:
            os.environ['SUPABASE_ANON_KEY'] = key

def run_weekly_assignment():
    """Function to be called by the scheduler"""
    try:
        system = BloodDonorAssignmentSystem()
        results = system.run_assignment_process()
        logger.info(f"Weekly assignment completed successfully: {results}")
    except Exception as e:
        logger.error(f"Weekly assignment failed: {str(e)}")

def main():
    """Main function with options for immediate run or scheduled execution"""
    setup_environment()
    
    if len(sys.argv) > 1 and sys.argv[1] == "--now":
        # Run immediately
        logger.info("Running donor assignment immediately...")
        run_weekly_assignment()
    elif len(sys.argv) > 1 and sys.argv[1] == "--schedule":
        # Run on schedule
        logger.info("Starting scheduled donor assignment service...")
        schedule.every().monday.at("09:00").do(run_weekly_assignment)  # Run every Monday at 9 AM
        
        logger.info("Scheduler started. Assignment will run every Monday at 9:00 AM")
        logger.info("Press Ctrl+C to stop the scheduler")
        
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
        except KeyboardInterrupt:
            logger.info("Scheduler stopped by user")
    else:
        # Interactive mode
        print("Blood Donor Assignment System")
        print("Usage:")
        print("  python donor_assignment_system.py --now        # Run assignment immediately")
        print("  python donor_assignment_system.py --schedule   # Start scheduled service")
        print("  python donor_assignment_system.py             # Interactive mode")
        
        choice = input("\nChoose an option (1=Run now, 2=Start scheduler, q=quit): ").strip()
        
        if choice == "1":
            run_weekly_assignment()
        elif choice == "2":
            main_with_args = lambda: main()
            sys.argv.append("--schedule")
            main()
        elif choice.lower() == "q":
            print("Goodbye!")
        else:
            print("Invalid choice. Exiting.")

if __name__ == "__main__":
    main()