import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API = axios.create({
  baseURL: "http://10.51.8.192:5000/api",
  timeout: 10000,
});

// 🔐 attach token automatically
API.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= AUTH ================= */

export const signup = (data) => API.post("/auth/signup", data);
export const login = (data) => API.post("/auth/login", data);

/* ================= USERS / CHATS ================= */

export const getUsers = () => API.get("/users");
export const createChat = (userId) =>
  API.post("/chats", { userId });

/* ================= MESSAGES ================= */

export const getMessages = (conversationId) =>
  API.get(`/messages/${conversationId}`);

export const sendMessage = (data) =>
  API.post("/messages", data);

export const markMessagesSeen = (conversationId) =>
  API.put(`/messages/seen/${conversationId}`);

export const editMessage = (id, text) =>
  API.put(`/messages/${id}`, { text });

export const deleteMessageForEveryone = (id) =>
  API.delete(`/messages/${id}`);

export const updateProfile = (data) =>
  API.put("/users/profile", data);

export const changePassword = (data) =>
  API.put("/users/change-password", data);


export default API;
