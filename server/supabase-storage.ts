import { type User, type InsertUser, type Patient, type InsertPatient, type Donor, type InsertDonor, type HealthcareProvider, type InsertHealthcareProvider, type Transfusion, type InsertTransfusion, type Notification, type InsertNotification, type EmergencyRequest, type InsertEmergencyRequest, type DonorFamily } from "@shared/schema";
import { supabase } from './supabase';
import { IStorage } from './storage';

export class SupabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
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

    if (error || !data) throw new Error('Failed to create user');
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
    const { data, error } = await supabase
      .from('patients')
      .insert(patient)
      .select()
      .single();

    if (error || !data) throw new Error('Failed to create patient');
    return data;
  }

  async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient | undefined> {
    const { data, error } = await supabase
      .from('patients')
      .update(patient)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data;
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
    const { data, error } = await supabase
      .from('donors')
      .insert(donor)
      .select()
      .single();

    if (error || !data) throw new Error('Failed to create donor');
    return data;
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
    const { data, error } = await supabase
      .from('healthcare_providers')
      .insert(provider)
      .select()
      .single();

    if (error || !data) throw new Error('Failed to create healthcare provider');
    return data;
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

  // Transfusion methods
  async getTransfusion(id: string): Promise<Transfusion | undefined> {
    const { data, error } = await supabase
      .from('transfusions')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return undefined;
    return data;
  }

  async createTransfusion(transfusion: InsertTransfusion): Promise<Transfusion> {
    const { data, error } = await supabase
      .from('transfusions')
      .insert(transfusion)
      .select()
      .single();

    if (error || !data) throw new Error('Failed to create transfusion');
    return data;
  }

  async updateTransfusion(id: string, transfusion: Partial<Transfusion>): Promise<Transfusion | undefined> {
    const { data, error } = await supabase
      .from('transfusions')
      .update(transfusion)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) return undefined;
    return data;
  }

  async getTransfusionsByPatient(patientId: string): Promise<Transfusion[]> {
    const { data, error } = await supabase
      .from('transfusions')
      .select('*')
      .eq('patient_id', patientId)
      .order('scheduled_date', { ascending: false });

    if (error) {
      console.error('Error fetching transfusions:', error);
      return [];
    }
    
    // Map database column names
    const mappedData = (data || []).map(transfusion => ({
      ...transfusion,
      patientId: transfusion.patient_id,
      donorId: transfusion.donor_id,
      providerId: transfusion.provider_id,
      scheduledDate: transfusion.scheduled_date,
      completedDate: transfusion.completed_date,
      unitsRequired: transfusion.units_required
    }));
    
    return mappedData;
  }

  async getTransfusionsByDonor(donorId: string): Promise<Transfusion[]> {
    const { data, error } = await supabase
      .from('transfusions')
      .select('*')
      .eq('donor_id', donorId)
      .order('scheduled_date', { ascending: false });

    if (error) return [];
    return data || [];
  }

  async getUpcomingTransfusions(): Promise<Transfusion[]> {
    const { data, error } = await supabase
      .from('transfusions')
      .select('*')
      .eq('status', 'scheduled')
      .gte('scheduled_date', new Date().toISOString())
      .order('scheduled_date', { ascending: true });

    if (error) return [];
    return data || [];
  }

  // Donor Family methods
  async getDonorFamily(patientId: string): Promise<DonorFamily[]> {
    // First get the donor family relationships
    const { data: familyData, error: familyError } = await supabase
      .from('donor_families')
      .select('*')
      .eq('patient_id', patientId)
      .eq('is_active', true);

    if (familyError || !familyData) {
      console.error('Error fetching donor family:', familyError);
      return [];
    }

    // Then get the complete donor and user data for each family member
    const familyWithDetails = await Promise.all(
      familyData.map(async (family) => {
        // Get donor details
        const { data: donorData } = await supabase
          .from('donors')
          .select('*')
          .eq('id', family.donor_id)
          .single();

        // Get user details if donor exists
        let userData = null;
        if (donorData) {
          const { data: userResult } = await supabase
            .from('users')
            .select('*')
            .eq('id', donorData.user_id)
            .single();
          userData = userResult;
        }

        return {
          ...family,
          donor: donorData,
          user: userData
        };
      })
    );

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
    const { data, error } = await supabase
      .from('emergency_requests')
      .insert(request)
      .select()
      .single();

    if (error || !data) throw new Error('Failed to create emergency request');
    return data;
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
}