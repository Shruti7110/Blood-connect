
import { supabase } from './supabase';
import { type User, type InsertUser, type Patient, type InsertPatient, type Donor, type InsertDonor, type HealthcareProvider, type InsertHealthcareProvider, type Transfusion, type InsertTransfusion, type Notification, type InsertNotification, type EmergencyRequest, type InsertEmergencyRequest, type DonorFamily } from "@shared/schema";
import { type IStorage } from './storage';

export class SupabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data;
  }

  // Patient methods
  async getPatient(id: string): Promise<Patient | undefined> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getPatientByUserId(userId: string): Promise<Patient | undefined> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async createPatient(patientData: InsertPatient): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .insert(patientData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updatePatient(id: string, patientData: Partial<Patient>): Promise<Patient | undefined> {
    const { data, error } = await supabase
      .from('patients')
      .update(patientData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getPatients(): Promise<Patient[]> {
    const { data, error } = await supabase
      .from('patients')
      .select('*');
    
    if (error) return [];
    return data;
  }

  // Donor methods
  async getDonor(id: string): Promise<Donor | undefined> {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getDonorByUserId(userId: string): Promise<Donor | undefined> {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async createDonor(donorData: InsertDonor): Promise<Donor> {
    const { data, error } = await supabase
      .from('donors')
      .insert(donorData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateDonor(id: string, donorData: Partial<Donor>): Promise<Donor | undefined> {
    const { data, error } = await supabase
      .from('donors')
      .update(donorData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getDonorsByBloodGroup(bloodGroup: string): Promise<Donor[]> {
    const { data, error } = await supabase
      .from('donors')
      .select(`
        *,
        users!inner(blood_group)
      `)
      .eq('users.blood_group', bloodGroup);
    
    if (error) return [];
    return data;
  }

  async getAvailableDonors(bloodGroup: string, location?: string): Promise<Donor[]> {
    let query = supabase
      .from('donors')
      .select(`
        *,
        users!inner(blood_group, location)
      `)
      .eq('users.blood_group', bloodGroup)
      .eq('available_for_donation', true);

    if (location) {
      query = query.eq('users.location', location);
    }

    const { data, error } = await query;
    if (error) return [];
    return data;
  }

  // Healthcare Provider methods
  async getHealthcareProvider(id: string): Promise<HealthcareProvider | undefined> {
    const { data, error } = await supabase
      .from('healthcare_providers')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getHealthcareProviderByUserId(userId: string): Promise<HealthcareProvider | undefined> {
    const { data, error } = await supabase
      .from('healthcare_providers')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async createHealthcareProvider(providerData: InsertHealthcareProvider): Promise<HealthcareProvider> {
    const { data, error } = await supabase
      .from('healthcare_providers')
      .insert(providerData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateHealthcareProvider(id: string, providerData: Partial<HealthcareProvider>): Promise<HealthcareProvider | undefined> {
    const { data, error } = await supabase
      .from('healthcare_providers')
      .update(providerData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data;
  }

  // Transfusion methods
  async getTransfusion(id: string): Promise<Transfusion | undefined> {
    const { data, error } = await supabase
      .from('transfusions')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async createTransfusion(transfusionData: InsertTransfusion): Promise<Transfusion> {
    const { data, error } = await supabase
      .from('transfusions')
      .insert(transfusionData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async updateTransfusion(id: string, transfusionData: Partial<Transfusion>): Promise<Transfusion | undefined> {
    const { data, error } = await supabase
      .from('transfusions')
      .update(transfusionData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data;
  }

  async getTransfusionsByPatient(patientId: string): Promise<Transfusion[]> {
    const { data, error } = await supabase
      .from('transfusions')
      .select('*')
      .eq('patient_id', patientId);
    
    if (error) return [];
    return data;
  }

  async getTransfusionsByDonor(donorId: string): Promise<Transfusion[]> {
    const { data, error } = await supabase
      .from('transfusions')
      .select('*')
      .eq('donor_id', donorId);
    
    if (error) return [];
    return data;
  }

  async getUpcomingTransfusions(): Promise<Transfusion[]> {
    const { data, error } = await supabase
      .from('transfusions')
      .select('*')
      .gte('scheduled_date', new Date().toISOString())
      .order('scheduled_date', { ascending: true });
    
    if (error) return [];
    return data;
  }

  // Donor Family methods
  async getDonorFamily(patientId: string): Promise<DonorFamily[]> {
    const { data, error } = await supabase
      .from('donor_families')
      .select('*')
      .eq('patient_id', patientId)
      .eq('is_active', true);
    
    if (error) return [];
    return data;
  }

  async assignDonorToFamily(patientId: string, donorId: string): Promise<DonorFamily> {
    const { data, error } = await supabase
      .from('donor_families')
      .insert({
        patient_id: patientId,
        donor_id: donorId,
        is_active: true
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async removeDonorFromFamily(patientId: string, donorId: string): Promise<void> {
    const { error } = await supabase
      .from('donor_families')
      .update({ is_active: false })
      .eq('patient_id', patientId)
      .eq('donor_id', donorId);
    
    if (error) throw error;
  }

  // Notification methods
  async getNotification(id: string): Promise<Notification | undefined> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);
    
    if (error) throw error;
  }

  // Emergency Request methods
  async getEmergencyRequest(id: string): Promise<EmergencyRequest | undefined> {
    const { data, error } = await supabase
      .from('emergency_requests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) return undefined;
    return data;
  }

  async createEmergencyRequest(requestData: InsertEmergencyRequest): Promise<EmergencyRequest> {
    const { data, error } = await supabase
      .from('emergency_requests')
      .insert(requestData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getEmergencyRequestsByPatient(patientId: string): Promise<EmergencyRequest[]> {
    const { data, error } = await supabase
      .from('emergency_requests')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    
    if (error) return [];
    return data;
  }

  async updateEmergencyRequest(id: string, requestData: Partial<EmergencyRequest>): Promise<EmergencyRequest | undefined> {
    const { data, error } = await supabase
      .from('emergency_requests')
      .update(requestData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) return undefined;
    return data;
  }
}
