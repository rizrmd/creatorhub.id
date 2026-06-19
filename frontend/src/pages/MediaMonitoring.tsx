import { Radio, TrendingUp, Smile, Zap, Activity, Heart, MessageCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mentions = [
  {
    creator: "@charlie_travels",
    platform: "Instagram",
    platformColor: "bg-pink-100 text-pink-600",
    content: "Just checked in at the beach villa recommended by #creatorhub and the experience is absolutely unreal. Highly recommend it! 🌴",
    sentiment: "positive" as const,
    likes: "12.4K",
    comments: 482,
    time: "2 jam lalu",
  },
  {
    creator: "@gadget_master",
    platform: "TikTok",
    platformColor: "bg-slate-100 text-slate-700",
    content: "Unboxing the next-gen mechanical keyboard. Keycaps sound incredibly thocky and the layout is 10/10. Great review campaign collab with CreatorHub. #keyboard",
    sentiment: "positive" as const,
    likes: "42.1K",
    comments: 1200,
    time: "5 jam lalu",
  },
  {
    creator: "ReviewCorner ID",
    platform: "YouTube",
    platformColor: "bg-red-100 text-red-600",
    content: "Testing out the organic skin radiance serum launch package. Product details look good, waiting to see long-term effects.",
    sentiment: "neutral" as const,
    likes: "150K",
    comments: 890,
    time: "Kemarin",
  },
  {
    creator: "Sinta Dewi",
    platform: "Instagram",
    platformColor: "bg-pink-100 text-pink-600",
    content: "Restoran baru di Surabaya ini agak mengecewakan, porsinya kecil tapi harganya lumayan tinggi. Ekspektasi vs realita...",
    sentiment: "negative" as const,
    likes: "3.2K",
    comments: 214,
    time: "Kemarin",
  },
  {
    creator: "Fajar Nugroho",
    platform: "YouTube",
    platformColor: "bg-red-100 text-red-600",
    content: "Laptop gaming terbaru dari brand GHI - performa oke di harga segitu, tapi baterai masih jadi kelemahan utamanya.",
    sentiment: "neutral" as const,
    likes: "8.7K",
    comments: 423,
    time: "2 hari lalu",
  },
];

const sentimentBadge = {
  positive: <Badge variant="success" className="text-[10px]">Positif</Badge>,
  negative: <Badge variant="destructive" className="text-[10px]">Negatif</Badge>,
  neutral: <Badge variant="secondary" className="text-[10px]">Netral</Badge>,
};

const kpiCards = [
  { label: "Total Mention", value: "4.218", sub: "+14.2% minggu ini", icon: MessageCircle, bgClass: "bg-blue-50", iconClass: "text-blue-600" },
  { label: "Sentimen Positif", value: "84%", sub: "+2.1% vs minggu lalu", icon: Smile, bgClass: "bg-green-50", iconClass: "text-green-600" },
  { label: "Viral Reach", value: "2.4M", sub: "+18.6% growth", icon: Zap, bgClass: "bg-orange-50", iconClass: "text-orange-600" },
  { label: "Brand Health Index", value: "92/100", sub: "Excellent rating", icon: Activity, bgClass: "bg-amber-50", iconClass: "text-amber-600" },
];

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

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpiCards.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-10 h-10 ${m.bgClass} rounded-xl flex items-center justify-center shrink-0`}>
                <m.icon className={`w-5 h-5 ${m.iconClass}`} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: "var(--ch-text)" }}>{m.value}</p>
                <p className="text-sm" style={{ color: "var(--ch-text-muted)" }}>{m.label}</p>
                <p className="text-xs text-green-600 mt-0.5">{m.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Radio className="w-4 h-4" style={{ color: "var(--ch-primary)" }} />
            Feed Mention Terbaru
            <Badge variant="destructive" className="text-[10px] ml-1 animate-pulse">Live Tracking</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mentions.map((m, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600 shrink-0">
                {m.creator[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium" style={{ color: "var(--ch-text)" }}>{m.creator}</span>
                  <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${m.platformColor}`}>
                    {m.platform}
                  </span>
                  {sentimentBadge[m.sentiment]}
                </div>
                <p className="text-sm mt-1 line-clamp-2" style={{ color: "var(--ch-text-muted)" }}>{m.content}</p>
                <div className="flex items-center gap-3 mt-1.5">
                  <span className="text-xs flex items-center gap-1" style={{ color: "var(--ch-text-soft)" }}>
                    <Heart className="w-3 h-3" /> {m.likes}
                  </span>
                  <span className="text-xs flex items-center gap-1" style={{ color: "var(--ch-text-soft)" }}>
                    <MessageCircle className="w-3 h-3" /> {m.comments.toLocaleString("id-ID")}
                  </span>
                  <span className="text-xs" style={{ color: "var(--ch-text-soft)" }}>{m.time}</span>
                </div>
              </div>
              <TrendingUp className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--ch-text-soft)" }} />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
