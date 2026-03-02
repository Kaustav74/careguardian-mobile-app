import type React from "react";
import { Redirect, Route, Switch, Link } from "wouter";
import AuthPage from "@client/pages/AuthPage";
import Dashboard from "@client/pages/Dashboard";
import { AppointmentsPage, DoctorsPage, FirstAidPage, HealthPage, HospitalsPage, RecordsPage } from "@client/pages/ResourcePages";
import { useAuth } from "@client/lib/auth";
import { Button } from "@client/components/ui/button";

function Protected({ component: Component }: { component: () => JSX.Element }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10">Loading...</div>;
  if (!user) return <Redirect to="/auth" />;
  return <Component />;
}

function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-6 flex items-center justify-between rounded-lg border bg-white p-4">
        <div>
          <h1 className="text-2xl font-bold">CareGuardian</h1>
          <p className="text-sm text-slate-500">All-in-one healthcare dashboard</p>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span>{user.fullName} ({user.role})</span>
            <Button onClick={logout}>Logout</Button>
          </div>
        )}
      </header>
      {user && (
        <nav className="mb-6 flex flex-wrap gap-3 text-sm">
          {[["/", "Dashboard"], ["/health", "Health"], ["/records", "Records"], ["/doctors", "Doctors"], ["/hospitals", "Hospitals"], ["/appointments", "Appointments"], ["/first-aid", "First Aid"]].map(([href, label]) => (
            <Link key={href} href={href} className="rounded border bg-white px-3 py-1">{label}</Link>
          ))}
          <a href="tel:102" className="rounded bg-red-600 px-3 py-1 text-white">Emergency SOS</a>
        </nav>
      )}
      {children}
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Switch>
        <Route path="/auth" component={AuthPage} />
        <Route path="/"><Protected component={Dashboard} /></Route>
        <Route path="/health"><Protected component={HealthPage} /></Route>
        <Route path="/records"><Protected component={RecordsPage} /></Route>
        <Route path="/doctors"><Protected component={DoctorsPage} /></Route>
        <Route path="/hospitals"><Protected component={HospitalsPage} /></Route>
        <Route path="/appointments"><Protected component={AppointmentsPage} /></Route>
        <Route path="/first-aid"><Protected component={FirstAidPage} /></Route>
      </Switch>
    </Layout>
  );
}
