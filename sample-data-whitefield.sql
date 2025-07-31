

-- Sample data for Whitefield, Bangalore region
-- This includes 30 donors, 2 patients, 2 healthcare providers, 3 emergency requests, and 2 months of donation history

-- Insert Users (30 donors + 2 patients + 2 healthcare providers)
WITH user_inserts AS (
  INSERT INTO users (email, password, role, name, phone, location, blood_group, created_at) VALUES
  -- Donors (30)
  ('donor1@email.com', 'password123', 'donor', 'Rajesh Kumar', '+91-9876543210', 'Whitefield, Bangalore', 'O+', '2024-01-01 10:00:00'),
  ('donor2@email.com', 'password123', 'donor', 'Priya Sharma', '+91-9876543211', 'Whitefield, Bangalore', 'A+', '2024-01-01 10:00:00'),
  ('donor3@email.com', 'password123', 'donor', 'Amit Singh', '+91-9876543212', 'Whitefield, Bangalore', 'B+', '2024-01-01 10:00:00'),
  ('donor4@email.com', 'password123', 'donor', 'Sneha Reddy', '+91-9876543213', 'Whitefield, Bangalore', 'AB+', '2024-01-01 10:00:00'),
  ('donor5@email.com', 'password123', 'donor', 'Vikram Patel', '+91-9876543214', 'Whitefield, Bangalore', 'O-', '2024-01-01 10:00:00'),
  ('donor6@email.com', 'password123', 'donor', 'Kavya Nair', '+91-9876543215', 'Whitefield, Bangalore', 'A-', '2024-01-01 10:00:00'),
  ('donor7@email.com', 'password123', 'donor', 'Ravi Gupta', '+91-9876543216', 'Whitefield, Bangalore', 'B-', '2024-01-01 10:00:00'),
  ('donor8@email.com', 'password123', 'donor', 'Deepika Joshi', '+91-9876543217', 'Whitefield, Bangalore', 'AB-', '2024-01-01 10:00:00'),
  ('donor9@email.com', 'password123', 'donor', 'Arjun Menon', '+91-9876543218', 'Whitefield, Bangalore', 'O+', '2024-01-01 10:00:00'),
  ('donor10@email.com', 'password123', 'donor', 'Pooja Agarwal', '+91-9876543219', 'Whitefield, Bangalore', 'A+', '2024-01-01 10:00:00'),
  ('donor11@email.com', 'password123', 'donor', 'Suresh Babu', '+91-9876543220', 'Whitefield, Bangalore', 'B+', '2024-01-01 10:00:00'),
  ('donor12@email.com', 'password123', 'donor', 'Lakshmi Iyer', '+91-9876543221', 'Whitefield, Bangalore', 'O+', '2024-01-01 10:00:00'),
  ('donor13@email.com', 'password123', 'donor', 'Kiran Kumar', '+91-9876543222', 'Whitefield, Bangalore', 'A+', '2024-01-01 10:00:00'),
  ('donor14@email.com', 'password123', 'donor', 'Meera Krishnan', '+91-9876543223', 'Whitefield, Bangalore', 'B+', '2024-01-01 10:00:00'),
  ('donor15@email.com', 'password123', 'donor', 'Anil Varma', '+91-9876543224', 'Whitefield, Bangalore', 'AB+', '2024-01-01 10:00:00'),
  ('donor16@email.com', 'password123', 'donor', 'Rashmi Shetty', '+91-9876543225', 'Whitefield, Bangalore', 'O-', '2024-01-01 10:00:00'),
  ('donor17@email.com', 'password123', 'donor', 'Mahesh Rao', '+91-9876543226', 'Whitefield, Bangalore', 'A-', '2024-01-01 10:00:00'),
  ('donor18@email.com', 'password123', 'donor', 'Divya Bhat', '+91-9876543227', 'Whitefield, Bangalore', 'B-', '2024-01-01 10:00:00'),
  ('donor19@email.com', 'password123', 'donor', 'Santosh Pillai', '+91-9876543228', 'Whitefield, Bangalore', 'O+', '2024-01-01 10:00:00'),
  ('donor20@email.com', 'password123', 'donor', 'Nisha Jain', '+91-9876543229', 'Whitefield, Bangalore', 'A+', '2024-01-01 10:00:00'),
  ('donor21@email.com', 'password123', 'donor', 'Prakash Desai', '+91-9876543230', 'Whitefield, Bangalore', 'B+', '2024-01-01 10:00:00'),
  ('donor22@email.com', 'password123', 'donor', 'Geetha Murthy', '+91-9876543231', 'Whitefield, Bangalore', 'AB+', '2024-01-01 10:00:00'),
  ('donor23@email.com', 'password123', 'donor', 'Sunil Chandra', '+91-9876543232', 'Whitefield, Bangalore', 'O+', '2024-01-01 10:00:00'),
  ('donor24@email.com', 'password123', 'donor', 'Anjali Hegde', '+91-9876543233', 'Whitefield, Bangalore', 'A+', '2024-01-01 10:00:00'),
  ('donor25@email.com', 'password123', 'donor', 'Ramesh Kamath', '+91-9876543234', 'Whitefield, Bangalore', 'B+', '2024-01-01 10:00:00'),
  ('donor26@email.com', 'password123', 'donor', 'Shilpa Yadav', '+91-9876543235', 'Whitefield, Bangalore', 'O-', '2024-01-01 10:00:00'),
  ('donor27@email.com', 'password123', 'donor', 'Harish Gowda', '+91-9876543236', 'Whitefield, Bangalore', 'A-', '2024-01-01 10:00:00'),
  ('donor28@email.com', 'password123', 'donor', 'Sowmya Raj', '+91-9876543237', 'Whitefield, Bangalore', 'B-', '2024-01-01 10:00:00'),
  ('donor29@email.com', 'password123', 'donor', 'Venkat Reddy', '+91-9876543238', 'Whitefield, Bangalore', 'AB-', '2024-01-01 10:00:00'),
  ('donor30@email.com', 'password123', 'donor', 'Manjula Das', '+91-9876543239', 'Whitefield, Bangalore', 'O+', '2024-01-01 10:00:00'),
  
  -- Patients (2)
  ('patient1@email.com', 'password123', 'patient', 'Aryan Malhotra', '+91-9876543240', 'Whitefield, Bangalore', 'B+', '2024-01-01 10:00:00'),
  ('patient2@email.com', 'password123', 'patient', 'Sia Kapoor', '+91-9876543241', 'Whitefield, Bangalore', 'A+', '2024-01-01 10:00:00'),
  
  -- Healthcare Providers (2)
  ('doctor1@email.com', 'password123', 'healthcare_provider', 'Dr. Rohit Sharma', '+91-9876543242', 'Whitefield, Bangalore', NULL, '2024-01-01 10:00:00'),
  ('doctor2@email.com', 'password123', 'healthcare_provider', 'Dr. Sunita Rao', '+91-9876543243', 'Whitefield, Bangalore', NULL, '2024-01-01 10:00:00')
  RETURNING id, email, role
)
SELECT * FROM user_inserts;

