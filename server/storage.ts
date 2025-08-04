import type { User, Patient, Donor, HealthcareProvider, PatientTransfusion, Notification, EmergencyRequest, DonorDonation, DonorFamily } from "@shared/schema";
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export function AuthMiddleware(req: AuthenticatedRequest, res: any, next: any) {
  // Basic auth middleware - in production this would validate JWT tokens
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'No authorization header' });
  }
  
  // For now, just pass through - you can implement proper JWT validation here
  next();
}

export interface IStorage {
  // User management
  createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User>;
  getUser(id: string): Promise<User | null>;
  getUserByEmail(email: string): Promise<User | null>;
  updateUser(id: string, updates: Partial<User>): Promise<User | null>;
  deleteUser(id: string): Promise<boolean>;
  
  // Patient management
  createPatient(patient: Omit<Patient, 'id'>): Promise<Patient>;
  getPatient(id: string): Promise<Patient | null>;
  getPatientByUserId(userId: string): Promise<Patient | null>;
  updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null>;
  getPatients(): Promise<Patient[]>;
  
  // Donor management
  createDonor(donor: Omit<Donor, 'id'>): Promise<Donor>;
  getDonor(id: string): Promise<Donor | null>;
  getDonorByUserId(userId: string): Promise<Donor | null>;
  updateDonor(id: string, updates: Partial<Donor>): Promise<Donor | null>;
  getDonors(): Promise<Donor[]>;
  getAvailableDonors(): Promise<Donor[]>;
  
  // Healthcare Provider management
  createHealthcareProvider(provider: Omit<HealthcareProvider, 'id'>): Promise<HealthcareProvider>;
  getHealthcareProvider(id: string): Promise<HealthcareProvider | null>;
  getHealthcareProviderByUserId(userId: string): Promise<HealthcareProvider | null>;
  updateHealthcareProvider(id: string, updates: Partial<HealthcareProvider>): Promise<HealthcareProvider | null>;
  getHealthcareProviders(): Promise<HealthcareProvider[]>;
  
  // Transfusion management
  createTransfusion(transfusion: Omit<PatientTransfusion, 'id'>): Promise<PatientTransfusion>;
  getTransfusion(id: string): Promise<PatientTransfusion | null>;
  getTransfusionsByPatientId(patientId: string): Promise<PatientTransfusion[]>;
  getTransfusionsByDonorId(donorId: string): Promise<PatientTransfusion[]>;
  updateTransfusion(id: string, updates: Partial<PatientTransfusion>): Promise<PatientTransfusion | null>;
  deleteTransfusion(id: string): Promise<boolean>;
  getTransfusions(): Promise<PatientTransfusion[]>;
  
  // Notification management
  createNotification(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification>;
  getNotification(id: string): Promise<Notification | null>;
  getNotificationsByUserId(userId: string): Promise<Notification[]>;
  updateNotification(id: string, updates: Partial<Notification>): Promise<Notification | null>;
  deleteNotification(id: string): Promise<boolean>;
  markNotificationRead(id: string): Promise<boolean>;
  
  // Emergency Request management
  createEmergencyRequest(request: Omit<EmergencyRequest, 'id' | 'createdAt'>): Promise<EmergencyRequest>;
  getEmergencyRequest(id: string): Promise<EmergencyRequest | null>;
  getEmergencyRequestsByPatientId(patientId: string): Promise<EmergencyRequest[]>;
  updateEmergencyRequest(id: string, updates: Partial<EmergencyRequest>): Promise<EmergencyRequest | null>;
  getActiveEmergencyRequests(): Promise<EmergencyRequest[]>;
  
  // Donation management
  createDonation(donation: Omit<DonorDonation, 'id' | 'createdAt'>): Promise<DonorDonation>;
  getDonation(id: string): Promise<DonorDonation | null>;
  getDonationsByDonorId(donorId: string): Promise<DonorDonation[]>;
  getDonationsByPatientId(patientId: string): Promise<DonorDonation[]>;
  updateDonation(id: string, updates: Partial<DonorDonation>): Promise<DonorDonation | null>;
  getDonations(): Promise<DonorDonation[]>;
  
  // Donor Family management
  createDonorFamily(family: Omit<DonorFamily, 'id' | 'assignedAt'>): Promise<DonorFamily>;
  getDonorFamiliesByPatientId(patientId: string): Promise<DonorFamily[]>;
  getDonorFamiliesByDonorId(donorId: string): Promise<DonorFamily[]>;
  updateDonorFamily(id: string, updates: Partial<DonorFamily>): Promise<DonorFamily | null>;
  deactivateDonorFamily(id: string): Promise<boolean>;
}

// In-memory storage implementation for development
export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private patients: Map<string, Patient> = new Map();
  private donors: Map<string, Donor> = new Map();
  private healthcareProviders: Map<string, HealthcareProvider> = new Map();
  private transfusions: Map<string, PatientTransfusion> = new Map();
  private notifications: Map<string, Notification> = new Map();
  private emergencyRequests: Map<string, EmergencyRequest> = new Map();
  private donations: Map<string, DonorDonation> = new Map();
  private donorFamilies: Map<string, DonorFamily> = new Map();

