import api from "./axios";

export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post("/api/auth/login", data),
  register: (data: any) => api.post("/api/auth/register", data),
  getUser: () => api.get("/api/auth/me"),
  logout: () => api.post("/api/auth/logout", {}, { withCredentials: true }),

  forgotPassword: (data: { email: string }) =>
    api.post("/api/auth/forgot-password", data),

  resetPassword: (data: { email: string; code: string; newPassword: string }) =>
    api.post("/api/auth/reset-password", data),

  googleLogin: (data: { idToken: string }) =>
    api.post("/api/auth/google-login", data),
};
