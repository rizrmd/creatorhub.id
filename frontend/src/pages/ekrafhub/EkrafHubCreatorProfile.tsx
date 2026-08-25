import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft, CheckCircle, Circle, Clock, Send, Bookmark, User, Eye, CreditCard, BarChart3 } from "lucide-react";
import { useCreator } from "@/hooks/useCreators";
import { formatFollowers, resolveCreatorPhoto } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

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

type TabKey = "profile" | "insight" | "posts" | "rate";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Profile", icon: <User className="w-3.5 h-3.5" /> },
  { key: "insight", label: "Insight", icon: <BarChart3 className="w-3.5 h-3.5" /> },
  { key: "posts", label: "Monitor Posts", icon: <Eye className="w-3.5 h-3.5" /> },
  { key: "rate", label: "Rate Card", icon: <CreditCard className="w-3.5 h-3.5" /> },
];

export default function EkrafHubCreatorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: creator, isLoading, error } = useCreator(id ?? "");
  const [tab, setTab] = useState<TabKey>("profile");

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
                <Send className="w-4 h-4" /> Hubungi Kreator
              </button>
              <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[13px] font-bold transition-colors hover:bg-white/5"
                style={{ border: "1px solid rgba(255,255,255,0.2)", color: "rgba(255,255,255,0.85)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <Bookmark className="w-4 h-4" /> Simpan Profil
              </button>
            </div>
          </div>
        </div>
      </div>
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
                    {creator.bio || "Bio kreator belum tersedia."}
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

        {tab === "insight" && (
          <InsightTab creatorName={creator.name} photoSrc={photoSrc ?? ""} igHandle={igMetric?.handle || handle} tiktokHandle={tiktokMetric?.handle || handle} />
        )}

        {tab === "posts" && (
          <div className="mx-6">
            <MonitorPosts handle={igMetric?.handle || (creator.platforms.includes("instagram") ? handle : "")} />
          </div>
        )}

        {tab === "rate" && (
          <div className="mx-6">
            <RateCard creator={creator} />
          </div>
        )}
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

function PanelCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl p-5" style={{ background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", boxShadow: "0 4px 24px rgba(0,0,0,0.35)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <p className="text-[12px] font-bold text-white mb-4">{title}</p>
      {children}
    </div>
  );
}

