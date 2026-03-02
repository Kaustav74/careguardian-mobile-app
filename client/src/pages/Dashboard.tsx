import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@client/lib/api";
import { Card } from "@client/components/ui/card";

const modules = [
  ["/health", "Health Data"],
  ["/records", "Medical Records"],
  ["/doctors", "Doctors"],
  ["/hospitals", "Hospitals"],
  ["/appointments", "Appointments"],
  ["/first-aid", "AI First Aid"]
];

export default function Dashboard() {
  const { data: appointments = [] } = useQuery({ queryKey: ["appointments"], queryFn: () => apiRequest<any[]>("/api/appointments") });
  return (
    <div className="grid gap-4">
      <Card><h2 className="text-2xl font-semibold">Healthcare Command Center</h2><p>Manage your complete health journey in one place.</p></Card>
      <div className="grid gap-3 md:grid-cols-3">
        {modules.map(([href, title]) => (
          <Link key={href} href={href}><Card className="cursor-pointer"><h3 className="font-semibold">{title}</h3></Card></Link>
        ))}
      </div>
      <Card><h3 className="font-semibold">Upcoming Appointments</h3><p>{appointments.length} scheduled</p></Card>
    </div>
  );
}
