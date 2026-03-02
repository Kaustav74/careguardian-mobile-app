export async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options
  });

  if (response.status === 401) throw new Error("unauthorized");
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}
