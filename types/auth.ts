// Auth Types based on Swagger API
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number: string;
}

export interface AccessTokenResponse {
  access_token: string;
}

// API Response wrappers
export interface ApiResponse<T> {
  data: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  email_verified?: boolean;
  email_verified_at?: string | null;
  phone_number?: string;
  google_id?: string | null;
  roles: string[];
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  clearAuth: () => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  checkAuth: () => Promise<void>;
  updateUser: (user: User) => void;
}

export type AuthStore = AuthState & AuthActions;

// API Error Types
export interface ApiError {
  message: string;
  status?: number;
}

// Validation Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number: string;
}
