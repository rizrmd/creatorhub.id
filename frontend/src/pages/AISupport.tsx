import { useState, useRef, useEffect } from "react";
import { Sparkles, Plus, Mic, Send, MessageSquare, Trash2, BookOpen } from "lucide-react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

type Chat = {
  id: number;
  title: string;
  messages: Message[];
};

const initialChats: Chat[] = [
  {
    id: 1,
    title: "Friendly Greeting",
    messages: [
      {
        id: 1,
        role: "assistant",
        content: "Hello! How can I help you today? I can assist you with creating designs, presentations, images, videos, documents, and much more. What would you like to work on?",
      },
    ],
  },
];

export default function AISupport() {
  const [chats, setChats] = useState<Chat[]>(initialChats);
  const [activeChatId, setActiveChatId] = useState(1);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChat = chats.find((c) => c.id === activeChatId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
    };

    setChats((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, messages: [...c.messages, userMsg] }
          : c
      )
    );
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const aiMsg: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          "I'm here to help! As an AI assistant for CreatorHub, I can help you with campaign strategies, content ideas, creator recommendations, analytics insights, and more. What would you like to know?",
      };
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, messages: [...c.messages, aiMsg] }
            : c
        )
      );
      setIsTyping(false);
    }, 1500);
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: Date.now(),
      title: "New Chat",
      messages: [
        {
          id: Date.now(),
          role: "assistant",
          content:
            "Hello! How can I help you today? I can assist you with creating designs, presentations, images, videos, documents, and much more. What would you like to work on?",
        },
      ],
    };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  };

  const handleDeleteChat = (id: number) => {
    setChats((prev) => prev.filter((c) => c.id !== id));
    if (activeChatId === id) {
      setActiveChatId(chats.length > 1 ? chats.find((c) => c.id !== id)!.id : 0);
    }
  };

  return (
    <div className="flex h-[calc(100vh-0px)]" style={{ background: "#0D0B1A" }}>
      {/* Sidebar */}
      <div className="w-64 shrink-0 flex flex-col border-r border-white/10" style={{ background: "#13111F" }}>
        <div className="p-4">
          <button
            onClick={handleNewChat}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-semibold text-white transition-colors hover:bg-white/10"
            style={{ border: "1px solid rgba(255,255,255,0.15)" }}
          >
            <Plus className="w-4 h-4" />
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-0.5">
          <p className="px-2 py-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Today</p>
          {chats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setActiveChatId(chat.id)}
              className={`group flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer transition-colors ${
                activeChatId === chat.id ? "bg-white/10" : "hover:bg-white/5"
              }`}
            >
              <MessageSquare className="w-4 h-4 shrink-0 text-slate-400" />
              <span className="flex-1 text-[13px] text-slate-300 truncate">{chat.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteChat(chat.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-white/10 transition-opacity"
              >
                <Trash2 className="w-3 h-3 text-slate-500" />
              </button>
            </div>
          ))}
        </div>

        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-2 px-2 py-1.5 text-[12px] text-slate-400">
            <BookOpen className="w-4 h-4" />
            Memory
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
            {activeChat?.messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" ? (
                  <div className="max-w-2xl">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}>
                        <Sparkles className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-[14px] leading-relaxed text-slate-200 pt-1">{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="max-w-md">
                    <div className="px-4 py-2.5 rounded-2xl rounded-br-md" style={{ background: "linear-gradient(135deg, #7C3AED, #6D28D9)" }}>
                      <p className="text-[14px] text-white">{msg.content}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="max-w-2xl">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, #7C3AED, #2563EB)" }}>
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex items-center gap-1.5 pt-2">
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className="shrink-0 px-6 pb-6">
          <div className="max-w-3xl mx-auto">
            <div
              className="rounded-2xl p-1"
              style={{
                background: "linear-gradient(135deg, rgba(124,58,237,0.4), rgba(37,99,235,0.4))",
              }}
            >
              <div className="rounded-xl px-4 py-3" style={{ background: "#1A1730" }}>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Ask me anything"
                  rows={1}
                  className="w-full bg-transparent text-[14px] text-white placeholder-slate-500 resize-none focus:outline-none"
                />
                <div className="flex items-center justify-between mt-2">
                  <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <Plus className="w-5 h-5 text-slate-400" />
                  </button>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                      <Mic className="w-5 h-5 text-slate-400" />
                    </button>
                    <button
                      onClick={handleSend}
                      disabled={!input.trim()}
                      className="p-1.5 rounded-lg transition-colors disabled:opacity-30"
                      style={{
                        background: input.trim() ? "linear-gradient(135deg, #7C3AED, #2563EB)" : "transparent",
                      }}
                    >
                      <Send className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
