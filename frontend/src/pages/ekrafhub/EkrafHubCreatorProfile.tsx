import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { MapPin, ArrowLeft, Info, CheckCircle, Circle, Clock, Send, Bookmark, User, Eye, CreditCard, RefreshCw, Loader2 } from "lucide-react";
import { useCreator } from "@/hooks/useCreators";
import { creatorsApi } from "@/lib/api";
import { formatFollowers, resolveCreatorPhoto } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
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

type TabKey = "profile" | "posts" | "rate";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Profile", icon: <User className="w-3.5 h-3.5" /> },
  { key: "posts", label: "Monitor Posts", icon: <Eye className="w-3.5 h-3.5" /> },
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

      {/* Creator Profile Card */}
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

            {/* Bio + handle */}
            <p className="text-[13px] mt-3 leading-snug max-w-2xl" style={{ color: "rgba(255,255,255,0.8)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {creator.bio || "Sejak kecil aku sudah punya passion besar di dunia kuliner. Dari hobi makan, akhirnya berkembang menjadi perjalanan karier sebagai Food Content Creator & Vlogger di berbagai platform sosial media. Di setiap konten, aku selalu membawa energi positif dengan tagline khas: \"MARI KITA RIPHIUUU!\""}
            </p>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>@{handle}</p>

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

      {/* Account Performance Summary â€” under profile card */}
      <AccountPerformanceSummary
        creatorId={creator.id}
        igMetric={igMetric}
        tiktokMetric={tiktokMetric}
        onUpdated={() => {
          queryClient.invalidateQueries({ queryKey: ["creator", id ?? ""] });
          queryClient.invalidateQueries({ queryKey: ["creators"] });
        }}
      />

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

function fmtUpdated(iso?: string): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "—";
  const date = d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const time = d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
  return `${date} | ${time}`;
}

function SummaryCard({ title, handle, href, updateLabel, gradient, logo, metricRows, updatedAt, refreshing, onUpdate }: {
  title: string;
  handle?: string;
  href: string;
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
              </a>
            ) : (
              <p className="text-xs truncate" style={{ color: "rgba(255,255,255,0.55)" }}>@{handle}</p>
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
        <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.55)" }}>Data updated on {fmtUpdated(updatedAt)}</p>
      </div>
      <div className="grid grid-cols-5 gap-0">
        {metricRows.map((s, i) => (
          <div key={s.label} className={i > 0 ? sep : "pr-3"} style={{ gridColumn: title === "Instagram" && metricRows.length === 3 ? "span 1" : undefined }}>
            <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</p>
            <p className="text-lg font-extrabold text-white mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {s.value > 0 ? formatFollowers(s.value) : "—"}
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
