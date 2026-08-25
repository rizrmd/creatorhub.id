import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Star, CheckCircle, Award, RefreshCw,
  Heart, MessageSquare, Instagram, Youtube, Play, ArrowLeft,
  Plane, Laptop, Utensils, Palette, Shirt, Gamepad2, Baby, Dumbbell, Music,
} from "lucide-react";
import { useCreator } from "@/hooks/useCreators";
import { formatFollowers, formatRupiah, resolveCreatorPhoto } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import NetworkGraph from "@/components/NetworkGraph";
import EkrafHubCreatorProfile from "@/pages/ekrafhub/EkrafHubCreatorProfile";

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

function platformIcon(p: string) {
  if (p === "instagram") return <Instagram className="w-4 h-4" />;
  if (p === "tiktok") return <TiktokIcon className="w-4 h-4" />;
  if (p === "youtube") return <Youtube className="w-4 h-4" />;
  if (p === "x") return <XIcon className="w-4 h-4" />;
  return <span className="text-[10px] font-bold uppercase">{p.slice(0, 2)}</span>;
}

function categoryIcon(cat: string) {
  const c = cat.toLowerCase();
  if (c.includes("travel") || c.includes("lifestyle")) return <Plane className="w-5 h-5" />;
  if (c.includes("entertainment") || c.includes("comedy")) return <Music className="w-5 h-5" />;
  if (c.includes("beauty") || c.includes("fashion")) return <Palette className="w-5 h-5" />;
  if (c.includes("tech") || c.includes("technology")) return <Laptop className="w-5 h-5" />;
  if (c.includes("food") || c.includes("culinary")) return <Utensils className="w-5 h-5" />;
  if (c.includes("gaming")) return <Gamepad2 className="w-5 h-5" />;
  if (c.includes("family") || c.includes("parenting")) return <Baby className="w-5 h-5" />;
  if (c.includes("sport") || c.includes("health")) return <Dumbbell className="w-5 h-5" />;
  if (c.includes("fashion")) return <Shirt className="w-5 h-5" />;
  return <Plane className="w-5 h-5" />;
}

function categoryLabel(cat: string) {
  const map: Record<string, string> = {
    lifestyle: "Lifestyle & Travel",
    entertainment: "Entertainment",
    beauty: "Beauty & Fashion",
    tech: "Technology",
    food: "Food & Beverages",
    gaming: "Gaming",
    family: "Family & Parenting",
    sports: "Health & Sport",
    comedy: "Comedy",
    education: "Education",
  };
  const c = cat.toLowerCase();
  for (const [key, val] of Object.entries(map)) {
    if (c.includes(key)) return val;
  }
  return cat || "Lifestyle";
}

const MOCK_IMAGES = [
  "https://picsum.photos/seed/c1/300/300",
  "https://picsum.photos/seed/c2/300/300",
  "https://picsum.photos/seed/c3/300/300",
  "https://picsum.photos/seed/c4/300/300",
];

const MOCK_VIDEOS = [
  "https://picsum.photos/seed/v1/300/400",
  "https://picsum.photos/seed/v2/300/400",
  "https://picsum.photos/seed/v3/300/400",
  "https://picsum.photos/seed/v4/300/400",
  "https://picsum.photos/seed/v5/300/400",
  "https://picsum.photos/seed/v6/300/400",
];

const MOCK_REVIEWS = [
  { brand: "GlowUp Skincare", campaign: "Ramadan Glow 2026", rating: 5, date: "15/03/2026", initial: "G", color: "#DBEAFE" },
  { brand: "FreshFac3", campaign: "Weekly Challenge - Mirror Selfie", rating: 5, date: "19/12/2025", initial: "F", color: "#DCFCE7" },
  { brand: "FreshFac3", campaign: "Weekly Challenge - You with the Nature", rating: 5, date: "19/12/2025", initial: "F", color: "#DCFCE7" },
  { brand: "FreshFac3", campaign: "Weekly Challenge - Sport Session", rating: 5, date: "19/12/2025", initial: "F", color: "#DCFCE7" },
  { brand: "Angel Residence", campaign: "Komentar pada Postingan Instagram", rating: 5, date: "04/10/2025", initial: "AR", color: "#FEF3C7" },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className="w-4 h-4"
          style={{
            fill: i < Math.round(rating) ? "#F59E0B" : "transparent",
            color: i < Math.round(rating) ? "#F59E0B" : "#D1D5DB",
          }}
        />
      ))}
    </div>
  );
}

