import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapPin, ArrowLeft, Info, CheckCircle, Circle, Clock, Send, Bookmark, User, BarChart3, Eye, CreditCard } from "lucide-react";
import { useCreator } from "@/hooks/useCreators";
import { formatFollowers, resolveCreatorPhoto } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46v-7.2a8.16 8.16 0 005.58 2.19V11.2a4.83 4.83 0 01-3.77-1.7V2h3.77z"/>
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
  const tiktokFollowers = tiktokMetric?.followers ?? 0;
  const igFollowers = igMetric?.followers ?? 0;
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
      {/* Breadcrumb + Back */}
      <div className="flex items-center justify-between px-6 py-3 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/dashboard/ekrafhub/marketplace")} className="hover:text-white transition-colors" style={{ color: "#F97316" }}>Marketplace</button>
          <span>/</span>
          <span style={{ color: "rgba(255,255,255,0.6)" }}>Profile</span>
        </div>
        <button
          onClick={() => navigate("/dashboard/ekrafhub/marketplace")}
          className="profile-back-btn inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-bold text-white transition-all hover:brightness-110"
          style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Kembali
        </button>
      </div>

      {/* Creator Profile Card */}
      <div className="mx-6 rounded-3xl overflow-hidden" style={{ background: "linear-gradient(180deg, #0d1420 0%, #080d16 100%)", boxShadow: shadow3d, border: "1px solid rgba(255,255,255,0.08)" }}>
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
            <p className="text-[11px] font-bold uppercase tracking-widest mb-1.5" style={{ color: "#F97316", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Creator Profile</p>
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
            <p className="text-[13px] mt-3 leading-snug max-w-xl line-clamp-2" style={{ color: "rgba(255,255,255,0.75)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {creator.bio || "Content Creator & Social Media Influencer"}
            </p>
            <p className="text-[13px]" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>@{handle}</p>

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

      {/* Tab bar */}
      <div className="mx-6 mt-4 flex items-center gap-2 overflow-x-auto">
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-[12px] font-bold transition-all whitespace-nowrap ${active ? "text-white" : ""}`}
              style={active
                ? { background: "linear-gradient(135deg, #F97316, #EA580C)", boxShadow: "0 8px 20px rgba(249,115,22,0.3)", fontFamily: "'Plus Jakarta Sans', sans-serif" }
                : { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.65)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {t.icon} {t.label}
            </button>
          );
        })}
        <div className="flex-1" />
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {tab === "profile" && (
          <div className="mx-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tentang Kreator */}
            <div className="rounded-2xl p-5" style={panel}>
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #F97316, #EA580C)", boxShadow: "0 0 10px rgba(249,115,22,0.5)" }} />
                <h3 className="text-sm font-bold text-white">Tentang Kreator</h3>
              </div>

              <div className="flex items-start gap-3 mb-5">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <svg className="w-5 h-5" style={{ color: "rgba(255,255,255,0.35)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: "#F97316" }}>About Me</p>
                  <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                    {creator.bio || "Hai, kenalin aku Ainul Mardhiah Lubis, tapi cukup panggil Banuun aja biar lebih akrab! Aku lahir tahun 1997 dan tinggal di Banda Aceh. Sejak tahun 2015, aku aktif berbagi konten di Instagram & TikTok dengan nama @itsbanuun."}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <svg className="w-5 h-5" style={{ color: "rgba(255,255,255,0.35)" }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ color: "#F97316" }}>Background</p>
                  <p className="text-[11px] mt-1.5 leading-relaxed" style={{ color: "rgba(255,255,255,0.85)" }}>
                    Sejak kecil aku sudah punya passion besar di dunia kuliner. Dari hobi makan, akhirnya berkembang menjadi perjalanan karier sebagai Food Content Creator & Vlogger di berbagai platform sosial media. Di setiap konten, aku selalu membawa energi positif dengan tagline khas: <span className="font-bold" style={{ color: "#F97316" }}>"MARI KITA RIPHIUUU!"</span>
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
                  { icon: <PinIcon />, label: "Lokasi", value: creator.city || "Banda Aceh" },
                  { icon: <CalendarIcon />, label: "Aktif Sejak", value: "2015" },
                  { icon: <GlobeIcon />, label: "Platform", value: creator.platforms.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" & ") },
                  { icon: <StarIcon />, label: "Tagline", value: "MARI KITA RIPHIUUU!", highlight: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(255,255,255,0.06)" }}>
                      <span style={{ color: "rgba(255,255,255,0.35)" }}>{item.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>{item.label}</p>
                      <p className={`text-[13px] font-semibold mt-0.5 ${item.highlight ? "uppercase" : ""}`} style={{ color: item.highlight ? "#F97316" : "rgba(255,255,255,0.8)" }}>
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Kesiapan Data */}
            <div className="rounded-2xl p-5" style={panel}>
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
          <div className="mx-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Instagram Card */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", boxShadow: shadow3d, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="h-1" style={{ background: "linear-gradient(90deg, #FFDC80, #F77737, #FD1D1D, #C13584, #833AB4)", boxShadow: "0 1px 10px rgba(225,48,108,0.35)" }} />
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(131,58,180,0.2), rgba(253,29,29,0.2), rgba(247,119,55,0.2))" }}>
                      <IgLogo className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-white">Instagram</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>@{igMetric?.handle || handle}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Followers", value: igFollowers > 0 ? formatFollowers(igFollowers) : "Belum dihitung", muted: igFollowers <= 0 },
                      { label: "Following", value: "—" },
                      { label: "Likes / Post", value: "Data tidak tersedia", muted: true },
                      { label: "Engagement Rate", value: "Belum dihitung", muted: true },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</p>
                        <p className={`text-lg font-extrabold mt-1 ${s.muted ? "text-xs font-semibold" : ""}`}
                          style={{ color: s.muted ? "rgba(255,255,255,0.4)" : "white", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* TikTok Card */}
              <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", boxShadow: shadow3d, border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="h-1" style={{ background: "linear-gradient(90deg, #25F4EE, #FE2C55, #25F4EE)", boxShadow: "0 1px 10px rgba(254,44,85,0.35)" }} />
                <div className="p-6 relative">
                  <div className="absolute top-3 right-6 w-1 h-1 rounded-full bg-white/30 animate-pulse" />
                  <div className="absolute top-6 right-10 w-0.5 h-0.5 rounded-full bg-white/20 animate-pulse" style={{ animationDelay: "0.5s" }} />
                  <div className="absolute bottom-8 right-4 w-0.5 h-0.5 rounded-full bg-[#25F4EE]/30 animate-pulse" style={{ animationDelay: "1s" }} />

                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center relative" style={{ background: "#000000", boxShadow: "0 0 20px rgba(37,244,238,0.15), 0 0 20px rgba(254,44,85,0.15)" }}>
                      <TiktokIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-base font-bold text-white">TikTok</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>@{tiktokMetric?.handle || handle}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Followers", value: tiktokFollowers > 0 ? formatFollowers(tiktokFollowers) : "Belum dihitung", muted: tiktokFollowers <= 0 },
                      { label: "Likes", value: "—" },
                      { label: "Reach / Views", value: "Data tidak tersedia", muted: true },
                      { label: "Video Count", value: "—", muted: true },
                    ].map((s) => (
                      <div key={s.label}>
                        <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</p>
                        <p className={`text-lg font-extrabold mt-1 ${s.muted ? "text-xs font-semibold" : ""}`}
                          style={{ color: s.muted ? "rgba(255,255,255,0.4)" : "white", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                          {s.value}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 rounded-xl" style={{ background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.1)" }}>
              <Info className="w-4 h-4 shrink-0" style={{ color: "#3B82F6" }} />
              <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.45)" }}>
                Data ditampilkan per platform berdasarkan informasi yang tersedia. Periode data belum dicantumkan.
              </p>
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

function MonitorPosts({ handle }: { handle: string }) {
  const token = typeof localStorage !== "undefined" ? localStorage.getItem("auth_token") || "" : "";
  const [posts, setPosts] = useState<any[] | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!handle) { setPosts([]); setLoaded(true); return; }
    fetch(`/api/v1/instagram-posts?account=${encodeURIComponent(handle)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    })
      .then((r) => r.ok ? r.json() : Promise.reject(new Error(String(r.status))))
      .then((data) => setPosts(Array.isArray(data) ? data : data.posts ?? []))
      .catch(() => { setError(true); setLoaded(true); });
  }, [handle, token]);

  if (!loaded) {
    return (
      <div className="rounded-2xl p-5" style={{ background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <p className="text-sm text-white/60">Memuat posts...</p>
      </div>
    );
  }

  if (error || (posts ?? []).length === 0) {
    return (
      <div className="rounded-2xl p-8 text-center" style={{ background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <Eye className="w-8 h-8 mx-auto mb-3" style={{ color: "rgba(255,255,255,0.25)" }} />
        <p className="text-sm font-bold text-white">Belum ada data monitoring</p>
        <p className="text-[11px] mt-1.5 max-w-md mx-auto" style={{ color: "rgba(255,255,255,0.45)" }}>
          {handle ? `Posts untuk @${handle} belum tersedia di monitoring. Tab ini otomatis menampilkan hasil monitor posts platform.` : "Handle Instagram belum terdeteksi untuk kreator ini."}
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
              ♥ {formatFollowers(Number(p.likes))}
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
    if (n <= 0) return "—";
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
        <h3 className="text-sm font-bold text-white">Rate Card — {creator.name}</h3>
      </div>

      <div className="flex items-center justify-between rounded-xl px-4 py-3 mb-5" style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)" }}>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>Base Rate (Rp)</p>
          <p className="text-2xl font-extrabold" style={{ color: "#F97316", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {base > 0 ? fmt(base) : creator.priceText || "Hubungi kreator"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>Followers</p>
          <p className="text-lg font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{formatFollowers(creator.followers || 0)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div>
              <p className="text-[13px] font-bold text-white">{it.label}</p>
              <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>{it.note}</p>
            </div>
            <p className="text-[15px] font-extrabold" style={{ color: "white", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {base > 0 ? fmt(it.price) : "—"}
            </p>
          </div>
        ))}
      </div>

      <p className="text-[10px] mt-4" style={{ color: "rgba(255,255,255,0.35)" }}>
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
function CalendarIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
}
function GlobeIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" /></svg>;
}
function StarIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}
