import { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { MapPin, ArrowLeft, Info, CheckCircle, Circle, Clock, Send, Bookmark, User, Eye, CreditCard, BarChart3, RefreshCw, Loader2, ChevronLeft, ChevronRight, CalendarDays, Check } from "lucide-react";
import { useCreator } from "@/hooks/useCreators";
import { creatorsApi } from "@/lib/api";
import { formatFollowers, resolveCreatorPhoto } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import MonitorPostsTab from "./MonitorPostsTab";
import CampaignMonitoringTab from "./CampaignMonitoringTab";
import type { PlatformMetric } from "@/types";

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const IgLogo = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <defs>
      <linearGradient id="igGrad" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#FFDC80"/>
        <stop offset="25%" stopColor="#F77737"/>
        <stop offset="50%" stopColor="#FD1D1D"/>
        <stop offset="75%" stopColor="#C13584"/>
        <stop offset="100%" stopColor="#833AB4"/>
      </linearGradient>
    </defs>
    <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#igGrad)" strokeWidth="2"/>
    <circle cx="12" cy="12" r="5" stroke="url(#igGrad)" strokeWidth="2"/>
    <circle cx="17.5" cy="6.5" r="1.5" fill="url(#igGrad)"/>
  </svg>
);

const HandshakeIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 17l2 2a1 1 0 1 0 3-3" />
    <path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
    <path d="m21 3 1 11h-2" />
    <path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
    <path d="M3 4h8" />
  </svg>
);

const MegaphoneIcon = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 11 18-5v12L3 14v-3z" />
    <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
  </svg>
);

const EXISTING_BRANDS: { name: string; logo: string }[] = [
  { name: "Yamaha", logo: "/collaborations/yamaha.svg" },
  { name: "Honda", logo: "/collaborations/honda.svg" },
  { name: "Shopee", logo: "/collaborations/shopee.svg" },
  { name: "Aceh", logo: "/collaborations/aceh.png" },
  { name: "Indosat", logo: "/collaborations/indosat.svg" },
  { name: "McDonald's", logo: "/collaborations/mcdonalds.png" },
  { name: "KFC", logo: "/collaborations/kfc.png" },
  { name: "Scarlett", logo: "/collaborations/scarlett.svg" },
  { name: "Teh Kotak", logo: "/collaborations/tehkotak.png" },
  { name: "Yupi", logo: "/collaborations/yupi.png" },
  { name: "Tokopedia", logo: "/collaborations/tokopedia.svg" },
  { name: "Telkomsel", logo: "/collaborations/telkomsel.svg" },
  { name: "Lemonilo", logo: "/collaborations/lemonilo.png" },
  { name: "MS Glow", logo: "/collaborations/msglow.png" },
  { name: "Smartfren", logo: "/collaborations/smartfren.svg" },
];

const PREVIOUS_BRANDS: string[][] = [
  [
    "Tokopedia", "Beudelab", "Shopee", "Sunscreen Wardah", "Ghost Pepper",
    "Masker Helwa Beuty", "Scarlet", "Bakso Paknu", "Masker", "Slimilly.id",
    "Bakso Aci Boci", "Anggola", "Beute Lab.Inc", "Marcks", "Minyak Kayu PutihDragon",
    "Youvit Multivitamin", "Seed Perapat.id", "Moko moko", "KFC", "Mustika Ratu",
    "VIP", "Lemonilo", "AONEZ", "Bio Aqua", "Aero Clinmax",
    "Chatime", "Lefregence Parfume", "Mo Uung", "Elumor", "MS GLow",
    "Focallure", "Riveno.official", "Skinufia", "O.twoo Kosmetik", "Hanriver",
    "Makarizo", "Makuku Air Diapers", "SR 12", "Speed", "Viorra Skincare",
    "Eatsambel", "Alfisa Beuty", "Mamabear", "We Love it Official", "Whiteinc",
    "Jimeiline", "Azarine", "Madu Urai", "Joar", "Sushimei",
  ],
  [
    "Bumbei", "Luxus", "Gmbeer", "Indoganic", "Nasi Kulit Malam Minggu",
    "King Fried Chicken", "Mochichantik", "Metoo", "D'cost", "Mujigae",
    "Teh Kotak", "Honda", "Gojoudokk", "N.Pure", "Indomaret",
    "Kotty Cosmetic", "Pinanthi.official", "Mixio", "Byebadskin", "Alfamart",
    "PS Aesthetic Clinic", "Oasis in Dubai", "Dr ZLim Official", "Dorly 29 Estetika", "dr Dini Skincare",
    "Breaktime", "Freshcare Smash", "Papa Steak", "Banda Banana", "Aa Clinic",
    "Yupi", "Petede", "Yamaha", "McDonalds", "Orang Mercon Merah Putih",
    "HDLV", "We Drink", "DISBUDPAR", "Benings Clinic", "Namz Bakery",
    "Mamesaka", "Plum Hotel Lading", "Telkomsel", "Smartfren", "Hifi",
  ],
];

type TabKey = "profile" | "collaborations" | "insight" | "posts" | "campaigns" | "rate";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Profile", icon: <User className="w-3.5 h-3.5" /> },
  { key: "collaborations", label: "Collaborations", icon: <HandshakeIcon className="w-3.5 h-3.5" /> },
  { key: "insight", label: "Insight", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { key: "posts", label: "Content Monitoring", icon: <Eye className="w-3.5 h-3.5" /> },
  { key: "campaigns", label: "Campaign Monitoring", icon: <MegaphoneIcon className="w-3.5 h-3.5" /> },
  { key: "rate", label: "Rate Card", icon: <CreditCard className="w-3.5 h-3.5" /> },
];

