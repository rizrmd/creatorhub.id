import { useState } from "react";
import {
  Search, Upload, Calendar, Eye, Heart,
  MessageCircle, Share2, MoreHorizontal, Image, Video, FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const contents = [
  {
    id: 1,
    title: "Swasembada Air - Campaign Launch",
    client: "Komdigi",
    type: "Reels",
    typeIcon: Video,
    status: "published",
    date: "15 Mar 2026",
    views: "124K",
    likes: "8.2K",
    comments: 342,
    hue: 210,
  },
  {
    id: 2,
    title: "Tutorial Digitalisasi UMKM Ep.1",
    client: "Kementrian UMKM",
    type: "Video",
    typeIcon: Video,
    status: "published",
    date: "10 Mar 2026",
    views: "89K",
    likes: "5.1K",
    comments: 210,
    hue: 142,
  },
  {
    id: 3,
    title: "Koperasi Sejahtera - Testimoni",
    client: "Kemenkop",
    type: "Carousel",
    typeIcon: Image,
    status: "draft",
    date: "20 Mar 2026",
    views: "-",
    likes: "-",
    comments: 0,
    hue: 262,
  },
  {
    id: 4,
    title: "BNI QRIS Challenge",
    client: "PT Bank Negara Indonesia",
    type: "Reels",
    typeIcon: Video,
    status: "published",
    date: "28 Feb 2026",
    views: "256K",
    likes: "15.3K",
    comments: 890,
    hue: 35,
  },
  {
    id: 5,
    title: "Behind the Scenes - Davo Daily",
    client: "Dave Laksono",
    type: "Stories",
    typeIcon: Image,
    status: "published",
    date: "18 Mar 2026",
    views: "45K",
    likes: "3.2K",
    comments: 87,
    hue: 190,
  },
  {
    id: 6,
    title: "Healthy Morning Routine",
    client: "Nurul Arifin",
    type: "Reels",
    typeIcon: Video,
    status: "review",
    date: "22 Mar 2026",
    views: "-",
    likes: "-",
    comments: 0,
    hue: 340,
  },
  {
    id: 7,
    title: "Infografis Data Koperasi 2026",
    client: "Kemenkop",
    type: "Carousel",
    typeIcon: Image,
    status: "published",
    date: "5 Mar 2026",
    views: "67K",
    likes: "4.5K",
    comments: 156,
    hue: 262,
  },
  {
    id: 8,
    title: "BTS Photoshoot Campaign",
    client: "Komdigi",
    type: "Photo",
    typeIcon: Image,
    status: "published",
    date: "12 Mar 2026",
    views: "34K",
    likes: "2.8K",
    comments: 95,
    hue: 210,
  },
];

const statusConfig: Record<string, { label: string; bg: string; color: string }> = {
  published: { label: "Published", bg: "#DCFCE7", color: "#16A34A" },
  draft: { label: "Draft", bg: "#F3F4F6", color: "#6B7280" },
  review: { label: "In Review", bg: "#FEF3C7", color: "#D97706" },
};

const contentStats = [
  { label: "Total Konten", value: "8", icon: FileText },
  { label: "Published", value: "6", icon: Eye },
  { label: "Total Views", value: "615K", icon: Eye },
  { label: "Total Engagement", value: "39.4K", icon: Heart },
];

export default function ContentHub() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = contents.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <div>
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Content Hub
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Kelola semua konten kampanye dalam satu tempat.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {contentStats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--ch-primary-50)" }}>
                <s.icon className="w-5 h-5" style={{ color: "var(--ch-primary)" }} />
              </div>
              <div>
                <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{s.value}</p>
                <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line" className="border-b w-full justify-start gap-0">
          <TabsTrigger value="all" className="text-[14px] font-semibold px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--ch-primary)] data-[state=active]:text-[var(--ch-primary)] data-[state=active]:shadow-none">
            Semua
          </TabsTrigger>
          <TabsTrigger value="published" className="text-[14px] font-semibold px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--ch-primary)] data-[state=active]:text-[var(--ch-primary)] data-[state=active]:shadow-none">
            Published
          </TabsTrigger>
          <TabsTrigger value="draft" className="text-[14px] font-semibold px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--ch-primary)] data-[state=active]:text-[var(--ch-primary)] data-[state=active]:shadow-none">
            Draft
          </TabsTrigger>
          <TabsTrigger value="review" className="text-[14px] font-semibold px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-[var(--ch-primary)] data-[state=active]:text-[var(--ch-primary)] data-[state=active]:shadow-none">
            In Review
          </TabsTrigger>
        </TabsList>

        <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative flex-1 max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
            <input
              type="text"
              placeholder="Cari konten..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border bg-white"
              style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
            />
          </div>
          <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-lg text-white" style={{ background: "var(--ch-primary)" }}>
            <Upload className="w-3.5 h-3.5" /> Upload Konten
          </button>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          <div className="flex flex-col gap-4">
            {filtered
              .filter((c) => activeTab === "all" || c.status === activeTab)
              .map((c) => {
                const TypeIcon = c.typeIcon;
                const st = statusConfig[c.status];
                return (
                  <div
                    key={c.id}
                    className="rounded-[14px] border overflow-hidden transition-all duration-200 hover:shadow-md"
                    style={{ background: "#FFFFFF", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="w-full sm:w-40 h-24 sm:h-auto flex items-center justify-center shrink-0" style={{ background: `hsl(${c.hue}, 80%, 95%)` }}>
                        <TypeIcon style={{ width: 32, height: 32, color: `hsl(${c.hue}, 60%, 45%)` }} />
                      </div>
                      <div className="flex-1 p-4 sm:p-5 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: `hsl(${c.hue}, 60%, 45%)` }}>{c.client}</span>
                          <Badge variant="secondary" className="text-[10px]">{c.type}</Badge>
                          <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                        </div>
                        <p className="text-[15px] font-bold leading-tight" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.title}</p>
                        <div className="flex flex-wrap items-center gap-4 pt-1">
                          <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--ch-text-muted)" }}>
                            <Calendar className="w-3 h-3" /> {c.date}
                          </span>
                          <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--ch-text-muted)" }}>
                            <Eye className="w-3 h-3" /> {c.views}
                          </span>
                          <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--ch-text-muted)" }}>
                            <Heart className="w-3 h-3" /> {c.likes}
                          </span>
                          <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--ch-text-muted)" }}>
                            <MessageCircle className="w-3 h-3" /> {c.comments}
                          </span>
                          <span className="text-[11px] flex items-center gap-1" style={{ color: "var(--ch-text-muted)" }}>
                            <Share2 className="w-3 h-3" /> Share
                          </span>
                        </div>
                      </div>
                      <div className="p-4 sm:p-5 flex items-start">
                        <button className="p-1 rounded hover:bg-slate-100">
                          <MoreHorizontal className="w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
