import axios from "axios";
import Cookies from "js-cookie";
import { LoginCredentials, AuthResponse } from "../types/auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://loki.com/api";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  config => {
    const token = Cookies.get("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      Cookies.remove("auth-token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // ini hanya berjalan di development mode gengs
    if (
      process.env.NODE_ENV === "development" &&
      credentials.email === "test@test.com" &&
      credentials.password === "test123"
    ) {
      return {
        user: {
          id: "1",
          name: "Test User",
          email: "test@test.com",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        token: "dummy-token-123",
        roles: [
          {
            id: "1",
            user_role: "OWNER",
            user_id: "1",
          },
        ],
        stores: [
          // {
          //   id: "1",
          //   name: "Dummy Store",
          //   description: "Store for testing",
          //   address: "123 Test St",
          //   phone_number: "08123456789",
          //   email: "store@test.com",
          //   slug: "dummy-store",
          // },
        ],
      };
    }
    const response = await apiClient.post("/auth/login", credentials);
    return response.data;
  },

  getProfile: async (): Promise<AuthResponse> => {
    // ini hanya berjalan di development mode gengs
    const token = Cookies.get("auth-token");
    if (process.env.NODE_ENV === "development" && token === "dummy-token-123") {
      return {
        user: {
          id: "1",
          name: "Test User",
          email: "test@test.com",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        token: "dummy-token-123",
        roles: [
          {
            id: "1",
            user_role: "OWNER",
            user_id: "1",
          },
        ],
        stores: [
          {
            id: "1",
            name: "Dummy Store",
            description: "Store for testing",
            address: "123 Test St",
            phone_number: "08123456789",
            email: "store@test.com",
            slug: "dummy-store",
          },
        ],
      };
    }
    const response = await apiClient.get("/auth/profile");
    return response.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/auth/logout");
  },
};

export default apiClient;
