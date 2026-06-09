import { useState, useRef, useEffect } from "react";
import {
  Search, SlidersHorizontal, Star, CheckCircle, Zap, Award,
  Instagram, Youtube, Users, Megaphone, TrendingUp, Wallet,
  LayoutGrid, List, RotateCcw, X, Flame, MessageSquare, MapPin,
  Heart, ArrowUpRight, User,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCreators, useMarketplaceStats } from "@/hooks/useCreators";
import { useCreateCampaign } from "@/hooks/useCampaigns";
import type { Creator, CreatorListParams } from "@/types";
import { formatRupiah, formatFollowers } from "@/lib/utils";

const CATEGORIES = ["lifestyle", "travel", "beauty", "tech", "food", "sports"];
const CITIES = ["Jakarta", "Bandung", "Surabaya", "Bali", "Yogyakarta", "Medan", "Makassar"];
const PLATFORMS = ["instagram", "tiktok", "youtube"];

const FOLLOWERS_OPTIONS = [
  { label: "Semua", value: "all" },
  { label: "< 300K", value: "0-300000" },
  { label: "300K – 500K", value: "300000-500000" },
  { label: "500K – 700K", value: "500000-700000" },
  { label: "700K+", value: "700000-0" },
];

const ENGAGEMENT_OPTIONS = [
  { label: "Semua", value: "all" },
  { label: "< 3%", value: "0-3" },
  { label: "3% – 4%", value: "3-4" },
  { label: "4% – 5%", value: "4-5" },
  { label: "5%+", value: "5-0" },
];

const PRICE_OPTIONS = [
  { label: "Semua", value: "all" },
  { label: "< Rp 7M", value: "0-7000000" },
  { label: "Rp 7M – 10M", value: "7000000-10000000" },
  { label: "Rp 10M – 13M", value: "10000000-13000000" },
  { label: "Rp 13M+", value: "13000000-0" },
];

const CATEGORY_COLORS: Record<string, string> = {
  lifestyle: "bg-purple-100 text-purple-700",
  travel: "bg-blue-100 text-blue-700",
  beauty: "bg-pink-100 text-pink-700",
  tech: "bg-slate-100 text-slate-700",
  food: "bg-orange-100 text-orange-700",
  sports: "bg-green-100 text-green-700",
};

const platformIcon = (p: string) => {
  if (p === "instagram") return <Instagram className="w-3 h-3" />;
  if (p === "youtube") return <Youtube className="w-3 h-3" />;
  return <span className="text-[10px] font-bold">TT</span>;
};

