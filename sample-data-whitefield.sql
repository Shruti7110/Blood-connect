
-- Sample data for Whitefield, Bangalore region
-- This includes 30 donors, 2 patients, 2 healthcare providers, 3 emergency requests, and 2 months of donation history

-- Insert Users (30 donors + 2 patients + 2 healthcare providers)
INSERT INTO users (id, email, password, role, name, phone, location, blood_group, created_at) VALUES
-- Donors (30)
('d1', 'donor1@email.com', 'password123', 'donor', 'Rajesh Kumar', '+91-9876543210', 'Whitefield, Bangalore', 'O+', '2024-01-01 10:00:00'),
('d2', 'donor2@email.com', 'password123', 'donor', 'Priya Sharma', '+91-9876543211', 'Whitefield, Bangalore', 'A+', '2024-01-01 10:00:00'),
('d3', 'donor3@email.com', 'password123', 'donor', 'Amit Singh', '+91-9876543212', 'Whitefield, Bangalore', 'B+', '2024-01-01 10:00:00'),
('d4', 'donor4@email.com', 'password123', 'donor', 'Sneha Reddy', '+91-9876543213', 'Whitefield, Bangalore', 'AB+', '2024-01-01 10:00:00'),
('d5', 'donor5@email.com', 'password123', 'donor', 'Vikram Patel', '+91-9876543214', 'Whitefield, Bangalore', 'O-', '2024-01-01 10:00:00'),
('d6', 'donor6@email.com', 'password123', 'donor', 'Kavya Nair', '+91-9876543215', 'Whitefield, Bangalore', 'A-', '2024-01-01 10:00:00'),
('d7', 'donor7@email.com', 'password123', 'donor', 'Ravi Gupta', '+91-9876543216', 'Whitefield, Bangalore', 'B-', '2024-01-01 10:00:00'),
('d8', 'donor8@email.com', 'password123', 'donor', 'Deepika Joshi', '+91-9876543217', 'Whitefield, Bangalore', 'AB-', '2024-01-01 10:00:00'),
('d9', 'donor9@email.com', 'password123', 'donor', 'Arjun Menon', '+91-9876543218', 'Whitefield, Bangalore', 'O+', '2024-01-01 10:00:00'),
('d10', 'donor10@email.com', 'password123', 'donor', 'Pooja Agarwal', '+91-9876543219', 'Whitefield, Bangalore', 'A+', '2024-01-01 10:00:00'),
('d11', 'donor11@email.com', 'password123', 'donor', 'Suresh Babu', '+91-9876543220', 'Whitefield, Bangalore', 'B+', '2024-01-01 10:00:00'),
('d12', 'donor12@email.com', 'password123', 'donor', 'Lakshmi Iyer', '+91-9876543221', 'Whitefield, Bangalore', 'O+', '2024-01-01 10:00:00'),
('d13', 'donor13@email.com', 'password123', 'donor', 'Kiran Kumar', '+91-9876543222', 'Whitefield, Bangalore', 'A+', '2024-01-01 10:00:00'),
('d14', 'donor14@email.com', 'password123', 'donor', 'Meera Krishnan', '+91-9876543223', 'Whitefield, Bangalore', 'B+', '2024-01-01 10:00:00'),
('d15', 'donor15@email.com', 'password123', 'donor', 'Anil Varma', '+91-9876543224', 'Whitefield, Bangalore', 'AB+', '2024-01-01 10:00:00'),
('d16', 'donor16@email.com', 'password123', 'donor', 'Rashmi Shetty', '+91-9876543225', 'Whitefield, Bangalore', 'O-', '2024-01-01 10:00:00'),
('d17', 'donor17@email.com', 'password123', 'donor', 'Mahesh Rao', '+91-9876543226', 'Whitefield, Bangalore', 'A-', '2024-01-01 10:00:00'),
('d18', 'donor18@email.com', 'password123', 'donor', 'Divya Bhat', '+91-9876543227', 'Whitefield, Bangalore', 'B-', '2024-01-01 10:00:00'),
('d19', 'donor19@email.com', 'password123', 'donor', 'Santosh Pillai', '+91-9876543228', 'Whitefield, Bangalore', 'O+', '2024-01-01 10:00:00'),
('d20', 'donor20@email.com', 'password123', 'donor', 'Nisha Jain', '+91-9876543229', 'Whitefield, Bangalore', 'A+', '2024-01-01 10:00:00'),
('d21', 'donor21@email.com', 'password123', 'donor', 'Prakash Desai', '+91-9876543230', 'Whitefield, Bangalore', 'B+', '2024-01-01 10:00:00'),
('d22', 'donor22@email.com', 'password123', 'donor', 'Geetha Murthy', '+91-9876543231', 'Whitefield, Bangalore', 'AB+', '2024-01-01 10:00:00'),
('d23', 'donor23@email.com', 'password123', 'donor', 'Sunil Chandra', '+91-9876543232', 'Whitefield, Bangalore', 'O+', '2024-01-01 10:00:00'),
('d24', 'donor24@email.com', 'password123', 'donor', 'Anjali Hegde', '+91-9876543233', 'Whitefield, Bangalore', 'A+', '2024-01-01 10:00:00'),
('d25', 'donor25@email.com', 'password123', 'donor', 'Ramesh Kamath', '+91-9876543234', 'Whitefield, Bangalore', 'B+', '2024-01-01 10:00:00'),
('d26', 'donor26@email.com', 'password123', 'donor', 'Shilpa Yadav', '+91-9876543235', 'Whitefield, Bangalore', 'O-', '2024-01-01 10:00:00'),
('d27', 'donor27@email.com', 'password123', 'donor', 'Harish Gowda', '+91-9876543236', 'Whitefield, Bangalore', 'A-', '2024-01-01 10:00:00'),
('d28', 'donor28@email.com', 'password123', 'donor', 'Sowmya Raj', '+91-9876543237', 'Whitefield, Bangalore', 'B-', '2024-01-01 10:00:00'),
('d29', 'donor29@email.com', 'password123', 'donor', 'Venkat Reddy', '+91-9876543238', 'Whitefield, Bangalore', 'AB-', '2024-01-01 10:00:00'),
('d30', 'donor30@email.com', 'password123', 'donor', 'Manjula Das', '+91-9876543239', 'Whitefield, Bangalore', 'O+', '2024-01-01 10:00:00'),

