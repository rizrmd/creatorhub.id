import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Instagram, Play, ArrowLeft, MapPin, Calendar, Tag, Mail, Phone } from "lucide-react";
import { useCreator } from "@/hooks/useCreators";
import { formatFollowers, resolveCreatorPhoto } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46v-7.2a8.16 8.16 0 005.58 2.19V11.2a4.83 4.83 0 01-3.77-1.7V2h3.77z"/>
  </svg>
);

const MOCK_IMAGES = [
  "https://picsum.photos/seed/ainul1/400/400",
  "https://picsum.photos/seed/ainul2/400/400",
  "https://picsum.photos/seed/ainul3/400/400",
  "https://picsum.photos/seed/ainul4/400/400",
  "https://picsum.photos/seed/ainul5/400/400",
];

export default function EkrafHubCreatorProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: creator, isLoading, error } = useCreator(id ?? "");
  const [activeTab, setActiveTab] = useState<"overview" | "performance" | "collabs" | "rate">("overview");

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
  const handle = tiktokMetric?.handle || igMetric?.handle || creator.handle;

  return (
    <div className="min-h-screen" style={{ background: "#0a0f1a" }}>
      {/* Hero — full-width photo background */}
      <div className="relative h-[420px] overflow-hidden">
        {photoSrc ? (
          <img src={photoSrc} alt={creator.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl font-bold" style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e)", color: "#94A3B8" }}>
            {creator.name[0]}
          </div>
        )}
        <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #0a0f1a 0%, rgba(10,15,26,0.6) 40%, rgba(10,15,26,0.3) 100%)" }} />

        {/* Creator info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-5xl mx-auto">
            {/* Breadcrumb */}
            <p className="text-xs text-white/50 mb-2">
              Creator Database / <span className="text-white/70">{handle}</span>
            </p>

            {/* Name + tags */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {creator.name}
            </h1>
            <p className="text-white/60 text-sm mt-1">
              {handle && <>@{handle} · </>}
              {creator.city}{creator.country ? `, ${creator.country}` : ""}
            </p>

            {/* Tags */}
            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {creator.tags?.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: "#10B981", color: "white" }}>
                  <Tag className="w-3 h-3" /> {tag}
                </span>
              ))}
              {creator.category.split(",").slice(0, 3).map((cat) => (
                <span key={cat} className="px-3 py-1 rounded-full text-xs font-semibold capitalize"
                  style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                  {cat.trim()}
                </span>
              ))}
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                <MapPin className="w-3 h-3" /> {creator.city}
              </span>
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold"
                style={{ background: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.7)" }}>
                <Calendar className="w-3 h-3" /> Active since 2023
              </span>
            </div>

            {/* Bio */}
            <p className="text-sm text-white/60 mt-3 max-w-2xl leading-relaxed">
              {creator.bio || "Content creator & social media influencer. Tersedia untuk kolaborasi brand campaign dan sponsored content."}
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-3 mt-5">
              <Button className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
                <Mail className="w-4 h-4" /> Contact Creator
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 gap-2">
                Download Rate Card
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "TikTok Followers", value: tiktokFollowers > 0 ? formatFollowers(tiktokFollowers) : "–", color: "#00F2EA" },
            { label: "TikTok Likes", value: "18.4M", color: "#00F2EA" },
            { label: "28d Post Views", value: "6.5M", color: "#F97316" },
            { label: "Instagram Followers", value: igFollowers > 0 ? formatFollowers(igFollowers) : "–", color: "#E1306C" },
            { label: "Instagram Impressions", value: "586K", color: "#E1306C" },
            { label: "Accounts Reached", value: "81.1K", color: "#8B5CF6" },
          ].map((s, i) => (
            <div key={i} className="rounded-xl p-4 text-center" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.4)" }}>{s.label}</p>
              <p className="text-xl font-extrabold mt-1" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-5xl mx-auto px-6 mt-8">
        <div className="flex gap-1 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          {([
            { id: "overview" as const, label: "Profile Overview" },
            { id: "performance" as const, label: "Performance" },
            { id: "collabs" as const, label: "Collaborations" },
            { id: "rate" as const, label: "Rate Card" },
          ]).map((tab) => (
            <button key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 text-sm font-semibold transition-colors border-b-2 ${
                activeTab === tab.id
                  ? "text-emerald-400 border-emerald-400"
                  : "text-white/40 border-transparent hover:text-white/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Creator Story */}
            <section>
              <h2 className="text-lg font-bold text-white mb-4">Creator Story</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="rounded-xl p-5" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <h3 className="text-sm font-bold text-emerald-400 mb-3">About Me</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    {creator.bio || "Hai! Nama saya Ainul Mardhiah Lubis, biasa dipanggil Banuun. Aku lahir tahun 1997 dan tinggal di Banda Aceh. Saat ini aktif berbagi konten di Instagram & TikTok dengan nama @itsbanuun."}
                  </p>
                </div>
                <div className="rounded-xl p-5" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <h3 className="text-sm font-bold text-emerald-400 mb-3">Background</h3>
                  <p className="text-sm text-white/60 leading-relaxed">
                    Sejak kecil aku sudah punya passion besar di dunia kuliner. Dari hobi memasak dan mencoba resep baru, aku memutuskan untuk memulai perjalanan sebagai Food Content Creator & Vlogger di berbagai platform sosial media.
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                {MOCK_IMAGES.map((src, i) => (
                  <div key={i} className="aspect-square rounded-xl overflow-hidden">
                    <img src={src} alt={`Content ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" referrerPolicy="no-referrer" />
                  </div>
                ))}
              </div>
            </section>

            {/* Social Performance */}
            <section>
              <h2 className="text-lg font-bold text-white mb-4">Social Performance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* TikTok */}
                <div className="rounded-xl p-5" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <TiktokIcon className="w-5 h-5" />
                      <span className="text-sm font-bold text-white">@{tiktokMetric?.handle || handle}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(0,242,234,0.15)", color: "#00F2EA" }}>
                      {formatFollowers(tiktokFollowers)} Followers
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Avg. Likes", value: "546K" },
                      { label: "Total Comments", value: "15K" },
                      { label: "Avg. Shares", value: "28K" },
                    ].map((s) => (
                      <div key={s.label} className="text-center p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.3)" }}>
                        <p className="text-[10px] text-white/40">{s.label}</p>
                        <p className="text-sm font-bold text-white mt-1">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Instagram */}
                <div className="rounded-xl p-5" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Instagram className="w-5 h-5" />
                      <span className="text-sm font-bold text-white">@{igMetric?.handle || handle}</span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(225,48,108,0.15)", color: "#E1306C" }}>
                      {formatFollowers(igFollowers)} Followers
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Avg. Likes", value: "3,918" },
                      { label: "Avg. Comments", value: "24.3K" },
                      { label: "Reach", value: "586K" },
                    ].map((s) => (
                      <div key={s.label} className="text-center p-3 rounded-lg" style={{ background: "rgba(0,0,0,0.3)" }}>
                        <p className="text-[10px] text-white/40">{s.label}</p>
                        <p className="text-sm font-bold text-white mt-1">{s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Selected Viral Content */}
            <section>
              <h2 className="text-lg font-bold text-white mb-4">Selected Viral Content</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {MOCK_IMAGES.map((src, i) => (
                  <div key={i} className="aspect-[3/4] rounded-xl overflow-hidden relative group cursor-pointer">
                    <img src={src} alt={`Viral ${i + 1}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="w-8 h-8 text-white" fill="white" />
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <span className="text-[10px] font-bold text-white bg-black/50 px-2 py-0.5 rounded">
                        Viral content {i + 1}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {activeTab === "rate" && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold text-white">Rate Card</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* TikTok */}
              <div className="rounded-xl p-5" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <TiktokIcon className="w-5 h-5" />
                  <span className="text-sm font-bold text-white">TikTok</span>
                  <span className="text-[10px] ml-auto px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(0,242,234,0.15)", color: "#00F2EA" }}>
                    {formatFollowers(tiktokFollowers)} Followers
                  </span>
                </div>
                {[
                  { type: "1 Video (Non-Viral) + Bonus 1 Insetariy", price: "500K" },
                  { type: "1 Video (Viral) + 1 Insetariy", price: "800K" },
                  { type: "1 Video (Viral) + Reels Mirroring + 1 Insetariy", price: "800K" },
                  { type: "1 Video (Viral) + Reels Mirroring + 3 Insetariy + Sony Max 3 Camera", price: "1.800K" },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <span className="text-[12px] text-white/60">{r.type}</span>
                    <span className="text-[13px] font-bold text-emerald-400">{r.price}</span>
                  </div>
                ))}
              </div>

              {/* Instagram */}
              <div className="rounded-xl p-5" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <Instagram className="w-5 h-5" />
                  <span className="text-sm font-bold text-white">Instagram</span>
                  <span className="text-[10px] ml-auto px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(225,48,108,0.15)", color: "#E1306C" }}>
                    {formatFollowers(igFollowers)} Followers
                  </span>
                </div>
                {[
                  { type: "Paid Promote (per slide)", price: "150K" },
                  { type: "Review Product (Max 1 menit) + Editing + Insetariy", price: "300K" },
                  { type: "Reels (Non-Viral) + Instagram Story", price: "400K" },
                  { type: "Reels (Viral) + Insetariy", price: "650K" },
                  { type: "Reels (Viral) + Instagram Story + Sony Max 3 Camera", price: "1.000K" },
                ].map((r, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                    <span className="text-[12px] text-white/60">{r.type}</span>
                    <span className="text-[13px] font-bold text-emerald-400">{r.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "performance" && (
          <div className="text-center py-16">
            <p className="text-white/40 text-sm">Performance analytics coming soon.</p>
          </div>
        )}

        {activeTab === "collabs" && (
          <div className="text-center py-16">
            <p className="text-white/40 text-sm">Collaboration history coming soon.</p>
          </div>
        )}
      </div>

      {/* Booking Information footer */}
      <div className="max-w-5xl mx-auto px-6 pb-12">
        <div className="rounded-xl p-6" style={{ background: "#111827", border: "1px solid rgba(255,255,255,0.06)" }}>
          <h2 className="text-lg font-bold text-white mb-4">Booking Information</h2>
          <p className="text-sm text-white/60 mb-4">Ready to collaborate?</p>
          <div className="flex items-center gap-2 text-sm text-white/60">
            <Mail className="w-4 h-4" /> {handle}@gmail.com
          </div>
          <div className="flex items-center gap-2 text-sm text-white/60 mt-2">
            <Phone className="w-4 h-4" /> Instagram & TikTok: @{handle}
          </div>
        </div>
      </div>
    </div>
  );
}
