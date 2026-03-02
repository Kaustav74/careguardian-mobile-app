const express = require("express");
const cors = require("cors");
const http = require("http");
const jwt = require("jsonwebtoken");
const { Server } = require("socket.io");
const path = require("path");

const JWT_SECRET = process.env.JWT_SECRET || "careguardian-dev-secret";
const PORT = process.env.PORT || 4000;

const app = express();
app.use(cors());
app.use(express.json({ limit: "4mb" }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const db = {
  users: [
    {
      id: "u1",
      phone: "9000000001",
      password: "demo123",
      role: "user",
      name: "Asha Roy",
      guardianIds: ["u2"]
    },
    {
      id: "u2",
      phone: "9000000002",
      password: "demo123",
      role: "guardian",
      name: "Rahul Roy",
      guardianIds: []
    },
    {
      id: "h1_admin",
      phone: "9111111111",
      password: "demo123",
      role: "hospital_admin",
      hospitalId: "h1",
      name: "CityCare Desk"
    }
  ],
  hospitals: [
    { id: "h1", name: "CityCare Hospital", lat: 22.5726, lng: 88.3639, beds: 8, icu: 2, ambulanceReady: 2 },
    { id: "h2", name: "Sunrise Medical Center", lat: 22.586, lng: 88.402, beds: 4, icu: 1, ambulanceReady: 1 }
  ],
  emergencies: [],
  admissions: [],
  notifications: [],
  auditLogs: []
    { id: "u1", phone: "9000000001", password: "demo123", role: "user", name: "Asha Roy", guardianIds: ["u2"] },
    { id: "u2", phone: "9000000002", password: "demo123", role: "guardian", name: "Rahul Roy", guardianIds: [] },
    { id: "h1_admin", phone: "9111111111", password: "demo123", role: "hospital_admin", hospitalId: "h1", name: "CityCare Desk" }
  ],
  hospitals: [
    { id: "h1", name: "CityCare Hospital", lat: 22.5726, lng: 88.3639, beds: 8, icu: 2, ambulanceReady: 2 },
    { id: "h2", name: "Sunrise Medical Center", lat: 22.5860, lng: 88.4020, beds: 4, icu: 1, ambulanceReady: 1 }
  ],
  emergencies: []
};

const toRadians = (v) => (v * Math.PI) / 180;
function distanceKm(a, b) {
  const R = 6371;
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const q =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(a.lat)) * Math.cos(toRadians(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
}

function nearestHospital(location) {
  return db.hospitals
    .filter((h) => h.beds > 0 || h.icu > 0)
    .map((h) => ({ ...h, distanceKm: distanceKm(location, h) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)[0];
}

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role, hospitalId: user.hospitalId || null }, JWT_SECRET, {
    expiresIn: "12h"
  });
}

function auth(req, res, next) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ error: "missing_token" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
  } catch (err) {
    return res.status(401).json({ error: "invalid_token" });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "forbidden" });
    next();
  };
}

function writeAudit(eventType, actorId, payload) {
  const event = {
    id: `audit_${Date.now()}_${Math.floor(Math.random() * 1e4)}`,
    eventType,
    actorId,
    payload,
    createdAt: new Date().toISOString()
  };
  db.auditLogs.push(event);
  io.emit("audit:created", event);
}

function pushNotification(userId, type, title, body, data = {}) {
  const item = {
    id: `ntf_${Date.now()}_${Math.floor(Math.random() * 1e4)}`,
    userId,
    type,
    title,
    body,
    data,
    createdAt: new Date().toISOString(),
    read: false
  };
  db.notifications.push(item);
  io.emit("notification:created", item);
  return item;
}

function notifyGuardians(userId, title, body, data = {}) {
  const user = db.users.find((u) => u.id === userId);
  if (!user?.guardianIds?.length) return;
  user.guardianIds.forEach((guardianId) => pushNotification(guardianId, "guardian_alert", title, body, data));
}

function emergencyStatusUpdate(emergency, status, ambulanceStatus) {
  emergency.status = status;
  emergency.ambulanceStatus = ambulanceStatus;
  emergency.updatedAt = new Date().toISOString();
  io.emit("emergency:updated", emergency);

  notifyGuardians(
    emergency.userId,
    `Emergency status: ${status}`,
    `Emergency ${emergency.id} is now ${status}.`,
    { emergencyId: emergency.id, status }
  );

  writeAudit("emergency_status_updated", emergency.userId, {
    emergencyId: emergency.id,
    status,
    ambulanceStatus,
    hospitalId: emergency.hospitalId
  });
}

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "careguardian-core" });
});

