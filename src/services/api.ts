export const API_BASE_URL = "http://localhost:4000";

type LoginResponse = {
  token: string;
  user: { id: string; name: string; role: string; hospitalId?: string | null };
};

export async function demoLogin() {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: "9000000001", password: "demo123" })
  });
  if (!response.ok) throw new Error("demo_login_failed");
  return (await response.json()) as LoginResponse;
}

export async function triggerEmergency(params: {
  token: string;
  lat: number;
  lng: number;
  emergencyType: string;
  profileSnapshot: { bloodGroup: string; allergies: string[] };
}) {
  const response = await fetch(`${API_BASE_URL}/emergencies`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.token}`
    },
    body: JSON.stringify({
      location: { lat: params.lat, lng: params.lng },
      emergencyType: params.emergencyType,
      profileSnapshot: params.profileSnapshot
    })
  });

  if (!response.ok) throw new Error("emergency_trigger_failed");
  return response.json() as Promise<{ emergency: { id: string; status: string; cancelUntil: number } }>;
}

export async function cancelEmergency(token: string, emergencyId: string) {
  const response = await fetch(`${API_BASE_URL}/emergencies/${emergencyId}/cancel`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("cancel_failed");
  return response.json();
}

export async function fetchHospitalAvailability() {
  const response = await fetch(`${API_BASE_URL}/hospitals/availability`);
  if (!response.ok) throw new Error("availability_failed");
  return response.json() as Promise<Array<{ id: string; name: string; beds: number; icu: number; ambulanceReady: number }>>;
}
