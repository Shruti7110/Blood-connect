
# Supabase Tables Reference

## Overview
This document provides a comprehensive overview of all tables in our Supabase database and how they are used in the project.

## Core Tables

### 1. **users** - Main User Table
**Purpose**: Stores basic user information for all types of users (patients, donors, healthcare providers)

**Columns**:
- `id` (UUID, Primary Key) - Unique user identifier
- `email` (Text, Unique) - User's email address
- `password` (Text) - User's password (stored as plain text - should be hashed in production)
- `role` (Enum: "patient", "donor", "healthcare_provider") - User type
- `name` (Text) - User's full name
- `phone` (Text) - Contact phone number
- `location` (Text) - User's location/address
- `blood_group` (Enum: A+, A-, B+, B-, AB+, AB-, O+, O-) - Blood group
- `created_at` (Timestamp) - Account creation date

**Used in**: Authentication, user profiles, blood matching

---

### 2. **patients** - Patient-Specific Data
**Purpose**: Stores detailed medical information for patients with thalassemia

**Columns**:
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key → users.id) - Links to user table
- `date_of_birth` (Timestamp)
- `weight` (Text)
- `diagnosis` (Text)
- `thalassemia_type` (Text)
- `recent_pre_transfusion_hb` (Text) - Recent hemoglobin levels
- `symptoms_between_transfusions` (Text)
- `poor_growth_history` (Boolean)
- `bone_deformities` (Boolean)
- `recurrent_infections` (Boolean)
- `organ_issues_history` (Text)
- `transfusion_frequency_past_6_months` (Text)
- `units_per_session` (Integer)
- `usual_transfusion_hb_level` (Text)
- `recent_interval_changes` (Text)
- `iron_chelation_therapy` (Text)
- `chelation_medication` (Text)
- `chelation_frequency` (Text)
- `last_serum_ferritin` (Text)
- `last_liver_iron_measurement` (Text)
- `adverse_reactions_history` (Text)
- `manual_transfusion_frequency` (Text)
- `transfusion_history` (JSONB)
- `next_transfusion_date` (Timestamp)
- `hemoglobin_level` (Text)
- `iron_levels` (Text)
- `last_transfusion` (Timestamp)
- `total_transfusions` (Integer)

**Used in**: Patient dashboard, medical records, transfusion scheduling

---

### 3. **donors** - Donor-Specific Data
**Purpose**: Stores information about blood donors

**Columns**:
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key → users.id) - Links to user table
- `eligibility_status` (Boolean) - Whether donor is eligible
- `last_donation` (Timestamp) - Date of last donation
- `total_donations` (Integer) - Total number of donations made
- `available_for_donation` (Boolean) - Current availability status
- `donation_history` (JSONB) - Historical donation records

**Used in**: Donor matching, availability tracking, donation history

---

### 4. **healthcare_providers** - Healthcare Provider Data
**Purpose**: Stores information about medical professionals

**Columns**:
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key → users.id) - Links to user table
- `hospital_name` (Text) - Name of affiliated hospital
- `department` (Text) - Medical department
- `license_number` (Text) - Medical license number

**Used in**: Provider dashboard, medical approvals, transfusion oversight

---

## Appointment Tables

### 5. **patient_transfusions** (NEW NAME) - Patient Transfusion Appointments
**Purpose**: Stores transfusion appointments scheduled by patients

**Columns**:
- `id` (UUID, Primary Key)
- `patient_id` (Foreign Key → patients.id) - Patient receiving transfusion
- `donor_id` (Foreign Key → donors.id) - Optional: Assigned donor
- `provider_id` (Foreign Key → healthcare_providers.id) - Healthcare provider
- `scheduled_date` (Timestamp) - When transfusion is scheduled
- `completed_date` (Timestamp) - When transfusion was completed
- `status` (Enum: "scheduled", "completed", "cancelled", "missed")
- `units_required` (Integer) - Number of blood units needed
- `location` (Text) - Where transfusion will take place
- `notes` (Text) - Additional notes

**API Endpoints**:
- `GET /api/transfusions/patient/:patientId` - Get patient's transfusions
- `GET /api/transfusions/upcoming` - Get all upcoming transfusions
- `POST /api/transfusions` - Create new transfusion appointment