-- Insert Donors using actual user IDs
INSERT INTO donors (user_id, available_for_donation, last_donation, total_donations, eligibility_status)
SELECT 
  u.id,
  CASE 
    WHEN u.email IN ('donor4@email.com', 'donor8@email.com', 'donor13@email.com', 'donor18@email.com', 'donor23@email.com', 'donor28@email.com') THEN false
    ELSE true
  END as available_for_donation,
  CASE 
    WHEN u.email = 'donor1@email.com' THEN '2024-12-15'::timestamp
    WHEN u.email = 'donor2@email.com' THEN '2024-12-10'::timestamp
    WHEN u.email = 'donor3@email.com' THEN '2024-12-20'::timestamp
    WHEN u.email = 'donor4@email.com' THEN '2024-12-25'::timestamp
    WHEN u.email = 'donor5@email.com' THEN '2024-12-05'::timestamp
    ELSE ('2024-12-' || LPAD((ROW_NUMBER() OVER () % 28 + 1)::text, 2, '0'))::timestamp
  END as last_donation,
  (ROW_NUMBER() OVER () % 15 + 2) as total_donations,
  true as eligibility_status
FROM users u 
WHERE u.role = 'donor';

-- Insert Patients with detailed thalassemia information
INSERT INTO patients (user_id, thalassemia_type, hemoglobin_level, manual_transfusion_frequency, last_transfusion, iron_levels, symptoms_between_transfusions, poor_growth_history, bone_deformities, recurrent_infections, organ_issues_history, iron_chelation_therapy, chelation_medication, chelation_frequency, last_serum_ferritin, adverse_reactions_history)
SELECT 
  u.id,
  CASE 
    WHEN u.email = 'patient1@email.com' THEN 'beta_thalassemia_major'
    WHEN u.email = 'patient2@email.com' THEN 'hbe_beta_thalassemia'
  END as thalassemia_type,
  CASE 
    WHEN u.email = 'patient1@email.com' THEN '8.5'
    WHEN u.email = 'patient2@email.com' THEN '9.2'
  END as hemoglobin_level,
  CASE 
    WHEN u.email = 'patient1@email.com' THEN 'every_3_weeks'
    WHEN u.email = 'patient2@email.com' THEN 'every_4_weeks'
  END as manual_transfusion_frequency,
  CASE 
    WHEN u.email = 'patient1@email.com' THEN '2024-12-20'::timestamp
    WHEN u.email = 'patient2@email.com' THEN '2024-12-18'::timestamp
  END as last_transfusion,
  CASE 
    WHEN u.email = 'patient1@email.com' THEN '2500'
    WHEN u.email = 'patient2@email.com' THEN '1800'
  END as iron_levels,
  CASE 
    WHEN u.email = 'patient1@email.com' THEN 'mild_fatigue'
    WHEN u.email = 'patient2@email.com' THEN 'shortness_of_breath'
  END as symptoms_between_transfusions,
  false as poor_growth_history,
  false as bone_deformities,
  CASE 
    WHEN u.email = 'patient1@email.com' THEN false
    WHEN u.email = 'patient2@email.com' THEN true
  END as recurrent_infections,
  CASE 
    WHEN u.email = 'patient1@email.com' THEN 'mild_spleen_enlargement'
    WHEN u.email = 'patient2@email.com' THEN 'liver_iron_overload'
  END as organ_issues_history,
  'yes' as iron_chelation_therapy,
  CASE 
    WHEN u.email = 'patient1@email.com' THEN 'deferasirox'
    WHEN u.email = 'patient2@email.com' THEN 'deferiprone'
  END as chelation_medication,
  'daily' as chelation_frequency,
  CASE 
    WHEN u.email = 'patient1@email.com' THEN '2500'
    WHEN u.email = 'patient2@email.com' THEN '1800'
  END as last_serum_ferritin,
  'none' as adverse_reactions_history
