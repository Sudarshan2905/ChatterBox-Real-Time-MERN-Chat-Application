import api from "./axios";

export const signupApi = (payload) => api.post("/auth/signup", payload);
export const loginApi = (payload) => api.post("/auth/login", payload);
export const logoutApi = () => api.get("/auth/logout");
export const getMeApi = () => api.get("/auth/me");
