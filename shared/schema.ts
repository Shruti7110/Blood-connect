import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const userRoleEnum = pgEnum("user_role", ["patient", "donor", "healthcare_provider"]);
export const bloodGroupEnum = pgEnum("blood_group", ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]);
export const urgencyLevelEnum = pgEnum("urgency_level", ["low", "medium", "high", "critical"]);
export const appointmentStatusEnum = pgEnum("appointment_status", ["scheduled", "completed", "cancelled", "missed"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").notNull(),
  name: text("name").notNull(),
  phone: text("phone"),
  location: text("location"),
  bloodGroup: bloodGroupEnum("blood_group"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const patients = pgTable("patients", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  diagnosis: text("diagnosis"),
  transfusionHistory: jsonb("transfusion_history").default(sql`'[]'`),
  ironChelationTherapy: text("iron_chelation_therapy"),
  nextTransfusionDate: timestamp("next_transfusion_date"),
  hemoglobinLevel: text("hemoglobin_level"),
  ironLevels: text("iron_levels"),
  lastTransfusion: timestamp("last_transfusion"),
  totalTransfusions: integer("total_transfusions").default(0),
});

export const donors = pgTable("donors", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  eligibilityStatus: boolean("eligibility_status").default(true),
  lastDonation: timestamp("last_donation"),
  totalDonations: integer("total_donations").default(0),
  availableForDonation: boolean("available_for_donation").default(true),
  donationHistory: jsonb("donation_history").default(sql`'[]'`),
});

export const healthcareProviders = pgTable("healthcare_providers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  hospitalName: text("hospital_name"),
  department: text("department"),
  licenseNumber: text("license_number"),
});

export const donorFamilies = pgTable("donor_families", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").references(() => patients.id).notNull(),
  donorId: varchar("donor_id").references(() => donors.id).notNull(),
  assignedAt: timestamp("assigned_at").defaultNow(),
  isActive: boolean("is_active").default(true),
});

export const transfusions = pgTable("transfusions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").references(() => patients.id).notNull(),
  donorId: varchar("donor_id").references(() => donors.id),
  providerId: varchar("provider_id").references(() => healthcareProviders.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  completedDate: timestamp("completed_date"),
  status: appointmentStatusEnum("status").default("scheduled"),
  unitsRequired: integer("units_required").default(1),
  location: text("location"),
  notes: text("notes"),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  type: text("type").notNull(),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emergencyRequests = pgTable("emergency_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  patientId: varchar("patient_id").references(() => patients.id).notNull(),
  urgencyLevel: urgencyLevelEnum("urgency_level").notNull(),
  unitsNeeded: integer("units_needed").notNull(),
  notes: text("notes"),
  status: text("status").default("pending"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertPatientSchema = createInsertSchema(patients).omit({
  id: true,
});

export const insertDonorSchema = createInsertSchema(donors).omit({
  id: true,
});

export const insertHealthcareProviderSchema = createInsertSchema(healthcareProviders).omit({
  id: true,
});

export const insertTransfusionSchema = createInsertSchema(transfusions).omit({
  id: true,
  completedDate: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertEmergencyRequestSchema = createInsertSchema(emergencyRequests).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Patient = typeof patients.$inferSelect;
export type InsertPatient = z.infer<typeof insertPatientSchema>;
export type Donor = typeof donors.$inferSelect;
export type InsertDonor = z.infer<typeof insertDonorSchema>;
export type HealthcareProvider = typeof healthcareProviders.$inferSelect;
export type InsertHealthcareProvider = z.infer<typeof insertHealthcareProviderSchema>;
export type Transfusion = typeof transfusions.$inferSelect;
export type InsertTransfusion = z.infer<typeof insertTransfusionSchema>;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type EmergencyRequest = typeof emergencyRequests.$inferSelect;
export type InsertEmergencyRequest = z.infer<typeof insertEmergencyRequestSchema>;
export type DonorFamily = typeof donorFamilies.$inferSelect;
