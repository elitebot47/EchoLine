import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type SocketStoreType = {
  socket: Socket | null;
  initializesocket: () => void;
};
const port = 3002;
export const useSocketStore = create<SocketStoreType>((set) => ({
  socket: null,
  initializesocket: () => {
    const socketinstance = io(`http://localhost:${port}`);
    set({ socket: socketinstance });
  },
}));
