import { ReactNode } from "react";
import { View, Text, StyleSheet } from "react-native";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  children?: ReactNode;
};

export function SectionCard({ title, subtitle, children }: SectionCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e7ebf0"
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1c2b3a"
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 8,
    color: "#5d6b7b"
  }
});
