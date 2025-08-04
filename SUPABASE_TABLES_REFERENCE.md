# Supabase Database Schema Reference

This document provides a comprehensive overview of all database tables, their relationships, and usage in the BloodConnect application.

## Table Overview

### Core User Management

#### `users` - Main user accounts table
**Purpose**: Stores basic user information for all roles (patients, donors, healthcare providers)
```typescript
{
  id: string (UUID, primary key)
  email: string (unique, required)
  password: string (hashed, required)
  role: 'patient' | 'donor' | 'healthcare_provider'
  name: string (required)
  phone: string (optional)
  location: string (city/area for matching)
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  createdAt: timestamp
}
```
**Usage**: Referenced by all role-specific tables through userId foreign key

### Role-Specific Tables

#### `patients` - Patient medical profiles
**Purpose**: Stores detailed medical information for thalassemia patients
```typescript
{
  id: string (UUID, primary key)
  userId: string (foreign key to users.id)

  // Basic Medical Info
  dateOfBirth: timestamp
  weight: string
  diagnosis: string
  thalassemiaType: string

  // Current Clinical Status
  recentPreTransfusionHb: string
  symptomsBetweenTransfusions: string
  poorGrowthHistory: boolean
  boneDeformities: boolean
  recurrentInfections: boolean
  organIssuesHistory: string

  // Transfusion History & Frequency
  transfusionFrequencyPast6Months: string
  unitsPerSession: number
  usualTransfusionHbLevel: string
  recentIntervalChanges: string
  manualTransfusionFrequency: string (days between transfusions)

  // Iron Management
  ironChelationTherapy: string
  chelationMedication: string
  chelationFrequency: string
  lastSerumFerritin: string
  lastLiverIronMeasurement: string
  adverseReactionsHistory: string

  // System Calculated Fields
  transfusionHistory: jsonb (array of past transfusions)
  nextTransfusionDate: timestamp
  hemoglobinLevel: string
  ironLevels: string
  lastTransfusion: timestamp
  totalTransfusions: number
}
```
**Usage**: Central to patient care, linked to transfusions and donor families

#### `donors` - Donor profiles
**Purpose**: Tracks donor eligibility and donation history
```typescript
{
  id: string (UUID, primary key)
  userId: string (foreign key to users.id)
  eligibilityStatus: boolean (can they donate?)
  lastDonation: timestamp
  totalDonations: number
  availableForDonation: boolean (current availability)
  donationHistory: jsonb (array of past donations)
}
```
**Usage**: Referenced in donor_families, donors_donations, patient_transfusions

#### `healthcare_providers` - Healthcare professional profiles
**Purpose**: Stores credentials and hospital information for medical staff
```typescript
{
  id: string (UUID, primary key)
  userId: string (foreign key to users.id)
  hospitalName: string
  department: string
  licenseNumber: string
}
```
**Usage**: Can be linked to patient_transfusions as supervising provider

### Appointment & Schedule Tables

#### `donors_donations` - Donor scheduled appointments
**Purpose**: Tracks when donors schedule donation appointments
```typescript
{
  id: string (UUID, primary key)
  donorId: string (foreign key to donors.id, required)
  patientId: string (foreign key to patients.id, optional - some donations aren't patient-specific)
  scheduledDate: timestamp (required)
  completedDate: timestamp (null until completed)
  location: string (hospital/clinic location)
  unitsAvailable: number (default 2)
  status: 'scheduled' | 'completed' | 'cancelled' | 'missed'
  notes: string
  createdAt: timestamp
}
```
**Usage**: Donor dashboard upcoming appointments, hospital scheduling

#### `patient_transfusions` - Patient transfusion appointments
**Purpose**: Tracks patient transfusion schedules and completions
```typescript
{
  id: string (UUID, primary key)
  patientId: string (foreign key to patients.id, required)
  donorId: string (foreign key to donors.id, optional)
  providerId: string (foreign key to healthcare_providers.id, optional)
  scheduledDate: timestamp (required)
  completedDate: timestamp (null until completed)
  status: 'scheduled' | 'completed' | 'cancelled' | 'missed'
  unitsRequired: number (default 1)
  location: string
  notes: string
}
```
**Usage**: Patient schedules, hospital appointments, tracking transfusion completion

