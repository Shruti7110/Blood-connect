
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types (enums)
CREATE TYPE user_role AS ENUM ('patient', 'donor', 'healthcare_provider');
CREATE TYPE blood_group AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');
CREATE TYPE urgency_level AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE appointment_status AS ENUM ('scheduled', 'completed', 'cancelled', 'missed');

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role user_role NOT NULL,
    name TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    blood_group blood_group,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create patients table
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    
    -- Basic patient info
    date_of_birth TIMESTAMP WITH TIME ZONE,
    weight TEXT,
    diagnosis TEXT,
    thalassemia_type TEXT,
    
    -- Current clinical status
    recent_pre_transfusion_hb TEXT,
    symptoms_between_transfusions TEXT,
    poor_growth_history BOOLEAN DEFAULT FALSE,
    bone_deformities BOOLEAN DEFAULT FALSE,
    recurrent_infections BOOLEAN DEFAULT FALSE,
    organ_issues_history TEXT,
    
    -- Transfusion history
    transfusion_frequency_past_6_months TEXT,
    units_per_session INTEGER,
    usual_transfusion_hb_level TEXT,
    recent_interval_changes TEXT,
    
    -- Iron overload and chelation
    iron_chelation_therapy TEXT,
    chelation_medication TEXT,
    chelation_frequency TEXT,
    last_serum_ferritin TEXT,
    last_liver_iron_measurement TEXT,
    adverse_reactions_history TEXT,
    
    -- Manual frequency override
    manual_transfusion_frequency TEXT,
    
    -- Existing fields
    transfusion_history JSONB DEFAULT '[]',
    next_transfusion_date TIMESTAMP WITH TIME ZONE,
    hemoglobin_level TEXT,
    iron_levels TEXT,
    last_transfusion TIMESTAMP WITH TIME ZONE,
    total_transfusions INTEGER DEFAULT 0
);

-- Create donors table
CREATE TABLE donors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    eligibility_status BOOLEAN DEFAULT TRUE,
    last_donation TIMESTAMP WITH TIME ZONE,
    total_donations INTEGER DEFAULT 0,
    available_for_donation BOOLEAN DEFAULT TRUE,
    donation_history JSONB DEFAULT '[]'
);

-- Create healthcare_providers table
CREATE TABLE healthcare_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    hospital_name TEXT,
    department TEXT,
    license_number TEXT
);

-- Create donor_families table
CREATE TABLE donor_families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    donor_id UUID REFERENCES donors(id) NOT NULL,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create transfusions table
CREATE TABLE transfusions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    donor_id UUID REFERENCES donors(id),
    provider_id UUID REFERENCES healthcare_providers(id),
    scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
    completed_date TIMESTAMP WITH TIME ZONE,
    status appointment_status DEFAULT 'scheduled',
    units_required INTEGER DEFAULT 1,
    location TEXT,
    notes TEXT
);

-- Create notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create emergency_requests table
CREATE TABLE emergency_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID REFERENCES patients(id) NOT NULL,
    urgency_level urgency_level NOT NULL,
    units_needed INTEGER NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_blood_group ON users(blood_group);
CREATE INDEX idx_patients_user_id ON patients(user_id);
CREATE INDEX idx_donors_user_id ON donors(user_id);
CREATE INDEX idx_healthcare_providers_user_id ON healthcare_providers(user_id);
CREATE INDEX idx_transfusions_patient_id ON transfusions(patient_id);
CREATE INDEX idx_transfusions_donor_id ON transfusions(donor_id);
CREATE INDEX idx_transfusions_scheduled_date ON transfusions(scheduled_date);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_emergency_requests_patient_id ON emergency_requests(patient_id);
CREATE INDEX idx_donor_families_patient_id ON donor_families(patient_id);
CREATE INDEX idx_donor_families_donor_id ON donor_families(donor_id);

-- Enable Row Level Security (RLS) for better security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE healthcare_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE transfusions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE emergency_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE donor_families ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (you can customize these based on your security requirements)
CREATE POLICY "Users can view their own data" ON users FOR SELECT USING (auth.uid() = id::text);
CREATE POLICY "Users can update their own data" ON users FOR UPDATE USING (auth.uid() = id::text);

CREATE POLICY "Patients can view their own data" ON patients FOR SELECT USING (auth.uid() = user_id::text);
CREATE POLICY "Patients can update their own data" ON patients FOR UPDATE USING (auth.uid() = user_id::text);

CREATE POLICY "Donors can view their own data" ON donors FOR SELECT USING (auth.uid() = user_id::text);
CREATE POLICY "Donors can update their own data" ON donors FOR UPDATE USING (auth.uid() = user_id::text);

CREATE POLICY "Healthcare providers can view their own data" ON healthcare_providers FOR SELECT USING (auth.uid() = user_id::text);
CREATE POLICY "Healthcare providers can update their own data" ON healthcare_providers FOR UPDATE USING (auth.uid() = user_id::text);
