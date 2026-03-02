import { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import {
  demoLogin,
  fetchHospitalAvailability,
  fetchMyNotifications,
  submitAdmissionRequest
} from "../services/api";

export function AppointmentsScreen() {
  const [hospitals, setHospitals] = useState<Array<{ id: string; name: string; beds: number; icu: number; ambulanceReady: number }>>([]);
  const [submitting, setSubmitting] = useState(false);
  const [admissionId, setAdmissionId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<Array<{ id: string; title: string; body: string }>>([]);

  useEffect(() => {
    fetchHospitalAvailability().then(setHospitals).catch(() => setHospitals([]));
  }, []);

  const submitQuickAdmission = async () => {
    if (!hospitals.length) {
      Alert.alert("No hospital data", "Start backend server to load live hospital availability.");
      return;
    }

    try {
      setSubmitting(true);
      const session = await demoLogin();
      const { admission } = await submitAdmissionRequest({
        token: session.token,
        hospitalId: hospitals[0].id,
        reason: "chest pain",
        insuranceProvider: "ABC Health Insurance",
        preAdmission: {
          symptoms: "chest pain, shortness of breath",
          notes: "Patient is on blood pressure medication"
        }
      });
      setAdmissionId(admission.id);
      Alert.alert("Pre-admission submitted", `Admission request ID: ${admission.id}`);
    } catch {
      Alert.alert("Submission failed", "Could not create admission request. Ensure backend is running.");
    } finally {
      setSubmitting(false);
    }
  };

  const loadGuardianFeed = async () => {
    try {
      const session = await demoLogin();
      const feed = await fetchMyNotifications(session.token);
      setNotifications(feed.slice(0, 5).map((x) => ({ id: x.id, title: x.title, body: x.body })));
    } catch {
      Alert.alert("Feed unavailable", "Could not fetch notifications.");
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Appointments & Admissions</Text>

      <SectionCard title="Live Hospital Capacity" subtitle="Use this data before raising admission request">
        {hospitals.map((h) => (
          <View key={h.id} style={styles.slotRow}>
            <Text style={styles.doc}>{h.name}</Text>
            <Text style={styles.meta}>Beds: {h.beds} • ICU: {h.icu} • Ambulance: {h.ambulanceReady}</Text>
          </View>
        ))}
        {!hospitals.length ? <Text style={styles.meta}>No live data available.</Text> : null}
      </SectionCard>

      <SectionCard title="Digital Pre-Admission" subtitle="Submit real request to backend">
        <TouchableOpacity style={styles.actionButton} onPress={submitQuickAdmission} disabled={submitting}>
          <Text style={styles.actionText}>{submitting ? "Submitting..." : "Submit Pre-Admission"}</Text>
        </TouchableOpacity>
        {admissionId ? <Text style={styles.meta}>Latest request ID: {admissionId}</Text> : null}
      </SectionCard>

      <SectionCard title="Guardian & User Alerts" subtitle="Load latest event notifications from backend">
        <TouchableOpacity style={styles.actionButtonSecondary} onPress={loadGuardianFeed}>
          <Text style={styles.actionTextSecondary}>Load Notifications</Text>
        </TouchableOpacity>
        {notifications.map((n) => (
          <View key={n.id} style={styles.slotRow}>
            <Text style={styles.doc}>{n.title}</Text>
            <Text style={styles.meta}>{n.body}</Text>
          </View>
        ))}
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f6fb" },
  content: { padding: 16, paddingTop: 60 },
  heading: { fontSize: 28, fontWeight: "800", marginBottom: 12, color: "#17212b" },
  slotRow: { marginBottom: 10 },
  doc: { fontWeight: "700", color: "#1c2b3a" },
  meta: { color: "#5d6b7b" },
  actionButton: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#1769e0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8
  },
  actionText: { color: "white", fontWeight: "700" },
  actionButtonSecondary: {
    height: 44,
    borderRadius: 10,
    backgroundColor: "#e9f2ff",
    borderWidth: 1,
    borderColor: "#1769e0",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8
  },
  actionTextSecondary: { color: "#1769e0", fontWeight: "700" }
});
