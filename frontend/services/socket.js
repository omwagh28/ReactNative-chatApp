// frontend/services/socket.js

import { io } from "socket.io-client";

const SOCKET_URL = "http://10.51.8.192:5000"; // same IP as API

export const socket = io(SOCKET_URL, {
  transports: ["websocket"],
  autoConnect: false, // we control when to connect
});
