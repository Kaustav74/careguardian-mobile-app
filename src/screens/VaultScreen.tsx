import { ScrollView, StyleSheet, Text } from "react-native";
import { SectionCard } from "../components/SectionCard";
import { guardians } from "../data/mock";

export function VaultScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Digital Health Vault</Text>

      <SectionCard
        title="Medical Profile"
        subtitle="Allergies, blood group, surgeries, prescriptions, lab reports"
      >
        <Text style={styles.meta}>Profile sync is available for emergency auto-sharing.</Text>
      </SectionCard>

      <SectionCard title="Family Guardian" subtitle="Linked dependents under one account">
        {guardians.map((g) => (
          <Text key={g.name} style={styles.meta}>
            {g.name} • {g.relation} • {g.age} yrs
          </Text>
        ))}
      </SectionCard>

      <SectionCard title="Health Discipline" subtitle="Medicine reminders + preventive checkup nudges">
        <Text style={styles.meta}>Reminder engine adapts by age bracket and clinical history.</Text>
      </SectionCard>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f3f6fb" },
  content: { padding: 16, paddingTop: 60 },
  heading: { fontSize: 28, fontWeight: "800", marginBottom: 12, color: "#17212b" },
  meta: { color: "#5d6b7b", marginBottom: 6 }
});
