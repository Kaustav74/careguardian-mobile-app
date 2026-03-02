import { useState } from "react";
import { Button } from "@client/components/ui/button";
import { Card } from "@client/components/ui/card";
import { useAuth } from "@client/lib/auth";

export default function AuthPage() {
  const { login, register } = useAuth();
  const [isRegister, setRegister] = useState(false);
  const [form, setForm] = useState<any>({ role: "user" });

  const submit = async () => {
    if (isRegister) await register(form);
    else await login({ username: form.username, password: form.password });
  };

  return (
    <div className="mx-auto mt-16 max-w-3xl">
      <Card>
        <h1 className="mb-4 text-3xl font-bold">CareGuardian Access</h1>
        <div className="mb-4 flex gap-2">
          <Button variant={!isRegister ? "default" : "ghost"} onClick={() => setRegister(false)}>Login</Button>
          <Button variant={isRegister ? "default" : "ghost"} onClick={() => setRegister(true)}>Register</Button>
        </div>
        <div className="grid gap-3">
          <input className="rounded border p-2" placeholder="Username" onChange={(e) => setForm({ ...form, username: e.target.value })} />
          <input className="rounded border p-2" type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          {isRegister && (
            <>
              <input className="rounded border p-2" placeholder="Full name" onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
              <input className="rounded border p-2" placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <select className="rounded border p-2" onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="user">User</option>
                <option value="hospital">Hospital</option>
                <option value="ambulance">Ambulance</option>
              </select>
            </>
          )}
          <Button onClick={submit}>{isRegister ? "Create account" : "Login"}</Button>
        </div>
      </Card>
    </div>
  );
}
