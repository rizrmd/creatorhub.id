import { useState, useRef, useEffect, useCallback } from "react";
import {
  Search, SlidersHorizontal, Star, CheckCircle,
  Instagram, Youtube, Users, Megaphone, TrendingUp,
  LayoutGrid, List, RotateCcw, X, MessageSquare, MapPin,
  Heart, User, Video, Building2, Mic,
  UserPlus, Loader2, Link2, ChevronDown,
} from "lucide-react";
import * as topojson from "topojson-client";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useInfiniteCreators, useMarketplaceStats } from "@/hooks/useCreators";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { useCreateCampaign } from "@/hooks/useCampaigns";
import { creatorsApi } from "@/lib/api";
import type { Creator, CreatorListParams, ScrapeResponse, PlatformInput } from "@/types";
import { formatFollowers, resolveCreatorPhoto } from "@/lib/utils";

const CATEGORIES = [
  { label: "Lifestyle", value: "lifestyle" },
  { label: "Politik", value: "politi" },
  { label: "Bisnis", value: "business" },
  { label: "Sosial", value: "social" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Beauty & Fashion", value: "beauty" },
  { label: "Technology", value: "tech" },
  { label: "Travel", value: "travel" },
  { label: "Food", value: "food" },
  { label: "Sports", value: "sport" },
  { label: "Education", value: "education" },
  { label: "Comedy", value: "comedy" },
  { label: "Gaming", value: "gaming" },
  { label: "Parenting", value: "parent" },
];
const DEFAULT_CITIES: string[] = [
  "Jakarta", "Bandung", "Surabaya", "Semarang", "Yogyakarta", "Medan",
  "Makassar", "Denpasar", "Malang", "Palembang", "Manado", "Balikpapan",
  "Banjarmasin", "Pontianak", "Padang", "Lampung", "Bogor", "Depok",
  "Tangerang", "Bekasi", "Solo", "Maluku", "Papua", "Sulawesi",
];
const KABUPATEN_KOTA_URL = "https://gist.githubusercontent.com/ajie31/3144875bad9705e2b2b544909c022276/raw/Peta%20Indonesia%20Kota%20Kabupaten%20simplified.json";

const PLATFORM_SERVICES: Record<string, string[]> = {
  instagram: [
    "Instagram Feed Post",
    "Instagram Carousel Post",
    "Instagram Story Post",
    "Instagram Story Series",
    "Instagram Reels Video",
    "Instagram Collab Post",
    "Instagram Product Review",
    "Instagram Giveaway Post",
    "Instagram Story Link / CTA",
  ],
  tiktok: [
    "TikTok Video Post",
    "TikTok Product Review",
    "TikTok Unboxing Video",
    "TikTok Tutorial Video",
    "TikTok Storytelling Video",
    "TikTok Challenge Video",
    "TikTok Duet / Stitch",
    "TikTok Shop Affiliate Video",
  ],
  youtube: [
    "YouTube Dedicated Video",
    "YouTube Shorts Video",
    "YouTube Product Review",
    "YouTube Tutorial Video",
    "YouTube Video Integration",
    "YouTube Community Post",
    "YouTube Premiere",
    "Pinned Comment Placement",
    "Description Link Placement",
  ],
  x: [
    "X Image Post",
    "X Video Post",
    "X Poll Post",
    "X Hashtag Campaign",
    "Pinned Post Placement",
  ],
};

const FOLLOWERS_OPTIONS = [
  { label: "All Tiers", value: "all" },
  { label: "Mega (1M+)", value: "1000000-0" },
  { label: "Makro (100K–1M)", value: "100000-1000000" },
  { label: "Mikro (10K–100K)", value: "10000-100000" },
  { label: "Nano (1K–10K)", value: "1000-10000" },
  { label: "Amplifier (<1K)", value: "0-1000" },
];

const DEFAULT_CREATOR_TIER = "1000-10000";
const MARKETPLACE_STATE_KEY = "creatorhub.marketplace.state";

type MarketplaceStoredState = {
  filters?: CreatorListParams;
  search?: string;
  followersVal?: string;
  listView?: boolean;
  activeTab?: string;
  scrollTop?: number;
};

function readMarketplaceState(): MarketplaceStoredState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(MARKETPLACE_STATE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as MarketplaceStoredState;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

function getMarketplaceScrollElement(): HTMLElement | null {
  if (typeof document === "undefined") return null;
  return document.querySelector("main");
}

const splitCategories = (cat: string): string[] =>
  (cat || "").split(",").map((s) => s.trim()).filter(Boolean);
const getCategoryColor = (cat: string): string => {
  const first = splitCategories(cat)[0]?.toLowerCase() ?? "";
  return CATEGORY_COLORS[first] ?? "bg-white/10 text-slate-300";
};
const CATEGORY_COLORS: Record<string, string> = {
  lifestyle: "bg-purple-500/20 text-purple-300",
  travel: "bg-blue-500/20 text-blue-300",
  beauty: "bg-pink-500/20 text-pink-300",
  fashion: "bg-rose-500/20 text-rose-300",
  tech: "bg-slate-500/20 text-slate-300",
  technology: "bg-slate-500/20 text-slate-300",
  food: "bg-orange-500/20 text-orange-300",
  sports: "bg-green-500/20 text-green-300",
  comedy: "bg-yellow-500/20 text-yellow-300",
  gaming: "bg-lime-500/20 text-lime-300",
  family: "bg-sky-500/20 text-sky-300",
  parenting: "bg-sky-500/20 text-sky-300",
  "social issues": "bg-red-500/20 text-red-300",
  education: "bg-indigo-500/20 text-indigo-300",
  environment: "bg-emerald-500/20 text-emerald-300",
  animals: "bg-amber-500/20 text-amber-300",
  business: "bg-cyan-500/20 text-cyan-300",
  "mental health": "bg-violet-500/20 text-violet-300",
  entertainment: "bg-fuchsia-500/20 text-fuchsia-300",
};

const platformIcon = (p: string) => {
  if (p === "instagram") return <Instagram className="w-3 h-3" />;
  if (p === "youtube") return <Youtube className="w-3 h-3" />;
  if (p === "tiktok") return (
    <svg viewBox="0 0 24 24" className="w-3 h-3 fill-current">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
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
    const isPercent = suffix.includes("%");
    const raw = isPercent ? numericPart.replace(",", ".") : numericPart.replace(/[.,]/g, "");
    const target = isPercent ? parseFloat(raw) : parseInt(raw, 10);
    if (isNaN(target)) { setDisplay(numericPart); return; }
    const duration = 1200;
    const startTime = performance.now();
    let raf: number;
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = isPercent ? target * eased : Math.round(target * eased);
      setDisplay(current.toLocaleString("id-ID", {
        minimumFractionDigits: isPercent ? 2 : 0,
        maximumFractionDigits: isPercent ? 2 : 0,
      }));
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

function socialUrl(platform: string, handle: string): string {
  const h = handle.replace(/^@/, "");
  if (!h) return "#";
  switch (platform) {
    case "instagram": return `https://www.instagram.com/${h}`;
    case "tiktok":    return `https://www.tiktok.com/@${h}`;
    case "youtube":   return `https://www.youtube.com/@${h}`;
    case "facebook":  return `https://www.facebook.com/${h}`;
    case "x":         return `https://x.com/${h}`;
    case "linkedin":  return `https://www.linkedin.com/in/${h}`;
    default:          return `https://www.google.com/search?q=${h}`;
  }
}

const platformBg: Record<string, string> = {
  instagram: "bg-pink-500/15 text-pink-400 border-pink-500/20",
  tiktok:    "bg-white/10 text-white border-white/10",
  youtube:   "bg-red-500/15 text-red-400 border-red-500/20",
  facebook:  "bg-blue-500/15 text-blue-400 border-blue-500/20",
  x:         "bg-white/10 text-slate-300 border-white/10",
  linkedin:  "bg-blue-400/15 text-blue-300 border-blue-400/20",
};

function CreatorCard({ creator, selected, favorited, onToggle, onCardClick, onFavorite, listView, onCityClick, onCategoryClick, platformFilterActive }: {
  creator: Creator; selected: boolean; favorited: boolean;
  onToggle: () => void; onCardClick: () => void; onFavorite: () => void; listView: boolean;
  onCityClick?: (city: string) => void;
  onCategoryClick?: (category: string) => void;
  platformFilterActive?: boolean;
}) {
  const followersLabel = creator.followersText || formatFollowers(creator.followers);

  if (listView) {
    return (
      <div
        className="transition-all rounded-[14px] border"
        style={{
          background: "var(--ch-surface)",
          borderColor: selected ? "var(--ch-primary)" : "var(--ch-border)",
          boxShadow: selected ? "0 0 0 3px rgba(37,99,235,.15)" : "var(--ch-shadow-sm)",
        }}
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
                <p className="text-[13px] font-semibold leading-tight" style={{ color: "var(--ch-text)" }}>{creator.name}</p>
              </div>
              <div className="flex items-center gap-1.5 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
                <MapPin style={{ width: 11, height: 11 }} />
                <button
                  onClick={(e) => { e.stopPropagation(); onCityClick?.(creator.city); }}
                  className="hover:underline cursor-pointer text-left"
                >{creator.city}</button>
                {splitCategories(creator.category).map((cat) => (
                  <span key={cat} className={`px-1.5 py-0 rounded-full text-[10px] font-medium capitalize cursor-pointer hover:opacity-80 ${getCategoryColor(cat)}`}
                    onClick={(e) => { e.stopPropagation(); onCategoryClick?.(cat); }}>{cat}</span>
                ))}
              </div>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              {creator.platforms.map((p) => {
                const pm = creator.platformMetrics?.find((m) => m.platform === p);
                const platformHandle = pm?.handle ?? creator.handle;
                return (
                  <a
                    key={p}
                    href={socialUrl(p, platformHandle)}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border transition-colors hover:opacity-80 ${platformBg[p] ?? "bg-white/5 text-slate-300 border-white/5"}`}
                  >
                    {platformIcon(p)} <span className="capitalize">{p}</span>
                  </a>
                );
              })}
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
              <span className="text-slate-600">|</span>
              <span className="font-semibold">{followersLabel} followers</span>
              <span className="font-bold whitespace-nowrap" style={{ color: "var(--ch-text)" }}>
                {creator.priceText}
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onFavorite(); }}
              className="p-1.5 rounded-full hover:bg-white/10 transition-colors shrink-0"
            >
              <Heart style={{ width: 14, height: 14, color: favorited ? "#EF4444" : "#94A3B8", fill: favorited ? "#EF4444" : "none" }} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); if (platformFilterActive) onToggle(); }}
              className="px-3 py-1.5 rounded-lg text-[12px] font-bold transition-all shrink-0"
              style={selected ? {
                background: "var(--ch-primary)", color: "white",
              } : platformFilterActive ? {
                background: "var(--ch-primary-50)", color: "var(--ch-primary)",
                border: "1.5px solid var(--ch-primary-100)",
              } : {
                background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.25)",
                border: "1.5px solid rgba(255,255,255,0.08)", cursor: "not-allowed",
              }}
              disabled={!platformFilterActive && !selected}
            >
              {selected ? "✓ Invited" : platformFilterActive ? "Invite" : "Select Platform"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const photoSrc = resolveCreatorPhoto(creator.img, creator.imageUrl);
  const gradientBg = `hsl(${creator.hue ?? 220}, 60%, 85%)`;

  return (
    <div
      className={`rounded-[14px] overflow-hidden border transition-all`}
      style={{
        background: "var(--ch-surface)",
        borderColor: selected ? "var(--ch-primary)" : "var(--ch-border)",
        boxShadow: selected ? "0 0 0 2px var(--ch-primary)" : "var(--ch-shadow-sm)",
        transform: "translateY(0)",
        transition: "transform .15s, box-shadow .15s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--ch-shadow-md)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = selected ? "0 0 0 2px var(--ch-primary)" : "var(--ch-shadow-sm)"; }}
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
        {/* Name */}
        <p className="font-bold text-[14px] leading-tight mb-1" style={{ color: "var(--ch-text)" }}>{creator.name}</p>

        {/* City + category */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <p className="text-[12px] flex items-center gap-1" style={{ color: "var(--ch-text-muted)" }}>
            <MapPin style={{ width: 11, height: 11 }} />
            <button
              onClick={(e) => { e.stopPropagation(); onCityClick?.(creator.city); }}
              className="hover:underline cursor-pointer text-left"
            >{creator.city}</button>
          </p>
          {splitCategories(creator.category).map((cat) => (
            <button key={cat}
              onClick={(e) => { e.stopPropagation(); onCategoryClick?.(cat); }}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize cursor-pointer hover:opacity-80 ${getCategoryColor(cat)}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Platform table */}
        {creator.platforms && creator.platforms.length > 0 && (
          <div className="mt-2.5 rounded-lg border overflow-hidden" style={{ borderColor: "var(--ch-border)", background: "var(--ch-bg)" }}>
            <div className="flex items-center justify-between px-3 py-1.5 border-b" style={{ borderColor: "var(--ch-border)" }}>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Platform</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Followers</span>
            </div>
            {creator.platforms.map((p) => {
              const pm = creator.platformMetrics?.find((m) => m.platform === p);
              const followers = pm?.followers ?? 0;
              const platformHandle = pm?.handle ?? creator.handle;
              return (
                <a
                  key={p}
                  href={socialUrl(p, platformHandle)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-between px-3 py-2 border-t transition-colors hover:bg-white/5"
                  style={{ borderColor: "var(--ch-border)" }}
                >
                  <span className="flex items-center gap-2 text-[12px] font-semibold capitalize" style={{ color: "var(--ch-text)" }}>
                    {platformIcon(p)}
                    {p}
                  </span>
                  <span className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>
                    {followers > 0 ? formatFollowers(followers) : "–"}
                  </span>
                </a>
              );
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={(e) => { e.stopPropagation(); onCardClick(); }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-semibold border transition-colors hover:bg-white/5"
            style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
          >
            <User className="w-3.5 h-3.5" />
            Profile
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); if (platformFilterActive) onToggle(); }}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-[12px] font-bold transition-all"
            style={selected ? {
              background: "var(--ch-primary)", color: "white", border: "none",
            } : platformFilterActive ? {
              background: "var(--ch-primary)", color: "white",
            } : {
              background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.25)",
              border: "1px solid rgba(255,255,255,0.08)", cursor: "not-allowed",
            }}
            disabled={!platformFilterActive && !selected}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" /></svg>
            {selected ? "Invited" : platformFilterActive ? "Invite" : "Select Platform"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CreatorProfileModal({ creator, selected, favorited, onToggle, onClose, onChat, onFavorite, onCityClick }: {
  creator: Creator; selected: boolean; favorited: boolean;
  onToggle: () => void; onClose: () => void; onChat: () => void; onFavorite: () => void;
  onCityClick?: (city: string) => void;
}) {
  const platformSplit = (creator.platformMetrics && creator.platformMetrics.length > 0)
    ? creator.platformMetrics
    : creator.platforms.map((p) => ({ platform: p, followers: 0, engagementRate: 0 }));

  const collaborationCount = Math.max(1, Math.round(creator.rating * 8) - 12);
  const responseTimeLabel = "< 24 jam";
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
              </div>

              {/* Location + Category */}
              <p className="text-sm mb-3" style={{ color: "var(--ch-text-muted)" }}>
                <span className="flex items-center gap-1">
                  <MapPin style={{ width: 14, height: 14 }} />
                  <button
                    onClick={() => onCityClick?.(creator.city)}
                    className="hover:underline cursor-pointer text-left"
                  >{creator.city}, Indonesia</button>
                </span>
                <span className="mx-2">·</span>
                {splitCategories(creator.category).map((cat) => (
                  <span key={cat} className={`px-2 py-0.5 rounded-md text-xs font-medium capitalize ${getCategoryColor(cat)}`}>
                    {cat}
                  </span>
                ))}
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
                <><User style={{ width: 16, height: 16 }} /> Invite</>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

const ADD_PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "tiktok", label: "TikTok", icon: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46v-7.2a8.16 8.16 0 005.58 2.19V11.2a4.83 4.83 0 01-3.77-1.7V2h3.77z"/>
    </svg>
  )},
  { id: "youtube", label: "YouTube", icon: Youtube },
  { id: "x", label: "X / Twitter", icon: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )},
  { id: "facebook", label: "Facebook", icon: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )},
  { id: "threads", label: "Threads", icon: () => (
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.59 12c.025 3.086.718 5.496 2.057 7.164 1.432 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.34-.776-.963-1.394-1.813-1.807-.1 1.578-.47 2.89-1.104 3.92-.89 1.44-2.17 2.215-3.81 2.302-1.276.068-2.447-.218-3.48-.855-1.166-.72-1.948-1.858-2.203-3.267-.22-1.212-.082-2.552.4-3.74.666-1.65 1.98-2.79 3.82-3.295.94-.258 1.96-.366 2.95-.314.364.02.727.063 1.085.128l.066.013-.003-.173-.075-1.764c-.058-1.374-.082-2.415-.448-3.348-.554-1.412-1.636-2.167-3.16-2.217h-.11c-1.046.035-1.88.36-2.475.97-.548.564-.878 1.327-.974 2.264-.072.708.014 1.488.258 2.32l1.728-.636c-.196-.662-.292-1.265-.262-1.802.047-.845.335-1.47.847-1.893.555-.457 1.273-.668 2.13-.64h.063c1.57.046 2.575.735 3.056 2.04.338.926.377 2.05.42 3.293l-.006.237.234.025c1.06.108 2.007.407 2.808.9.937.58 1.647 1.43 2.095 2.513.612 1.482.652 3.593-.592 5.394C18.307 22.683 15.762 24 12.186 24zM11.64 13.98c-.008.044-.016.088-.025.133-.14 1.626.155 2.838.863 3.62.557.616 1.35.926 2.28.926.066 0 .134-.002.2-.006.968-.06 1.777-.5 2.343-1.42.478-.778.738-1.818.774-3.066.023-.81-.014-1.587-.108-2.322-.163-.08-.343-.14-.536-.177-.76-.148-1.552-.165-2.366-.052a7.753 7.753 0 00-.782.155l-.177.045-.003.134z"/>
    </svg>
  )},
];

function parseSocialUrl(url: string): { platform: string; handle: string } | null {
  const trimmed = url.trim();
  try {
    const u = new URL(trimmed.startsWith("http") ? trimmed : `https://${trimmed}`);
    const host = u.hostname.replace(/^www\./, "");
    const path = u.pathname.replace(/^\/+|\/+$/g, "");

    if (host === "instagram.com" && path) {
      const handle = path.split("/")[0];
      if (handle && !["p", "reel", "stories", "explore", "accounts", "direct"].includes(handle)) {
        return { platform: "instagram", handle };
      }
    }
    if (host === "tiktok.com") {
      const handle = path.startsWith("@") ? path.split("/")[0].slice(1) : path.split("/")[0];
      if (handle) return { platform: "tiktok", handle };
    }
    if (host === "youtube.com" || host === "m.youtube.com") {
      if (path.startsWith("@")) return { platform: "youtube", handle: path.split("/")[0].slice(1) };
      const chMatch = path.match(/^channel\/([^/]+)/);
      if (chMatch) return { platform: "youtube", handle: chMatch[1] };
      const userMatch = path.match(/^user\/([^/]+)/);
      if (userMatch) return { platform: "youtube", handle: userMatch[1] };
    }
    if (host === "x.com" || host === "twitter.com") {
      const handle = path.split("/")[0];
      if (handle && !["home", "explore", "search", "notifications", "messages", "settings"].includes(handle)) {
        return { platform: "x", handle };
      }
    }
    if (host === "facebook.com" || host === "m.facebook.com") {
      const handle = path.split("/")[0];
      if (handle && !["login", "register", "groups", "pages", "events", "marketplace"].includes(handle)) {
        return { platform: "facebook", handle };
      }
    }
    if (host === "threads.net") {
      const handle = path.startsWith("@") ? path.split("/")[0].slice(1) : path.split("/")[0];
      if (handle) return { platform: "threads", handle };
    }
  } catch {
    // not a valid URL, try as bare handle
  }
  return null;
}

function AddCreatorDialog({ open, onOpenChange, onCreated, cityOptions }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
  cityOptions: string[];
}) {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [category, setCategory] = useState("lifestyle");
  const [city, setCity] = useState("Jakarta");
  const [platforms, setPlatforms] = useState<PlatformInput[]>([]);
  const [scraping, setScraping] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [profileUrl, setProfileUrl] = useState("");

  const handleUrlSubmit = async () => {
    const parsed = parseSocialUrl(urlInput);
    if (!parsed) {
      toast.error("Link tidak valid atau platform tidak dikenali");
      return;
    }

    const { platform: platformId, handle } = parsed;

    // ensure platform is toggled on
    setPlatforms((prev) => {
      const exists = prev.find((p) => p.platform === platformId);
      if (exists) {
        return prev.map((p) => (p.platform === platformId ? { ...p, handle } : p));
      }
      return [...prev, { platform: platformId, handle, profilePictureUrl: "", followers: 0 }];
    });

    setUrlInput("");
    toast.success(`Detected ${platformId} — fetching data...`);

    // scrape after a tick so state is updated
    setTimeout(async () => {
      setScraping(platformId);
      try {
        const result: ScrapeResponse = await creatorsApi.scrapeSocial({
          platform: platformId,
          handle,
        });

        setPlatforms((prev) =>
          prev.map((p) =>
            p.platform === platformId
              ? {
                  ...p,
                  profilePictureUrl: result.profilePictureUrl || p.profilePictureUrl,
                  followers: result.followerCount || p.followers,
                  following: result.followingCount || p.following,
                  likes: result.likesCount || p.likes,
                  bio: result.bio || p.bio,
                }
              : p
          )
        );

        // Auto-fill creator bio and name from scraped data
        if (result.bio && !bio.trim()) {
          setBio(result.bio);
        }
        if (result.displayName && result.displayName !== handle && !name.trim()) {
          setName(result.displayName);
        }

        if (result.success) {
          toast.success(`${platformId} data fetched successfully`);
        } else {
          toast.error(result.error || `Failed to fetch ${platformId} data`);
        }
      } catch {
        toast.error(`Failed to fetch ${platformId} data`);
      } finally {
        setScraping(null);
      }
    }, 50);
  };

  const togglePlatform = (platformId: string) => {
    setPlatforms((prev) => {
      const exists = prev.find((p) => p.platform === platformId);
      if (exists) {
        return prev.filter((p) => p.platform !== platformId);
      }
      return [...prev, { platform: platformId, handle: "", profilePictureUrl: "", followers: 0 }];
    });
  };

  const updatePlatformHandle = (platformId: string, handle: string) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.platform === platformId ? { ...p, handle } : p))
    );
  };

  const updatePlatformField = (platformId: string, field: string, value: string | number) => {
    setPlatforms((prev) =>
      prev.map((p) => (p.platform === platformId ? { ...p, [field]: value } : p))
    );
  };

  const scrapePlatform = async (platformId: string) => {
    const platform = platforms.find((p) => p.platform === platformId);
    if (!platform?.handle) return;

    setScraping(platformId);
    try {
      const result: ScrapeResponse = await creatorsApi.scrapeSocial({
        platform: platformId,
        handle: platform.handle.replace(/^@/, ""),
      });

      setPlatforms((prev) =>
        prev.map((p) =>
          p.platform === platformId
            ? {
                ...p,
                profilePictureUrl: result.profilePictureUrl || p.profilePictureUrl,
                followers: result.followerCount || p.followers,
                following: result.followingCount || p.following,
                likes: result.likesCount || p.likes,
                bio: result.bio || p.bio,
              }
            : p
        )
      );

      // Auto-fill creator bio from first scraped platform
      if (result.bio && !bio.trim()) {
        setBio(result.bio);
      }
      // Auto-fill creator name from displayName
      if (result.displayName && result.displayName !== platformId && !name.trim()) {
        setName(result.displayName);
      }

      if (result.success) {
        toast.success(`${platformId} data fetched successfully`);
      } else {
        toast.error(result.error || `Failed to fetch ${platformId} data`);
      }
    } catch {
      toast.error(`Failed to fetch ${platformId} data`);
    } finally {
      setScraping(null);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) return;

    setCreating(true);
    try {
      // Use profileUrl as main image, fallback to first platform's profile picture
      const imageUrl = profileUrl || platforms.find((p) => p.profilePictureUrl)?.profilePictureUrl || "";

      await creatorsApi.create({
        name: name.trim(),
        bio: bio.trim(),
        category,
        city,
        imageUrl,
        platforms: platforms.filter((p) => p.handle),
      });

      toast.success("Creator created successfully!");
      onOpenChange(false);
      onCreated();
      resetForm();
    } catch {
      toast.error("Failed to create creator");
    } finally {
      setCreating(false);
    }
  };

  const resetForm = () => {
    setName("");
    setBio("");
    setCategory("lifestyle");
    setCity("Jakarta");
    setPlatforms([]);
    setProfileUrl("");
  };

  const firstProfilePic = profileUrl || platforms.find((p) => p.profilePictureUrl)?.profilePictureUrl;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" /> Add New Creator
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-2">
          {/* Profile Preview */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 flex items-center justify-center text-xl font-bold"
              style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
              {firstProfilePic ? (
                <img src={firstProfilePic} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                name[0]?.toUpperCase() || "?"
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium" style={{ color: "var(--ch-text)" }}>
                {name || "Creator Name"}
              </p>
              <p className="text-xs" style={{ color: "var(--ch-text-muted)" }}>
                {bio || "Brief description"}
              </p>
            </div>
          </div>

          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--ch-text)" }}>
                Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="Creator name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium" style={{ color: "var(--ch-text)" }}>
                Category
              </label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--ch-text)" }}>
              Bio / Description <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="Brief description of the creator"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--ch-text)" }}>
              Foto Profil URL
            </label>
            <div className="flex items-center gap-2">
              <Input
                placeholder="https://... (URL foto profil)"
                value={profileUrl}
                onChange={(e) => setProfileUrl(e.target.value)}
                className="flex-1"
              />
              {profileUrl && (
                <img src={profileUrl} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" style={{ color: "var(--ch-text)" }}>City</label>
            <Select value={city} onValueChange={setCity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {cityOptions.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Social Media Links */}
          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-2" style={{ color: "var(--ch-text)" }}>
              <Link2 className="w-4 h-4" /> Social Media Links
            </label>

            <div className="flex items-center gap-2">
              <Input
                placeholder="Paste link Instagram, TikTok, YouTube, dll..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleUrlSubmit();
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                className="shrink-0"
                disabled={!urlInput.trim()}
                onClick={handleUrlSubmit}
              >
                Detect
              </Button>
            </div>

            <div className="space-y-2">
              {ADD_PLATFORMS.map((platformDef) => {
                const isActive = platforms.some((p) => p.platform === platformDef.id);
                const platformData = platforms.find((p) => p.platform === platformDef.id);
                const PlatformIcon = platformDef.icon;

                return (
                  <div
                    key={platformDef.id}
                    className="rounded-lg border p-3 transition-colors"
                    style={{
                      background: isActive ? "rgba(255,255,255,.05)" : "transparent",
                      borderColor: isActive ? "var(--ch-border)" : "rgba(255,255,255,.05)",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePlatform(platformDef.id)}
                        className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                          isActive ? "bg-blue-600 border-blue-600" : "border-white/20"
                        }`}
                      >
                        {isActive && <CheckCircle className="w-3 h-3 text-white" />}
                      </button>
                      <PlatformIcon />
                      <span className="text-sm font-medium flex-1" style={{ color: "var(--ch-text)" }}>
                        {platformDef.label}
                      </span>
                      {platformData?.profilePictureUrl && (
                        <img
                          src={platformData.profilePictureUrl}
                          alt={platformDef.label}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                      )}
                      {platformData && platformData.followers > 0 && (
                        <span className="text-xs flex items-center gap-2" style={{ color: "var(--ch-text-muted)" }}>
                          <span>{formatFollowers(platformData.followers)} followers</span>
                          {platformData.following ? <span>· {formatFollowers(platformData.following)} following</span> : null}
                          {platformData.likes ? <span>· {formatFollowers(platformData.likes)} likes</span> : null}
                        </span>
                      )}
                    </div>

                    {isActive && (
                      <div className="mt-3 space-y-2">
                        {/* Handle + Fetch button */}
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder={`@${platformDef.label.toLowerCase()} handle`}
                            value={platformData?.handle || ""}
                            onChange={(e) => updatePlatformHandle(platformDef.id, e.target.value)}
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => scrapePlatform(platformDef.id)}
                            disabled={!platformData?.handle || scraping === platformDef.id}
                          >
                            {scraping === platformDef.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              "Fetch"
                            )}
                          </Button>
                        </div>

                        {/* Profile Picture URL */}
                        <div className="flex items-center gap-2">
                          <Input
                            placeholder="Foto profil URL"
                            value={platformData?.profilePictureUrl || ""}
                            onChange={(e) => updatePlatformField(platformDef.id, "profilePictureUrl", e.target.value)}
                            className="flex-1"
                          />
                          {platformData?.profilePictureUrl && (
                            <img src={platformData.profilePictureUrl} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                          )}
                        </div>

                        {/* Followers / Following / Likes */}
                        <div className="grid grid-cols-3 gap-2">
                          <Input
                            type="number"
                            placeholder="Followers"
                            value={platformData?.followers || ""}
                            onChange={(e) => updatePlatformField(platformDef.id, "followers", parseInt(e.target.value) || 0)}
                          />
                          <Input
                            type="number"
                            placeholder="Following"
                            value={platformData?.following || ""}
                            onChange={(e) => updatePlatformField(platformDef.id, "following", parseInt(e.target.value) || 0)}
                          />
                          <Input
                            type="number"
                            placeholder="Likes"
                            value={platformData?.likes || ""}
                            onChange={(e) => updatePlatformField(platformDef.id, "likes", parseInt(e.target.value) || 0)}
                          />
                        </div>

                        {/* Bio */}
                        <Input
                          placeholder="Bio (opsional)"
                          value={platformData?.bio || ""}
                          onChange={(e) => updatePlatformField(platformDef.id, "bio", e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!name.trim() || !bio.trim() || creating}
          >
            {creating ? (
              <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Creating...</>
            ) : (
              "Create Creator"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function parseRange(val: string): { min?: number; max?: number } {
  if (!val || val === "all") return {};
  const [a, b] = val.split("-").map(Number);
  return { min: a || undefined, max: b || undefined };
}

/* ─── Homeless Media Seed Data ─── */

interface HomelessMedia {
  id: string;
  name: string;
  handle: string;
  platform: string;
  followers: string;
  region: string;
  category: string;
  engagementRate: string;
  price: string;
  verified: boolean;
  hue: number;
}

const HOMELESS_MEDIA_DATA: HomelessMedia[] = [
  { id: "hm1", name: "Jakarta Keras", handle: "jakarta.keras", platform: "instagram", followers: "5.8M", region: "DKI Jakarta", category: "News", engagementRate: "3.2", price: "Rp 15.000.000", verified: true, hue: 210 },
  { id: "hm2", name: "Jakarta Zone", handle: "jakartazoone", platform: "instagram", followers: "3M", region: "DKI Jakarta", category: "Lifestyle", engagementRate: "4.1", price: "Rp 12.000.000", verified: true, hue: 200 },
  { id: "hm3", name: "Info Depok", handle: "infodepok_id", platform: "instagram", followers: "893K", region: "Jabodetabek", category: "News", engagementRate: "5.2", price: "Rp 8.000.000", verified: true, hue: 180 },
  { id: "hm4", name: "Lambe Turah", handle: "lambe_turah", platform: "instagram", followers: "12.8M", region: "Regional", category: "Entertainment", engagementRate: "2.8", price: "Rp 25.000.000", verified: true, hue: 220 },
  { id: "hm5", name: "City Of Bandung", handle: "cityofbdg", platform: "instagram", followers: "157K", region: "Jawa Barat", category: "Travel", engagementRate: "6.1", price: "Rp 4.000.000", verified: false, hue: 150 },
  { id: "hm6", name: "Ini Surabaya", handle: "ini_surabaya", platform: "instagram", followers: "529K", region: "Jawa Timur", category: "News", engagementRate: "4.5", price: "Rp 6.000.000", verified: true, hue: 240 },
  { id: "hm7", name: "Makasar Info", handle: "omsottamks", platform: "instagram", followers: "400K", region: "Sulawesi", category: "News", engagementRate: "3.9", price: "Rp 5.500.000", verified: true, hue: 260 },
  { id: "hm8", name: "Info Banjarmasin", handle: "info_kejadian_banjarmasin", platform: "instagram", followers: "346K", region: "Kalimantan", category: "News", engagementRate: "5.0", price: "Rp 5.000.000", verified: false, hue: 130 },
  { id: "hm9", name: "Palembang Info", handle: "palembanginfo", platform: "instagram", followers: "298K", region: "Sumatra", category: "News", engagementRate: "4.3", price: "Rp 4.500.000", verified: false, hue: 100 },
  { id: "hm10", name: "Tabanan Update", handle: "tabanan_update", platform: "instagram", followers: "178K", region: "Bali", category: "Travel", engagementRate: "5.8", price: "Rp 3.500.000", verified: false, hue: 50 },
];

const HM_REGIONS = ["Semua", "DKI Jakarta", "Jabodetabek", "Regional", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Sumatra", "Sulawesi", "Kalimantan", "Bali"];

function HomelessMediaTab() {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("Semua");

  const filtered = HOMELESS_MEDIA_DATA.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.handle.toLowerCase().includes(search.toLowerCase());
    const matchRegion = regionFilter === "Semua" || m.region === regionFilter;
    return matchSearch && matchRegion;
  });

  const totalFollowers = HOMELESS_MEDIA_DATA.reduce((sum, m) => {
    const f = m.followers.replace(/[+MmKk\s]/g, "").toLowerCase();
    if (f.includes("m")) return sum + parseFloat(f) * 1000000;
    if (f.includes("k")) return sum + parseFloat(f) * 1000;
    return sum + parseFloat(f) || 0;
  }, 0);

  return (
    <div className="flex flex-col h-full">
      {/* Stats */}
      <div className="px-3 pt-2.5 pb-2 border-b border-white/5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1.5">
          <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "var(--ch-surface)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(249,115,22,0.1)" }}>
              <Megaphone className="w-5 h-5" style={{ color: "#F97316" }} />
            </div>
            <div>
              <p className="text-[18px] font-bold" style={{ color: "var(--ch-text)" }}>{HOMELESS_MEDIA_DATA.length}</p>
              <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Total Media</p>
            </div>
          </div>
          <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "var(--ch-surface)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.1)" }}>
              <Users className="w-5 h-5" style={{ color: "#10B981" }} />
            </div>
            <div>
              <p className="text-[18px] font-bold" style={{ color: "var(--ch-text)" }}>{(totalFollowers / 1000000).toFixed(1)}M</p>
              <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Total Followers</p>
            </div>
          </div>
          <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "var(--ch-surface)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.1)" }}>
              <MapPin className="w-5 h-5" style={{ color: "#3B82F6" }} />
            </div>
            <div>
              <p className="text-[18px] font-bold" style={{ color: "var(--ch-text)" }}>{new Set(HOMELESS_MEDIA_DATA.map(m => m.region)).size}</p>
              <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Regions</p>
            </div>
          </div>
          <div className="rounded-xl p-3 flex items-center gap-3" style={{ background: "var(--ch-surface)" }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(139,92,246,0.1)" }}>
              <TrendingUp className="w-5 h-5" style={{ color: "#8B5CF6" }} />
            </div>
            <div>
              <p className="text-[18px] font-bold" style={{ color: "var(--ch-text)" }}>4.5%</p>
              <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Avg ER</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-3 sm:px-4 pt-3 pb-0 bg-[#0B1120] flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:flex-1 sm:min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Find Homeless Media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border"
            style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)", background: "var(--ch-surface)" }}
          />
        </div>
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="px-3 py-2 text-[13px] font-semibold rounded-lg border cursor-pointer"
          style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)", background: "var(--ch-surface)" }}
        >
          {HM_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {/* Card Grid */}
      <div className="flex-1 overflow-auto p-3 sm:p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-3">
          {filtered.map((m) => {
            const gradientBg = `hsl(${m.hue}, 55%, 45%)`;
            return (
              <div
                key={m.id}
                className="rounded-[14px] overflow-hidden border transition-all cursor-pointer"
                style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--ch-shadow-md)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = "translateY(0)"; (e.currentTarget as HTMLElement).style.boxShadow = "var(--ch-shadow-sm)"; }}
              >
                {/* Photo header */}
                <div className="relative w-full h-[140px] overflow-hidden" style={{ background: gradientBg }}>
                  <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold text-white/30 select-none">
                    {m.name[0]}
                  </div>
                  {m.verified && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500 text-white">
                      <CheckCircle className="w-3 h-3" /> Verified
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <button className="p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors">
                      <Heart className="w-3.5 h-3.5 text-white/70" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="text-[13px] font-semibold truncate" style={{ color: "var(--ch-text)" }}>{m.name}</p>
                  </div>
                  <p className="text-[11px] mb-2" style={{ color: "var(--ch-text-muted)" }}>@{m.handle}</p>

                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-medium" style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>{m.category}</span>
                    <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{m.region}</span>
                  </div>

                  <div className="flex items-center gap-3 text-[11px] mb-2" style={{ color: "var(--ch-text-muted)" }}>
                    <span className="font-semibold">{m.followers} followers</span>
                    <span className="font-semibold">{m.engagementRate}% ER</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "var(--ch-border)" }}>
                    <span className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>{m.price}</span>
                    <button className="px-3 py-1.5 rounded-lg text-[11px] font-bold" style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)", border: "1.5px solid var(--ch-primary-100)" }}>
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-500">
            <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">Tidak ada media ditemukan</p>
          </div>
        )}
      </div>
    </div>
  );
}

const IDN_MEDIA_DATA = [
  { rank: 1, name: "Detik.com", rate: 6500000000, url: "https://detik.com" },
  { rank: 2, name: "Tribunnews.com", rate: 3500000000, url: "https://tribunnews.com" },
  { rank: 3, name: "Kompas.com", rate: 7000000000, url: "https://kompas.com" },
  { rank: 4, name: "Cnnindonesia.com", rate: 7500000000, url: "https://cnnindonesia.com" },
  { rank: 5, name: "Grid.id", rate: 6500000000, url: "https://grid.id" },
  { rank: 6, name: "Suara.com", rate: 4500000000, url: "https://suara.com" },
  { rank: 7, name: "Liputan6.com", rate: 5000000000, url: "https://liputan6.com" },
  { rank: 8, name: "CNBCIndonesia.com", rate: 7500000000, url: "https://cnbcindonesia.com" },
  { rank: 9, name: "Pikiran-rakyat.com", rate: 3500000000, url: "https://pikiran-rakyat.com" },
  { rank: 10, name: "Merdeka.com", rate: 3500000000, url: "https://merdeka.com" },
  { rank: 11, name: "Kumparan.com", rate: 3500000000, url: "https://kumparan.com" },
  { rank: 12, name: "Liputan6.com", rate: 3500000000, url: "https://liputan6.com" },
  { rank: 13, name: "CNBCIndonesia.com", rate: 7000000000, url: "https://cnbcindonesia.com" },
  { rank: 14, name: "Sindonews.com", rate: 4500000000, url: "https://sindonews.com" },
  { rank: 15, name: "IDNTimes.com", rate: 6000000000, url: "https://idntimes.com" },
  { rank: 16, name: "Okezone.com", rate: 5500000000, url: "https://okezone.com" },
  { rank: 17, name: "Viva.co.id", rate: 5000000000, url: "https://viva.co.id" },
  { rank: 18, name: "Tempo.co", rate: 5000000000, url: "https://tempo.co" },
  { rank: 19, name: "Kontan.co.id", rate: 6000000000, url: "https://kontan.co.id" },
  { rank: 20, name: "Republika.co.id", rate: 3500000000, url: "https://republika.co.id" },
  { rank: 21, name: "Kompas.tv", rate: 5500000000, url: "https://kompas.tv" },
  { rank: 22, name: "Jpnn.com", rate: 3000000000, url: "https://jpnn.com" },
  { rank: 23, name: "Bisnis.com", rate: 6500000000, url: "https://bisnis.com" },
  { rank: 24, name: "Tirto.id", rate: 3500000000, url: "https://tirto.id" },
  { rank: 25, name: "Disway.id", rate: 3000000000, url: "https://disway.id" },
  { rank: 26, name: "Inews.id", rate: 4500000000, url: "https://inews.id" },
  { rank: 27, name: "Jawapos.com", rate: 4000000000, url: "https://jawapos.com" },
  { rank: 28, name: "Katadata.co.id", rate: 3800000000, url: "https://katadata.co.id" },
  { rank: 29, name: "Suaramerdeka.com", rate: 2000000000, url: "https://suaramerdeka.com" },
  { rank: 30, name: "Antaranews.com", rate: 5000000000, url: "https://antaranews.com" },
  { rank: 31, name: "Tvonenews.com", rate: 7000000000, url: "https://tvonenews.com" },
  { rank: 32, name: "Wartaekonomi.co.id", rate: 2500000000, url: "https://wartaekonomi.co.id" },
  { rank: 33, name: "Mediaindonesia.com", rate: 3500000000, url: "https://mediaindonesia.com" },
  { rank: 34, name: "Hops.id", rate: 5000000000, url: "https://hops.id" },
  { rank: 35, name: "Medcom.id", rate: 3500000000, url: "https://medcom.id" },
  { rank: 36, name: "Beritasatu.com", rate: 3500000000, url: "https://beritasatu.com" },
  { rank: 37, name: "RMOL.id", rate: 2000000000, url: "https://rmol.id" },
  { rank: 38, name: "Investor.id", rate: 3500000000, url: "https://investor.id" },
  { rank: 39, name: "VOI.id", rate: 3000000000, url: "https://voi.id" },
  { rank: 40, name: "Akurat.co", rate: 1500000000, url: "https://akurat.co" },
  { rank: 41, name: "IDXChannel.com", rate: 4000000000, url: "https://idxchannel.com" },
  { rank: 42, name: "Antvklik.com", rate: 6000000000, url: "https://antvklik.com" },
  { rank: 43, name: "Poskota.co.id", rate: 2000000000, url: "https://poskota.co.id" },
  { rank: 44, name: "FortuneIDN.com", rate: 7000000000, url: "https://fortuneidn.com" },
  { rank: 45, name: "Tagar.id", rate: 1500000000, url: "https://tagar.id" },
  { rank: 46, name: "Metrotvnews.com", rate: 2500000000, url: "https://metrotvnews.com" },
  { rank: 47, name: "Harianterbit.com", rate: 2000000000, url: "https://harianterbit.com" },
  { rank: 48, name: "Gatra.com", rate: 2500000000, url: "https://gatra.com" },
  { rank: 49, name: "RM.id", rate: 2000000000, url: "https://rm.id" },
  { rank: 50, name: "JakartaDaily.id", rate: 1500000000, url: "https://indonesia.jakartadaily.id" },
];

function formatIdnRate(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1)}M`;
  return `Rp ${(n / 1_000_000).toLocaleString("id-ID")}jt`;
}

function getTierColor(rate: number) {
  if (rate >= 6_000_000_000) return { bg: "rgba(16,185,129,0.15)", text: "#10B981" };
  if (rate >= 3_500_000_000) return { bg: "rgba(245,158,11,0.15)", text: "#F59E0B" };
  return { bg: "rgba(148,163,184,0.15)", text: "#94A3B8" };
}

export default function Marketplace() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const restoredStateRef = useRef<MarketplaceStoredState | null>(readMarketplaceState());
  const pendingScrollTopRef = useRef(restoredStateRef.current?.scrollTop ?? 0);
  const searchRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const [filters, setFilters] = useState<CreatorListParams>(() => ({
    page: 1,
    pageSize: 20,
    minFollowers: 1000,
    maxFollowers: 10000,
    verified: true,
    ...restoredStateRef.current?.filters,
    city: searchParams.get("city") ?? restoredStateRef.current?.filters?.city,
  }));
  const [search, setSearch] = useState(() => searchParams.get("search") ?? restoredStateRef.current?.search ?? "");
  const debouncedSearch = useDebouncedValue(search, 300);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedCreatorsById, setSelectedCreatorsById] = useState<Record<string, Creator>>({});
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [listView, setListView] = useState(() => restoredStateRef.current?.listView ?? false);
  const [cityOptions, setCityOptions] = useState<string[]>(DEFAULT_CITIES);
  const [activePlatforms, setActivePlatforms] = useState<string[]>([]);
  const platformFilterActive = activePlatforms.length > 0;
  const [selectedServices, setSelectedServices] = useState<Record<string, boolean>>({});
  const [servicesOpen, setServicesOpen] = useState(false);

  const toggleService = (svc: string) => {
    setSelectedServices((prev) => ({ ...prev, [svc]: !prev[svc] }));
  };

  useEffect(() => {
    fetch(KABUPATEN_KOTA_URL)
      .then((r) => r.json())
      .then((topo: any) => {
        const obj = topo.objects.gadm36_IDN_2;
        const geo = topojson.feature(topo, obj) as any;
        const names = new Set<string>();
        const features = geo.features ?? [geo];
        for (const f of features) {
          const name = f.properties?.NAME_2;
          if (name) names.add(name);
        }
        setCityOptions(Array.from(names).sort());
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const hasUpdates =
      searchParams.has("search") ||
      searchParams.has("city") ||
      searchParams.has("topRated") ||
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

  const [followersVal, setFollowersVal] = useState(() => restoredStateRef.current?.followersVal ?? DEFAULT_CREATOR_TIER);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showMobileBrief, setShowMobileBrief] = useState(false);
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showAddCreator, setShowAddCreator] = useState(false);
  const [campaignForm, setCampaignForm] = useState({ title: "", description: "", budget: "" });

  const [profileCreator, setProfileCreator] = useState<Creator | null>(null);

  const advMinPrice = useRef("");
  const advMaxPrice = useRef("");

  const [activeTab, setActiveTab] = useState(() => restoredStateRef.current?.activeTab ?? "creators");
  const [idnSearch, setIdnSearch] = useState("");

  const createMutation = useCreateCampaign();

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfiniteCreators({ ...filters, search: debouncedSearch || undefined });
  const { data: stats, isLoading: statsLoading, dataUpdatedAt } = useMarketplaceStats();

  const creators = (() => {
    const seen = new Set<string>();
    const merged: Creator[] = [];

    for (const page of data?.pages ?? []) {
      for (const creator of page.data) {
        if (seen.has(creator.id)) continue;
        seen.add(creator.id);
        merged.push(creator);
      }
    }

    return merged;
  })();

  const filteredCreators = (() => {
    let result = activePlatforms.length > 0
      ? creators.filter((c) => c.platforms?.some((p) => activePlatforms.includes(p)))
      : creators;
    if (showFavorites) {
      result = result.filter((c) => favoriteIds.includes(c.id));
    }
    return result;
  })();
  const saveMarketplaceState = useCallback(() => {
    if (typeof window === "undefined") return;
    const scrollTop = getMarketplaceScrollElement()?.scrollTop ?? 0;
    const state: MarketplaceStoredState = {
      filters,
      search,
      followersVal,
      listView,
      activeTab,
      scrollTop,
    };
    window.sessionStorage.setItem(MARKETPLACE_STATE_KEY, JSON.stringify(state));
  }, [activeTab, filters, followersVal, listView, search]);

  useEffect(() => () => saveMarketplaceState(), [saveMarketplaceState]);

  useEffect(() => {
    const scrollTop = pendingScrollTopRef.current;
    if (activeTab !== "creators" || !scrollTop || isLoading) return;

    const scrollElement = getMarketplaceScrollElement();
    if (!scrollElement) return;

    const needsMoreRows = scrollElement.scrollHeight < scrollTop + scrollElement.clientHeight;
    if (needsMoreRows && hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
      return;
    }

    requestAnimationFrame(() => {
      scrollElement.scrollTo({ top: scrollTop });
      pendingScrollTopRef.current = 0;
    });
  }, [activeTab, creators.length, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading]);

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || activeTab !== "creators" || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          void fetchNextPage();
        }
      },
      { root: null, rootMargin: "700px 0px", threshold: 0 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [activeTab, fetchNextPage, hasNextPage, isFetchingNextPage]);

  const toggleSelect = (creator: Creator) => {
    if (selectedIds.includes(creator.id)) {
      setSelectedIds((prev) => prev.filter((x) => x !== creator.id));
      setSelectedCreatorsById((prev) => {
        const next = { ...prev };
        delete next[creator.id];
        return next;
      });
      return;
    }

    setSelectedCreatorsById((prev) => ({ ...prev, [creator.id]: creator }));
    setSelectedIds((prev) => [...prev, creator.id]);
  };

  const clearSelection = () => {
    setSelectedIds([]);
    setSelectedCreatorsById({});
  };

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const resetFilters = () => {
    pendingScrollTopRef.current = 0;
    window.sessionStorage.removeItem(MARKETPLACE_STATE_KEY);
    setFilters({ page: 1, pageSize: 20, minFollowers: 1000, maxFollowers: 10000 });
    setSearch("");
    setFollowersVal(DEFAULT_CREATOR_TIER);
    setActivePlatforms([]);
  };

  const togglePlatform = (p: string) => {
    setActivePlatforms((prev) =>
      prev.includes(p) ? [] : [p]
    );
    setSelectedServices({});
  };

  const applyFollowers = (val: string) => {
    setFollowersVal(val);
    const { min, max } = parseRange(val);
    setFilters((f) => ({ ...f, minFollowers: min, maxFollowers: max, page: 1 }));
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
    clearSelection();
    toast.success("Campaign created successfully!");
  };

  const selectedCreators = selectedIds
    .map((id) => selectedCreatorsById[id] ?? creators.find((creator) => creator.id === id))
    .filter((creator): creator is Creator => Boolean(creator));

  const briefFooter = (
    <div id="run-campaign-btn" className="p-4 border-t border-white/10 space-y-3">
      <Button className="w-full" onClick={() => { setShowMobileBrief(false); setShowCreateCampaign(true); }}>Run Campaign</Button>
    </div>
  );

  useEffect(() => {
    setIdnSearch("");
  }, [activeTab]);

  const tabs = [
    { id: "creators", label: "Content Creators", icon: Users },
    { id: "homeless", label: "Homeless Media", icon: Megaphone },
    { id: "podcast", label: "Podcast & Streaming", icon: Mic },
    { id: "live-shopping", label: "Live Shopping", icon: Video },
    { id: "publishers", label: "Media Publishers", icon: Building2 },
  ];

  return (
    <div className="flex flex-col xl:flex-row h-full bg-[#070B14]">
      <div className={`flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden ${selectedIds.length > 0 ? "pb-20 xl:pb-0" : ""}`}>
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
                  className={`flex-1 flex items-center justify-center gap-1 px-4 py-2.5 text-[13px] font-semibold transition-all duration-200 relative ${
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
        {/* Filters row 1 */}
        <div className="px-3 sm:px-4 pt-3 pb-2 bg-[#0B1120] flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:flex-1 sm:min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              ref={searchRef}
              placeholder="Find Creators..."
              className="pl-9 bg-[#0C1524] text-slate-300 border-white/10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={followersVal} onValueChange={applyFollowers}>
            <SelectTrigger className="w-full sm:w-36"><SelectValue placeholder="All Tiers" /></SelectTrigger>
            <SelectContent>
              {FOLLOWERS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.category ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, category: v === "all" ? undefined : v, page: 1 }))}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.city ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, city: v === "all" ? undefined : v, page: 1 }))}>
            <SelectTrigger className="w-full sm:w-40"><SelectValue placeholder="City" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {cityOptions.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Filters row 2 — platform buttons */}
        <div className="px-3 sm:px-4 py-2 bg-[#0B1120] flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-md text-[13px] font-medium border transition-all ${
              showFavorites
                ? "border-orange-500/50 text-white"
                : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
            }`}
            style={showFavorites
              ? { background: "var(--ch-orange)", borderColor: "var(--ch-orange)" }
              : { background: "var(--ch-surface)" }
            }
          >
            <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "#E11D48" }}>
              <Heart className="w-3.5 h-3.5 text-white fill-white" />
            </span>
            Favorites
          </button>

          <div className="flex-1" />

          {/* Platform filter buttons */}
          {[
            { id: "instagram", label: "Instagram", color: "#E1306C",
              icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
            { id: "tiktok", label: "TikTok", color: "#000000",
              icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg> },
            { id: "youtube", label: "YouTube", color: "#FF0000",
              icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg> },
            { id: "x", label: "X (Twitter)", color: "#000000",
              icon: <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
          ].map((plat) => {
            const active = activePlatforms.includes(plat.id);
            return (
              <button
                key={plat.id}
                onClick={() => togglePlatform(plat.id)}
                className={`flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-md text-[13px] font-medium border transition-all ${
                  active
                    ? "border-orange-500/50 text-white"
                    : "border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300"
                }`}
                style={active
                  ? { background: "var(--ch-orange)", borderColor: "var(--ch-orange)" }
                  : { background: "var(--ch-surface)" }
                }
              >
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: plat.color }}
                >
                  {plat.icon}
                </span>
                {plat.label}
              </button>
            );
          })}

          <button
            onClick={resetFilters}
            className="flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-md text-[13px] font-medium border border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-300 transition-all cursor-pointer"
            style={{ background: "var(--ch-surface)" }}
          >
            <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "#475569" }}>
              <RotateCcw className="w-3.5 h-3.5 text-white" />
            </span>
            Reset
          </button>
        </div>

        {/* Row 3: sticky results info + actions */}
        <div className="sticky top-0 z-30 px-3 sm:px-4 py-2 bg-[#0B1120]/95 backdrop-blur border-b border-white/10 shadow-[0_10px_28px_rgba(0,0,0,0.28)] flex flex-wrap items-center gap-2">
          <div className="flex-1 min-w-[200px]">
            <p className="text-sm font-bold text-white">
              <AnimatedNumber value={`${stats?.totalCreators ?? 0} Creators`} loading={statsLoading} />
            </p>
            <p className="text-[10px] text-slate-500">
              {statsLoading ? "Loading..." : `Last updated: ${dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "–"}`}
            </p>
          </div>

          <Button size="sm" onClick={() => setShowAddCreator(true)} className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
            <UserPlus className="w-3.5 h-3.5" /> Add Creator
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9 relative group" onClick={() => setShowAdvanced(true)}>
            <SlidersHorizontal className="w-4 h-4" />
            <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-white whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">Filter results</span>
          </Button>
          <div className="flex border border-white/10 rounded-md relative">
            <button onClick={() => setListView(false)} className={`p-2 group relative ${!listView ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}>
              <LayoutGrid className="w-4 h-4" />
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-white whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">Show as grid</span>
            </button>
            <button onClick={() => setListView(true)} className={`p-2 group relative ${listView ? "bg-white/10 text-white" : "text-slate-400 hover:text-white"}`}>
              <List className="w-4 h-4" />
              <span className="absolute -top-9 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-white whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100">Show as list</span>
            </button>
          </div>
        </div>

        {/* Grid / List */}
        <div className="flex-1 overflow-auto p-3 sm:p-4">
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
          ) : creators.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-slate-500">
              <Users className="w-12 h-12 mb-3 opacity-40" />
              <p className="font-medium">No creators found</p>
              <p className="text-sm mt-1">Try adjusting your filters</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>Reset Filters</Button>
            </div>
          ) : (
            <div className={listView ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3"}>
              {filteredCreators.map((creator) => (
                <CreatorCard
                  key={creator.id}
                  creator={creator}
                  selected={selectedIds.includes(creator.id)}
                  favorited={favoriteIds.includes(creator.id)}
                  onToggle={() => toggleSelect(creator)}
                  onCardClick={() => {
                    saveMarketplaceState();
                    navigate(`/dashboard/creators/${creator.id}`);
                  }}
                  onFavorite={() => toggleFavorite(creator.id)}
                  listView={listView}
                  onCityClick={(city) => setFilters((f) => ({ ...f, city, page: 1 }))}
                  onCategoryClick={(category) => setFilters((f) => ({ ...f, category, page: 1 }))}
                  platformFilterActive={platformFilterActive}
                />
              ))}
            </div>
          )}

          {!isLoading && creators.length > 0 && (
            <div ref={loadMoreRef} className="flex justify-center py-6">
              {hasNextPage ? (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Loader2 className={`w-4 h-4 ${isFetchingNextPage ? "animate-spin" : ""}`} />
                  {isFetchingNextPage
                    ? "Loading more creators..."
                    : `Showing ${creators.length} creators`}
                </div>
              ) : (
                <span className="text-xs text-slate-500">
                  Showing all {creators.length} creators
                </span>
              )}
            </div>
          )}
        </div>
          </>
        ) : activeTab === "homeless" ? (
          <HomelessMediaTab />
        ) : activeTab === "podcast" ? (
          <div className="p-3 sm:p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {[
                { name: "Deddy Corbuzier", handle: "@mastercorbuzier", platform: "YouTube", followers: "21.5M", category: "Podcast", viewers: "25K live", img: "https://i.pravatar.cc/150?u=deddy" },
                { name: "Vincent Verhaag", handle: "@vincentverhaag", platform: "YouTube", followers: "3.2M", category: "Podcast", viewers: "8K live", img: "https://i.pravatar.cc/150?u=vincent" },
                { name: "Jerome Polin", handle: "@jeromepolin", platform: "YouTube", followers: "11.7M", category: "Education", viewers: "9K live", img: "https://i.pravatar.cc/150?u=jerome" },
                { name: "Reza Arap", handle: "@raffiahr", platform: "YouTube", followers: "14.6M", category: "Entertainment", viewers: "7K live", img: "https://i.pravatar.cc/150?u=reza" },
                { name: "Bayu Skak", handle: "@bayuskak", platform: "YouTube", followers: "12.3M", category: "Comedy", viewers: "6K live", img: "https://i.pravatar.cc/150?u=bayu" },
                { name: "Gritte Agatha", handle: "@gritteagatha", platform: "YouTube", followers: "5.8M", category: "Podcast", viewers: "4.5K live", img: "https://i.pravatar.cc/150?u=gritte" },
              ].map((p, i) => (
                <div key={i} className="rounded-xl border overflow-hidden hover:ring-2 hover:ring-orange-500/50 transition-all cursor-pointer" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                  <div className="relative h-40 overflow-hidden">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white">{p.viewers}</span>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-[13px] font-bold truncate" style={{ color: "var(--ch-text)" }}>{p.name}</p>
                    <p className="text-[11px] truncate" style={{ color: "var(--ch-text-muted)" }}>{p.handle}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>{p.platform}</span>
                      <span className="text-[11px] font-semibold" style={{ color: "var(--ch-text)" }}>{p.followers}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : activeTab === "publishers" ? (
          <div className="p-3 sm:p-4 space-y-3">
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="rounded-xl border p-3" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{IDN_MEDIA_DATA.length}</p>
                <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Media Nasional</p>
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>
                  Rp {(Math.round(IDN_MEDIA_DATA.reduce((s, m) => s + m.rate, 0) / IDN_MEDIA_DATA.length / 1_000_000_000 * 10) / 10).toFixed(1)}M
                </p>
                <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Rate Rata-rata</p>
              </div>
              <div className="rounded-xl border p-3" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{IDN_MEDIA_DATA.filter((m) => m.rate >= 6_000_000_000).length}</p>
                <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Premium (6M+)</p>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Cari media nasional..." value={idnSearch} onChange={(e) => setIdnSearch(e.target.value)} className="pl-9 bg-[#0C1524] text-slate-300 border-white/10" />
            </div>

            {/* Table */}
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Rank</th>
                      <th className="text-left px-4 py-2.5 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Media Nasional</th>
                      <th className="text-right px-4 py-2.5 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Rate Backlink (IDR)</th>
                      <th className="text-center px-4 py-2.5 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Tier</th>
                      <th className="text-right px-4 py-2.5 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {IDN_MEDIA_DATA.filter((m) =>
                      m.name.toLowerCase().includes(idnSearch.toLowerCase())
                    ).map((m) => {
                      const tc = getTierColor(m.rate);
                      return (
                        <tr key={`${m.rank}-${m.name}`} className="border-b last:border-b-0 hover:bg-white/3 transition-colors" style={{ borderColor: "var(--ch-border)" }}>
                          <td className="px-4 py-2 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{m.rank}</td>
                          <td className="px-4 py-2">
                            <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{m.name}</span>
                          </td>
                          <td className="px-4 py-2 text-right">
                            <span className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{formatIdnRate(m.rate)}</span>
                          </td>
                          <td className="px-4 py-2 text-center">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: tc.bg, color: tc.text }}>
                              {m.rate >= 6_000_000_000 ? "Premium" : m.rate >= 3_500_000_000 ? "Standard" : "Basic"}
                            </span>
                          </td>
                          <td className="px-4 py-2 text-right">
                            <a href={m.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--ch-primary)" }}>
                              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === "live-shopping" ? (
          <div className="p-3 sm:p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {[
                { name: "Ria Ricis", handle: "@riaricis1795", platform: "TikTok", followers: "33.2M", category: "Entertainment", viewers: "12K live", img: "https://i.pravatar.cc/150?u=riaricis" },
                { name: "Atta Halilintar", handle: "@attahalilintar", platform: "YouTube", followers: "17.8M", category: "Lifestyle", viewers: "8.5K live", img: "https://i.pravatar.cc/150?u=atta" },
                { name: "Indy Barends", handle: "@indybarends", platform: "TikTok", followers: "8.1M", category: "Beauty", viewers: "15K live", img: "https://i.pravatar.cc/150?u=indy" },
                { name: "Deddy Corbuzier", handle: "@mastercorbuzier", platform: "YouTube", followers: "21.5M", category: "Podcast", viewers: "25K live", img: "https://i.pravatar.cc/150?u=deddy" },
                { name: "Bayu Skak", handle: "@bayuskak", platform: "YouTube", followers: "12.3M", category: "Comedy", viewers: "6K live", img: "https://i.pravatar.cc/150?u=bayu" },
                { name: "Nissa Sabyan", handle: "@nissasabyan", platform: "Instagram", followers: "9.4M", category: "Music", viewers: "4.2K live", img: "https://i.pravatar.cc/150?u=nissa" },
                { name: "Jerome Polin", handle: "@jeromepolin", platform: "TikTok", followers: "11.7M", category: "Education", viewers: "9K live", img: "https://i.pravatar.cc/150?u=jerome" },
                { name: " Jess No Limit", handle: "@jessnolimit", platform: "YouTube", followers: "10.2M", category: "Gaming", viewers: "11K live", img: "https://i.pravatar.cc/150?u=jess" },
                { name: "Reza Arap", handle: "@raffiahr", platform: "YouTube", followers: "14.6M", category: "Entertainment", viewers: "7K live", img: "https://i.pravatar.cc/150?u=reza" },
                { name: "Tissa Biani", handle: "@tissabiani", platform: "TikTok", followers: "6.8M", category: "Fashion", viewers: "5.3K live", img: "https://i.pravatar.cc/150?u=tissa" },
                { name: "Baim Wong", handle: "@baimwong", platform: "YouTube", followers: "15.1M", category: "Vlog", viewers: "3.8K live", img: "https://i.pravatar.cc/150?u=baim" },
                { name: "Ayu Ting Ting", handle: "@aytingting_", platform: "Instagram", followers: "7.9M", category: "Music", viewers: "6.1K live", img: "https://i.pravatar.cc/150?u=ayu" },
              ].map((p, i) => (
                <div key={i} className="rounded-xl border overflow-hidden hover:ring-2 hover:ring-orange-500/50 transition-all cursor-pointer" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                  <div className="relative h-40 overflow-hidden">
                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> LIVE
                      </span>
                    </div>
                    <div className="absolute top-2 right-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white">{p.viewers}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      <p className="text-white text-[13px] font-bold">{p.name}</p>
                      <p className="text-white/70 text-[11px]">{p.handle}</p>
                    </div>
                  </div>
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
                        background: p.platform === "YouTube" ? "rgba(255,0,0,0.1)" : p.platform === "TikTok" ? "rgba(0,0,0,0.1)" : "rgba(225,48,108,0.1)",
                        color: p.platform === "YouTube" ? "#FF0000" : p.platform === "TikTok" ? "#000" : "#E1306C",
                      }}>{p.platform}</span>
                      <span className="text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{p.followers} followers</span>
                    </div>
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>{p.category}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
            <p className="text-sm font-bold truncate text-white">{selectedIds.length} Creator{selectedIds.length !== 1 ? "s" : ""} Invited</p>
          </div>
          <Button size="sm" onClick={() => setShowMobileBrief(true)}>View Brief</Button>
        </div>
      )}

      {/* Campaign Brief Panel — desktop */}
      <aside className="hidden xl:flex w-[312px] shrink-0 flex-col bg-[#111827] border-l border-white/10">
        {/* Top: services + Run Campaign */}
        <div className="shrink-0 border-b border-white/10">
          {/* Platform services */}
          {activePlatforms.length > 0 && activePlatforms.map((platId) => {
            const services = PLATFORM_SERVICES[platId] ?? [];
            if (services.length === 0) return null;
            return (
              <div key={platId} className="p-4 text-left">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className="w-full flex items-center justify-between mb-3 cursor-pointer"
                >
                  <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-primary)" }}>Available Services</span>
                  <ChevronDown
                    className="w-4 h-4 shrink-0 transition-transform duration-200"
                    style={{ color: "var(--ch-primary)", transform: servicesOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  />
                </button>
                {servicesOpen && (
                  <div className="space-y-2">
                    {services.map((svc) => (
                      <label key={svc} className="flex items-center gap-2.5 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={!!selectedServices[svc]}
                          onChange={() => toggleService(svc)}
                          className="w-4 h-4 rounded border-2 cursor-pointer accent-orange-500 shrink-0"
                          style={{ borderColor: "var(--ch-border)" }}
                        />
                        <span className="text-[12px] text-slate-400 group-hover:text-slate-300 transition-colors">{svc}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          {activePlatforms.length === 0 && (
            <div className="p-4 text-center text-slate-500 text-[11px] leading-snug">
              <p>Select a platform above to see available services</p>
            </div>
          )}
          {briefFooter}
        </div>

        {/* Scrollable: selected creators */}
        <div className="flex-1 overflow-auto p-4">
          <div className={listView ? "flex flex-col gap-2 pb-3" : "grid grid-cols-2 gap-2 pb-3"}>
            {selectedCreators.map((c) => (
              <div key={c.id} className={`relative p-2.5 bg-white/5 rounded-xl text-center group ${listView ? "flex items-center gap-3 text-left" : ""}`}>
                <button
                  onClick={() => toggleSelect(c)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/30"
                >
                  <X className="w-3 h-3 text-slate-400" />
                </button>
                <div className={`rounded-full bg-white/10 flex items-center justify-center font-semibold text-slate-300 overflow-hidden ${listView ? "w-8 h-8 shrink-0" : "w-9 h-9 mx-auto"}`}>
                  {c.imageUrl ? <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" /> : c.name[0]}
                </div>
                <div className={listView ? "min-w-0" : ""}>
                  <p className="text-[12px] font-semibold text-white truncate mt-1.5">{c.name}</p>
                  <p className="text-[12px] text-slate-500 truncate">{c.handle}</p>
                  <p className="text-[12px] text-slate-400 truncate">{c.followersText} followers</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky bottom: Invited Creators card */}
          {selectedCreators.length > 0 && (
            <div className="sticky bottom-0 -mx-4 p-4 bg-[#111827] border-t border-white/10">
              <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 flex items-center justify-between">
                <div>
                  <p className="text-[12px] font-bold text-orange-400">Invited Creators</p>
                  <p className="text-[18px] font-extrabold text-white">{selectedCreators.length}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => document.getElementById('run-campaign-btn')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    ↑ Run Campaign
                  </button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelection}
                    className="text-[11px] font-semibold border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* Campaign Brief — mobile sheet */}
      <Dialog open={showMobileBrief} onOpenChange={setShowMobileBrief}>
        <DialogContent className="max-w-lg p-0 gap-0 flex flex-col max-h-[85dvh]">
          {/* Sticky top: services + Run Campaign */}
          <div className="shrink-0 border-b" style={{ borderColor: "var(--ch-border)" }}>
            {activePlatforms.length > 0 && activePlatforms.map((platId) => {
              const services = PLATFORM_SERVICES[platId] ?? [];
              if (services.length === 0) return null;
              return (
                <div key={platId} className="p-4 text-left">
                  <button
                    onClick={() => setServicesOpen(!servicesOpen)}
                    className="w-full flex items-center justify-between mb-3 cursor-pointer"
                  >
                    <span className="text-[12px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-primary)" }}>Available Services</span>
                    <ChevronDown
                      className="w-4 h-4 shrink-0 transition-transform duration-200"
                      style={{ color: "var(--ch-primary)", transform: servicesOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                    />
                  </button>
                  {servicesOpen && (
                    <div className="space-y-2">
                      {services.map((svc) => (
                        <label key={svc} className="flex items-center gap-2.5 cursor-pointer group">
                          <input
                            type="checkbox"
                            checked={!!selectedServices[svc]}
                            onChange={() => toggleService(svc)}
                            className="w-4 h-4 rounded border-2 cursor-pointer accent-orange-500 shrink-0"
                            style={{ borderColor: "var(--ch-border)" }}
                          />
                          <span className="text-[12px] transition-colors" style={{ color: "var(--ch-text-muted)" }}>{svc}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            {activePlatforms.length === 0 && (
              <div className="p-4 text-center text-[11px] leading-snug" style={{ color: "var(--ch-text-muted)" }}>
                <p>Select a platform to see available services</p>
              </div>
            )}
            <div className="p-4 border-t" style={{ borderColor: "var(--ch-border)" }}>
              <Button className="w-full" onClick={() => { setShowMobileBrief(false); setShowCreateCampaign(true); }}>Run Campaign</Button>
            </div>

            {/* Invited Creators count card */}
            {selectedCreators.length > 0 && (
              <div className="px-4 pb-4">
                <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-3 flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-bold text-orange-400">Invited Creators</p>
                    <p className="text-[18px] font-extrabold text-white">{selectedCreators.length}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelection}
                    className="text-[11px] font-semibold border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 hover:border-red-500/50"
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Scrollable: selected creators */}
          <div className="flex-1 overflow-auto p-4">
            <div className={listView ? "flex flex-col gap-2 pb-3" : "grid grid-cols-2 gap-2 pb-3"}>
              {selectedCreators.map((c) => (
                <div key={c.id} className={`relative p-2.5 bg-slate-50 rounded-xl text-center group ${listView ? "flex items-center gap-3 text-left" : ""}`}>
                  <button
                    onClick={() => toggleSelect(c)}
                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                  >
                    <X className="w-3 h-3 text-slate-400" />
                  </button>
                  <div className={`rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-600 overflow-hidden ${listView ? "w-8 h-8 shrink-0" : "w-9 h-9 mx-auto"}`}>
                    {c.imageUrl ? <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" /> : c.name[0]}
                  </div>
                  <div className={listView ? "min-w-0" : ""}>
                    <p className="text-[12px] font-semibold text-slate-800 truncate mt-1.5">{c.name}</p>
                    <p className="text-[12px] text-slate-500 truncate">{c.handle}</p>
                    <p className="text-[12px] text-slate-400 truncate">{c.followersText} followers</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Sticky bottom: Invited Creators card */}
            {selectedCreators.length > 0 && (
              <div className="sticky bottom-0 -mx-4 p-4 bg-white border-t" style={{ borderColor: "var(--ch-border)" }}>
                <div className="rounded-xl border border-orange-500/20 bg-orange-50 p-3 flex items-center justify-between">
                  <div>
                    <p className="text-[12px] font-bold text-orange-400">Invited Creators</p>
                    <p className="text-[18px] font-extrabold text-slate-800">{selectedCreators.length}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => document.getElementById('run-campaign-btn')?.scrollIntoView({ behavior: 'smooth' })}
                      className="text-[11px] font-semibold text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      ↑ Run Campaign
                    </button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={clearSelection}
                      className="text-[11px] font-semibold border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50"
                    >
                      Clear All
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Creator Profile Modal */}
      {profileCreator && (
        <CreatorProfileModal
          creator={profileCreator}
          selected={selectedIds.includes(profileCreator.id)}
          favorited={favoriteIds.includes(profileCreator.id)}
          onToggle={() => toggleSelect(profileCreator)}
          onClose={() => setProfileCreator(null)}
          onChat={() => { setProfileCreator(null); navigate("/dashboard/messages"); }}
          onFavorite={() => toggleFavorite(profileCreator.id)}
          onCityClick={(city) => {
            setProfileCreator(null);
            setFilters((f) => ({ ...f, city, page: 1 }));
          }}
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

      {/* Add Creator Dialog */}
      <AddCreatorDialog
        open={showAddCreator}
        onOpenChange={setShowAddCreator}
        cityOptions={cityOptions}
        onCreated={() => {
          // Refetch creators list
          window.location.reload();
        }}
      />
    </div>
  );
}
