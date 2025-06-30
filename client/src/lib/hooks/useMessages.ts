import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { MinimalMessage } from "@/types";

const fetchMessages = async (roomId: string): Promise<MinimalMessage[]> => {
  const res = await axios.get(`/api/message/fetchForRoom?roomId=${roomId}`);
  const messages = res.data.messages;
  
  return messages.map((message: any) => ({
    ...message,
    clientId: message.clientId || message.id,
  }));
};

export function useMessages(roomId: string) {
  return useQuery<MinimalMessage[]>({
    queryKey: ["messages", roomId],
    queryFn: () => fetchMessages(roomId),
    enabled: !!roomId,
    staleTime: 1000 * 60 * 2, 
    refetchOnWindowFocus: false,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useMessageMutations() {
  const queryClient = useQueryClient();

  const addMessage = async (roomId: string, message: MinimalMessage) => {
    const messageWithClientId = {
      ...message,
      clientId: message.clientId || message.id,
    };
    queryClient.setQueryData(["messages", roomId], (old = []) => [
      ...(old as MinimalMessage[]),
      messageWithClientId,
    ]);
  };

  const updateMessage = async (roomId: string, messageId: string, updates: Partial<MinimalMessage>) => {
    queryClient.setQueryData(["messages", roomId], (old = []) =>
      (old as MinimalMessage[]).map((msg) =>
        msg.id === messageId ? { 
          ...msg, 
          ...updates,
          clientId: updates.clientId || msg.clientId || msg.id,
        } : msg
      )
    );
  };

  const removeMessage = async (roomId: string, messageId: string) => {
    queryClient.setQueryData(["messages", roomId], (old = []) =>
      (old as MinimalMessage[]).filter((msg) => msg.id !== messageId)
    );
  };

  const removeOptimisticMessage = async (roomId: string, content: string, fromId: string, createdAt: string) => {
    queryClient.setQueryData(["messages", roomId], (old = []) =>
      (old as MinimalMessage[]).filter(
        (msg) =>
          !(
            msg.optimistic &&
            msg.content === content &&
            msg.fromId === fromId &&
            Math.abs(
              new Date(msg.createdAt).getTime() - new Date(createdAt).getTime()
            ) < 2000
          )
      )
    );
  };

  return {
    addMessage,
    updateMessage,
    removeMessage,
    removeOptimisticMessage,
  };
} 