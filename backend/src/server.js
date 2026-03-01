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

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "careguardian-core" });
});

app.post("/auth/login", (req, res) => {
  const { phone, password } = req.body || {};
  const user = db.users.find((u) => u.phone === phone && u.password === password);
  if (!user) return res.status(401).json({ error: "invalid_credentials" });
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

  setTimeout(() => {
    const current = db.emergencies.find((e) => e.id === emergency.id);
    if (!current || current.status !== "pending_cancel") return;

    const hospital = nearestHospital(current.location);
    if (!hospital) {
      current.status = "failed_no_capacity";
      io.emit("emergency:updated", current);
      return;
    }

    current.hospitalId = hospital.id;
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

  emergency.status = "cancelled";
  emergency.ambulanceStatus = "cancelled";
  io.emit("emergency:updated", emergency);
  res.json({ ok: true, emergency });
});

app.post("/dashboard/emergencies/:id/confirm", auth, requireRole("hospital_admin"), (req, res) => {
  const emergency = db.emergencies.find((e) => e.id === req.params.id && e.hospitalId === req.user.hospitalId);
  if (!emergency) return res.status(404).json({ error: "not_found" });
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
  socket.emit("bootstrap", { hospitals: db.hospitals, emergencies: db.emergencies.slice(-20) });
});

server.listen(PORT, () => {
  console.log(`CareGuardian core backend running on http://localhost:${PORT}`);
});
