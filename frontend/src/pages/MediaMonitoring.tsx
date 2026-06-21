import { useState } from "react";
import {
  Radio, TrendingUp, Smile, Zap, Activity, Heart,
  MessageCircle, Eye, BarChart3, Users, Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const mentions = [
  {
    creator: "@charlie_travels",
    platform: "Instagram",
    platformColor: "bg-pink-100 text-pink-600",
    content: "Just checked in at the beach villa recommended by #creatorhub and the experience is absolutely unreal. Highly recommend it!",
    sentiment: "positive" as const,
    likes: "12.4K",
    comments: 482,
    time: "2 jam lalu",
  },
  {
    creator: "@gadget_master",
    platform: "TikTok",
    platformColor: "bg-slate-100 text-slate-700",
    content: "Unboxing the next-gen mechanical keyboard. Keycaps sound incredibly thocky and the layout is 10/10. Great review campaign collab with CreatorHub.",
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

const performanceKpis = [
  { label: "Engagement Rate", value: "4.8%", sub: "Rata-rata semua platform", icon: Heart, bgClass: "bg-pink-50", iconClass: "text-pink-600" },
  { label: "Impressions", value: "8.7M", sub: "+22% vs bulan lalu", icon: Eye, bgClass: "bg-indigo-50", iconClass: "text-indigo-600" },
  { label: "Click-Through Rate", value: "3.2%", sub: "+0.4% vs minggu lalu", icon: TrendingUp, bgClass: "bg-teal-50", iconClass: "text-teal-600" },
  { label: "Cost Per Engagement", value: "Rp 850", sub: "-12% vs bulan lalu", icon: BarChart3, bgClass: "bg-violet-50", iconClass: "text-violet-600" },
];

const platformPerformance = [
  { platform: "Instagram", reach: "3.2M", engagement: "5.1%", impressions: "4.8M", growth: "+18%", color: "#E1306C" },
  { platform: "TikTok", reach: "2.8M", engagement: "6.7%", impressions: "5.1M", growth: "+32%", color: "#000000" },
  { platform: "YouTube", reach: "1.5M", engagement: "3.2%", impressions: "2.9M", growth: "+8%", color: "#FF0000" },
  { platform: "Twitter/X", reach: "820K", engagement: "2.8%", impressions: "1.4M", growth: "-3%", color: "#1DA1F2" },
];

const trackedAccounts = [
  {
    name: "Komdigi",
    handle: "@kemkomdigiofficial",
    platform: "Instagram",
    platformColor: "bg-pink-100 text-pink-600",
    followers: "1.2M",
    engagement: "4.3%",
    lastPost: "3 jam lalu",
    sentiment: "positive" as const,
    trend: "up",
  },
  {
    name: "Kementrian UMKM",
    handle: "@kemenkopukm",
    platform: "Instagram",
    platformColor: "bg-pink-100 text-pink-600",
    followers: "890K",
    engagement: "3.8%",
    lastPost: "5 jam lalu",
    sentiment: "positive" as const,
    trend: "up",
  },
  {
    name: "BNI",
    handle: "@baborasworing",
    platform: "TikTok",
    platformColor: "bg-slate-100 text-slate-700",
    followers: "2.1M",
    engagement: "5.5%",
    lastPost: "1 jam lalu",
    sentiment: "positive" as const,
    trend: "up",
  },
  {
    name: "Dave Laksono",
    handle: "@davelaksono",
    platform: "Instagram",
    platformColor: "bg-pink-100 text-pink-600",
    followers: "450K",
    engagement: "6.1%",
    lastPost: "12 jam lalu",
    sentiment: "neutral" as const,
    trend: "stable",
  },
  {
    name: "Grab Indonesia",
    handle: "@grabid",
    platform: "Twitter/X",
    platformColor: "bg-blue-100 text-blue-600",
    followers: "1.8M",
    engagement: "2.1%",
    lastPost: "30 menit lalu",
    sentiment: "positive" as const,
    trend: "up",
  },
  {
    name: "Shopee Indonesia",
    handle: "@shopeeid",
    platform: "TikTok",
    platformColor: "bg-slate-100 text-slate-700",
    followers: "5.4M",
    engagement: "7.2%",
    lastPost: "2 jam lalu",
    sentiment: "positive" as const,
    trend: "up",
  },
];

export default function MediaMonitoring() {
  const [activeTab, setActiveTab] = useState("monitoring");

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <div>
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Media Monitoring
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Pantau mention, analisis performa, dan track akun klien Anda.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line" className="border-b w-full justify-start gap-0">
          <TabsTrigger
            value="monitoring"
            className="text-[14px] font-semibold px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--ch-primary)] data-[state=active]:text-[var(--ch-primary)] data-[state=active]:shadow-none"
          >
            <Radio className="w-4 h-4 mr-1.5" />
            Media & Sosmed Monitoring
          </TabsTrigger>
          <TabsTrigger
            value="performance"
            className="text-[14px] font-semibold px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--ch-primary)] data-[state=active]:text-[var(--ch-primary)] data-[state=active]:shadow-none"
          >
            <BarChart3 className="w-4 h-4 mr-1.5" />
            Performance Analysis
          </TabsTrigger>
          <TabsTrigger
            value="accounts"
            className="text-[14px] font-semibold px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--ch-primary)] data-[state=active]:text-[var(--ch-primary)] data-[state=active]:shadow-none"
          >
            <Users className="w-4 h-4 mr-1.5" />
            Track Accounts
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Media & Sosmed Monitoring */}
        <TabsContent value="monitoring" className="mt-4 space-y-6">
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
        </TabsContent>

        {/* Tab 2: Performance Analysis */}
        <TabsContent value="performance" className="mt-4 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {performanceKpis.map((m) => (
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
                <BarChart3 className="w-4 h-4" style={{ color: "var(--ch-primary)" }} />
                Performa per Platform
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                      <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Platform</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Reach</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Engagement</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold hidden sm:table-cell" style={{ color: "var(--ch-text-muted)" }}>Impressions</th>
                      <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Growth</th>
                    </tr>
                  </thead>
                  <tbody>
                    {platformPerformance.map((p) => (
                      <tr key={p.platform} className="border-b transition-colors hover:bg-slate-50" style={{ borderColor: "var(--ch-border)" }}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: p.color }} />
                            <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{p.platform}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[13px] text-right" style={{ color: "var(--ch-text-muted)" }}>{p.reach}</td>
                        <td className="px-4 py-3 text-[13px] font-semibold text-right" style={{ color: "#16A34A" }}>{p.engagement}</td>
                        <td className="px-4 py-3 text-[13px] text-right hidden sm:table-cell" style={{ color: "var(--ch-text-muted)" }}>{p.impressions}</td>
                        <td className="px-4 py-3 text-[13px] font-bold text-right">
                          <span style={{ color: p.growth.startsWith("+") ? "#16A34A" : "#DC2626" }}>{p.growth}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Track Accounts */}
        <TabsContent value="accounts" className="mt-4 space-y-6">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
              <input
                type="text"
                placeholder="Cari akun yang di-track..."
                className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border bg-white"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
              />
            </div>
            <span className="text-[12px] font-medium" style={{ color: "var(--ch-text-muted)" }}>
              {trackedAccounts.length} akun aktif
            </span>
          </div>

          <div className="flex flex-col gap-4">
            {trackedAccounts.map((a) => (
              <div
                key={a.handle}
                className="rounded-[14px] border overflow-hidden transition-all duration-200 hover:shadow-md"
                style={{
                  background: "#FFFFFF",
                  borderColor: "var(--ch-border)",
                  boxShadow: "var(--ch-shadow-sm)",
                }}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-full bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 shrink-0">
                      {a.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[15px] font-bold" style={{ color: "var(--ch-text)" }}>{a.name}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${a.platformColor}`}>
                          {a.platform}
                        </span>
                        {sentimentBadge[a.sentiment]}
                        {a.trend === "up" && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                            <TrendingUp className="w-3 h-3" /> Trending
                          </span>
                        )}
                      </div>
                      <p className="text-[12px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{a.handle}</p>
                      <div className="flex flex-wrap items-center gap-4 mt-2">
                        <div>
                          <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Followers</p>
                          <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>{a.followers}</p>
                        </div>
                        <div>
                          <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Engagement</p>
                          <p className="text-[14px] font-bold" style={{ color: "#16A34A" }}>{a.engagement}</p>
                        </div>
                        <div>
                          <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Last Post</p>
                          <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text)" }}>{a.lastPost}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
