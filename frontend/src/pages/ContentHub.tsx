import { useState } from "react";
import {
  Search, Eye, Image,
  ArrowUpDown, ChevronDown, Instagram, Plus,
  FolderOpen, Megaphone, X, Download,
  LayoutDashboard, BarChart3, DollarSign, Award, Trophy, MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

/* ───────────────────── Campaigns Data ───────────────────── */

interface CampaignItem {
  id: number;
  title: string;
  brand: string;
  brandColor: string;
  category: string;
  pricePerView: string;
  views: string;
  creators: number;
  budgetRemaining: number;
  hue: number;
  platforms: string[];
  type: "CLIPPING" | "UGC";
  tag?: string;
  image?: string;
}

const campaigns: CampaignItem[] = [
  {
    id: 1,
    title: "ENHYPEN Jakarta (Presale Hype) - Instagram",
    brand: "PK Entertainment",
    brandColor: "#E1306C",
    category: "ENTERTAINMENT",
    pricePerView: "Rp1.000",
    views: "1K views",
    creators: 3376,
    budgetRemaining: 60,
    hue: 220,
    platforms: ["instagram", "tiktok", "youtube"],
    type: "CLIPPING",
    image: "/campaigns/ENHYPEN-Jakarta-Presale-Hype-Instagram.jpg",
  },
  {
    id: 2,
    title: "ENHYPEN Jakarta (Presale Hype) - TikTok",
    brand: "PK Entertainment",
    brandColor: "#E1306C",
    category: "ENTERTAINMENT",
    pricePerView: "Rp1.000",
    views: "1K views",
    creators: 2608,
    budgetRemaining: 85,
    hue: 220,
    platforms: ["tiktok", "instagram"],
    type: "CLIPPING",
    image: "/campaigns/ENHYPEN-Jakarta-Presale-Hype-Instagram-2.jpg",
  },
  {
    id: 3,
    title: "Emina x Gelato Cleanser",
    brand: "Emina",
    brandColor: "#E91E8C",
    category: "LIFESTYLE",
    pricePerView: "Rp2.000",
    views: "1K views",
    creators: 21753,
    budgetRemaining: 52,
    hue: 340,
    platforms: ["instagram", "tiktok"],
    type: "CLIPPING",
    image: "/campaigns/Emina-Gelato-Cleanser.jpg",
  },
  {
    id: 4,
    title: "Teh Pucuk x PRJ",
    brand: "Teh Pucuk",
    brandColor: "#22C55E",
    category: "ENTERTAINMENT",
    pricePerView: "Rp3.000",
    views: "1K views",
    creators: 30624,
    budgetRemaining: 2,
    hue: 142,
    platforms: ["tiktok", "instagram", "youtube"],
    type: "CLIPPING",
    image: "/campaigns/Teh-Pucuk-PRJ.jpg",
  },
  {
    id: 5,
    title: "UGC Trading Forex (TradersFamily)",
    brand: "TradersFamily",
    brandColor: "#3B82F6",
    category: "EDUCATION",
    pricePerView: "Rp7.500",
    views: "1K views",
    creators: 11931,
    budgetRemaining: 87,
    hue: 210,
    platforms: ["tiktok", "youtube"],
    type: "UGC",
    image: "/campaigns/UGC-Trading-Forex-TradersFamily-App-.jpg",
  },
  {
    id: 6,
    title: "RED1 - MBG (MIE BULDAK GOCENG)",
    brand: "Bithour Production",
    brandColor: "#F97316",
    category: "ENTERTAINMENT",
    pricePerView: "Rp500",
    views: "1K views",
    creators: 444,
    budgetRemaining: 90,
    hue: 15,
    platforms: ["tiktok", "instagram"],
    type: "CLIPPING",
    image: "/campaigns/RED1-MBG-MIE-BULDAK-GOCENG-.jpg",
  },
  {
    id: 7,
    title: "TehPucuk Harum Less Sugar",
    brand: "Teh Pucuk",
    brandColor: "#22C55E",
    category: "ENTERTAINMENT",
    pricePerView: "Rp3.000",
    views: "1K views",
    creators: 1391,
    budgetRemaining: 87,
    hue: 142,
    platforms: ["tiktok", "instagram", "youtube"],
    type: "CLIPPING",
    image: "/campaigns/TehPucuk-Harum-Less-Sugar.jpg",
  },
  {
    id: 8,
    title: "AKASTA JAKARTA",
    brand: "luq",
    brandColor: "#8B5CF6",
    category: "ENTERTAINMENT",
    pricePerView: "Rp3.000",
    views: "1K views",
    creators: 1436,
    budgetRemaining: 90,
    hue: 270,
    platforms: ["tiktok", "instagram", "youtube"],
    type: "CLIPPING",
    image: "/campaigns/AKASTA-JAKARTA.jpg",
  },
  {
    id: 9,
    title: "ENHYPEN Jakarta (Presale Hype) - YouTube",
    brand: "PK Entertainment",
    brandColor: "#E1306C",
    category: "ENTERTAINMENT",
    pricePerView: "Rp5.000",
    views: "1K views",
    creators: 2026,
    budgetRemaining: 90,
    hue: 220,
    platforms: ["youtube", "instagram", "tiktok"],
    type: "CLIPPING",
    image: "/campaigns/ENHYPEN-Jakarta-Presale-Hype-Threads.jpg",
  },
  {
    id: 10,
    title: "Teh Pucuk Berhadiah Milyaran",
    brand: "Teh Pucuk",
    brandColor: "#22C55E",
    category: "ENTERTAINMENT",
    pricePerView: "Rp3.000",
    views: "1K views",
    creators: 2569,
    budgetRemaining: 3,
    hue: 142,
    platforms: ["tiktok", "instagram"],
    type: "CLIPPING",
    image: "/campaigns/Teh-Pucuk-Berhadiah-Millyaran.jpg",
  },
  {
    id: 11,
    title: "Hendriko Gani (Saham Berkelas)",
    brand: "Hendrikogani",
    brandColor: "#EF4444",
    category: "EDUCATION",
    pricePerView: "Rp2.000",
    views: "1K views",
    creators: 4247,
    budgetRemaining: 87,
    hue: 0,
    platforms: ["tiktok", "instagram"],
    type: "UGC",
    image: "/campaigns/Hendriko-Gani-Saham-Berkelas-.jpg",
  },
  {
    id: 12,
    title: "UGC Konten.com (Clipping World Cup)",
    brand: "konten.com",
    brandColor: "#F97316",
    category: "ENTERTAINMENT",
    pricePerView: "Rp2.500",
    views: "1K views",
    creators: 12974,
    budgetRemaining: 90,
    hue: 15,
    platforms: ["tiktok", "instagram", "youtube"],
    type: "UGC",
    image: "/campaigns/UGC-Konten.com-Clipping-World-Cup-.jpg",
  },
];

/* ───────────────────── Pipeline Data ───────────────────── */

interface PipelineItem {
  id: number;
  topic: string;
  creatorName: string;
  creatorRole: string;
  creatorAvatar: string;
  thumbnail: string;
  digitalAssets: number;
  targetDate: string;
  platforms: string[];
  completedSteps: number;
  totalSteps: number;
  progressPercent: number;
  lastStep: string;
  contentCode?: string;
  caption?: string;
  hashtags?: string;
  fase?: string;
  contentPillar?: string;
}

interface ProductionStep {
  no: number;
  alurProduksi: string;
  penanggungJawab: string[];
  status: "Done" | "Not Done" | "No Need";
  supervisor: string;
  hasPreview?: boolean;
  previewLabel?: string;
  hasSchedule?: boolean;
}

const pipelineData: PipelineItem[] = [
  {
    id: 1,
    topic: "Konten Edukasi tentang Sumatera Utara",
    creatorName: "Budi Wijaya",
    creatorRole: "Project Manager",
    creatorAvatar: "/creators/jerome-polin.png",
    thumbnail: "/thumbnails/bencana-sumatera-utara.jpg",
    digitalAssets: 1,
    targetDate: "13 Juli 2026, 14:09",
    platforms: ["instagram", "tiktok"],
    completedSteps: 2,
    totalSteps: 8,
    progressPercent: 25,
    lastStep: "Completed: Brief & Konsep",
    contentCode: "KONTEN-001",
    caption: "Caption untuk konten #1",
    hashtags: "#konten #edukasi #SumateraUtara",
    fase: "Awareness",
    contentPillar: "Edukasi",
  },
  {
    id: 2,
    topic: "Konten Edukasi tentang Sumatera Barat",
    creatorName: "Ani Suryani",
    creatorRole: "Project Manager",
    creatorAvatar: "/creators/rachel-vennya.png",
    thumbnail: "/creators/nessie-judge.png",
    digitalAssets: 1,
    targetDate: "13 Juli 2026, 14:09",
    platforms: ["instagram", "tiktok"],
    completedSteps: 2,
    totalSteps: 8,
    progressPercent: 25,
    lastStep: "Completed: Brief & Konsep",
    contentCode: "KONTEN-002",
    caption: "Caption untuk konten #2",
    hashtags: "#konten #edukasi #SumateraBarat",
    fase: "Awareness",
    contentPillar: "Edukasi",
  },
  {
    id: 3,
    topic: "Konten Edukasi tentang Sumatera Selatan",
    creatorName: "Cahya Putra",
    creatorRole: "Project Manager",
    creatorAvatar: "/creators/fadil-jaidi.png",
    thumbnail: "/creators/arief-muhammad.png",
    digitalAssets: 1,
    targetDate: "13 Juli 2026, 14:09",
    platforms: ["instagram", "tiktok"],
    completedSteps: 2,
    totalSteps: 8,
    progressPercent: 25,
    lastStep: "Completed: Brief & Konsep",
    contentCode: "KONTEN-003",
    caption: "Caption untuk konten #3",
    hashtags: "#konten #edukasi #SumateraSelatan",
    fase: "Awareness",
    contentPillar: "Edukasi",
  },
  {
    id: 4,
    topic: "Konten Edukasi tentang DKI Jakarta",
    creatorName: "Dewi Lestari",
    creatorRole: "Project Manager",
    creatorAvatar: "/creators/rahadi-wangsapermana.jpg",
    thumbnail: "/creators/tasya-farasya.png",
    digitalAssets: 1,
    targetDate: "13 Juli 2026, 14:09",
    platforms: ["instagram", "tiktok"],
    completedSteps: 2,
    totalSteps: 8,
    progressPercent: 25,
    lastStep: "Completed: Brief & Konsep",
    contentCode: "KONTEN-004",
    caption: "Caption untuk konten #4",
    hashtags: "#konten #edukasi #DKIJakarta",
    fase: "Awareness",
    contentPillar: "Edukasi",
  },
  {
    id: 5,
    topic: "Konten Edukasi tentang Jawa Barat",
    creatorName: "Eko Prasetyo",
    creatorRole: "Project Manager",
    creatorAvatar: "/creators/jerome-polin.png",
    thumbnail: "/creators/nessie-judge.png",
    digitalAssets: 1,
    targetDate: "13 Juli 2026, 14:09",
    platforms: ["instagram", "tiktok"],
    completedSteps: 2,
    totalSteps: 8,
    progressPercent: 25,
    lastStep: "Completed: Brief & Konsep",
    contentCode: "KONTEN-005",
    caption: "Caption untuk konten #5",
    hashtags: "#konten #edukasi #JawaBarat",
    fase: "Awareness",
    contentPillar: "Edukasi",
  },
];

const getProductionSteps = (_item: PipelineItem): ProductionStep[] => [
  { no: 1, alurProduksi: "Brief & Konsep", penanggungJawab: ["Project Manager"], status: "Done", supervisor: "Creative Director" },
  { no: 2, alurProduksi: "Pengumpulan Raw Materials (Video/Foto)", penanggungJawab: ["Konten Kreator"], status: "Not Done", supervisor: "Project Manager", hasPreview: true, previewLabel: "Preview Raw Materials:" },
  { no: 3, alurProduksi: "Editing & Produksi", penanggungJawab: ["Video Editor", "Graphic Designer"], status: "Not Done", supervisor: "Creative Director" },
  { no: 4, alurProduksi: "Review Konten", penanggungJawab: ["Project Manager", "Creative Director"], status: "Not Done", supervisor: "Head of Production", hasPreview: true, previewLabel: "Preview Konten Hasil Edit:" },
  { no: 5, alurProduksi: "Revisi", penanggungJawab: ["Video Editor"], status: "No Need", supervisor: "Creative Director" },
  { no: 6, alurProduksi: "Approved Content", penanggungJawab: ["Project Manager"], status: "Not Done", supervisor: "Head of Production", hasPreview: true, previewLabel: "Preview Konten Final:" },
  { no: 7, alurProduksi: "Penjadwalan Posting", penanggungJawab: ["Digital Specialist"], status: "Not Done", supervisor: "Project Manager", hasSchedule: true },
  { no: 8, alurProduksi: "Konten diposting", penanggungJawab: ["Digital Specialist"], status: "Not Done", supervisor: "Project Manager" },
];

/* ───────────────────── Helpers ───────────────────── */

const PlatformIcon = ({ platform }: { platform: string }) => {
  if (platform === "instagram") return <Instagram className="w-3.5 h-3.5" style={{ color: "#E1306C" }} />;
  if (platform === "tiktok") return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" style={{ color: "#00F2EA" }}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.43v-7.15a8.16 8.16 0 005.58 2.18v-3.45a4.85 4.85 0 01-3.58-1.58V6.69h3.58z" />
    </svg>
  );
  if (platform === "youtube") return <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5" style={{ color: "#FF0000" }}><path d="M23.5 6.19a3.02 3.02 0 00-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.55A3.02 3.02 0 00.5 6.19 31.6 31.6 0 000 12a31.6 31.6 0 00.5 5.81 3.02 3.02 0 002.12 2.14c1.88.55 9.38.55 9.38.55s7.5 0 9.38-.55a3.02 3.02 0 002.12-2.14A31.6 31.6 0 0024 12a31.6 31.6 0 00-.5-5.81zM9.55 15.57V8.43L15.82 12l-6.27 3.57z" /></svg>;
  return null;
};

