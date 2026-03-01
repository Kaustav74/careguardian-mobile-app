import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SectionCard } from "../components/SectionCard";
import { appointments } from "../data/mock";

export function AppointmentsScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Appointments & Admissions</Text>

      <SectionCard title="Real-time Doctor Slots" subtitle="Book instantly with hospital availability">
        {appointments.map((a) => (
          <View key={`${a.doctor}-${a.slot}`} style={styles.slotRow}>
            <Text style={styles.doc}>{a.doctor}</Text>
            <Text style={styles.meta}>{a.specialty} • {a.slot}</Text>
          </View>
        ))}
      </SectionCard>

      <SectionCard title="Priority Subscription" subtitle="Faster routing in emergencies and shorter wait slots">
        <Text style={styles.meta}>Plan tiers: Basic, Priority Plus, Family Guardian Plus</Text>
      </SectionCard>

      <SectionCard title="Cashless & Cost Transparency" subtitle="Pre-verify insurance and estimate treatment costs">
        <Text style={styles.meta}>Includes pre-admission paperwork and admission readiness checks.</Text>
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
  meta: { color: "#5d6b7b" }
});
