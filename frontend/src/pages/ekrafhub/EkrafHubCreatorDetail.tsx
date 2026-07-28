import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, Instagram, CheckCircle, Heart } from "lucide-react";

const ACCOUNTS: Record<string, {
  name: string; handle: string; photo: string; platform: string;
  followers: number; engagementRate: number; category: string; bio: string;
  city: string; joined: string;
}> = {
  "nurasahirah": { name: "Nura Sahirah", handle: "@nurasahirah", photo: "/nurasahirah.jpg", platform: "instagram", followers: 2017, engagementRate: 0.8, category: "Travel & Culture", bio: "Content creator yang fokus pada wisata dan budaya Aceh. Suka menjelajahi tempat-tempat tersembunyi di Gampong Nusa dan sekitarnya.", city: "Aceh Besar", joined: "2024" },
  "opiezahri": { name: "Opie Zahri", handle: "@opiezahri", photo: "/opiezahri.jpg", platform: "instagram", followers: 6529, engagementRate: 0.6, category: "Lifestyle & Creative", bio: "Kreator konten kreatif dari Aceh. Berbagi inspirasi lifestyle, fashion, dan aktivitas sehari-hari.", city: "Banda Aceh", joined: "2023" },
  "gampongnusaku": { name: "Gampong Nusa Ku", handle: "@gampongnusaku", photo: "/gampongnusaku.jpg", platform: "instagram", followers: 5709, engagementRate: 0.7, category: "Travel & Tourism", bio: "Akun resmi promosi wisata Gampong Nusa. Menampilkan keindahan alam, budaya, dan kuliner khas desa wisata.", city: "Aceh Besar", joined: "2022" },
  "exploreacehh": { name: "Explore Aceh", handle: "@exploreacehh", photo: "/exploreacehh.jpg", platform: "instagram", followers: 13000, engagementRate: 0.5, category: "Travel & Tourism", bio: "Media online yang fokus pada promosi pariwisata dan potensi daerah Aceh. Update info terkini seputar Aceh.", city: "Banda Aceh", joined: "2021" },
};

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return String(n);
}

const MOCK_IMAGES = [
  "https://picsum.photos/seed/pg1/300/300",
  "https://picsum.photos/seed/pg2/300/300",
  "https://picsum.photos/seed/pg3/300/300",
  "https://picsum.photos/seed/pg4/300/300",
  "https://picsum.photos/seed/pg5/300/300",
  "https://picsum.photos/seed/pg6/300/300",
];

const MOCK_VIDEOS = [
  "https://picsum.photos/seed/pv1/300/400",
  "https://picsum.photos/seed/pv2/300/400",
  "https://picsum.photos/seed/pv3/300/400",
  "https://picsum.photos/seed/pv4/300/400",
];

