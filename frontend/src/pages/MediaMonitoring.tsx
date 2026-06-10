import { Radio, TrendingUp, Smile, Zap, Activity, Heart, MessageCircle } from "lucide-react";

const mentions = [
  {
    creator: "@charlie_travels",
    platform: "Instagram",
    platformHue: 330,
    content: "Just checked in at the beach villa recommended by #creatorhub and the experience is absolutely unreal. Highly recommend it! 🌴",
    sentiment: "positive" as const,
    likes: "12.4K",
    comments: 482,
    time: "2 jam lalu",
  },
  {
    creator: "@gadget_master",
    platform: "TikTok",
    platformHue: 0,
    content: "Unboxing the next-gen mechanical keyboard. Keycaps sound incredibly thocky and the layout is 10/10. Great review campaign collab with CreatorHub. #keyboard",
    sentiment: "positive" as const,
    likes: "42.1K",
    comments: 1200,
    time: "5 jam lalu",
  },
  {
    creator: "ReviewCorner ID",
    platform: "YouTube",
    platformHue: 0,
    content: "Testing out the organic skin radiance serum launch package. Product details look good, waiting to see long-term effects.",
    sentiment: "neutral" as const,
    likes: "150K",
    comments: 890,
    time: "Kemarin",
  },
  {
    creator: "Sinta Dewi",
    platform: "Instagram",
    platformHue: 330,
    content: "Restoran baru di Surabaya ini agak mengecewakan, porsinya kecil tapi harganya lumayan tinggi. Ekspektasi vs realita...",
    sentiment: "negative" as const,
    likes: "3.2K",
    comments: 214,
    time: "Kemarin",
  },
  {
    creator: "Fajar Nugroho",
    platform: "YouTube",
    platformHue: 0,
    content: "Laptop gaming terbaru dari brand GHI - performa oke di harga segitu, tapi baterai masih jadi kelemahan utamanya.",
    sentiment: "neutral" as const,
    likes: "8.7K",
    comments: 423,
    time: "2 hari lalu",
  },
];

const sentimentChip = (s: "positive" | "neutral" | "negative") => {
  const map = {
    positive: { label: "Positif", bg: "#DCFCE7", fg: "#15803D" },
    neutral:  { label: "Netral",  bg: "#F1F5F9", fg: "#475569" },
    negative: { label: "Negatif", bg: "#FEE2E2", fg: "#B91C1C" },
  };
  const cfg = map[s];
  return (
    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.fg }}>{cfg.label}</span>
  );
};

const platformChip = (platform: string) => {
  const map: Record<string, { bg: string; fg: string }> = {
    Instagram: { bg: "#FCE7F3", fg: "#9D174D" },
    TikTok:    { bg: "#F1F5F9", fg: "#1E293B" },
    YouTube:   { bg: "#FEE2E2", fg: "#991B1B" },
  };
  const cfg = map[platform] ?? { bg: "#F1F5F9", fg: "#475569" };
  return (
    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
      style={{ background: cfg.bg, color: cfg.fg }}>{platform}</span>
  );
};

export default function MediaMonitoring() {
  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <div>
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Media Monitoring
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Pantau mention dan sentimen brand Anda secara real-time
        </p>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: "Total Mention", value: "4.218", sub: "+14.2% minggu ini", icon: MessageCircle, hue: 220 },
          { label: "Sentimen Positif", value: "84%", sub: "+2.1% vs minggu lalu", icon: Smile, hue: 142 },
          { label: "Viral Reach", value: "2.4M", sub: "+18.6% growth", icon: Zap, hue: 28 },
          { label: "Brand Health Index", value: "92/100", sub: "Excellent rating", icon: Activity, hue: 42 },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border p-5 flex items-center gap-4"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `hsl(${m.hue}, 80%, 95%)`, color: `hsl(${m.hue}, 60%, 40%)` }}>
              <m.icon style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-[20px] font-extrabold"
                style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.value}</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{m.label}</p>
              <p className="text-[11px] mt-0.5" style={{ color: "#16A34A" }}>{m.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mention feed */}
      <div className="rounded-xl border overflow-hidden"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="px-5 py-4 border-b flex items-center gap-2"
          style={{ borderColor: "var(--ch-border)" }}>
          <Radio style={{ width: 15, height: 15, color: "var(--ch-primary)" }} />
          <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>Feed Mention Terbaru</p>
          <span className="ml-1 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse"
            style={{ background: "#FEE2E2", color: "#DC2626" }}>
            ● Live Tracking
          </span>
        </div>
        <div className="divide-y" style={{ borderColor: "var(--ch-border)" }}>
          {mentions.map((m, i) => (
            <div key={i} className="flex items-start gap-3 p-4 transition-colors hover:bg-slate-50">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold shrink-0"
                style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
                {m.creator[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{m.creator}</span>
                  {platformChip(m.platform)}
                  {sentimentChip(m.sentiment)}
                </div>
                <p className="text-[13px] line-clamp-2" style={{ color: "var(--ch-text-muted)" }}>{m.content}</p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--ch-text-soft)" }}>
                    <Heart style={{ width: 11, height: 11 }} /> {m.likes}
                  </span>
                  <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--ch-text-soft)" }}>
                    <MessageCircle style={{ width: 11, height: 11 }} /> {m.comments.toLocaleString("id-ID")}
                  </span>
                  <span className="text-[11px]" style={{ color: "var(--ch-text-soft)" }}>{m.time}</span>
                </div>
              </div>
              <TrendingUp style={{ width: 14, height: 14, color: "var(--ch-text-soft)", flexShrink: 0, marginTop: 2 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
