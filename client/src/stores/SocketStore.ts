import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type SocketStoreType = {
  socket: Socket | null;
  initializesocket: () => void;
};
export const useSocketStore = create<SocketStoreType>((set) => ({
  socket: null,
  initializesocket: () => {
    const socketinstance = io("http://localhost:3001");
    set({ socket: socketinstance });
  },
}));
