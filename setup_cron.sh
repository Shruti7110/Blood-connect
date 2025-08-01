#!/bin/bash
# Setup script for running donor assignment as a cron job

echo "=== Blood Donor Assignment System - Cron Setup ==="

# Get current directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON_PATH=$(which python3)

echo "Script directory: $SCRIPT_DIR"
echo "Python path: $PYTHON_PATH"

# Create log directory
mkdir -p "$SCRIPT_DIR/logs"

# Create cron job entry
CRON_JOB="0 9 * * 1 cd $SCRIPT_DIR && $PYTHON_PATH donor_assignment_system.py --now >> logs/cron_donor_assignment.log 2>&1"

echo "Proposed cron job (runs every Monday at 9:00 AM):"
echo "$CRON_JOB"

read -p "Do you want to add this cron job? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    # Add to crontab
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
    echo "✓ Cron job added successfully!"
    echo "The donor assignment system will run every Monday at 9:00 AM"
    echo "Logs will be saved to: $SCRIPT_DIR/logs/cron_donor_assignment.log"
    
    # Show current crontab
    echo
    echo "Current crontab entries:"
    crontab -l
else
    echo "Cron job not added. You can manually add it later with:"
    echo "crontab -e"
    echo "Then add this line:"
    echo "$CRON_JOB"
fi

echo
echo "To test the system manually, run:"
echo "python3 donor_assignment_system.py --now"