FROM users u 
WHERE u.role = 'patient';

-- Insert Healthcare Providers
INSERT INTO healthcare_providers (user_id, hospital_name, department, license_number)
SELECT 
  u.id,
  CASE 
    WHEN u.email = 'doctor1@email.com' THEN 'Manipal Hospital Whitefield'
    WHEN u.email = 'doctor2@email.com' THEN 'Narayana Health City'
  END as hospital_name,
  CASE 
    WHEN u.email = 'doctor1@email.com' THEN 'Hematology'
    WHEN u.email = 'doctor2@email.com' THEN 'Pediatric Hematology'
  END as department,
  CASE 
    WHEN u.email = 'doctor1@email.com' THEN 'KMC12345'
    WHEN u.email = 'doctor2@email.com' THEN 'BMCRI67890'
  END as license_number
FROM users u 
WHERE u.role = 'healthcare_provider';

-- Insert Transfusions with proper relationships
WITH patient_donor_pairs AS (
  SELECT 
    p.id as patient_id,
    p.user_id as patient_user_id,
    d.id as donor_id,
    h.id as provider_id,
    ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY d.id) as rn
  FROM patients p
  CROSS JOIN donors d
  JOIN users du ON d.user_id = du.id
  JOIN users pu ON p.user_id = pu.id
  CROSS JOIN healthcare_providers h
  WHERE (pu.blood_group = du.blood_group OR 
         (pu.blood_group IN ('A+', 'A-') AND du.blood_group IN ('A+', 'A-', 'O+', 'O-')) OR
         (pu.blood_group IN ('B+', 'B-') AND du.blood_group IN ('B+', 'B-', 'O+', 'O-')) OR
         (pu.blood_group IN ('AB+', 'AB-') AND du.blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')))
)
INSERT INTO transfusions (patient_id, donor_id, provider_id, scheduled_date, completed_date, status, units_required, location, notes)
SELECT 
  patient_id,
  donor_id,
  provider_id,
  '2024-11-01'::timestamp + (rn * interval '3 weeks') as scheduled_date,
  '2024-11-01'::timestamp + (rn * interval '3 weeks') as completed_date,
  'completed' as status,
  2 as units_required,
  'Manipal Hospital Whitefield' as location,
  'Routine transfusion, no complications' as notes
FROM patient_donor_pairs
WHERE rn <= 6;

-- Insert Emergency Requests
INSERT INTO emergency_requests (patient_id, urgency_level, units_needed, notes, status)
SELECT 
  p.id,
  CASE 
    WHEN ROW_NUMBER() OVER () = 1 THEN 'high'::urgency_level
    WHEN ROW_NUMBER() OVER () = 2 THEN 'medium'::urgency_level
    ELSE 'critical'::urgency_level
  END as urgency_level,
  CASE 
    WHEN ROW_NUMBER() OVER () = 1 THEN 4
    WHEN ROW_NUMBER() OVER () = 2 THEN 2
    ELSE 3
  END as units_needed,
  CASE 
    WHEN ROW_NUMBER() OVER () = 1 THEN 'Severe anemia due to delayed transfusion'
    WHEN ROW_NUMBER() OVER () = 2 THEN 'Routine emergency backup'
    ELSE 'Pre-surgical requirement'
  END as notes,
  CASE 
    WHEN ROW_NUMBER() OVER () <= 2 THEN 'fulfilled'
    ELSE 'pending'
  END as status
FROM patients p;

-- Insert Donor Family assignments
INSERT INTO donor_families (patient_id, donor_id, is_active)
SELECT DISTINCT
  p.id as patient_id,
  d.id as donor_id,
  true as is_active
FROM patients p
CROSS JOIN donors d
JOIN users du ON d.user_id = du.id
JOIN users pu ON p.user_id = pu.id
WHERE (pu.blood_group = du.blood_group OR 
       (pu.blood_group IN ('A+', 'A-') AND du.blood_group IN ('A+', 'A-', 'O+', 'O-')) OR
       (pu.blood_group IN ('B+', 'B-') AND du.blood_group IN ('B+', 'B-', 'O+', 'O-')) OR
       (pu.blood_group IN ('AB+', 'AB-') AND du.blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')))
AND ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY d.id) <= 4;

-- Insert Notifications
INSERT INTO notifications (user_id, title, message, type, is_read)
SELECT 
  u.id,
  CASE 
    WHEN u.role = 'patient' THEN 'Transfusion Reminder'
    WHEN u.role = 'donor' THEN 'Donation Appreciation'
    ELSE 'Patient Update'
  END as title,
  CASE 
    WHEN u.role = 'patient' THEN 'Your next transfusion is scheduled for January 3, 2025'
    WHEN u.role = 'donor' THEN 'Thank you for your recent blood donation. You have helped save lives!'
    ELSE 'Patient has completed transfusion successfully'
  END as message,
  CASE 
    WHEN u.role = 'patient' THEN 'reminder'
    WHEN u.role = 'donor' THEN 'appreciation'
    ELSE 'update'
  END as type,
  CASE WHEN ROW_NUMBER() OVER () % 3 = 0 THEN true ELSE false END as is_read
FROM users u
LIMIT 20;

