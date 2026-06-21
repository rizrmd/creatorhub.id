import { useState, useRef, useEffect } from "react";
import {
  Search, SlidersHorizontal, Star, CheckCircle, Zap, Award,
  Instagram, Youtube, Users, Megaphone, TrendingUp, Wallet,
  LayoutGrid, List, RotateCcw, X, Flame, MessageSquare, MapPin,
  Heart, ArrowUpRight, User, Video, Building2, Globe2,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCreators, useMarketplaceStats } from "@/hooks/useCreators";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useCreateCampaign } from "@/hooks/useCampaigns";
import type { Creator, CreatorListParams } from "@/types";
import { formatRupiah, formatFollowers } from "@/lib/utils";

function formatBudget(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(0)}jt`;
  if (n >= 1_000) return `Rp ${(n / 1_000).toFixed(0)}rb`;
  return `Rp ${n}`;
}

const CATEGORIES = ["lifestyle", "travel", "beauty", "tech", "food", "sports"];
const CITIES = ["Jakarta", "Bandung", "Surabaya", "Bali", "Yogyakarta", "Medan", "Makassar"];
const PLATFORMS = ["instagram", "tiktok", "youtube", "facebook", "x", "linkedin"];

const FOLLOWERS_OPTIONS = [
  { label: "All", value: "all" },
  { label: "< 300K", value: "0-300000" },
  { label: "300K – 500K", value: "300000-500000" },
  { label: "500K – 700K", value: "500000-700000" },
  { label: "700K+", value: "700000-0" },
];

const ENGAGEMENT_OPTIONS = [
  { label: "All", value: "all" },
  { label: "< 3%", value: "0-3" },
  { label: "3% – 4%", value: "3-4" },
  { label: "4% – 5%", value: "4-5" },
  { label: "5%+", value: "5-0" },
];

const PRICE_OPTIONS = [
  { label: "All", value: "all" },
  { label: "< $500", value: "0-7000000" },
  { label: "$500 – $700", value: "7000000-10000000" },
  { label: "$700 – $900", value: "10000000-13000000" },
  { label: "$900+", value: "13000000-0" },
];

const CATEGORY_COLORS: Record<string, string> = {
  lifestyle: "bg-purple-500/20 text-purple-300",
  travel: "bg-blue-500/20 text-blue-300",
  beauty: "bg-pink-500/20 text-pink-300",
  tech: "bg-slate-500/20 text-slate-300",
  food: "bg-orange-500/20 text-orange-300",
  sports: "bg-green-500/20 text-green-300",
};

const platformIcon = (p: string) => {
  if (p === "instagram") return <Instagram className="w-3 h-3" />;
  if (p === "youtube") return <Youtube className="w-3 h-3" />;
  if (p === "tiktok") return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46v-7.2a8.16 8.16 0 005.58 2.19V11.2a4.83 4.83 0 01-3.77-1.7V2h3.77z"/>
    </svg>
  );
  if (p === "facebook") return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
  if (p === "x") return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  );
  if (p === "linkedin") return (
    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
  return <span className="text-[8px] font-bold uppercase">{p.slice(0, 2)}</span>;
};

function AnimatedNumber({ value, loading }: { value: string; loading: boolean }) {
  const [display, setDisplay] = useState("0");
  const numericPart = value.replace(/[^0-9.,]/g, "");
  const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
  const suffix = value.match(/[^0-9.,]*$/)?.[0] ?? "";

  useEffect(() => {
    if (loading || !numericPart) { setDisplay("0"); return; }
    const raw = numericPart.replace(/[.,]/g, "");
    const target = parseInt(raw, 10);
    if (isNaN(target)) { setDisplay(numericPart); return; }
    const duration = 1200;
    const startTime = performance.now();
    let raf: number;
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.round(target * eased);
      setDisplay(current.toLocaleString("id-ID"));
      if (progress < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [numericPart, loading]);

  return (
    <span className="whitespace-nowrap">
      {prefix && <span className="text-[11px] font-bold opacity-60">{prefix}</span>}
      {loading ? "–" : display}{suffix}
    </span>
  );
}

const STAT_CONFIGS = [
  { label: "Total Creators", key: "totalCreators", icon: Users, color: "#3B82F6", glow: "rgba(59,130,246,.15)", gradient: "linear-gradient(135deg,#3B82F6,#6366F1)", trend: "+18.6%" },
  { label: "Active Campaigns", key: "activeCampaigns", icon: Megaphone, color: "#F97316", glow: "rgba(249,115,22,.15)", gradient: "linear-gradient(135deg,#F97316,#EF4444)", trend: "+12.4%" },
  { label: "Avg. Engagement", key: "avgEngagementRate", icon: TrendingUp, color: "#10B981", glow: "rgba(16,185,129,.15)", gradient: "linear-gradient(135deg,#10B981,#06B6D4)", trend: "+0.6%" },
  { label: "Budget Dikelola", key: "totalBudget", icon: Wallet, color: "#F59E0B", glow: "rgba(245,158,11,.15)", gradient: "linear-gradient(135deg,#F59E0B,#F97316)", trend: "+24.7%" },
] as const;

function StatCard({ config, value, loading }: {
  config: typeof STAT_CONFIGS[number]; value: string; loading: boolean;
}) {
  const Icon = config.icon;
  return (
    <div
      className="group relative rounded-xl border px-2.5 py-2 flex items-center gap-2 cursor-default transition-all duration-200 hover:scale-[1.02]"
      style={{
        background: "rgba(255,255,255,.05)",
        backdropFilter: "blur(12px)",
        borderColor: "rgba(255,255,255,.08)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,.05)",
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-shadow duration-200 group-hover:shadow-md"
        style={{ background: config.gradient, boxShadow: `0 3px 10px ${config.glow}` }}
      >
        <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <p className="text-[9px] font-semibold uppercase tracking-wider leading-none mb-0.5" style={{ color: "var(--ch-text-muted)" }}>{config.label}</p>
        <p className="text-[15px] font-extrabold leading-none tracking-tight"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          <AnimatedNumber value={value} loading={loading} />
        </p>
      </div>
      <div className="flex items-center gap-px shrink-0">
        <ArrowUpRight className="w-2.5 h-2.5" style={{ color: config.color }} />
        <span className="text-[9px] font-bold" style={{ color: config.color }}>{config.trend}</span>
      </div>
    </div>
  );
}

function CreatorCard({ creator, selected, favorited, onToggle, onCardClick, onFavorite, listView }: {
  creator: Creator; selected: boolean; favorited: boolean;
  onToggle: () => void; onCardClick: () => void; onFavorite: () => void; listView: boolean;
}) {
  const catColor = CATEGORY_COLORS[creator.category] ?? "bg-white/10 text-slate-300";

  if (listView) {
    return (
      <div
        className="cursor-pointer transition-all rounded-[14px] border"
        style={{
          background: "var(--ch-surface)",
          borderColor: selected ? "var(--ch-primary)" : "var(--ch-border)",
          boxShadow: selected ? "0 0 0 3px rgba(37,99,235,.15)" : "var(--ch-shadow-sm)",
        }}
        onClick={onCardClick}
      >
        <div className="p-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 relative flex items-center justify-center font-semibold text-[14px]"
              style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
              {creator.imageUrl && (
                <img src={creator.imageUrl} alt={creator.name} className="w-full h-full object-cover absolute inset-0"
                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
              )}
              {creator.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[13px] font-semibold truncate" style={{ color: "var(--ch-text)" }}>{creator.name}</p>
                {creator.verified && <CheckCircle style={{ width: 13, height: 13, color: "#2563EB", flexShrink: 0 }} />}
              </div>
              <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
                <MapPin style={{ width: 11, height: 11 }} />{creator.city}
                <span className={`px-1.5 py-0 rounded-full text-[10px] font-medium capitalize ${catColor}`}>{creator.category}</span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              {creator.platforms.map((p) => (
                <span key={p} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-white/5 text-slate-300 border border-white/5">
                  {platformIcon(p)} <span className="capitalize">{p}</span>
                </span>
              ))}
            </div>
            <div className="hidden sm:flex items-center gap-4 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
              <span className="font-semibold">{creator.followersText}</span>
              <span className="font-semibold">{creator.engagementRate}% ER</span>
              <span className="font-bold whitespace-nowrap" style={{ color: "var(--ch-text)" }}>
                Starts from {creator.priceText}
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onFavorite(); }}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors shrink-0"
            >
              <Heart style={{ width: 14, height: 14, color: favorited ? "#EF4444" : "#94A3B8", fill: favorited ? "#EF4444" : "none" }} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onToggle(); }}
              className="px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all shrink-0"
              style={selected ? {
                background: "var(--ch-primary)", color: "white",
              } : {
                background: "var(--ch-primary-50)", color: "var(--ch-primary)",
                border: "1.5px solid var(--ch-primary-100)",
              }}
            >
              {selected ? "✓ Invited" : "Invite to Project"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const photoSrc = creator.img ? `/creators/${creator.img.split("/").pop()}` : creator.imageUrl;
  const gradientBg = `hsl(${creator.hue ?? 220}, 60%, 85%)`;

  return (
    <div
      className={`rounded-[14px] overflow-hidden border transition-all cursor-pointer`}
      style={{
        background: "var(--ch-surface)",
        borderColor: selected ? "var(--ch-primary)" : "var(--ch-border)",
        boxShadow: selected ? "0 0 0 2px var(--ch-primary)" : "var(--ch-shadow-sm)",
        transform: "translateY(0)",
        transition: "transform .15s, box-shadow .15s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--ch-shadow-md)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = selected ? "0 0 0 2px var(--ch-primary)" : "var(--ch-shadow-sm)"; }}
      onClick={onCardClick}
    >
      {/* Photo header — 220px */}
      <div className="relative w-full overflow-hidden" style={{ height: 220, background: gradientBg }}>
        {photoSrc && (
          <img
            src={photoSrc}
            alt={creator.name}
            className="w-full h-full object-cover"
            style={{ objectPosition: creator.focus ?? "50% 25%" }}
            onError={(e) => { e.currentTarget.style.display = "none"; }}
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center text-5xl font-bold text-white/40 pointer-events-none select-none">
          {!photoSrc && creator.name[0]}
        </div>

        {/* Verified chip — top-left */}
        {creator.verified && (
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow"
            style={{ background: "var(--ch-primary)" }}>
            <CheckCircle style={{ width: 10, height: 10 }} /> Verified
          </div>
        )}

        {/* Star creator badge */}
        {creator.starCreator && (
          <div className="absolute top-2.5 left-2.5 mt-5 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full shadow"
            style={{ background: "#FCD34D", color: "#92400E", marginTop: creator.verified ? "24px" : "0" }}>
            ⭐ Star Creator
          </div>
        )}

        {/* Heart — top-right */}
        <button
          onClick={(e) => { e.stopPropagation(); onFavorite(); }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/30 backdrop-blur-sm flex items-center justify-center transition-colors hover:scale-110"
          style={{ boxShadow: "var(--ch-shadow-sm)" }}
        >
          <Heart style={{ width: 14, height: 14, color: favorited ? "#EF4444" : "#94A3B8", fill: favorited ? "#EF4444" : "none" }} />
        </button>

        {/* Selected overlay */}
        {selected && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ background: "rgba(37,99,235,.2)" }}>
            <CheckCircle style={{ width: 32, height: 32, color: "var(--ch-primary)", filter: "drop-shadow(0 0 4px white)" }} />
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-3.5">
        {/* Name + city + category */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <p className="font-bold text-[14px] truncate leading-tight" style={{ color: "var(--ch-text)" }}>{creator.name}</p>
            <p className="text-[12px] flex items-center gap-1 mt-0.5" style={{ color: "var(--ch-text-muted)" }}>
              <MapPin style={{ width: 11, height: 11 }} />
              {creator.city}
            </p>
          </div>
          <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${catColor}`}>
            {creator.category}
          </span>
        </div>

        {/* Platform metrics — mini cards */}
        {creator.platformMetrics && creator.platformMetrics.length > 0 && (
          <div className="mt-2 space-y-1">
            {creator.platformMetrics.map((pm) => {
              const platformColor = pm.platform === "instagram" ? "#EC4899"
                : pm.platform === "youtube" ? "#EF4444"
                : pm.platform === "facebook" ? "#3B82F6"
                : pm.platform === "linkedin" ? "#60A5FA"
                : pm.platform === "x" ? "#94A3B8"
                : "#E2E8F0";
              return (
                <div key={pm.platform} className="flex items-center gap-2 rounded-md px-2 py-1.5" style={{ background: "rgba(255,255,255,.03)", borderLeft: `3px solid ${platformColor}` }}>
                  <span className="w-3.5 h-3.5 flex items-center justify-center text-slate-400 shrink-0">
                    {platformIcon(pm.platform)}
                  </span>
                  <span className="text-[10px] font-semibold capitalize shrink-0" style={{ color: "var(--ch-text)" }}>{pm.platform}</span>
                  <span className="ml-auto text-[10px] font-bold" style={{ color: "var(--ch-text)" }}>{formatFollowers(pm.followers)}</span>
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded-full shrink-0" style={{ background: `${platformColor}15`, color: platformColor }}>
                    {pm.engagementRate}% ER
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Price */}
        <div className="mt-2 text-[11px]" style={{ color: "var(--ch-text-soft)" }}>
          Starts from <span className="font-semibold" style={{ color: "var(--ch-text)" }}>{creator.priceText}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between mt-2.5">
          <button
            onClick={(e) => { e.stopPropagation(); onCardClick(); }}
            className="text-[11px] font-semibold hover:underline"
            style={{ color: "var(--ch-primary)" }}
          >
            Full Profile
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onToggle(); }}
            className="px-3.5 py-1.5 rounded-lg text-[12px] font-bold transition-all"
            style={selected ? {
              background: "var(--ch-primary)", color: "white", border: "none",
            } : {
              background: "var(--ch-primary-50)", color: "var(--ch-primary)",
              border: "1.5px solid var(--ch-primary-100)",
            }}
          >
            {selected ? "✓ Invited" : "Invite to Project"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreatorProfileModal({ creator, selected, favorited, onToggle, onClose, onChat, onFavorite }: {
  creator: Creator; selected: boolean; favorited: boolean;
  onToggle: () => void; onClose: () => void; onChat: () => void; onFavorite: () => void;
}) {
  const catColor = CATEGORY_COLORS[creator.category] ?? "bg-white/10 text-slate-300";

  const platformSplit = (creator.platformMetrics && creator.platformMetrics.length > 0)
    ? creator.platformMetrics
    : creator.platforms.map((p) => ({ platform: p, followers: 0, engagementRate: 0 }));

  const collaborationCount = Math.max(1, Math.round(creator.rating * 8) - 12);
  const responseTimeLabel = creator.fastResponse ? "< 2 jam" : "< 24 jam";
  const avgLikes = formatFollowers(Math.round(creator.followers * creator.engagementRate / 100 * 0.8));
  const avgComments = formatFollowers(Math.round(creator.followers * creator.engagementRate / 100 * 0.15));
  const avgViews = formatFollowers(Math.round(creator.followers * 2.3));

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90dvh] overflow-hidden flex flex-col p-0 bg-[#111827]">
        {/* Header Section */}
        <div className="p-4 sm:p-6 border-b bg-[#111827]" style={{ borderColor: "var(--ch-border)" }}>
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2" style={{ borderColor: "var(--ch-border)", background: "var(--ch-primary-50)" }}>
              {creator.imageUrl ? (
                <img src={creator.imageUrl} alt={creator.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl font-bold" style={{ color: "var(--ch-primary)" }}>
                  {creator.name[0]}
                </div>
              )}
            </div>

            {/* Creator Info */}
            <div className="flex-1 min-w-0">
              {/* Name + Badges */}
              <div className="flex items-start gap-2 mb-2">
                <h2 className="text-xl font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {creator.name}
                </h2>
                {creator.verified && (
                  <CheckCircle style={{ width: 20, height: 20, color: "#2563EB", flexShrink: 0, marginTop: 2 }} />
                )}
                {creator.topRated && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shrink-0"
                    style={{ background: "var(--ch-orange-50)", color: "var(--ch-orange)" }}>
                    <Award style={{ width: 12, height: 12 }} /> Top Rated
                  </span>
                )}
                {creator.fastResponse && (
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold shrink-0"
                    style={{ background: "#DCFCE7", color: "#16A34A" }}>
                    <Zap style={{ width: 12, height: 12 }} /> Fast Response
                  </span>
                )}
              </div>

              {/* Location + Category */}
              <p className="text-sm mb-3" style={{ color: "var(--ch-text-muted)" }}>
                <span className="flex items-center gap-1">
                  <MapPin style={{ width: 14, height: 14 }} />
                  {creator.city}, Indonesia
                </span>
                <span className="mx-2">·</span>
                <span className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${catColor}`}>
                  {creator.category}
                </span>
              </p>

              {/* Quick Stats */}
              <div className="flex items-center gap-4 text-xs" style={{ color: "var(--ch-text-muted)" }}>
                <span className="flex items-center gap-1">
                  <MessageSquare style={{ width: 14, height: 14 }} />
                  <span>Respons {responseTimeLabel}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Megaphone style={{ width: 14, height: 14 }} />
                  <span>{collaborationCount}+ kolaborasi</span>
                </span>
              </div>
            </div>

            {/* Favorite Button */}
            <button
              onClick={onFavorite}
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110 bg-white/10"
            >
              <Heart style={{ width: 20, height: 20, color: favorited ? "#EF4444" : "#94A3B8", fill: favorited ? "#EF4444" : "none" }} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0B1120]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio Section */}
              {creator.bio && (
                <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                  <h3 className="text-sm font-bold mb-2" style={{ color: "var(--ch-text)" }}>About Creator</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{creator.bio}</p>
                </div>
              )}

              {/* Platform Breakdown */}
              <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--ch-text)" }}>Platform & Audience</h3>
                <div className="space-y-2">
                  {platformSplit.map((pm) => (
                    <div
                      key={pm.platform}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border
                        ${pm.platform === "instagram" ? "border-pink-500/30 bg-pink-500/10" :
                          pm.platform === "tiktok" ? "border-white/10 bg-white/5" :
                          pm.platform === "youtube" ? "border-red-500/30 bg-red-500/10" :
                          pm.platform === "facebook" ? "border-blue-500/30 bg-blue-500/10" :
                          pm.platform === "x" ? "border-white/10 bg-white/5" :
                          "border-blue-500/30 bg-blue-500/10"}`}
                    >
                      <span className={`flex items-center gap-2 text-sm font-semibold
                        ${pm.platform === "tiktok" ? "text-white" :
                          pm.platform === "x" ? "text-white" :
                          pm.platform === "instagram" ? "text-pink-300" :
                          pm.platform === "youtube" ? "text-red-300" :
                          pm.platform === "facebook" ? "text-blue-300" :
                          "text-blue-300"}`}>
                        {platformIcon(pm.platform)}
                        <span className="capitalize">{pm.platform}</span>
                      </span>
                      <div className="text-right">
                        <span className={`text-sm font-bold block ${pm.platform === "tiktok" || pm.platform === "x" ? "text-white" : "text-slate-200"}`}>
                          {formatFollowers(pm.followers)} followers
                        </span>
                        <span className="text-xs" style={{ color: "var(--ch-text-muted)" }}>
                          {pm.engagementRate}% ER
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audience Demographics */}
              <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--ch-text)" }}>Audience Demographics</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg" style={{ background: "var(--ch-bg)" }}>
                    <p className="text-xs mb-1" style={{ color: "var(--ch-text-muted)" }}>Rentang Usia</p>
                    <p className="text-base font-bold" style={{ color: "var(--ch-text)" }}>18–34 tahun</p>
                    <p className="text-xs mt-1" style={{ color: "var(--ch-text-soft)" }}>74% dari total audiens</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: "var(--ch-bg)" }}>
                    <p className="text-xs mb-1" style={{ color: "var(--ch-text-muted)" }}>Gender</p>
                    <p className="text-base font-bold" style={{ color: "var(--ch-text)" }}>62% Wanita</p>
                    <div className="flex h-2 rounded-full overflow-hidden mt-2">
                      <div className="bg-pink-400" style={{ width: "62%" }} />
                      <div className="bg-blue-400 flex-1" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Stats & Pricing */}
            <div className="space-y-4">
              {/* Key Metrics */}
              <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <h3 className="text-sm font-bold" style={{ color: "var(--ch-text)" }}>Metrik Utama</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: "var(--ch-text-muted)" }}>Total Followers</span>
                    <span className="text-sm font-bold" style={{ color: "var(--ch-text)" }}>{creator.followersText}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: "var(--ch-text-muted)" }}>Engagement Rate</span>
                    <span className="text-sm font-bold" style={{ color: "var(--ch-text)" }}>{creator.engagementRate}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs" style={{ color: "var(--ch-text-muted)" }}>Rating</span>
                    <span className="text-sm font-bold flex items-center gap-1" style={{ color: "var(--ch-text)" }}>
                      <Star style={{ width: 14, height: 14, fill: "#F59E0B", color: "#F59E0B" }} />
                      {creator.rating}
                    </span>
                  </div>
                </div>
              </div>

              {/* Performance Metrics */}
              <div className="rounded-xl p-4 space-y-3" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <h3 className="text-sm font-bold" style={{ color: "var(--ch-text)" }}>Performa Konten</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs" style={{ color: "var(--ch-text-muted)" }}>Avg. Likes</span>
                    <span className="text-sm font-semibold" style={{ color: "var(--ch-text)" }}>{avgLikes}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs" style={{ color: "var(--ch-text-muted)" }}>Avg. Comments</span>
                    <span className="text-sm font-semibold" style={{ color: "var(--ch-text)" }}>{avgComments}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-xs" style={{ color: "var(--ch-text-muted)" }}>Avg. Views</span>
                    <span className="text-sm font-semibold" style={{ color: "var(--ch-text)" }}>{avgViews}</span>
                  </div>
                </div>
              </div>

              {/* Pricing Card */}
              <div className="rounded-xl p-4 space-y-2" style={{ background: "var(--ch-primary-50)", border: "2px solid var(--ch-primary-100)" }}>
                <p className="text-xs font-semibold" style={{ color: "var(--ch-primary)" }}>Starting Price</p>
                <p className="text-2xl font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {creator.priceText}
                </p>
                <p className="text-xs" style={{ color: "var(--ch-text-muted)" }}>Estimasi harga per konten</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t flex items-center justify-between gap-3 bg-[#111827]" style={{ borderColor: "var(--ch-border)" }}>
          <Button variant="outline" size="sm" className="gap-2" onClick={onClose}>
            Tutup
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="default" className="gap-2" onClick={onChat}>
              <MessageSquare style={{ width: 16, height: 16 }} /> Chat
            </Button>
            <Button
              size="default"
              variant={selected ? "destructive" : "default"}
              onClick={onToggle}
              className="gap-2"
            >
              {selected ? (
                <>Remove from Brief</>
              ) : (
                <><User style={{ width: 16, height: 16 }} /> Invite to Project</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function parseRange(val: string): { min?: number; max?: number } {
  if (!val || val === "all") return {};
  const [a, b] = val.split("-").map(Number);
  return { min: a || undefined, max: b || undefined };
}

export default function Marketplace() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const [filters, setFilters] = useState<CreatorListParams>(() => ({
    page: 1,
    pageSize: 20,
    verified: true,
    city: searchParams.get("city") ?? undefined,
  }));
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [listView, setListView] = useState(false);

  useEffect(() => {
    const hasUpdates =
      searchParams.has("search") ||
      searchParams.has("city") ||
      searchParams.has("topRated") ||
      searchParams.has("fastResponse") ||
      searchParams.has("verified");

    if (!hasUpdates) return;

    if (searchParams.has("search")) {
      setSearch(searchParams.get("search") ?? "");
    }

    setFilters((f) => {
      const next = { ...f, page: 1 };
      if (searchParams.has("city")) {
        next.city = searchParams.get("city") ?? undefined;
      }
      if (searchParams.get("topRated") === "true") next.topRated = true;
      if (searchParams.get("fastResponse") === "true") next.fastResponse = true;
      if (searchParams.get("verified") === "true") next.verified = true;
      return next;
    });

    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    setFilters((f) => (f.page === 1 ? f : { ...f, page: 1 }));
  }, [debouncedSearch]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT" && document.activeElement?.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const [followersVal, setFollowersVal] = useState("all");
  const [engagementVal, setEngagementVal] = useState("all");
  const [priceVal, setPriceVal] = useState("all");

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMobileBrief, setShowMobileBrief] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [campaignForm, setCampaignForm] = useState({ title: "", description: "", budget: "" });

  const [profileCreator, setProfileCreator] = useState<Creator | null>(null);

  const advMinPrice = useRef("");
  const advMaxPrice = useRef("");

  const createMutation = useCreateCampaign();

  const { data, isLoading } = useCreators({ ...filters, search: debouncedSearch || undefined });
  const { data: stats, isLoading: statsLoading } = useMarketplaceStats();

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 5) {
        toast.error("Maksimal 5 kreator dalam satu brief.");
        return prev;
      }
      return [...prev, id];
    });
  };

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const resetFilters = () => {
    setFilters({ page: 1, pageSize: 20 });
    setSearch("");
    setFollowersVal("all");
    setEngagementVal("all");
    setPriceVal("all");
  };

  const applyFollowers = (val: string) => {
    setFollowersVal(val);
    const { min, max } = parseRange(val);
    setFilters((f) => ({ ...f, minFollowers: min, maxFollowers: max, page: 1 }));
  };

  const applyEngagement = (val: string) => {
    setEngagementVal(val);
    const { min, max } = parseRange(val);
    setFilters((f) => ({ ...f, minEngagement: min, maxEngagement: max, page: 1 }));
  };

  const applyPrice = (val: string) => {
    setPriceVal(val);
    const { min, max } = parseRange(val);
    setFilters((f) => ({ ...f, minPrice: min, maxPrice: max, page: 1 }));
  };

  const toggleQuick = (key: "verified" | "topRated" | "fastResponse") => {
    setFilters((f) => ({ ...f, [key]: f[key] ? undefined : true, page: 1 }));
  };

  const handleCreateCampaign = async () => {
    if (!campaignForm.title) return;
    await createMutation.mutateAsync({
      title: campaignForm.title,
      description: campaignForm.description,
      budget: parseInt(campaignForm.budget) || 0,
    });
    setShowCreateCampaign(false);
    setCampaignForm({ title: "", description: "", budget: "" });
    setSelectedIds([]);
    toast.success("Campaign created successfully!");
  };

  const selectedCreators = data?.data.filter((c) => selectedIds.includes(c.id)) ?? [];

  const statValues: Record<string, string> = {
    totalCreators: stats ? (1000).toLocaleString("en-US") : "–",
    activeCampaigns: stats ? stats.activeCampaigns.toLocaleString("en-US") : "–",
    avgEngagementRate: stats ? `${stats.avgEngagementRate.toFixed(2)}%` : "–",
    totalBudget: stats ? formatBudget(stats.totalBudget) : "–",
  };

  const totalReach = selectedCreators.reduce((a, c) => a + c.followers, 0);
  const avgEngagement = selectedCreators.length > 0
    ? (selectedCreators.reduce((a, c) => a + c.engagementRate, 0) / selectedCreators.length).toFixed(2)
    : "0";

  const briefFooter = selectedIds.length > 0 ? (
    <div className="p-4 border-t border-white/10 space-y-3">
      <div className="space-y-1.5 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Est. Total Reach</span>
          <span className="font-semibold text-white">{formatFollowers(totalReach)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Avg. Engagement</span>
          <span className="font-semibold text-white">{avgEngagement}%</span>
        </div>
        <div className="flex justify-between pt-1.5 border-t border-white/10">
          <span className="text-slate-400">Est. Total Budget</span>
          <span className="font-bold text-white">{formatRupiah(selectedCreators.reduce((a, c) => a + c.price, 0))}</span>
        </div>
      </div>
      <Button className="w-full" onClick={() => { setShowMobileBrief(false); setShowCreateCampaign(true); }}>Create Campaign</Button>
    </div>
  ) : null;

  const [activeTab, setActiveTab] = useState("creators");

  const tabs = [
    { id: "creators", label: "Content Creators", icon: Users },
    { id: "homeless", label: "Homeless Media", icon: Megaphone },
    { id: "live-shopping", label: "Live Shopping & Podcast Providers", icon: Video },
    { id: "idn-network", label: "Indonesian Media Network", icon: Building2 },
    { id: "intl-outlets", label: "International Media Outlets", icon: Globe2 },
  ];

  return (
    <div className="flex flex-col xl:flex-row h-full bg-[#070B14]">
      <div className={`flex-1 flex flex-col min-w-0 ${selectedIds.length > 0 ? "pb-20 xl:pb-0" : ""}`}>
        {/* Tabs */}
        <div className="px-4 pt-3 pb-0 bg-[#0B1120]">
          <div className="flex items-center gap-0 rounded-2xl overflow-hidden" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
            {tabs.map((tab, i) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 relative ${
                    isActive
                      ? "text-white"
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  }`}
                  style={isActive ? {
                    background: "#F97316",
                    boxShadow: "0 4px 14px rgba(249,115,22,.35)",
                  } : undefined}
                >
                  <TabIcon className="w-4 h-4" />
                  {tab.label}
                  {i < tabs.length - 1 && !isActive && (
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-4 bg-white/10" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {activeTab === "creators" ? (
          <>
        {/* Stats */}
        <div className="px-3 pt-2.5 pb-2 border-b border-white/5">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
            {STAT_CONFIGS.map((cfg) => (
              <StatCard key={cfg.key} config={cfg} value={statValues[cfg.key]} loading={statsLoading} />
            ))}
          </div>
        </div>

        {/* Filters row 1 */}
        <div className="px-3 sm:px-4 pt-3 pb-0 bg-[#0B1120] flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:flex-1 sm:min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              ref={searchRef}
              placeholder="Find Creators..."
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={filters.category ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, category: v === "all" ? undefined : v, page: 1 }))}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.platform ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, platform: v === "all" ? undefined : v, page: 1 }))}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Platform" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              {PLATFORMS.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.city ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, city: v === "all" ? undefined : v, page: 1 }))}>
            <SelectTrigger className="w-full sm:w-32"><SelectValue placeholder="Province" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Provinces</SelectItem>
              {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Filters row 2 */}
        <div className="px-3 sm:px-4 py-2 bg-[#0B1120] flex flex-wrap items-center gap-2">
          <Select value={followersVal} onValueChange={applyFollowers}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Followers" /></SelectTrigger>
            <SelectContent>{FOLLOWERS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>

          <Select value={engagementVal} onValueChange={applyEngagement}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Engagement" /></SelectTrigger>
            <SelectContent>{ENGAGEMENT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>

          <Select value={priceVal} onValueChange={applyPrice}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Price" /></SelectTrigger>
            <SelectContent>{PRICE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>

          <Select value={filters.sortBy ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, sortBy: v === "all" ? undefined : v }))}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="Sort" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Relevance</SelectItem>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="price">Price</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1" />

          {/* Quick filter toggles */}
          <button
            onClick={() => toggleQuick("topRated")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filters.topRated ? "bg-orange-500 border-orange-500 text-white" : "border-white/10 text-slate-400 hover:border-orange-500/50"
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Top Rated
          </button>
          <button
            onClick={() => toggleQuick("fastResponse")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filters.fastResponse ? "bg-amber-500 border-amber-500 text-white" : "border-white/10 text-slate-400 hover:border-amber-500/50"
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Fast Response
          </button>
          <button
            onClick={() => toggleQuick("verified")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filters.verified ? "bg-blue-600 border-blue-600 text-white" : "border-white/10 text-slate-400 hover:border-blue-500/50"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" /> Verified Only
          </button>
        </div>

        {/* Row 3: results info + actions */}
        <div className="px-3 sm:px-4 py-1.5 bg-[#0B1120] border-b border-white/5 flex flex-wrap items-center gap-2">
          <p className="text-xs text-slate-400 flex-1">
            {isLoading ? "Loading..." : `${data?.total ?? 0} creators found`}
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setShowAdvanced(true)}>
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
          <div className="flex border border-white/10 rounded-md overflow-hidden">
            <button onClick={() => setListView(false)} className={`p-2 ${!listView ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setListView(true)} className={`p-2 ${listView ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grid / List */}
        <div className="p-3 sm:p-4">
          {isLoading ? (
            <div className={listView ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"}>
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="rounded-xl border overflow-hidden"
                  style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                  {!listView && <Skeleton className="w-full h-52" />}
                  <div className="p-3 space-y-2">
                    <div className="flex gap-3">
                      {listView && <Skeleton className="w-10 h-10 rounded-full shrink-0" />}
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                    {!listView && <Skeleton className="h-10" />}
                  </div>
                </div>
              ))}
            </div>
          ) : data?.data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <Users className="w-12 h-12 mb-3 opacity-40" />
              <p className="font-medium">No creators found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className={listView ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"}>
              {data?.data.map((creator) => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  selected={selectedIds.includes(creator.id)}
                  favorited={favoriteIds.includes(creator.id)}
                  onToggle={() => toggleSelect(creator.id)}
                  onCardClick={() => setProfileCreator(creator)}
                  onFavorite={() => toggleFavorite(creator.id)}
                  listView={listView}
                />
              ))}
            </div>
          )}

          {data && data.totalPages > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <Button variant="outline" size="sm" disabled={filters.page === 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}>
                Sebelumnya
              </Button>
              <span className="text-xs text-slate-400 self-center">
                Menampilkan {((filters.page ?? 1) - 1) * (filters.pageSize ?? 20) + 1}–{Math.min((filters.page ?? 1) * (filters.pageSize ?? 20), data.total)} dari {data.total} kreator
                {" · "}Halaman {filters.page} dari {data.totalPages}
              </span>
              <Button variant="outline" size="sm" disabled={filters.page === data.totalPages}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) + 1 }))}>
                Berikutnya
              </Button>
            </div>
          )}
        </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <Megaphone className="w-12 h-12 mb-3 opacity-40" />
            <p className="font-medium">{tabs.find(t => t.id === activeTab)?.label}</p>
            <p className="text-sm mt-1">Fitur ini akan segera tersedia.</p>
          </div>
        )}
      </div>

      {/* Mobile campaign brief bar */}
      {selectedIds.length > 0 && (
        <div className="xl:hidden fixed bottom-0 left-0 right-0 z-30 p-3 bg-[#111827] border-t border-white/10 shadow-lg flex items-center gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold truncate text-white">Campaign Brief</p>
            <p className="text-xs text-slate-400">{selectedIds.length}/5 creators selected</p>
          </div>
          <Button size="sm" onClick={() => setShowMobileBrief(true)}>View Brief</Button>
        </div>
      )}

      {/* Campaign Brief Panel — desktop */}
      <aside className="hidden xl:flex w-[312px] shrink-0 flex-col bg-[#111827] border-l border-white/10">
        <div className="p-4 border-b border-white/10">
          <h2 className="font-bold text-[15px] text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Campaign Brief</h2>
          <p className="text-[12px] mt-0.5 text-slate-400">{selectedIds.length}/5 creators selected</p>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {selectedCreators.length === 0 ? (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No creators selected yet</p>
              <p className="text-xs mt-1">Click "Invite" or open creator profile</p>
            </div>
          ) : (
            selectedCreators.map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-semibold text-slate-300 overflow-hidden shrink-0">
                  {c.imageUrl ? <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" /> : c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{c.name}</p>
                  <p className="text-xs text-slate-400">{c.followersText} followers</p>
                  <p className="text-xs text-slate-500">{c.engagementRate}% ER · {c.priceText}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-500"
                  onClick={() => toggleSelect(c.id)}>
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))
          )}
        </div>

        {briefFooter}
      </aside>

      {/* Campaign Brief — mobile sheet */}
      <Dialog open={showMobileBrief} onOpenChange={setShowMobileBrief}>
        <DialogContent className="max-w-lg p-0 gap-0 flex flex-col max-h-[85dvh]">
          <DialogHeader className="p-4 border-b shrink-0" style={{ borderColor: "var(--ch-border)" }}>
            <DialogTitle>Campaign Brief</DialogTitle>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{selectedIds.length}/5 kreator dipilih</p>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {selectedCreators.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="text-sm">Belum ada kreator dipilih</p>
              </div>
            ) : (
              selectedCreators.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600 overflow-hidden shrink-0">
                    {c.imageUrl ? <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" /> : c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.followersText} followers</p>
                    <p className="text-xs text-slate-400">{c.engagementRate}% ER · {c.priceText}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-red-500"
                    onClick={() => toggleSelect(c.id)}>
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </div>
              ))
            )}
          </div>
          {briefFooter}
        </DialogContent>
      </Dialog>

      {/* Creator Profile Modal */}
      {profileCreator && (
        <CreatorProfileModal
          creator={profileCreator}
          selected={selectedIds.includes(profileCreator.id)}
          favorited={favoriteIds.includes(profileCreator.id)}
          onToggle={() => toggleSelect(profileCreator.id)}
          onClose={() => setProfileCreator(null)}
          onChat={() => { setProfileCreator(null); navigate("/dashboard/messages"); }}
          onFavorite={() => toggleFavorite(profileCreator.id)}
        />
      )}

      {/* Advanced Filters Dialog */}
      <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Advanced Filters</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Minimum Price ($)</label>
              <Input type="number" placeholder="e.g. 500" defaultValue={advMinPrice.current}
                onChange={(e) => { advMinPrice.current = e.target.value; }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Maximum Price ($)</label>
              <Input type="number" placeholder="e.g. 1000" defaultValue={advMaxPrice.current}
                onChange={(e) => { advMaxPrice.current = e.target.value; }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Minimum Rating</label>
              <Select onValueChange={(v) => setFilters((f) => ({ ...f, minRating: v === "all" ? undefined : Number(v) }))}>
                <SelectTrigger><SelectValue placeholder="All Ratings" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ratings</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="4.5">4.5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-300 flex-1">Fast Response Only</label>
              <button onClick={() => setFilters((f) => ({ ...f, fastResponse: !f.fastResponse }))}
                className={`w-10 h-5 rounded-full relative transition-colors ${filters.fastResponse ? "bg-blue-600" : "bg-white/10"}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${filters.fastResponse ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-300 flex-1">Top Rated Only</label>
              <button onClick={() => setFilters((f) => ({ ...f, topRated: !f.topRated }))}
                className={`w-10 h-5 rounded-full relative transition-colors ${filters.topRated ? "bg-blue-600" : "bg-white/10"}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${filters.topRated ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdvanced(false)}>Cancel</Button>
            <Button onClick={() => {
              setFilters((f) => ({
                ...f,
                minPrice: advMinPrice.current ? Number(advMinPrice.current) : undefined,
                maxPrice: advMaxPrice.current ? Number(advMaxPrice.current) : undefined,
                page: 1,
              }));
              setShowAdvanced(false);
            }}>Apply Filters</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Campaign with {selectedCreators.length} Creators</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Campaign Name</label>
              <Input placeholder="e.g. Summer Campaign 2025" value={campaignForm.title}
                onChange={(e) => setCampaignForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Description</label>
              <Input placeholder="Brief campaign description..." value={campaignForm.description}
                onChange={(e) => setCampaignForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300">Budget ($)</label>
              <Input type="number" placeholder={String(selectedCreators.reduce((a, c) => a + c.price, 0))}
                value={campaignForm.budget} onChange={(e) => setCampaignForm((f) => ({ ...f, budget: e.target.value }))} />
            </div>
            <div className="bg-white/5 rounded-lg p-3 text-sm text-slate-400">
              <p className="font-medium mb-1">Selected Creators:</p>
              {selectedCreators.map((c) => (
                <span key={c.id} className="inline-block mr-2 text-xs text-slate-500">· {c.name}</span>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>Cancel</Button>
            <Button onClick={handleCreateCampaign} disabled={createMutation.isPending || !campaignForm.title}>
              {createMutation.isPending ? "Creating..." : "Create Campaign"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
