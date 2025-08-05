import { type User, type InsertUser, type Patient, type InsertPatient, type Donor, type InsertDonor, type HealthcareProvider, type InsertHealthcareProvider, type PatientTransfusion, type InsertPatientTransfusion, type Notification, type InsertNotification, type EmergencyRequest, type InsertEmergencyRequest, type DonorFamily } from "@shared/schema";
import { supabase } from './supabase';
import { IStorage } from './storage';

export class SupabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) return undefined;
    return data;
  }

  async createUser(user: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(user)
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase createUser error:', error);
      throw new Error(`Failed to create user: ${error?.message || 'Unknown error'}`);
    }
    return data;
  }

  async updateUser(id: string, user: Partial<User>): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .update(user)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.getUser(id);
  }

  // Patient methods
  async getPatient(id: string): Promise<Patient | undefined> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data;
  }

  async getPatientByUserId(userId: string): Promise<Patient | undefined> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      console.error('Error fetching patient by user ID:', error);
      return undefined;
    }

    // Map database column names to expected field names
    const mappedData = {
      ...data,
      userId: data.user_id,
      dateOfBirth: data.date_of_birth,
      thalassemiaType: data.thalassemia_type,
      recentPreTransfusionHb: data.recent_pre_transfusion_hb,
      symptomsBetweenTransfusions: data.symptoms_between_transfusions,
      poorGrowthHistory: data.poor_growth_history,
      boneDeformities: data.bone_deformities,
      recurrentInfections: data.recurrent_infections,
      organIssuesHistory: data.organ_issues_history,
      transfusionFrequencyPast6Months: data.transfusion_frequency_past_6_months,
      unitsPerSession: data.units_per_session,
      usualTransfusionHbLevel: data.usual_transfusion_hb_level,
      recentIntervalChanges: data.recent_interval_changes,
      ironChelationTherapy: data.iron_chelation_therapy,
      chelationMedication: data.chelation_medication,
      chelationFrequency: data.chelation_frequency,
      lastSerumFerritin: data.last_serum_ferritin,
      lastLiverIronMeasurement: data.last_liver_iron_measurement,
      adverseReactionsHistory: data.adverse_reactions_history,
      manualTransfusionFrequency: data.manual_transfusion_frequency,
      transfusionHistory: data.transfusion_history,
      nextTransfusionDate: data.next_transfusion_date,
      hemoglobinLevel: data.hemoglobin_level,
      ironLevels: data.iron_levels,
      lastTransfusion: data.last_transfusion,
      totalTransfusions: data.total_transfusions
    };

    return mappedData;
  }

  async createPatient(patient: InsertPatient): Promise<Patient> {
    // Map camelCase to snake_case for database
    const dbPatient = {
      user_id: patient.userId,
    };

    const { data, error } = await supabase
      .from('patients')
      .insert(dbPatient)
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase createPatient error:', error);
      throw new Error(`Failed to create patient: ${error?.message || 'Unknown error'}`);
    }

    // Map back to camelCase
    return {
      ...data,
      userId: data.user_id
    };
  }

  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient | undefined> {
    // Map camelCase to snake_case for database
    const dbPatient: any = {};

    if (patient.userId !== undefined) dbPatient.user_id = patient.userId;
    if (patient.dateOfBirth !== undefined) dbPatient.date_of_birth = patient.dateOfBirth;
    if (patient.weight !== undefined) dbPatient.weight = patient.weight;
    if (patient.diagnosis !== undefined) dbPatient.diagnosis = patient.diagnosis;
    if (patient.thalassemiaType !== undefined) dbPatient.thalassemia_type = patient.thalassemiaType;
    if (patient.recentPreTransfusionHb !== undefined) dbPatient.recent_pre_transfusion_hb = patient.recentPreTransfusionHb;
    if (patient.symptomsBetweenTransfusions !== undefined) dbPatient.symptoms_between_transfusions = patient.symptomsBetweenTransfusions;
    if (patient.poorGrowthHistory !== undefined) dbPatient.poor_growth_history = patient.poorGrowthHistory;
    if (patient.boneDeformities !== undefined) dbPatient.bone_deformities = patient.boneDeformities;
    if (patient.recurrentInfections !== undefined) dbPatient.recurrent_infections = patient.recurrentInfections;
    if (patient.organIssuesHistory !== undefined) dbPatient.organ_issues_history = patient.organIssuesHistory;
    if (patient.transfusionFrequencyPast6Months !== undefined) dbPatient.transfusion_frequency_past_6_months = patient.transfusionFrequencyPast6Months;
    if (patient.unitsPerSession !== undefined) dbPatient.units_per_session = patient.unitsPerSession;
    if (patient.usualTransfusionHbLevel !== undefined) dbPatient.usual_transfusion_hb_level = patient.usualTransfusionHbLevel;
    if (patient.recentIntervalChanges !== undefined) dbPatient.recent_interval_changes = patient.recentIntervalChanges;
    if (patient.ironChelationTherapy !== undefined) dbPatient.iron_chelation_therapy = patient.ironChelationTherapy;
    if (patient.chelationMedication !== undefined) dbPatient.chelation_medication = patient.chelationMedication;
    if (patient.chelationFrequency !== undefined) dbPatient.chelation_frequency = patient.chelationFrequency;
    if (patient.lastSerumFerritin !== undefined) dbPatient.last_serum_ferritin = patient.lastSerumFerritin;
    if (patient.lastLiverIronMeasurement !== undefined) dbPatient.last_liver_iron_measurement = patient.lastLiverIronMeasurement;
    if (patient.adverseReactionsHistory !== undefined) dbPatient.adverse_reactions_history = patient.adverseReactionsHistory;
    if (patient.manualTransfusionFrequency !== undefined) dbPatient.manual_transfusion_frequency = patient.manualTransfusionFrequency;
    if (patient.transfusionHistory !== undefined) dbPatient.transfusion_history = patient.transfusionHistory;
    if (patient.nextTransfusionDate !== undefined) dbPatient.next_transfusion_date = patient.nextTransfusionDate;
    if (patient.hemoglobinLevel !== undefined) dbPatient.hemoglobin_level = patient.hemoglobinLevel;
    if (patient.ironLevels !== undefined) dbPatient.iron_levels = patient.ironLevels;
    if (patient.lastTransfusion !== undefined) dbPatient.last_transfusion = patient.lastTransfusion;
    if (patient.totalTransfusions !== undefined) dbPatient.total_transfusions = patient.totalTransfusions;

    const { data, error } = await supabase
      .from('patients')
      .update(dbPatient)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Error updating patient:', error);
      return undefined;
    }

    // Map back to camelCase
    const mappedData = {
      ...data,
      userId: data.user_id,
      dateOfBirth: data.date_of_birth,
      thalassemiaType: data.thalassemia_type,
      recentPreTransfusionHb: data.recent_pre_transfusion_hb,
      symptomsBetweenTransfusions: data.symptoms_between_transfusions,
      poorGrowthHistory: data.poor_growth_history,
      boneDeformities: data.bone_deformities,
      recurrentInfections: data.recurrent_infections,
      organIssuesHistory: data.organ_issues_history,
      transfusionFrequencyPast6Months: data.transfusion_frequency_past_6_months,
      unitsPerSession: data.units_per_session,
      usualTransfusionHbLevel: data.usual_transfusion_hb_level,
      recentIntervalChanges: data.recent_interval_changes,
      ironChelationTherapy: data.iron_chelation_therapy,
      chelationMedication: data.chelation_medication,
      chelationFrequency: data.chelation_frequency,
      lastSerumFerritin: data.last_serum_ferritin,
      lastLiverIronMeasurement: data.last_liver_iron_measurement,
      adverseReactionsHistory: data.adverse_reactions_history,
      manualTransfusionFrequency: data.manual_transfusion_frequency,
      transfusionHistory: data.transfusion_history,
      nextTransfusionDate: data.next_transfusion_date,
      hemoglobinLevel: data.hemoglobin_level,
      ironLevels: data.iron_levels,
      lastTransfusion: data.last_transfusion,
      totalTransfusions: data.total_transfusions
    };

    return mappedData;
  }

  async getPatients(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*');

    if (error) return [];
    return data || [];
  }

  // Donor methods
  async getDonor(id: string): Promise<Donor | undefined> {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data;
  }

  async getDonorByUserId(userId: string): Promise<Donor | undefined> {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return undefined;
    return data;
  }

  async createDonor(donor: InsertDonor): Promise<Donor> {
    // Map camelCase to snake_case for database
    const dbDonor = {
      user_id: donor.userId,
      eligibility_status: donor.eligibilityStatus || true,
      total_donations: donor.totalDonations || 0,
      available_for_donation: donor.availableForDonation || true
    };

    const { data, error } = await supabase
      .from('donors')
      .insert(dbDonor)
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase createDonor error:', error);
      throw new Error(`Failed to create donor: ${error?.message || 'Unknown error'}`);
    }

    // Map back to camelCase
    return {
      ...data,
      userId: data.user_id,
      eligibilityStatus: data.eligibility_status,
      availableForDonation: data.available_for_donation,
      totalDonations: data.total_donations,
      lastDonation: data.last_donation
    };
  }

  async updateDonor(id: string, donor: Partial<Donor>): Promise<Donor | undefined> {
    const { data, error } = await supabase
      .from('donors')
      .update(donor)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data;
  }

  async getDonorsByBloodGroup(bloodGroup: string): Promise<Donor[]> {
    // Get compatible blood types for the patient's blood group
    const compatibleTypes = this.getCompatibleDonorBloodTypes(bloodGroup);

    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id')
      .in('blood_group', compatibleTypes)
      .eq('role', 'donor');

    if (usersError || !users) return [];

    const userIds = users.map(u => u.id);

    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .in('user_id', userIds);

    if (error) return [];
    return data || [];
  }

  async getAvailableDonors(bloodGroup: string, location?: string): Promise<Donor[]> {
    const compatibleTypes = this.getCompatibleDonorBloodTypes(bloodGroup);

    let query = supabase
      .from('donors')
      .select(`
        *,
        users!inner(id, blood_group, location, role)
      `)
      .eq('users.role', 'donor')
      .eq('available_for_donation', true)
      .in('users.blood_group', compatibleTypes);

    if (location) {
      query = query.eq('users.location', location);
    }

    const { data, error } = await query;

    if (error) return [];
    return data || [];
  }

  private getCompatibleDonorBloodTypes(patientBloodGroup: string): string[] {
    const compatibility: Record<string, string[]> = {
      'O-': ['O-'],
      'O+': ['O-', 'O+'],
      'A-': ['O-', 'A-'],
      'A+': ['O-', 'O+', 'A-', 'A+'],
      'B-': ['O-', 'B-'],
      'B+': ['O-', 'O+', 'B-', 'B+'],
      'AB-': ['O-', 'A-', 'B-', 'AB-'],
      'AB+': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+']
    };

    return compatibility[patientBloodGroup] || [];
  }

  // Healthcare Provider methods
  async getHealthcareProvider(id: string): Promise<HealthcareProvider | undefined> {
    const { data, error } = await supabase
      .from('healthcare_providers')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data;
  }

  async getHealthcareProviderByUserId(userId: string): Promise<HealthcareProvider | undefined> {
    const { data, error } = await supabase
      .from('healthcare_providers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error || !data) return undefined;
    return data;
  }

  async createHealthcareProvider(provider: InsertHealthcareProvider): Promise<HealthcareProvider> {
    // Map camelCase to snake_case for database
    const dbProvider = {
      user_id: provider.userId,
      hospital_name: provider.hospitalName || null,
      department: provider.department || null,
      license_number: provider.licenseNumber || null
    };

    const { data, error } = await supabase
      .from('healthcare_providers')
      .insert(dbProvider)
      .select()
      .single();

    if (error || !data) {
      console.error('Supabase createHealthcareProvider error:', error);
      throw new Error(`Failed to create healthcare provider: ${error?.message || 'Unknown error'}`);
    }

    // Map back to camelCase
    return {
      ...data,
      userId: data.user_id,
      hospitalName: data.hospital_name,
      licenseNumber: data.license_number
    };
  }

  async updateHealthcareProvider(id: string, provider: Partial<HealthcareProvider>): Promise<HealthcareProvider | undefined> {
    const { data, error } = await supabase
      .from('healthcare_providers')
      .update(provider)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data;
  }

  // Donor Donation methods
  async getDonationsByDonorId(donorId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('donors_donations')
      .select('*')
      .eq('donor_id', donorId)
      .order('scheduled_date', { ascending: false });

    if (error) {
      console.error('Error fetching donor donations:', error);
      return [];
    }

    return data || [];
  }

  async updateDonation(id: string, updates: any): Promise<any> {
    const { data, error } = await supabase
      .from('donors_donations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating donation:', error);
      return null;
    }

    return data;
  }

  async createDonation(donation: any): Promise<any> {
    const { data, error } = await supabase
      .from('donors_donations')
      .insert(donation)
      .select()
      .single();

    if (error) {
      console.error('Error creating donation:', error);
      throw error;
    }

    return data;
  }

  async getTransfusionsByDonorId(donorId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('patient_transfusions')
      .select('*')
      .eq('donor_id', donorId)
      .order('scheduled_date', { ascending: false });

    if (error) {
      console.error('Error fetching donor transfusions:', error);
      return [];
    }

    return data || [];
  }

  async getDonorFamiliesByPatientId(patientId: string): Promise<any[]> {
    // Get donor family with all related data in one query
    const { data: familyData, error: familyError } = await supabase
      .from('donor_families')
      .select(`
        *,
        donors!inner (
          *,
          users!inner (*)
        )
      `)
      .eq('patient_id', patientId)
      .eq('is_active', true);

    if (familyError || !familyData) {
      console.error('Error fetching donor family:', familyError);
      return [];
    }

    // Return the data in the expected format
    return familyData.map((item: any) => ({
      id: item.id,
      donor_id: item.donor_id,
      patient_id: item.patient_id,
      assigned_date: item.assigned_date,
      is_active: item.is_active,
      donors: item.donors
    }));
  }

  async getDonorFamiliesByPatientIdLegacy(patientId: string): Promise<DonorFamily[]> {
    // Keep the old method for compatibility
    const { data: familyData, error: familyError } = await supabase
      .from('donor_families')
      .select(`
        *,
        donors!inner (
          *,
          users!inner (*)
        )
      `)
      .eq('patient_id', patientId)
      .eq('is_active', true);

    if (familyError || !familyData) {
      console.error('Error fetching donor family:', familyError);
      return [];
    }

    // Get donation counts for each donor from transfusions table
    const donorIds = familyData.map(f => f.donor_id);
    const { data: donationCounts } = await supabase
      .from('patient_transfusions')
      .select('donor_id, status, scheduled_date')
      .in('donor_id', donorIds);

    // Calculate donation statistics for each donor
    const donorStats: Record<string, any> = {};
    if (donationCounts) {
      donationCounts.forEach((donation: any) => {
        if (!donorStats[donation.donor_id]) {
          donorStats[donation.donor_id] = {
            totalDonations: 0,
            recentDonations: 0,
            lastDonation: null
          };
        }

        if (donation.status === 'completed') {
          donorStats[donation.donor_id].totalDonations++;

          // Count recent donations (within last 3 months)
          const threeMonthsAgo = new Date();
          threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
          if (new Date(donation.scheduled_date) > threeMonthsAgo) {
            donorStats[donation.donor_id].recentDonations++;
          }

          // Track most recent donation
          if (!donorStats[donation.donor_id].lastDonation || 
              new Date(donation.scheduled_date) > new Date(donorStats[donation.donor_id].lastDonation)) {
            donorStats[donation.donor_id].lastDonation = donation.scheduled_date;
          }
        }
      });
    }

    // Map the data to the expected format with calculated statistics
    const familyWithDetails = familyData.map((family: any) => {
      const stats = donorStats[family.donor_id] || { totalDonations: 0, recentDonations: 0, lastDonation: null };
      const availableUnits = Math.max(0, 4 - stats.recentDonations); // Max 4 units, minus recent donations

      return {
        id: family.id,
        patientId: family.patient_id,
        donorId: family.donor_id,
        assignedAt: family.assigned_at,
        isActive: family.is_active,
        donor: {
          ...family.donors,
          userId: family.donors.user_id,
          eligibilityStatus: family.donors.eligibility_status,
          lastDonation: stats.lastDonation,
          totalDonations: stats.totalDonations,
          recentDonations: stats.recentDonations,
          availableUnits: availableUnits,
          availableForDonation: family.donors.available_for_donation && availableUnits > 0,
          donationHistory: family.donors.donation_history
        },
        user: {
          ...family.donors.users,
          bloodGroup: family.donors.users.blood_group,
          createdAt: family.donors.users.created_at
        }
      };
    });

    return familyWithDetails;
  }

  async assignDonorToFamily(patientId: string, donorId: string): Promise<DonorFamily> {
    const { data, error } = await supabase
      .from('donor_families')
      .insert({
        patient_id: patientId,
        donor_id: donorId,
        is_active: true,
        assigned_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error || !data) throw new Error('Failed to assign donor to family');
    return data;
  }

  async removeDonorFromFamily(patientId: string, donorId: string): Promise<void> {
    await supabase
      .from('donor_families')
      .update({ is_active: false })
      .eq('patient_id', patientId)
      .eq('donor_id', donorId);
  }

  // Notification methods
  async getNotification(id: string): Promise<Notification | undefined> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notification)
      .select()
      .single();

    if (error || !data) throw new Error('Failed to create notification');
    return data;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
  }

  // Emergency Request methods
  async getEmergencyRequest(id: string): Promise<EmergencyRequest | undefined> {
    const { data, error } = await supabase
      .from('emergency_requests')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data;
  }

  async createEmergencyRequest(request: InsertEmergencyRequest): Promise<EmergencyRequest> {
    // Map camelCase to snake_case for database
    const dbRequest = {
      patient_id: request.patientId,
      urgency_level: request.urgencyLevel,
      units_needed: request.unitsNeeded,
      notes: request.notes || null,
      status: request.status || 'pending',
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('emergency_requests')
      .insert(dbRequest)
      .select()
      .single();

    if (error || !data) {
      console.error('Emergency request creation error:', error);
      throw new Error('Failed to create emergency request');
    }

    // Map back to camelCase
    return {
      ...data,
      patientId: data.patient_id,
      urgencyLevel: data.urgency_level,
      unitsNeeded: data.units_needed,
      createdAt: data.created_at
    };
  }

  async getEmergencyRequestsByPatient(patientId: string): Promise<EmergencyRequest[]> {
    const { data, error } = await supabase
      .from('emergency_requests')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
  }

  async updateEmergencyRequest(id: string, request: Partial<EmergencyRequest>): Promise<EmergencyRequest | undefined> {
    const { data, error } = await supabase
      .from('emergency_requests')
      .update(request)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data;
  }

  async getAllDonorFamilies(): Promise<DonorFamily[]> {
    const { data, error } = await supabase
      .from('donor_families')
      .select('*')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching all donor families:', error);
      return [];
    }

    return data || [];
  }

  // Transfusion methods
  async getTransfusionsByPatient(patientId: string): Promise<PatientTransfusion[]> {
    const { data, error } = await supabase
      .from('patient_transfusions')
      .select('*')
      .eq('patient_id', patientId)
      .order('scheduled_date', { ascending: false });

    if (error) {
      console.error('Error fetching patient transfusions:', error);
      return [];
    }

    return data || [];
  }

  async createTransfusion(transfusion: InsertPatientTransfusion): Promise<PatientTransfusion> {
    // Map camelCase to snake_case for database
    const dbTransfusion = {
      patient_id: transfusion.patientId,
      donor_id: transfusion.donorId || null,
      provider_id: transfusion.providerId || null,
      scheduled_date: transfusion.scheduledDate,
      status: transfusion.status || 'scheduled',
      units_required: transfusion.unitsRequired || 1,
      location: transfusion.location || null,
      notes: transfusion.notes || null
    };

    const { data, error } = await supabase
      .from('patient_transfusions')
      .insert(dbTransfusion)
      .select()
      .single();

    if (error || !data) {
      console.error('Error creating transfusion:', error);
      throw new Error('Failed to create transfusion');
    }

    // Map back to camelCase
    return {
      ...data,
      patientId: data.patient_id,
      donorId: data.donor_id,
      providerId: data.provider_id,
      scheduledDate: data.scheduled_date,
      completedDate: data.completed_date,
      unitsRequired: data.units_required
    };
  }

  async updateTransfusion(id: string, updates: Partial<PatientTransfusion>): Promise<PatientTransfusion | undefined> {
    // Map camelCase to snake_case for database
    const dbUpdates: any = {};
    if (updates.patientId !== undefined) dbUpdates.patient_id = updates.patientId;
    if (updates.donorId !== undefined) dbUpdates.donor_id = updates.donorId;
    if (updates.providerId !== undefined) dbUpdates.provider_id = updates.providerId;
    if (updates.scheduledDate !== undefined) dbUpdates.scheduled_date = updates.scheduledDate;
    if (updates.completedDate !== undefined) dbUpdates.completed_date = updates.completedDate;
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.unitsRequired !== undefined) dbUpdates.units_required = updates.unitsRequired;
    if (updates.location !== undefined) dbUpdates.location = updates.location;
    if (updates.notes !== undefined) dbUpdates.notes = updates.notes;

    const { data, error } = await supabase
      .from('patient_transfusions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      console.error('Error updating transfusion:', error);
      return undefined;
    }

    // Map back to camelCase
    return {
      ...data,
      patientId: data.patient_id,
      donorId: data.donor_id,
      providerId: data.provider_id,
      scheduledDate: data.scheduled_date,
      completedDate: data.completed_date,
      unitsRequired: data.units_required
    };
  }
}