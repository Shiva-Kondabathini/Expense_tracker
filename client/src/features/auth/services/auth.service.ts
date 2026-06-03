import { api } from "@/shared/services/api";

interface LoginPayload {
  email: string;
  password: string;
}

export const loginUser = async (payload: LoginPayload) => {
  const response = await api.post("/auth/login", payload);

  return response.data;
};

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const registerUser = async (payload: RegisterPayload) => {
  const response = await api.post("/auth/register", payload);

  return response.data;
};

interface ForgotPasswordPayload {
  email: string;
}

export const forgotPassword = async (payload: ForgotPasswordPayload) => {
  const response = await api.post("/auth/forgot-password", payload);

  return response.data;
};

interface ResetPasswordPayload {
  token: string;
  password: string;
  confirmPassword: string;
}

export const resetPassword = async (payload: ResetPasswordPayload) => {
  const response = await api.post("/auth/reset-password", payload);

  return response.data;
};
