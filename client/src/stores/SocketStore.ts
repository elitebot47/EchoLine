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
    const socketinstance = io(`192.168.1.3:${port}`);
    set({ socket: socketinstance });
  },
}));
