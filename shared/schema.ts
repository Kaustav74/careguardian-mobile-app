import { pgEnum, pgTable, serial, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["user", "hospital", "ambulance"]);

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("user"),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  hospitalName: text("hospital_name"),
  city: text("city"),
  state: text("state"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const healthData = pgTable("health_data", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  heartRate: integer("heart_rate"),
  bloodPressure: text("blood_pressure"),
  glucose: integer("glucose"),
  temperature: integer("temperature"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const medicalRecords = pgTable("medical_records", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  fileUrl: text("file_url"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const doctors = pgTable("doctors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  hospital: text("hospital").notNull(),
  availability: text("availability").notNull()
});

export const hospitals = pgTable("hospitals", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  departments: jsonb("departments").$type<string[]>().default([]).notNull()
});

export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  doctorId: integer("doctor_id").notNull(),
  type: text("type").notNull(),
  status: text("status").notNull().default("scheduled"),
  scheduledFor: timestamp("scheduled_for").notNull(),
  metadata: jsonb("metadata").$type<Record<string, string>>().default({}).notNull()
});

export const emergencies = pgTable("emergencies", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  incidentType: text("incident_type").notNull(),
  status: text("status").notNull().default("open"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});

export const ambulanceBookings = pgTable("ambulance_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  pickup: text("pickup").notNull(),
  dropoff: text("dropoff").notNull(),
  status: text("status").notNull().default("requested"),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
