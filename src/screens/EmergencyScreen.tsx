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
    marginBottom: 20
  },
  sosText: { color: "white", fontWeight: "800", fontSize: 22 },
  row: { marginBottom: 10 },
  rowTitle: { fontWeight: "700", color: "#1c2b3a" },
  rowMeta: { color: "#5d6b7b", marginTop: 2 }
});
