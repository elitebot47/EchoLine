import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type SocketStoreType = {
  socket: Socket | null;
  initializesocket: () => void;
};

export const useSocketStore = create<SocketStoreType>((set) => ({
  socket: null,
  initializesocket: () => {
    try {
      const socketinstance = io(process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001", {
        transports: ["websocket"],
        timeout: 20000,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      socketinstance.on("connect", () => {
        console.log("Socket connected:", socketinstance.id);
      });

      socketinstance.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
      });

      socketinstance.on("disconnect", (reason) => {
        console.log("Socket disconnected:", reason);
      });

      set({ socket: socketinstance });
    } catch (error) {
      console.error("Failed to initialize socket:", error);
    }
  },
}));
