import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { supabase } from "./supabase";
import { insertUserSchema, insertPatientSchema, insertDonorSchema, insertHealthcareProviderSchema, insertTransfusionSchema, insertNotificationSchema, insertEmergencyRequestSchema } from "@shared/schema";

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
      res.json(transfusions);
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

  // Donor Family routes
  app.get("/api/donor-family/:patientId", async (req, res) => {
    try {
      const family = await storage.getDonorFamily(req.params.patientId);
      
      // Get donor and user details for each family member
      const familyWithDetails = await Promise.all(
        family.map(async (member) => {
          const donor = await storage.getDonor(member.donorId);
          const user = donor ? await storage.getUser(donor.userId) : null;
          return {
            ...member,
            donor,
            user: user ? { ...user, password: undefined } : null,
          };
        })
      );
      
      res.json(familyWithDetails);
    } catch (error) {
      console.error("Error fetching donor family:", error);
      res.status(500).json({ message: "Failed to fetch donor family" });
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

  const httpServer = createServer(app);
  return httpServer;
}
