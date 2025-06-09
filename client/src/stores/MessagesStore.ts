import { MessageType, MinimalMessage } from "@/types";
import { create } from "zustand";

type MessagesStoreType = {
  messages: MinimalMessage[] | null;
  setMessages: (input: MinimalMessage[] | null) => void;
  addMessage: (input: MinimalMessage) => void;
  emptyMessages: () => void;
};

export const useMessagesStore = create<MessagesStoreType>((set) => ({
  messages: null,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => {
    if (!message.id) return;
    set((state) => ({
      messages: state.messages ? [...state.messages, message] : [message],
    }));
  },
  emptyMessages: () => set({ messages: [] }),
}));
