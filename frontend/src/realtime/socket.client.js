import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_BACKEND_URL;

let socketInstance = null;
let socketToken = null;

export function getSharedSocket() {
  const token = localStorage.getItem("token");

  if (!token) return null;

  if (!socketInstance || socketToken !== token) {
    if (socketInstance) {
      socketInstance.disconnect();
    }

    socketInstance = io(API_URL, {
      transports: ["websocket"],
      auth: { token },
    });
    socketToken = token;
  }

  return socketInstance;
}

export function closeSharedSocket() {
  if (!socketInstance) return;
  socketInstance.disconnect();
  socketInstance = null;
  socketToken = null;
}