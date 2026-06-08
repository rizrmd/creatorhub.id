import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "@/lib/api";

export function useChatChannels() {
  return useQuery({
    queryKey: ["chat-channels"],
    queryFn: messagesApi.listChannels,
  });
}

export function useMessages(channelId: string) {
  return useQuery({
    queryKey: ["messages", channelId],
    queryFn: () => messagesApi.listMessages(channelId),
    enabled: !!channelId,
    refetchInterval: 5_000,
  });
}

export function useSendMessage(channelId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => messagesApi.sendMessage(channelId, content),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["messages", channelId] }),
  });
}
