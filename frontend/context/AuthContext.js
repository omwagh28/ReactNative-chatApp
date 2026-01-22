// frontend/context/AuthContext.js

import { createContext, useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import API, { login as loginAPI, signup as signupAPI } from "../services/api";
import { socket } from "../services/socket";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 LOAD TOKEN ON APP START
  useEffect(() => {
  const loadToken = async () => {
    const storedToken = await SecureStore.getItemAsync("token");

    if (storedToken) {
      setToken(storedToken);
      API.defaults.headers.common.Authorization = `Bearer ${storedToken}`;

      // 🔌 CONNECT SOCKET
      socket.connect();
      console.log("🟢 Socket connected");
    }

    setLoading(false);
  };

  loadToken();

  return () => {
    socket.disconnect();
    console.log("🔴 Socket disconnected");
  };
}, []);


  const signup = async (data) => {
    await signupAPI(data);
  };

  const login = async (data) => {
    const res = await loginAPI(data);

    setUser(res.data.user);
    setToken(res.data.token);

    API.defaults.headers.common.Authorization =
      `Bearer ${res.data.token}`;

    await SecureStore.setItemAsync("token", res.data.token);
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    delete API.defaults.headers.common.Authorization;
    await SecureStore.deleteItemAsync("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}
