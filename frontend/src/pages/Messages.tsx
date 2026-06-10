import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, ExternalLink, Search, MessageSquare, Star, MapPin, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useChatChannels, useMessages, useSendMessage } from "@/hooks/useMessages";
import { creatorsApi } from "@/lib/api";
import type { Creator, Message } from "@/types";
import { cn } from "@/lib/utils";

const AUTO_REPLIES = [
  "Thanks for the brief, Arif! I'll review and send a custom proposal draft.",
  "Checked my content calendar — definitely have slot availability in June.",
  "Sounds great. I can structure the Instagram reel exactly as suggested.",
  "Got it! I'll make sure the unboxing highlights the key features you mentioned.",
  "Noted. I'll follow up shortly!",
];

const CREATOR_HUES: Record<string, number> = {};
function getHue(name: string): number {
  if (!CREATOR_HUES[name]) CREATOR_HUES[name] = (name.charCodeAt(0) * 47) % 360;
  return CREATOR_HUES[name];
}

export default function Messages() {
  const qc = useQueryClient();
  const [activeChannelId, setActiveChannelId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [profileCreator, setProfileCreator] = useState<Creator | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [readChannelIds, setReadChannelIds] = useState<Set<string>>(new Set());
  const bottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: channels, isLoading: loadingChannels } = useChatChannels();
  const { data: messages, isLoading: loadingMessages } = useMessages(activeChannelId ?? "");
  const sendMutation = useSendMessage(activeChannelId ?? "");

  const activeChannel = channels?.find((c) => c.id === activeChannelId);

  const filteredChannels = channels?.filter((c) =>
    c.creatorName.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

  const getUnread = (channelId: string, original: number) =>
    readChannelIds.has(channelId) ? 0 : original;

  const totalUnread = channels?.reduce((a, c) => a + getUnread(c.id, c.unreadCount), 0) ?? 0;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openChannel = (channelId: string) => {
    setActiveChannelId(channelId);
    setReadChannelIds((prev) => new Set([...prev, channelId]));
  };

  const closeMobileChat = () => setActiveChannelId(null);

  const handleSend = async () => {
    if (!activeChannelId) return;
    let content = draft.trim();
    if (!content && !attachment) return;
    if (attachment) content = content ? `${content} [Lampiran: ${attachment}]` : `[Lampiran: ${attachment}]`;
    await sendMutation.mutateAsync(content);
    setDraft("");
    setAttachment(null);
    const channelId = activeChannelId;
    setTimeout(() => {
      const reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      const fakeMsg: Message = {
        id: `auto-${Date.now()}`,
        channelId,
        senderId: "creator",
        senderType: "creator",
        content: reply,
        createdAt: new Date().toISOString(),
      };
      qc.setQueryData(["messages", channelId], (old: Message[] | undefined) =>
        old ? [...old, fakeMsg] : [fakeMsg]
      );
    }, 1500);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachment(file.name);
      toast.success(`File "${file.name}" siap dikirim`);
    }
    e.target.value = "";
  };

  const handleViewProfile = async () => {
    if (!activeChannel?.creatorId) return;
    setShowProfile(true);
    setProfileLoading(true);
    try {
      const creator = await creatorsApi.getById(activeChannel.creatorId);
      setProfileCreator(creator);
    } catch {
      toast.error("Gagal memuat profil kreator");
    } finally {
      setProfileLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden">
      {/* ─── Left: Thread list ─────────────────────────────── */}
      <aside
        className={cn(
          "w-full lg:w-[300px] shrink-0 border-r flex flex-col min-h-0",
          activeChannelId ? "hidden lg:flex" : "flex",
        )}
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}
      >
        <div className="px-4 py-3.5 border-b flex items-center justify-between"
          style={{ borderColor: "var(--ch-border)" }}>
          <p className="text-[15px] font-bold" style={{ color: "var(--ch-text)" }}>Conversations</p>
          {totalUnread > 0 && (
            <span className="px-2 py-0.5 text-[11px] font-bold rounded-full"
              style={{ background: "var(--ch-orange-100)", color: "var(--ch-orange)" }}>
              {totalUnread} unread
            </span>
          )}
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b" style={{ borderColor: "var(--ch-border)" }}>
          <div className="relative">
            <Search style={{ width: 13, height: 13, position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--ch-text-soft)" }} />
            <input
              placeholder="Cari kreator..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-[12px] rounded-lg border outline-none transition-colors"
              style={{ borderColor: "var(--ch-border)", background: "var(--ch-bg)", color: "var(--ch-text)" }}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ch-primary)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ch-border)")}
            />
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto">
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
          ) : filteredChannels.length > 0 ? (
            filteredChannels.map((ch) => {
              const unread = getUnread(ch.id, ch.unreadCount);
              const hue = getHue(ch.creatorName);
              const active = activeChannelId === ch.id;
              return (
                <button key={ch.id} onClick={() => openChannel(ch.id)}
                  className="w-full flex items-center gap-2.5 px-3.5 py-3 text-left border-b transition-colors"
                  style={{
                    borderColor: "var(--ch-border)",
                    background: active ? "var(--ch-primary-50)" : "transparent",
                  }}
                  onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "var(--ch-bg)"; }}
                  onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                >
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold"
                      style={{ background: `hsl(${hue}, 65%, 50%)` }}>
                      {ch.creatorName[0]}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                      style={{ background: "#16A34A" }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className="text-[13px] font-semibold truncate"
                        style={{ color: unread > 0 ? "var(--ch-text)" : "var(--ch-text)", fontWeight: unread > 0 ? 700 : 600 }}>
                        {ch.creatorName}
                      </p>
                    </div>
                    <p className="text-[11px] truncate" style={{ color: "var(--ch-text-muted)" }}>
                      {ch.lastMessage || "Start conversation..."}
                    </p>
                  </div>
                  {unread > 0 && (
                    <span className="w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center shrink-0"
                      style={{ background: "var(--ch-primary)" }}>
                      {unread}
                    </span>
                  )}
                </button>
              );
            })
          ) : searchTerm ? (
            <div className="p-6 text-center text-[13px]" style={{ color: "var(--ch-text-soft)" }}>
              Tidak ditemukan "{searchTerm}"
            </div>
          ) : (
            <div className="p-6 text-center text-[13px]" style={{ color: "var(--ch-text-soft)" }}>
              Belum ada percakapan
            </div>
          )}
        </div>
      </aside>

      {/* ─── Center: Chat area ─────────────────────────────── */}
      <div
        className={cn(
          "flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden",
          activeChannelId ? "flex" : "hidden lg:flex",
        )}
      >
        {activeChannel ? (
          <>
            {/* Chat header */}
            <div className="h-14 border-b flex items-center px-3 sm:px-4 gap-2 sm:gap-3 shrink-0"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
              <button
                type="button"
                onClick={closeMobileChat}
                className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors hover:bg-slate-100"
                style={{ color: "var(--ch-text-muted)" }}
                aria-label="Kembali ke daftar percakapan"
              >
                <ArrowLeft style={{ width: 18, height: 18 }} />
              </button>
              <div className="relative">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold"
                  style={{ background: `hsl(${getHue(activeChannel.creatorName)}, 65%, 50%)` }}>
                  {activeChannel.creatorName[0]}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                  style={{ background: "#16A34A" }} />
              </div>
              <div>
                <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>
                  {activeChannel.creatorName}
                </p>
                <p className="text-[11px]" style={{ color: "#16A34A" }}>Online · Responds within minutes</p>
              </div>
              <button
                className="ml-auto flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg border text-[12px] font-semibold transition-colors shrink-0"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-primary)"; (e.currentTarget as HTMLElement).style.color = "var(--ch-primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-border)"; (e.currentTarget as HTMLElement).style.color = "var(--ch-text-muted)"; }}
                onClick={handleViewProfile}>
                <ExternalLink style={{ width: 13, height: 13 }} />
                <span className="hidden sm:inline">View Profile</span>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3" style={{ background: "var(--ch-bg)" }}>
              {loadingMessages ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className={`flex ${i % 2 === 0 ? "" : "justify-end"}`}>
                      <Skeleton className="h-10 w-48 rounded-2xl" />
                    </div>
                  ))}
                </div>
              ) : messages && messages.length > 0 ? (
                messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderType === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="max-w-[85%] sm:max-w-[65%] px-[14px] py-2.5 text-[13.5px]"
                      style={msg.senderType === "user"
                        ? { background: "linear-gradient(135deg, #2563EB, #1D4ED8)", color: "white", borderRadius: "14px 14px 4px 14px" }
                        : { background: "var(--ch-surface)", color: "var(--ch-text)", border: "1px solid var(--ch-border)", borderRadius: "14px 14px 14px 4px", boxShadow: "var(--ch-shadow-sm)" }}>
                      {msg.content}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full text-[13px]" style={{ color: "var(--ch-text-soft)" }}>
                  Start conversation with {activeChannel.creatorName}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Attachment indicator */}
            {attachment && (
              <div className="px-4 py-2 border-t flex items-center gap-2 text-[12px]"
                style={{ background: "var(--ch-primary-50)", borderColor: "var(--ch-primary-100)", color: "var(--ch-primary)" }}>
                <Paperclip style={{ width: 13, height: 13 }} />
                <span className="flex-1 truncate">{attachment}</span>
                <button onClick={() => setAttachment(null)} style={{ color: "var(--ch-primary)" }}>×</button>
              </div>
            )}

            {/* Input */}
            <div className="px-4.5 py-2.5 border-t flex gap-2"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
              <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChange} />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-9 h-9 rounded-lg flex items-center justify-center border transition-colors"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-soft)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--ch-primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "var(--ch-text-soft)"; }}>
                <Paperclip style={{ width: 15, height: 15 }} />
              </button>
              <input
                className="flex-1 rounded-xl border px-4 py-2 text-[13px] outline-none transition-colors"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                placeholder="Type a message about the campaign brief..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ch-primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ch-border)")}
              />
              <button
                onClick={handleSend}
                disabled={(!draft.trim() && !attachment) || sendMutation.isPending}
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white transition-opacity"
                style={{ background: draft.trim() || attachment ? "var(--ch-primary)" : "var(--ch-border)" }}>
                <Send style={{ width: 15, height: 15 }} />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center gap-3" style={{ color: "var(--ch-text-soft)" }}>
            <MessageSquare style={{ width: 40, height: 40, opacity: 0.3 }} />
            <p className="text-[14px] font-medium">Select conversation</p>
            <p className="text-[12px]">Select a creator from the left panel to start chatting.</p>
          </div>
        )}
      </div>

      {/* ─── Right: Context panel ──────────────────────────── */}
      {activeChannel && (
        <aside className="hidden xl:flex w-[280px] shrink-0 border-l flex-col"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          {/* Creator info */}
          <div className="p-5 border-b" style={{ borderColor: "var(--ch-border)" }}>
            <p className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--ch-text-soft)" }}>
              Creator
            </p>
            <div className="flex items-center gap-3 mb-3">
              <div className="relative">
                <div className="w-[70px] h-[70px] rounded-full flex items-center justify-center text-white text-[15px] font-bold overflow-hidden"
                  style={{ background: `hsl(${getHue(activeChannel.creatorName)}, 65%, 50%)` }}>
                  {activeChannel.creatorName[0]}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                  style={{ background: "#16A34A" }} />
              </div>
              <div>
                <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>{activeChannel.creatorName}</p>
                <div className="flex items-center gap-1 text-[11px]" style={{ color: "var(--ch-text-muted)" }}>
                  <MapPin style={{ width: 10, height: 10 }} />
                  Jakarta, ID
                </div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: "Followers", value: "284K" },
                { label: "Eng. Rate", value: "5.8%" },
                { label: "Rating", value: "4.9" },
              ].map((s) => (
                <div key={s.label} className="p-2 rounded-lg"
                  style={{ background: "var(--ch-bg)" }}>
                  <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{s.value}</p>
                  <p className="text-[9px]" style={{ color: "var(--ch-text-soft)" }}>{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-1 mt-2.5">
              {["Beauty", "Lifestyle"].map((n) => (
                <span key={n} className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>{n}</span>
              ))}
              <span className="flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#FEF3C7", color: "#B45309" }}>
                <Star style={{ width: 9, height: 9 }} /> 4.9
              </span>
            </div>
          </div>

          {/* Active campaign card */}
          <div className="p-5 border-b" style={{ borderColor: "var(--ch-border)" }}>
            <p className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--ch-text-soft)" }}>
              Active Campaign
            </p>
            <div className="rounded-xl border overflow-hidden"
              style={{ borderColor: "var(--ch-border)" }}>
              <div className="h-1.5" style={{ background: "var(--ch-primary)" }} />
              <div className="p-3">
                <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Brand Awareness Q2</p>
                <p className="text-[11px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>Wardah · Active</p>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span style={{ color: "var(--ch-text-muted)" }}>Deliverables</span>
                    <span className="font-semibold" style={{ color: "var(--ch-text)" }}>2 / 5</span>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: "var(--ch-border)" }}>
                    <div className="h-1.5 rounded-full" style={{ width: "40%", background: "var(--ch-primary)" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-5 space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wide mb-3" style={{ color: "var(--ch-text-soft)" }}>
              Quick Actions
            </p>
            {[
              { icon: <CheckCircle style={{ width: 13, height: 13 }} />, label: "Approve Content" },
              { icon: <ExternalLink style={{ width: 13, height: 13 }} />, label: "View Full Profile" },
            ].map((a) => (
              <button key={a.label}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border text-[12px] font-semibold transition-colors text-left"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-primary)"; (e.currentTarget as HTMLElement).style.color = "var(--ch-primary)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-border)"; (e.currentTarget as HTMLElement).style.color = "var(--ch-text-muted)"; }}
                onClick={a.label === "View Full Profile" ? handleViewProfile : undefined}>
                {a.icon}
                {a.label}
              </button>
            ))}
          </div>
        </aside>
      )}

      {/* Profile Dialog */}
      <Dialog open={showProfile} onOpenChange={setShowProfile}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Profil Kreator</DialogTitle>
          </DialogHeader>
          {profileLoading ? (
            <div className="space-y-3 py-4">
              <Skeleton className="w-16 h-16 rounded-full mx-auto" />
              <Skeleton className="h-5 w-40 mx-auto" />
              <Skeleton className="h-4 w-32 mx-auto" />
              <Skeleton className="h-16" />
            </div>
          ) : profileCreator ? (
            <div className="py-2 space-y-4">
              <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 rounded-full overflow-hidden" style={{ background: "var(--ch-primary)" }}>
                  {profileCreator.imageUrl ? (
                    <img src={profileCreator.imageUrl} alt={profileCreator.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl font-bold text-white">
                      {profileCreator.name[0]}
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <p className="font-bold text-[15px]" style={{ color: "var(--ch-text)" }}>{profileCreator.name}</p>
                  <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
                    {profileCreator.city} · {profileCreator.category}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 p-3 rounded-xl" style={{ background: "var(--ch-bg)" }}>
                <div className="text-center">
                  <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{profileCreator.followersText}</p>
                  <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{profileCreator.engagementRate}%</p>
                  <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>Engagement</p>
                </div>
                <div className="text-center">
                  <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{profileCreator.rating}</p>
                  <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>Rating</p>
                </div>
              </div>
              {profileCreator.bio && (
                <p className="text-[13px] line-clamp-3" style={{ color: "var(--ch-text-muted)" }}>{profileCreator.bio}</p>
              )}
              <div className="flex justify-between text-[13px]">
                <span style={{ color: "var(--ch-text-muted)" }}>Starting Price</span>
                <span className="font-bold" style={{ color: "var(--ch-text)" }}>{profileCreator.priceText}</span>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