function InsightTab({ creatorName, photoSrc, igHandle, tiktokHandle }: {
  creatorName: string; photoSrc: string; igHandle: string; tiktokHandle: string;
}) {
  const panelBorder = { border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)" };
  const igBar = "linear-gradient(90deg, #F97316, #FB923C)";
  const ttBar = "linear-gradient(90deg, #22D3EE, #A78BFA)";

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
            {creatorName} • ringkasan insight berdasarkan data yang tersedia pada screenshot
          </p>
        </div>
        <span className="inline-flex items-center px-4 py-2 rounded-lg text-[11px] font-bold text-cyan-300" style={{ border: "1px solid rgba(34,211,238,0.4)", background: "rgba(34,211,238,0.08)" }}>
          SOCIAL ANALYTICS
        </span>
      </div>

      {/* Platform rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {[
          { title: "Instagram", sub: "18 Agu–16 Sep • 30 hari terakhir", link: `instagram.com/${igHandle}`, href: `https://www.instagram.com/${igHandle.replace(/^@/, "")}`, logo: <IgLogo className="w-7 h-7" />, avatar: photoSrc },
          { title: "TikTok", sub: "19 Agu–15 Sep • 28 hari terakhir", link: `tiktok.com/${tiktokHandle}`, href: `https://www.tiktok.com/${tiktokHandle.replace(/^@/, "")}`, logo: <TiktokIcon className="w-5 h-5 text-white" />, avatar: photoSrc },
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
              <p className="text-[11px] mt-0.5" style={{ color: "rgba(255,255,255,0.5)" }}>{p.sub}</p>
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
          <PanelCard title="Ringkasan utama">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4" style={{ background: "#1F2937" }}>
                <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>Tayangan</p>
                <p className="text-2xl font-extrabold text-white mt-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>586.854</p>
              </div>
              <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)" }}>
                <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "rgba(255,255,255,0.55)" }}>Akun yang dijangkau</p>
                <p className="text-2xl font-extrabold text-white mt-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  81.143 <Delta up={false} suffix="7.5%" />
                </p>
              </div>
            </div>
          </PanelCard>

          <PanelCard title="Sumber tayangan">
            {[
              { label: "Pengikut", value: "63%", pct: 63, bg: igBar },
              { label: "Bukan pengikut", value: "37%", pct: 37, bg: "linear-gradient(90deg, #D946EF, #F472B6)" },
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

          <PanelCard title="Tayangan berdasarkan jenis konten">
            <div className="rounded-lg overflow-hidden" style={panelBorder}>
              <div className="grid grid-cols-2 px-3 py-2" style={{ background: "rgba(255,255,255,0.05)" }}>
                <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.5)" }}>Jenis Konten</p>
                <p className="text-[9px] font-bold uppercase tracking-wider text-right" style={{ color: "rgba(255,255,255,0.5)" }}>Kontribusi</p>
              </div>
              {[
                ["Cerita", "79.4%"],
                ["Reel", "11.7%"],
                ["Postingan", "8.9%"],
                ["Video / Siaran langsung", "0.0%"],
              ].map(([k, v], i) => (
                <div key={k} className="grid grid-cols-2 px-3 py-2.5" style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.06)" : undefined }}>
                  <p className="text-[12px]" style={{ color: "rgba(255,255,255,0.8)" }}>{k}</p>
                  <p className="text-[12px] font-bold text-white text-right">{v}</p>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard title="Konten populer berdasarkan tayangan">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { v: "8,3 rb", d: "22 Agu" },
                { v: "8,2 rb", d: "30 Agu" },
                { v: "7,8 rb", d: "31 Agu" },
                { v: "7,7 rb", d: "26 Agu" },
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
          <PanelCard title="Metrik utama">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {[
                { l: "Tayangan postingan", v: "6,5 jt", d: <Delta up suffix="1.5" /> },
                { l: "Tampilan profil", v: "28 rb", d: <Delta up suffix="2.7 jt" /> },
                { l: "Suka", v: "546 rb", d: <Delta up suffix="24 rb" /> },
                { l: "Komentar", v: "964", d: <Delta up={false} suffix="38%" /> },
                { l: "Bagikan", v: "15 rb", d: <Delta up={false} suffix="31.1 jt" /> },
                { l: "Perkiraan reward", v: "$0.14", d: <Delta up={false} suffix="40.1 jt" />, dark: true },
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

          <PanelCard title="Pertumbuhan penonton">
            <div className="grid grid-cols-2 gap-3">
              {[
                { l: "Total penonton", v: "4,8 jt", d: <Delta up suffix="6 jt" /> },
                { l: "Penonton baru", v: "1,8 jt", d: <Delta up suffix="6 jt" /> },
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
            <PanelCard title="Usia penonton">
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
                { l: "Pria", v: "8%", c: "#3B82F6" },
                { l: "Perempuan", v: "89%", c: "#F97316" },
                { l: "Lainnya", v: "3%", c: "#FBBF24" },
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
        Sumber: Instagram Insight & TikTok Analytics {creatorName} • Data disajikan dari tampilan yang terlihat pada screenshot
      </p>
    </div>
  );
}

function MonitorPosts({ handle }: { handle: string }) {
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") || "" : "";
  const [posts, setPosts] = useState<any[] | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (!handle) { setPosts([]); setLoaded(true); return; }
    fetch(`/api/v1/instagram-posts?account=${encodeURIComponent(handle)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => {
        if (r.status === 403) { setForbidden(true); setLoaded(true); return null; }
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      })
      .then((data) => setPosts(Array.isArray(data) ? data : data?.posts ?? []))
      .catch(() => { setLoaded(true); });
  }, [handle, token]);

  if (!loaded) {
    return (
      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>Memuat posts...</p>
      </div>
    );
  }

  if (forbidden) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <Eye className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.35)" }} />
        <p className="text-sm font-bold text-white">Monitoring posts belum diaktifkan</p>
        <p className="text-[11px] mt-1.5 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
          Fitur monitor posts tersedia untuk akun admin / media monitoring. Hubungi admin untuk mengaktifkan aksesnya.
        </p>
      </div>
    );
  }

  if ((posts ?? []).length === 0) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <Eye className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.35)" }} />
        <p className="text-sm font-bold text-white">Belum ada data monitoring</p>
        <p className="text-[11px] mt-1.5 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
          {handle ? `Posts untuk @${handle} belum tersedia di monitoring. Coba scrape akun ini terlebih dahulu.` : "Handle Instagram belum terdeteksi untuk kreator ini."}
        </p>
      </div>
    );
  }

  const grid = posts!;
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {grid.slice(0, 15).map((p, i) => (
        <div key={i} className="aspect-[4/5] rounded-xl overflow-hidden relative" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
          <img src={p.mediaUrl || p.displayUrl || p.thumbnail} alt="Post" className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = "none"; }} />
          {p.likes > 0 && (
            <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-[10px] font-bold text-white">
              â™¥ {formatFollowers(Number(p.likes))}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

function RateCard({ creator }: { creator: { name: string; price: number; priceText: string; engagementRate: number; followers: number } }) {
  const base = creator.price || 0;
  const fmt = (n: number) => {
    if (n <= 0) return "â€”";
    return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(Math.round(n))
      .replace(/\sRp/g, "").replace(/Rp(\d)/, "Rp $1");
  };
  const items = [
    { label: "IG Feed / Promo", price: base, note: "satu postingan feed" },
    { label: "IG Reel", price: base * 1.3, note: "reel pendek + story" },
    { label: "TikTok Video", price: base * 0.85, note: "satu konten video" },
    { label: "Paket Kampanye (3 konten)", price: base * 2.5, note: "feed x1 + reel x1 + tiktok x1" },
  ];

  return (
    <div className="rounded-2xl p-6" style={{ background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="flex items-center gap-2 mb-5">
        <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #F97316, #EA580C)", boxShadow: "0 0 10px rgba(249,115,22,0.5)" }} />
        <h3 className="text-sm font-bold text-white">Rate Card â€” {creator.name}</h3>
      </div>

      <div className="flex items-center justify-between rounded-xl px-4 py-3 mb-5" style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>Base Rate (Rp)</p>
          <p className="text-2xl font-extrabold" style={{ color: "#F97316", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {base > 0 ? fmt(base) : creator.priceText || "Hubungi kreator"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "rgba(255,255,255,0.6)" }}>Followers</p>
          <p className="text-lg font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{formatFollowers(creator.followers || 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div>
              <p className="text-[13px] font-bold text-white">{it.label}</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>{it.note}</p>
            </div>
            <p className="text-[15px] font-extrabold" style={{ color: "white", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {base > 0 ? fmt(it.price) : "â€”"}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[10px] mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>
        {base > 0 ? "Estimasi berdasarkan base rate; hubungi kreator untuk harga final per paket." : "Rate belum dikonfigurasi. Hubungi kreator untuk penawaran."}
        {creator.engagementRate > 0 ? ` ER: ${creator.engagementRate}%` : ""}
      </p>
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
