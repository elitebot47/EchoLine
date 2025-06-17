import type { MinimalMessage } from "@/types";
import { create } from "zustand";

type MessagesStoreType = {
  messages: MinimalMessage[] | null;
  setMessages: (input: MinimalMessage[] | null) => void;
  addMessage: (input: MinimalMessage) => void;
  emptyMessages: () => void;
  replaceMessage: (id: string, message: MinimalMessage) => void;
  deleteMessage: (id: string) => void;
};

export const useMessagesStore = create<MessagesStoreType>((set) => ({
  messages: null,
  setMessages: (messages) => set({ messages }),
  addMessage: (message) => {
    if (!message.id || !message.content || message.content.trim() === "")
      return;
    set((state) => ({
      messages: state.messages ? [...state.messages, message] : [message],
    }));
  },
  replaceMessage: (id, newMessage) =>
    set((state) => {
      const messages = state.messages || [];
      return {
        messages: messages.map((msg) =>
          msg.id === id ? { ...msg, ...newMessage } : msg
        ),
      };
    }),
  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages?.filter((message) => message.id !== id),
    })),
  emptyMessages: () => set({ messages: [] }),
}));
