import { io, Socket } from "socket.io-client";
import { create } from "zustand";

type SocketStoreType = {
  socket: Socket | null;
  initializesocket: () => void;
};
export const useSocketStore = create<SocketStoreType>((set) => ({
  socket: null,
  initializesocket: () => {
    const socketinstance = io(process.env.NEXT_PUBLIC_SOCKET_URL, {
      transports: ["websocket"],
    });
    set({ socket: socketinstance });
  },
}));
