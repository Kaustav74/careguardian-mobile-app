import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@client/lib/api";
import { Card } from "@client/components/ui/card";
import { Button } from "@client/components/ui/button";
import { useState } from "react";

export function HealthPage() {
  const qc = useQueryClient();
  const [heartRate, setHeartRate] = useState(72);
  const { data = [] } = useQuery({ queryKey: ["health"], queryFn: () => apiRequest<any[]>("/api/health-data") });
  const mutation = useMutation({ mutationFn: () => apiRequest("/api/health-data", { method: "POST", body: JSON.stringify({ heartRate }) }), onSuccess: () => qc.invalidateQueries({ queryKey: ["health"] }) });
  return <Card><h2>Health Data Monitoring</h2><input type="number" className="border p-2" value={heartRate} onChange={(e) => setHeartRate(Number(e.target.value))} /><Button onClick={() => mutation.mutate()}>Add Vitals</Button><p>{data.length} records</p></Card>;
}

export function RecordsPage() {
  const { data = [] } = useQuery({ queryKey: ["records"], queryFn: () => apiRequest<any[]>("/api/medical-records") });
  return <Card><h2>Medical Records</h2><p>{data.length} secure records stored.</p></Card>;
}

export function DoctorsPage() {
  const { data = [] } = useQuery({ queryKey: ["doctors"], queryFn: () => apiRequest<any[]>("/api/doctors") });
  return <Card><h2>Doctor Directory</h2><p>{data.length} doctors available.</p></Card>;
}

export function HospitalsPage() {
  const { data = [] } = useQuery({ queryKey: ["hospitals"], queryFn: () => apiRequest<any[]>("/api/hospitals") });
  return <Card><h2>Hospital Management</h2><p>{data.length} partner hospitals.</p></Card>;
}

export function AppointmentsPage() {
  const { data = [] } = useQuery({ queryKey: ["appointments"], queryFn: () => apiRequest<any[]>("/api/appointments") });
  return <Card><h2>Appointments</h2><p>{data.length} appointments booked.</p></Card>;
}

export function FirstAidPage() {
  const [symptoms, setSymptoms] = useState("Chest pain and dizziness");
  const [result, setResult] = useState<any>(null);
  return <Card><h2>AI First Aid Assistance</h2><textarea className="w-full border p-2" value={symptoms} onChange={(e) => setSymptoms(e.target.value)} /><Button onClick={async () => setResult(await apiRequest("/api/ai/symptom-analysis", { method: "POST", body: JSON.stringify({ symptoms }) }))}>Analyze</Button><pre>{JSON.stringify(result, null, 2)}</pre></Card>;
}
