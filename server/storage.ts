import { type User, type InsertUser, type Patient, type InsertPatient, type Donor, type InsertDonor, type HealthcareProvider, type InsertHealthcareProvider, type Transfusion, type InsertTransfusion, type Notification, type InsertNotification, type EmergencyRequest, type InsertEmergencyRequest, type DonorFamily } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;

  // Patient methods
  getPatient(id: string): Promise<Patient | undefined>;
  getPatientByUserId(userId: string): Promise<Patient | undefined>;
  createPatient(patient: InsertPatient): Promise<Patient>;
  updatePatient(id: string, patient: Partial<Patient>): Promise<Patient | undefined>;
  getPatients(): Promise<Patient[]>;

  // Donor methods
  getDonor(id: string): Promise<Donor | undefined>;
  getDonorByUserId(userId: string): Promise<Donor | undefined>;
  createDonor(donor: InsertDonor): Promise<Donor>;
  updateDonor(id: string, donor: Partial<Donor>): Promise<Donor | undefined>;
  getDonorsByBloodGroup(bloodGroup: string): Promise<Donor[]>;
  getAvailableDonors(bloodGroup: string, location?: string): Promise<Donor[]>;

  // Healthcare Provider methods
  getHealthcareProvider(id: string): Promise<HealthcareProvider | undefined>;
  getHealthcareProviderByUserId(userId: string): Promise<HealthcareProvider | undefined>;
  createHealthcareProvider(provider: InsertHealthcareProvider): Promise<HealthcareProvider>;
  updateHealthcareProvider(id: string, provider: Partial<HealthcareProvider>): Promise<HealthcareProvider | undefined>;

  // Transfusion methods
  getTransfusion(id: string): Promise<Transfusion | undefined>;
  createTransfusion(transfusion: InsertTransfusion): Promise<Transfusion>;
  updateTransfusion(id: string, transfusion: Partial<Transfusion>): Promise<Transfusion | undefined>;
  getTransfusionsByPatient(patientId: string): Promise<Transfusion[]>;
  getTransfusionsByDonor(donorId: string): Promise<Transfusion[]>;
  getUpcomingTransfusions(): Promise<Transfusion[]>;

  // Donor Family methods
  getDonorFamily(patientId: string): Promise<DonorFamily[]>;
  assignDonorToFamily(patientId: string, donorId: string): Promise<DonorFamily>;
  removeDonorFromFamily(patientId: string, donorId: string): Promise<void>;

  // Notification methods
  getNotification(id: string): Promise<Notification | undefined>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  getNotificationsByUser(userId: string): Promise<Notification[]>;
  markNotificationAsRead(id: string): Promise<void>;

  // Emergency Request methods
  getEmergencyRequest(id: string): Promise<EmergencyRequest | undefined>;
  createEmergencyRequest(request: InsertEmergencyRequest): Promise<EmergencyRequest>;
  getEmergencyRequestsByPatient(patientId: string): Promise<EmergencyRequest[]>;
  updateEmergencyRequest(id: string, request: Partial<EmergencyRequest>): Promise<EmergencyRequest | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private patients: Map<string, Patient> = new Map();
  private donors: Map<string, Donor> = new Map();
  private healthcareProviders: Map<string, HealthcareProvider> = new Map();
  private transfusions: Map<string, Transfusion> = new Map();
  private donorFamilies: Map<string, DonorFamily> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private emergencyRequests: Map<string, EmergencyRequest> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Create sample users
    const patientUser: User = {
      id: "patient-1",
      email: "sarah.chen@example.com",
      password: "hashed_password",
      role: "patient",
      name: "Sarah Chen",
      phone: "+1-555-0123",
      location: "San Francisco, CA",
      bloodGroup: "B+",
      createdAt: new Date(),
    };

    const donorUser1: User = {
      id: "donor-1",
      email: "michael.k@example.com",
      password: "hashed_password",
      role: "donor",
      name: "Michael K.",
      phone: "+1-555-0124",
      location: "San Francisco, CA",
      bloodGroup: "B+",
      createdAt: new Date(),
    };

    const donorUser2: User = {
      id: "donor-2",
      email: "jennifer.s@example.com",
      password: "hashed_password",
      role: "donor",
      name: "Jennifer S.",
      phone: "+1-555-0125",
      location: "San Francisco, CA",
      bloodGroup: "B+",
      createdAt: new Date(),
    };

    const providerUser: User = {
      id: "provider-1",
      email: "dr.martinez@hospital.com",
      password: "hashed_password",
      role: "healthcare_provider",
      name: "Dr. Jennifer Martinez",
      phone: "+1-555-0126",
      location: "San Francisco, CA",
      bloodGroup: "A+",
      createdAt: new Date(),
    };

    this.users.set(patientUser.id, patientUser);
    this.users.set(donorUser1.id, donorUser1);
    this.users.set(donorUser2.id, donorUser2);
    this.users.set(providerUser.id, providerUser);

    // Create sample patient
    const patient: Patient = {
      id: "patient-profile-1",
      userId: "patient-1",
      
      // Basic info
      dateOfBirth: new Date("1995-08-15"),
      weight: "68 kg",
      diagnosis: "Thalassemia Major",
      thalassemiaType: "beta-thalassemia-major",
      
      // Clinical status
      recentPreTransfusionHb: "8.5 g/dL",
      symptomsBetweenTransfusions: "Fatigue and shortness of breath when Hb drops below 8",
      poorGrowthHistory: false,
      boneDeformities: false,
      recurrentInfections: false,
      organIssuesHistory: "Mild splenomegaly",
      
      // Transfusion history
      transfusionFrequencyPast6Months: "every-3-weeks",
      unitsPerSession: 2,
      usualTransfusionHbLevel: "8.0 g/dL",
      recentIntervalChanges: "No recent changes",
      
      // Iron and chelation
      ironChelationTherapy: "yes",
      chelationMedication: "Deferasirox",
      chelationFrequency: "daily",
      lastSerumFerritin: "2400 ng/mL",
      lastLiverIronMeasurement: "Not available",
      adverseReactionsHistory: "No adverse reactions",
      
      // Manual frequency (not used in this case)
      manualTransfusionFrequency: null,
      
      // Existing fields
      transfusionHistory: [],
      nextTransfusionDate: new Date("2024-03-15T10:00:00Z"),
      hemoglobinLevel: "9.2 g/dL",
      ironLevels: "850 ng/mL",
      lastTransfusion: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000),
      totalTransfusions: 247,
    };

    this.patients.set(patient.id, patient);

    // Create sample donors
    const donor1: Donor = {
      id: "donor-profile-1",
      userId: "donor-1",
      eligibilityStatus: true,
      lastDonation: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      totalDonations: 15,
      availableForDonation: true,
      donationHistory: [],
    };

    const donor2: Donor = {
      id: "donor-profile-2",
      userId: "donor-2",
      eligibilityStatus: true,
      lastDonation: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      totalDonations: 12,
      availableForDonation: true,
      donationHistory: [],
    };

    this.donors.set(donor1.id, donor1);
    this.donors.set(donor2.id, donor2);

    // Create sample healthcare provider
    const provider: HealthcareProvider = {
      id: "provider-profile-1",
      userId: "provider-1",
      hospitalName: "St. Mary's Hospital",
      department: "Hematology",
      licenseNumber: "MD123456",
    };

    this.healthcareProviders.set(provider.id, provider);

    // Create donor family assignments
    const familyMember1: DonorFamily = {
      id: "family-1",
      patientId: "patient-profile-1",
      donorId: "donor-profile-1",
      assignedAt: new Date(),
      isActive: true,
    };

    const familyMember2: DonorFamily = {
      id: "family-2",
      patientId: "patient-profile-1",
      donorId: "donor-profile-2",
      assignedAt: new Date(),
      isActive: true,
    };

    this.donorFamilies.set(familyMember1.id, familyMember1);
    this.donorFamilies.set(familyMember2.id, familyMember2);

    // Create sample transfusion
    const transfusion: Transfusion = {
      id: "transfusion-1",
      patientId: "patient-profile-1",
      donorId: "donor-profile-1",
      providerId: "provider-profile-1",
      scheduledDate: new Date("2024-03-15T10:00:00Z"),
      completedDate: null,
      status: "scheduled",
      unitsRequired: 2,
      location: "St. Mary's Hospital - Room 304",
      notes: "Regular scheduled transfusion",
    };

    this.transfusions.set(transfusion.id, transfusion);

    // Create sample notifications
    const notification: Notification = {
      id: "notification-1",
      userId: "patient-1",
      title: "Upcoming Transfusion",
      message: "Your transfusion is scheduled for March 15th at 10:00 AM",
      type: "appointment",
      isRead: false,
      createdAt: new Date(),
    };

    this.notifications.set(notification.id, notification);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date(),
      phone: insertUser.phone || null,
      location: insertUser.location || null,
      bloodGroup: insertUser.bloodGroup || null
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    const updatedUser = { ...user, ...updateData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Patient methods
  async getPatient(id: string): Promise<Patient | undefined> {
    return this.patients.get(id);
  }

  async getPatientByUserId(userId: string): Promise<Patient | undefined> {
    return Array.from(this.patients.values()).find(patient => patient.userId === userId);
  }

  async createPatient(insertPatient: InsertPatient): Promise<Patient> {
    const id = randomUUID();
    const patient: Patient = { 
      ...insertPatient, 
      id,
      diagnosis: insertPatient.diagnosis || null,
      transfusionHistory: insertPatient.transfusionHistory || [],
      ironChelationTherapy: insertPatient.ironChelationTherapy || null,
      nextTransfusionDate: insertPatient.nextTransfusionDate || null,
      hemoglobinLevel: insertPatient.hemoglobinLevel || null,
      ironLevels: insertPatient.ironLevels || null,
      lastTransfusion: insertPatient.lastTransfusion || null,
      totalTransfusions: insertPatient.totalTransfusions || null
    };
    this.patients.set(id, patient);
    return patient;
  }

  async updatePatient(id: string, updateData: Partial<Patient>): Promise<Patient | undefined> {
    const patient = this.patients.get(id);
    if (!patient) return undefined;
    const updatedPatient = { ...patient, ...updateData };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  async getPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  // Donor methods
  async getDonor(id: string): Promise<Donor | undefined> {
    return this.donors.get(id);
  }

  async getDonorByUserId(userId: string): Promise<Donor | undefined> {
    return Array.from(this.donors.values()).find(donor => donor.userId === userId);
  }

  async createDonor(insertDonor: InsertDonor): Promise<Donor> {
    const id = randomUUID();
    const donor: Donor = { 
      ...insertDonor, 
      id,
      eligibilityStatus: insertDonor.eligibilityStatus ?? null,
      lastDonation: insertDonor.lastDonation || null,
      totalDonations: insertDonor.totalDonations ?? null,
      availableForDonation: insertDonor.availableForDonation ?? null,
      donationHistory: insertDonor.donationHistory || []
    };
    this.donors.set(id, donor);
    return donor;
  }

  async updateDonor(id: string, updateData: Partial<Donor>): Promise<Donor | undefined> {
    const donor = this.donors.get(id);
    if (!donor) return undefined;
    const updatedDonor = { ...donor, ...updateData };
    this.donors.set(id, updatedDonor);
    return updatedDonor;
  }

  async getDonorsByBloodGroup(bloodGroup: string): Promise<Donor[]> {
    const donors = Array.from(this.donors.values());
    const donorUsers = await Promise.all(
      donors.map(async donor => {
        const user = await this.getUser(donor.userId);
        return { donor, user };
      })
    );
    return donorUsers
      .filter(({ user }) => user?.bloodGroup === bloodGroup)
      .map(({ donor }) => donor);
  }

  async getAvailableDonors(bloodGroup: string, location?: string): Promise<Donor[]> {
    const donors = await this.getDonorsByBloodGroup(bloodGroup);
    return donors.filter(donor => donor.availableForDonation);
  }

  // Healthcare Provider methods
  async getHealthcareProvider(id: string): Promise<HealthcareProvider | undefined> {
    return this.healthcareProviders.get(id);
  }

  async getHealthcareProviderByUserId(userId: string): Promise<HealthcareProvider | undefined> {
    return Array.from(this.healthcareProviders.values()).find(provider => provider.userId === userId);
  }

  async createHealthcareProvider(insertProvider: InsertHealthcareProvider): Promise<HealthcareProvider> {
    const id = randomUUID();
    const provider: HealthcareProvider = { 
      ...insertProvider, 
      id,
      hospitalName: insertProvider.hospitalName || null,
      department: insertProvider.department || null,
      licenseNumber: insertProvider.licenseNumber || null
    };
    this.healthcareProviders.set(id, provider);
    return provider;
  }

  async updateHealthcareProvider(id: string, updateData: Partial<HealthcareProvider>): Promise<HealthcareProvider | undefined> {
    const provider = this.healthcareProviders.get(id);
    if (!provider) return undefined;
    const updatedProvider = { ...provider, ...updateData };
    this.healthcareProviders.set(id, updatedProvider);
    return updatedProvider;
  }

  // Transfusion methods
  async getTransfusion(id: string): Promise<Transfusion | undefined> {
    return this.transfusions.get(id);
  }

  async createTransfusion(insertTransfusion: InsertTransfusion): Promise<Transfusion> {
    const id = randomUUID();
    const transfusion: Transfusion = { 
      ...insertTransfusion, 
      id, 
      completedDate: null,
      location: insertTransfusion.location || null,
      status: insertTransfusion.status || null,
      donorId: insertTransfusion.donorId || null,
      providerId: insertTransfusion.providerId || null,
      unitsRequired: insertTransfusion.unitsRequired ?? null,
      notes: insertTransfusion.notes || null
    };
    this.transfusions.set(id, transfusion);
    return transfusion;
  }

  async updateTransfusion(id: string, updateData: Partial<Transfusion>): Promise<Transfusion | undefined> {
    const transfusion = this.transfusions.get(id);
    if (!transfusion) return undefined;
    const updatedTransfusion = { ...transfusion, ...updateData };
    this.transfusions.set(id, updatedTransfusion);
    return updatedTransfusion;
  }

  async getTransfusionsByPatient(patientId: string): Promise<Transfusion[]> {
    return Array.from(this.transfusions.values()).filter(t => t.patientId === patientId);
  }

  async getTransfusionsByDonor(donorId: string): Promise<Transfusion[]> {
    return Array.from(this.transfusions.values()).filter(t => t.donorId === donorId);
  }

  async getUpcomingTransfusions(): Promise<Transfusion[]> {
    const now = new Date();
    return Array.from(this.transfusions.values()).filter(t => 
      t.status === "scheduled" && new Date(t.scheduledDate) > now
    );
  }

  // Donor Family methods
  async getDonorFamily(patientId: string): Promise<DonorFamily[]> {
    return Array.from(this.donorFamilies.values()).filter(f => f.patientId === patientId && f.isActive);
  }

  async assignDonorToFamily(patientId: string, donorId: string): Promise<DonorFamily> {
    const id = randomUUID();
    const familyMember: DonorFamily = {
      id,
      patientId,
      donorId,
      assignedAt: new Date(),
      isActive: true,
    };
    this.donorFamilies.set(id, familyMember);
    return familyMember;
  }

  async removeDonorFromFamily(patientId: string, donorId: string): Promise<void> {
    const familyMember = Array.from(this.donorFamilies.values()).find(f => 
      f.patientId === patientId && f.donorId === donorId && f.isActive
    );
    if (familyMember) {
      familyMember.isActive = false;
      this.donorFamilies.set(familyMember.id, familyMember);
    }
  }

  // Notification methods
  async getNotification(id: string): Promise<Notification | undefined> {
    return this.notifications.get(id);
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const id = randomUUID();
    const notification: Notification = { 
      ...insertNotification, 
      id, 
      createdAt: new Date(),
      isRead: insertNotification.isRead ?? null
    };
    this.notifications.set(id, notification);
    return notification;
  }

  async getNotificationsByUser(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(n => n.userId === userId);
  }

  async markNotificationAsRead(id: string): Promise<void> {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
      this.notifications.set(id, notification);
    }
  }

  // Emergency Request methods
  async getEmergencyRequest(id: string): Promise<EmergencyRequest | undefined> {
    return this.emergencyRequests.get(id);
  }

  async createEmergencyRequest(insertRequest: InsertEmergencyRequest): Promise<EmergencyRequest> {
    const id = randomUUID();
    const request: EmergencyRequest = { 
      ...insertRequest, 
      id, 
      createdAt: new Date(),
      status: insertRequest.status || null,
      notes: insertRequest.notes || null
    };
    this.emergencyRequests.set(id, request);
    return request;
  }

  async getEmergencyRequestsByPatient(patientId: string): Promise<EmergencyRequest[]> {
    return Array.from(this.emergencyRequests.values()).filter(r => r.patientId === patientId);
  }

  async updateEmergencyRequest(id: string, updateData: Partial<EmergencyRequest>): Promise<EmergencyRequest | undefined> {
    const request = this.emergencyRequests.get(id);
    if (!request) return undefined;
    const updatedRequest = { ...request, ...updateData };
    this.emergencyRequests.set(id, updatedRequest);
    return updatedRequest;
  }
}

export const storage = new MemStorage();