### Relationship Tables

#### `donor_families` - Patient-Donor assignments
**Purpose**: Links patients to their assigned donor families (usually 20+ donors per patient)
```typescript
{
  id: string (UUID, primary key)
  patientId: string (foreign key to patients.id)
  donorId: string (foreign key to donors.id)
  assignedAt: timestamp (when assignment was made)
  isActive: boolean (is this assignment still valid?)
}
```
**Usage**: Patient family page, donor matching algorithm, blood availability calculations

### Communication Tables

#### `notifications` - System notifications
**Purpose**: Stores notifications for users (reminders, updates, alerts)
```typescript
{
  id: string (UUID, primary key)
  userId: string (foreign key to users.id)
  title: string (notification headline)
  message: string (detailed content)
  type: string ('donation_reminder', 'transfusion_reminder', 'system_alert', etc.)
  isRead: boolean (has user seen this?)
  createdAt: timestamp
}
```
**Usage**: Notification bell in navigation, reminder system, user communication

#### `emergency_requests` - Urgent blood requests
**Purpose**: Handle critical blood shortage situations
```typescript
{
  id: string (UUID, primary key)
  patientId: string (foreign key to patients.id)
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
  unitsNeeded: number
  notes: string
  status: string (default 'pending')
  createdAt: timestamp
}
```
**Usage**: Emergency situations, urgent donor notifications

## Key Relationships

1. **Users → Role Tables**: One-to-one relationship (users.id → patients/donors/healthcare_providers.userId)

2. **Patients ↔ Donors**: Many-to-many through donor_families table (one patient assigned to ~20 donors)

3. **Appointments**: 
   - donors_donations: Donor schedules appointment (may or may not be for specific patient)
   - patient_transfusions: Patient schedules transfusion (may link to specific donor)

4. **Notifications**: One-to-many from users (one user can have many notifications)

## API Endpoint Patterns

- **User Management**: `/api/users/:id`, `/api/patients/user/:userId`, `/api/donors/user/:userId`
- **Appointments**: `/api/donations/`, `/api/transfusions/`, `/api/donations/upcoming`, `/api/transfusions/upcoming`
- **Relationships**: `/api/donor-families/:donorId`, `/api/donor-family/:patientId`
- **Communication**: `/api/notifications/user/:userId`, `/api/emergency-requests/`

## Important Notes

1. **patientId in donors_donations is optional** - Some donors may schedule general donations not tied to specific patients
2. **Blood group compatibility is handled in code** - No database constraints, managed by donor assignment algorithm
3. **Dates are stored as timestamps** - Frontend converts to local time zones
4. **Status fields use enums** - Ensures data consistency across the application
5. **JSONB fields** store historical data - transfusionHistory, donationHistory for analytics
```{
  id: string (UUID, primary key)
  email: string (unique, required)
  password: string (hashed, required)
  role: 'patient' | 'donor' | 'healthcare_provider'
  name: string (required)
  phone: string (optional)
  location: string (city/area for matching)
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'
  createdAt: timestamp
}
```
**Usage**: Referenced by all role-specific tables through userId foreign key

### Role-Specific Tables

#### `patients` - Patient medical profiles
**Purpose**: Stores detailed medical information for thalassemia patients
```typescript
{
  id: string (UUID, primary key)
  userId: string (foreign key to users.id)

  // Basic Medical Info
  dateOfBirth: timestamp
  weight: string
  diagnosis: string
  thalassemiaType: string

  // Current Clinical Status
  recentPreTransfusionHb: string
  symptomsBetweenTransfusions: string
  poorGrowthHistory: boolean
  boneDeformities: boolean
  recurrentInfections: boolean
  organIssuesHistory: string

  // Transfusion History & Frequency
  transfusionFrequencyPast6Months: string
  unitsPerSession: number
  usualTransfusionHbLevel: string
  recentIntervalChanges: string
  manualTransfusionFrequency: string (days between transfusions)

  // Iron Management
  ironChelationTherapy: string
  chelationMedication: string
  chelationFrequency: string
  lastSerumFerritin: string
  lastLiverIronMeasurement: string
  adverseReactionsHistory: string

  // System Calculated Fields
  transfusionHistory: jsonb (array of past transfusions)
  nextTransfusionDate: timestamp
  hemoglobinLevel: string
  ironLevels: string
  lastTransfusion: timestamp
  totalTransfusions: number
}
```
**Usage**: Central to patient care, linked to transfusions and donor families

