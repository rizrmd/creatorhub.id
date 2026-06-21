import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Send, Search, MessageSquare, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDisplayUser } from "@/hooks/useDisplayUser";
import { KREATOR_MESSAGE_CHANNELS } from "@/data/kreatorData";

function buildInitialMessages(firstName: string): Record<string, { id: string; text: string; from: "me" | "them"; time: string }[]> {
  return {
    "1": [
      { id: "m1", text: `Hi ${firstName}! We're excited to collaborate on the ROG Phone Launch campaign 🎮`, from: "them", time: "10:30" },
      { id: "m2", text: "Hey! Ready! I've received the product, it's awesome 🔥", from: "me", time: "10:35" },
      { id: "m3", text: "We're waiting for your first content! Deadline is next week.", from: "them", time: "10:42" },
    ],
    "2": [
      { id: "m1", text: `Welcome to the Ramadan Glow campaign, ${firstName}!`, from: "them", time: "Yesterday 09:00" },
      { id: "m2", text: "Brief has been sent, please check.", from: "them", time: "Yesterday 09:05" },
    ],
    "3": [
      { id: "m1", text: "Thank you for your collaboration, your content is great!", from: "them", time: "2 days ago" },
    ],
  };
}

const AUTO_REPLIES = [
  "Thank you, we'll respond shortly!",
  "Alright, we've followed up on your request.",
  "Your content has been reviewed, it's outstanding! 🎉",
  "Please proceed according to the brief that has been sent.",
];

export default function CreatorMessages() {
  const { firstName } = useDisplayUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeId, setActiveId] = useState<string>(() =>
    typeof window !== "undefined" && window.innerWidth >= 1024 ? "1" : "",
  );
  const [messages, setMessages] = useState(() => buildInitialMessages(firstName));
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");

  useEffect(() => {
    if (!searchParams.has("search")) return;
    setSearch(searchParams.get("search") ?? "");
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const messagesPaneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pane = messagesPaneRef.current;
    if (!pane) return;
    pane.scrollTo({ top: pane.scrollHeight, behavior: "smooth" });
  }, [messages, activeId]);

  const send = () => {
    if (!draft.trim()) return;
    const newMsg = { id: Date.now().toString(), text: draft, from: "me" as const, time: "Just now" };
    setMessages((m) => ({ ...m, [activeId]: [...(m[activeId] ?? []), newMsg] }));
    setDraft("");
    setTimeout(() => {
      const reply = { id: (Date.now() + 1).toString(), text: AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)], from: "them" as const, time: "Just now" };
      setMessages((m) => ({ ...m, [activeId]: [...(m[activeId] ?? []), reply] }));
    }, 1400);
  };

  const filtered = KREATOR_MESSAGE_CHANNELS.filter(
    (c) =>
      !search.trim() ||
      c.brand.toLowerCase().includes(search.toLowerCase()) ||
      c.campaign.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMsg.toLowerCase().includes(search.toLowerCase()),
  );
  const active = KREATOR_MESSAGE_CHANNELS.find((c) => c.id === activeId);
  const activeMessages = messages[activeId] ?? [];

  return (
    <div className="flex h-full min-h-0 overflow-hidden" style={{ background: "var(--ch-bg)" }}>
      {/* Thread list */}
      <div
        className={cn(
          "w-full lg:w-[300px] shrink-0 border-r flex flex-col min-h-0",
          activeId ? "hidden lg:flex" : "flex",
        )}
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}
      >
        <div className="p-4 border-b" style={{ borderColor: "var(--ch-border)" }}>
          <p className="text-[15px] font-bold mb-3" style={{ color: "var(--ch-text)" }}>Messages</p>
          <div className="relative">
            <Search style={{ width: 14, height: 14, position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--ch-text-soft)" }} />
            <input
              className="w-full rounded-lg border pl-8 pr-3 py-2 text-[12px] outline-none"
              style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
              placeholder="Search brands..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ch-primary)")}
              onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ch-border)")}
            />
          </div>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto">
          {filtered.map((c) => (
            <button key={c.id}
              onClick={() => setActiveId(c.id)}
              className="w-full p-4 text-left border-b flex items-center gap-3 transition-colors"
              style={{
                borderColor: "var(--ch-border)",
                background: activeId === c.id ? "var(--ch-primary-50)" : "transparent",
              }}
              onMouseEnter={(e) => { if (activeId !== c.id) (e.currentTarget as HTMLElement).style.background = "var(--ch-bg)"; }}
              onMouseLeave={(e) => { if (activeId !== c.id) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[13px] font-bold"
                  style={{ background: c.color }}>{c.avatar}</div>
                {c.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                  style={{ background: "#16A34A" }} />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <p className="text-[13px] font-bold truncate" style={{ color: "var(--ch-text)" }}>{c.brand}</p>
                  <span className="text-[10px] shrink-0 ml-1" style={{ color: "var(--ch-text-soft)" }}>{c.time}</span>
                </div>
                <p className="text-[11px] truncate" style={{ color: "var(--ch-text-muted)" }}>{c.lastMsg}</p>
              </div>
              {c.unread > 0 && (
                <span className="w-5 h-5 rounded-full text-[10px] font-bold text-white flex items-center justify-center shrink-0"
                  style={{ background: "var(--ch-primary)" }}>{c.unread}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {active ? (
        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
          {/* Header */}
          <div className="px-3 sm:px-5 py-3.5 border-b flex items-center gap-2 sm:gap-3"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <button
              type="button"
              onClick={() => setActiveId("")}
              className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors hover:bg-slate-100"
              style={{ color: "var(--ch-text-muted)" }}
              aria-label="Back to message list"
            >
              <ArrowLeft style={{ width: 18, height: 18 }} />
            </button>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-[13px] font-bold"
              style={{ background: active.color }}>{active.avatar}</div>
            <div>
              <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>{active.brand}</p>
              <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{active.campaign}</p>
            </div>
          </div>
          {/* Messages */}
          <div ref={messagesPaneRef} className="flex-1 min-h-0 overflow-y-auto p-5 space-y-3">
            {activeMessages.map((m) => (
              <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className="max-w-[85%] sm:max-w-[65%] rounded-2xl px-4 py-2.5 text-[13px]"
                  style={m.from === "me"
                    ? { background: "#16A34A", color: "white", borderBottomRightRadius: 4 }
                    : { background: "var(--ch-surface)", color: "var(--ch-text)", border: "1px solid var(--ch-border)", borderBottomLeftRadius: 4 }}>
                  <p>{m.text}</p>
                  <p className="text-[10px] mt-1 opacity-60 text-right">{m.time}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          {/* Input */}
          <div className="p-4 border-t" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <div className="flex gap-2 items-end">
              <input
                className="flex-1 rounded-xl border px-4 py-2.5 text-[13px] outline-none resize-none"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                placeholder="Type a message..."
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
                onFocus={(e) => (e.currentTarget.style.borderColor = "#16A34A")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ch-border)")}
              />
              <button
                onClick={send}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-opacity"
                style={{ background: draft.trim() ? "#16A34A" : "var(--ch-border)" }}
                disabled={!draft.trim()}>
                <Send style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="hidden lg:flex flex-1 items-center justify-center flex-col gap-3"
          style={{ color: "var(--ch-text-soft)" }}>
          <MessageSquare style={{ width: 40, height: 40, opacity: 0.3 }} />
          <p className="text-[14px]">Select a conversation</p>
        </div>
      )}
    </div>
  );
}
