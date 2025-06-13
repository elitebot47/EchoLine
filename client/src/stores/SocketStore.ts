import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type SocketStoreType = {
  socket: Socket | null;
  initializesocket: () => void;
};
const port = 3001;
export const useSocketStore = create<SocketStoreType>((set) => ({
  socket: null,
  initializesocket: () => {
    const socketinstance = io("http://192.168.1.5:3001", {
      transports: ["websocket"],
    });
    set({ socket: socketinstance });
  },
}));