#### `donors` - Donor profiles
**Purpose**: Tracks donor eligibility and donation history
```typescript
{
  id: string (UUID, primary key)
  userId: string (foreign key to users.id)
  eligibilityStatus: boolean (can they donate?)
  lastDonation: timestamp
  totalDonations: number
  availableForDonation: boolean (current availability)
  donationHistory: jsonb (array of past donations)
}
```
**Usage**: Referenced in donor_families, donors_donations, patient_transfusions

#### `healthcare_providers` - Healthcare professional profiles
**Purpose**: Stores credentials and hospital information for medical staff
```typescript
{
  id: string (UUID, primary key)
  userId: string (foreign key to users.id)
  hospitalName: string
  department: string
  licenseNumber: string
}
```
**Usage**: Can be linked to patient_transfusions as supervising provider

### Appointment & Schedule Tables

#### `donors_donations` - Donor scheduled appointments
**Purpose**: Tracks when donors schedule donation appointments
```typescript
{
  id: string (UUID, primary key)
  donorId: string (foreign key to donors.id, required)
  patientId: string (foreign key to patients.id, optional - some donations aren't patient-specific)
  scheduledDate: timestamp (required)
  completedDate: timestamp (null until completed)
  location: string (hospital/clinic location)
  unitsAvailable: number (default 2)
  status: 'scheduled' | 'completed' | 'cancelled' | 'missed'
  notes: string
  createdAt: timestamp
}
```
**Usage**: Donor dashboard upcoming appointments, hospital scheduling

#### `patient_transfusions` - Patient transfusion appointments
**Purpose**: Tracks patient transfusion schedules and completions
```typescript
{
  id: string (UUID, primary key)
  patientId: string (foreign key to patients.id, required)
  donorId: string (foreign key to donors.id, optional)
  providerId: string (foreign key to healthcare_providers.id, optional)
  scheduledDate: timestamp (required)
  completedDate: timestamp (null until completed)
  status: 'scheduled' | 'completed' | 'cancelled' | 'missed'
  unitsRequired: number (default 1)
  location: string
  notes: string
}
```
**Usage**: Patient schedules, hospital appointments, tracking transfusion completion

### Relationship Tables

#### `donor_families` - Patient-Donor assignments
**Purpose**: Links patients to their assigned donor families (usually 20+ donors per patient)
```typescript
{
  id: string (UUID, primary key)
  patientId: string (foreign key to patients.id)
  donorId: string (foreign key to donors.id)
  assignedAt: timestamp (when assignment was made)
  isActive: boolean (is this assignment still valid?)
}
```
**Usage**: Patient family page, donor matching algorithm, blood availability calculations

### Communication Tables

#### `notifications` - System notifications
**Purpose**: Stores notifications for users (reminders, updates, alerts)
```typescript
{
  id: string (UUID, primary key)
  userId: string (foreign key to users.id)
  title: string (notification headline)
  message: string (detailed content)
  type: string ('donation_reminder', 'transfusion_reminder', 'system_alert', etc.)
  isRead: boolean (has user seen this?)
  createdAt: timestamp
}
```
**Usage**: Notification bell in navigation, reminder system, user communication

#### `emergency_requests` - Urgent blood requests
**Purpose**: Handle critical blood shortage situations
```typescript
{
  id: string (UUID, primary key)
  patientId: string (foreign key to patients.id)
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical'
  unitsNeeded: number
  notes: string
  status: string (default 'pending')
  createdAt: timestamp
}