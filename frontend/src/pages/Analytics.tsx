import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Clock, CheckCircle2, Loader2, User, Plus, Instagram, Search, Eye, Heart, MessageCircle, Save, ExternalLink } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const projects = [
  {
    id: "komdigi",
    name: "Komdigi",
    project: "Kampanye Swasembada Air",
    brief:
      "Kampanye media sosial lintas platform untuk mempromosikan program swasembada air nasional. Melibatkan konten edukasi, infografis interaktif, dan kolaborasi dengan influencer lingkungan hidup.",
    status: "completed" as const,
    timeline: "Jan - Mar 2026",
    deliverables: "30 Reels, 15 Stories, 10 Feed Posts",
    hue: 210,
    logo: "/client-logos/komdigi.png",
  },
  {
    id: "kementrian-umkm",
    name: "Kementrian UMKM",
    project: "Amplifikasi Narasi & Edukasi UMKM oleh Influencers & Clippers",
    brief:
      "Amplifikasi Narasi, Edukasi Program untuk Meningkatkan Engagement Akun Sosial Media Kementerian UMKM dan Menjangkau Berbagai Komunitas Pengguna Sosial Media",
    status: "active" as const,
    timeline: "21 Apr – 31 Dec 2026",
    deliverables: "50 Reels, 20 Carousel, 8 Video Tutorial",
    hue: 142,
    logo: "/client-logos/kementrian-umkm.png",
  },
  {
    id: "kemenkop",
    name: "Kemenkop",
    project: "Koperasi Sejahtera",
    brief:
      "Inisiatif pemberdayaan koperasi nasional dengan konten storytelling anggota koperasi sukses, infografis data koperasi, dan kampanye kesadaran simpan pinjam.",
    status: "active" as const,
    timeline: "Mar - Jul 2026",
    deliverables: "40 Reels, 12 Carousel, 6 Video Profile",
    hue: 262,
    logo: "/client-logos/kemenkop.jpg",
  },
  {
    id: "bni",
    name: "PT Bank Negara Indonesia",
    project: "BNI Digital Payment Awareness",
    brief:
      "Kampanye promosi adopsi pembayaran digital BNI melalui konten edukasi QRIS, testimonial pengguna, dan challenge viral di media sosial.",
    status: "completed" as const,
    timeline: "Nov 2025 - Feb 2026",
    deliverables: "35 Reels, 20 Stories, 15 Feed Posts, 5 Video Testimoni",
    hue: 35,
  },
  {
    id: "dave-laksono",
    name: "Dave Laksono",
    project: "Personal Branding & Content Strategy",
    brief:
      "Strategi konten personal branding untuk figur publik melalui konten harian, behind-the-scenes, Highlights opini, dan interaksi audiens di Instagram & TikTok.",
    status: "ongoing" as const,
    timeline: "Jan 2026 - Ongoing",
    deliverables: "60 Reels, 30 Stories, 20 Feed Posts per bulan",
    hue: 190,
  },
  {
    id: "nurul-arifin",
    name: "Nurul Arifin",
    project: "Health & Wellness Content Series",
    brief:
      "Seri konten kesehatan dan kebugaran yang meliputi tips nutrisi, rutinitas olahraga, dan edukasi pola hidup sehat untuk audiens wanita aktif berusia 25-45 tahun.",
    status: "completed" as const,
    timeline: "Oct - Dec 2025",
    deliverables: "25 Reels, 10 Carousel, 5 Video Long-form",
    hue: 340,
  },
];