export default function EkrafHubCreatorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: creator, isLoading, error } = useCreator(id ?? "");
  const [tab, setTab] = useState<TabKey>("profile");
  const queryClient = useQueryClient();

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-80 w-full rounded-2xl" />
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="p-4 md:p-8 text-center">
        <p className="text-lg font-semibold" style={{ color: "var(--ch-text)" }}>Creator not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard/ekrafhub/marketplace")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
        </Button>
      </div>
    );
  }

  const photoSrc = resolveCreatorPhoto(creator.img, creator.imageUrl);
  const tiktokMetric = creator.platformMetrics?.find((m) => m.platform === "tiktok");
  const igMetric = creator.platformMetrics?.find((m) => m.platform === "instagram");
  const handle = tiktokMetric?.handle || igMetric?.handle || creator.handle || "itsbanuun";

  const categories = creator.category.split(",").map((c) => c.trim());
  const categoryDisplay: Record<string, string> = {
    lifestyle: "Lifestyle",
    beauty: "Beauty",
    fashion: "Fashion",
    food: "Food Creator",
    travel: "Travel",
    tech: "Technology",
    gaming: "Gaming",
    entertainment: "Entertainment",
    comedy: "Comedy",
    education: "Education",
  };

  const shadow3d = "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)";
  const shadowCard = "0 4px 24px rgba(0,0,0,0.35), 0 1px 4px rgba(0,0,0,0.25)";
  const panel = { background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", boxShadow: shadowCard, border: "1px solid rgba(255,255,255,0.06)" };

  return (
    <div className="min-h-screen pb-8" style={{ background: "#080c18" }}>
      {/* Tab bar (replaces Marketplace / Profile breadcrumb) */}
      <div className="mx-6 mt-4 rounded-2xl p-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}>
        <div className="flex items-center gap-2 overflow-x-auto">
          {TABS.map((t) => {
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap ${active ? "text-white" : ""}`}
                style={active
                  ? { background: "linear-gradient(135deg, #F97316, #EA580C)", boxShadow: "0 8px 20px rgba(249,115,22,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif" }
                  : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {t.icon} {t.label}
              </button>
            );
          })}
          <div className="flex-1" />
          <button
            onClick={() => navigate("/dashboard/ekrafhub/marketplace")}
            className="profile-back-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-white transition-all hover:brightness-110 shrink-0"
            style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
          >
            <ArrowLeft className="w-3.5 h-3.5" /> <span className="hidden sm:inline">Kembali</span>
          </button>
        </div>
      </div>

      {/* Creator Profile Card (only on Profile tab) */}
      {tab === "profile" && (
      <>
      <div className="mx-6 mt-4 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(180deg, #0d1420 0%, #080d16 100%)", boxShadow: shadow3d, border: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex flex-col md:flex-row gap-4 md:gap-6 p-4 md:p-6">
          {/* Left: Photo frame */}
          <div className="shrink-0 mx-auto md:mx-0">
            <div className="relative w-[220px] md:w-[250px] h-[240px] md:h-[272px]">
              <div className="absolute inset-0 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                {photoSrc ? (
                  <img src={photoSrc} alt={creator.name} className="w-full h-full object-cover"
                    style={{ objectPosition: "center top" }}
                    referrerPolicy="no-referrer" onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl font-bold" style={{ color: "#94A3B8" }}>
                    {creator.name[0]}
                  </div>
                )}
              </div>
              {/* Orange glow bottom edge */}
              <div className="absolute -bottom-1 left-4 right-20 h-2 rounded-full" style={{ background: "linear-gradient(90deg, #F97316, transparent)", filter: "blur(7px)" }} />
              <div className="absolute -bottom-1 left-4 w-24 h-1 rounded-full" style={{ background: "#F97316", boxShadow: "0 0 12px rgba(249,115,22,0.8)" }} />
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", lineHeight: 1.1 }}>
              {creator.name}
            </h1>

            {/* Category + Location pill badges */}
            <div className="flex items-center gap-2 mt-3.5 flex-wrap">
              {categories.slice(0, 3).map((cat) => {
                const label = categoryDisplay[cat.toLowerCase()] || cat;
                return (
                  <span key={cat} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#F97316" }} />
                    {label}
                  </span>
                );
              })}
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <MapPin className="w-3.5 h-3.5" style={{ color: "#F97316" }} /> {creator.city}
              </span>
            </div>

            {/* Bio */}
            <p className="text-[13px] mt-3 leading-snug max-w-2xl" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {creator.bio || "Sejak kecil aku sudah punya passion besar di dunia kuliner. Dari hobi makan, akhirnya berkembang menjadi perjalanan karier sebagai Food Content Creator & Vlogger di berbagai platform sosial media. Di setiap konten, aku selalu membawa energi positif dengan tagline khas: \"MARI KITA RIPHIUUU!\""}
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-4">
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold text-white transition-all hover:scale-[1.03]"
                style={{ background: "linear-gradient(135deg, #F97316, #EA580C)", boxShadow: "0 8px 24px rgba(249,115,22,0.35)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Send className="w-4 h-4" /> Contact Creator
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-colors hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Bookmark className="w-4 h-4" /> Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      <AccountPerformanceSummary
        creatorId={creator.id}
        igMetric={igMetric}
        tiktokMetric={tiktokMetric}
        onUpdated={() => {
          queryClient.invalidateQueries({ queryKey: ["creator", id ?? ""] });
          queryClient.invalidateQueries({ queryKey: ["creators"] });
        }}
      />
      </>
    )}

      {/* Tab content */}
      <div className="mt-4">
        {tab === "profile" && (
          <div className="mx-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Tentang Kreator */}
            <div className="rounded-2xl p-5" style={panel}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #F97316, #EA580C)", boxShadow: "0 0 10px rgba(249,115,22,0.5)" }} />
                <h3 className="text-sm font-bold text-white">Tentang Kreator</h3>
              </div>

              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <svg className="w-5 h-5" style={{ color: "rgba(255,255,255,0.5)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: "#F97316" }}>About Me</p>
                  <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                    Sejak kecil aku sudah punya passion besar di dunia kuliner. Dari hobi makan, akhirnya berkembang menjadi perjalanan karier sebagai Food Content Creator & Vlogger di berbagai platform sosial media. Di setiap konten, aku selalu membawa energi positif dengan tagline khas: <span className="font-bold" style={{ color: "#F97316" }}>"MARI KITA RIPHIUU!"</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <svg className="w-5 h-5" style={{ color: "rgba(255,255,255,0.5)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: "#F97316" }}>Background</p>
                  <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                    Background kreator belum tersedia.
                  </p>
                </div>
              </div>
            </div>

            {/* Informasi Kreator */}
            <div className="rounded-2xl p-5" style={panel}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #FD1D1D, #833AB4)", boxShadow: "0 0 10px rgba(225,48,108,0.5)" }} />
                <h3 className="text-sm font-bold text-white">Informasi Kreator</h3>
              </div>

              <div className="space-y-4">
                {[
                  { icon: <TagIcon />, label: "Kategori", value: creator.category.split(",").map((c) => categoryDisplay[c.trim().toLowerCase()] || c.trim()).join(" & ") },
                  { icon: <PinIcon />, label: "Lokasi", value: creator.city || "â€”" },
                  { icon: <GlobeIcon />, label: "Platform", value: creator.platforms.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" & ") },
                  ...(creator.tags?.length ? [{ icon: <StarIcon />, label: "Tag", value: creator.tags.join(", "), highlight: true } as const] : []),
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <span style={{ color: "rgba(255,255,255,0.5)" }}>{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: "rgba(255,255,255,0.55)" }}>{item.label}</p>
                      <p className={`text-[13px] font-semibold mt-0.5 ${item.highlight ? "uppercase" : ""}`} style={{ color: item.highlight ? "#F97316" : "rgba(255,255,255,0.85)" }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kesiapan Data */}
            <div className="rounded-2xl p-5 md:col-span-2 lg:col-span-1" style={panel}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #25F4EE, #FE2C55)", boxShadow: "0 0 10px rgba(37,244,238,0.5)" }} />
                <h3 className="text-sm font-bold text-white">Kesiapan Data</h3>
              </div>

              <div className="space-y-4">
                {[
                  { label: "Profil dasar", status: "available", color: "#10B981", badge: "Tersedia" },
                  { label: "Metrik platform", status: "partial", color: "#F97316", badge: "Sebagian tersedia" },
                  { label: "Demografi audiens", status: "unavailable", color: "#EF4444", badge: "Belum tersedia" },
                  { label: "Engagement rate", status: "unavailable", color: "#EF4444", badge: "Belum dihitung" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {item.status === "available" ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(16,185,129,0.15)" }}>
                          <CheckCircle className="w-3.5 h-3.5" style={{ color: item.color }} />
                        </div>
                      ) : item.status === "partial" ? (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(249,115,22,0.15)" }}>
                          <Clock className="w-3.5 h-3.5" style={{ color: item.color }} />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(239,68,68,0.15)" }}>
                          <Circle className="w-3.5 h-3.5" style={{ color: item.color }} />
                        </div>
                      )}
                      <span className="text-[13px] font-medium" style={{ color: "rgba(255,255,255,0.7)" }}>{item.label}</span>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
                      style={{
                        background: `${item.color}18`,
                        color: item.color,
                        border: `1px solid ${item.color}30`,
                      }}>
                      {item.badge}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === "collaborations" && (
          <div className="mx-6 space-y-6">
            {/* Existing Collaborations */}
            <div>
              <div className="flex items-center gap-2.5 mb-3" style={{ height: 26 }}>
                <div className="w-[3px] h-[17px] rounded-[2px]" style={{ background: "#f26522" }} />
                <h2 className="text-[17px] font-bold text-white">Existing Collaborations</h2>
              </div>
              <div className="rounded-3xl p-5 md:p-6" style={{ background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-5">
                  {EXISTING_BRANDS.map((b) => (
                    <div key={b.name} className="flex flex-col items-center gap-2">
                      <div
                        className="w-[96px] h-[96px] rounded-[24px] flex items-center justify-center"
                        style={{
                          background: "rgba(255,255,255,0.06)",
                          border: "1px solid rgba(255,255,255,0.16)",
                          boxShadow: "0 0 18px rgba(255,255,255,0.22), inset 0 1px 0 rgba(255,255,255,0.12)",
                        }}
                      >
                        <div
                          className="w-[78px] h-[78px] rounded-[18px] flex items-center justify-center"
                          style={{
                            background: "linear-gradient(140deg, #ffffff 0%, #E9EDF5 100%)",
                            boxShadow: "0 10px 24px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.9)",
                          }}
                        >
                          <img src={b.logo} alt={b.name} className="object-contain max-h-[60px] max-w-[70px]" />
                        </div>
                      </div>
                      <span className="text-[12px] font-semibold text-center leading-tight" style={{ color: "rgba(255,255,255,0.75)" }}>{b.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Previous Collaborations */}
            <div>
              <div className="flex items-center gap-2.5 mb-3" style={{ height: 26 }}>
                <div className="w-[3px] h-[17px] rounded-[2px]" style={{ background: "#f26522" }} />
                <h2 className="text-[17px] font-bold text-white">Previous Collaborations</h2>
              </div>
              {PREVIOUS_BRANDS.map((group, gi) => (
                <div key={gi} className="rounded-3xl px-5 py-6 mb-4 last:mb-0" style={{ background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <h3 className="text-center text-base md:text-lg font-extrabold tracking-widest mb-5" style={{ color: "#fff", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    OTHERS BRAND COLLABORATION
                  </h3>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {group.map((name) => (
                      <span
                        key={name}
                        className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors hover:border-orange-500/50"
                        style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "rgba(255,255,255,0.85)" }}
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "insight" && (
          <InsightTab creatorId={creator.id} creatorName={creator.name} photoSrc={photoSrc ?? ""} igHandle={igMetric?.handle || handle} tiktokHandle={tiktokMetric?.handle || handle} />
        )}

        {tab === "posts" && (
          <div className="mx-6">
            <MonitorPostsTab />
          </div>
        )}

        {tab === "campaigns" && (
          <div className="mx-6">
            <CampaignMonitoringTab />
          </div>
        )}

        {tab === "rate" && (
          <div className="mx-6">
            <RateCard />
          </div>
        )}
      </div>
    </div>
  );
}


function fmtUpdated(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${date} | ${time}`;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const prev = useRef(0);

  useEffect(() => {
    const to = value;
    const from = prev.current;
    if (from === to) {
      setDisplay(to);
      return;
    }
    const startAt = performance.now() + 150;
    const dur = 1500;
    let raf: number;
    const tick = (t: number) => {
      const p = Math.min(1, Math.max(0, (t - startAt) / dur));
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.round(from + (to - from) * eased);
      setDisplay(v);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        prev.current = to;
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return (
    <span style={{ fontVariantNumeric: "tabular-nums" }}>
      {display > 0 ? formatFollowers(display) : "—"}
    </span>
  );
}

function SummaryCard({ title, handle, href, createdOn, updateLabel, gradient, logo, metricRows, updatedAt, refreshing, onUpdate }: {
  title: string;
  handle?: string;
  href: string;
  createdOn?: string;
  updateLabel: string;
  gradient: string;
  logo: React.ReactNode;
  metricRows: { label: string; value: number }[];
  updatedAt?: string;
  refreshing: boolean;
  onUpdate: () => void;
}) {
  const cardStyle = { background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" };
  const sep = "border-l border-white/10 pl-3";

  return (
    <div className="rounded-2xl overflow-hidden p-6 relative" style={cardStyle}>
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: title === "Instagram" ? "linear-gradient(135deg, rgba(131,58,180,0.2), rgba(253,29,29,0.2), rgba(247,119,55,0.2))" : "#000000", boxShadow: title === "TikTok" ? "0 0 20px rgba(37,244,238,0.15), 0 0 20px rgba(254,44,85,0.15)" : undefined }}>
            {logo}
          </div>
          <div className="min-w-0">
            <p className="text-base font-bold text-white">{title}</p>
            {href !== "" ? (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-xs block truncate hover:underline" style={{ color: "rgba(255,255,255,0.55)" }}>
                @{handle}
                {createdOn && (
                  <span className="normal-case"> · Accounts created on&nbsp;
                    <b style={{ color: "#FB923C", textShadow: "0 0 12px rgba(251,146,60,0.45)" }}>{createdOn}</b>
                  </span>
                )}
              </a>
            ) : (
              <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.55)" }}>
                @{handle}
                {createdOn && (
                  <span> · Accounts created on&nbsp;
                    <b style={{ color: "#FB923C", textShadow: "0 0 12px rgba(251,146,60,0.45)" }}>{createdOn}</b>
                  </span>
                )}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={onUpdate}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white transition-all hover:brightness-110 shrink-0"
          style={{ background: "var(--ch-primary)", boxShadow: "0 4px 12px rgba(37,99,235,0.3)" }}
        >
          {refreshing ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          Update data
        </button>
      </div>
      <div className="h-1 mb-5" style={{ background: gradient, boxShadow: "0 1px 10px rgba(225,48,108,0.35)" }} />
      <div className="flex items-center justify-between mb-4">
        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.55)" }}>
          {updateLabel}
        </p>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold"
          style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.35)" }}>
          <span className="relative flex w-1.5 h-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping" style={{ background: "#10B981" }} />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: "#10B981" }} />
          </span>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>Data updated on</span>
          <span style={{ color: "#6EE7B7" }}>{fmtUpdated(updatedAt)}</span>
        </span>
      </div>
      <div className="grid grid-cols-5 gap-0">
        {metricRows.map((s, i) => (
          <div key={s.label} className={i > 0 ? sep : "pr-3"} style={{ gridColumn: title === "Instagram" && metricRows.length === 3 ? "span 1" : undefined }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</p>
            <p className="text-lg font-extrabold text-white mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <AnimatedNumber value={s.value} />
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountPerformanceSummary({ creatorId, igMetric, tiktokMetric, onUpdated }: {
  creatorId: string;
  igMetric?: PlatformMetric;
  tiktokMetric?: PlatformMetric;
  onUpdated: () => void;
}) {
  const [refreshing, setRefreshing] = useState<string | null>(null);

  const update = async (platform: string) => {
    setRefreshing(platform);
    try {
      await creatorsApi.refreshMetrics(creatorId, platform);
      onUpdated();
    } catch {
      // keep old values; errors surface via unchanged data
    } finally {
      setRefreshing(null);
    }
  };

  return (
    <div className="mx-6 mt-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SummaryCard
          title="Instagram"
          handle={igMetric?.handle}
          href={igMetric?.handle ? `https://www.instagram.com/${igMetric.handle.replace(/^@/, "")}/` : ""}
          createdOn="30 Sep 2015"
          updateLabel="Account Performance Summary"
          gradient="linear-gradient(90deg, #FFDC80, #F77737, #FD1D1D, #C13584, #833AB4)"
          logo={<IgLogo className="w-8 h-8" />}
          metricRows={[
            { label: "Posts", value: igMetric?.posts ?? 0 },
            { label: "Followers", value: igMetric?.followers ?? 0 },
            { label: "Following", value: igMetric?.following ?? 0 },
          ]}
          updatedAt={igMetric?.updatedAt}
          refreshing={refreshing === "instagram"}
          onUpdate={() => update("instagram")}
        />
        <SummaryCard
          title="TikTok"
          handle={tiktokMetric?.handle}
          href={tiktokMetric?.handle ? `https://www.tiktok.com/@${tiktokMetric.handle.replace(/^@/, "")}` : ""}
          createdOn="12 Feb 2019"
          updateLabel="Account Performance Summary"
          gradient="linear-gradient(90deg, #25F4EE, #FE2C55, #25F4EE)"
          logo={<TiktokIcon className="w-6 h-6 text-white" />}
          metricRows={[
            { label: "Following", value: tiktokMetric?.following ?? 0 },
            { label: "Followers", value: tiktokMetric?.followers ?? 0 },
            { label: "Likes", value: tiktokMetric?.likes ?? 0 },
          ]}
          updatedAt={tiktokMetric?.updatedAt}
          refreshing={refreshing === "tiktok"}
          onUpdate={() => update("tiktok")}
        />
      </div>

      <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)" }}>
        <Info className="w-4 h-4 shrink-0" style={{ color: "#3B82F6" }} />
        <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}>
          Data ditampilkan per platform berdasarkan informasi yang tersedia. Periode data belum dicantumkan.
        </p>
      </div>
    </div>
  );
}

function Delta({ up, suffix }: { up: boolean; suffix: string }) {
  return (
    <span className="inline-flex items-center gap-0.5" style={{ color: up ? "#10B981" : "#EF4444" }}>
      <svg className="w-2 h-2" viewBox="0 0 12 12" fill="currentColor" style={{ transform: up ? undefined : "rotate(180deg)" }}>
        <path d="M6 2l4 5H2z" />
      </svg>
      {suffix}
    </span>
  );
}

function PanelCard({ title, tag, children }: { title: string; tag?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", boxShadow: "0 4px 24px rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center justify-between gap-2 mb-4">
        <p className="text-[12px] font-bold text-white">{title}</p>
        {tag}
      </div>
      {children}
    </div>
  );
}

const SUBMITTED_TAG = (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold whitespace-nowrap"
    style={{ background: "rgba(59,130,246,0.12)", border: "1px solid rgba(59,130,246,0.35)", color: "#93C5FD" }}>
    <Check className="w-2.5 h-2.5" /> Submitted by account owner
  </span>
);

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

function CalendarPicker({ range, onChange }: { range: [Date, Date]; onChange: (r: [Date, Date]) => void }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(new Date(range[0].getFullYear(), range[0].getMonth(), 1));
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const daysBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000) + 1;
  const [start, end] = range;
  const isInRange = (d: Date) => start && end && d.getTime() > start.getTime() && d.getTime() < end.getTime();

  const label = `${start.getDate()} ${MONTHS[start.getMonth()]} ${start.getFullYear()} – ${end.getDate()} ${MONTHS[end.getMonth()]} ${end.getFullYear()} • ${daysBetween(start, end)} days`;

  const grid: (Date | null)[] = [];
  const firstDay = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  for (let i = 0; i < firstDay; i++) grid.push(null);
  for (let d = 1; d <= daysInMonth; d++) grid.push(new Date(view.getFullYear(), view.getMonth(), d));

  const pick = (d: Date) => {
    if (selecting === "start") { onChange([d, d]); setSelecting("end"); return; }
    if (d.getTime() < range[0].getTime()) { onChange([d, range[0]]); setSelecting("end"); return; }
    onChange([range[0], d]); setSelecting("start"); setOpen(false);
  };

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors hover:bg-white/10"
        style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.75)" }}
      >
        <CalendarDays className="w-3 h-3" style={{ color: "#F97316" }} />
        {label}
      </button>

      {open && (
        <div className="absolute z-40 mt-2 left-0 w-[248px] rounded-xl p-3"
          style={{ background: "#0B1120", border: "1px solid rgba(255,255,255,0.12)", boxShadow: "0 16px 48px rgba(0,0,0,0.6)" }}>
          <div className="flex items-center justify-between mb-2">
            <button onClick={() => setView(new Date(view.getFullYear(), view.getMonth() - 1, 1))} className="p-1 rounded hover:bg-white/10">
              <ChevronLeft className="w-4 h-4" style={{ color: "rgba(255,255,255,0.8)" }} />
            </button>
            <p className="text-[12px] font-bold text-white">
              {MONTHS[view.getMonth()]} {view.getFullYear()}
            </p>
            <button onClick={() => setView(new Date(view.getFullYear(), view.getMonth() + 1, 1))} className="p-1 rounded hover:bg-white/10">
              <ChevronRight className="w-4 h-4" style={{ color: "rgba(255,255,255,0.8)" }} />
            </button>
          </div>
          <p className="text-[10px] mb-1.5 text-center" style={{ color: "rgba(255,255,255,0.45)" }}>
            {selecting === "start" ? "Select start date" : "Select end date"}
          </p>
          <div className="grid grid-cols-7 gap-y-0.5">
            {DAY_LABELS.map((d, i) => (
              <span key={i} className="text-center text-[9px] font-bold py-1" style={{ color: "rgba(255,255,255,0.35)" }}>{d}</span>
            ))}
            {grid.map((d, i) => {
              if (!d) return <span key={i} />;
              const isStart = d.getTime() === start.getTime();
              const isEnd = d.getTime() === end.getTime();
              const isEdges = isStart || isEnd;
              const sel = isEdges ? { background: "#F97316", color: "white" } : isInRange(d) ? { background: "rgba(249,115,22,0.2)", color: "white" } : undefined;
              return (
                <button
                  key={i}
                  onClick={() => pick(d)}
                  className="h-8 rounded-lg text-[11px] font-semibold transition-colors hover:bg-white/10"
                  style={sel ?? { color: "rgba(255,255,255,0.7)" }}
                >
                  {d.getDate()}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function InsightTab({ creatorId, creatorName, photoSrc, igHandle, tiktokHandle }: {
  creatorId: string; creatorName: string; photoSrc: string; igHandle: string; tiktokHandle: string;
}) {
  const panelBorder = { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" };
  const igBar = "linear-gradient(90deg, #F97316, #FB923C)";
  const ttBar = "linear-gradient(90deg, #22D3EE, #A78BFA)";
  const [igRange, setIgRange] = useState<[Date, Date]>([new Date(2026, 7, 18), new Date(2026, 8, 16)]);
  const [ttRange, setTtRange] = useState<[Date, Date]>([new Date(2026, 7, 19), new Date(2026, 8, 15)]);
  const [igAvatarUrl, setIgAvatarUrl] = useState<string | null>(null);
  const [ttAvatarUrl, setTtAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    creatorsApi.platformAvatar(creatorId, "instagram").then((r) => setIgAvatarUrl(r.photoUrl)).catch(() => {});
    creatorsApi.platformAvatar(creatorId, "tiktok").then((r) => setTtAvatarUrl(r.photoUrl)).catch(() => {});
  }, [creatorId]);

  return (
    <div className="mx-6 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold tracking-[0.25em]" style={{ color: "#F97316", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>CREATORHUB.ID</p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Creator Performance Overview
          </h2>
          <p className="text-[12px] mt-1" style={{ color: "rgba(255,255,255,0.55)" }}>
            {creatorName} • insight summary based on data available in screenshots
          </p>
        </div>
        <span className="inline-flex items-center px-4 py-2 rounded-lg text-[11px] font-bold text-cyan-300" style={{ border: "1px solid rgba(34,211,238,0.4)", background: "rgba(34,211,238,0.08)" }}>
          SOCIAL ANALYTICS
        </span>
      </div>

      {/* Platform rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { title: "Instagram", link: `instagram.com/${igHandle}`, href: `https://www.instagram.com/${igHandle.replace(/^@/, "")}`, logo: <IgLogo className="w-7 h-7" />, avatar: igAvatarUrl || photoSrc, range: igRange, onRange: setIgRange },
          { title: "TikTok", link: `tiktok.com/${tiktokHandle}`, href: `https://www.tiktok.com/${tiktokHandle.replace(/^@/, "")}`, logo: <TiktokIcon className="w-5 h-5 text-white" />, avatar: ttAvatarUrl || photoSrc, range: ttRange, onRange: setTtRange },
        ].map((p) => (
          <div key={p.title} className="rounded-2xl p-4 flex items-center gap-3" style={{ background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: p.title === "Instagram" ? "linear-gradient(135deg, rgba(253,29,29,0.25), rgba(131,58,180,0.25), rgba(247,119,55,0.25))" : "#000000" }}>
              {p.logo}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[15px] font-bold text-white">{p.title}</p>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-extrabold tracking-wider text-white" style={{ background: "#F97316" }}>INSIGHT</span>
              </div>
              <div className="mt-1">
                <CalendarPicker range={p.range} onChange={p.onRange} />
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-full overflow-hidden shrink-0" style={{ border: "2px solid #F97316" }}>
                {p.avatar ? <img src={p.avatar} alt={creatorName} className="w-full h-full object-cover" /> : null}
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-white truncate">@{p.title === "Instagram" ? igHandle : tiktokHandle}</p>
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="block text-[10px] truncate hover:underline" style={{ color: "rgba(255,255,255,0.45)" }}>
                  {p.link} <span style={{ color: "rgba(255,255,255,0.45)" }}>›</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Left — Instagram */}
        <div className="space-y-4">
          <PanelCard title="Overview" tag={SUBMITTED_TAG}>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4" style={{ background: "#1F2937" }}>
                <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>Impressions</p>
                <p className="text-2xl font-extrabold text-white mt-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>586.854</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>Accounts reached</p>
                <p className="text-2xl font-extrabold text-white mt-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  81.143 <Delta up={false} suffix="7.5%" />
                </p>
              </div>
            </div>
          </PanelCard>

          <PanelCard title="Impressions source">
            {[
              { label: "Followers", value: "63%", pct: 63, bg: igBar },
              { label: "Non-followers", value: "37%", pct: 37, bg: "linear-gradient(90deg, #D946EF, #F472B6)" },
            ].map((r) => (
              <div key={r.label} className="mb-3 last:mb-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.75)" }}>{r.label}</p>
                  <p className="text-[12px] font-bold text-white">{r.value}</p>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.bg }} />
                </div>
              </div>
            ))}
          </PanelCard>

          <PanelCard title="Impressions by content type">
            <div className="rounded-lg overflow-hidden" style={panelBorder}>
              <div className="grid grid-cols-2 px-3 py-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>Content type</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-right" style={{ color: "rgba(255,255,255,0.5)" }}>Contribution</p>
              </div>
              {[
                ["Stories", "79.4%"],
                ["Reels", "11.7%"],
                ["Posts", "8.9%"],
                ["Video / Live", "0.0%"],
              ].map(([k, v], i) => (
                <div key={k} className="grid grid-cols-2 px-3 py-2.5" style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                  <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.8)" }}>{k}</p>
                  <p className="text-[12px] font-bold text-white text-right">{v}</p>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="Popular content by impressions">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { v: "8.3K", d: "Aug 22" },
                { v: "8.2K", d: "Aug 30" },
                { v: "7.8K", d: "Aug 31" },
                { v: "7.7K", d: "Aug 26" },
              ].map((c) => (
                <div key={c.d} className="rounded-xl p-3 text-center" style={{ background: "#1F2937" }}>
                  <p className="text-[15px] font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{c.v}</p>
                  <p className="text-[10px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{c.d}</p>
                </div>
              ))}
            </div>
          </PanelCard>
        </div>

        {/* Right — TikTok */}
        <div className="space-y-4">
          <PanelCard title="Key metrics" tag={SUBMITTED_TAG}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { l: "Video views", v: "6.5M", d: <Delta up suffix="1.5" /> },
                { l: "Profile views", v: "28K", d: <Delta up suffix="2.7M" /> },
                { l: "Likes", v: "546K", d: <Delta up suffix="24K" /> },
                { l: "Comments", v: "964", d: <Delta up={false} suffix="38%" /> },
                { l: "Shares", v: "15K", d: <Delta up={false} suffix="31.1M" /> },
                { l: "Estimated reward", v: "$0.14", d: <Delta up={false} suffix="40.1M" />, dark: true },
              ].map((s) => (
                <div key={s.l} className="rounded-xl p-3" style={{ background: s.dark ? "#2A1215" : "rgba(255,255,255,0.04)" }}>
                  <p className="text-[9px] uppercase tracking-wider font-semibold" style={{ color: "rgba(255,255,255,0.5)" }}>{s.l}</p>
                  <p className="text-[17px] font-extrabold text-white mt-1 flex items-center gap-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {s.v} {s.d}
                  </p>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="Audience growth">
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "Total viewers", v: "4.8M", d: <Delta up suffix="6M" /> },
                { l: "New viewers", v: "1.8M", d: <Delta up suffix="6M" /> },
              ].map((s) => (
                <div key={s.l} className="rounded-xl p-4" style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.2)" }}>
                  <p className="text-[10px] font-semibold" style={{ color: "rgba(16,185,129,0.9)" }}>{s.l}</p>
                  <p className="text-2xl font-extrabold text-white mt-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {s.v} {s.d}
                  </p>
                </div>
              ))}
            </div>
          </PanelCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PanelCard title="Viewer age">
              {[
                { l: "18-24", v: "53.3%", pct: 53.3 },
                { l: "25-34", v: "36.8%", pct: 36.8 },
                { l: "35-44", v: "5.6%", pct: 5.6 },
                { l: "45-54", v: "1.9%", pct: 1.9 },
                { l: "55+", v: "2.6%", pct: 2.6 },
              ].map((r) => (
                <div key={r.l} className="flex items-center gap-3 mb-2.5 last:mb-0">
                  <span className="w-9 text-[11px] shrink-0" style={{ color: "rgba(255,255,255,0.65)" }}>{r.l}</span>
                  <div className="h-1.5 flex-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: ttBar }} />
                  </div>
                  <span className="w-12 text-right text-[11px] font-bold text-white shrink-0">{r.v}</span>
                </div>
              ))}
            </PanelCard>

            <PanelCard title="Gender">
              {[
                { l: "Male", v: "8%", c: "#3B82F6" },
                { l: "Female", v: "89%", c: "#F97316" },
                { l: "Other", v: "3%", c: "#FBBF24" },
              ].map((g) => (
                <div key={g.l} className="flex items-center gap-3 mb-3 last:mb-0">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: g.c }} />
                  <span className="flex-1 text-[12px]" style={{ color: "rgba(255,255,255,0.75)" }}>{g.l}</span>
                  <span className="text-[12px] font-bold text-white">{g.v}</span>
                </div>
              ))}
            </PanelCard>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <p className="text-center text-[10px] pt-1" style={{ color: "rgba(255,255,255,0.45)" }}>
        Source: Instagram Insights & TikTok Analytics {creatorName} • Data presented from screenshots
      </p>
    </div>
  );
}

const RATE_TIKTOK: { l: string; p: string }[] = [
  { l: "1 Video (Non-Visit) + Bonus 1 Instastory", p: "500K" },
  { l: "1 Video (Visit) + 1 Instastory", p: "800K" },
  { l: "1 Video (Non-Visit) + Reels Mirroring + 1 Instastory", p: "800K" },
  { l: "1 Video (Visit) + Reels Mirroring + 3 Instastory – Sony Max 3 Camera", p: "1.800K" },
  { l: "1 Video (Visit) + Reels Mirroring + 3 Instastory – HP", p: "1.200K" },
];

const RATE_INSTAGRAM: { l: string; p: string }[] = [
  { l: "Paid Promote (per Slide)", p: "150K" },
  { l: "Review Product (Max 1 menit + Editing) - Instastory", p: "300K" },
  { l: "Reels (Non-Visit) + Instagram Story", p: "400K" },
  { l: "Reels (Visit) + Instastory", p: "650K" },
  { l: "Reels (Visit) + Instagram Story – Sony Max 3 Camera", p: "1.000K" },
];

const BRAND_AMBASSADOR: { t: string; s?: string }[] = [
  { t: "Exclusevie Tiktok Video", s: "(3 Video with Sony Max III Camera)" },
  { t: "Non Exclusive Tiktok Video", s: "(3 Video)" },
  { t: "30 Instastory" },
  { t: "12 Short Reels", s: "(Up To 30 sec)" },
  { t: "Free Product/Studio Phoshoot" },
  { t: "6 Instagram Feeds Post" },
];

const TERMS: string[] = [
  "Full Payment H-3",
  "Untuk review/produk yang dikirimkan (diusahakan good condition)",
  "Review bersifat jujur",
  "Produk yang akan di kirimkan harus di kirim h-5 sbeelum proses shoot endorsee produk",
  "wajib mengirim brief & knowledge produk",
  "Revisi max 1 kali",
  "Tambahan biaya apabila tempat visit jauh",
];

function RateCard() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl p-6 md:p-8" style={{ background: "#F4EBDD", border: "1px solid #DDCBA8" }}>
        <h3 className="text-center text-xl md:text-2xl font-extrabold tracking-wide mb-7" style={{ color: "#1E2735", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          PRICELIST
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr_0.9fr] gap-5 items-start">
          {/* TikTok */}
          <div className="rounded-2xl p-5" style={{ background: "#131B2E", boxShadow: "0 10px 30px rgba(30,39,53,0.2)" }}>
            <div className="flex items-center gap-2.5 mb-4">
              <p className="text-lg font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tiktok</p>
              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold" style={{ background: "#F4EBDD", color: "#1E2735" }}>266K Followers</span>
            </div>
            <div className="space-y-2.5">
              {RATE_TIKTOK.map((r) => (
                <div key={r.l} className="flex items-center justify-between gap-3">
                  <p className="text-[12px] leading-snug" style={{ color: "#E8EDF5" }}>{r.l}</p>
                  <span className="px-2 py-0.5 rounded-[6px] text-[11px] font-extrabold whitespace-nowrap shrink-0" style={{ background: "#F4EBDD", color: "#1E2735" }}>{r.p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Instagram */}
          <div className="rounded-2xl p-5" style={{ background: "#131B2E", boxShadow: "0 10px 30px rgba(30,39,53,0.2)" }}>
            <div className="flex items-center gap-2.5 mb-4">
              <p className="text-lg font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Instagram</p>
              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold" style={{ background: "#F4EBDD", color: "#1E2735" }}>26K Followers</span>
            </div>
            <div className="space-y-2.5">
              {RATE_INSTAGRAM.map((r) => (
                <div key={r.l} className="flex items-center justify-between gap-3">
                  <p className="text-[12px] leading-snug" style={{ color: "#E8EDF5" }}>{r.l}</p>
                  <span className="px-2 py-0.5 rounded-[6px] text-[11px] font-extrabold whitespace-nowrap shrink-0" style={{ background: "#F4EBDD", color: "#1E2735" }}>{r.p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Brand Ambassador */}
          <div className="rounded-2xl p-5" style={{ background: "#131B2E", boxShadow: "0 10px 30px rgba(30,39,53,0.2)" }}>
            <p className="text-lg font-extrabold text-white mt-1 mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Brand Ambassador</p>
            <span className="inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-extrabold mb-5" style={{ background: "#F4EBDD", color: "#1E2735" }}>
              15.000K /3Months
            </span>
            <ul className="space-y-3">
              {BRAND_AMBASSADOR.map((b) => (
                <li key={b.t} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: "#F4EBDD" }} />
                  <div>
                    <p className="text-[13px] font-bold leading-snug" style={{ color: "#fff" }}>{b.t}</p>
                    {b.s && <p className="text-[11px] leading-snug" style={{ color: "rgba(255,255,255,0.55)" }}>{b.s}</p>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Term & Condition */}
      <div className="rounded-3xl p-6 md:p-8" style={{ background: "#F4EBDD", border: "1px solid #DDCBA8" }}>
        <h3 className="text-center text-xl md:text-2xl font-extrabold tracking-widest mb-6" style={{ color: "#1E2735", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          TERM & CONDITION
        </h3>
        <ul className="max-w-2xl mx-auto space-y-2.5">
          {TERMS.map((t) => (
            <li key={t} className="flex items-start gap-2.5">
              <span className="mt-1.5 text-[14px] shrink-0" style={{ color: "#1E2735" }}>•</span>
              <p className="text-[13.5px] font-semibold leading-snug" style={{ color: "#1E2735" }}>{t}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function TagIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" /><line x1="7" y1="7" x2="7.01" y2="7" /></svg>;
}
function PinIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
function GlobeIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>;
}
function StarIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}
