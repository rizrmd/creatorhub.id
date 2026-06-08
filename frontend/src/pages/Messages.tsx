import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Paperclip, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useChatChannels, useMessages, useSendMessage } from "@/hooks/useMessages";
import { cn } from "@/lib/utils";

export default function Messages() {
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: channels, isLoading: loadingChannels } = useChatChannels();
  const { data: messages, isLoading: loadingMessages } = useMessages(activeChannelId ?? "");
  const sendMutation = useSendMessage(activeChannelId ?? "");

  const activeChannel = channels?.find((c) => c.id === activeChannelId);
  const totalUnread = channels?.reduce((a, c) => a + c.unreadCount, 0) ?? 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim() || !activeChannelId) return;
    await sendMutation.mutateAsync(draft.trim());
    setDraft("");
  };

  return (
    <div className="flex h-full">
      {/* Channel list */}
      <aside className="w-72 shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Conversations</h2>
          {totalUnread > 0 && (
            <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full">
              {totalUnread} Unread
            </span>
          )}
        </div>
        <div className="flex-1 overflow-auto">
          {loadingChannels ? (
            <div className="p-3 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : channels && channels.length > 0 ? (
            channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveChannelId(ch.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 text-left hover:bg-slate-50 transition-colors",
                  activeChannelId === ch.id && "bg-blue-50"
                )}
              >
                <div className="relative shrink-0">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                      {ch.creatorName[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-800 truncate">{ch.creatorName}</p>
                    {ch.unreadCount > 0 && (
                      <span className="w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shrink-0">
                        {ch.unreadCount}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{ch.lastMessage || "Mulai percakapan..."}</p>
                </div>
              </button>
            ))
          ) : (
            <div className="p-6 text-center text-slate-400 text-sm">Belum ada percakapan</div>
          )}
        </div>
      </aside>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {activeChannel ? (
          <>
            <div className="h-14 bg-white border-b border-slate-200 flex items-center px-4 gap-3 shrink-0">
              <div className="relative">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-blue-100 text-blue-700 text-xs">
                    {activeChannel.creatorName[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <p className="font-medium text-slate-800 text-sm">{activeChannel.creatorName}</p>
                <p className="text-xs text-green-600">Online · Fast responder</p>
              </div>
              <Button variant="outline" size="sm" className="ml-auto gap-1.5 text-xs">
                <ExternalLink className="w-3.5 h-3.5" />
                View Profile
              </Button>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-3 bg-slate-50">
              {loadingMessages ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={cn("flex", i % 2 === 0 ? "" : "justify-end")}>
                      <Skeleton className="h-10 w-48 rounded-2xl" />
                    </div>
                  ))}
                </div>
              ) : messages && messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn("flex", msg.senderType === "user" ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-xs px-3.5 py-2 rounded-2xl text-sm",
                        msg.senderType === "user"
                          ? "bg-blue-600 text-white rounded-br-sm"
                          : "bg-white text-slate-800 shadow-sm rounded-bl-sm"
                      )}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
                  Mulai percakapan dengan {activeChannel.creatorName}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Input
                placeholder="Ketik pesan untuk diskusi brief kampanye..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                className="flex-1"
              />
              <Button size="icon" onClick={handleSend} disabled={!draft.trim() || sendMutation.isPending}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageSquare className="w-12 h-12 mb-3 opacity-40" />
            <p className="text-sm font-medium">Select a conversation</p>
            <p className="text-xs mt-1">Pilih kreator dari panel kiri untuk mulai chat</p>
          </div>
        )}
      </div>
    </div>
  );
}