function StatCard({ label, value, icon: Icon, color, loading, trend }: {
  label: string; value: string; icon: React.ElementType; color: string; loading: boolean; trend?: string;
}) {
  return (
    <div className="rounded-xl border p-5"
      style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>{label}</p>
          {loading ? <Skeleton className="h-7 w-24 mt-1" /> : (
            <p className="text-[22px] font-extrabold mt-0.5 tracking-[-0.3px]"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p>
          )}
          {trend && !loading && (
            <div className="flex items-center gap-1 mt-1 text-[12px] font-semibold" style={{ color: "#16A34A" }}>
              <ArrowUpRight className="w-3 h-3" />
              {trend} vs bulan lalu
            </div>
          )}
        </div>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function CreatorCard({ creator, selected, favorited, onToggle, onCardClick, onFavorite, listView }: {
  creator: Creator; selected: boolean; favorited: boolean;
  onToggle: () => void; onCardClick: () => void; onFavorite: () => void; listView: boolean;
}) {
  const catColor = CATEGORY_COLORS[creator.category] ?? "bg-slate-100 text-slate-700";

  if (listView) {
    return (
      <div
        className="cursor-pointer transition-all rounded-xl border"
        style={{
          background: "var(--ch-surface)",
          borderColor: selected ? "var(--ch-primary)" : "var(--ch-border)",
          boxShadow: selected ? "0 0 0 2px var(--ch-primary)" : "var(--ch-shadow-sm)",
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
            <div className="hidden sm:flex items-center gap-4 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
              <span className="font-semibold">{creator.followersText}</span>
              <span className="font-semibold">{creator.engagementRate}% ER</span>
              <span className="flex items-center gap-0.5">
                <Star style={{ width: 12, height: 12, fill: "#FBBF24", color: "#FBBF24" }} />{creator.rating}
              </span>
              <span className="font-bold" style={{ color: "var(--ch-text)" }}>{creator.priceText}</span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onFavorite(); }}
              className="p-1.5 rounded-full hover:bg-slate-100 transition-colors shrink-0"
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
              {selected ? "✓ Diundang" : "Undang"}
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
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white flex items-center justify-center transition-colors hover:scale-110 shadow"
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
        {/* Name + city */}
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

        {/* Platform icons */}
        <div className="flex gap-1 mt-2">
          {creator.platforms.map((p) => (
            <span key={p} className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
              {platformIcon(p)}
            </span>
          ))}
        </div>

        {/* Two-cell metric strip */}
        <div className="grid grid-cols-2 mt-3 rounded-lg overflow-hidden border" style={{ borderColor: "var(--ch-border)" }}>
          <div className="text-center py-2 border-r" style={{ borderColor: "var(--ch-border)" }}>
            <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{creator.followersText}</p>
            <p className="text-[10px]" style={{ color: "var(--ch-text-soft)" }}>Followers</p>
          </div>
          <div className="text-center py-2">
            <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{creator.engagementRate}%</p>
            <p className="text-[10px]" style={{ color: "var(--ch-text-soft)" }}>Engagement</p>
          </div>
        </div>

        {/* Price + invite button */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <p className="text-[10px]" style={{ color: "var(--ch-text-soft)" }}>Mulai dari</p>
            <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{creator.priceText}</p>
          </div>
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
            {selected ? "✓ Diundang" : "Undang"}
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
  const catColor = CATEGORY_COLORS[creator.category] ?? "bg-slate-100 text-slate-700";

  const platformWeights = [0.55, 0.30, 0.15];
  const platformSplit = creator.platforms.map((p, i) => ({
    platform: p,
    count: Math.round(creator.followers * (platformWeights[i] ?? 0.1)),
  }));

  const collaborationCount = Math.max(1, Math.round(creator.rating * 8) - 12);
  const responseTimeLabel = creator.fastResponse ? "< 2 jam" : "< 24 jam";
  const avgLikes = formatFollowers(Math.round(creator.followers * creator.engagementRate / 100 * 0.8));
  const avgComments = formatFollowers(Math.round(creator.followers * creator.engagementRate / 100 * 0.15));
  const avgViews = formatFollowers(Math.round(creator.followers * 2.3));

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        {/* Header Section */}
        <div className="p-6 border-b" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
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
              className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-110"
              style={{ background: "var(--ch-bg)" }}
            >
              <Heart style={{ width: 20, height: 20, color: favorited ? "#EF4444" : "#94A3B8", fill: favorited ? "#EF4444" : "none" }} />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6" style={{ background: "var(--ch-bg)" }}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Bio Section */}
              {creator.bio && (
                <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                  <h3 className="text-sm font-bold mb-2" style={{ color: "var(--ch-text)" }}>Tentang Kreator</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{creator.bio}</p>
                </div>
              )}

              {/* Platform Breakdown */}
              <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--ch-text)" }}>Platform & Audiens</h3>
                <div className="space-y-2">
                  {platformSplit.map(({ platform, count }) => (
                    <div
                      key={platform}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border
                        ${platform === "instagram" ? "border-pink-200 bg-pink-50" :
                          platform === "tiktok" ? "border-slate-700 bg-slate-800" :
                          "border-red-200 bg-red-50"}`}
                    >
                      <span className={`flex items-center gap-2 text-sm font-semibold
                        ${platform === "tiktok" ? "text-white" :
                          platform === "instagram" ? "text-pink-700" : "text-red-700"}`}>
                        {platformIcon(platform)}
                        <span className="capitalize">{platform}</span>
                      </span>
                      <span className={`text-sm font-bold ${platform === "tiktok" ? "text-white" : "text-slate-800"}`}>
                        {formatFollowers(count)} followers
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audience Demographics */}
              <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
                <h3 className="text-sm font-bold mb-3" style={{ color: "var(--ch-text)" }}>Demografi Audiens</h3>
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
        <div className="p-4 border-t flex items-center justify-between gap-3" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
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
                <>Hapus dari Brief</>
              ) : (
                <><User style={{ width: 16, height: 16 }} /> Undang ke Kampanye</>
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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [listView, setListView] = useState(false);

  useEffect(() => {
    const city = searchParams.get("city");
    const q = searchParams.get("search");
    if (city) setFilters((f) => ({ ...f, city, page: 1 }));
    if (q) setSearch(q);
    if (city || q) setSearchParams({}, { replace: true });
  }, []);

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
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [campaignForm, setCampaignForm] = useState({ title: "", description: "", budget: "" });

  const [profileCreator, setProfileCreator] = useState<Creator | null>(null);

  const advMinPrice = useRef("");
  const advMaxPrice = useRef("");

  const createMutation = useCreateCampaign();

  const { data, isLoading } = useCreators({ ...filters, search: search || undefined });
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
    toast.success("Kampanye berhasil dibuat!");
  };

  const selectedCreators = data?.data.filter((c) => selectedIds.includes(c.id)) ?? [];

  const statCards = [
    { label: "Total Kreator", value: stats ? stats.totalCreators.toLocaleString("id-ID") : "–", icon: Users, color: "text-blue-600 bg-blue-50", trend: "+18.6%" },
    { label: "Kampanye Aktif", value: stats ? stats.activeCampaigns.toLocaleString("id-ID") : "–", icon: Megaphone, color: "text-orange-600 bg-orange-50", trend: "+12.4%" },
    { label: "Avg. Engagement", value: stats ? `${stats.avgEngagementRate.toFixed(2)}%` : "–", icon: TrendingUp, color: "text-cyan-600 bg-cyan-50", trend: "+0.6%" },
    { label: "Budget Dikelola", value: stats ? formatRupiah(stats.totalBudget) : "–", icon: Wallet, color: "text-amber-600 bg-amber-50", trend: "+24.7%" },
  ];

  const totalReach = selectedCreators.reduce((a, c) => a + c.followers, 0);
  const avgEngagement = selectedCreators.length > 0
    ? (selectedCreators.reduce((a, c) => a + c.engagementRate, 0) / selectedCreators.length).toFixed(2)
    : "0";

  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col">
        {/* Stats */}
        <div className="p-4 border-b border-slate-200 bg-white">
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
            {statCards.map((s) => <StatCard key={s.label} {...s} loading={statsLoading} />)}
          </div>
        </div>

        {/* Filters row 1 */}
        <div className="px-4 pt-3 pb-0 bg-white flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              ref={searchRef}
              placeholder="Cari nama kreator... (tekan / untuk fokus)"
              className="pl-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={filters.category ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, category: v === "all" ? undefined : v, page: 1 }))}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Kategori" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.platform ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, platform: v === "all" ? undefined : v, page: 1 }))}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Platform" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Platform</SelectItem>
              {PLATFORMS.map((p) => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
            </SelectContent>
          </Select>

          <Select value={filters.city ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, city: v === "all" ? undefined : v, page: 1 }))}>
            <SelectTrigger className="w-32"><SelectValue placeholder="Kota" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kota</SelectItem>
              {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Filters row 2 */}
        <div className="px-4 py-2 bg-white flex flex-wrap items-center gap-2">
          <Select value={followersVal} onValueChange={applyFollowers}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Followers" /></SelectTrigger>
            <SelectContent>{FOLLOWERS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>

          <Select value={engagementVal} onValueChange={applyEngagement}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Engagement" /></SelectTrigger>
            <SelectContent>{ENGAGEMENT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>

          <Select value={priceVal} onValueChange={applyPrice}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Harga" /></SelectTrigger>
            <SelectContent>{PRICE_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
          </Select>

          <Select value={filters.sortBy ?? "all"} onValueChange={(v) => setFilters((f) => ({ ...f, sortBy: v === "all" ? undefined : v }))}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Urutkan" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Relevansi</SelectItem>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="engagement">Engagement</SelectItem>
              <SelectItem value="rating">Rating</SelectItem>
              <SelectItem value="price">Harga</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1" />

          {/* Quick filter toggles */}
          <button
            onClick={() => toggleQuick("topRated")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filters.topRated ? "bg-orange-500 border-orange-500 text-white" : "border-slate-200 text-slate-600 hover:border-orange-300"
            }`}
          >
            <Flame className="w-3.5 h-3.5" /> Top Rated
          </button>
          <button
            onClick={() => toggleQuick("fastResponse")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filters.fastResponse ? "bg-amber-500 border-amber-500 text-white" : "border-slate-200 text-slate-600 hover:border-amber-300"
            }`}
          >
            <Zap className="w-3.5 h-3.5" /> Fast Response
          </button>
          <button
            onClick={() => toggleQuick("verified")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              filters.verified ? "bg-blue-600 border-blue-600 text-white" : "border-slate-200 text-slate-600 hover:border-blue-300"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" /> Verified Only
          </button>
        </div>

        {/* Row 3: results info + actions */}
        <div className="px-4 py-1.5 bg-white border-b border-slate-200 flex items-center gap-2">
          <p className="text-xs text-slate-500 flex-1">
            {isLoading ? "Memuat..." : `${data?.total ?? 0} kreator ditemukan`}
          </p>
          <Button variant="outline" size="sm" onClick={resetFilters} className="gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </Button>
          <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => setShowAdvanced(true)}>
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
          <div className="flex border border-slate-200 rounded-md overflow-hidden">
            <button onClick={() => setListView(false)} className={`p-2 ${!listView ? "bg-slate-100 text-slate-700" : "text-slate-400 hover:text-slate-600"}`}>
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button onClick={() => setListView(true)} className={`p-2 ${listView ? "bg-slate-100 text-slate-700" : "text-slate-400 hover:text-slate-600"}`}>
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grid / List */}
        <div className="p-4">
          {isLoading ? (
            <div className={listView ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"}>
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
            <div className="flex flex-col items-center justify-center py-24 text-slate-400">
              <Users className="w-12 h-12 mb-3 opacity-40" />
              <p className="font-medium">Tidak ada kreator ditemukan</p>
              <p className="text-sm mt-1">Coba ubah atau reset filter pencarian</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={resetFilters}>Reset Filter</Button>
            </div>
          ) : (
            <div className={listView ? "space-y-2" : "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"}>
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
            <div className="flex justify-center gap-2 mt-6">
              <Button variant="outline" size="sm" disabled={filters.page === 1}
                onClick={() => setFilters((f) => ({ ...f, page: (f.page ?? 1) - 1 }))}>
                Sebelumnya
              </Button>
              <span className="text-xs text-slate-500 self-center">
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
      </div>

      {/* Campaign Brief Panel */}
      <aside className="w-[312px] shrink-0 flex flex-col" style={{ background: "var(--ch-surface)", borderLeft: "1px solid var(--ch-border)" }}>
        <div className="p-4 border-b" style={{ borderColor: "var(--ch-border)" }}>
          <h2 className="font-bold text-[15px]" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Campaign Brief</h2>
          <p className="text-[12px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{selectedIds.length}/5 kreator dipilih</p>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {selectedCreators.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">Belum ada kreator dipilih</p>
              <p className="text-xs mt-1">Klik "Undang" atau buka profil kreator</p>
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

        {selectedIds.length > 0 && (
          <div className="p-4 border-t border-slate-200 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Est. Total Reach</span>
                <span className="font-semibold text-slate-700">{formatFollowers(totalReach)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Avg. Engagement</span>
                <span className="font-semibold text-slate-700">{avgEngagement}%</span>
              </div>
              <div className="flex justify-between pt-1.5 border-t border-slate-100">
                <span className="text-slate-500">Est. Total Budget</span>
                <span className="font-bold text-slate-800">{formatRupiah(selectedCreators.reduce((a, c) => a + c.price, 0))}</span>
              </div>
            </div>
            <Button className="w-full" onClick={() => setShowCreateCampaign(true)}>Buat Kampanye</Button>
          </div>
        )}
      </aside>

      {/* Creator Profile Modal */}
      {profileCreator && (
        <CreatorProfileModal
          creator={profileCreator}
          selected={selectedIds.includes(profileCreator.id)}
          favorited={favoriteIds.includes(profileCreator.id)}
          onToggle={() => toggleSelect(profileCreator.id)}
          onClose={() => setProfileCreator(null)}
          onChat={() => { setProfileCreator(null); navigate("/messages"); }}
          onFavorite={() => toggleFavorite(profileCreator.id)}
        />
      )}

      {/* Advanced Filters Dialog */}
      <Dialog open={showAdvanced} onOpenChange={setShowAdvanced}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Lanjutan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Harga Minimum (Rp)</label>
              <Input type="number" placeholder="Contoh: 5000000" defaultValue={advMinPrice.current}
                onChange={(e) => { advMinPrice.current = e.target.value; }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Harga Maksimum (Rp)</label>
              <Input type="number" placeholder="Contoh: 15000000" defaultValue={advMaxPrice.current}
                onChange={(e) => { advMaxPrice.current = e.target.value; }} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Rating Minimum</label>
              <Select onValueChange={(v) => setFilters((f) => ({ ...f, minRating: v === "all" ? undefined : Number(v) }))}>
                <SelectTrigger><SelectValue placeholder="Semua Rating" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Rating</SelectItem>
                  <SelectItem value="3">3+</SelectItem>
                  <SelectItem value="4">4+</SelectItem>
                  <SelectItem value="4.5">4.5+</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 flex-1">Hanya Fast Response</label>
              <button onClick={() => setFilters((f) => ({ ...f, fastResponse: !f.fastResponse }))}
                className={`w-10 h-5 rounded-full relative transition-colors ${filters.fastResponse ? "bg-blue-600" : "bg-slate-200"}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${filters.fastResponse ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-slate-700 flex-1">Hanya Top Rated</label>
              <button onClick={() => setFilters((f) => ({ ...f, topRated: !f.topRated }))}
                className={`w-10 h-5 rounded-full relative transition-colors ${filters.topRated ? "bg-blue-600" : "bg-slate-200"}`}>
                <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-transform ${filters.topRated ? "right-0.5" : "left-0.5"}`} />
              </button>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdvanced(false)}>Batal</Button>
            <Button onClick={() => {
              setFilters((f) => ({
                ...f,
                minPrice: advMinPrice.current ? Number(advMinPrice.current) : undefined,
                maxPrice: advMaxPrice.current ? Number(advMaxPrice.current) : undefined,
                page: 1,
              }));
              setShowAdvanced(false);
            }}>Terapkan Filter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Campaign Dialog */}
      <Dialog open={showCreateCampaign} onOpenChange={setShowCreateCampaign}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Kampanye dengan {selectedCreators.length} Kreator</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Nama Kampanye</label>
              <Input placeholder="Contoh: Kampanye Summer 2025" value={campaignForm.title}
                onChange={(e) => setCampaignForm((f) => ({ ...f, title: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Deskripsi</label>
              <Input placeholder="Deskripsi singkat kampanye..." value={campaignForm.description}
                onChange={(e) => setCampaignForm((f) => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-700">Budget (Rp)</label>
              <Input type="number" placeholder={String(selectedCreators.reduce((a, c) => a + c.price, 0))}
                value={campaignForm.budget} onChange={(e) => setCampaignForm((f) => ({ ...f, budget: e.target.value }))} />
            </div>
            <div className="bg-slate-50 rounded-lg p-3 text-sm text-slate-600">
              <p className="font-medium mb-1">Kreator yang dipilih:</p>
              {selectedCreators.map((c) => (
                <span key={c.id} className="inline-block mr-2 text-xs text-slate-500">· {c.name}</span>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateCampaign(false)}>Batal</Button>
            <Button onClick={handleCreateCampaign} disabled={createMutation.isPending || !campaignForm.title}>
              {createMutation.isPending ? "Membuat..." : "Buat Kampanye"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
