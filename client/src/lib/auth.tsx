import type React from "react";
import { createContext, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "./api";

type User = { id: number; username: string; role: string; fullName: string };

const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  login: (body: { username: string; password: string }) => Promise<void>;
  register: (body: Record<string, unknown>) => Promise<void>;
  logout: () => Promise<void>;
}>({ user: null, loading: true, login: async () => {}, register: async () => {}, logout: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({ queryKey: ["/api/user"], queryFn: () => apiRequest<User>("/api/user"), retry: false });

  const loginMutation = useMutation({
    mutationFn: (body: { username: string; password: string }) => apiRequest<{ user: User }>("/api/login", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["/api/user"] })
  });

  const registerMutation = useMutation({
    mutationFn: (body: Record<string, unknown>) => apiRequest<{ user: User }>("/api/register", { method: "POST", body: JSON.stringify(body) }),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["/api/user"] })
  });

  const logoutMutation = useMutation({
    mutationFn: () => apiRequest<{ ok: boolean }>("/api/logout", { method: "POST" }),
    onSuccess: async () => qc.invalidateQueries({ queryKey: ["/api/user"] })
  });

  return (
    <AuthContext.Provider
      value={{
        user: data ?? null,
        loading: isLoading,
        login: async (body) => loginMutation.mutateAsync(body).then(() => {}),
        register: async (body) => registerMutation.mutateAsync(body).then(() => {}),
        logout: async () => logoutMutation.mutateAsync().then(() => {})
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
