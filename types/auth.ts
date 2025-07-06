export type UserRoleEnum = "OWNER" | "SUPERVISOR" | "STAFF";
export interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface UserRole {
  id: string;
  user_role: "OWNER" | "SUPERVISOR" | "STAFF";
  user_id: string;
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  address?: string;
  phone_number?: string;
  email?: string;
  slug?: string;
  package?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  roles: UserRole[];
  stores: Store[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  roles: UserRole[];
  stores: Store[];
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
