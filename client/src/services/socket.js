// Creates the Socket.IO connection used by the React application.

import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_URL || "http://localhost:5000", {
  transports: ["polling"],
  autoConnect: false,
  auth: (cb) => {
    const token = localStorage.getItem("token");
    cb({
      token,
    });
  },
});

export default socket;