/* ───────────────────── Campaign Card ───────────────────── */

function CampaignCard({ campaign }: { campaign: CampaignItem }) {
  return (
    <div
      className="rounded-[14px] overflow-hidden border transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
      style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}
    >
      {/* Banner */}
      <div className="relative h-44 w-full overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(${campaign.hue}, 60%, 25%), hsl(${campaign.hue}, 40%, 10%))` }}>
        {campaign.image ? (
          <img src={campaign.image} alt={campaign.title} className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <Image className="w-20 h-20 text-white/40" />
          </div>
        )}
        {/* Brand logo + name + type tag */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span
            className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
            style={{ background: campaign.brandColor }}
          >
            {campaign.brand.charAt(0)}
          </span>
          <span className="text-[12px] font-bold text-white drop-shadow-md truncate max-w-[120px]">
            {campaign.brand}
          </span>
          <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm text-white shrink-0">
            {campaign.type}
          </span>
        </div>
        {/* Platform icons bottom-right */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5">
          {campaign.platforms.map((p) => (
            <PlatformIcon key={p} platform={p} />
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="p-3.5 space-y-2.5">
        <p className="text-[13px] font-bold leading-tight line-clamp-2" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          {campaign.title}
        </p>

        <div className="flex items-center gap-1.5">
          <span className="text-[14px] font-extrabold" style={{ color: "var(--ch-text)" }}>{campaign.pricePerView}</span>
          <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>/ {campaign.views}</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {campaign.platforms.map((p) => (
            <PlatformIcon key={p} platform={p} />
          ))}
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider" style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
            {campaign.category}
          </span>
          <span className="flex items-center gap-1 text-[11px]" style={{ color: "var(--ch-text-muted)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
            {campaign.creators.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Budget Progress */}
        <div className="pt-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Budget Tersisa</span>
            <span className="text-[10px] font-bold" style={{ color: "var(--ch-text)" }}>{campaign.budgetRemaining}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: "var(--ch-border)" }}>
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${campaign.budgetRemaining}%`,
                background: campaign.budgetRemaining > 50 ? "#22C55E" : campaign.budgetRemaining > 25 ? "#F59E0B" : "#EF4444",
              }}
            />
          </div>
        </div>

        {/* Join Campaign Button */}
        <button className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white transition-opacity hover:opacity-90 mt-1" style={{ background: "#F97316" }}>
          Join Campaign
        </button>
      </div>
    </div>
  );
}

/* ───────────────────── Overview Tab ───────────────────── */

function OverviewTab() {
  const { user } = useAuth();
  const [videoTab, setVideoTab] = useState("semua");

  const videoTabs = ["Semua", "Pending", "Approved", "Rejected", "Need Action", "Deleted"];

  const chartDates = ["Jun 9", "10", "11", "12", "13", "14", "15", "Jun 16", "17", "18", "19", "20", "Jun 23", "24", "25", "Jun 28", "29", "30", "Jul 1", "2", "3", "4", "5", "6"];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <h1 className="text-xl md:text-[22px] font-extrabold tracking-[-0.5px]" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Selamat datang, {user?.name ?? "User"}
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Pendapatan", value: "Rp0", icon: "💰", color: "var(--ch-text)" },
          { label: "Bisa Dicairkan", value: "Rp0", icon: "🏦", color: "#22C55E" },
          { label: "Total Views", value: "0", suffix: "Views", icon: "▶️", color: "#F97316" },
          { label: "Total Video", value: "0", suffix: "Video", icon: "🎬", color: "#3B82F6" },
        ].map((s) => (
          <div key={s.label} className="rounded-[14px] border p-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[14px]">{s.icon}</span>
              <p className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{s.label}</p>
            </div>
            <p className="text-[24px] font-extrabold" style={{ color: s.color }}>
              {s.value}{s.suffix && <span className="text-[12px] font-semibold ml-1" style={{ color: "var(--ch-text-muted)" }}>{s.suffix}</span>}
            </p>
          </div>
        ))}
      </div>

      {/* Analitik Pendapatan */}
      <div className="rounded-[14px] border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-[16px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Analitik Pendapatan
            </h2>
            <button className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: "#F97316", color: "white" }}>Total</button>
            <button className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ color: "var(--ch-text-muted)", background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>Kenaikan</button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>📅 28 hari terakhir</span>
            <ChevronDown className="w-3 h-3" style={{ color: "var(--ch-text-muted)" }} />
          </div>
        </div>

        {/* Chart */}
        <div className="relative">
          {/* Y-axis labels */}
          <div className="absolute right-0 top-0 bottom-8 flex flex-col justify-between text-[10px]" style={{ color: "var(--ch-text-soft)" }}>
            <span>Rp4 JT</span>
            <span>Rp750K</span>
            <span>Rp500K</span>
            <span>Rp250K</span>
            <span>⊖ Rp0</span>
          </div>

          {/* Chart area */}
          <div className="pr-20 pb-8">
            <div className="h-[200px] flex items-end relative" style={{ borderBottom: "1px solid var(--ch-border)" }}>
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="absolute w-full" style={{ bottom: `${i * 25}%`, borderTop: "1px dashed var(--ch-border)" }} />
              ))}

              {/* Chart line (flat since no data) */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "#F97316" }} />

              {/* Current value badge */}
              <div className="absolute bottom-0 right-0 px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "#F97316", color: "white" }}>
                Rp0
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-[9px]" style={{ color: "var(--ch-text-soft)" }}>
              {chartDates.map((d, i) => (
                <span key={i}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Onboarding Progress */}
        <div className="flex items-center justify-end mt-2">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
            <span className="text-[11px] font-semibold" style={{ color: "var(--ch-text)" }}>Onboarding Progress</span>
            <span className="text-[11px] font-bold" style={{ color: "#F97316" }}>0/4 steps</span>
            <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>completed</span>
          </div>
        </div>
      </div>

      {/* Video Kamu */}
      <div className="rounded-[14px] border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Video Kamu
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>🔄 Refresh Views dalam</span>
            <span className="text-[11px] font-bold" style={{ color: "var(--ch-text)" }}>07:06:43</span>
            <ChevronDown className="w-3 h-3" style={{ color: "var(--ch-text-muted)" }} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 border-b" style={{ borderColor: "var(--ch-border)" }}>
          {videoTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setVideoTab(tab.toLowerCase())}
              className="px-3 py-2 text-[12px] font-semibold transition-colors"
              style={videoTab === tab.toLowerCase() ? {
                color: "#F97316",
                borderBottom: "2px solid #F97316",
              } : {
                color: "var(--ch-text-muted)",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-4">
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg border" style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
            Semua campaign <ChevronDown className="w-3 h-3" />
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg border" style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
            Urutkan dari <ArrowUpDown className="w-3 h-3" />
          </button>
        </div>

        {/* Empty state */}
        <div className="py-12 text-center">
          <p className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>Belum ada submission untuk campaign ini.</p>
        </div>
      </div>

      {/* Semua Campaign Aktif */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Semua Campaign Aktif
          </h2>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-lg border" style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
              Urutkan dari <ArrowUpDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-lg border" style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
              Kategori <ChevronDown className="w-3 h-3" />
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-lg border" style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
              Tipe <ChevronDown className="w-3 h-3" />
            </button>
            <div className="flex items-center gap-1 ml-1">
              {["tiktok", "instagram", "youtube"].map((p) => (
                <button key={p} className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-white/5"
                  style={{ borderColor: "var(--ch-border)" }}>
                  <PlatformIcon platform={p} />
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} campaign={c} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── WhatsApp Reporting ───────────────────── */

const whatsappReports = [
  {
    id: "KM-0498",
    title: "Unjuk Rasa AMPUH di Depan Kejaksaan Agung",
    category: "Kamtibmas",
    kelurahan: "Kel. Melawai",
    kecamatan: "Kec. Kebayoran Baru",
    messages: 1,
    photos: 5,
    hasGps: true,
    date: "Senin, 6 Jul 2026, 14:13 WIB",
    urgency: "urgent",
    isNew: true,
  },
  {
    id: "KM-0497",
    title: "Unjuk Rasa PPRD di Depan Kejaksaan Agung",
    category: "Kamtibmas",
    kelurahan: "Kel. Melawai",
    kecamatan: "Kec. Kebayoran Baru",
    messages: 1,
    photos: 5,
    hasGps: true,
    date: "Senin, 6 Jul 2026, 14:12 WIB",
    urgency: "urgent",
    isNew: true,
  },
  {
    id: "KM-0496",
    title: "Pengamanan Rencana Unjuk Rasa Mahasiswa",
    category: "Kamtibmas",
    kelurahan: "Kel. Glodok",
    kecamatan: "Kec. Taman Sari",
    messages: 1,
    photos: 1,
    hasGps: true,
    date: "Senin, 6 Jul 2026, 14:10 WIB",
    urgency: "urgent",
    isNew: true,
  },
  {
    id: "KM-0493",
    title: "Unjuk Rasa Anti Korupsi PT WIKA",
    category: "Kamtibmas",
    kelurahan: "Kel. Kampung Melayu",
    kecamatan: "Kec. Jatinegara",
    messages: 1,
    photos: 5,
    hasGps: true,
    date: "Senin, 6 Jul 2026, 13:39 WIB",
    urgency: "urgent",
    isNew: true,
  },
];

function WhatsAppReporting() {
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<typeof whatsappReports[0] | null>(null);

  return (
    <div className="space-y-5" style={{ background: "var(--ch-surface)", borderRadius: "14px", padding: "20px", border: "1px solid var(--ch-border)" }}>
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
          <input
            type="text"
            placeholder="Cari ID laporan atau kata kunci..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border"
            style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
          />
        </div>
        <button className="px-3 py-2 text-[12px] font-semibold rounded-lg border" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
          Semua Urgensi <ChevronDown className="w-3 h-3 inline ml-1" />
        </button>
        <button className="px-3 py-2 text-[12px] font-semibold rounded-lg border" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
          Semua Status <ChevronDown className="w-3 h-3 inline ml-1" />
        </button>
        <button className="px-3 py-2 text-[12px] font-semibold rounded-lg border" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
          Semua Wilayah <ChevronDown className="w-3 h-3 inline ml-1" />
        </button>
        <input
          type="date"
          className="px-3 py-2 text-[12px] font-semibold rounded-lg border"
          style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}
        />
        <button className="px-3 py-2 text-[12px] font-semibold rounded-lg border" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
          HARI INI
        </button>
        <button className="px-3 py-2 text-[12px] font-semibold rounded-lg border" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
          <Download className="w-3 h-3 inline mr-1" /> EKSPOR CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Urgent Content Review", value: "80", color: "#EF4444", bg: "#2D1215", border: "#7F1D1D" },
          { label: "High Priority Review", value: "28", color: "#F97316", bg: "#2D1A0F", border: "#7C2D12" },
          { label: "Total Content Submitted", value: "497", color: "#3B82F6", bg: "#0F1A2D", border: "#1E3A5F" },
          { label: "Approved Content", value: "1", color: "#22C55E", bg: "#0F2118", border: "#14532D" },
        ].map((s) => (
          <div key={s.label} className="rounded-xl p-4 border" style={{ background: s.bg, borderColor: s.border }}>
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: s.color }}>{s.label}</p>
            <p className="text-[28px] font-extrabold mt-1" style={{ color: "var(--ch-text)" }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {whatsappReports.map((report) => (
          <div key={report.id} className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
            <div className="p-4 space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: "#7F1D1D", color: "#FCA5A5" }}>
                    {report.urgency}
                  </span>
                  <span className="text-[11px] font-semibold" style={{ color: "var(--ch-primary)" }}># {report.id}</span>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" style={{ color: "#25D366" }}>
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "#1E3A5F", color: "#60A5FA" }}>
                  BARU
                </span>
              </div>

              {/* Title */}
              <h3 className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>{report.title}</h3>

              {/* Category */}
              <p className="text-[11px]" style={{ color: "var(--ch-primary)" }}>
                {report.category} · {report.kelurahan} · {report.kecamatan}
              </p>

              {/* Stats */}
              <div className="flex items-center gap-3 text-[11px]" style={{ color: "var(--ch-text-muted)" }}>
                <span className="flex items-center gap-1">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                  {report.messages} pesan
                </span>
                <span className="flex items-center gap-1">
                  <Image className="w-3 h-3" /> {report.photos} foto
                </span>
                {report.hasGps && (
                  <span className="flex items-center gap-1">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    GPS
                  </span>
                )}
                <span>· {report.kelurahan}</span>
              </div>

              {/* Date */}
              <p className="text-[11px]" style={{ color: "var(--ch-text-soft)" }}>{report.date}</p>

              {/* Action */}
              <button onClick={() => setSelectedReport(report)} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors hover:opacity-90" style={{ background: "var(--ch-primary)", color: "white" }}>
                <Eye className="w-3 h-3" /> LIHAT DETAIL
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedReport && (
        <WhatsAppDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
}

/* ───────────────────── WhatsApp Detail Modal ───────────────────── */

function WhatsAppDetailModal({ report, onClose }: { report: typeof whatsappReports[0]; onClose: () => void }) {
  const [note, setNote] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="rounded-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-2xl" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: "var(--ch-border)" }}>
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase" style={{ background: "#7F1D1D", color: "#FCA5A5" }}>
              {report.urgency}
            </span>
            <span className="text-[13px] font-semibold" style={{ color: "var(--ch-primary)" }}># {report.id}</span>
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" style={{ color: "#25D366" }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/10">
            <X className="w-5 h-5" style={{ color: "var(--ch-text-muted)" }} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {/* Ringkasan AI */}
          <div className="rounded-xl p-4 border" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-1.5" style={{ color: "var(--ch-primary)" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M12 2a10 10 0 100 20 10 10 0 000-20z" /><path d="M12 16v-4M12 8h.01" /></svg>
              RINGKASAN AI
            </p>
            <p className="text-[13px] leading-relaxed" style={{ color: "var(--ch-text)" }}>
              Pada 6 Juli 2026 pukul 11.45 WIB, lima anggota AMPUH melakukan aksi unjuk rasa singkat di depan gerbang Kejaksaan Agung RI, Kramat Pela, Kebayoran Baru, menuntut penyelidikan Bupati Serdang Bedagai terkait 90 dapur MBG; aksi berlangsung damai dan berakhir tertib.
            </p>
          </div>

          {/* Jejak Geo */}
          <div className="rounded-xl p-4 border" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--ch-text-muted)" }}>JEJAK GEO · BOTTOM-UP</p>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { icon: "📍", text: "GPS · -6.241010699999998, 106.7962084" },
                { icon: "🏠", text: "RW 007" },
                { icon: "🏘️", text: "Kel. Melawai" },
                { icon: "🏙️", text: "Kec. Kebayoran Baru" },
                { icon: "🗺️", text: "Jakarta Selatan" },
              ].map((g, i) => (
                <span key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", color: "var(--ch-text)" }}>
                  {g.icon} {g.text}
                </span>
              ))}
            </div>
          </div>

          {/* Lokasi Geografis + Tindakan */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-xl border overflow-hidden" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
              <p className="text-[11px] font-bold uppercase tracking-wider p-4 pb-2" style={{ color: "var(--ch-text-muted)" }}>LOKASI GEOGRAFIS</p>
              <div className="h-[250px] flex items-center justify-center" style={{ background: "#1A2332" }}>
                <div className="text-center">
                  <div className="w-4 h-4 rounded-full mx-auto mb-2" style={{ background: "var(--ch-orange)" }} />
                  <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Peta Lokasi</p>
                  <p className="text-[10px]" style={{ color: "var(--ch-text-soft)" }}>-6.2410, 106.7962</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="rounded-xl p-4 border" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--ch-text-muted)" }}>TINDAKAN CEPAT</p>
                <button className="w-full py-2.5 rounded-lg text-[13px] font-semibold transition-colors hover:opacity-90" style={{ background: "var(--ch-primary)", color: "white" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 inline mr-1.5"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><path d="M22 4L12 14.01l-3-3" /></svg>
                  TANDAI SELESAI
                </button>
              </div>
              <div className="rounded-xl p-4 border" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                <p className="text-[11px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--ch-text-muted)" }}>CATATAN INTERNAL</p>
                <p className="text-[10px] mb-2" style={{ color: "var(--ch-text-soft)" }}>Tidak terlihat oleh warga.</p>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tambah catatan koordinator/kabinda..."
                  className="w-full p-2.5 text-[12px] rounded-lg border resize-none"
                  style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                  rows={3}
                />
                <button className="w-full mt-2 py-2 rounded-lg text-[12px] font-semibold transition-colors hover:opacity-90" style={{ background: "var(--ch-primary)", color: "white" }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 inline mr-1"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><path d="M17 21v-8H7v8M7 3v5h8" /></svg>
                  SIMPAN
                </button>
              </div>
            </div>
          </div>

          {/* Narasi Laporan */}
          <div className="rounded-xl p-4 border" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--ch-text-muted)" }}>NARASI LAPORAN</p>
            <div className="text-[12px] leading-relaxed whitespace-pre-wrap" style={{ color: "var(--ch-text)" }}>
              <p className="font-semibold mb-2">*Perihal: Aksi Unjuk Rasa Dari Aliansi Masyarakat Peduli Hukum (AMPUH) Di Depan Gerbang Kantor Kejaksaan Agung RI Jl. Raya Bulungan Kel. Kramat Pela Kebayoran Baru Jakarta Selatan*</p>
              <p className="mb-2">Ijin Melaporkan,</p>
              <p className="mb-2">Pada 6 Juli 2026 Pukul 11.45 WIB di Depan Gerbang Kantor Kejaksaan Agung RI Jl. Raya Bulungan Kel. Kramat Pela Kec. Kebayoran Baru Jakarta Selatan telah berlangsung Aksi Unjuk Rasa dari Aliansi Masyarakat Peduli Hukum (AMPUH), Pj. M. Andika, diikuti 5 orang. Selanjutnya dapat dilaporkan sebagai berikut:</p>
              <p className="font-semibold mb-1">1. Tuntutan yang disampaikan:</p>
              <p className="mb-2">· Mengusut Bupati Serdang Bedagai Darma Wijaya atas dugaan keterkaitan kepemilikan 90 dapur Program Makan Bergizi Gratis (MBG).</p>
              <p className="font-semibold mb-1">2. Spanduk dan Poster bertuliskan:</p>
              <p className="mb-2">· Tuntutan: Segera panggil dan periksa Bupati Serdang Bedagai Darma Wijaya. Minta klarifikasi mendalam terkait dugaan keterkaitan kepemilikan/penguasaan 90 unit dapur MBG.</p>
              <p className="font-semibold mb-1">3. Rangkaian Kegiatan Aksi:</p>
              <p className="mb-2">· Pukul 11.45 WIB: Masa aksi dari Aliansi Masyarakat Peduli Hukum (AMPUH) tiba di Depan Gerbang Kantor Kejaksaan Agung RI, kemudian membentangkan spanduk dan melakukan dokumentasi/foto bersama.</p>
              <p className="mb-2">· Pukul 11.48 WIB: Aksi Unjuk Rasa selesai, massa aksi membubarkan diri dengan tertib dan meninggalkan lokasi.</p>
              <p className="font-semibold mb-1">Catatan:</p>
              <p className="mb-2">1. Aksi berlangsung secara singkat dengan hanya membentangkan spanduk dan melakukan dokumentasi.</p>
              <p className="mb-2">2. Selama kegiatan aksi unjuk rasa berlangsung, situasi aman dan kondusif. Haljol Nihil</p>
              <p className="font-semibold mb-2">*DUMP*</p>
              <a href="https://maps.app.goo.gl/kgzD1MKZwnYNZgEd9" target="_blank" rel="noopener noreferrer" className="text-[12px] hover:underline" style={{ color: "var(--ch-primary)" }}>https://maps.app.goo.gl/kgzD1MKZwnYNZgEd9</a>
            </div>
          </div>

          {/* Galeri Bukti */}
          <div className="rounded-xl p-4 border" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--ch-text-muted)" }}>GALERI BUKTI (3 LAMPIRAN)</p>
            <div className="grid grid-cols-3 gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-video rounded-lg flex items-center justify-center" style={{ background: "var(--ch-surface)" }}>
                  <Image className="w-8 h-8" style={{ color: "var(--ch-text-soft)" }} />
                </div>
              ))}
            </div>
          </div>

          {/* Pesan Cluster Terbaru */}
          <div className="rounded-xl p-4 border" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
            <p className="text-[11px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--ch-text-muted)" }}>PESAN CLUSTER TERBARU</p>
            <div className="rounded-lg p-3" style={{ background: "var(--ch-surface)" }}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-semibold" style={{ color: "var(--ch-text)" }}>6281329795454</span>
                <span className="text-[10px]" style={{ color: "var(--ch-text-soft)" }}>· 14.13</span>
              </div>
              <p className="text-[11px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>
                *Perihal: Aksi Unjuk Rasa Dari Aliansi Masyarakat Peduli Hukum (AMPUH) Di Depan Gerbang Kantor Kejaksaan Agung RI Jl. Raya Bulungan Kel. Kramat Pela Kebayoran Baru Jakarta Selatan* Ijin Melaporkan, Pada 6 Juli 2026 Pukul 11.45 WIB di Depan Gerbang Kantor Kejaksaan Agung RI Jl. Raya Bulungan Kel. Kramat Pela Kec. Kebayoran Baru Jakarta Selatan telah berlangsung Aksi Unjuk Rasa dari Aliansi Masyarakat Peduli Hukum (AMPUH), Pj. M. Andika, diikuti 5 orang. Selanjutnya dapat dilaporkan sebagai berikut: 1. Tuntutan yang disampaikan: · Mengusut Bupati Serdang Bedagai Darma Wijaya atas dugaan keterkaitan kepemilikan 90 dapur Program Makan Bergizi Gratis (MBG). 2. Spanduk dan Poster bertuliskan: · Tuntutan: Segera panggil dan periksa Bupati Serdang Bedagai Darma Wijaya. Minta klarifikasi mendalam terkait dugaan keterkaitan kepemilikan/penguasaan 90 unit dapur MBG. 3. Rangkaian Kegiatan Aksi: · Pukul 11.45 WIB: Masa aksi dari Aliansi Masyarakat Peduli Hukum (AMPUH) tiba di Depan Gerbang Kantor Kejaksaan Agung RI...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Rank & Rewards Tab ───────────────────── */

const ranks = [
  { level: 1, name: "Rank 1", color: "#CD7F32", gradient: "linear-gradient(135deg, #8B5A2B, #CD7F32, #DAA520)" },
  { level: 2, name: "Rank 2", color: "#9CA3AF", gradient: "linear-gradient(135deg, #6B7280, #9CA3AF, #D1D5DB)" },
  { level: 3, name: "Rank 3", color: "#84CC16", gradient: "linear-gradient(135deg, #4D7C0F, #84CC16, #A3E635)" },
  { level: 4, name: "Rank 4", color: "#3B82F6", gradient: "linear-gradient(135deg, #1D4ED8, #3B82F6, #60A5FA)" },
  { level: 5, name: "Rank 5", color: "#F97316", gradient: "linear-gradient(135deg, #C2410C, #F97316, #FB923C)" },
];

function RankBadge({ size, gradient, active }: { size: number; gradient: string; active?: boolean }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" className="w-full h-full">
        <defs>
          <linearGradient id={`grad-${gradient}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: active ? "#CD7F32" : "#4B5563" }} />
            <stop offset="50%" style={{ stopColor: active ? "#DAA520" : "#6B7280" }} />
            <stop offset="100%" style={{ stopColor: active ? "#8B5A2B" : "#374151" }} />
          </linearGradient>
        </defs>
        <polygon
          points="50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5"
          fill={`url(#grad-${gradient})`}
          stroke={active ? "#DAA520" : "#4B5563"}
          strokeWidth="2"
        />
        <text x="50" y="58" textAnchor="middle" fill={active ? "#FDE68A" : "#9CA3AF"} fontSize="28" fontWeight="bold" fontFamily="'Plus Jakarta Sans', sans-serif">
          K
        </text>
      </svg>
      {active && (
        <div className="absolute inset-0 rounded-full" style={{ boxShadow: "0 0 20px rgba(218,165,32,0.4)" }} />
      )}
    </div>
  );
}

function RankRewardsTab() {
  const [rankTab, setRankTab] = useState("clipper");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-[22px] font-extrabold tracking-[-0.5px]" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Rank & Rewards
        </h1>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
          <button
            onClick={() => setRankTab("clipper")}
            className="px-3 py-1.5 text-[11px] font-bold rounded-md transition-all"
            style={rankTab === "clipper" ? { background: "#F97316", color: "white" } : { color: "var(--ch-text-muted)" }}
          >
            CLIPPER
          </button>
          <button
            onClick={() => setRankTab("creator")}
            className="px-3 py-1.5 text-[11px] font-bold rounded-md transition-all"
            style={rankTab === "creator" ? { background: "#F97316", color: "white" } : { color: "var(--ch-text-muted)" }}
          >
            CREATOR
          </button>
        </div>
      </div>

      {/* Main Badge */}
      <div className="flex flex-col items-center py-8" style={{ background: "linear-gradient(180deg, #1A1208 0%, #0F172A 100%)", borderRadius: "14px" }}>
        <RankBadge size={120} gradient="bronze" active={true} />

        <p className="text-[14px] mt-6" style={{ color: "var(--ch-text-muted)" }}>Level: Rank 1</p>
        <h2 className="text-[28px] font-extrabold mt-1" style={{ color: "#DAA520", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Base Clipper</h2>
        <span className="mt-3 px-3 py-1 rounded text-[11px] font-bold" style={{ background: "#292524", color: "#D6D3D1", border: "1px solid #44403C" }}>
          Bonus Base
        </span>
      </div>

      {/* Rank Progression */}
      <div className="flex items-center justify-center gap-6 py-6">
        {ranks.map((r) => (
          <div key={r.level} className="flex flex-col items-center gap-2">
            <RankBadge size={60} gradient={r.name} active={r.level === 1} />
            <span className="text-[11px] font-semibold" style={{ color: r.level === 1 ? "#DAA520" : "var(--ch-text-muted)" }}>
              {r.name}
            </span>
          </div>
        ))}
      </div>

      {/* Review Timer */}
      <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
        <div>
          <p className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>Rank akan direview dalam...</p>
          <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Akan dicek setiap bulan</p>
        </div>
        <div className="flex items-center gap-3">
          {[
            { value: "25", label: "Hari" },
            { value: "7", label: "Jam" },
            { value: "58", label: "Menit" },
          ].map((t, i) => (
            <div key={i} className="flex items-center gap-1">
              <span className="text-[20px] font-extrabold" style={{ color: "var(--ch-text)" }}>{t.value}</span>
              <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{t.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────── Leaderboard Tab ───────────────────── */

const leaderboardData = [
  { rank: 1, username: "A****Y*S**w", rankName: "Base Clipper", payout: 50758160 },
  { rank: 2, username: "R*****M**i", rankName: "Base Clipper", payout: 14918992 },
  { rank: 3, username: "S***a c****a", rankName: "Verified Clipper", payout: 13921975 },
  { rank: 4, username: "I******T", rankName: "Base Clipper", payout: 13903934 },
  { rank: 5, username: "A**o C*****i", rankName: "Verified Clipper", payout: 13244976 },
  { rank: 6, username: "B****g*a*p**a", rankName: "Verified Clipper", payout: 12095645 },
  { rank: 7, username: "w***h**y", rankName: "Base Clipper", payout: 10775827 },
  { rank: 8, username: "M*****d A*****h", rankName: "Base Clipper", payout: 10408507 },
  { rank: 9, username: "W****x", rankName: "Verified Clipper", payout: 9188953 },
  { rank: 10, username: "A******S", rankName: "Verified Clipper", payout: 8199629 },
];

function LeaderboardTab() {
  const [timeTab, setTimeTab] = useState("all");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center py-6" style={{ background: "linear-gradient(180deg, #1A1208 0%, #0F172A 100%)", borderRadius: "14px" }}>
        <div className="flex items-center gap-1 p-1 rounded-lg mb-4" style={{ background: "#292524", border: "1px solid #44403C" }}>
          <button
            onClick={() => setTimeTab("week")}
            className="px-4 py-1.5 text-[11px] font-bold rounded-md transition-all"
            style={timeTab === "week" ? { background: "#F97316", color: "white" } : { color: "#D6D3D1" }}
          >
            This Week
          </button>
          <button
            onClick={() => setTimeTab("all")}
            className="px-4 py-1.5 text-[11px] font-bold rounded-md transition-all"
            style={timeTab === "all" ? { background: "#F97316", color: "white" } : { color: "#D6D3D1" }}
          >
            All Time
          </button>
        </div>
        <h1 className="text-[32px] font-extrabold tracking-wider" style={{ color: "#DAA520", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          LEADERBOARD
        </h1>
      </div>

      {/* Table */}
      <div className="rounded-[14px] border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
              <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider w-16" style={{ color: "var(--ch-text-muted)" }}>No</th>
              <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Username</th>
              <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Rank</th>
              <th className="text-right py-3 px-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Payout</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((item) => (
              <tr key={item.rank} className="border-b transition-colors hover:bg-white/[0.02]" style={{ borderColor: "var(--ch-border)" }}>
                <td className="py-3 px-4">
                  <span className="text-[13px] font-bold" style={{ color: item.rank <= 3 ? "#DAA520" : "var(--ch-text-muted)" }}>#{item.rank}</span>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: `hsl(${item.rank * 36}, 40%, 25%)`, color: `hsl(${item.rank * 36}, 60%, 70%)` }}>
                      {item.username.charAt(0)}
                    </div>
                    <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{item.username}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="text-[12px] font-semibold" style={{ color: item.rankName === "Verified Clipper" ? "#22C55E" : "var(--ch-text-muted)" }}>
                    {item.rankName}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <span className="text-[13px] font-bold" style={{ color: "#22C55E" }}>
                    Rp{item.payout.toLocaleString("id-ID")}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <p className="text-center text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
        Kamu belum masuk peringkat — mulai clipping buat naik leaderboard! 🚀
      </p>
    </div>
  );
}

/* ───────────────────── Content Production Management ───────────────────── */

function ContentProductionManagement({ item, onClose }: { item: PipelineItem; onClose: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [thumbnail, setThumbnail] = useState(item.thumbnail);
  const [caption, setCaption] = useState(item.caption || "");
  const [hashtags, setHashtags] = useState(item.hashtags || "");
  const steps = getProductionSteps(item);
  const statusColors: Record<string, { bg: string; color: string }> = {
    "Done": { bg: "#166534", color: "#4ADE80" },
    "Not Done": { bg: "#854D0E", color: "#FACC15" },
    "No Need": { bg: "#334155", color: "#94A3B8" },
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" style={{ background: "#0F172A", border: "1px solid #1E293B" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: "#1E293B" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
              <img src={item.creatorAvatar} alt={item.creatorName} className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-[16px] font-bold" style={{ color: "#F1F5F9", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Content Production Management: {item.contentCode}
              </h2>
              <p className="text-[12px]" style={{ color: "#94A3B8" }}>{item.creatorName}</p>
              <p className="text-[11px]" style={{ color: "#64748B" }}>Konten Kreator / {item.creatorRole}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/10">
            <X className="w-5 h-5" style={{ color: "#94A3B8" }} />
          </button>
        </div>

        {/* Content Info + Thumbnail */}
        <div className="p-5 border-b" style={{ borderColor: "#1E293B" }}>
          <div className="grid grid-cols-[1fr_200px] gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Target Posting</p>
                  <p className="text-[13px] font-semibold mt-0.5" style={{ color: "#F1F5F9" }}>{item.targetDate}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Target Platform</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    {item.platforms.map((p) => <PlatformIcon key={p} platform={p} />)}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Fase</p>
                  <p className="text-[13px] font-semibold mt-0.5" style={{ color: "#F1F5F9" }}>{item.fase}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Content Pillar</p>
                  <p className="text-[13px] font-semibold mt-0.5" style={{ color: "#F1F5F9" }}>{item.contentPillar}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Tema/Topik</p>
                  <p className="text-[14px] font-bold mt-0.5" style={{ color: "#60A5FA" }}>{item.topic}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Caption</p>
                  {isEditing ? (
                    <textarea
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      className="w-full mt-1 p-2 text-[13px] rounded-lg border resize-none"
                      style={{ background: "#1E293B", borderColor: "#334155", color: "#F1F5F9" }}
                      rows={2}
                    />
                  ) : (
                    <p className="text-[13px] mt-0.5" style={{ color: "#F1F5F9" }}>{caption}</p>
                  )}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Hashtags</p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={hashtags}
                      onChange={(e) => setHashtags(e.target.value)}
                      className="w-full mt-1 p-2 text-[13px] rounded-lg border"
                      style={{ background: "#1E293B", borderColor: "#334155", color: "#F1F5F9" }}
                    />
                  ) : (
                    <p className="text-[13px] mt-0.5" style={{ color: "#60A5FA" }}>{hashtags}</p>
                  )}
                </div>
              </div>
            </div>
            {/* Thumbnail */}
            <div className="rounded-xl overflow-hidden relative group" style={{ background: "#1E293B" }}>
              <img src={thumbnail} alt={item.topic} className="w-full h-full min-h-[180px] object-cover" />
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <div className="text-center">
                    <Image className="w-6 h-6 mx-auto mb-1" style={{ color: "#94A3B8" }} />
                    <span className="text-[10px] font-semibold" style={{ color: "#94A3B8" }}>Ganti Foto</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Production Steps Table */}
        <div className="p-5">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "#1E293B" }}>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>NO</th>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>ALUR PRODUKSI</th>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>PENANGGUNG JAWAB KERJAAN</th>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>DONE/NOT DONE</th>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>SUPERVISOR</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step) => {
                const st = statusColors[step.status];
                return (
                  <StepRow key={step.no} step={step} statusStyle={st} />
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex items-center justify-between" style={{ borderColor: "#1E293B" }}>
          <Button
            variant="outline"
            className="gap-1.5 text-[13px] font-semibold"
            style={{ borderColor: "#334155", color: "#94A3B8" }}
            onClick={() => setIsEditing(!isEditing)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            {isEditing ? "Batal Edit" : "Edit"}
          </Button>
          <Button className="gap-1.5 text-[13px] font-semibold" style={{ background: "#2563EB" }}>
            Save Progress
          </Button>
        </div>
      </div>
    </div>
  );
}

function StepRow({ step, statusStyle }: { step: ProductionStep; statusStyle: { bg: string; color: string } }) {
  return (
    <>
      <tr className="border-b" style={{ borderColor: "#1E293B" }}>
        <td className="py-2.5 px-3 text-[12px] font-semibold" style={{ color: "#F1F5F9" }}>{step.no}</td>
        <td className="py-2.5 px-3 text-[12px] font-semibold" style={{ color: "#F1F5F9" }}>{step.alurProduksi}</td>
        <td className="py-2.5 px-3">
          <div className="flex flex-wrap gap-1">
            {step.penanggungJawab.map((pj) => (
              <span key={pj} className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: "#1E3A5F", color: "#60A5FA" }}>
                {pj}
              </span>
            ))}
          </div>
        </td>
        <td className="py-2.5 px-3">
          {step.hasSchedule ? (
            <input
              type="datetime-local"
              className="px-2.5 py-1.5 rounded text-[11px] font-semibold border"
              style={{ background: "#1E293B", borderColor: "#334155", color: "#F1F5F9" }}
            />
          ) : (
            <span className="px-2.5 py-1 rounded text-[10px] font-bold" style={{ background: statusStyle.bg, color: statusStyle.color }}>
              {step.status}
            </span>
          )}
        </td>
        <td className="py-2.5 px-3 text-[11px]" style={{ color: "#94A3B8" }}>{step.supervisor}</td>
      </tr>
      {step.hasPreview && (
        <tr className="border-b" style={{ borderColor: "#1E293B" }}>
          <td colSpan={5} className="py-3 px-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold" style={{ color: "#94A3B8" }}>{step.previewLabel}</p>
                <button className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded transition-colors hover:bg-red-500/10" style={{ color: "#F87171", border: "1px solid #7F1D1D" }}>
                  <Download className="w-3 h-3" /> Download {step.no === 2 ? "All Assets" : "Asset"}
                </button>
              </div>
              {/* Google Docs Link Preview - Dark */}
              <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#1E293B", maxWidth: "480px", background: "#1A2332" }}>
                <div className="flex items-center gap-3 p-3" style={{ background: "#1A3A2A" }}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#166534" }}>
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" fill="#22C55E" opacity="0.3"/>
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" stroke="#22C55E" strokeWidth="1.5"/>
                      <path d="M14 2v6h6M8 13h8M8 17h5" stroke="#22C55E" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12px] font-semibold truncate" style={{ color: "#4ADE80" }}>docs.google.com</p>
                    <p className="text-[11px] truncate mt-0.5" style={{ color: "#86EFAC" }}>
                      https://docs.google.com/spreadsheets/d/16kRhfe6UWCVxKkKPTyWHTNzl2m1ZnBUcgOi_1pDRA/edit?gid=730194611#gid=730194611
                    </p>
                  </div>
                  <span className="text-[10px] shrink-0" style={{ color: "#4ADE80" }}>14:53</span>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

/* ───────────────────── Pipeline Row ───────────────────── */

function PipelineRow({ item, onView }: { item: PipelineItem; onView: () => void }) {
  return (
    <tr className="border-b transition-colors hover:bg-white/[0.02]" style={{ borderColor: "var(--ch-border)" }}>
      {/* Tema/Topik */}
      <td className="py-3.5 px-4">
        <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{item.topic}</span>
      </td>

      {/* Konten Kreator */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full overflow-hidden shrink-0">
            <img src={item.creatorAvatar} alt={item.creatorName} className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{item.creatorName}</p>
            <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{item.creatorRole}</p>
          </div>
        </div>
      </td>

      {/* Digital Assets */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded flex items-center justify-center" style={{ background: "var(--ch-orange-50)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3" style={{ color: "var(--ch-orange)" }}><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="M21 15l-5-5L5 21" /></svg>
          </div>
          <span className="text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>{item.digitalAssets}</span>
        </div>
      </td>

      {/* Target Posting */}
      <td className="py-3.5 px-4">
        <span className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{item.targetDate}</span>
      </td>

      {/* Target Platform */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1.5">
          {item.platforms.map((p) => <PlatformIcon key={p} platform={p} />)}
        </div>
      </td>

      {/* Progress */}
      <td className="py-3.5 px-4">
        <div className="space-y-1 min-w-[140px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold" style={{ color: "var(--ch-text)" }}>{item.completedSteps}/{item.totalSteps} Steps</span>
            <span className="text-[11px] font-bold" style={{ color: "var(--ch-primary)" }}>{item.progressPercent}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full" style={{ background: "var(--ch-border)" }}>
            <div className="h-full rounded-full bg-blue-500" style={{ width: `${item.progressPercent}%` }} />
          </div>
          <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{item.lastStep}</p>
        </div>
      </td>

      {/* Actions */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2">
          <button onClick={onView} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors hover:bg-white/10" style={{ color: "var(--ch-text-muted)", border: "1px solid var(--ch-border)" }}>
            <Eye className="w-3 h-3" /> View
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors hover:bg-white/10" style={{ color: "var(--ch-text-muted)", border: "1px solid var(--ch-border)" }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg> Edit
          </button>
        </div>
      </td>
    </tr>
  );
}

/* ───────────────────── Main Component ───────────────────── */

export default function ContentHub() {
  const [mainTab, setMainTab] = useState("campaigns");
  const [searchQuery, setSearchQuery] = useState("");
  const [pipelineSearch, setPipelineSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState<PipelineItem | null>(null);

  const filteredCampaigns = campaigns.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPipeline = pipelineData.filter(
    (p) =>
      p.topic.toLowerCase().includes(pipelineSearch.toLowerCase()) ||
      p.creatorName.toLowerCase().includes(pipelineSearch.toLowerCase())
  );

  const mainTabs = [
    { value: "overview", icon: LayoutDashboard, label: "Overview" },
    { value: "campaigns", icon: Megaphone, label: "Campaigns" },
    { value: "content-hub", icon: FolderOpen, label: "Content Hub" },
    { value: "whatsapp-reporting", icon: MessageSquare, label: "WhatsApp Reporting" },
    { value: "analytics", icon: BarChart3, label: "Analytics" },
    { value: "revenue", icon: DollarSign, label: "Revenue" },
    { value: "rank-rewards", icon: Award, label: "Rank & Rewards" },
    { value: "leaderboard", icon: Trophy, label: "Leaderboard" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      {/* Main Tabs: Campaigns | Content Hub */}
      <div className="flex items-center gap-2 pb-2 overflow-x-auto">
        {mainTabs.map((tab) => {
          const isActive = mainTab === tab.value;
          const TabIcon = tab.icon;
          return (
            <button key={tab.value} onClick={() => setMainTab(tab.value)}
              className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold rounded-lg transition-all duration-150 whitespace-nowrap shrink-0"
              style={isActive ? {
                background: "linear-gradient(135deg, #EA580C, #F97316)",
                color: "white",
                boxShadow: "0 2px 8px rgba(249,115,22,.3)",
              } : {
                color: "var(--ch-text-muted)",
                background: "var(--ch-surface)",
                border: "1px solid var(--ch-border)",
              }}>
              <TabIcon className="w-3.5 h-3.5" />{tab.label}
            </button>
          );
        })}
      </div>

      {/* ═══════════ CAMPAIGNS TAB ═══════════ */}
      {mainTab === "campaigns" && (
        <div className="space-y-5">
          {/* Header + Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <h1 className="text-xl md:text-[22px] font-extrabold tracking-[-0.5px] whitespace-nowrap" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Explore Semua Campaign
            </h1>

            <div className="relative flex-1 max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
              <input
                type="text"
                placeholder="Cari campaign atau brand..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border"
                style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)", color: "var(--ch-text)" }}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-lg border transition-colors hover:bg-white/5"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
                Urutkan dari <ArrowUpDown className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-lg border transition-colors hover:bg-white/5"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
                Kategori <ChevronDown className="w-3 h-3" />
              </button>
              <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-lg border transition-colors hover:bg-white/5"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
                Tipe <ChevronDown className="w-3 h-3" />
              </button>
              <div className="flex items-center gap-1 ml-1">
                {["tiktok", "instagram", "youtube"].map((p) => (
                  <button key={p} className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors hover:bg-white/5"
                    style={{ borderColor: "var(--ch-border)" }}>
                    <PlatformIcon platform={p} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Campaign Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredCampaigns.map((c) => (
              <CampaignCard key={c.id} campaign={c} />
            ))}
          </div>
        </div>
      )}

      {/* ═══════════ CONTENT HUB TAB ═══════════ */}
      {mainTab === "content-hub" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-[22px] font-extrabold tracking-[-0.5px]" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Content Production Pipeline ({filteredPipeline.length})
            </h1>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
                <input
                  type="text"
                  placeholder="Cari konten atau kreator..."
                  value={pipelineSearch}
                  onChange={(e) => setPipelineSearch(e.target.value)}
                  className="pl-9 pr-3 py-2 text-[13px] rounded-lg border w-64"
                  style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)", color: "var(--ch-text)" }}
                />
              </div>
              <Button className="gap-1.5 text-[13px] font-semibold" style={{ background: "var(--ch-primary)" }}>
                <Plus className="w-4 h-4" /> Create Topic
              </Button>
            </div>
          </div>

          {/* Pipeline Table */}
          <div className="rounded-[14px] border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                    <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Tema/Topik</th>
                    <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Konten Kreator</th>
                    <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Digital Assets</th>
                    <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Target Posting</th>
                    <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Target Platform</th>
                    <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Progress</th>
                    <th className="text-left py-3 px-4 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPipeline.map((item) => (
                    <PipelineRow key={item.id} item={item} onView={() => setSelectedItem(item)} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ OVERVIEW TAB ═══════════ */}
      {mainTab === "overview" && (
        <OverviewTab />
      )}

      {/* ═══════════ WHATSAPP REPORTING TAB ═══════════ */}
      {mainTab === "whatsapp-reporting" && (
        <WhatsAppReporting />
      )}

      {/* ═══════════ ANALYTICS TAB ═══════════ */}
      {mainTab === "analytics" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-[22px] font-extrabold tracking-[-0.5px]" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Analitik Performa Kamu
            </h1>
            <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-lg border" style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Views", value: "0", suffix: "Views", color: "#F97316" },
              { label: "Total Campaign", value: "0", suffix: "Campaign", color: "#8B5CF6" },
              { label: "Total Video", value: "0", suffix: "Video", color: "#22C55E" },
              { label: "Total Approved", value: "0", suffix: "Videos", color: "#3B82F6" },
            ].map((s) => (
              <div key={s.label} className="rounded-[14px] border p-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{s.label}</p>
                </div>
                <p className="text-[24px] font-extrabold" style={{ color: s.color }}>
                  {s.value} <span className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{s.suffix}</span>
                </p>
              </div>
            ))}
          </div>

          {/* Total Views Chart */}
          <div className="rounded-[14px] border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-[16px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Total Views
                </h2>
                <button className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: "#F97316", color: "white" }}>Total</button>
                <button className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ color: "var(--ch-text-muted)", background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>Kenaikan</button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>📅 28 hari terakhir</span>
                <ChevronDown className="w-3 h-3" style={{ color: "var(--ch-text-muted)" }} />
              </div>
            </div>

            {/* Chart */}
            <div className="relative">
              {/* Y-axis labels */}
              <div className="absolute right-0 top-0 bottom-8 flex flex-col justify-between text-[10px]" style={{ color: "var(--ch-text-soft)" }}>
                <span>1K</span>
                <span>800</span>
                <span>600</span>
                <span>400</span>
                <span>200</span>
                <span>⊖ 0</span>
              </div>

              {/* Chart area */}
              <div className="pr-16 pb-8">
                <div className="h-[200px] flex items-end relative" style={{ borderBottom: "1px solid var(--ch-border)" }}>
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="absolute w-full" style={{ bottom: `${i * 20}%`, borderTop: "1px dashed var(--ch-border)" }} />
                  ))}

                  {/* Chart line (flat since no data) */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "#F97316" }} />

                  {/* Current value badge */}
                  <div className="absolute bottom-0 right-0 px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "#F97316", color: "white" }}>
                    0 Views
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between mt-2 text-[9px]" style={{ color: "var(--ch-text-soft)" }}>
                  {["06 Jun", "07 Jun", "08 Jun", "09 Jun", "10 Jun", "11 Jun", "12 Jun", "13 Jun", "14 Jun", "15 Jun", "16 Jun", "17 Jun", "18 Jun", "19 Jun", "20 Jun", "21 Jun", "22 Jun", "23 Jun", "24 Jun", "25 Jun", "26 Jun", "27 Jun", "28 Jun", "29 Jun", "30 Jun", "01 Jul", "02 Jul", "03 Jul", "04 Jul", "05 Jul"].map((d, i) => (
                    <span key={i}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ REVENUE TAB ═══════════ */}
      {mainTab === "revenue" && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-[22px] font-extrabold tracking-[-0.5px]" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Pendapatan
              </h1>
            </div>
            <div className="relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5" style={{ color: "var(--ch-text-muted)" }}>
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center" style={{ background: "#EF4444", color: "white" }}>3</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-[18px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Pendapatan
            </h2>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 px-3 py-2 text-[12px] font-semibold rounded-lg border" style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
                <Download className="w-3.5 h-3.5" /> Export CSV
              </button>
              <button className="flex items-center gap-1.5 px-4 py-2 text-[12px] font-semibold rounded-lg" style={{ background: "#F97316", color: "white" }}>
                Withdraw <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Total Pendapatan", value: "Rp0", color: "var(--ch-text)" },
              { label: "Bisa Dicairkan", value: "Rp0", color: "#22C55E" },
              { label: "Sedang Diproses", value: "Rp0", color: "#F97316" },
            ].map((s) => (
              <div key={s.label} className="rounded-[14px] border p-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{s.label}</p>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3" style={{ color: "var(--ch-text-soft)" }}>
                    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                  </svg>
                </div>
                <p className="text-[24px] font-extrabold" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Analitik Pendapatan Chart */}
          <div className="rounded-[14px] border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-[16px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Analitik Pendapatan
                </h2>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5" style={{ color: "var(--ch-text-soft)" }}>
                  <circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" />
                </svg>
                <button className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: "#F97316", color: "white" }}>Total</button>
                <button className="text-[10px] px-2 py-0.5 rounded font-semibold" style={{ color: "var(--ch-text-muted)", background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>Kenaikan</button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>📅 28 hari terakhir</span>
                <ChevronDown className="w-3 h-3" style={{ color: "var(--ch-text-muted)" }} />
              </div>
            </div>

            {/* Chart */}
            <div className="relative">
              {/* Y-axis labels */}
              <div className="absolute right-0 top-0 bottom-8 flex flex-col justify-between text-[10px]" style={{ color: "var(--ch-text-soft)" }}>
                <span>Rp4 JT</span>
                <span>Rp750K</span>
                <span>Rp500K</span>
                <span>Rp250K</span>
                <span>⊖ Rp0</span>
              </div>

              {/* Chart area */}
              <div className="pr-20 pb-8">
                <div className="h-[200px] flex items-end relative" style={{ borderBottom: "1px solid var(--ch-border)" }}>
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="absolute w-full" style={{ bottom: `${i * 25}%`, borderTop: "1px dashed var(--ch-border)" }} />
                  ))}

                  {/* Chart line (flat since no data) */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px]" style={{ background: "#F97316" }} />

                  {/* Current value badge */}
                  <div className="absolute bottom-0 right-0 px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "#F97316", color: "white" }}>
                    Rp0
                  </div>
                </div>

                {/* X-axis labels */}
                <div className="flex justify-between mt-2 text-[9px]" style={{ color: "var(--ch-text-soft)" }}>
                  {["Jun 9", "10", "11", "12", "13", "14", "15", "Jun 16", "17", "18", "19", "20", "Jun 23", "24", "25", "Jun 28", "29", "30", "Jul 1", "2", "3", "4", "5", "6"].map((d, i) => (
                    <span key={i}>{d}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ RANK & REWARDS TAB ═══════════ */}
      {mainTab === "rank-rewards" && (
        <RankRewardsTab />
      )}

      {/* ═══════════ LEADERBOARD TAB ═══════════ */}
      {mainTab === "leaderboard" && (
        <LeaderboardTab />
      )}

      {/* Content Production Management Modal */}
      {selectedItem && (
        <ContentProductionManagement item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
  );
}
