import { create } from "zustand";

type UIState = {
  showChat: boolean;
  setShowChat: (show: boolean) => void;
};

export const useShowChatStore = create<UIState>((set) => ({
  showChat: false,
  setShowChat: (show) => set({ showChat: show }),
}));
