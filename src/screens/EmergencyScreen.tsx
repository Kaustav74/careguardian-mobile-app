import { useEffect, useMemo, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import {
  cancelEmergency,
  demoLogin,
  fetchHospitalAvailability,
  triggerEmergency
} from "../services/api";

type EmergencyState = {
  id: string;
  status: string;
  countdown: number;
};

export function EmergencyScreen() {
  const [hospitals, setHospitals] = useState<Array<{ id: string; name: string; beds: number; icu: number; ambulanceReady: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [emergency, setEmergency] = useState<EmergencyState | null>(null);

  const summary = useMemo(() => {
    if (!emergency) return "System ready."
    if (emergency.status === "pending_cancel") return `Emergency queued. Auto-dispatch in ${emergency.countdown}s`;
    return `Emergency status: ${emergency.status}`;
  }, [emergency]);

  useEffect(() => {
    fetchHospitalAvailability()
      .then(setHospitals)
      .catch(() => {
        setHospitals([]);
      });
  }, []);

  useEffect(() => {
    if (!emergency || emergency.status !== "pending_cancel") return;
    const timer = setInterval(() => {
      setEmergency((prev) => {
        if (!prev) return prev;
        if (prev.countdown <= 1) return { ...prev, countdown: 0, status: "awaiting_hospital_confirmation" };
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [emergency]);

  const handleSOS = async () => {
    try {
      setLoading(true);
      const session = await demoLogin();
      const { emergency: created } = await triggerEmergency({
        token: session.token,
        lat: 22.5726,
        lng: 88.3639,
        emergencyType: "cardiac",
        profileSnapshot: {
          bloodGroup: "B+",
          allergies: ["Penicillin"]
        }
      });

      setEmergency({ id: created.id, status: created.status, countdown: 5 });
      Alert.alert("SOS triggered", "5-second cancel window started. Hospital routing has begun.");
    } catch (error) {
      Alert.alert("Backend unavailable", "Unable to trigger live SOS. Please ensure backend is running on port 4000.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!emergency || emergency.status !== "pending_cancel") return;
    try {
      const session = await demoLogin();
      await cancelEmergency(session.token, emergency.id);
      setEmergency({ ...emergency, status: "cancelled", countdown: 0 });
      Alert.alert("Emergency cancelled", "Dispatch request was cancelled in safety window.");
    } catch (_error) {
      Alert.alert("Cancel failed", "Cancel window may be closed already.");
    }
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import { hospitals } from "../data/mock";

export function EmergencyScreen() {
  const triggerSOS = () => {
    const nearest = hospitals[0];
    Alert.alert(
      "Emergency Activated",
      `Alert sent to ${nearest.name}. Ambulance dispatched (ETA ${nearest.eta}). Basic medical profile shared securely.`
    );
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>CareGuardian Emergency</Text>
      <TouchableOpacity style={styles.sosButton} onPress={handleSOS} disabled={loading}>
        <Text style={styles.sosText}>{loading ? "Connecting..." : "One-Tap SOS"}</Text>
      </TouchableOpacity>

      {emergency?.status === "pending_cancel" ? (
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelText}>Cancel Emergency ({emergency.countdown})</Text>
        </TouchableOpacity>
      ) : null}

      <SectionCard title="Emergency State" subtitle={summary} />

      <SectionCard title="Live Hospital Capacity" subtitle="Realtime backend availability">
        {hospitals.map((h) => (
          <View key={h.id} style={styles.row}>
            <Text style={styles.rowTitle}>{h.name}</Text>
            <Text style={styles.rowMeta}>
              Beds: {h.beds} | ICU: {h.icu} | Ambulances: {h.ambulanceReady}
            </Text>
          </View>
        ))}
        {!hospitals.length ? <Text style={styles.rowMeta}>No live data. Start backend server.</Text> : null}
      </SectionCard>
      <TouchableOpacity style={styles.sosButton} onPress={triggerSOS}>
        <Text style={styles.sosText}>One-Tap SOS</Text>
      </TouchableOpacity>

      <SectionCard title="Live Hospital Capacity" subtitle="Nearest partnered hospitals">
        {hospitals.map((h) => (
          <View key={h.name} style={styles.row}>
            <Text style={styles.rowTitle}>{h.name}</Text>
            <Text style={styles.rowMeta}>Beds: {h.beds} | ICU: {h.icu} | ETA: {h.eta}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard
        title="Emergency Flow"
        subtitle="1) Trigger SOS → 2) Dispatch ambulance → 3) Share profile → 4) Track ambulance live"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f6fb" },
  content: { padding: 16, paddingTop: 60 },
  heading: { fontSize: 28, fontWeight: "800", marginBottom: 12, color: "#17212b" },
  sosButton: {
    backgroundColor: "#d92d20",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    height: 68,
    marginBottom: 12
  },
  sosText: { color: "white", fontWeight: "800", fontSize: 22 },
  cancelButton: {
    backgroundColor: "#fff0f0",
    borderColor: "#d92d20",
    borderWidth: 1,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    height: 44,
    marginBottom: 16
  },
  cancelText: { color: "#d92d20", fontWeight: "700" },
    marginBottom: 20
  },
  sosText: { color: "white", fontWeight: "800", fontSize: 22 },
  row: { marginBottom: 10 },
  rowTitle: { fontWeight: "700", color: "#1c2b3a" },
  rowMeta: { color: "#5d6b7b", marginTop: 2 }
});