export default function EkrafHubCreatorDetail() {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(false);

  const account = handle ? ACCOUNTS[handle.toLowerCase()] : null;

  if (!account) {
    return (
      <div className="p-4 md:p-8 text-center">
        <p className="text-lg font-semibold" style={{ color: "var(--ch-text)" }}>Account not found</p>
        <button className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold" style={{ background: "var(--ch-primary)", color: "white" }}
          onClick={() => navigate("/dashboard/ekrafhub/desa-kreatif/gampongnusa")}>
          <ArrowLeft className="w-4 h-4 inline mr-2" /> Kembali
        </button>
      </div>
    );
  }

  const followers = account.followers;
  const er = account.engagementRate;
  const following = Math.round(followers * 0.04);
  const posts = Math.round(followers * 0.018);
  const avgEngagement = Math.round(followers * er / 100 * 0.8);
  const avgLikes = Math.round(followers * er / 100 * 0.5);
  const avgComments = Math.round(followers * er / 100 * 0.15);
  const avgViews = Math.round(followers * 2.3);
  const viewRate = Math.min(99, Math.round(er * 12));

  return (
    <div className="pb-8">
      {/* Back button */}
      <div className="px-4 md:px-8 pt-4">
        <button
          onClick={() => navigate("/dashboard/ekrafhub/desa-kreatif/gampongnusa")}
          className="flex items-center gap-2 text-sm font-semibold hover:underline"
          style={{ color: "var(--ch-primary)" }}
        >
          <ArrowLeft className="w-4 h-4" /> Kembali ke Gampong Nusa
        </button>
      </div>

      {/* Hero Section */}
      <div className="px-4 md:px-8 pt-4">
        <div className="rounded-2xl overflow-hidden p-6 md:p-8" style={{ background: "linear-gradient(135deg, #0F172A, #1E293B)" }}>
          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Photo */}
            <div className="shrink-0">
              <div className="w-[180px] h-[320px] rounded-2xl overflow-hidden ring-1 ring-white/10 shadow-lg shadow-black/30">
                <img src={account.photo} alt={account.name} className="w-full h-full object-cover"
                  onError={(e) => { e.currentTarget.style.display = "none"; }} />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <h1 className="text-xl font-extrabold text-white truncate" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {account.name}
                  </h1>
                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0" style={{ background: "#3B82F6", color: "white" }}>
                    <CheckCircle className="w-2.5 h-2.5" /> Verified
                  </span>
                </div>
              </div>

              <p className="text-xs text-white/40 mt-1">
                {account.handle} · 📍 {account.city}, Indonesia
              </p>

              <div className="h-px my-3" style={{ background: "rgba(255,255,255,0.08)" }} />

              <p className="text-sm text-white/70 leading-relaxed">{account.bio}</p>

              <div className="h-px my-3" style={{ background: "rgba(255,255,255,0.08)" }} />

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px]">
                <span className="text-white font-semibold">{formatNum(followers)} Followers</span>
                <span className="text-white/50">·</span>
                <span className="text-white/60">{formatNum(following)} Following</span>
                <span className="text-white/50">·</span>
                <span className="text-white/60">{formatNum(posts)} Posts</span>
                <span className="text-white/50">·</span>
                <span className="text-white/60">{er}% ER</span>
                <span className="text-white/50">·</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" }}>
                  {account.category}
                </span>
              </div>

              {/* Creator Performance */}
              <div className="h-px my-4" style={{ background: "rgba(255,255,255,0.08)" }} />
              <p className="text-[11px] font-bold uppercase tracking-wider text-white/30 mb-3">Creator Performance</p>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { label: "Avg. Engagement", value: formatNum(avgEngagement) },
                  { label: "Avg. Likes", value: formatNum(avgLikes) },
                  { label: "Avg. Comments", value: formatNum(avgComments) },
                  { label: "Avg. Reel View", value: formatNum(avgViews) },
                  { label: "View Rate", value: `${viewRate}%` },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg p-3 text-center" style={{ background: "rgba(0,0,0,0.3)" }}>
                    <p className="text-[10px] font-semibold text-white/40">{s.label}</p>
                    <p className="text-base font-extrabold text-white mt-1">{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profil Followers */}
      <div className="px-4 md:px-8 mt-8">
        <h2 className="text-base font-bold mb-3" style={{ color: "var(--ch-text)" }}>Profil Followers</h2>
        <div className="rounded-2xl border p-5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-bold mb-4" style={{ color: "var(--ch-text)" }}>Jenis Kelamin</p>
              <div className="flex items-center justify-center">
                <div className="relative w-40 h-40">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#BFDBFE" strokeWidth="4" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#3B82F6" strokeWidth="4" strokeDasharray="38 62" strokeDashoffset="0" strokeLinecap="round" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-center gap-4 mt-3 text-xs" style={{ color: "var(--ch-text-muted)" }}>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-500 inline-block" /> Pria (38%)</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-200 inline-block" /> Wanita (62%)</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold mb-4" style={{ color: "var(--ch-text)" }}>Rentang Usia</p>
              <div className="flex items-end justify-between gap-1.5 h-40 px-2">
                {[
                  { label: "13-17", pct: 8 }, { label: "18-24", pct: 32 }, { label: "25-34", pct: 38 },
                  { label: "35-44", pct: 14 }, { label: "45-54", pct: 5 }, { label: "55-64", pct: 2 }, { label: "65+", pct: 1 },
                ].map((b) => (
                  <div key={b.label} className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full rounded-t" style={{ height: `${b.pct * 1.1}px`, background: "#BFDBFE" }} />
                    <span className="text-[9px]" style={{ color: "var(--ch-text-muted)" }}>{b.label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-bold mb-4" style={{ color: "var(--ch-text)" }}>Top Location</p>
              <div className="space-y-2.5">
                {[
                  { city: account.city, pct: 45, color: "#3B82F6" },
                  { city: "Banda Aceh", pct: 22, color: "#60A5FA" },
                  { city: "Jakarta", pct: 12, color: "#F97316" },
                  { city: "Medan", pct: 10, color: "#22C55E" },
                  { city: "Surabaya", pct: 7, color: "#FACC15" },
                ].map((l, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-0.5">
                      <span style={{ color: "var(--ch-text-muted)" }}>{l.city}</span>
                      <span className="font-semibold" style={{ color: "var(--ch-text)" }}>{l.pct}%</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: "var(--ch-bg)" }}>
                      <div className="h-full rounded-full" style={{ width: `${l.pct * 2.2}%`, background: l.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Konten */}
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
                    <svg className="w-5 h-5 text-black ml-0.5" viewBox="0 0 24 24" fill="black"><path d="M8 5v14l11-7z"/></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating action buttons */}
      <div className="fixed bottom-6 right-6 flex items-center gap-2 z-40">
        <a
          href={`https://www.instagram.com/${account.handle.replace("@", "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-colors"
          style={{ background: "#E1306C" }}
        >
          <Instagram className="w-4 h-4" /> Visit Instagram
        </a>
        <button
          onClick={() => setFavorited(!favorited)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white shadow-lg transition-colors"
          style={{ background: "var(--ch-primary)" }}
        >
          <Heart className="w-4 h-4" fill={favorited ? "white" : "none"} />
          {favorited ? "Favorited" : "Favorite"}
        </button>
      </div>
    </div>
  );
}