---

### 6. **donors_donations** (NEW NAME) - Donor Donation Appointments
**Purpose**: Stores donation appointments scheduled by donors

**Columns**:
- `id` (UUID, Primary Key)
- `donor_id` (Foreign Key → donors.id) - Donor making donation
- `patient_id` (Foreign Key → patients.id) - **OPTIONAL**: Patient receiving donation (can be NULL)
- `scheduled_date` (Timestamp) - When donation is scheduled
- `completed_date` (Timestamp) - When donation was completed
- `location` (Text) - Where donation will take place
- `units_available` (Integer) - Number of units to be donated (default: 2)
- `status` (Enum: "scheduled", "completed", "cancelled", "missed")
- `notes` (Text) - Additional notes
- `created_at` (Timestamp) - When appointment was created

**API Endpoints**:
- `GET /api/donations/donor/:donorId` - Get donor's donation appointments
- `GET /api/donations/upcoming` - Get all upcoming donations
- `POST /api/donations` - Create new donation appointment

---

## Relationship Tables

### 7. **donor_families** - Donor-Patient Assignment
**Purpose**: Tracks which donors are assigned to which patients as their "donor family"

**Columns**:
- `id` (UUID, Primary Key)
- `patient_id` (Foreign Key → patients.id)
- `donor_id` (Foreign Key → donors.id)
- `assigned_at` (Timestamp) - When assignment was made
- `is_active` (Boolean) - Whether assignment is currently active

**Used in**: Donor family management, patient-donor matching

---

## Communication Tables

### 8. **notifications** - System Notifications
**Purpose**: Stores notifications sent to users

**Columns**:
- `id` (UUID, Primary Key)
- `user_id` (Foreign Key → users.id) - Recipient
- `title` (Text) - Notification title
- `message` (Text) - Notification content
- `type` (Text) - Type of notification
- `is_read` (Boolean) - Whether notification has been read
- `created_at` (Timestamp) - When notification was created

**Used in**: User notifications, system alerts

---

### 9. **emergency_requests** - Emergency Blood Requests
**Purpose**: Stores urgent blood requests

**Columns**:
- `id` (UUID, Primary Key)
- `patient_id` (Foreign Key → patients.id) - Patient in need
- `urgency_level` (Enum: "low", "medium", "high", "critical")
- `units_needed` (Integer) - Number of blood units needed
- `notes` (Text) - Additional details
- `status` (Text) - Request status
- `created_at` (Timestamp) - When request was made

**Used in**: Emergency situations, urgent blood needs

---

## Key Relationships

```
users (1) → (1) patients
users (1) → (1) donors  
users (1) → (1) healthcare_providers

patients (1) → (many) patient_transfusions
patients (1) → (many) donor_families
patients (1) → (many) emergency_requests

donors (1) → (many) donors_donations
donors (1) → (many) donor_families

donor_families: patients (many) ↔ (many) donors
```

## Important Notes

1. **patient_id in donors_donations is OPTIONAL** - Some donations might not be linked to specific patients
2. **Blood group compatibility** is handled in application logic, not database constraints
3. **Authentication** currently uses plain text passwords (should be hashed in production)
4. **Location matching** is used for donor-patient assignment based on geographical proximity
5. **Status enums** are consistent across appointment tables for easy filtering and reporting

## Common Queries

```sql
-- Get all upcoming transfusions for a provider dashboard
SELECT * FROM patient_transfusions 
WHERE status = 'scheduled' 
AND scheduled_date >= NOW() 
ORDER BY scheduled_date ASC;

-- Get donor family for a patient
SELECT df.*, d.*, u.name, u.blood_group 
FROM donor_families df
JOIN donors d ON df.donor_id = d.id
JOIN users u ON d.user_id = u.id
WHERE df.patient_id = ? AND df.is_active = true;

-- Get compatible donors for a patient
SELECT d.*, u.* FROM donors d
JOIN users u ON d.user_id = u.id
WHERE u.blood_group IN (compatible_groups)
AND u.location = patient_location
AND d.available_for_donation = true;
```
