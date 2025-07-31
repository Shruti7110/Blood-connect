import { createClient } from '@supabase/supabase-js';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../shared/schema';
import { type IStorage, type User, type InsertUser, type Patient, type InsertPatient, type Donor, type InsertDonor, type HealthcareProvider, type InsertHealthcareProvider, type Transfusion, type InsertTransfusion, type Notification, type InsertNotification, type EmergencyRequest, type InsertEmergencyRequest, type DonorFamily } from './storage';

export class SupabaseStorage implements IStorage {
  private db: ReturnType<typeof drizzle>;
  private supabase: ReturnType<typeof createClient>;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required for Supabase storage');
    }
    
    const connectionString = process.env.DATABASE_URL;
    const client = postgres(connectionString);
    this.db = drizzle(client, { schema });
    
    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
      this.supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
    } else {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY are required');
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const users = await this.db.select().from(schema.users).where(eq(schema.users.id, id));
    return users[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.db.select().from(schema.users).where(eq(schema.users.email, email));
    return users[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = await this.db.insert(schema.users).values(insertUser).returning();
    return users[0];
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | undefined> {
    const users = await this.db.update(schema.users).set(updateData).where(eq(schema.users.id, id)).returning();
    return users[0];
  }

  // Patient methods
  async getPatient(id: string): Promise<Patient | undefined> {
    const patients = await this.db.select().from(schema.patients).where(eq(schema.patients.id, id));
    return patients[0];
  }

  async getPatientByUserId(userId: string): Promise<Patient | undefined> {
    const patients = await this.db.select().from(schema.patients).where(eq(schema.patients.userId, userId));
    return patients[0];
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const patients = await this.db.insert(schema.patients).values(insertPatient).returning();
    return patients[0];
  }

  async updatePatient(id: string, updateData: Partial<Patient>): Promise<Patient | undefined> {
    const patients = await this.db.update(schema.patients).set(updateData).where(eq(schema.patients.id, id)).returning();
    return patients[0];
  }

  async getPatients(): Promise<Patient[]> {
    return await this.db.select().from(schema.patients);
  }

  // Donor methods
  async getDonor(id: string): Promise<Donor | undefined> {
    const donors = await this.db.select().from(schema.donors).where(eq(schema.donors.id, id));
    return donors[0];
  }

  async getDonorByUserId(userId: string): Promise<Donor | undefined> {
    const donors = await this.db.select().from(schema.donors).where(eq(schema.donors.userId, userId));
    return donors[0];
  }

  async createDonor(insertDonor: InsertDonor): Promise<Donor> {
    const donors = await this.db.insert(schema.donors).values(insertDonor).returning();
    return donors[0];
  }

  async updateDonor(id: string, updateData: Partial<Donor>): Promise<Donor | undefined> {
    const donors = await this.db.update(schema.donors).set(updateData).where(eq(schema.donors.id, id)).returning();
    return donors[0];
  }

  async getDonorsByBloodGroup(bloodGroup: string): Promise<Donor[]> {
    const users = await this.db.select().from(schema.users).where(eq(schema.users.bloodGroup, bloodGroup as any));
    const donors = await this.db.select().from(schema.donors).where(inArray(schema.donors.userId, users.map(u => u.id)));
    return donors;
  }

  async getAvailableDonors(bloodGroup: string, location?: string): Promise<Donor[]> {
    return await this.getDonorsByBloodGroup(bloodGroup);
  }

  // Healthcare Provider methods
  async getHealthcareProvider(id: string): Promise<HealthcareProvider | undefined> {
    const providers = await this.db.select().from(schema.healthcareProviders).where(eq(schema.healthcareProviders.id, id));
    return providers[0];
  }

  async getHealthcareProviderByUserId(userId: string): Promise<HealthcareProvider | undefined> {
    const providers = await this.db.select().from(schema.healthcareProviders).where(eq(schema.healthcareProviders.userId, userId));
    return providers[0];
  }

  async createHealthcareProvider(insertProvider: InsertHealthcareProvider): Promise<HealthcareProvider> {
    const providers = await this.db.insert(schema.healthcareProviders).values(insertProvider).returning();
    return providers[0];
  }

  async updateHealthcareProvider(id: string, updateData: Partial<HealthcareProvider>): Promise<HealthcareProvider | undefined> {
    const providers = await this.db.update(schema.healthcareProviders).set(updateData).where(eq(schema.healthcareProviders.id, id)).returning();
    return providers[0];
  }

  // Transfusion methods
  async getTransfusion(id: string): Promise<Transfusion | undefined> {
    const transfusions = await this.db.select().from(schema.transfusions).where(eq(schema.transfusions.id, id));
    return transfusions[0];
  }

  async createTransfusion(insertTransfusion: InsertTransfusion): Promise<Transfusion> {
    const transfusions = await this.db.insert(schema.transfusions).values(insertTransfusion).returning();
    return transfusions[0];
  }

  async updateTransfusion(id: string, updateData: Partial<Transfusion>): Promise<Transfusion | undefined> {
    const transfusions = await this.db.update(schema.transfusions).set(updateData).where(eq(schema.transfusions.id, id)).returning();
    return transfusions[0];
  }

  async getTransfusionsByPatient(patientId: string): Promise<Transfusion[]> {
    return await this.db.select().from(schema.transfusions).where(eq(schema.transfusions.patientId, patientId));
  }

  async getTransfusionsByDonor(donorId: string): Promise<Transfusion[]> {
    return await this.db.select().from(schema.transfusions).where(eq(schema.transfusions.donorId, donorId));
  }

  async getUpcomingTransfusions(): Promise<Transfusion[]> {
    return await this.db.select().from(schema.transfusions).where(eq(schema.transfusions.status, 'scheduled'));
  }

  // Donor Family methods
  async getDonorFamily(patientId: string): Promise<DonorFamily[]> {
    return await this.db.select().from(schema.donorFamilies).where(and(eq(schema.donorFamilies.patientId, patientId), eq(schema.donorFamilies.isActive, true)));
  }

  async assignDonorToFamily(patientId: string, donorId: string): Promise<DonorFamily> {
    const families = await this.db.insert(schema.donorFamilies).values({
      patientId,
      donorId,
      isActive: true,
      assignedAt: new Date()
    }).returning();
    return families[0];
  }

  async removeDonorFromFamily(patientId: string, donorId: string): Promise<void> {
    await this.db.update(schema.donorFamilies)
      .set({ isActive: false })
      .where(and(eq(schema.donorFamilies.patientId, patientId), eq(schema.donorFamilies.donorId, donorId)));
  }

  // Notification methods
  async getNotification(id: string): Promise<Notification | undefined> {
    const notifications = await this.db.select().from(schema.notifications).where(eq(schema.notifications.id, id));
    return notifications[0];
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const notifications = await this.db.insert(schema.notifications).values(insertNotification).returning();
    return notifications[0];
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return await this.db.select().from(schema.notifications).where(eq(schema.notifications.userId, userId));
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await this.db.update(schema.notifications).set({ isRead: true }).where(eq(schema.notifications.id, id));
  }

  // Emergency Request methods
  async getEmergencyRequest(id: string): Promise<EmergencyRequest | undefined> {
    const requests = await this.db.select().from(schema.emergencyRequests).where(eq(schema.emergencyRequests.id, id));
    return requests[0];
  }

  async createEmergencyRequest(insertRequest: InsertEmergencyRequest): Promise<EmergencyRequest> {
    const requests = await this.db.insert(schema.emergencyRequests).values(insertRequest).returning();
    return requests[0];
  }

  async getEmergencyRequestsByPatient(patientId: string): Promise<EmergencyRequest[]> {
    return await this.db.select().from(schema.emergencyRequests).where(eq(schema.emergencyRequests.patientId, patientId));
  }

  async updateEmergencyRequest(id: string, updateData: Partial<EmergencyRequest>): Promise<EmergencyRequest | undefined> {
    const requests = await this.db.update(schema.emergencyRequests).set(updateData).where(eq(schema.emergencyRequests.id, id)).returning();
    return requests[0];
  }
}