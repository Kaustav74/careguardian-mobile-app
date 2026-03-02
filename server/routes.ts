import { Router } from "express";
import { z } from "zod";
import { db } from "./db";
import { ambulanceBookings, appointments, doctors, emergencies, healthData, hospitals, medicalRecords, users } from "@shared/schema";
import { desc, eq } from "drizzle-orm";
import passport, { hashPassword } from "./auth";
import OpenAI from "openai";

const router = Router();

const registerSchema = z
  .object({
    username: z.string().min(3),
    password: z.string().min(6),
    fullName: z.string().min(2),
    email: z.string().email(),
    role: z.enum(["user", "hospital", "ambulance"]),
    hospitalName: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional()
  })
  .refine((v) => (v.role === "hospital" ? v.hospitalName && v.city && v.state : true), "Hospital fields required");

router.post("/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const input = parsed.data;
  const [exists] = await db.select().from(users).where(eq(users.username, input.username));
  if (exists) return res.status(409).json({ error: "Username exists" });

  const [user] = await db
    .insert(users)
    .values({
      username: input.username,
      passwordHash: await hashPassword(input.password),
      fullName: input.fullName,
      email: input.email,
      role: input.role,
      hospitalName: input.hospitalName,
      city: input.city,
      state: input.state
    })
    .returning();

  req.login({ id: user.id, username: user.username, role: user.role, fullName: user.fullName }, (err) => {
    if (err) return res.status(500).json({ error: "login_failed" });
    return res.status(201).json({ user: req.user });
  });
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err: Error, user: Express.User) => {
    if (err || !user) return res.status(401).json({ error: "Invalid credentials" });
    req.login(user, (loginErr) => {
      if (loginErr) return res.status(500).json({ error: "login_failed" });
      return res.json({ user });
    });
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  req.logout(() => {
    req.session.destroy(() => res.json({ ok: true }));
  });
});

router.get("/user", (req, res) => {
  if (!req.isAuthenticated()) return res.status(401).json({ error: "unauthorized" });
  return res.json(req.user);
});

const mustAuth = (req: any, res: any, next: any) => (req.isAuthenticated() ? next() : res.status(401).json({ error: "unauthorized" }));

router.get("/health-data", mustAuth, async (req, res) => {
  const rows = await db.select().from(healthData).where(eq(healthData.userId, req.user.id)).orderBy(desc(healthData.id));
  res.json(rows);
});

router.post("/health-data", mustAuth, async (req, res) => {
  const [row] = await db.insert(healthData).values({ userId: req.user.id, ...req.body }).returning();
  res.status(201).json(row);
});

router.get("/medical-records", mustAuth, async (req, res) => {
  const rows = await db.select().from(medicalRecords).where(eq(medicalRecords.userId, req.user.id)).orderBy(desc(medicalRecords.id));
  res.json(rows);
});

router.post("/medical-records", mustAuth, async (req, res) => {
  const [row] = await db.insert(medicalRecords).values({ userId: req.user.id, ...req.body }).returning();
  res.status(201).json(row);
});

router.get("/doctors", mustAuth, async (_req, res) => res.json(await db.select().from(doctors)));
router.get("/hospitals", mustAuth, async (_req, res) => res.json(await db.select().from(hospitals)));

router.get("/appointments", mustAuth, async (req, res) => {
  const rows = await db.select().from(appointments).where(eq(appointments.userId, req.user.id)).orderBy(desc(appointments.id));
  res.json(rows);
});
router.post("/appointments", mustAuth, async (req, res) => {
  const [row] = await db
    .insert(appointments)
    .values({ userId: req.user.id, doctorId: req.body.doctorId, type: req.body.type, scheduledFor: new Date(req.body.scheduledFor), metadata: req.body.metadata || {} })
    .returning();
  res.status(201).json(row);
});

router.post("/emergencies", mustAuth, async (req, res) => {
  const [row] = await db.insert(emergencies).values({ userId: req.user.id, incidentType: req.body.incidentType, notes: req.body.notes }).returning();
  res.status(201).json(row);
});

router.post("/ambulance-bookings", mustAuth, async (req, res) => {
  const [row] = await db.insert(ambulanceBookings).values({ userId: req.user.id, pickup: req.body.pickup, dropoff: req.body.dropoff }).returning();
  res.status(201).json(row);
});

router.post("/ai/symptom-analysis", mustAuth, async (req, res) => {
  if (!process.env.OPENAI_API_KEY) return res.status(400).json({ error: "OPENAI_API_KEY missing" });
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "Return JSON {urgencyLevel,possibleConditions,firstAid,nextSteps}." },
      { role: "user", content: `Symptoms: ${req.body.symptoms}` }
    ]
  });
  res.json(JSON.parse(completion.choices[0].message.content || "{}"));
});

router.post("/ai/first-aid", mustAuth, async (req, res) => {
  if (!process.env.OPENAI_API_KEY) return res.status(400).json({ error: "OPENAI_API_KEY missing" });
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const completion = await client.chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "Return JSON {steps,warnings,whenToCallEmergency}." },
      { role: "user", content: `Emergency context: ${req.body.context}` }
    ]
  });
  res.json(JSON.parse(completion.choices[0].message.content || "{}"));
});

export default router;