  constructor() {
    this.seedDemoData();
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  private seedDemoData() {
    // Create demo users
    const demoUsers = [
      {
        id: "patient-1",
        email: "sarah.chen@example.com",
        password: "hashed_password",
        role: "patient" as const,
        name: "Sarah Chen",
        phone: "+1-555-0123",
        location: "Downtown Medical District",
        bloodGroup: "A+" as const,
        createdAt: new Date()
      },
      {
        id: "donor-1",
        email: "michael.k@example.com",
        password: "hashed_password",
        role: "donor" as const,
        name: "Michael Kumar",
        phone: "+1-555-0124",
        location: "Downtown Medical District",
        bloodGroup: "A+" as const,
        createdAt: new Date()
      },
      {
        id: "provider-1",
        email: "dr.martinez@hospital.com",
        password: "hashed_password",
        role: "healthcare_provider" as const,
        name: "Dr. Elena Martinez",
        phone: "+1-555-0125",
        location: "Downtown Medical Center",
        bloodGroup: "O+" as const,
        createdAt: new Date()
      }
    ];

    demoUsers.forEach(user => this.users.set(user.id, user));

    // Create demo patient profile
    const demoPatient: Patient = {
      id: "patient-profile-1",
      userId: "patient-1",
      dateOfBirth: new Date("1995-03-15"),
      weight: "65kg",
      diagnosis: "Beta Thalassemia Major",
      thalassemiaType: "Beta Thalassemia Major",
      recentPreTransfusionHb: "7.2 g/dL",
      symptomsBetweenTransfusions: "Mild fatigue, occasional shortness of breath",
      poorGrowthHistory: false,
      boneDeformities: false,
      recurrentInfections: false,
      organIssuesHistory: "None reported",
      transfusionFrequencyPast6Months: "Every 3-4 weeks",
      unitsPerSession: 2,
      usualTransfusionHbLevel: "10-11 g/dL",
      recentIntervalChanges: "Stable interval",
      ironChelationTherapy: "Deferasirox",
      chelationMedication: "Deferasirox 20mg/kg daily",
      chelationFrequency: "Daily",
      lastSerumFerritin: "2500 ng/mL",
      lastLiverIronMeasurement: "15 mg/g dry weight",
      adverseReactionsHistory: "None",
      manualTransfusionFrequency: null,
      transfusionHistory: [],
      nextTransfusionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      hemoglobinLevel: "7.2 g/dL",
      ironLevels: "2500 ng/mL",
      lastTransfusion: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
      totalTransfusions: 145
    };
    this.patients.set(demoPatient.id, demoPatient);

    // Create demo donor profile
    const demoDonor: Donor = {
      id: "donor-profile-1",
      userId: "donor-1",
      eligibilityStatus: true,
      lastDonation: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
      totalDonations: 12,
      availableForDonation: true,
      donationHistory: []
    };
    this.donors.set(demoDonor.id, demoDonor);

    // Create demo healthcare provider profile
    const demoProvider: HealthcareProvider = {
      id: "provider-profile-1",
      userId: "provider-1",
      hospitalName: "Downtown Medical Center",
      department: "Hematology",
      licenseNumber: "MD-12345"
    };
    this.healthcareProviders.set(demoProvider.id, demoProvider);
  }

  // User methods
  async createUser(userData: Omit<User, 'id' | 'createdAt'>): Promise<User> {
    const user: User = {
      id: this.generateId(),
      ...userData,
      createdAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async getUser(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    for (const user of Array.from(this.users.values())) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Patient methods
  async createPatient(patientData: Omit<Patient, 'id'>): Promise<Patient> {
    const patient: Patient = {
      id: this.generateId(),
      ...patientData
    };
    this.patients.set(patient.id, patient);
    return patient;
  }

  async getPatient(id: string): Promise<Patient | null> {
    return this.patients.get(id) || null;
  }

  async getPatientByUserId(userId: string): Promise<Patient | null> {
    for (const patient of Array.from(this.patients.values())) {
      if (patient.userId === userId) {
        return patient;
      }
    }
    return null;
  }

  async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
    const patient = this.patients.get(id);
    if (!patient) return null;
    
    const updatedPatient = { ...patient, ...updates };
    this.patients.set(id, updatedPatient);
    return updatedPatient;
  }

  async getPatients(): Promise<Patient[]> {
    return Array.from(this.patients.values());
  }

  // Donor methods
  async createDonor(donorData: Omit<Donor, 'id'>): Promise<Donor> {
    const donor: Donor = {
      id: this.generateId(),
      ...donorData
    };
    this.donors.set(donor.id, donor);
    return donor;
  }

  async getDonor(id: string): Promise<Donor | null> {
    return this.donors.get(id) || null;
  }

  async getDonorByUserId(userId: string): Promise<Donor | null> {
    for (const donor of Array.from(this.donors.values())) {
      if (donor.userId === userId) {
        return donor;
      }
    }
    return null;
  }

  async updateDonor(id: string, updates: Partial<Donor>): Promise<Donor | null> {
    const donor = this.donors.get(id);
    if (!donor) return null;
    
    const updatedDonor = { ...donor, ...updates };
    this.donors.set(id, updatedDonor);
    return updatedDonor;
  }

  async getDonors(): Promise<Donor[]> {
    return Array.from(this.donors.values());
  }

  async getAvailableDonors(): Promise<Donor[]> {
    return Array.from(this.donors.values()).filter(donor => 
      donor.availableForDonation && donor.eligibilityStatus
    );
  }

  // Healthcare Provider methods
  async createHealthcareProvider(providerData: Omit<HealthcareProvider, 'id'>): Promise<HealthcareProvider> {
    const provider: HealthcareProvider = {
      id: this.generateId(),
      ...providerData
    };
    this.healthcareProviders.set(provider.id, provider);
    return provider;
  }

  async getHealthcareProvider(id: string): Promise<HealthcareProvider | null> {
    return this.healthcareProviders.get(id) || null;
  }

  async getHealthcareProviderByUserId(userId: string): Promise<HealthcareProvider | null> {
    for (const provider of Array.from(this.healthcareProviders.values())) {
      if (provider.userId === userId) {
        return provider;
      }
    }
    return null;
  }

  async updateHealthcareProvider(id: string, updates: Partial<HealthcareProvider>): Promise<HealthcareProvider | null> {
    const provider = this.healthcareProviders.get(id);
    if (!provider) return null;
    
    const updatedProvider = { ...provider, ...updates };
    this.healthcareProviders.set(id, updatedProvider);
    return updatedProvider;
  }

  async getHealthcareProviders(): Promise<HealthcareProvider[]> {
    return Array.from(this.healthcareProviders.values());
  }

  // Transfusion methods
  async createTransfusion(transfusionData: Omit<PatientTransfusion, 'id'>): Promise<PatientTransfusion> {
    const transfusion: PatientTransfusion = {
      id: this.generateId(),
      ...transfusionData
    };
    this.transfusions.set(transfusion.id, transfusion);
    return transfusion;
  }

  async getTransfusion(id: string): Promise<PatientTransfusion | null> {
    return this.transfusions.get(id) || null;
  }

  async getTransfusionsByPatientId(patientId: string): Promise<PatientTransfusion[]> {
    return Array.from(this.transfusions.values()).filter(t => t.patientId === patientId);
  }

  async getTransfusionsByDonorId(donorId: string): Promise<PatientTransfusion[]> {
    return Array.from(this.transfusions.values()).filter(t => t.donorId === donorId);
  }

  async updateTransfusion(id: string, updates: Partial<PatientTransfusion>): Promise<PatientTransfusion | null> {
    const transfusion = this.transfusions.get(id);
    if (!transfusion) return null;
    
    const updatedTransfusion = { ...transfusion, ...updates };
    this.transfusions.set(id, updatedTransfusion);
    return updatedTransfusion;
  }

  async deleteTransfusion(id: string): Promise<boolean> {
    return this.transfusions.delete(id);
  }

  async getTransfusions(): Promise<PatientTransfusion[]> {
    return Array.from(this.transfusions.values());
  }

  // Notification methods
  async createNotification(notificationData: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    const notification: Notification = {
      id: this.generateId(),
      ...notificationData,
      createdAt: new Date()
    };
    this.notifications.set(notification.id, notification);
    return notification;
  }

  async getNotification(id: string): Promise<Notification | null> {
    return this.notifications.get(id) || null;
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return Array.from(this.notifications.values()).filter(n => n.userId === userId);
  }

  async updateNotification(id: string, updates: Partial<Notification>): Promise<Notification | null> {
    const notification = this.notifications.get(id);
    if (!notification) return null;
    
    const updatedNotification = { ...notification, ...updates };
    this.notifications.set(id, updatedNotification);
    return updatedNotification;
  }

  async deleteNotification(id: string): Promise<boolean> {
    return this.notifications.delete(id);
  }

  async markNotificationRead(id: string): Promise<boolean> {
    const notification = this.notifications.get(id);
    if (!notification) return false;
    
    notification.isRead = true;
    return true;
  }

  // Emergency Request methods
  async createEmergencyRequest(requestData: Omit<EmergencyRequest, 'id' | 'createdAt'>): Promise<EmergencyRequest> {
    const request: EmergencyRequest = {
      id: this.generateId(),
      ...requestData,
      createdAt: new Date()
    };
    this.emergencyRequests.set(request.id, request);
    return request;
  }

  async getEmergencyRequest(id: string): Promise<EmergencyRequest | null> {
    return this.emergencyRequests.get(id) || null;
  }

  async getEmergencyRequestsByPatientId(patientId: string): Promise<EmergencyRequest[]> {
    return Array.from(this.emergencyRequests.values()).filter(r => r.patientId === patientId);
  }

  async updateEmergencyRequest(id: string, updates: Partial<EmergencyRequest>): Promise<EmergencyRequest | null> {
    const request = this.emergencyRequests.get(id);
    if (!request) return null;
    
    const updatedRequest = { ...request, ...updates };
    this.emergencyRequests.set(id, updatedRequest);
    return updatedRequest;
  }

  async getActiveEmergencyRequests(): Promise<EmergencyRequest[]> {
    return Array.from(this.emergencyRequests.values()).filter(r => r.status === 'active');
  }

  // Donation methods
  async createDonation(donationData: Omit<DonorDonation, 'id' | 'createdAt'>): Promise<DonorDonation> {
    const donation: DonorDonation = {
      id: this.generateId(),
      ...donationData,
      createdAt: new Date()
    };
    this.donations.set(donation.id, donation);
    return donation;
  }

  async getDonation(id: string): Promise<DonorDonation | null> {
    return this.donations.get(id) || null;
  }

  async getDonationsByDonorId(donorId: string): Promise<DonorDonation[]> {
    return Array.from(this.donations.values()).filter(d => d.donorId === donorId);
  }

  async getDonationsByPatientId(patientId: string): Promise<DonorDonation[]> {
    return Array.from(this.donations.values()).filter(d => d.patientId === patientId);
  }

  async updateDonation(id: string, updates: Partial<DonorDonation>): Promise<DonorDonation | null> {
    const donation = this.donations.get(id);
    if (!donation) return null;
    
    const updatedDonation = { ...donation, ...updates };
    this.donations.set(id, updatedDonation);
    return updatedDonation;
  }

  async getDonations(): Promise<DonorDonation[]> {
    return Array.from(this.donations.values());
  }

  // Donor Family methods
  async createDonorFamily(familyData: Omit<DonorFamily, 'id' | 'assignedAt'>): Promise<DonorFamily> {
    const family: DonorFamily = {
      id: this.generateId(),
      ...familyData,
      assignedAt: new Date()
    };
    this.donorFamilies.set(family.id, family);
    return family;
  }

  async getDonorFamiliesByPatientId(patientId: string): Promise<DonorFamily[]> {
    return Array.from(this.donorFamilies.values()).filter(f => f.patientId === patientId);
  }

  async getDonorFamiliesByDonorId(donorId: string): Promise<DonorFamily[]> {
    return Array.from(this.donorFamilies.values()).filter(f => f.donorId === donorId);
  }

  async updateDonorFamily(id: string, updates: Partial<DonorFamily>): Promise<DonorFamily | null> {
    const family = this.donorFamilies.get(id);
    if (!family) return null;
    
    const updatedFamily = { ...family, ...updates };
    this.donorFamilies.set(id, updatedFamily);
    return updatedFamily;
  }

  async deactivateDonorFamily(id: string): Promise<boolean> {
    const family = this.donorFamilies.get(id);
    if (!family) return false;
    
    family.isActive = false;
    return true;
  }
}