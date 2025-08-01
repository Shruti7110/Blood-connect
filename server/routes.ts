import type { Express } from "express";
import { createServer, type Server } from "http";
import { supabase } from "./supabase";
import { insertUserSchema, insertPatientSchema, insertDonorSchema, insertHealthcareProviderSchema, insertTransfusionSchema, insertNotificationSchema, insertEmergencyRequestSchema, insertDonationSchema } from "@shared/schema";
import { SupabaseStorage } from './supabase-storage';

export async function registerRoutes(app: Express): Promise<Server> {
  // Add user validation endpoint
  app.head("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).end();
      }
      res.status(200).end();
    } catch (error) {
      res.status(500).end();
    }
  });

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);

      // Create role-specific profile
      if (user.role === "patient") {
        await storage.createPatient({ userId: user.id });
      } else if (user.role === "donor") {
        await storage.createDonor({ userId: user.id });
      } else if (user.role === "healthcare_provider") {
        await storage.createHealthcareProvider({ userId: user.id });
      }

      res.status(201).json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);

      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Login failed" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const updatedUser = await storage.updateUser(req.params.id, req.body);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ ...updatedUser, password: undefined });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  // Patient routes
  app.get("/api/patients/user/:userId", async (req, res) => {
    try {
      const patient = await storage.getPatientByUserId(req.params.userId);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  });

  app.put("/api/patients/:id", async (req, res) => {
    try {
      const updatedPatient = await storage.updatePatient(req.params.id, req.body);
      if (!updatedPatient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(updatedPatient);
    } catch (error) {
      console.error("Error updating patient:", error);
      res.status(500).json({ message: "Failed to update patient" });
    }
  });

  app.get("/api/patients/:id", async (req, res) => {
    try {
      const patient = await storage.getPatient(req.params.id);
      if (!patient) {
        return res.status(404).json({ message: "Patient not found" });
      }
      res.json(patient);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch patient" });
    }
  });

  // Get all patients with user data
  app.get("/api/patients", async (req, res) => {
    try {
      const { data: patients, error } = await supabase
        .from('patients')
        .select(`
          *,
          users!inner(
            id, name, email, phone, location, blood_group
          )
        `);

      if (error) {
        console.error('Error fetching patients:', error);
        return res.status(500).json({ message: "Failed to fetch patients" });
      }

      // Transform the data to match frontend expectations
      const transformedPatients = patients?.map((patient: any) => ({
        id: patient.id,
        userId: patient.user_id,
        hemoglobinLevel: patient.hemoglobin_level,
        ironLevels: patient.iron_levels,
        lastTransfusion: patient.last_transfusion,
        totalTransfusions: patient.total_transfusions,
        user: {
          id: patient.users.id,
          name: patient.users.name,
          email: patient.users.email,
          phone: patient.users.phone,
          location: patient.users.location,
          bloodGroup: patient.users.blood_group
        }
      })) || [];

      res.json(transformedPatients);
    } catch (error) {
      console.error('Error in patients route:', error);
      res.status(500).json({ message: "Failed to fetch patients" });
    }
  });

  // Donor routes
  app.get("/api/donors/user/:userId", async (req, res) => {
    try {
      const donor = await storage.getDonorByUserId(req.params.userId);
      if (!donor) {
        return res.status(404).json({ message: "Donor not found" });
      }
      res.json(donor);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch donor" });
    }
  });

  app.get("/api/donors/available/:bloodGroup", async (req, res) => {
    try {
      const donors = await storage.getAvailableDonors(req.params.bloodGroup);
      res.json(donors);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch available donors" });
    }
  });

  // Get all donors with user data
  app.get("/api/donors", async (req, res) => {
    try {
      const { data: donors, error } = await supabase
        .from('donors')
        .select(`
          *,
          users!inner(
            id, name, email, phone, location, blood_group
          )
        `);

      if (error) {
        console.error('Error fetching donors:', error);
        return res.status(500).json({ message: "Failed to fetch donors" });
      }

      // Transform the data to match frontend expectations
      const transformedDonors = donors?.map((donor: any) => ({
        id: donor.id,
        userId: donor.user_id,
        availableForDonation: donor.available_for_donation,
        totalDonations: donor.total_donations,
        lastDonation: donor.last_donation,
        eligibilityStatus: donor.eligibility_status,
        user: {
          id: donor.users.id,
          name: donor.users.name,
          email: donor.users.email,
          phone: donor.users.phone,
          location: donor.users.location,
          bloodGroup: donor.users.blood_group
        }
      })) || [];

      res.json(transformedDonors);
    } catch (error) {
      console.error('Error in donors route:', error);
      res.status(500).json({ message: "Failed to fetch donors" });
    }
  });

  // Healthcare Provider routes
  app.get("/api/providers/user/:userId", async (req, res) => {
    try {
      const provider = await storage.getHealthcareProviderByUserId(req.params.userId);
      if (!provider) {
        return res.status(404).json({ message: "Healthcare provider not found" });
      }
      res.json(provider);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch healthcare provider" });
    }
  });

  // Transfusion routes
  app.get("/api/transfusions/patient/:patientId", async (req, res) => {
    try {
      const transfusions = await storage.getTransfusionsByPatient(req.params.patientId);
      res.json(transfusions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transfusions" });
    }
  });

  app.get("/api/transfusions/donor/:donorId", async (req, res) => {
    try {
      const transfusions = await storage.getTransfusionsByDonor(req.params.donorId);
      // Ensure consistent date field naming
      const normalizedTransfusions = transfusions.map((t: any) => ({
        ...t,
        scheduledDate: t.scheduledDate || t.scheduled_date || t.date
      }));
      res.json(normalizedTransfusions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch transfusions" });
    }
  });

  app.get("/api/transfusions/upcoming", async (req, res) => {
    try {
      const transfusions = await storage.getUpcomingTransfusions();
      res.json(transfusions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch upcoming transfusions" });
    }
  });

  app.post("/api/transfusions", async (req, res) => {
    try {
      console.log("Received transfusion data:", req.body);
      const transfusionData = insertTransfusionSchema.parse(req.body);
      const transfusion = await storage.createTransfusion(transfusionData);
      res.status(201).json(transfusion);
    } catch (error: any) {
      console.error("Transfusion creation error:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: "Invalid transfusion data", details: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create transfusion" });
      }
    }
  });

  app.put("/api/transfusions/:id", async (req, res) => {
    try {
      const updatedTransfusion = await storage.updateTransfusion(req.params.id, req.body);
      if (!updatedTransfusion) {
        return res.status(404).json({ message: "Transfusion not found" });
      }
      res.json(updatedTransfusion);
    } catch (error) {
      res.status(500).json({ message: "Failed to update transfusion" });
    }
  });

  // Donor-Patient relationship routes
  app.get("/api/donor-patients/:donorId", async (req, res) => {
    try {
      // This is a placeholder - you may need to implement this in storage
      res.json([]);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch donor patients" });
    }
  });

  // Get patients assigned to a donor
  app.get("/api/donor-families/:donorId", async (req, res) => {
    try {
      const { donorId } = req.params;

      const { data: assignments, error } = await supabase
        .from('donor_families')
        .select(`
          *,
          patients!inner(
            id,
            user_id,
            users!inner(id, name, blood_group, location)
          )
        `)
        .eq('donor_id', donorId)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching donor families:', error);
        return res.status(500).json({ message: "Failed to fetch assigned patients" });
      }

      const patients = (assignments || []).map((assignment: any) => ({
        id: assignment.patients.id,
        user_id: assignment.patients.user_id,
        name: assignment.patients.users.name,
        bloodGroup: assignment.patients.users.blood_group,
        location: assignment.patients.users.location,
        assignedAt: assignment.assigned_at
      }));

      res.json(patients);
    } catch (error) {
      console.error('Error in donor families route:', error);
      res.status(500).json({ message: "Failed to fetch assigned patients" });
    }
  });

  // Donor Family routes
  app.get("/api/donor-family/:patientId", async (req, res) => {
    try {
      const { patientId } = req.params;
      const family = await storage.getDonorFamiliesByPatientId(patientId);

      console.log("Raw family data from storage:", JSON.stringify(family, null, 2));

      // Transform the data to match what the frontend expects
      const transformedFamily = family.map((item: any) => ({
        id: item.id,
        donorId: item.donor_id,
        patientId: item.patient_id,
        assignedAt: item.assigned_at || item.assigned_date,
        isActive: item.is_active,
        // Map donor data to expected structure
        donor: {
          id: item.donors?.id,
          availableForDonation: item.donors?.available_for_donation,
          total_donations: item.donors?.total_donations,
          last_donation: item.donors?.last_donation,
          eligibility_status: item.donors?.eligibility_status
        },
        // Map user data to expected structure  
        user: {
          id: item.donors?.users?.id,
          name: item.donors?.users?.name,
          phone: item.donors?.users?.phone,
          location: item.donors?.users?.location,
          bloodGroup: item.donors?.users?.blood_group
        }
      }));

      console.log("Transformed family data:", JSON.stringify(transformedFamily, null, 2));

      // Calculate blood stock data
      const bloodStock = {
        totalAvailableUnits: transformedFamily.filter(m => m.donor?.availableForDonation).length * 2,
        totalUnitsUsed: transformedFamily.reduce((sum, m) => sum + (m.donor?.total_donations || 0), 0),
        nextAppointment: null, // Could be calculated from upcoming transfusions
      };

      res.json({ family: transformedFamily, bloodStock });
    } catch (error) {
      console.error('Error fetching donor family:', error);
      res.status(500).json({ error: "Failed to fetch donor family" });
    }
  });

  app.post("/api/donor-family", async (req, res) => {
    try {
      const { patientId, donorId } = req.body;
      const familyMember = await storage.assignDonorToFamily(patientId, donorId);
      res.status(201).json(familyMember);
    } catch (error) {
      res.status(400).json({ message: "Failed to assign donor to family" });
    }
  });

  // Notification routes
  app.get("/api/notifications/user/:userId", async (req, res) => {
    try {
      const notifications = await storage.getNotificationsByUser(req.params.userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notifications" });
    }
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const notificationData = insertNotificationSchema.parse(req.body);
      const notification = await storage.createNotification(notificationData);
      res.status(201).json(notification);
    } catch (error) {
      res.status(400).json({ message: "Invalid notification data" });
    }
  });

  app.put("/api/notifications/:id/read", async (req, res) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to mark notification as read" });
    }
  });



  // Donor Assignment routes
  app.post("/api/assign-donors", async (req, res) => {
    try {
      const assignments = await assignDonorsToPatients();
      res.json({ message: "Donors assigned successfully", assignments });
    } catch (error) {
      console.error("Donor assignment error:", error);
      res.status(500).json({ message: "Failed to assign donors" });
    }
  });

  // Emergency Request routes
  app.get("/api/emergency-requests/patient/:patientId", async (req, res) => {
    try {
      const requests = await storage.getEmergencyRequestsByPatient(req.params.patientId);
      res.json(requests);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch emergency requests" });
    }
  });

  app.post("/api/emergency-requests", async (req, res) => {
    try {
      const requestData = insertEmergencyRequestSchema.parse(req.body);
      const request = await storage.createEmergencyRequest(requestData);
      res.status(201).json(request);
    } catch (error: any) {
      console.error("Emergency request creation error:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: "Invalid emergency request data", details: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create emergency request" });
      }
    }
  });

  // Donations routes
  app.get("/api/donations/upcoming", async (req, res) => {
    try {
      // Get upcoming donations from Supabase
      const { data: donations, error } = await supabase
        .from('donations')
        .select(`
          *,
          donors!inner(
            *,
            users!inner(*)
          )
        `)
        .gte('scheduled_date', new Date().toISOString())
        .eq('status', 'scheduled')
        .order('scheduled_date', { ascending: true });

      if (error) {
        console.error('Error fetching upcoming donations:', error);
        return res.status(500).json({ message: "Failed to fetch upcoming donations" });
      }

      res.json(donations || []);
    } catch (error) {
      console.error('Error in upcoming donations route:', error);
      res.status(500).json({ message: "Failed to fetch upcoming donations" });
    }
  });

  // Create donations table if it doesn't exist
  const createDonationsTable = async () => {
    try {
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS donations (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            donor_id UUID REFERENCES donors(id) NOT NULL,
            patient_id UUID REFERENCES patients(id),
            scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
            completed_date TIMESTAMP WITH TIME ZONE,
            location TEXT NOT NULL,
            units_available INTEGER DEFAULT 2,
            status appointment_status DEFAULT 'scheduled',
            notes TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );

          CREATE INDEX IF NOT EXISTS idx_donations_donor_id ON donations(donor_id);
          CREATE INDEX IF NOT EXISTS idx_donations_patient_id ON donations(patient_id);
          CREATE INDEX IF NOT EXISTS idx_donations_scheduled_date ON donations(scheduled_date);
        `
      });

      if (createError) {
        console.error("Error creating donations table:", createError);
        // Try alternative approach
        const { error: altError } = await supabase
          .from('donations')
          .select('id')
          .limit(1);

        if (altError && altError.code === '42P01') {
          console.log("Donations table doesn't exist, creating it manually...");
          // We'll handle this in the route
        }
      }
    } catch (error) {
      console.error("Error in createDonationsTable:", error);
    }
  };

  // Donations routes
  app.post("/api/donations", async (req, res) => {
    try {
      console.log("Received donation data:", JSON.stringify(req.body, null, 2));

      // First check if donations table exists
      const { data: testData, error: testError } = await supabase
        .from('donations')
        .select('id')
        .limit(1);

      if (testError && testError.code === '42P01') {
        console.log("Donations table doesn't exist. Please create it in your Supabase database.");
        return res.status(500).json({ 
          message: "Donations table doesn't exist. Please run the database schema to create it.",
          code: testError.code
        });
      }

      const donationData = insertDonationSchema.parse(req.body);

      // Get the first patient assigned to this donor from donor_families table
      const { data: donorFamilies, error: familyError } = await supabase
        .from('donor_families')
        .select('patient_id')
        .eq('donor_id', donationData.donorId)
        .eq('is_active', true)
        .limit(1);

      if (familyError) {
        console.error("Error fetching donor families:", familyError);
        return res.status(500).json({ message: "Failed to fetch donor assignments" });
      }

      const patientId = donorFamilies && donorFamilies.length > 0 ? donorFamilies[0].patient_id : null;

      // Log the incoming data for debugging
      console.log("Processing donation data...");

      // Try to insert with minimal required fields first
      console.log("Attempting donation insert with minimal data...");
      const insertData = {
        donor_id: donationData.donorId,
        scheduled_date: donationData.scheduledDate,
        location: donationData.location,
        status: donationData.status || 'scheduled'
      };

      if (patientId) {
        insertData.patient_id = patientId;
      }

      if (donationData.unitsAvailable) {
        insertData.units_available = donationData.unitsAvailable;
      }

      if (donationData.notes) {
        insertData.notes = donationData.notes;
      }

      console.log("Final insert data:", insertData);

      const { data: donation, error } = await supabase
        .from('donations')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error("Supabase error object:", error);
        console.error("Error properties:", Object.keys(error));
        console.error("Error string:", String(error));
        console.error("Error JSON:", JSON.stringify(error, null, 2));
        return res.status(500).json({ 
          message: "Failed to create donation", 
          error: String(error),
          details: error
        });
      }

      res.status(201).json(donation);
    } catch (error: any) {
      console.error("Donation creation error:", error);
      if (error.name === 'ZodError') {
        res.status(400).json({ message: "Invalid donation data", details: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create donation" });
      }
    }
  });

  app.get("/api/donations/donor/:donorId", async (req, res) => {
    try {
      const { donorId } = req.params;

      const { data: donations, error } = await supabase
        .from('donations')
        .select('*')
        .eq('donor_id', donorId)
        .order('scheduled_date', { ascending: false });

      if (error) {
        console.error("Error fetching donations:", error);
        throw error;
      }

      res.json(donations || []);
    } catch (error) {
      console.error("Error in donations route:", error);
      res.status(500).json({ message: "Failed to fetch donations" });
    }
  });

  // Get transfusions for a specific donor
  app.get('/api/transfusions/donor/:donorId', async (req, res) => {
    try {
      const { donorId } = req.params;
      const transfusions = await storage.getTransfusionsByDonorId(donorId);
      res.json(transfusions);
    } catch (error) {
      console.error('Error fetching donor transfusions:', error);
      res.status(500).json({ error: 'Failed to fetch transfusions' });
    }
  });

  // Get donations for a specific donor
  app.get('/api/donations/donor/:donorId', async (req, res) => {
    try {
      const { donorId } = req.params;
      const donations = await storage.getDonationsByDonorId(donorId);
      res.json(donations);
    } catch (error) {
      console.error('Error fetching donor donations:', error);
      res.status(500).json({ error: 'Failed to fetch donations' });
    }
  });

  // Update donation status
  app.put('/api/donations/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const donation = await storage.updateDonation(id, updates);
      if (!donation) {
        return res.status(404).json({ error: 'Donation not found' });
      }
      res.json(donation);
    } catch (error) {
      console.error('Error updating donation:', error);
      res.status(500).json({ error: 'Failed to update donation' });
    }
  });

  // Update patient health data
  app.put("/api/patients/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;

      const updatedPatient = await storage.updatePatient(id, updates);
      if (!updatedPatient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      res.json(updatedPatient);
    } catch (error) {
      console.error("Error updating patient:", error);
      res.status(500).json({ error: "Failed to update patient" });
    }
  });

  // Update patient health metrics
  app.put("/api/patients/:id/health", async (req, res) => {
    try {
      const { id } = req.params;
      const healthMetrics = req.body;

      // Convert field names to match database schema
      const updates: any = {};
      if (healthMetrics.hemoglobinLevel) updates.hemoglobin_level = parseFloat(healthMetrics.hemoglobinLevel);
      if (healthMetrics.ironLevels) updates.iron_levels = parseFloat(healthMetrics.ironLevels);
      if (healthMetrics.ferritinLevels) updates.ferritin_levels = parseFloat(healthMetrics.ferritinLevels);
      if (healthMetrics.weight) updates.weight = parseFloat(healthMetrics.weight);
      if (healthMetrics.bloodPressure) updates.blood_pressure = healthMetrics.bloodPressure;
      if (healthMetrics.heartRate) updates.heart_rate = parseInt(healthMetrics.heartRate);

      const updatedPatient = await storage.updatePatient(id, updates);
      if (!updatedPatient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      res.json(updatedPatient);
    } catch (error) {
      console.error("Error updating patient health metrics:", error);
      res.status(500).json({ error: "Failed to update health metrics" });
    }
  });

  // Get donor family for a patient
  app.get("/api/donor-family/:patientId", async (req, res) => {
    try {
      const { patientId } = req.params;
      const donorFamily = await storage.getDonorFamilyByPatientId(patientId);

      if (!donorFamily || donorFamily.length === 0) {
        return res.json({ family: [], availableUnits: 0 });
      }

      // Get full donor and user details for each family member
      const familyWithDetails = await Promise.all(
        donorFamily.map(async (member: any) => {
          const donor = await storage.getDonor(member.donorId);
          const user = donor ? await storage.getUserById(donor.userId) : null;

          return {
            ...member,
            donor,
            user
          };
        })
      );

      // Count available units from active, available donors
      const availableUnits = familyWithDetails.reduce((total, member) => {
        if (member.isActive && member.donor?.availableForDonation) {
          return total + 2; // Each donor can provide 2 units
        }
        return total;
      }, 0);

      res.json({
        family: familyWithDetails,
        availableUnits
      });
    } catch (error) {
      console.error("Error fetching donor family:", error);
      res.status(500).json({ error: "Failed to fetch donor family" });
    }
  });

  // Get all donor families (for healthcare providers)
  app.get("/api/donor-families/all", async (req, res) => {
    try {
      const allDonorFamilies = await storage.getAllDonorFamilies();
      res.json(allDonorFamilies);
    } catch (error) {
      console.error("Error fetching all donor families:", error);
      res.status(500).json({ error: "Failed to fetch donor families" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

const storage = new SupabaseStorage();

// Blood group compatibility mapping
const BLOOD_GROUP_COMPATIBILITY = {
  "A+": ["A+", "A-", "O+", "O-"],
  "A-": ["A-", "O-"],
  "B+": ["B+", "B-", "O+", "O-"],
  "B-": ["B-", "O-"],
  "AB+": ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
  "AB-": ["A-", "B-", "AB-", "O-"],
  "O+": ["O+", "O-"],
  "O-": ["O-"]
};

function daysSinceLastDonation(donationDateStr: string | null): number {
  if (!donationDateStr) {
    return Infinity; // Treat missing donation date as never donated
  }

  const donationDate = new Date(donationDateStr);
  const today = new Date();
  const diffTime = today.getTime() - donationDate.getTime();
  return Math.floor(diffTime / (1000 * 3600 * 24));
}

function getCompatibleDonors(patientBloodGroup: string, patientLocation: string, allDonors: any[]): any[] {
  const compatibleGroups = BLOOD_GROUP_COMPATIBILITY[patientBloodGroup as keyof typeof BLOOD_GROUP_COMPATIBILITY] || [];

  // Filter donors by compatible blood groups AND matching location
  const compatibleDonors = allDonors.filter(donor => 
    compatibleGroups.includes(donor.blood_group) && 
    donor.location === patientLocation
  );

  // Sort donors by most recent donation first
  compatibleDonors.sort((a, b) => {
    const daysA = daysSinceLastDonation(a.last_donation_date);
    const daysB = daysSinceLastDonation(b.last_donation_date);
    return daysA - daysB;
  });

  return compatibleDonors;
}

async function assignDonorsToPatients(maxDonorsPerPatient: number = 20) {
  try {
    // Fetch all patients and donors from Supabase
    const { data: patientsData, error: patientsError } = await supabase
      .from('patients')
      .select(`
        id,
        user_id,
        users!inner(id, name, blood_group, location)
      `);

    const { data: donorsData, error: donorsError } = await supabase
      .from('donors')
      .select(`
        id,
        user_id,
        last_donation_date,
        available_for_donation,
        users!inner(id, name, blood_group, location)
      `)
      .eq('available_for_donation', true);

    if (patientsError || donorsError) {
      throw new Error('Failed to fetch patients or donors');
    }

    const patients = (patientsData || []).map(p => ({
      id: p.id,
      user_id: p.user_id,
      name: (p as any).users.name,
      blood_group: (p as any).users.blood_group,
      location: (p as any).users.location
    }));

    let donors = (donorsData || []).map(d => ({
      id: d.id,
      user_id: d.user_id,
      name: (d as any).users.name,
      blood_group: (d as any).users.blood_group,
      location: (d as any).users.location,
      last_donation_date: (d as any).last_donation_date
    }));

    const assignments: Record<string, any[]> = {};

    for (const patient of patients) {
      const compatibleDonors = getCompatibleDonors(patient.blood_group, patient.location, donors);

      // Separate donors into recent (<= 180 days) and others
      const recentDonors = [];
      const otherDonors = [];

      for (const donor of compatibleDonors) {
        const daysSince = daysSinceLastDonation(donor.last_donation_date);
        if (daysSince <= 180) { // 6 months in days
          recentDonors.push(donor);
        } else {
          otherDonors.push(donor);
        }
      }

      // Combine recent donors first, then others if needed
      const allEligible = [...recentDonors, ...otherDonors];
      const assignedDonors = allEligible.slice(0, maxDonorsPerPatient);

      assignments[patient.id] = assignedDonors;

      // Save assignments to donor_families table
      for (const donor of assignedDonors) {
        await supabase
          .from('donor_families')
          .upsert({
            patient_id: patient.id,
            donor_id: donor.id,
            assigned_date: new Date().toISOString(),
            is_active: true
          }, {
            onConflict: 'patient_id,donor_id'
          });
      }

      // Remove assigned donors from the pool
      const assignedIds = new Set(assignedDonors.map(d => d.id));
      donors = donors.filter(d => !assignedIds.has(d.id));
    }

    return assignments;
  } catch (error) {
    console.error('Error in assignDonorsToPatients:', error);
    throw error;
  }
}