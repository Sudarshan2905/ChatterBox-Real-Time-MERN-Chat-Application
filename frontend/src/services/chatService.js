import api from "./axios";

export const getConversationApi = (userId) => api.get(`/chat/${userId}`);
export const sendMessageApi = (payload) => api.post("/chat/send", payload);