export default function CreatorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: creator, isLoading, error } = useCreator(id ?? "");
  const [activePlatform, setActivePlatform] = useState<string>("instagram");
  const [favorited, setFavorited] = useState(false);
  const [showNetwork, setShowNetwork] = useState(false);

  // EkrafHub marketplace: all creators get the new profile
  if (id) {
    return <EkrafHubCreatorProfile />;
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-80 w-full rounded-2xl" />
        <div className="grid grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="p-4 md:p-8 text-center">
        <p className="text-lg font-semibold" style={{ color: "var(--ch-text)" }}>Creator not found</p>
        <Button variant="outline" className="mt-4" onClick={() => navigate("/dashboard/marketplace")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Marketplace
        </Button>
      </div>
    );
  }

  const following = Math.round(creator.followers * 0.04);
  const posts = Math.round(creator.followers * 0.018);
  const avgEngagement = Math.round(creator.followers * creator.engagementRate / 100 * 0.8);
  const avgLikes = Math.round(creator.followers * creator.engagementRate / 100 * 0.5);
  const avgComments = Math.round(creator.followers * creator.engagementRate / 100 * 0.15);
  const avgReelView = Math.round(creator.followers * 2.3);
  const viewRate = Math.min(99, Math.round(creator.engagementRate * 12));
  const selectedPlatform = creator.platforms.includes(activePlatform) ? activePlatform : creator.platforms[0];
  const selectedPlatformMetric = creator.platformMetrics?.find((metric) => metric.platform === selectedPlatform);
  const selectedHandle = selectedPlatformMetric?.handle ?? creator.handle;

  const photoSrc = resolveCreatorPhoto(creator.img, creator.imageUrl);

  return (
    <div className="pb-8">
      {/* Back button */}
      <div className="px-4 md:px-8 pt-4">
        <button
          onClick={() => navigate("/dashboard/marketplace")}
          className="flex items-center gap-2 text-sm font-semibold hover:underline"
          style={{ color: "var(--ch-primary)" }}
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Marketplace
        </button>
      </div>

      {/* Hero Section */}
      <div className="px-4 md:px-8 pt-4">
        <div className="rounded-2xl overflow-hidden p-6 md:p-8" style={{ background: "linear-gradient(135deg, #0F172A, #1E293B)" }}>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Photo */}
            <div className="shrink-0">
              <div className="w-[180px] h-[320px] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-lg shadow-black/30">
                {photoSrc ? (
                  <img src={photoSrc} alt={creator.name} className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.display = "none"; }} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold" style={{ background: "#334155", color: "#94A3B8" }}>
                    {creator.name[0]}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {/* Name + platform tabs row */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <h1 className="text-xl font-extrabold text-white truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {creator.name}
                  </h1>
                  {creator.starCreator && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0" style={{ background: "#FCD34D", color: "#92400E" }}>
                      <Award className="w-2.5 h-2.5" /> Star
                    </span>
                  )}
                  {creator.verified && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0" style={{ background: "#3B82F6", color: "white" }}>
                      <CheckCircle className="w-2.5 h-2.5" /> Verified
                    </span>
                  )}
                  <span
                    onClick={() => setShowNetwork(!showNetwork)}
                    className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 cursor-pointer hover:brightness-110 transition-all ${showNetwork ? "ring-2 ring-white/30" : ""}`}
                    style={{ background: "#F97316", color: "white" }}
                  >
                    Social Network Analysis
                  </span>
                </div>
                <div className="flex gap-1 shrink-0 sm:ml-auto">
                  {creator.platforms.map((p) => (
                    <button
                      key={p}
                      onClick={() => setActivePlatform(p)}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition-colors ${
                        selectedPlatform === p
                          ? "bg-white text-slate-900"
                          : "text-white/50 hover:text-white/80 hover:bg-white/10"
                      }`}
                    >
                      {platformIcon(p)} {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Handle + location */}
              <p className="text-xs text-white/40 mt-1">
                {selectedHandle && <span>@{selectedHandle} · </span>}
                📍 {creator.city}{creator.country ? `, ${creator.country}` : ", Indonesia"}
              </p>

              {/* Divider */}
              <div className="h-px my-3" style={{ background: "rgba(255,255,255,0.08)" }} />

              {/* Short bio */}
              <p className="text-sm text-white/70 leading-relaxed line-clamp-2">
                {creator.bio || `Content creator ${creator.category} dari ${creator.city}. Tersedia untuk kolaborasi brand campaign dan sponsored content.`}
              </p>

              {/* Divider */}
              <div className="h-px my-3" style={{ background: "rgba(255,255,255,0.08)" }} />

              {/* Inline stats + badges */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]">
                <span className="text-white font-semibold">{formatFollowers(creator.followers)} Followers</span>
                <span className="text-white/50">·</span>
                <span className="text-white/60">{formatFollowers(following)} Following</span>
                <span className="text-white/50">·</span>
                <span className="text-white/60">{formatFollowers(posts)} Posts</span>
                <span className="text-white/50">·</span>
                <span className="text-white/60">{creator.engagementRate}% ER</span>
                <span className="text-white/50">·</span>
                <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                  <Star className="w-3 h-3" fill="#FBBF24" /> {creator.rating}/5
                </span>
                {creator.category.split(",").slice(0, 2).map((cat) => (
                  <span key={cat} className="px-2 py-0.5 rounded text-[10px] font-semibold capitalize" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
                    {cat.trim()}
                  </span>
                ))}
              </div>

              {/* Creator Performance (inside hero) */}
              <div className="h-px my-4" style={{ background: "rgba(255,255,255,0.08)" }} />
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/30 mb-3">Creator Performance</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { label: "Avg. Engagement", value: formatFollowers(avgEngagement) },
                  { label: "Avg. Likes", value: formatFollowers(avgLikes) },
                  { label: "Avg. Comments", value: formatFollowers(avgComments) },
                  { label: "Avg. Reel View", value: formatFollowers(avgReelView) },
                  { label: "View Rate", value: `${viewRate}%` },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg p-3 text-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                    <p className="text-[10px] font-semibold text-white/40">{s.label}</p>
                    <p className="text-base font-extrabold text-white mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between mt-7">
                <p className="text-[10px] text-white/30">Last updated: 2 jam yang lalu</p>
                <button className="flex items-center gap-1.5 text-[11px] font-bold px-4 py-1.5 rounded-lg transition-colors hover:brightness-110 text-white" style={{ background: "var(--ch-primary)" }}>
                  <RefreshCw className="w-3 h-3" /> Update Data
                </button>
              </div>

              {/* Service & Kategori */}
              <div className="h-px my-5" style={{ background: "rgba(255,255,255,0.08)" }} />
              <div className="grid grid-cols-2 gap-6">
                {/* Service */}
                <div>
                  <h3 className="text-base font-bold text-white mb-3">Service</h3>
                  <div className="flex flex-wrap items-center gap-4">
                    {creator.platforms.map((p) => (
                      <div key={p} className="flex items-center gap-1.5">
                        <span className="shrink-0 text-white">
                          {platformIcon(p)}
                        </span>
                        <span className="text-sm font-semibold capitalize text-white">{p}</span>
                        <span className="text-xs text-white/50">Service</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kategori */}
                <div className="flex flex-col items-center md:items-start">
                  <h3 className="text-base font-bold text-white mb-3">Kategori</h3>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 text-white">
                      {categoryIcon(creator.category)}
                    </div>
                    <span className="text-sm font-medium text-center text-white">
                      {categoryLabel(creator.category)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Network Analysis */}
      {showNetwork && (
        <div className="px-4 md:px-8 mt-8">
          <h2 className="text-base font-bold mb-3" style={{ color: "var(--ch-text)" }}>Social Network Analysis</h2>
          <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <NetworkGraph creator={creator} />
          </div>
        </div>
      )}

      {/* Section 2: Profil Followers */}
      <div className="px-4 md:px-8 mt-8">
        <h2 className="text-base font-bold mb-3" style={{ color: "var(--ch-text)" }}>Profil Followers</h2>
        <div className="rounded-2xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Jenis Kelamin */}
            <div>
              <p className="text-sm font-bold mb-4" style={{ color: "var(--ch-text)" }}>Jenis Kelamin</p>
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#BFDBFE" strokeWidth="4" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="4"
                      strokeDasharray="38 62" strokeDashoffset="0" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs" style={{ color: "var(--ch-text-muted)" }}>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Pria (38%)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-200 inline-block" /> Wanita (62%)</span>
              </div>
            </div>

            {/* Rentang Usia */}
            <div>
              <p className="text-sm font-bold mb-4" style={{ color: "var(--ch-text)" }}>Rentang Usia</p>
              <div className="flex items-end justify-between gap-1.5 h-40 px-2">
                {[
                  { label: "13-17", pct: 8 },
                  { label: "18-24", pct: 32 },
                  { label: "25-34", pct: 38 },
                  { label: "35-44", pct: 14 },
                  { label: "45-54", pct: 5 },
                  { label: "55-64", pct: 2 },
                  { label: "65+", pct: 1 },
                ].map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full rounded-t" style={{ height: `${b.pct * 1.1}px`, background: "#BFDBFE" }} />
                    <span className="text-[9px]" style={{ color: "var(--ch-text-muted)" }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Location */}
            <div>
              <p className="text-sm font-bold mb-4" style={{ color: "var(--ch-text)" }}>Top Location</p>
              <div className="space-y-2.5">
                {[
                  { city: creator.city || "Jakarta", pct: 36, color: "#3B82F6" },
                  { city: "Surabaya", pct: 16, color: "#60A5FA" },
                  { city: "Jakarta", pct: 12, color: "#F97316" },
                  { city: "Bandung", pct: 10, color: "#22C55E" },
                  { city: "Bali", pct: 7, color: "#FACC15" },
                ].map((l, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span style={{ color: "var(--ch-text-muted)" }}>{l.city}</span>
                      <span className="font-semibold" style={{ color: "var(--ch-text)" }}>{l.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--ch-bg)" }}>
                      <div className="h-full rounded-full" style={{ width: `${l.pct * 2.5}%`, background: l.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Konten Influencer */}
      <div className="px-4 md:px-8 mt-8">
        <h2 className="text-base font-bold mb-3" style={{ color: "var(--ch-text)" }}>Konten Influencer</h2>
        <div className="rounded-2xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <p className="text-sm font-bold mb-3" style={{ color: "var(--ch-text)" }}>Image Post</p>
          <div className="flex gap-3 overflow-x-auto pb-3 mb-5">
            {MOCK_IMAGES.map((src, i) => (
              <div key={i} className="w-36 h-36 rounded-xl overflow-hidden shrink-0">
                <img src={src} alt={`Post ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />
              </div>
            ))}
          </div>

          <p className="text-sm font-bold mb-3" style={{ color: "var(--ch-text)" }}>Video Post</p>
          <div className="flex gap-3 overflow-x-auto pb-3">
            {MOCK_VIDEOS.map((src, i) => (
              <div key={i} className="w-36 h-48 rounded-xl overflow-hidden shrink-0 relative group cursor-pointer">
                <img src={src} alt={`Video ${i + 1}`} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <Play className="w-5 h-5 text-black ml-0.5" fill="black" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Rate Card */}
      <div className="px-4 md:px-8 mt-8">
        <h2 className="text-base font-bold mb-3" style={{ color: "var(--ch-text)" }}>Rate Card</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border p-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Instagram className="w-4 h-4 text-pink-500" />
              <p className="text-sm font-bold" style={{ color: "var(--ch-text)" }}>Instagram</p>
            </div>
            {[
              { type: "Image Post", price: creator.price, available: true },
              { type: "Video Post", price: Math.round(creator.price * 1.25), available: true },
              { type: "Story Post", price: Math.round(creator.price * 0.75), available: true },
            ].map((r) => (
              <div key={r.type} className="flex justify-between items-center py-2 border-t" style={{ borderColor: "var(--ch-border)" }}>
                <span className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>{r.type}</span>
                <span className="text-[13px] font-bold" style={{ color: "var(--ch-primary)" }}>
                  {r.available ? formatRupiah(r.price) : "Belum Tersedia"}
                </span>
              </div>
            ))}
          </div>

          <div className="rounded-xl border p-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <div className="flex items-center gap-2 mb-3">
              <TiktokIcon className="w-4 h-4 text-black" />
              <p className="text-sm font-bold" style={{ color: "var(--ch-text)" }}>TikTok</p>
            </div>
            <div className="flex justify-between items-center py-2 border-t" style={{ borderColor: "var(--ch-border)" }}>
              <span className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>Video Post</span>
              <span className="text-[13px] font-bold" style={{ color: "var(--ch-primary)" }}>{formatRupiah(Math.round(creator.price * 3.5))}</span>
            </div>
          </div>

          <div className="rounded-xl border p-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <div className="flex items-center gap-2 mb-3">
              <Youtube className="w-4 h-4 text-red-500" />
              <p className="text-sm font-bold" style={{ color: "var(--ch-text)" }}>YouTube</p>
            </div>
            <div className="flex justify-between items-center py-2 border-t" style={{ borderColor: "var(--ch-border)" }}>
              <span className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>Video Post</span>
              <span className="text-[13px] font-bold" style={{ color: "var(--ch-text-soft)" }}>Belum Tersedia</span>
            </div>
          </div>

          <div className="rounded-xl border p-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <div className="flex items-center gap-2 mb-3">
              <XIcon className="w-4 h-4" />
              <p className="text-sm font-bold" style={{ color: "var(--ch-text)" }}>X</p>
            </div>
            <div className="flex justify-between items-center py-2 border-t" style={{ borderColor: "var(--ch-border)" }}>
              <span className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>Thread Post</span>
              <span className="text-[13px] font-bold" style={{ color: "var(--ch-text-soft)" }}>Belum Tersedia</span>
            </div>
          </div>
        </div>
      </div>

      {/* Section 5: Penilaian dan Ulasan */}
      <div className="px-4 md:px-8 mt-8">
        <h2 className="text-base font-bold mb-3" style={{ color: "var(--ch-text)" }}>Penilaian dan Ulasan</h2>
        <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          {MOCK_REVIEWS.map((r, i) => (
            <div key={i} className="flex items-start gap-3 px-4 py-3.5 border-b last:border-b-0" style={{ borderColor: "var(--ch-border)" }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: r.color, color: "var(--ch-text)" }}>
                {r.initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{r.brand}</p>
                  <span className="text-[11px] shrink-0" style={{ color: "var(--ch-text-muted)" }}>{r.date}</span>
                </div>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{r.campaign}</p>
                <div className="mt-1">
                  <Stars rating={r.rating} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating action buttons */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 z-40">
        <Button
          variant="outline"
          size="lg"
          className="gap-2 rounded-full shadow-lg"
          onClick={() => navigate("/dashboard/messages")}
        >
          <MessageSquare className="w-4 h-4" /> Chat
        </Button>
        <Button
          size="lg"
          className="gap-2 rounded-full shadow-lg"
          onClick={() => setFavorited(!favorited)}
        >
          <Heart className="w-4 h-4" fill={favorited ? "white" : "none"} />
          {favorited ? "Favorited" : "Favorite"}
        </Button>
      </div>
    </div>
  );
}
