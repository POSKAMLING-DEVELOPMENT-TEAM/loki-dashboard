import axios, { AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";
import {
  LoginCredentials,
  RegisterCredentials,
  AccessTokenResponse,
  User,
  ApiError,
} from "../types/auth";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://poskamling.biz.id/api/v1";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  config => {
    const token = Cookies.get("auth-token");
    if (token) {
      // Add Bearer token to Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  error => {
    // Only redirect to login for 401 errors on protected routes (like /auth/me)
    // NOT for login endpoint itself
    if (
      error.response?.status === 401 &&
      error.config?.url?.includes("/auth/me")
    ) {
      // Clear token and redirect to login
      Cookies.remove("auth-token");
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

// Auth API functions
export const authApi = {
  // Register
  register: async (
    credentials: RegisterCredentials
  ): Promise<{ message: string }> => {
    try {
      const response = await apiClient.post<{ data: { message: string } }>(
        "/auth/register",
        credentials
      );

      // Extract message from nested data structure
      const message = response.data.data.message;

      return { message };
    } catch (error: any) {
      // Handle specific error responses
      let errorMessage = "Registration failed";
      let errorStatus = error.response?.status;

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      // Handle validation errors
      if (error.response?.data?.errors) {
        const validationErrors = error.response.data.errors;
        if (validationErrors.email) {
          errorMessage = validationErrors.email[0];
        } else if (validationErrors.phone_number) {
          errorMessage = validationErrors.phone_number[0];
        } else if (validationErrors.name) {
          errorMessage = validationErrors.name[0];
        }
      }

      const apiError: ApiError = {
        message: errorMessage,
        status: errorStatus,
      };
      throw apiError;
    }
  },

  // Login
  login: async (
    credentials: LoginCredentials
  ): Promise<AccessTokenResponse> => {
    try {
      const response = await apiClient.post<{ data: AccessTokenResponse }>(
        "/auth/login",
        credentials
      );

      // Extract access_token from nested data structure
      const accessToken = response.data.data.access_token;

      return { access_token: accessToken };
    } catch (error: any) {
      // Handle specific error responses
      let errorMessage = "Login failed";
      let errorStatus = error.response?.status;

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      const apiError: ApiError = {
        message: errorMessage,
        status: errorStatus,
      };
      throw apiError;
    }
  },

  // Get user profile with Bearer token
  getProfile: async (): Promise<User> => {
    try {
      const response = await apiClient.get<{ data: User }>("/auth/me");

      // Extract user data from nested data structure
      const user = response.data.data;

      return user;
    } catch (error: any) {
      let errorMessage = "Failed to get user profile";
      let errorStatus = error.response?.status;

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      const apiError: ApiError = {
        message: errorMessage,
        status: errorStatus,
      };
      throw apiError;
    }
  },

  // Logout (if backend has logout endpoint)
  logout: async (): Promise<void> => {
    try {
      await apiClient.post("/auth/logout");
    } catch (error) {
      // Even if logout fails, we still clear the token
    } finally {
      Cookies.remove("auth-token");
    }
  },
};

export default apiClient;