-- Patients (2)
('p1', 'patient1@email.com', 'password123', 'patient', 'Aryan Malhotra', '+91-9876543240', 'Whitefield, Bangalore', 'B+', '2024-01-01 10:00:00'),
('p2', 'patient2@email.com', 'password123', 'patient', 'Sia Kapoor', '+91-9876543241', 'Whitefield, Bangalore', 'A+', '2024-01-01 10:00:00'),

-- Healthcare Providers (2)
('h1', 'doctor1@email.com', 'password123', 'healthcare_provider', 'Dr. Rohit Sharma', '+91-9876543242', 'Whitefield, Bangalore', NULL, '2024-01-01 10:00:00'),
('h2', 'doctor2@email.com', 'password123', 'healthcare_provider', 'Dr. Sunita Rao', '+91-9876543243', 'Whitefield, Bangalore', NULL, '2024-01-01 10:00:00');

-- Insert Donors
INSERT INTO donors (id, user_id, available_for_donation, last_donation_date, total_donations, health_status, created_at) VALUES
('donor1', 'd1', true, '2024-12-15', 8, 'excellent', '2024-01-01 10:00:00'),
('donor2', 'd2', true, '2024-12-10', 6, 'good', '2024-01-01 10:00:00'),
('donor3', 'd3', true, '2024-12-20', 12, 'excellent', '2024-01-01 10:00:00'),
('donor4', 'd4', false, '2024-12-25', 4, 'good', '2024-01-01 10:00:00'),
('donor5', 'd5', true, '2024-12-05', 15, 'excellent', '2024-01-01 10:00:00'),
('donor6', 'd6', true, '2024-12-18', 7, 'good', '2024-01-01 10:00:00'),
('donor7', 'd7', true, '2024-12-12', 9, 'excellent', '2024-01-01 10:00:00'),
('donor8', 'd8', false, '2024-12-28', 3, 'fair', '2024-01-01 10:00:00'),
('donor9', 'd9', true, '2024-12-08', 11, 'excellent', '2024-01-01 10:00:00'),
('donor10', 'd10', true, '2024-12-22', 5, 'good', '2024-01-01 10:00:00'),
('donor11', 'd11', true, '2024-12-14', 13, 'excellent', '2024-01-01 10:00:00'),
('donor12', 'd12', true, '2024-12-07', 10, 'good', '2024-01-01 10:00:00'),
('donor13', 'd13', false, '2024-12-30', 2, 'fair', '2024-01-01 10:00:00'),
('donor14', 'd14', true, '2024-12-16', 8, 'excellent', '2024-01-01 10:00:00'),
('donor15', 'd15', true, '2024-12-11', 6, 'good', '2024-01-01 10:00:00'),
('donor16', 'd16', true, '2024-12-19', 14, 'excellent', '2024-01-01 10:00:00'),
('donor17', 'd17', true, '2024-12-06', 7, 'good', '2024-01-01 10:00:00'),
('donor18', 'd18', false, '2024-12-27', 3, 'fair', '2024-01-01 10:00:00'),
('donor19', 'd19', true, '2024-12-13', 9, 'excellent', '2024-01-01 10:00:00'),
('donor20', 'd20', true, '2024-12-21', 5, 'good', '2024-01-01 10:00:00'),
('donor21', 'd21', true, '2024-12-09', 11, 'excellent', '2024-01-01 10:00:00'),
('donor22', 'd22', true, '2024-12-17', 6, 'good', '2024-01-01 10:00:00'),
('donor23', 'd23', false, '2024-12-26', 4, 'fair', '2024-01-01 10:00:00'),
('donor24', 'd24', true, '2024-12-04', 12, 'excellent', '2024-01-01 10:00:00'),
('donor25', 'd25', true, '2024-12-23', 8, 'good', '2024-01-01 10:00:00'),
('donor26', 'd26', true, '2024-12-01', 16, 'excellent', '2024-01-01 10:00:00'),
('donor27', 'd27', true, '2024-12-24', 5, 'good', '2024-01-01 10:00:00'),
('donor28', 'd28', false, '2024-12-29', 2, 'fair', '2024-01-01 10:00:00'),
('donor29', 'd29', true, '2024-12-03', 10, 'excellent', '2024-01-01 10:00:00'),
('donor30', 'd30', true, '2024-12-02', 13, 'good', '2024-01-01 10:00:00');