app.post("/auth/login", (req, res) => {
  const { phone, password } = req.body || {};
  const user = db.users.find((u) => u.phone === phone && u.password === password);
  if (!user) return res.status(401).json({ error: "invalid_credentials" });

  writeAudit("auth_login", user.id, { role: user.role });
  res.json({
    token: signToken(user),
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      guardianIds: user.guardianIds || [],
      hospitalId: user.hospitalId || null
    }
  res.json({
    token: signToken(user),
    user: { id: user.id, name: user.name, role: user.role, guardianIds: user.guardianIds || [], hospitalId: user.hospitalId || null }
  });
});

app.get("/hospitals/availability", (_req, res) => {
  res.json(db.hospitals.map(({ id, name, beds, icu, ambulanceReady }) => ({ id, name, beds, icu, ambulanceReady })));
});

app.post("/dashboard/hospitals/:id/availability", auth, requireRole("hospital_admin"), (req, res) => {
  const hospital = db.hospitals.find((h) => h.id === req.params.id && h.id === req.user.hospitalId);
  if (!hospital) return res.status(404).json({ error: "hospital_not_found" });

  const { beds, icu, ambulanceReady } = req.body || {};
  if (typeof beds === "number") hospital.beds = Math.max(0, beds);
  if (typeof icu === "number") hospital.icu = Math.max(0, icu);
  if (typeof ambulanceReady === "number") hospital.ambulanceReady = Math.max(0, ambulanceReady);

  io.emit("hospital:availability_updated", hospital);
  writeAudit("hospital_availability_updated", req.user.sub, {
    hospitalId: hospital.id,
    beds: hospital.beds,
    icu: hospital.icu,
    ambulanceReady: hospital.ambulanceReady
  });

  res.json({ ok: true, hospital });
});

app.post("/emergencies", auth, requireRole("user"), (req, res) => {
  const { location, emergencyType = "general", profileSnapshot = {} } = req.body || {};
  if (!location?.lat || !location?.lng) return res.status(400).json({ error: "missing_location" });

  const emergency = {
    id: `emg_${Date.now()}`,
    userId: req.user.sub,
    status: "pending_cancel",
    emergencyType,
    location,
    profileSnapshot,
    createdAt: new Date().toISOString(),
    cancelUntil: Date.now() + 5000,
    hospitalId: null,
    ambulanceStatus: "awaiting_assignment"
  };

  db.emergencies.push(emergency);
  io.emit("emergency:created", emergency);
  writeAudit("emergency_created", req.user.sub, {
    emergencyId: emergency.id,
    emergencyType,
    location
  });

  notifyGuardians(
    req.user.sub,
    "Emergency triggered",
    `Emergency ${emergency.id} was triggered and is awaiting routing.`,
    { emergencyId: emergency.id }
  );

  setTimeout(() => {
    const current = db.emergencies.find((e) => e.id === emergency.id);
    if (!current || current.status !== "pending_cancel") return;

    const hospital = nearestHospital(current.location);
    if (!hospital) {
      emergencyStatusUpdate(current, "failed_no_capacity", "failed_no_capacity");
      current.status = "failed_no_capacity";
      io.emit("emergency:updated", current);
      return;
    }

    current.hospitalId = hospital.id;
    emergencyStatusUpdate(current, "awaiting_hospital_confirmation", "awaiting_hospital_confirmation");
    current.status = "awaiting_hospital_confirmation";
    current.ambulanceStatus = "awaiting_hospital_confirmation";
    io.emit("emergency:updated", current);
  }, 5000);

  res.status(201).json({ emergency });
});

app.post("/emergencies/:id/cancel", auth, requireRole("user"), (req, res) => {
  const emergency = db.emergencies.find((e) => e.id === req.params.id && e.userId === req.user.sub);
  if (!emergency) return res.status(404).json({ error: "not_found" });
  if (emergency.status !== "pending_cancel") return res.status(409).json({ error: "cancel_window_closed" });

  emergencyStatusUpdate(emergency, "cancelled", "cancelled");
  emergency.status = "cancelled";
  emergency.ambulanceStatus = "cancelled";
  io.emit("emergency:updated", emergency);
  res.json({ ok: true, emergency });
});

app.post("/dashboard/emergencies/:id/confirm", auth, requireRole("hospital_admin"), (req, res) => {
  const emergency = db.emergencies.find((e) => e.id === req.params.id && e.hospitalId === req.user.hospitalId);
  if (!emergency) return res.status(404).json({ error: "not_found" });
  if (emergency.status !== "awaiting_hospital_confirmation") return res.status(409).json({ error: "invalid_state" });

  emergency.hospitalConfirmedAt = new Date().toISOString();
  emergencyStatusUpdate(emergency, "ambulance_dispatched", "en_route");

  setTimeout(() => {
    emergencyStatusUpdate(emergency, "arrived_at_scene", "arrived");
  if (emergency.status !== "awaiting_hospital_confirmation") {
    return res.status(409).json({ error: "invalid_state" });
  }

  emergency.status = "ambulance_dispatched";
  emergency.ambulanceStatus = "en_route";
  emergency.hospitalConfirmedAt = new Date().toISOString();
  io.emit("emergency:updated", emergency);

  setTimeout(() => {
    emergency.ambulanceStatus = "arrived";
    emergency.status = "arrived_at_scene";
    io.emit("emergency:updated", emergency);
  }, 5000);

  res.json({ ok: true, emergency });
});

app.post("/admissions", auth, requireRole("user"), (req, res) => {
  const { hospitalId, reason = "general", insuranceProvider = "self-pay", preAdmission = {} } = req.body || {};
  if (!hospitalId) return res.status(400).json({ error: "missing_hospital_id" });

  const hospital = db.hospitals.find((h) => h.id === hospitalId);
  if (!hospital) return res.status(404).json({ error: "hospital_not_found" });

  const admission = {
    id: `adm_${Date.now()}`,
    userId: req.user.sub,
    hospitalId,
    reason,
    insuranceProvider,
    preAdmission,
    status: "submitted",
    createdAt: new Date().toISOString()
  };

  db.admissions.push(admission);
  io.emit("admission:created", admission);
  writeAudit("admission_submitted", req.user.sub, { admissionId: admission.id, hospitalId, reason });
  res.status(201).json({ admission });
});

app.get("/me/admissions", auth, requireRole("user", "guardian"), (req, res) => {
  if (req.user.role === "guardian") {
    const linkedUsers = db.users.filter((u) => u.guardianIds?.includes(req.user.sub)).map((u) => u.id);
    return res.json(db.admissions.filter((a) => linkedUsers.includes(a.userId)).slice(-20).reverse());
  }
  return res.json(db.admissions.filter((a) => a.userId === req.user.sub).slice(-20).reverse());
});

app.get("/dashboard/admissions", auth, requireRole("hospital_admin"), (req, res) => {
  res.json(db.admissions.filter((a) => a.hospitalId === req.user.hospitalId).slice(-50).reverse());
});

app.post("/dashboard/admissions/:id/decision", auth, requireRole("hospital_admin"), (req, res) => {
  const { decision } = req.body || {};
  if (!["approved", "rejected"].includes(decision)) return res.status(400).json({ error: "invalid_decision" });

  const admission = db.admissions.find((a) => a.id === req.params.id && a.hospitalId === req.user.hospitalId);
  if (!admission) return res.status(404).json({ error: "not_found" });

  admission.status = decision;
  admission.reviewedAt = new Date().toISOString();

  io.emit("admission:updated", admission);
  pushNotification(
    admission.userId,
    "admission_update",
    `Admission ${decision}`,
    `Admission request ${admission.id} has been ${decision} by hospital desk.`,
    { admissionId: admission.id, status: decision }
  );

  writeAudit("admission_reviewed", req.user.sub, { admissionId: admission.id, decision });

  res.json({ ok: true, admission });
});

app.get("/me/notifications", auth, requireRole("user", "guardian"), (req, res) => {
  res.json(db.notifications.filter((n) => n.userId === req.user.sub).slice(-50).reverse());
});

app.post("/me/notifications/:id/read", auth, requireRole("user", "guardian"), (req, res) => {
  const notification = db.notifications.find((n) => n.id === req.params.id && n.userId === req.user.sub);
  if (!notification) return res.status(404).json({ error: "not_found" });
  notification.read = true;
  res.json({ ok: true, notification });
});

app.get("/dashboard/audit", auth, requireRole("hospital_admin"), (_req, res) => {
  res.json(db.auditLogs.slice(-100).reverse());
});

app.get("/me/emergencies", auth, (req, res) => {
  const mine = db.emergencies.filter((e) => e.userId === req.user.sub);
  res.json(mine.slice(-20).reverse());
});

app.get("/dashboard/emergencies", auth, requireRole("hospital_admin"), (req, res) => {
  const rows = db.emergencies.filter((e) => e.hospitalId === req.user.hospitalId || e.status === "pending_cancel");
  res.json(rows.slice(-50).reverse());
});

app.use("/dashboard", express.static(path.join(__dirname, "../../dashboard")));

io.on("connection", (socket) => {
  socket.emit("bootstrap", {
    hospitals: db.hospitals,
    emergencies: db.emergencies.slice(-20),
    admissions: db.admissions.slice(-20),
    notifications: db.notifications.slice(-20)
  });
  socket.emit("bootstrap", { hospitals: db.hospitals, emergencies: db.emergencies.slice(-20) });
});

server.listen(PORT, () => {
  console.log(`CareGuardian core backend running on http://localhost:${PORT}`);
});