const leads = [
  {
    id: "lead-1",
    name: "PT Telkom Indonesia",
    project: "Digital Content Creator Partnership",
    brief:
      "Kerja sama jangka panjang untuk produksi konten digital brand awareness produk digital Telkom, termasuk Series YouTube dan campaign TikTok.",
    status: "negotiation" as const,
    timeline: "Target: Apr 2026",
    budget: "Rp 450.000.000",
    hue: 180,
  },
  {
    id: "lead-2",
    name: "Shopee Indonesia",
    project: "Campaign Ramadhan 2026",
    brief:
      "Kampanye besar-besaran menjelang Ramadhan dengan melibatkan 50+ kreator untuk konten haul, review produk, dan live shopping sepanjang bulan Ramadan.",
    status: "proposal" as const,
    timeline: "Target: Mar 2026",
    budget: "Rp 1.200.000.000",
    hue: 245,
  },
  {
    id: "lead-3",
    name: "Kementerian Pendidikan",
    project: "Literasi Digital Pelajar",
    brief:
      "Program literasi digital untuk pelajar SMA/SMK di 5 kota besar Indonesia melalui konten edukasi interaktif dan challenge kreatif di media sosial.",
    status: "follow-up" as const,
    timeline: "Target: Mei 2026",
    budget: "Rp 300.000.000",
    hue: 15,
  },
  {
    id: "lead-4",
    name: "Grab Indonesia",
    project: "Driver Partner Content Series",
    brief:
      "Seri konten storytelling untuk mengangkat kisah sukses driver Grab, membangun citra positif brand, dan meningkatkan rekrutmen mitra driver baru.",
    status: "proposal" as const,
    timeline: "Target: Apr 2026",
    budget: "Rp 200.000.000",
    hue: 120,
  },
];

const statusConfig = {
  completed: {
    label: "Selesai",
    icon: CheckCircle2,
    bg: "#DCFCE7",
    color: "#16A34A",
  },
  active: {
    label: "Aktif",
    icon: Loader2,
    bg: "#DBEAFE",
    color: "#2563EB",
  },
  ongoing: {
    label: "Berlangsung",
    icon: Clock,
    bg: "#FEF9C3",
    color: "#CA8A04",
  },
};

const leadStatusConfig = {
  proposal: {
    label: "Proposal",
    bg: "#E0E7FF",
    color: "#4F46E5",
  },
  negotiation: {
    label: "Negosiasi",
    bg: "#FEF3C7",
    color: "#D97706",
  },
  "follow-up": {
    label: "Follow Up",
    bg: "#F3E8FF",
    color: "#7C3AED",
  },
};

type ScrapeStatus = "idle" | "scraping" | "done";

type InstagramPost = {
  shortcode: string;
  views: number;
  likes: number;
  comments: number;
};

type InstagramProfile = {
  username: string;
  displayName: string;
  bio: string;
  posts: number;
  followers: number;
  following: number;
  postsData: InstagramPost[];
};

const MOCK_PROFILES: Record<string, InstagramProfile> = {
  "jurnal.wargajakarta": {
    username: "jurnal.wargajakarta",
    displayName: "Jurnal.WargaJakarta",
    bio: "📰 Media warga Jakarta · 🏛 Pemerintah · Ekonomi · UMKM",
    posts: 51,
    followers: 123000,
    following: 14,
    postsData: [
      { shortcode: "DZ4rQhaT8Kg", views: 69, likes: 3, comments: 0 },
      { shortcode: "DZz1TEZz_AA", views: 175, likes: 10, comments: 0 },
      { shortcode: "DZw10mikxn_", views: 0, likes: 0, comments: 1 },
      { shortcode: "DZuadhyTBdj", views: 1503, likes: 28, comments: 0 },
      { shortcode: "DZm36knzi_T", views: 2100, likes: 68, comments: 6 },
    ],
  },
};

function formatNumber(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
  return n.toLocaleString();
}