-- Insert Patients with detailed thalassemia information
INSERT INTO patients (id, user_id, thalassemia_type, current_hemoglobin, transfusion_frequency, last_transfusion_date, iron_chelation_therapy, serum_ferritin, symptoms_between_transfusions, poor_growth, bone_deformities, recurrent_infections, organ_issues, transfusion_interval_change, chelation_medication, chelation_regularity, adverse_reactions, created_at) VALUES
('patient1', 'p1', 'beta_thalassemia_major', 8.5, 'every_3_weeks', '2024-12-20', true, 2500, 'mild_fatigue', false, false, false, 'mild_spleen_enlargement', false, 'deferasirox', 'daily', false, '2024-01-01 10:00:00'),
('patient2', 'p2', 'hbe_beta_thalassemia', 9.2, 'every_4_weeks', '2024-12-18', true, 1800, 'shortness_of_breath', false, false, true, 'liver_iron_overload', false, 'deferiprone', 'daily', false, '2024-01-01 10:00:00');

-- Insert Healthcare Providers
INSERT INTO healthcare_providers (id, user_id, specialization, license_number, hospital_affiliation, years_of_experience, created_at) VALUES
('provider1', 'h1', 'Hematology', 'KMC12345', 'Manipal Hospital Whitefield', 12, '2024-01-01 10:00:00'),
('provider2', 'h2', 'Pediatric Hematology', 'BMCRI67890', 'Narayana Health City', 8, '2024-01-01 10:00:00');

-- Insert 2 months of transfusion history
INSERT INTO transfusions (id, patient_id, donor_id, provider_id, scheduled_date, actual_date, blood_type, units_transfused, pre_transfusion_hb, post_transfusion_hb, location, status, notes, created_at) VALUES
-- November 2024 transfusions
('t1', 'patient1', 'donor3', 'provider1', '2024-11-01', '2024-11-01', 'B+', 2, 7.8, 11.2, 'Manipal Hospital Whitefield', 'completed', 'Routine transfusion, no complications', '2024-11-01 09:00:00'),
('t2', 'patient2', 'donor2', 'provider2', '2024-11-02', '2024-11-02', 'A+', 2, 8.1, 11.5, 'Narayana Health City', 'completed', 'Patient tolerated well', '2024-11-02 10:00:00'),
('t3', 'patient1', 'donor11', 'provider1', '2024-11-22', '2024-11-22', 'B+', 2, 8.2, 11.8, 'Manipal Hospital Whitefield', 'completed', 'Good response', '2024-11-22 09:30:00'),
('t4', 'patient2', 'donor10', 'provider2', '2024-11-25', '2024-11-25', 'A+', 2, 7.9, 11.3, 'Narayana Health City', 'completed', 'Routine procedure', '2024-11-25 11:00:00'),

-- December 2024 transfusions
('t5', 'patient1', 'donor14', 'provider1', '2024-12-13', '2024-12-13', 'B+', 2, 8.0, 11.6, 'Manipal Hospital Whitefield', 'completed', 'No adverse reactions', '2024-12-13 09:15:00'),
('t6', 'patient2', 'donor20', 'provider2', '2024-12-16', '2024-12-16', 'A+', 2, 8.3, 11.7, 'Narayana Health City', 'completed', 'Patient feeling better', '2024-12-16 10:30:00'),

