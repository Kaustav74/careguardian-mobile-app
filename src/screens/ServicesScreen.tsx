import { ScrollView, StyleSheet, Text } from "react-native";
import { SectionCard } from "../components/SectionCard";

export function ServicesScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Smart Services</Text>

      <SectionCard title="Teleconsultation + Labs" subtitle="Virtual consults and home sample pickup">
        <Text style={styles.meta}>Includes follow-up reminders and digital prescription continuation.</Text>
      </SectionCard>

      <SectionCard title="Government Scheme Guidance" subtitle="Ayushman Bharat eligibility support">
        <Text style={styles.meta}>Step-by-step validation and hospital acceptance visibility.</Text>
      </SectionCard>

      <SectionCard title="AI Health Copilot" subtitle="Symptom urgency triage + predictive risk analysis">
        <Text style={styles.meta}>Guidance only and never a replacement for licensed doctors.</Text>
      </SectionCard>

      <SectionCard title="Future-ready Infrastructure" subtitle="Hospital on Wheels + ambulance fleet optimization API network" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f6fb" },
  content: { padding: 16, paddingTop: 60 },
  heading: { fontSize: 28, fontWeight: "800", marginBottom: 12, color: "#17212b" },
  meta: { color: "#5d6b7b" }
});
