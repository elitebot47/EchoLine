import { MessageType } from "@/types";
import { create } from "zustand";
type MessagesStoreType = {
  messages: MessageType[] | null;
  setMessages: (input: MessageType[] | null) => void;
  addMessage: (input: MessageType) => void;
  emptyMessages: () => void;
};

export const useMessagesStore = create<MessagesStoreType>((set) => ({
  messages: null,
  setMessages: (messages) => set({ messages: messages }),
  addMessage: (message) => {
    if (!message.id) {
      return;
    }
    set((state) => ({
      messages: state.messages ? [...state.messages, message] : [message],
    }));
  },
  emptyMessages: () => set({ messages: [] }),
}));
