import { type User, type InsertUser, type Patient, type InsertPatient, type Donor, type InsertDonor, type HealthcareProvider, type InsertHealthcareProvider, type Transfusion, type InsertTransfusion, type Notification, type InsertNotification, type EmergencyRequest, type InsertEmergencyRequest, type DonorFamily } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(userData: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;

  // Patient methods
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientByUserId(userId: string): Promise<Patient | undefined>;
  createPatient(patientData: InsertPatient): Promise<Patient>;
  updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | undefined>;

  // Donor methods
  getDonor(id: string): Promise<Donor | undefined>;
  getDonorByUserId(userId: string): Promise<Donor | undefined>;
  createDonor(donorData: InsertDonor): Promise<Donor>;
  updateDonor(id: string, updates: Partial<Donor>): Promise<Donor | undefined>;
  getAvailableDonors(bloodGroup: string): Promise<Donor[]>;

  // Healthcare Provider methods
  getHealthcareProvider(id: string): Promise<HealthcareProvider | undefined>;
  getHealthcareProviderByUserId(userId: string): Promise<HealthcareProvider | undefined>;
  createHealthcareProvider(providerData: InsertHealthcareProvider): Promise<HealthcareProvider>;

  // Transfusion methods
  getTransfusion(id: string): Promise<Transfusion | undefined>;
  getTransfusionsByPatient(patientId: string): Promise<Transfusion[]>;
  getTransfusionsByDonor(donorId: string): Promise<Transfusion[]>;
  getUpcomingTransfusions(): Promise<Transfusion[]>;
  createTransfusion(transfusionData: InsertTransfusion): Promise<Transfusion>;
  updateTransfusion(id: string, updates: Partial<Transfusion>): Promise<Transfusion | undefined>;

  // Donor Family methods
  getDonorFamily(patientId: string): Promise<DonorFamily[]>;
  assignDonorToFamily(patientId: string, donorId: string): Promise<DonorFamily>;

  // Notification methods
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  createNotification(notificationData: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;

  // Emergency Request methods
  getEmergencyRequestsByPatient(patientId: string): Promise<EmergencyRequest[]>;
  createEmergencyRequest(requestData: InsertEmergencyRequest): Promise<EmergencyRequest>;
}

class SupabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return undefined;
    }
    return data as User;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user by email:', error);
      return undefined;
    }
    return data as User;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .insert(userData)
      .select()
      .single();

    if (error) {
      console.error('Error creating user:', error);
      throw new Error('Failed to create user');
    }
    return data as User;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating user:', error);
      return undefined;
    }
    return data as User;
  }

  // Patient methods
  async getPatient(id: string): Promise<Patient | undefined> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching patient:', error);
      return undefined;
    }
    return data as Patient;
  }

  async getPatientByUserId(userId: string): Promise<Patient | undefined> {
    const { data, error } = await supabase
      .from('patients')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching patient by user ID:', error);
      return undefined;
    }
    return data as Patient;
  }

  async createPatient(patientData: InsertPatient): Promise<Patient> {
    const { data, error } = await supabase
      .from('patients')
      .insert(patientData)
      .select()
      .single();

    if (error) {
      console.error('Error creating patient:', error);
      throw new Error('Failed to create patient');
    }
    return data as Patient;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | undefined> {
    const { data, error } = await supabase
      .from('patients')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating patient:', error);
      return undefined;
    }
    return data as Patient;
  }

  // Donor methods
  async getDonor(id: string): Promise<Donor | undefined> {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching donor:', error);
      return undefined;
    }
    return data as Donor;
  }

  async getDonorByUserId(userId: string): Promise<Donor | undefined> {
    const { data, error } = await supabase
      .from('donors')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching donor by user ID:', error);
      return undefined;
    }
    return data as Donor;
  }

  async createDonor(donorData: InsertDonor): Promise<Donor> {
    const { data, error } = await supabase
      .from('donors')
      .insert(donorData)
      .select()
      .single();

    if (error) {
      console.error('Error creating donor:', error);
      throw new Error('Failed to create donor');
    }
    return data as Donor;
  }

  async updateDonor(id: string, updates: Partial<Donor>): Promise<Donor | undefined> {
    const { data, error } = await supabase
      .from('donors')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating donor:', error);
      return undefined;
    }
    return data as Donor;
  }

  async getAvailableDonors(bloodGroup: string): Promise<Donor[]> {
    const { data, error } = await supabase
      .from('donors')
      .select(`
        *,
        users!inner(*)
      `)
      .eq('available_for_donation', true)
      .eq('users.blood_group', bloodGroup);

    if (error) {
      console.error('Error fetching available donors:', error);
      return [];
    }
    return data as Donor[];
  }

  // Healthcare Provider methods
  async getHealthcareProvider(id: string): Promise<HealthcareProvider | undefined> {
    const { data, error } = await supabase
      .from('healthcare_providers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching healthcare provider:', error);
      return undefined;
    }
    return data as HealthcareProvider;
  }

  async getHealthcareProviderByUserId(userId: string): Promise<HealthcareProvider | undefined> {
    const { data, error } = await supabase
      .from('healthcare_providers')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Error fetching healthcare provider by user ID:', error);
      return undefined;
    }
    return data as HealthcareProvider;
  }

  async createHealthcareProvider(providerData: InsertHealthcareProvider): Promise<HealthcareProvider> {
    const { data, error } = await supabase
      .from('healthcare_providers')
      .insert(providerData)
      .select()
      .single();

    if (error) {
      console.error('Error creating healthcare provider:', error);
      throw new Error('Failed to create healthcare provider');
    }
    return data as HealthcareProvider;
  }

  // Transfusion methods
  async getTransfusion(id: string): Promise<Transfusion | undefined> {
    const { data, error } = await supabase
      .from('transfusions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching transfusion:', error);
      return undefined;
    }
    return data as Transfusion;
  }

  async getTransfusionsByPatient(patientId: string): Promise<Transfusion[]> {
    const { data, error } = await supabase
      .from('transfusions')
      .select('*')
      .eq('patient_id', patientId)
      .order('scheduled_date', { ascending: false });

    if (error) {
      console.error('Error fetching transfusions by patient:', error);
      return [];
    }
    return data as Transfusion[];
  }

  async getTransfusionsByDonor(donorId: string): Promise<Transfusion[]> {
    const { data, error } = await supabase
      .from('transfusions')
      .select('*')
      .eq('donor_id', donorId)
      .order('scheduled_date', { ascending: false });

    if (error) {
      console.error('Error fetching transfusions by donor:', error);
      return [];
    }
    return data as Transfusion[];
  }

  async getUpcomingTransfusions(): Promise<Transfusion[]> {
    const { data, error } = await supabase
      .from('transfusions')
      .select('*')
      .gte('scheduled_date', new Date().toISOString())
      .order('scheduled_date', { ascending: true });

    if (error) {
      console.error('Error fetching upcoming transfusions:', error);
      return [];
    }
    return data as Transfusion[];
  }

  async createTransfusion(transfusionData: InsertTransfusion): Promise<Transfusion> {
    const { data, error } = await supabase
      .from('transfusions')
      .insert(transfusionData)
      .select()
      .single();

    if (error) {
      console.error('Error creating transfusion:', error);
      throw new Error('Failed to create transfusion');
    }
    return data as Transfusion;
  }

  async updateTransfusion(id: string, updates: Partial<Transfusion>): Promise<Transfusion | undefined> {
    const { data, error } = await supabase
      .from('transfusions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating transfusion:', error);
      return undefined;
    }
    return data as Transfusion;
  }

  // Donor Family methods
  async getDonorFamily(patientId: string): Promise<DonorFamily[]> {
    const { data, error } = await supabase
      .from('donor_families')
      .select('*')
      .eq('patient_id', patientId)
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching donor family:', error);
      return [];
    }
    return data as DonorFamily[];
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

    if (error) {
      console.error('Error assigning donor to family:', error);
      throw new Error('Failed to assign donor to family');
    }
    return data as DonorFamily;
  }

  // Notification methods
  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
    return data as Notification[];
  }

  async createNotification(notificationData: InsertNotification): Promise<Notification> {
    const { data, error } = await supabase
      .from('notifications')
      .insert(notificationData)
      .select()
      .single();

    if (error) {
      console.error('Error creating notification:', error);
      throw new Error('Failed to create notification');
    }
    return data as Notification;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  // Emergency Request methods
  async getEmergencyRequestsByPatient(patientId: string): Promise<EmergencyRequest[]> {
    const { data, error } = await supabase
      .from('emergency_requests')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching emergency requests:', error);
      return [];
    }
    return data as EmergencyRequest[];
  }

  async createEmergencyRequest(requestData: InsertEmergencyRequest): Promise<EmergencyRequest> {
    const { data, error } = await supabase
      .from('emergency_requests')
      .insert(requestData)
      .select()
      .single();

    if (error) {
      console.error('Error creating emergency request:', error);
      throw new Error('Failed to create emergency request');
    }
    return data as EmergencyRequest;
  }
}

export const storage = new SupabaseStorage();
export type { User, InsertUser, Patient, InsertPatient, Donor, InsertDonor, HealthcareProvider, InsertHealthcareProvider, Transfusion, InsertTransfusion, Notification, InsertNotification, EmergencyRequest, InsertEmergencyRequest, DonorFamily };