import api from "./axios";

export const getUsersApi = () => api.get("/users");
export const searchUsersApi = (q) => api.get(`/users/search?q=${encodeURIComponent(q)}`);
