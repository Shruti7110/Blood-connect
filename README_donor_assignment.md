# Blood Donor Assignment System

An automated system that assigns compatible blood donors to thalassemia patients based on blood group compatibility, location matching, and donation history. This system integrates with your Supabase database and runs weekly to maintain up-to-date donor family assignments.

## Features

- **Smart Compatibility Matching**: Uses medical blood group compatibility matrix
- **Location-Based Assignment**: Only assigns donors in the same location as patients
- **Donation History Priority**: Prioritizes recent donors (within 6 months)
- **Weekly Automation**: Runs automatically every Monday at 9:00 AM
- **Database Integration**: Seamlessly works with your existing Supabase schema
- **Comprehensive Logging**: Detailed logs for monitoring and debugging
- **Flexible Deployment**: Multiple options for scheduling (cron, systemd, manual)

## Quick Start

### 1. Setup Environment

```bash
# Install dependencies and configure
python3 setup_donor_assignment.py
```

This will:
- Install required Python packages
- Configure your Supabase connection
- Test the database connection
- Create a systemd service file

### 2. Run Assignment (Choose One)

**Option A: Run Immediately**
```bash
python3 donor_assignment_system.py --now
```

**Option B: Start Scheduled Service**
```bash
python3 donor_assignment_system.py --schedule
```

**Option C: Setup Cron Job**
```bash
./setup_cron.sh
```

## How It Works

### Algorithm Overview

1. **Fetch Data**: Retrieves all patients and available donors from Supabase
2. **Compatibility Check**: Filters donors based on:
   - Blood group compatibility (medical standards)
   - Same location as patient
   - Availability status
3. **Prioritization**: Sorts donors by:
   - Recent donations (within 6 months) first
   - Total donation count (for tie-breaking)
4. **Assignment**: Assigns up to 20 donors per patient
5. **Database Update**: 
   - Deactivates old assignments
   - Creates new donor family records

### Blood Group Compatibility Matrix

| Patient Type | Compatible Donors |
|--------------|-------------------|
| A+ | A+, A-, O+, O- |
| A- | A-, O- |
| B+ | B+, B-, O+, O- |
| B- | B-, O- |
| AB+ | A+, A-, B+, B-, AB+, AB-, O+, O- |
| AB- | A-, B-, AB-, O- |
| O+ | O+, O- |
| O- | O- |

## Configuration

### Environment Variables

Create a `.env` file with:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Requirements

Your Supabase database should have these tables with the following structure:

**Users Table**
- id, email, name, blood_group, location

**Patients Table**
- id, user_id (references users.id)

**Donors Table**
- id, user_id (references users.id), available_for_donation, last_donation, total_donations

**Donor_Families Table**
- patient_id, donor_id, assigned_at, is_active

## Usage Examples

### Manual Execution
```bash
# Run assignment process once
python3 donor_assignment_system.py --now

# Interactive mode
python3 donor_assignment_system.py
```

### Scheduled Execution
```bash
# Start as a service (runs until stopped)
python3 donor_assignment_system.py --schedule

# Setup cron job (runs weekly automatically)
./setup_cron.sh
```

### System Service (Linux)
```bash
# Copy the generated service file
sudo cp blood-donor-assignment.service /etc/systemd/system/

# Enable and start the service
sudo systemctl daemon-reload
sudo systemctl enable blood-donor-assignment.service
sudo systemctl start blood-donor-assignment.service

# Check status
sudo systemctl status blood-donor-assignment.service
```

## Monitoring and Logs

### Log Files
- `donor_assignment.log` - Main application logs
- `logs/cron_donor_assignment.log` - Cron job execution logs

### Log Levels
- **INFO**: Normal operations, assignment results
- **WARNING**: Missing data, no compatible donors found
- **ERROR**: Database errors, connection issues

### Sample Log Output
```
2025-02-01 09:00:01 - INFO - Starting weekly donor assignment process...
2025-02-01 09:00:02 - INFO - Fetched 25 patients from database
2025-02-01 09:00:03 - INFO - Fetched 150 available donors from database
2025-02-01 09:00:04 - INFO - Successfully assigned 18 donors to patient Sarah Chen
2025-02-01 09:00:05 - INFO - Assignment process completed. Processed 25 patients, created 420 total assignments.
```

## Customization

### Modify Assignment Parameters

Edit `donor_assignment_system.py`:

```python
# Change maximum donors per patient (default: 20)
max_donors_per_patient = 25

# Change recent donor threshold (default: 180 days)
recent_donor_threshold = 120  # 4 months

# Change scheduling (default: Monday 9 AM)
schedule.every().wednesday.at("14:00").do(run_weekly_assignment)
```

### Add Custom Filters

You can extend the compatibility checking:

```python
def get_compatible_donors(self, patient: Patient, all_donors: List[Donor]) -> List[Donor]:
    # Add custom logic here
    # Example: Filter by age, medical history, etc.
```

## Troubleshooting

### Common Issues

**1. "No LSP diagnostics found"**
- The import warnings are normal and will resolve when packages are installed

**2. "Connection failed"**
- Check your Supabase URL and key
- Verify your database tables exist
- Ensure network connectivity

**3. "No patients/donors found"**
- Check your database has data
- Verify table relationships are correct
- Review the SQL queries in the fetch methods

**4. "Permission denied"**
- Make setup script executable: `chmod +x setup_cron.sh`
- Check Supabase row-level security policies

### Debug Mode

Run with detailed logging:

```python
logging.basicConfig(level=logging.DEBUG)
```

## Dependencies

- `supabase>=2.0.0` - Database integration
- `schedule>=1.2.0` - Job scheduling
- `python-dotenv>=1.0.0` - Environment variable management

## Security Notes

- Store Supabase credentials in environment variables, not in code
- Use row-level security policies in Supabase
- Regularly rotate API keys
- Monitor logs for suspicious activity

## Contributing

To modify the assignment algorithm:

1. Update the compatibility matrix in `BLOOD_GROUP_COMPATIBILITY`
2. Modify the `get_compatible_donors()` method for custom filtering
3. Adjust the prioritization logic in donor sorting
4. Test thoroughly with your data

## Support

For issues specific to:
- **Database**: Check Supabase dashboard and logs
- **Scheduling**: Review cron/systemd logs
- **Assignment Logic**: Enable debug logging and review assignment results

The system is designed to be robust and will continue running even if individual assignments fail, ensuring maximum uptime for your blood donation network.