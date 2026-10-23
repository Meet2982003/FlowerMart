export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: "SUPER_ADMIN" | "MANAGER";
}

const AUTH_STORAGE_KEY = "jnr_admin_session";

export const DEFAULT_ADMIN_CREDENTIALS = {
  username: "admin",
  email: "admin@jnr.com",
  password: "password123",
};

export function getAdminSession(): AdminUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setAdminSession(user: AdminUser): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearAdminSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function validateAdminLogin(identifier: string, pass: string): AdminUser | null {
  const isMatch =
    (identifier.trim().toLowerCase() === DEFAULT_ADMIN_CREDENTIALS.email.toLowerCase() ||
     identifier.trim().toLowerCase() === DEFAULT_ADMIN_CREDENTIALS.username.toLowerCase()) &&
    pass === DEFAULT_ADMIN_CREDENTIALS.password;

  if (isMatch) {
    const user: AdminUser = {
      id: "admin-1",
      username: "meetrami",
      email: "admin@jnr.com",
      role: "SUPER_ADMIN",
    };
    setAdminSession(user);
    return user;
  }

  return null;
}