function extractHandle(url: string): string {
  const clean = url.trim().replace(/\/+$/, "");
  const match = clean.match(/instagram\.com\/([^/?#]+)/);
  return match ? match[1] : clean.replace(/^@/, "");
}

function InstagramAnalysisTab() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<ScrapeStatus>("idle");
  const [progress, setProgress] = useState(0);
  const [profile, setProfile] = useState<InstagramProfile | null>(null);
  const [scrapeCount, setScrapeCount] = useState("12");
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleScrape = () => {
    if (!url.trim()) return;
    const handle = extractHandle(url);
    setStatus("scraping");
    setProgress(0);
    setProfile(null);
    setSaved(false);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setProgress(100);
        timerRef.current = setTimeout(() => {
          const mock = MOCK_PROFILES[handle];
          setProfile(mock || {
            username: handle,
            displayName: handle,
            bio: "—",
            posts: 0,
            followers: 0,
            following: 0,
            postsData: [],
          });
          setStatus("done");
        }, 400);
      } else {
        setProgress(Math.min(p, 99));
      }
    }, 200);
  };

  const handleReset = () => {
    setStatus("idle");
    setProgress(0);
    setProfile(null);
    setUrl("");
    setSaved(false);
  };

  return (
    <div className="space-y-4">
      {/* Input Section */}
      <Card style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
              <Input
                placeholder="Masukkan URL Instagram (contoh: https://www.instagram.com/jurnal.wargajakarta/)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && status === "idle" && handleScrape()}
                disabled={status === "scraping"}
                className="pl-9 text-[13px]"
                style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
              />
            </div>
            {status === "idle" ? (
              <Button
                onClick={handleScrape}
                disabled={!url.trim()}
                className="shrink-0 font-semibold"
                style={{ background: "var(--ch-primary)", color: "white" }}
              >
                <Search className="w-4 h-4 mr-1.5" />
                Scrape
              </Button>
            ) : status === "scraping" ? (
              <Button disabled className="shrink-0" style={{ background: "var(--ch-primary)", opacity: 0.7 }}>
                <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                Scraping...
              </Button>
            ) : (
              <Button
                onClick={handleReset}
                variant="outline"
                className="shrink-0 font-semibold"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
              >
                Scrape Lagi
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      {status === "scraping" && (
        <Card style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <CardContent className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>
                {progress < 30 ? "Mengambil profil..." : progress < 60 ? "Mengambil data postingan..." : progress < 90 ? "Memproses engagement..." : "Menyelesaikan..."}
              </span>
              <span className="text-[12px] font-bold" style={{ color: "var(--ch-primary)" }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--ch-bg)" }}>
              <div
                className="h-full rounded-full transition-all duration-300 ease-out"
                style={{
                  width: `${progress}%`,
                  background: "linear-gradient(90deg, var(--ch-primary), #f97316)",
                }}
              />
            </div>
            <div className="flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" style={{ color: "var(--ch-primary)" }} />
              <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>
                Scrape data Instagram secara real-time...
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results */}
      {status === "done" && profile && (
        <>
          {/* Profile Card */}
          <Card style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: "linear-gradient(135deg, #833AB4, #FD1D1D, #FCAF45)" }}>
                  <span className="text-[22px] font-bold text-white">
                    {profile.displayName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[16px] font-bold" style={{ color: "var(--ch-text)" }}>
                      {profile.displayName}
                    </h3>
                    <span className="text-[12px] px-2 py-0.5 rounded-full font-semibold"
                      style={{ background: "var(--ch-primary-50, rgba(249,115,22,0.1))", color: "var(--ch-primary)" }}>
                      @{profile.username}
                    </span>
                  </div>
                  <p className="text-[13px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>
                    {profile.bio}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
                      <strong className="font-bold" style={{ color: "var(--ch-text)" }}>{profile.posts}</strong> posts
                    </span>
                    <span className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
                      <strong className="font-bold" style={{ color: "var(--ch-text)" }}>{formatNumber(profile.followers)}</strong> followers
                    </span>
                    <span className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
                      <strong className="font-bold" style={{ color: "var(--ch-text)" }}>{profile.following}</strong> following
                    </span>
                  </div>
                </div>
                <a
                  href={`https://www.instagram.com/${profile.username}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-[12px] font-semibold shrink-0 px-3 py-1.5 rounded-lg border transition-colors hover:bg-white/5"
                  style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}
                >
                  <ExternalLink className="w-3 h-3" />
                  Buka Profil
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Posts Table */}
          <Card style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <CardContent className="p-0">
              <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
                <h4 className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>
                  Postingan Terkini
                </h4>
                <p className="text-[12px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>
                  Menampilkan {profile.postsData.length} postingan terbaru dari @{profile.username}
                </p>
              </div>
              {profile.postsData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                        <th className="text-left px-4 py-2.5 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Account</th>
                        <th className="text-left px-4 py-2.5 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Link Post</th>
                        <th className="text-right px-4 py-2.5 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Views</th>
                        <th className="text-right px-4 py-2.5 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Likes</th>
                        <th className="text-right px-4 py-2.5 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Comments</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profile.postsData.map((post) => (
                        <tr key={post.shortcode} className="border-b last:border-b-0 transition-colors hover:bg-white/5" style={{ borderColor: "var(--ch-border)" }}>
                          <td className="px-4 py-2.5">
                            <span className="text-[12px] font-semibold" style={{ color: "var(--ch-primary)" }}>@{profile.username}</span>
                          </td>
                          <td className="px-4 py-2.5">
                            <a
                              href={`https://www.instagram.com/p/${post.shortcode}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[12px] font-mono font-semibold hover:underline"
                              style={{ color: "var(--ch-text)" }}
                            >
                              {post.shortcode}
                              <ExternalLink className="w-3 h-3" style={{ color: "var(--ch-text-muted)" }} />
                            </a>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>
                              <Eye className="w-3 h-3" style={{ color: "var(--ch-text-muted)" }} />
                              {formatNumber(post.views)}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "#EF4444" }}>
                              <Heart className="w-3 h-3" />
                              {formatNumber(post.likes)}
                            </span>
                          </td>
                          <td className="px-4 py-2.5 text-right">
                            <span className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>
                              <MessageCircle className="w-3 h-3" style={{ color: "var(--ch-text-muted)" }} />
                              {post.comments}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Instagram className="w-8 h-8 mx-auto mb-2" style={{ color: "var(--ch-text-soft)" }} />
                  <p className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>Tidak ada data postingan ditemukan.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Scrape Count + Save */}
          <Card style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>
                    Want to scrap how many posts?
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>
                    Tentukan jumlah postingan yang ingin di-scrape dari profil ini.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="1"
                    max="50"
                    value={scrapeCount}
                    onChange={(e) => setScrapeCount(e.target.value)}
                    className="w-20 text-center text-[13px] font-bold"
                    style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                  />
                  <span className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>postingan</span>
                </div>
                <Button
                  onClick={() => setSaved(true)}
                  disabled={saved}
                  className="shrink-0 font-semibold"
                  style={{
                    background: saved ? "#16A34A" : "var(--ch-primary)",
                    color: "white",
                  }}
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 mr-1.5" />
                      Tersimpan
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-1.5" />
                      Save
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Empty State */}
      {status === "idle" && (
        <Card style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <CardContent className="py-12 text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(131,58,180,0.1), rgba(253,29,29,0.1), rgba(252,175,69,0.1))" }}>
              <Instagram className="w-7 h-7" style={{ color: "#E1306C" }} />
            </div>
            <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text)" }}>
              Instagram Post Scraper
            </p>
            <p className="text-[12px] mt-1 max-w-sm mx-auto" style={{ color: "var(--ch-text-muted)" }}>
              Masukkan URL profil Instagram untuk menganalisis postingan terkini, engagement, dan metrik lainnya.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function Analytics() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1
            className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
            style={{
              color: "var(--ch-text)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Analytics
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
            Analisis proyek, leads, dan data Instagram secara real-time.
          </p>
        </div>
        {activeTab !== "instagram" && (
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white shrink-0"
            style={{ background: "var(--ch-primary)" }}
          >
            <Plus style={{ width: 13, height: 13 }} />
            {activeTab === "leads" ? "New Lead" : "New Project"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line" className="border-b w-full justify-start gap-0">
          <TabsTrigger
            value="projects"
            className={`text-[13px] font-bold px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "projects"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "text-white/50 hover:text-white/80"
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <Briefcase className="w-4 h-4 mr-1.5" />
            Projects
          </TabsTrigger>
          <TabsTrigger
            value="leads"
            className={`text-[13px] font-bold px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "leads"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "text-white/50 hover:text-white/80"
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <User className="w-4 h-4 mr-1.5" />
            Leads
          </TabsTrigger>
          <TabsTrigger
            value="instagram"
            className={`text-[13px] font-bold px-3 py-1.5 rounded-lg transition-all ${
              activeTab === "instagram"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "text-white/50 hover:text-white/80"
            }`}
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            <Instagram className="w-4 h-4 mr-1.5" />
            Instagram Analysis
          </TabsTrigger>
        </TabsList>

        {/* Projects Tab */}
        <TabsContent value="projects" className="mt-4">
          <div className="flex flex-col gap-4">
            {projects.map((p) => {
              const status = statusConfig[p.status];
              const StatusIcon = status.icon;
              return (
                <div
                  key={p.id}
                  onClick={() => navigate(`/dashboard/projects/${p.id}`)}
                  className="rounded-[14px] border overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  style={{
                    background: "var(--ch-surface)",
                    borderColor: "var(--ch-border)",
                    boxShadow: "var(--ch-shadow-sm)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div
                      className="w-full sm:w-48 h-32 sm:h-auto flex items-center justify-center shrink-0"
                      style={{ background: `hsl(${p.hue}, 80%, 95%)` }}
                    >
                      {"logo" in p && p.logo ? (
                        <img
                          src={p.logo}
                          alt={p.name}
                          className="w-20 h-20 object-contain"
                        />
                      ) : (
                        <Briefcase
                          style={{
                            width: 40,
                            height: 40,
                            color: `hsl(${p.hue}, 60%, 45%)`,
                          }}
                        />
                      )}
                    </div>
                    <div className="flex-1 p-4 sm:p-5 space-y-2">
                      <p
                        className="text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: `hsl(${p.hue}, 60%, 45%)` }}
                      >
                        {p.name}
                      </p>
                      <p
                        className="text-[16px] font-bold leading-tight"
                        style={{
                          color: "var(--ch-text)",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {p.project}
                      </p>
                      <p
                        className="text-[13px] leading-relaxed"
                        style={{ color: "var(--ch-text-muted)" }}
                      >
                        {p.brief}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: status.bg, color: status.color }}
                        >
                          <StatusIcon style={{ width: 12, height: 12 }} />
                          {status.label}
                        </span>
                        <span
                          className="text-[11px] font-medium"
                          style={{ color: "var(--ch-text-muted)" }}
                        >
                          {p.timeline}
                        </span>
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: "var(--ch-bg)",
                            color: "var(--ch-text-muted)",
                            border: "1px solid var(--ch-border)",
                          }}
                        >
                          {p.deliverables}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Leads Tab */}
        <TabsContent value="leads" className="mt-4">
          <div className="flex flex-col gap-4">
            {leads.map((l) => {
              const ls = leadStatusConfig[l.status];
              return (
                <div
                  key={l.id}
                  className="rounded-[14px] border overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  style={{
                    background: "var(--ch-surface)",
                    borderColor: "var(--ch-border)",
                    boxShadow: "var(--ch-shadow-sm)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row">
                    <div
                      className="w-full sm:w-48 h-32 sm:h-auto flex items-center justify-center shrink-0"
                      style={{ background: `hsl(${l.hue}, 80%, 95%)` }}
                    >
                      <User
                        style={{
                          width: 40,
                          height: 40,
                          color: `hsl(${l.hue}, 60%, 45%)`,
                        }}
                      />
                    </div>
                    <div className="flex-1 p-4 sm:p-5 space-y-2">
                      <p
                        className="text-[11px] font-bold uppercase tracking-wider"
                        style={{ color: `hsl(${l.hue}, 60%, 45%)` }}
                      >
                        {l.name}
                      </p>
                      <p
                        className="text-[16px] font-bold leading-tight"
                        style={{
                          color: "var(--ch-text)",
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                        }}
                      >
                        {l.project}
                      </p>
                      <p
                        className="text-[13px] leading-relaxed"
                        style={{ color: "var(--ch-text-muted)" }}
                      >
                        {l.brief}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 pt-1">
                        <span
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: ls.bg, color: ls.color }}
                        >
                          {ls.label}
                        </span>
                        <span
                          className="text-[11px] font-medium"
                          style={{ color: "var(--ch-text-muted)" }}
                        >
                          {l.timeline}
                        </span>
                        <span
                          className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: "var(--ch-bg)",
                            color: "var(--ch-text-muted)",
                            border: "1px solid var(--ch-border)",
                          }}
                        >
                          {l.budget}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        {/* Instagram Analysis Tab */}
        <TabsContent value="instagram" className="mt-4">
          <InstagramAnalysisTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