-- January 2025 scheduled transfusions
('t7', 'patient1', 'donor25', 'provider1', '2025-01-03', NULL, 'B+', 2, NULL, NULL, 'Manipal Hospital Whitefield', 'scheduled', 'Routine follow-up', '2024-12-20 10:00:00'),
('t8', 'patient2', 'donor24', 'provider2', '2025-01-06', NULL, 'A+', 2, NULL, NULL, 'Narayana Health City', 'scheduled', 'Regular transfusion', '2024-12-18 11:00:00');

-- Insert Donor Family assignments
INSERT INTO donor_families (id, patient_id, donor_id, relationship, is_active, created_at) VALUES
('df1', 'patient1', 'donor3', 'regular_donor', true, '2024-01-01 10:00:00'),
('df2', 'patient1', 'donor11', 'regular_donor', true, '2024-02-01 10:00:00'),
('df3', 'patient1', 'donor14', 'regular_donor', true, '2024-03-01 10:00:00'),
('df4', 'patient1', 'donor25', 'regular_donor', true, '2024-04-01 10:00:00'),
('df5', 'patient2', 'donor2', 'regular_donor', true, '2024-01-01 10:00:00'),
('df6', 'patient2', 'donor10', 'regular_donor', true, '2024-02-01 10:00:00'),
('df7', 'patient2', 'donor20', 'regular_donor', true, '2024-03-01 10:00:00'),
('df8', 'patient2', 'donor24', 'regular_donor', true, '2024-04-01 10:00:00');

-- Insert Emergency Requests (3 blood banks)
INSERT INTO emergency_requests (id, patient_id, blood_group, units_needed, urgency_level, location, contact_info, medical_condition, status, created_at, updated_at) VALUES
('er1', 'patient1', 'B+', 4, 'urgent', 'Manipal Hospital Whitefield, Bangalore', '+91-9876543242', 'Severe anemia due to delayed transfusion', 'fulfilled', '2024-12-15 14:30:00', '2024-12-15 18:45:00'),
('er2', 'patient2', 'A+', 2, 'moderate', 'Narayana Health City, Bangalore', '+91-9876543243', 'Routine emergency backup', 'fulfilled', '2024-12-10 09:15:00', '2024-12-10 11:30:00'),
('er3', 'patient1', 'B+', 3, 'high', 'Apollo Hospital Whitefield, Bangalore', '+91-9876543244', 'Pre-surgical requirement', 'pending', '2024-12-28 16:20:00', '2024-12-28 16:20:00');

-- Insert Notifications
INSERT INTO notifications (id, user_id, title, message, type, is_read, created_at) VALUES
('n1', 'p1', 'Transfusion Reminder', 'Your next transfusion is scheduled for January 3, 2025', 'reminder', false, '2024-12-30 09:00:00'),
('n2', 'p2', 'Lab Results Available', 'Your latest hemoglobin results are ready for review', 'info', false, '2024-12-29 14:30:00'),
('n3', 'd1', 'Donation Appreciation', 'Thank you for your recent blood donation. You have helped save lives!', 'appreciation', true, '2024-12-16 10:00:00'),
('n4', 'd2', 'Donation Reminder', 'You are eligible to donate blood again. Next donation date: January 10, 2025', 'reminder', false, '2024-12-31 08:00:00'),
('n5', 'h1', 'Patient Update', 'Patient Aryan Malhotra has completed transfusion successfully', 'update', true, '2024-12-13 15:30:00'),
('n6', 'p1', 'Emergency Request Fulfilled', 'Your emergency blood request has been fulfilled successfully', 'success', true, '2024-12-15 18:45:00');

-- Insert some additional historical donation records for better data
INSERT INTO transfusions (id, patient_id, donor_id, provider_id, scheduled_date, actual_date, blood_type, units_transfused, pre_transfusion_hb, post_transfusion_hb, location, status, notes, created_at) VALUES
-- October 2024 transfusions
('t9', 'patient1', 'donor21', 'provider1', '2024-10-04', '2024-10-04', 'B+', 2, 7.5, 11.1, 'Manipal Hospital Whitefield', 'completed', 'Routine transfusion', '2024-10-04 09:00:00'),
('t10', 'patient2', 'donor13', 'provider2', '2024-10-07', '2024-10-07', 'A+', 2, 8.0, 11.4, 'Narayana Health City', 'completed', 'Good tolerance', '2024-10-07 10:00:00'),
('t11', 'patient1', 'donor9', 'provider1', '2024-10-25', '2024-10-25', 'B+', 2, 8.1, 11.7, 'Manipal Hospital Whitefield', 'completed', 'No complications', '2024-10-25 09:30:00'),
('t12', 'patient2', 'donor6', 'provider2', '2024-10-28', '2024-10-28', 'A+', 2, 7.8, 11.2, 'Narayana Health City', 'completed', 'Patient stable', '2024-10-28 11:00:00');
