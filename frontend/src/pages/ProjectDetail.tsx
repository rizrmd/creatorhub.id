import { useState, useEffect, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Briefcase, ChevronRight, Calendar,
  Eye, FileText, BarChart3, FolderOpen,
  Clock, ChevronDown, Loader2,
  Users, Instagram, Music, Youtube,
  Shield, Gauge, Cpu, Settings, ArrowDown, ExternalLink,
  Search, Download, X,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { instagramPostsApi, type InstagramPost, type InstagramScrapeResult } from "@/lib/api";

/* ───────────────────────── PROJECT DATA ───────────────────────── */

const PROJECTS_DATA: Record<string, {
  id: string;
  name: string;
  project: string;
  brief: string;
  status: string;
  timeline: string;
  deliverables: string;
  client: string;
  projectManager: string;
  budget: string;
  estimatedPPN: string;
  hue: number;
  logo: string;
  platforms: string[];
  stats: {
    totalContent: number;
    totalContentChange: string;
    totalReach: string;
    totalReachChange: string;
    engagementRate: string;
    engagementChange: string;
    completedPct: number;
    remainingBudget: string;
    remainingBudgetPct: string;
  };
  kpi: {
    sections: {
      name: string;
      rows: {
        platform: string;
        akun: number;
        jenisPostingan: string;
        kontenPerHari: number;
        kontenPerBulan: number;
        targetER: string;
      }[];
    }[];
    totalAkun: number;
    totalKontenHari: number;
    totalKontenBulan: number;
    totalER: string;
  };
}> = {
  "kementrian-umkm": {
    id: "kementrian-umkm",
    name: "Kementrian UMKM",
    project: "Amplifikasi Narasi & Edukasi UMKM oleh Influencers & Clippers",
    brief: "Amplifikasi Narasi, Edukasi Program untuk Meningkatkan Engagement Akun Sosial Media Kementerian UMKM dan Menjangkau Berbagai Komunitas Pengguna Sosial Media",
    status: "active",
    timeline: "21 Apr – 31 Dec 2026",
    deliverables: "50 Reels, 20 Carousel, 8 Video Tutorial",
    client: "Kementerian UMKM",
    projectManager: "Irfan Fitriansyah",
    budget: "Rp 1.929.568.500",
    estimatedPPN: "Rp 191.218.500",
    hue: 142,
    logo: "/client-logos/maman-abdurrahman.png",
    platforms: ["instagram", "tiktok", "youtube"],
    stats: {
      totalContent: 128,
      totalContentChange: "+16% vs last month",
      totalReach: "2.45M",
      totalReachChange: "+32% vs last month",
      engagementRate: "8.76%",
      engagementChange: "+2.8% vs last month",
      completedPct: 73,
      remainingBudget: "Rp 94.500.000",
      remainingBudgetPct: "27% of total budget",
    },
    kpi: {
      sections: [
        {
          name: "Shelter Accounts",
          rows: [
            { platform: "TikTok (450k+)", akun: 1, jenisPostingan: "Membuat Video Series, Narasi utama, distribusi berita & narasi kebijakan", kontenPerHari: 1, kontenPerBulan: 30, targetER: "1%+" },
            { platform: "Instagram (100k+)", akun: 1, jenisPostingan: "", kontenPerHari: 1, kontenPerBulan: 30, targetER: "1%+" },
            { platform: "YouTube (450k+)", akun: 1, jenisPostingan: "", kontenPerHari: 1, kontenPerBulan: 30, targetER: "1%+" },
          ],
        },
        {
          name: "Micro Influencer",
          rows: [
            { platform: "Tiktok (10k+)", akun: 10, jenisPostingan: "Mengomentari program Kementerian UMKM, konten edukasi UMKM, polling, video kreatif dan dinamika sektor UMKM", kontenPerHari: 10, kontenPerBulan: 300, targetER: "1%+" },
            { platform: "Instagram (10k+)", akun: 5, jenisPostingan: "", kontenPerHari: 5, kontenPerBulan: 150, targetER: "1%+" },
          ],
        },
        {
          name: "Nano Influencer",
          rows: [
            { platform: "Tiktok (1k+)", akun: 20, jenisPostingan: "Komentar warga net dalam bentuk video terkait program Kementerian UMKM, repost konten, mention akun, engage dengan akun Kementerian dan Micro dan Nano", kontenPerHari: 20, kontenPerBulan: 600, targetER: "1%+" },
            { platform: "Instagram (1k+)", akun: 20, jenisPostingan: "", kontenPerHari: 20, kontenPerBulan: 600, targetER: "1%+" },
          ],
        },
      ],
      totalAkun: 58,
      totalKontenHari: 58,
      totalKontenBulan: 1740,
      totalER: "1%+",
    },
  },
};

/* ───────────────────────── CONSTANTS ───────────────────────── */

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: "#16A34A", text: "#FFFFFF" },
  completed: { bg: "#2563EB", text: "#FFFFFF" },
  draft: { bg: "#94A3B8", text: "#FFFFFF" },
  ongoing: { bg: "#F59E0B", text: "#000000" },
};

const OVERVIEW_SUB_TABS = [
  { value: "workstream", label: "Workstream" },
  { value: "skema", label: "Skema Glorifikasi" },
  { value: "target-kpi", label: "Target & KPI" },
] as const;

/* ───────────────────────── WORKSTREAM DATA ───────────────────────── */

const WORKSTREAM_THEME = {
  vision: "Menghadirkan ekosistem komunikasi digital terpadu Kementerian Koperasi dan UKM yang memperkuat citra, kredibilitas, serta partisipasi publik melalui sinergi media, kreator, dan masyarakat.",
  mission: "Memperluas jangkauan pesan kebijakan UMKM di ranah digital melalui strategi kolaboratif dan data-driven.",
  values: ["Kolaborasi", "Kredibilitas", "Kreativitas", "Konsistensi", "Keterlibatan Publik"],
};

const WORKSTREAM_PRIORITIES = [
  { label: "Strategic", sub: "Policy & agency level", icon: Shield, color: "#3B82F6" },
  { label: "Measurable", sub: "KPI-driven", icon: Gauge, color: "#10B981" },
  { label: "Algorithmic", sub: "Platform risk", icon: Cpu, color: "#8B5CF6" },
  { label: "Operational", sub: "Resource & scale", icon: Settings, color: "#F59E0B" },
];

const WORKSTREAM_INITIATIVES = [
  { label: "Proactive", color: "#3B82F6", items: ["Kampanye digital nasional terencana (12 bulan)", "Aktivasi shelter akun sebagai kanal utama publikasi"] },
  { label: "Collaborative", color: "#10B981", items: ["Kolaborasi dengan komunitas kreator & UMKM", "Keterlibatan media dan mitra lintas sektor"] },
  { label: "Educative", color: "#8B5CF6", items: ["Pembuatan konten edukatif literasi digital & branding UMKM", "Webinar & micro-learning serie"] },
  { label: "Responsive", color: "#F97316", items: ["Monitoring opini publik & isu strategis", "Tanggapan cepat dengan konten klarifikasi"] },
];

const WORKSTREAM_TACTICAL = [
  { value: "3", label: "Shelter Accounts", sub: "Makro", color: "#3B82F6" },
  { value: "15", label: "Micro Influencers", sub: "", color: "#10B981" },
  { value: "40", label: "Nano Influencers", sub: "", color: "#8B5CF6" },
  { value: "450", label: "Amplifier Accounts", sub: "", color: "#F97316" },
];

/* ───────────────────────── SKEMA DATA ───────────────────────── */

const SKEMA_AMPLIFIERS = [
  { platform: "Instagram", color: "#E1306C", count: 150 },
  { platform: "TikTok", color: "#00F2EA", count: 150 },
  { platform: "YouTube", color: "#FF0000", count: 150 },
];

/* ───────────────────────── CONTENT PLAN TYPES ───────────────────────── */

interface ContentPlanStep {
  step: string;
  person: string;
  status: "Done" | "Processing" | "Not Done" | "No Need";
  supervisor: string;
  hasPreview?: boolean;
  previewLabel?: string;
  hasSchedule?: boolean;
}

interface ContentPlanItem {
  no: number;
  date: string;
  platform: string;
  creatorName: string;
  creatorRole: string;
  creatorAvatar: string;
  contentCode: string;
  caption: string;
  hashtags: string;
  fase: string;
  contentPillar: string;
  topic: string;
  steps: ContentPlanStep[];
}

/* ═══════════════════════════════ COMPONENT ═══════════════════════════════ */

function ContentProductionModal({ item, onClose }: { item: ContentPlanItem; onClose: () => void }) {
  const [isEditing, setIsEditing] = useState(false);
  const [caption, setCaption] = useState(item.caption);
  const [hashtags, setHashtags] = useState(item.hashtags);

  const statusColors: Record<string, { bg: string; color: string }> = {
    "Done": { bg: "#166534", color: "#4ADE80" },
    "Not Done": { bg: "#854D0E", color: "#FACC15" },
    "No Need": { bg: "#334155", color: "#94A3B8" },
    "Processing": { bg: "#92400E", color: "#FB923C" },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={onClose}>
      <div className="rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl" style={{ background: "#0F172A", border: "1px solid #1E293B" }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b" style={{ borderColor: "#1E293B" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
              <img src={item.creatorAvatar} alt={item.creatorName} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            </div>
            <div>
              <h2 className="text-[16px] font-bold" style={{ color: "#F1F5F9", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Content Production Management: {item.contentCode}
              </h2>
              <p className="text-[12px]" style={{ color: "#94A3B8" }}>{item.creatorName}</p>
              <p className="text-[11px]" style={{ color: "#64748B" }}>Konten Kreator / {item.creatorRole}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg transition-colors hover:bg-white/10">
            <X className="w-5 h-5" style={{ color: "#94A3B8" }} />
          </button>
        </div>

        {/* Content Info */}
        <div className="p-5 border-b" style={{ borderColor: "#1E293B" }}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Target Posting</p>
                <p className="text-[13px] font-semibold mt-0.5" style={{ color: "#F1F5F9" }}>{item.date}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Target Platform</p>
                <div className="flex items-center gap-1.5 mt-1">
                  {item.platform === "Instagram" && <Instagram className="w-4 h-4" style={{ color: "#E1306C" }} />}
                  {item.platform === "TikTok" && <Music className="w-4 h-4" style={{ color: "#00F2EA" }} />}
                  {item.platform === "YouTube" && <Youtube className="w-4 h-4" style={{ color: "#FF0000" }} />}
                  {item.platform === "LinkedIn" && <span className="text-[12px] font-bold" style={{ color: "#0077B5" }}>in</span>}
                  <span className="text-[12px] font-semibold" style={{ color: "#F1F5F9" }}>{item.platform}</span>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Fase</p>
                <p className="text-[13px] font-semibold mt-0.5" style={{ color: "#F1F5F9" }}>{item.fase}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Content Pillar</p>
                <p className="text-[13px] font-semibold mt-0.5" style={{ color: "#F1F5F9" }}>{item.contentPillar}</p>
              </div>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Tema/Topik</p>
                <p className="text-[14px] font-bold mt-0.5" style={{ color: "#60A5FA" }}>{item.topic}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Caption</p>
                {isEditing ? (
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full mt-1 p-2 text-[13px] rounded-lg border resize-none"
                    style={{ background: "#1E293B", borderColor: "#334155", color: "#F1F5F9" }}
                    rows={3}
                  />
                ) : (
                  <p className="text-[13px] mt-0.5 leading-relaxed" style={{ color: "#F1F5F9" }}>{caption}</p>
                )}
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "#64748B" }}>Hashtags</p>
                {isEditing ? (
                  <input
                    type="text"
                    value={hashtags}
                    onChange={(e) => setHashtags(e.target.value)}
                    className="w-full mt-1 p-2 text-[13px] rounded-lg border"
                    style={{ background: "#1E293B", borderColor: "#334155", color: "#F1F5F9" }}
                  />
                ) : (
                  <p className="text-[13px] mt-0.5" style={{ color: "#60A5FA" }}>{hashtags}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Production Steps Table */}
        <div className="p-5">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "#1E293B" }}>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>NO</th>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>ALUR PRODUKSI</th>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>PENANGGUNG JAWAB</th>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>STATUS</th>
                <th className="text-left py-2.5 px-3 text-[10px] font-bold uppercase tracking-wider" style={{ color: "#64748B" }}>SUPERVISOR</th>
              </tr>
            </thead>
            <tbody>
              {item.steps.map((step, i) => {
                const st = statusColors[step.status] || statusColors["Not Done"];
                return (
                  <Fragment key={i}>
                    <tr className="border-b" style={{ borderColor: "#1E293B" }}>
                      <td className="py-2.5 px-3 text-[12px] font-semibold" style={{ color: "#F1F5F9" }}>{i + 1}</td>
                      <td className="py-2.5 px-3 text-[12px] font-semibold" style={{ color: "#F1F5F9" }}>{step.step}</td>
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1">
                          {step.person.split(", ").map((p) => (
                            <span key={p} className="px-2 py-0.5 rounded text-[10px] font-semibold" style={{ background: "#1E3A5F", color: "#60A5FA" }}>
                              {p}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-3">
                        {step.hasSchedule ? (
                          <input
                            type="datetime-local"
                            className="px-2.5 py-1.5 rounded text-[11px] font-semibold border"
                            style={{ background: "#1E293B", borderColor: "#334155", color: "#F1F5F9" }}
                          />
                        ) : (
                          <span className="px-2.5 py-1 rounded text-[10px] font-bold" style={{ background: st.bg, color: st.color }}>
                            {step.status}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-[11px]" style={{ color: "#94A3B8" }}>{step.supervisor}</td>
                    </tr>
                    {step.hasPreview && (
                      <tr className="border-b" style={{ borderColor: "#1E293B" }}>
                        <td colSpan={5} className="py-3 px-3">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] font-semibold" style={{ color: "#94A3B8" }}>{step.previewLabel}</p>
                              <button className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded transition-colors hover:bg-red-500/10" style={{ color: "#F87171", border: "1px solid #7F1D1D" }}>
                                <Download className="w-3 h-3" /> Download Asset
                              </button>
                            </div>
                            <div className="rounded-xl overflow-hidden border" style={{ borderColor: "#1E293B", maxWidth: "480px", background: "#1A2332" }}>
                              <div className="flex items-center gap-3 p-3" style={{ background: "#1A3A2A" }}>
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ background: "#166534" }}>
                                  <FileText className="w-5 h-5" style={{ color: "#22C55E" }} />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="text-[12px] font-semibold truncate" style={{ color: "#4ADE80" }}>docs.google.com</p>
                                  <p className="text-[11px] truncate mt-0.5" style={{ color: "#86EFAC" }}>Dokumen preview untuk langkah ini</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-5 border-t flex items-center justify-between" style={{ borderColor: "#1E293B" }}>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-lg border transition-colors hover:bg-white/5"
            style={{ borderColor: "#334155", color: "#94A3B8" }}
          >
            <FileText className="w-4 h-4" />
            {isEditing ? "Batal Edit" : "Edit"}
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold rounded-lg transition-colors hover:opacity-90" style={{ background: "#2563EB", color: "white" }}>
            Save Progress
          </button>
        </div>
      </div>
    </div>
  );
}

function AnalyticsTab() {
  const [scrapeAccount, setScrapeAccount] = useState("jurnal.wargajakarta");
  const [scraping, setScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<InstagramScrapeResult | null>(null);
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [scrapeError, setScrapeError] = useState("");

  useEffect(() => {
    setLoadingPosts(true);
    instagramPostsApi.list(scrapeAccount)
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoadingPosts(false));
  }, [scrapeAccount]);

  const handleScrape = async () => {
    setScraping(true);
    setScrapeError("");
    try {
      const result = await instagramPostsApi.scrape(scrapeAccount);
      setScrapeResult(result);
      setPosts(result.data || []);
    } catch (e: any) {
      setScrapeError(e?.response?.data?.error || e.message || "Scrape failed");
    } finally {
      setScraping(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-xl border p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
        <div className="flex items-center gap-2 flex-1">
          <Instagram className="w-5 h-5" style={{ color: "#E1306C" }} />
          <input type="text" value={scrapeAccount} onChange={(e) => setScrapeAccount(e.target.value)}
            placeholder="Instagram username..." className="flex-1 px-3 py-2 text-[13px] rounded-lg border"
            style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)", background: "var(--ch-bg)" }} />
        </div>
        <button onClick={handleScrape} disabled={scraping}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-bold text-white transition-all"
          style={{ background: scraping ? "#94A3B8" : "#E1306C" }}>
          {scraping ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
          {scraping ? "Scraping..." : "Scrape & Analyze"}
        </button>
      </div>

      {scrapeError && (
        <div className="rounded-lg px-4 py-2 text-[12px] font-medium" style={{ background: "rgba(239,68,68,0.1)", color: "#EF4444" }}>{scrapeError}</div>
      )}

      {scrapeResult && scrapeResult.success && (
        <div className="rounded-xl border p-4 flex items-center gap-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <img src={scrapeResult.profilePic} alt={scrapeResult.displayName} className="w-16 h-16 rounded-full object-cover" />
          <div className="flex-1">
            <p className="text-[15px] font-bold" style={{ color: "var(--ch-text)" }}>{scrapeResult.displayName}</p>
            <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>@{scrapeResult.account}</p>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{scrapeResult.bio}</p>
            <div className="flex gap-4 mt-1">
              <span className="text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}><strong>{scrapeResult.posts}</strong> posts</span>
              <span className="text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}><strong>{(scrapeResult.followers / 1000).toFixed(1)}K</strong> followers</span>
              <span className="text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}><strong>{scrapeResult.following}</strong> following</span>
            </div>
          </div>
        </div>
      )}

      {posts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-xl border p-3" style={{ background: "rgba(225,48,108,0.1)", borderColor: "var(--ch-border)" }}>
            <p className="text-[20px] font-bold" style={{ color: "#E1306C" }}>{posts.length}</p>
            <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Total Posts Scraped</p>
          </div>
          <div className="rounded-xl border p-3" style={{ background: "rgba(16,185,129,0.1)", borderColor: "var(--ch-border)" }}>
            <p className="text-[20px] font-bold" style={{ color: "#10B981" }}>{posts.reduce((s, p) => s + p.views, 0).toLocaleString()}</p>
            <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Total Views</p>
          </div>
          <div className="rounded-xl border p-3" style={{ background: "rgba(59,130,246,0.1)", borderColor: "var(--ch-border)" }}>
            <p className="text-[20px] font-bold" style={{ color: "#3B82F6" }}>{posts.reduce((s, p) => s + p.likes, 0).toLocaleString()}</p>
            <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Total Likes</p>
          </div>
          <div className="rounded-xl border p-3" style={{ background: "rgba(245,158,11,0.1)", borderColor: "var(--ch-border)" }}>
            <p className="text-[20px] font-bold" style={{ color: "#F59E0B" }}>{posts.reduce((s, p) => s + p.comments, 0).toLocaleString()}</p>
            <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Total Comments</p>
          </div>
        </div>
      )}

      {loadingPosts ? (
        <div className="rounded-xl border p-8 text-center" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <Loader2 className="w-6 h-6 mx-auto mb-2 animate-spin" style={{ color: "var(--ch-primary)" }} />
          <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Loading posts...</p>
        </div>
      ) : posts.length > 0 ? (
        <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
            <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>All Posts — @{scrapeAccount}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                  <th className="text-left px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>No</th>
                  <th className="text-left px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Account</th>
                  <th className="text-left px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Link Post</th>
                  <th className="text-right px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Views</th>
                  <th className="text-right px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Likes</th>
                  <th className="text-right px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Comments</th>
                  <th className="text-left px-4 py-2 text-[10px] font-semibold hidden md:table-cell" style={{ color: "var(--ch-text-muted)" }}>Caption</th>
                  <th className="text-left px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Type</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p, i) => (
                  <tr key={p.id || i} className="border-b last:border-b-0 hover:bg-white/3 transition-colors" style={{ borderColor: "var(--ch-border)" }}>
                    <td className="px-4 py-2 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{i + 1}</td>
                    <td className="px-4 py-2 text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>@{p.account}</td>
                    <td className="px-4 py-2">
                      <a href={`https://www.instagram.com/p/${p.shortcode}/`} target="_blank" rel="noopener noreferrer" className="text-[11px] font-semibold hover:underline flex items-center gap-1" style={{ color: "var(--ch-primary)" }}>
                        <ExternalLink className="w-3 h-3" />{p.shortcode}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-right text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>{p.views.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>{p.likes.toLocaleString()}</td>
                    <td className="px-4 py-2 text-right text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>{p.comments.toLocaleString()}</td>
                    <td className="px-4 py-2 hidden md:table-cell">
                      <p className="text-[11px] truncate max-w-[200px]" style={{ color: "var(--ch-text-muted)" }}>{p.caption || "-"}</p>
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
                        background: p.isVideo ? "rgba(225,48,108,0.1)" : "rgba(59,130,246,0.1)",
                        color: p.isVideo ? "#E1306C" : "#3B82F6",
                      }}>{p.isVideo ? "Video" : "Photo"}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border p-12 text-center" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
          <BarChart3 className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: "var(--ch-text-muted)" }} />
          <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text)" }}>No posts yet</p>
          <p className="text-[12px] mt-1" style={{ color: "var(--ch-text-muted)" }}>Click "Scrape & Analyze" to fetch Instagram posts</p>
        </div>
      )}
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSubTab, setActiveSubTab] = useState("workstream");
  const [contentPlanSearch, setContentPlanSearch] = useState("");
  const [selectedContentItem, setSelectedContentItem] = useState<ContentPlanItem | null>(null);

  const project = PROJECTS_DATA[id || ""];

  if (!project) {
    return (
      <div className="p-6 text-center" style={{ color: "var(--ch-text-muted)" }}>
        <Briefcase className="w-12 h-12 mx-auto mb-3 opacity-40" />
        <p className="text-[14px]">Project tidak ditemukan.</p>
        <button onClick={() => navigate("/dashboard/projects")} className="mt-3 text-[13px] font-semibold underline" style={{ color: "var(--ch-primary)" }}>
          Kembali ke Projects
        </button>
      </div>
    );
  }

  const statusStyle = STATUS_COLORS[project.status] || STATUS_COLORS.draft;

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[13px]" style={{ color: "var(--ch-text-muted)" }}>
        <button onClick={() => navigate("/dashboard/projects")} className="font-semibold hover:underline" style={{ color: "#3B82F6" }}>Projects</button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span style={{ color: "var(--ch-text)" }}>Detail Project</span>
      </div>

      {/* ─── Hero Banner ─── */}
      <div className="rounded-xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}>
        <div className="flex flex-col lg:flex-row relative">
          <div className="flex-1 p-6 lg:p-8 lg:pr-72 relative z-10">
            <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: statusStyle.bg, color: statusStyle.text }}>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>
            <h1 className="text-[20px] lg:text-[24px] font-extrabold text-white leading-tight mt-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {project.project}
            </h1>
            <p className="text-[12px] text-white/50 max-w-xl leading-relaxed mt-2">{project.brief}</p>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Target Platform:</span>
              <div className="flex items-center gap-3 bg-white/5 rounded-lg px-3 py-1.5 border border-white/10">
                <span className="flex items-center gap-1.5"><Instagram className="w-4 h-4" style={{ color: "#E1306C" }} /><span className="text-[11px] font-semibold" style={{ color: "#E2E8F0" }}>Instagram</span></span>
                <span className="flex items-center gap-1.5"><Music className="w-4 h-4" style={{ color: "#00F2EA" }} /><span className="text-[11px] font-semibold" style={{ color: "#E2E8F0" }}>TikTok</span></span>
                <span className="flex items-center gap-1.5"><Youtube className="w-4 h-4" style={{ color: "#FF0000" }} /><span className="text-[11px] font-semibold" style={{ color: "#E2E8F0" }}>YouTube</span></span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 mt-4 pt-3 max-w-md">
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Client</p>
                <p className="text-[13px] text-white font-medium">{project.client}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Project Manager</p>
                <p className="text-[13px] text-white font-medium">{project.projectManager}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Timeline</p>
                <p className="text-[13px] text-white font-medium">{project.timeline}</p>
              </div>
              <div>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Budget (incl. VAT)</p>
                <p className="text-[13px] text-white font-medium">{project.budget}</p>
                <p className="text-[10px] text-white/40 mt-0.5">Est. VAT: {project.estimatedPPN}</p>
              </div>
            </div>
          </div>
          <div className="absolute top-6 right-6 z-20">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white/70 border border-white/10 hover:bg-white/5 transition-colors">
              Project Actions <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <img src={project.logo} alt={project.name} className="hidden lg:block absolute right-0 bottom-0 h-full max-h-80 w-auto object-contain object-right" style={{ filter: "brightness(0.9)" }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      </div>

      {/* ─── Horizontal Tabs ─── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList variant="line" className="border-b w-full justify-start gap-0">
          {[
            { value: "overview", label: "Overview", icon: Eye },
            { value: "content-plan", label: "Content Plan", icon: Calendar },
            { value: "influencers", label: "Influencers", icon: Users },
            { value: "deliverables", label: "Content Posted", icon: FileText },
            { value: "analytics", label: "Media Monitoring", icon: BarChart3 },
            { value: "files", label: "Files & Assets", icon: FolderOpen },
            { value: "activity", label: "Activity Log", icon: Clock },
          ].map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}
              className="text-[13px] font-bold px-3 py-1.5 rounded-lg transition-all after:!opacity-0"
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                background: activeTab === tab.value ? "#F97316" : undefined,
                color: activeTab === tab.value ? "#FFFFFF" : "#94A3B8",
                boxShadow: activeTab === tab.value ? "0 4px 14px rgba(249,115,22,.35)" : undefined,
              }}
            >
              <tab.icon className="w-4 h-4 mr-1.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ═══ OVERVIEW TAB — vertical sub-tabs ═══ */}
        <TabsContent value="overview" className="mt-6">
          <div className="flex rounded-xl overflow-hidden border" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", minHeight: "480px" }}>

            {/* Vertical Sub-Tab Sidebar */}
            <div className="w-14 shrink-0 flex flex-col border-r" style={{ borderColor: "var(--ch-border)", background: "var(--ch-bg)" }}>
              {OVERVIEW_SUB_TABS.map((sub) => {
                const isActive = activeSubTab === sub.value;
                return (
                  <button key={sub.value} onClick={() => setActiveSubTab(sub.value)} className={`flex-1 flex items-center justify-center relative transition-all ${isActive ? "bg-orange-500/10" : "hover:bg-white/5"}`}>
                    {isActive && <span className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-orange-500" />}
                    <span className="text-[11px] font-extrabold tracking-widest select-none" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)", color: isActive ? "#F97316" : "#E2E8F0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                      {sub.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sub-Tab Content */}
            <div className="flex-1 p-5 overflow-auto">

              {/* ═══ WORKSTREAM DASHBOARD ═══ */}
              {activeSubTab === "workstream" && (
                <div className="space-y-4">
                  <h2 className="text-[16px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Strategy Roadmap Dashboard</h2>

                  {/* Theme — Vision / Mission / Values */}
                  <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                          <th className="px-4 py-3 text-[13px] font-extrabold uppercase tracking-wider w-28" style={{ color: "#3B82F6", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Theme</th>
                          <th className="px-4 py-3 text-[13px] font-extrabold uppercase tracking-wider" style={{ color: "#10B981", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                          <td className="px-4 py-3 font-bold text-[12px]" style={{ color: "#3B82F6", borderLeft: "3px solid #3B82F6" }}>Vision</td>
                          <td className="px-4 py-3 text-[12px] leading-relaxed" style={{ color: "var(--ch-text)" }}>{WORKSTREAM_THEME.vision}</td>
                        </tr>
                        <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                          <td className="px-4 py-3 font-bold text-[12px]" style={{ color: "#10B981", borderLeft: "3px solid #10B981" }}>Mission</td>
                          <td className="px-4 py-3 text-[12px] leading-relaxed" style={{ color: "var(--ch-text)" }}>{WORKSTREAM_THEME.mission}</td>
                        </tr>
                        <tr>
                          <td className="px-4 py-3 font-bold text-[12px]" style={{ color: "#8B5CF6", borderLeft: "3px solid #8B5CF6" }}>Values</td>
                          <td className="px-4 py-3">
                            <div className="flex flex-wrap gap-1.5">
                              {WORKSTREAM_THEME.values.map((v) => (
                                <span key={v} className="text-[11px] font-semibold px-2 py-0.5 rounded-full border" style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}>{v}</span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Priorities — simple table */}
                  <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                          <th className="px-4 py-3 text-[13px] font-extrabold uppercase tracking-wider w-28" style={{ color: "var(--ch-text-muted)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Priorities</th>
                          <th className="px-4 py-3 text-[13px] font-extrabold uppercase tracking-wider text-center" style={{ color: "#3B82F6", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Strategic</th>
                          <th className="px-4 py-3 text-[13px] font-extrabold uppercase tracking-wider text-center" style={{ color: "#10B981", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Measurable</th>
                          <th className="px-4 py-3 text-[13px] font-extrabold uppercase tracking-wider text-center" style={{ color: "#8B5CF6", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Algorithmic</th>
                          <th className="px-4 py-3 text-[13px] font-extrabold uppercase tracking-wider text-center" style={{ color: "#F59E0B", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Operational</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-3 text-[12px] font-medium" style={{ color: "#FFFFFF" }}>Focus</td>
                          {WORKSTREAM_PRIORITIES.map((p) => (
                            <td key={p.label} className="px-4 py-3 text-[12px] font-medium text-center" style={{ color: "#FFFFFF" }}>{p.sub}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-[12px] font-medium text-center pb-3" style={{ color: "#FFFFFF" }}>"Summary of goals vs issues/challenges"</p>
                  </div>

                  {/* Strategic Initiatives — simple table */}
                  <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                          <th className="px-4 py-3 text-[13px] font-extrabold uppercase tracking-wider w-28" style={{ color: "var(--ch-text-muted)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Initiatives</th>
                          <th className="px-4 py-3 text-[13px] font-extrabold uppercase tracking-wider" style={{ color: "#3B82F6", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Proactive</th>
                          <th className="px-4 py-3 text-[13px] font-extrabold uppercase tracking-wider" style={{ color: "#10B981", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Collaborative</th>
                          <th className="px-4 py-3 text-[13px] font-extrabold uppercase tracking-wider" style={{ color: "#8B5CF6", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Educative</th>
                          <th className="px-4 py-3 text-[13px] font-extrabold uppercase tracking-wider" style={{ color: "#F97316", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Responsive</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-3 text-[15px] font-extrabold" style={{ color: "#FFFFFF", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Actions</td>
                          {WORKSTREAM_INITIATIVES.map((ini) => (
                            <td key={ini.label} className="px-3 py-3">
                              <ul className="space-y-2">
                                {ini.items.map((item, i) => (
                                  <li key={i} className="text-[12px] font-normal leading-relaxed text-white rounded-lg px-3 py-2" style={{ background: `${ini.color}20` }}>• {item}</li>
                                ))}
                              </ul>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Tactical Activities — stat cards */}
                  <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                          <th className="px-4 py-3 text-[13px] font-extrabold uppercase tracking-wider w-28" style={{ color: "var(--ch-text-muted)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tactical</th>
                          {WORKSTREAM_TACTICAL.map((t) => (
                            <th key={t.label} className="px-4 py-3 text-[13px] font-extrabold uppercase tracking-wider text-center" style={{ color: t.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-3 text-[11px] font-bold" style={{ color: "var(--ch-text-muted)" }}>Count</td>
                          {WORKSTREAM_TACTICAL.map((t) => (
                            <td key={t.label} className="px-4 py-3 text-center">
                              <span className="text-[22px] font-extrabold" style={{ color: t.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.value}</span>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ═══ SKEMA GLORIFIKASI FLOWCHART ═══ */}
              {activeSubTab === "skema" && (
                <div className="flex flex-col xl:flex-row gap-4">
                  {/* Left: Main flowchart */}
                  <div className="flex-1 space-y-3">
                    <h2 className="text-[18px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Skema Glorifikasi, Kampanye & Edukasi</h2>

                    {/* Tim Humas bar */}
                    <div className="rounded-xl border p-4 text-center" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                      <p className="text-[14px] font-extrabold mb-3" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Tim Humas Kementerian UMKM</p>
                      <div className="flex items-center justify-center gap-6 flex-wrap">
                        {[
                          { icon: "🎬", label: "Raw Video" },
                          { icon: "📋", label: "Editorial Agenda" },
                          { icon: "📅", label: "Schedule Kegiatan" },
                          { icon: "📄", label: "Press Release" },
                        ].map((item) => (
                          <span key={item.label} className="flex items-center gap-1.5 text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>
                            <span>{item.icon}</span> {item.label}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Arrow down */}
                    <div className="flex justify-center"><ArrowDown className="w-5 h-5" style={{ color: "#F97316" }} /></div>

                    {/* Official Accounts */}
                    <div className="rounded-xl border-2 p-5" style={{ borderColor: "#F97316", background: "rgba(249,115,22,0.04)", boxShadow: "0 0 20px rgba(249,115,22,0.1)" }}>
                      <div className="text-center mb-4">
                        <p className="text-[16px] font-extrabold tracking-wider" style={{ color: "#F97316", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>OFFICIAL ACCOUNTS</p>
                        <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Dikelola oleh Tim Humas Kementerian UMKM</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {[
                          { name: "Menteri UMKM", realName: "Maman Abdurrahman", posts: "626", followers: "98.2K", following: "2,046", role: "Politician", photo: "/client-logos/maman-abdurrahman.jpg" },
                          { name: "Kementerian UMKM", realName: "#KitaUMKM", posts: "1,502", followers: "113K", following: "92", role: "Government Official", sub: "Akun Resmi Kementerian UMKM RI", photo: "/client-logos/logo-kementerian-umkm.jpg", highlight: true },
                          { name: "Wakil Menteri UMKM", realName: "Helvi Moraza", posts: "748", followers: "11.6K", following: "962", role: "Politician", sub: "Wakil Menteri UMKM RI", photo: "/client-logos/helvi-moraza.jpg" },
                        ].map((acc) => (
                          <div key={acc.name} className="rounded-xl border p-4 text-center" style={{ borderColor: acc.highlight ? "#F97316" : "var(--ch-border)", background: acc.highlight ? "rgba(249,115,22,0.08)" : "var(--ch-surface)", borderWidth: acc.highlight ? "2px" : "1px" }}>
                            <div className="w-16 h-16 rounded-full mx-auto mb-2 overflow-hidden border-2" style={{ borderColor: acc.highlight ? "#F97316" : "var(--ch-border)" }}>
                              <img src={acc.photo} alt={acc.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden"); }} />
                              <div className="w-full h-full hidden items-center justify-center text-[20px] font-bold" style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
                                {acc.name[0]}
                              </div>
                            </div>
                            <p className="text-[14px] font-extrabold" style={{ color: acc.highlight ? "#F97316" : "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{acc.name}</p>
                            {acc.highlight && <p className="text-[12px] font-bold" style={{ color: "#F97316" }}>{acc.realName}</p>}
                            <p className="text-[11px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
                              <span className="font-bold" style={{ color: "var(--ch-text)" }}>{acc.posts}</span> posts &nbsp;
                              <span className="font-bold" style={{ color: "var(--ch-text)" }}>{acc.followers}</span> followers &nbsp;
                              <span className="font-bold" style={{ color: "var(--ch-text)" }}>{acc.following}</span> following
                            </p>
                            <p className="text-[11px] font-semibold mt-1" style={{ color: "#3B82F6" }}>{acc.role}</p>
                            {acc.sub && <p className="text-[10px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{acc.sub}</p>}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Konten Didistribusikan */}
                    <div className="rounded-xl border p-4 text-center" style={{ borderColor: "#F97316", background: "rgba(249,115,22,0.04)" }}>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <span className="text-[16px]">▶</span>
                        <p className="text-[14px] font-extrabold" style={{ color: "#F97316", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Konten Didistribusikan</p>
                      </div>
                      <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Video &bull; Carousel &bull; Reels &bull; Stories</p>
                    </div>

                    {/* 3 arrows down */}
                    <div className="flex justify-center gap-16">
                      {[0,1,2].map((idx) => (
                        <svg key={idx} width="20" height="25" viewBox="0 0 20 25">
                          <line x1="10" y1="0" x2="10" y2="18" stroke="#F97316" strokeWidth="2" />
                          <polygon points="5,18 10,25 15,18" fill="#F97316" />
                        </svg>
                      ))}
                    </div>

                    {/* 3 bottom sections */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* SHELTER */}
                      <div className="rounded-xl border p-3" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                        <div className="flex items-center gap-2 mb-3">
                          <Music className="w-3.5 h-3.5" style={{ color: "#00F2EA" }} />
                          <Instagram className="w-3.5 h-3.5" style={{ color: "#E1306C" }} />
                          <p className="text-[13px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>SHELTER (3)</p>
                        </div>
                        <div className="space-y-2">
                          {[
                            { handle: "jurnal.wargajakarta", followers: "123K", photo: "/profile-photos/jurnal-warga-jakarta.jpg" },
                            { handle: "kilas_umkm", followers: "447.1K", photo: "/profile-photos/kilas-umkm.jpg" },
                            { handle: "umkmhits", followers: "510K", photo: "/profile-photos/umkm-hits.jpg" },
                          ].map((s) => (
                            <div key={s.handle} className="flex items-center gap-2 p-2 rounded-lg border" style={{ borderColor: "var(--ch-border)" }}>
                              <img src={s.photo} alt={s.handle} className="w-8 h-8 rounded-lg object-cover shrink-0" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold truncate" style={{ color: "var(--ch-text)" }}>@{s.handle}</p>
                                <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{s.followers} followers</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* MIKRO */}
                      <div className="rounded-xl border p-3" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                        <div className="flex items-center gap-2 mb-1">
                          <Music className="w-3.5 h-3.5" style={{ color: "#00F2EA" }} />
                          <Instagram className="w-3.5 h-3.5" style={{ color: "#E1306C" }} />
                          <p className="text-[13px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>MIKRO (15)</p>
                        </div>
                        <p className="text-[10px] mb-2" style={{ color: "var(--ch-text-muted)" }}>TikTok: 10 &bull; Instagram: 5</p>
                        <div className="grid grid-cols-6 gap-1.5">
                          {[
                            "klikbisnis","sentrakarya","ceritadagang","arusniaga","sobatusaha",
                            "kawanlokal","pusatlapak","nadiniaga","terasbisnis","halousaha",
                            "lenteraniaga","jawaralokal","arahusaha","poinniaga","orbitbisnis",
                          ].map((u) => (
                            <img key={u} src={`/profile-photos/${u}.jpeg`} alt={u} className="w-8 h-8 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          ))}
                        </div>
                      </div>

                      {/* NANO */}
                      <div className="rounded-xl border p-3" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                        <div className="flex items-center gap-2 mb-1">
                          <Music className="w-3.5 h-3.5" style={{ color: "#00F2EA" }} />
                          <Instagram className="w-3.5 h-3.5" style={{ color: "#E1306C" }} />
                          <p className="text-[13px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>NANO (40)</p>
                        </div>
                        <p className="text-[10px] mb-2" style={{ color: "var(--ch-text-muted)" }}>TikTok: 20 &bull; Instagram: 20</p>
                        <div className="grid grid-cols-8 gap-1">
                          {[
                            "jakbrebes1928","veraa04_","novel.best.seller8","beatrixchan7","ferdhhyontop","keyzaa04_","anakmama","khoiriyahap",
                            "ayycanss24","mama.ichacut","rivakah032","cyllabcdefghijk","reyhanz056","rindunay_","jeryyv2","jennarxvender",
                            "jbceltastr","mey.sibal","lovelyy.v2","rachmanti_mantiie","meymey0519","vt_nay","amelia_srswt","ilyiee",
                            "citracalinda","milaamirandaa09","3acsyaaa","maryati2542","clara4calista4","parcia.cia","mahesagantengbangett","heraaharsaa",
                          ].map((u) => (
                            <img key={u} src={`/profile-photos/${u}.jpg`} alt={u} className="w-7 h-7 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                          ))}
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold" style={{ background: "var(--ch-border)", color: "var(--ch-text-muted)" }}>+25</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Amplifications Card */}
                  <div className="xl:w-[280px] shrink-0 rounded-2xl border-2 p-5 self-start" style={{ borderColor: "rgba(139,92,246,0.5)", background: "rgba(15,23,42,0.6)", boxShadow: "0 0 30px rgba(139,92,246,0.15)" }}>
                    <div className="text-center mb-4">
                      <h3 className="text-[18px] font-extrabold tracking-wider" style={{ color: "#E1306C", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>AMPLIFICATIONS</h3>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5" style={{ color: "#94A3B8" }}>Boost Engagements</p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 mb-4">
                      {[
                        { label: "Likes", icon: "❤️", bg: "rgba(225,48,108,0.15)", border: "rgba(225,48,108,0.3)", color: "#E1306C" },
                        { label: "Shares", icon: "🔗", bg: "rgba(59,130,246,0.15)", border: "rgba(59,130,246,0.3)", color: "#3B82F6" },
                        { label: "Comments", icon: "💬", bg: "rgba(16,185,129,0.15)", border: "rgba(16,185,129,0.3)", color: "#10B981" },
                        { label: "Mentions", icon: "@", bg: "rgba(249,115,22,0.15)", border: "rgba(249,115,22,0.3)", color: "#F97316" },
                      ].map((pill) => (
                        <span key={pill.label} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold"
                          style={{ background: pill.bg, border: `1px solid ${pill.border}`, color: pill.color }}>
                          {pill.icon} {pill.label}
                        </span>
                      ))}
                    </div>
                    <div className="border-t border-dashed mb-4" style={{ borderColor: "rgba(255,255,255,0.15)" }} />
                    <div className="space-y-3">
                      {SKEMA_AMPLIFIERS.map((amp) => (
                        <div key={amp.platform} className="rounded-xl border p-4 text-center"
                          style={{ borderColor: `${amp.color}50`, background: `${amp.color}08`, boxShadow: `0 0 20px ${amp.color}15` }}>
                          <div className="flex items-center justify-center gap-2 mb-2">
                            {amp.platform === "Instagram" && <Instagram className="w-4 h-4" style={{ color: amp.color }} />}
                            {amp.platform === "TikTok" && <Music className="w-4 h-4" style={{ color: amp.color }} />}
                            {amp.platform === "YouTube" && <Youtube className="w-4 h-4" style={{ color: amp.color }} />}
                            <p className="text-[12px] font-extrabold" style={{ color: amp.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Amplifier {amp.platform}</p>
                          </div>
                          <p className="text-[32px] font-extrabold leading-none" style={{ color: amp.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{amp.count}</p>
                          <p className="text-[11px] font-semibold mt-1" style={{ color: "#E2E8F0" }}>Akun Amplifier</p>
                          <p className="text-[10px]" style={{ color: "#64748B" }}>(100 – 1.000 Followers)</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center mt-4">
                      <svg width="40" height="30" viewBox="0 0 40 30">
                        <line x1="0" y1="15" x2="30" y2="15" stroke="#8B5CF6" strokeWidth="2" />
                        <polygon points="0,10 10,15 0,20" fill="#8B5CF6" />
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ TARGET & KPI ═══ */}
              {activeSubTab === "target-kpi" && project.kpi && (
                <div className="space-y-4">
                  <h2 className="text-[16px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Target & KPI</h2>
                  <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Lapisan</th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: "var(--ch-text-muted)" }}>Keterlibatan Akun</th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Jenis Postingan</th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: "var(--ch-text-muted)" }}>Target Total Konten / Hari</th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: "var(--ch-text-muted)" }}>Target Total Konten / Bulan (30 Hari)</th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: "var(--ch-text-muted)" }}>Target ER / Konten</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.kpi.sections.map((section) => (
                          <Fragment key={section.name}>
                            <tr>
                              <td colSpan={6} className="px-4 py-2 text-[13px] font-bold" style={{ color: "#06B6D4", borderLeft: "3px solid #06B6D4" }}>
                                {section.name}
                              </td>
                            </tr>
                            {section.rows.map((row, ri) => (
                              <tr key={ri} className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                                <td className="px-4 py-2.5 text-[12px] font-medium" style={{ color: "var(--ch-text)" }}>{row.platform}</td>
                                <td className="px-4 py-2.5 text-[12px] font-semibold text-center" style={{ color: "var(--ch-text)" }}>{row.akun}</td>
                                <td className="px-4 py-2.5 text-[11px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{row.jenisPostingan}</td>
                                <td className="px-4 py-2.5 text-[12px] font-semibold text-center" style={{ color: "var(--ch-text)" }}>{row.kontenPerHari}</td>
                                <td className="px-4 py-2.5 text-[12px] font-semibold text-center" style={{ color: "var(--ch-text)" }}>{row.kontenPerBulan.toLocaleString("id-ID")}</td>
                                <td className="px-4 py-2.5 text-[12px] font-semibold text-center" style={{ color: "var(--ch-text)" }}>{row.targetER}</td>
                              </tr>
                            ))}
                          </Fragment>
                        ))}
                        <tr className="font-bold" style={{ background: "rgba(59,130,246,0.1)" }}>
                          <td className="px-4 py-3 text-[13px]" style={{ color: "#3B82F6" }}>Total</td>
                          <td className="px-4 py-3 text-[13px] text-center" style={{ color: "#3B82F6" }}>{project.kpi.totalAkun} Akun</td>
                          <td className="px-4 py-3"></td>
                          <td className="px-4 py-3 text-[13px] text-center" style={{ color: "#3B82F6" }}>{project.kpi.totalKontenHari} Konten</td>
                          <td className="px-4 py-3 text-[13px] text-center" style={{ color: "#3B82F6" }}>{project.kpi.totalKontenBulan.toLocaleString("id-ID")} Konten</td>
                          <td className="px-4 py-3 text-[13px] text-center" style={{ color: "#3B82F6" }}>{project.kpi.totalER}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ═══ CONTENT PLAN TAB ═══ */}
        <TabsContent value="content-plan" className="mt-6 space-y-4">
          {(() => {
            const contentPlan: ContentPlanItem[] = [
              { no: 1, date: "7 April 2025", platform: "TikTok", creatorName: "Budi Wijaya", creatorRole: "Content Creator", creatorAvatar: "/creators/jerome-polin.png", contentCode: "KONTEN-001", caption: "Tips memulai UMKM dari nol! Simak langkah-langkahnya di video ini. #UMKM #EkonomiKreatif", hashtags: "#UMKM #EkonomiKreatif #IndonesiaMaju", fase: "Awareness", contentPillar: "Edukasi", topic: "Edukasi Digitalisasi UMKM untuk Generasi Muda", steps: [
                { step: "Pembuatan Script & Caption", person: "Content Writer", status: "Done", supervisor: "Editor in Chief" },
                { step: "Storyboard & Visual Elements", person: "Content Writer", status: "Done", supervisor: "Editor in Chief" },
                { step: "Script Approved by Client", person: "Content Writer, Editor in Chief", status: "Done", supervisor: "Project Manager" },
                { step: "Raw Materials (Video/Pictures)", person: "Videographer, Klien", status: "Done", supervisor: "Editor in Chief" },
                { step: "Produksi Konten", person: "Graphic Designer, Video Editor", status: "Done", supervisor: "Editor in Chief" },
                { step: "Review Konten", person: "Editor in Chief, Klien", status: "No Need", supervisor: "Digital Specialist" },
                { step: "Revisi (jika ada)", person: "Video Editor, Graphic Designer", status: "No Need", supervisor: "Editor in Chief" },
                { step: "Content Approved by", person: "Editor in Chief, Klien", status: "Done", supervisor: "Project Manager" },
                { step: "Penjadwalan Posting", person: "Digital Strategist", status: "Processing", supervisor: "Project Manager", hasSchedule: true },
                { step: "Konten diposting", person: "Klien", status: "Not Done", supervisor: "Project Manager" },
              ]},
              { no: 2, date: "5 April 2025", platform: "Instagram", creatorName: "Ani Suryani", creatorRole: "Content Creator", creatorAvatar: "/creators/rachel-vennya.png", contentCode: "KONTEN-002", caption: "Program Kementerian UMKM yang wajib diketahui oleh seluruh pelaku UMKM di Indonesia!", hashtags: "#KementerianUMKM #ProgramUMKM #UsahaMikro", fase: "Awareness", contentPillar: "Edukasi", topic: "Kampanye Program Prioritas Kementerian UMKM", steps: [
                { step: "Pembuatan Script & Caption", person: "Content Writer", status: "Done", supervisor: "Editor in Chief" },
                { step: "Storyboard & Visual Elements", person: "Content Writer", status: "Done", supervisor: "Editor in Chief" },
                { step: "Script Approved by Client", person: "Content Writer, Editor in Chief", status: "Done", supervisor: "Project Manager" },
                { step: "Raw Materials (Video/Pictures)", person: "Videographer, Klien", status: "Done", supervisor: "Editor in Chief" },
                { step: "Produksi Konten", person: "Graphic Designer, Video Editor", status: "Done", supervisor: "Editor in Chief" },
                { step: "Review Konten", person: "Editor in Chief, Klien", status: "No Need", supervisor: "Digital Specialist" },
                { step: "Revisi (jika ada)", person: "Video Editor, Graphic Designer", status: "No Need", supervisor: "Editor in Chief" },
                { step: "Content Approved by", person: "Editor in Chief, Klien", status: "Done", supervisor: "Project Manager" },
                { step: "Penjadwalan Posting", person: "Digital Strategist", status: "Not Done", supervisor: "Project Manager", hasSchedule: true },
                { step: "Konten diposting", person: "Klien", status: "Not Done", supervisor: "Project Manager" },
              ]},
              { no: 3, date: "6 April 2025", platform: "YouTube", creatorName: "Cahya Putra", creatorRole: "Video Producer", creatorAvatar: "/creators/fadil-jaidi.png", contentCode: "KONTEN-003", caption: "Tutorial lengkap digital marketing untuk UMKM. Mulai dari nol sampai bisa jualan online!", hashtags: "#DigitalMarketing #UMKM #TutorialJualanOnline", fase: "Education", contentPillar: "Tutorial", topic: "Tutorial Digital Marketing untuk Pelaku UMKM", steps: [
                { step: "Pembuatan Script & Caption", person: "Content Writer", status: "Done", supervisor: "Editor in Chief" },
                { step: "Storyboard & Visual Elements", person: "Content Writer", status: "Done", supervisor: "Editor in Chief" },
                { step: "Script Approved by Client", person: "Content Writer, Editor in Chief", status: "Done", supervisor: "Project Manager" },
                { step: "Raw Materials (Video/Pictures)", person: "Videographer, Klien", status: "Done", supervisor: "Editor in Chief" },
                { step: "Produksi Konten", person: "Graphic Designer, Video Editor", status: "Done", supervisor: "Editor in Chief" },
                { step: "Review Konten", person: "Editor in Chief, Klien", status: "No Need", supervisor: "Digital Specialist" },
                { step: "Revisi (jika ada)", person: "Video Editor, Graphic Designer", status: "No Need", supervisor: "Editor in Chief" },
                { step: "Content Approved by", person: "Editor in Chief, Klien", status: "Done", supervisor: "Project Manager" },
                { step: "Penjadwalan Posting", person: "Digital Strategist", status: "Not Done", supervisor: "Project Manager", hasSchedule: true },
                { step: "Konten diposting", person: "Klien", status: "Not Done", supervisor: "Project Manager" },
              ]},
              { no: 4, date: "7 April 2025", platform: "LinkedIn", creatorName: "Dewi Lestari", creatorRole: "Content Writer", creatorAvatar: "/creators/rahadi-wangsapermana.jpg", contentCode: "KONTEN-004", caption: "Analisis dampak program UMKM terhadap pertumbuhan ekonomi nasional. Data-driven insight untuk para pelaku usaha.", hashtags: "#EkonomiUMKM #PertumbuhanEkonomi #DataDriven", fase: "Engagement", contentPillar: "Insight", topic: "Insight Ekonomi: Dampak Program UMKM terhadap GDP", steps: [
                { step: "Pembuatan Script & Caption", person: "Content Writer", status: "Not Done", supervisor: "Editor in Chief" },
                { step: "Storyboard & Visual Elements", person: "Content Writer", status: "Not Done", supervisor: "Editor in Chief" },
                { step: "Script Approved by Client", person: "Content Writer, Editor in Chief", status: "Not Done", supervisor: "Project Manager" },
                { step: "Raw Materials (Video/Pictures)", person: "Videographer, Klien", status: "Not Done", supervisor: "Editor in Chief" },
                { step: "Produksi Konten", person: "Graphic Designer, Video Editor", status: "Not Done", supervisor: "Editor in Chief" },
                { step: "Review Konten", person: "Editor in Chief, Klien", status: "No Need", supervisor: "Digital Specialist" },
                { step: "Revisi (jika ada)", person: "Video Editor, Graphic Designer", status: "No Need", supervisor: "Editor in Chief" },
                { step: "Content Approved by", person: "Editor in Chief, Klien", status: "Not Done", supervisor: "Project Manager" },
                { step: "Penjadwalan Posting", person: "Digital Strategist", status: "Not Done", supervisor: "Project Manager", hasSchedule: true },
                { step: "Konten diposting", person: "Klien", status: "Not Done", supervisor: "Project Manager" },
              ]},
              { no: 5, date: "8 April 2025", platform: "TikTok", creatorName: "Eko Prasetyo", creatorRole: "Video Creator", creatorAvatar: "/creators/jerome-polin.png", contentCode: "KONTEN-005", caption: "Cerita sukses UMKM Indonesia yang Goes International! Inspirasinya luar biasa.", hashtags: "#UMKMIndonesia #Sukses #GoesInternational", fase: "Conversion", contentPillar: "Success Story", topic: "Success Story: UMKM Lokal yang Go Internasional", steps: [
                { step: "Pembuatan Script & Caption", person: "Content Writer", status: "Not Done", supervisor: "Editor in Chief" },
                { step: "Storyboard & Visual Elements", person: "Content Writer", status: "Not Done", supervisor: "Editor in Chief" },
                { step: "Script Approved by Client", person: "Content Writer, Editor in Chief", status: "Not Done", supervisor: "Project Manager" },
                { step: "Raw Materials (Video/Pictures)", person: "Videographer, Klien", status: "Not Done", supervisor: "Editor in Chief" },
                { step: "Produksi Konten", person: "Graphic Designer, Video Editor", status: "Not Done", supervisor: "Editor in Chief" },
                { step: "Review Konten", person: "Editor in Chief, Klien", status: "No Need", supervisor: "Digital Specialist" },
                { step: "Revisi (jika ada)", person: "Video Editor, Graphic Designer", status: "No Need", supervisor: "Editor in Chief" },
                { step: "Content Approved by", person: "Editor in Chief, Klien", status: "Not Done", supervisor: "Project Manager" },
                { step: "Penjadwalan Posting", person: "Digital Strategist", status: "Not Done", supervisor: "Project Manager", hasSchedule: true },
                { step: "Konten diposting", person: "Klien", status: "Not Done", supervisor: "Project Manager" },
              ]},
            ];

            const filtered = contentPlan.filter((c) =>
              c.topic.toLowerCase().includes(contentPlanSearch.toLowerCase()) ||
              c.platform.toLowerCase().includes(contentPlanSearch.toLowerCase()) ||
              c.creatorName.toLowerCase().includes(contentPlanSearch.toLowerCase()) ||
              c.contentCode.toLowerCase().includes(contentPlanSearch.toLowerCase())
            );

            const platformColor = (p: string) => {
              if (p === "Instagram") return { bg: "rgba(225,48,108,0.15)", text: "#E1306C" };
              if (p === "TikTok") return { bg: "rgba(0,242,234,0.15)", text: "#00F2EA" };
              if (p === "YouTube") return { bg: "rgba(255,0,0,0.15)", text: "#FF0000" };
              return { bg: "rgba(0,119,181,0.15)", text: "#0077B5" };
            };

            const totalDone = contentPlan.filter((c) => c.steps.every((s) => s.status === "Done" || s.status === "No Need")).length;
            const totalProcessing = contentPlan.filter((c) => c.steps.some((s) => s.status === "Processing")).length;
            const totalPending = contentPlan.filter((c) => c.steps.some((s) => s.status === "Not Done")).length;

            return (
              <>
                {/* Summary Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="rounded-xl border p-3" style={{ background: "rgba(59,130,246,0.1)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[20px] font-bold" style={{ color: "#3B82F6" }}>{contentPlan.length}</p>
                    <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Total Konten</p>
                  </div>
                  <div className="rounded-xl border p-3" style={{ background: "rgba(16,185,129,0.1)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[20px] font-bold" style={{ color: "#10B981" }}>{totalDone}</p>
                    <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Selesai</p>
                  </div>
                  <div className="rounded-xl border p-3" style={{ background: "rgba(245,158,11,0.1)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[20px] font-bold" style={{ color: "#F59E0B" }}>{totalProcessing}</p>
                    <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Processing</p>
                  </div>
                  <div className="rounded-xl border p-3" style={{ background: "rgba(239,68,68,0.1)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[20px] font-bold" style={{ color: "#EF4444" }}>{totalPending}</p>
                    <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Belum Dikerjakan</p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
                    <input
                      type="text"
                      placeholder="Cari konten, platform, kreator..."
                      value={contentPlanSearch}
                      onChange={(e) => setContentPlanSearch(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border"
                      style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)", color: "var(--ch-text)" }}
                    />
                  </div>
                  <span className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
                    {filtered.length} konten
                  </span>
                </div>

                {/* Pipeline Table */}
                <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                          <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>No</th>
                          <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Platform</th>
                          <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Tema/Topik</th>
                          <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Konten Kreator</th>
                          <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Fase</th>
                          <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Progress</th>
                          <th className="text-left py-3 px-4 text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filtered.map((content) => {
                          const doneCount = content.steps.filter((s) => s.status === "Done").length;
                          const totalSteps = content.steps.length;
                          const progress = Math.round((doneCount / totalSteps) * 100);
                          const pc = platformColor(content.platform);
                          return (
                            <tr key={content.no} className="border-b last:border-b-0 hover:bg-white/[0.02] transition-colors" style={{ borderColor: "var(--ch-border)" }}>
                              <td className="py-3.5 px-4">
                                <span className="text-[13px] font-bold" style={{ color: "var(--ch-text-muted)" }}>{content.no}</span>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: pc.bg, color: pc.text }}>
                                  {content.platform}
                                </span>
                              </td>
                              <td className="py-3.5 px-4">
                                <p className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{content.topic}</p>
                                <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{content.contentCode} · {content.date}</p>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                                    <img src={content.creatorAvatar} alt={content.creatorName} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                                  </div>
                                  <div>
                                    <p className="text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>{content.creatorName}</p>
                                    <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{content.creatorRole}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <span className="text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{content.fase}</span>
                              </td>
                              <td className="py-3.5 px-4">
                                <div className="space-y-1 min-w-[120px]">
                                  <div className="flex items-center justify-between">
                                    <span className="text-[11px] font-semibold" style={{ color: "var(--ch-text)" }}>{doneCount}/{totalSteps} Steps</span>
                                    <span className="text-[11px] font-bold" style={{ color: progress === 100 ? "#10B981" : progress > 50 ? "#F59E0B" : "#EF4444" }}>{progress}%</span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full" style={{ background: "var(--ch-border)" }}>
                                    <div className="h-full rounded-full" style={{ width: `${progress}%`, background: progress === 100 ? "#10B981" : progress > 50 ? "#F59E0B" : "#EF4444" }} />
                                  </div>
                                  <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>
                                    {content.steps.some((s) => s.status === "Processing") ? "Processing" : content.steps.every((s) => s.status === "Done" || s.status === "No Need") ? "Selesai" : "Belum dikerjakan"}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3.5 px-4">
                                <button onClick={() => setSelectedContentItem(content)} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors hover:bg-white/10" style={{ color: "var(--ch-text-muted)", border: "1px solid var(--ch-border)" }}>
                                  <Eye className="w-3 h-3" /> View
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Detail Modal */}
                {selectedContentItem && (
                  <ContentProductionModal item={selectedContentItem} onClose={() => setSelectedContentItem(null)} />
                )}
              </>
            );
          })()}
        </TabsContent>

        {/* ═══ DELIVERABLES TAB ═══ */}
        <TabsContent value="deliverables" className="mt-6 space-y-4">
          {(() => {
            const deliverables = [
              // 18 Juni
              { no: 1, platform: "Instagram", date: "18 Juni 2026", account: "jawaralokal_", link: "https://www.instagram.com/p/DZwrJSekvGz/", followers: "14,500" },
              { no: 2, platform: "Instagram", date: "18 Juni 2026", account: "lenteraniaga", link: "https://www.instagram.com/reel/DZwhIB4zh7K/", followers: "14,600" },
              { no: 3, platform: "Instagram", date: "18 Juni 2026", account: "arahusaha", link: "https://www.instagram.com/reel/DZwr0cvBuKA/", followers: "15,600" },
              { no: 4, platform: "Instagram", date: "18 Juni 2026", account: "orbitbisnis", link: "https://www.instagram.com/p/DZu2BnUEivT/", followers: "16,100" },
              { no: 5, platform: "Instagram", date: "18 Juni 2026", account: "poinniaga", link: "https://www.instagram.com/poin_niaga/", followers: "12,100" },
              { no: 6, platform: "TikTok", date: "18 Juni 2026", account: "ceritadagang", link: "https://vt.tiktok.com/ZSQn3k6tU/", followers: "39,800" },
              { no: 7, platform: "TikTok", date: "18 Juni 2026", account: "arusniaga", link: "https://vt.tiktok.com/ZSQn2STdG/", followers: "48,600" },
              { no: 8, platform: "TikTok", date: "18 Juni 2026", account: "halousaha", link: "https://vt.tiktok.com/ZSQn2a4RV/", followers: "17,400" },
              { no: 9, platform: "TikTok", date: "18 Juni 2026", account: "kawanlokal", link: "https://vt.tiktok.com/ZSQnxeApV/", followers: "28,500" },
              { no: 10, platform: "TikTok", date: "18 Juni 2026", account: "klikbisnis2", link: "https://vt.tiktok.com/ZSQWNstS7/", followers: "73,200" },
              { no: 11, platform: "TikTok", date: "18 Juni 2026", account: "nadiniaga", link: "https://vt.tiktok.com/ZSQ7JCnjN/", followers: "25,000" },
              { no: 12, platform: "TikTok", date: "18 Juni 2026", account: "sentrakarya", link: "https://vt.tiktok.com/ZSQWADrPA/", followers: "10,200" },
              { no: 13, platform: "TikTok", date: "18 Juni 2026", account: "pusatlapak", link: "https://vt.tiktok.com/ZSQWA3YLa/", followers: "10,500" },
              { no: 14, platform: "TikTok", date: "18 Juni 2026", account: "teras bisnis", link: "https://vt.tiktok.com/ZSQnMKFpr/", followers: "21,800" },
              { no: 15, platform: "TikTok", date: "18 Juni 2026", account: "sobatusaha", link: "https://vt.tiktok.com/ZSQnfFUDN/", followers: "10,200" },
              // 19 Juni
              { no: 16, platform: "Instagram", date: "19 Juni 2026", account: "jawaralokal_", link: "https://www.instagram.com/p/DZwzB_lElfr/", followers: "14,500" },
              { no: 17, platform: "Instagram", date: "19 Juni 2026", account: "lenteraniaga", link: "https://www.instagram.com/reel/DZxFxj0TYE1/", followers: "14,600" },
              { no: 18, platform: "Instagram", date: "19 Juni 2026", account: "arahusaha", link: "https://www.instagram.com/reel/DZw-bjsyz-T/", followers: "15,600" },
              { no: 19, platform: "Instagram", date: "19 Juni 2026", account: "orbitbisnis", link: "https://www.instagram.com/reel/DZxTdfuPtvI/", followers: "16,100" },
              { no: 20, platform: "Instagram", date: "19 Juni 2026", account: "poinniaga", link: "https://www.instagram.com/p/DZxUH8ilLaw/", followers: "12,100" },
              { no: 21, platform: "TikTok", date: "19 Juni 2026", account: "ceritadagang", link: "https://vt.tiktok.com/ZSQv2h2rh/", followers: "39,800" },
              { no: 22, platform: "TikTok", date: "19 Juni 2026", account: "arusniaga", link: "https://vt.tiktok.com/ZSQv2d7YW/", followers: "48,600" },
              { no: 23, platform: "TikTok", date: "19 Juni 2026", account: "halousaha", link: "https://vt.tiktok.com/ZSQvUCdxh/", followers: "17,400" },
              { no: 24, platform: "TikTok", date: "19 Juni 2026", account: "kawanlokal", link: "https://vt.tiktok.com/ZSQvLpnh9/", followers: "28,500" },
              { no: 25, platform: "TikTok", date: "19 Juni 2026", account: "klikbisnis2", link: "https://vt.tiktok.com/ZSQvNv2DY/", followers: "73,200" },
              { no: 26, platform: "TikTok", date: "19 Juni 2026", account: "nadiniaga", link: "https://vt.tiktok.com/ZSQ7t5ETB/", followers: "25,000" },
              { no: 27, platform: "TikTok", date: "19 Juni 2026", account: "sentrakarya", link: "https://vt.tiktok.com/ZSQvRKhnN/", followers: "10,200" },
              { no: 28, platform: "TikTok", date: "19 Juni 2026", account: "pusatlapak", link: "https://vt.tiktok.com/ZSQv8BFef/", followers: "10,500" },
              { no: 29, platform: "TikTok", date: "19 Juni 2026", account: "teras bisnis", link: "https://vt.tiktok.com/ZSQ75B5cP/", followers: "21,800" },
              { no: 30, platform: "TikTok", date: "19 Juni 2026", account: "sobatusaha", link: "https://vt.tiktok.com/ZSQv8Vs4P/", followers: "10,200" },
              // 20 Juni
              { no: 31, platform: "Instagram", date: "20 Juni 2026", account: "jawaralokal_", link: "https://www.instagram.com/p/DZzGkuEkh5h/", followers: "14,500" },
              { no: 32, platform: "Instagram", date: "20 Juni 2026", account: "lenteraniaga", link: "https://www.instagram.com/reel/DZzthKuTl5g/", followers: "14,600" },
              { no: 33, platform: "Instagram", date: "20 Juni 2026", account: "arahusaha", link: "https://www.instagram.com/reel/DZzIhUSSKC2/", followers: "15,600" },
              { no: 34, platform: "Instagram", date: "20 Juni 2026", account: "orbitbisnis", link: "https://www.instagram.com/p/DZz46UmFP5z/", followers: "16,100" },
              { no: 35, platform: "Instagram", date: "20 Juni 2026", account: "poinniaga", link: "https://www.instagram.com/reel/DZz5So1vP_x/", followers: "12,100" },
              { no: 36, platform: "TikTok", date: "20 Juni 2026", account: "ceritadagang", link: "https://vt.tiktok.com/ZSQT45EQT/", followers: "39,800" },
              { no: 37, platform: "TikTok", date: "20 Juni 2026", account: "arusniaga", link: "https://vt.tiktok.com/ZSQT2m2dX/", followers: "48,600" },
              { no: 38, platform: "TikTok", date: "20 Juni 2026", account: "halousaha", link: "https://vt.tiktok.com/ZSQT3RhN8/", followers: "17,400" },
              { no: 39, platform: "TikTok", date: "20 Juni 2026", account: "kawanlokal", link: "https://vt.tiktok.com/ZSQTa2ANd/", followers: "28,500" },
              { no: 40, platform: "TikTok", date: "20 Juni 2026", account: "klikbisnis2", link: "https://vt.tiktok.com/ZSQT5XxTK/", followers: "73,200" },
              { no: 41, platform: "TikTok", date: "20 Juni 2026", account: "nadiniaga", link: "https://vt.tiktok.com/ZSQTSstoE/", followers: "25,000" },
              { no: 42, platform: "TikTok", date: "20 Juni 2026", account: "sentrakarya", link: "https://vt.tiktok.com/ZSQTjKKDt/", followers: "10,200" },
              { no: 43, platform: "TikTok", date: "20 Juni 2026", account: "pusatlapak", link: "https://vt.tiktok.com/ZSQTj28fF/", followers: "10,500" },
              { no: 44, platform: "TikTok", date: "20 Juni 2026", account: "teras bisnis", link: "https://vt.tiktok.com/ZSQT525yh/", followers: "21,800" },
              { no: 45, platform: "TikTok", date: "20 Juni 2026", account: "sobatusaha", link: "https://vt.tiktok.com/ZSQTDqVnm/", followers: "10,200" },
              // 22 Juni
              { no: 46, platform: "Instagram", date: "22 Juni 2026", account: "jawaralokal_", link: "https://www.instagram.com/p/DZ4R1a5kvw2/", followers: "14,500" },
              { no: 47, platform: "Instagram", date: "22 Juni 2026", account: "lenteraniaga", link: "https://www.instagram.com/reel/DZ49udjzKW9/", followers: "14,600" },
              { no: 48, platform: "Instagram", date: "22 Juni 2026", account: "arahusaha", link: "https://www.instagram.com/reel/DZ4YgUcvHtR/", followers: "15,600" },
              { no: 49, platform: "Instagram", date: "22 Juni 2026", account: "orbitbisnis", link: "https://www.instagram.com/p/DZ4gqMDFIhQ/", followers: "16,100" },
              { no: 50, platform: "Instagram", date: "22 Juni 2026", account: "poinniaga", link: "https://www.instagram.com/p/DZ4gdcXPNbi/", followers: "12,100" },
              { no: 51, platform: "TikTok", date: "22 Juni 2026", account: "ceritadagang", link: "https://vt.tiktok.com/ZSC1FoHfm/", followers: "39,800" },
              { no: 52, platform: "TikTok", date: "22 Juni 2026", account: "arusniaga", link: "https://vt.tiktok.com/ZSC1pHoR8/", followers: "48,600" },
              { no: 53, platform: "TikTok", date: "22 Juni 2026", account: "halousaha", link: "https://vt.tiktok.com/ZSC1Tu8LS/", followers: "17,400" },
              { no: 54, platform: "TikTok", date: "22 Juni 2026", account: "kawanlokal", link: "https://vt.tiktok.com/ZSCJAL9rk/", followers: "28,500" },
              { no: 55, platform: "TikTok", date: "22 Juni 2026", account: "klikbisnis2", link: "https://vt.tiktok.com/ZSC1sfxFa/", followers: "73,200" },
              { no: 56, platform: "TikTok", date: "22 Juni 2026", account: "nadiniaga", link: "https://vt.tiktok.com/ZSC1xt4Du/", followers: "25,000" },
              { no: 57, platform: "TikTok", date: "22 Juni 2026", account: "sentrakarya", link: "https://vt.tiktok.com/ZSC1W39s7/", followers: "10,200" },
              { no: 58, platform: "TikTok", date: "22 Juni 2026", account: "pusatlapak", link: "https://vt.tiktok.com/ZSC1WwGD1/", followers: "10,500" },
              { no: 59, platform: "TikTok", date: "22 Juni 2026", account: "teras bisnis", link: "https://vt.tiktok.com/ZSC1oNrrf/", followers: "21,800" },
              { no: 60, platform: "TikTok", date: "22 Juni 2026", account: "sobatusaha", link: "https://vt.tiktok.com/ZSC1TdHvs/", followers: "10,200" },
              // 23 Juni
              { no: 61, platform: "Instagram", date: "23 Juni 2026", account: "jawaralokal_", link: "", followers: "14,500" },
              { no: 62, platform: "Instagram", date: "23 Juni 2026", account: "lenteraniaga", link: "", followers: "14,600" },
              { no: 63, platform: "Instagram", date: "23 Juni 2026", account: "arahusaha", link: "", followers: "15,600" },
              { no: 64, platform: "Instagram", date: "23 Juni 2026", account: "orbitbisnis", link: "", followers: "16,100" },
              { no: 65, platform: "Instagram", date: "23 Juni 2026", account: "poinniaga", link: "", followers: "12,100" },
              { no: 66, platform: "TikTok", date: "23 Juni 2026", account: "ceritadagang", link: "", followers: "39,800" },
              { no: 67, platform: "TikTok", date: "23 Juni 2026", account: "arusniaga", link: "", followers: "48,600" },
              { no: 68, platform: "TikTok", date: "23 Juni 2026", account: "halousaha", link: "", followers: "17,400" },
              { no: 69, platform: "TikTok", date: "23 Juni 2026", account: "kawanlokal", link: "", followers: "28,500" },
              { no: 70, platform: "TikTok", date: "23 Juni 2026", account: "klikbisnis2", link: "", followers: "73,200" },
              { no: 71, platform: "TikTok", date: "23 Juni 2026", account: "nadiniaga", link: "", followers: "25,000" },
              { no: 72, platform: "TikTok", date: "23 Juni 2026", account: "sentrakarya", link: "", followers: "10,200" },
              { no: 73, platform: "TikTok", date: "23 Juni 2026", account: "pusatlapak", link: "", followers: "10,500" },
              { no: 74, platform: "TikTok", date: "23 Juni 2026", account: "teras bisnis", link: "", followers: "21,800" },
              { no: 75, platform: "TikTok", date: "23 Juni 2026", account: "sobatusaha", link: "", followers: "10,200" },
              // 24 Juni
              { no: 76, platform: "Instagram", date: "24 Juni 2026", account: "jawaralokal_", link: "", followers: "14,500" },
              { no: 77, platform: "Instagram", date: "24 Juni 2026", account: "lenteraniaga", link: "", followers: "14,600" },
              { no: 78, platform: "Instagram", date: "24 Juni 2026", account: "arahusaha", link: "", followers: "15,600" },
              { no: 79, platform: "Instagram", date: "24 Juni 2026", account: "orbitbisnis", link: "", followers: "16,100" },
              { no: 80, platform: "Instagram", date: "24 Juni 2026", account: "poinniaga", link: "", followers: "12,100" },
              { no: 81, platform: "TikTok", date: "24 Juni 2026", account: "ceritadagang", link: "", followers: "39,800" },
              { no: 82, platform: "TikTok", date: "24 Juni 2026", account: "arusniaga", link: "", followers: "48,600" },
              { no: 83, platform: "TikTok", date: "24 Juni 2026", account: "halousaha", link: "", followers: "17,400" },
              { no: 84, platform: "TikTok", date: "24 Juni 2026", account: "kawanlokal", link: "", followers: "28,500" },
              { no: 85, platform: "TikTok", date: "24 Juni 2026", account: "klikbisnis2", link: "", followers: "73,200" },
              { no: 86, platform: "TikTok", date: "24 Juni 2026", account: "nadiniaga", link: "", followers: "25,000" },
              { no: 87, platform: "TikTok", date: "24 Juni 2026", account: "sentrakarya", link: "", followers: "10,200" },
              { no: 88, platform: "TikTok", date: "24 Juni 2026", account: "pusatlapak", link: "", followers: "10,500" },
              { no: 89, platform: "TikTok", date: "24 Juni 2026", account: "teras bisnis", link: "", followers: "21,800" },
              { no: 90, platform: "TikTok", date: "24 Juni 2026", account: "sobatusaha", link: "", followers: "10,200" },
            ];

            const posted = deliverables.filter((d) => d.link).length;
            const scheduled = deliverables.filter((d) => !d.link).length;

            const platformColor = (p: string) => {
              if (p === "Instagram") return { bg: "rgba(225,48,108,0.1)", text: "#E1306C" };
              if (p === "TikTok") return { bg: "rgba(0,0,0,0.1)", text: "#000" };
              return { bg: "rgba(255,0,0,0.1)", text: "#FF0000" };
            };

            return (
              <>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="rounded-xl border p-3" style={{ background: "rgba(59,130,246,0.1)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[20px] font-bold" style={{ color: "#3B82F6" }}>{deliverables.length}</p>
                    <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Total Deliverables</p>
                  </div>
                  <div className="rounded-xl border p-3" style={{ background: "rgba(16,185,129,0.1)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[20px] font-bold" style={{ color: "#10B981" }}>{posted}</p>
                    <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Sudah Diposting</p>
                  </div>
                  <div className="rounded-xl border p-3" style={{ background: "rgba(245,158,11,0.1)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[20px] font-bold" style={{ color: "#F59E0B" }}>{scheduled}</p>
                    <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Scheduled</p>
                  </div>
                </div>

                {/* Per-date summary */}
                {["18 Juni 2026", "19 Juni 2026", "20 Juni 2026", "22 Juni 2026", "23 Juni 2026", "24 Juni 2026"].map((date) => {
                  const dayItems = deliverables.filter((d) => d.date === date);
                  const dayPosted = dayItems.filter((d) => d.link).length;
                  return (
                    <div key={date} className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                      <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: "var(--ch-border)" }}>
                        <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{date}</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
                          background: dayPosted === dayItems.length ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                          color: dayPosted === dayItems.length ? "#10B981" : "#F59E0B",
                        }}>{dayPosted}/{dayItems.length} posted</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead>
                            <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                              <th className="text-left px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>No</th>
                              <th className="text-left px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Platform</th>
                              <th className="text-left px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Akun</th>
                              <th className="text-left px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Followers</th>
                              <th className="text-left px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Status</th>
                              <th className="text-right px-4 py-2 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Link</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dayItems.map((d) => {
                              const pc = platformColor(d.platform);
                              return (
                                <tr key={d.no} className="border-b last:border-b-0 hover:bg-white/3 transition-colors" style={{ borderColor: "var(--ch-border)" }}>
                                  <td className="px-4 py-2 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{d.no}</td>
                                  <td className="px-4 py-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: pc.bg, color: pc.text }}>{d.platform}</span>
                                  </td>
                                  <td className="px-4 py-2 text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>@{d.account}</td>
                                  <td className="px-4 py-2 text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>{d.followers}</td>
                                  <td className="px-4 py-2">
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{
                                      background: d.link ? "rgba(16,185,129,0.15)" : "rgba(245,158,11,0.15)",
                                      color: d.link ? "#10B981" : "#F59E0B",
                                    }}>{d.link ? "Posted" : "Scheduled"}</span>
                                  </td>
                                  <td className="px-4 py-2 text-right">
                                    {d.link ? (
                                      <a href={d.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--ch-primary)" }}>
                                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                                      </a>
                                    ) : (
                                      <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>-</span>
                                    )}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </>
            );
          })()}
        </TabsContent>

        {/* ═══ ANALYTICS TAB ═══ */}
        <TabsContent value="analytics" className="mt-6">
          <AnalyticsTab />
        </TabsContent>

        {/* Placeholder tabs */}
        {["files", "activity"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="rounded-xl border p-12 text-center" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: "var(--ch-text-muted)" }} />
              <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text)" }}>{tab.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              <p className="text-[12px] mt-1" style={{ color: "var(--ch-text-muted)" }}>Coming soon</p>
            </div>
          </TabsContent>
        ))}

        {/* ═══ INFLUENCERS TAB ═══ */}
        <TabsContent value="influencers" className="mt-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Shelter", count: 3, color: "#3B82F6", bg: "rgba(59,130,246,0.1)" },
              { label: "Mikro IG", count: 5, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
              { label: "Mikro TikTok", count: 10, color: "#F97316", bg: "rgba(249,115,22,0.1)" },
              { label: "Nano (IG + TikTok)", count: 40, color: "#8B5CF6", bg: "rgba(139,92,246,0.1)" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border p-3" style={{ background: s.bg, borderColor: "var(--ch-border)" }}>
                <p className="text-[20px] font-bold" style={{ color: s.color }}>{s.count}</p>
                <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>

          {/* Shelter Accounts */}
          {[
            { section: "Shelter (100K+)", titleColor: "#3B82F6", gridCols: "lg:grid-cols-3", items: [
              { username: "jurnal.wargajakarta", handle: "jurnal.wargajakarta", followers: "123K", status: "Active", badge: "Homeless Media", categories: ["UMKM Focused"], desc: "Media informasi cepat seputar UMKM, program kementerian, dan berita ekonomi nasional", photo: "/profile-photos/jurnal-warga-jakarta.jpg" },
                { username: "kilas_umkm", handle: "kilas_umkm", followers: "447.1K", status: "Active", badge: "Homeless Media", categories: ["Bisnis"], desc: "Kanal hiburan dan informasi ringan seputar dunia UMKM Indonesia", photo: "/profile-photos/kilas-umkm.jpg" },
                { username: "umkmhits", handle: "umkmhits", followers: "510K", status: "Active", badge: "Homeless Media", categories: ["UMKM Focused"], desc: "Konten organik dan potongan video panjang tentang cerita sukses UMKM", photo: "/profile-photos/umkm-hits.jpg" },
            ]},
            { section: "Mikro (10K+) Instagram", titleColor: "#10B981", gridCols: "xl:grid-cols-4", items: [
              { username: "orbitbisnis2", handle: "orbitbisnis2", followers: "16.1K", status: "Active", badge: "Homeless Media", categories: ["Bisnis", "UMKM Focused"], desc: "Tips & trik bisnis online untuk pelaku UMKM", photo: "/profile-photos/orbitbisnis2.jpg" },
                { username: "poin_niaga", handle: "poin_niaga", followers: "12.2K", status: "Active", badge: "Homeless Media", categories: ["Bisnis", "UMKM Focused"], desc: "Informasi peluang usaha dan berita UMKM terkini", photo: "/profile-photos/poin-niaga.jpg" },
                { username: "arah_usaha", handle: "arah_usaha", followers: "15.4K", status: "Active", badge: "Homeless Media", categories: ["Bisnis", "UMKM Focused"], desc: "Panduan strategi pengembangan usaha kecil menengah", photo: "/profile-photos/arah-usaha.jpg" },
                { username: "jawaraloka_", handle: "jawaralokal_", followers: "14.4K", status: "Active", badge: "Homeless Media", categories: ["UMKM Focused"], desc: "Inspirasi dan cerita sukses UMKM lokal Indonesia", photo: "/profile-photos/jawaralokal.jpg" },
                { username: "lenteraniaga1", handle: "lenteraniaga_", followers: "14.5K", status: "Active", badge: "Homeless Media", categories: ["Bisnis", "UMKM Focused"], desc: "Edukasi digital marketing untuk pelaku UMKM", photo: "/profile-photos/lenteraniaga.jpg" },
            ]},
            { section: "Mikro (10K+) TikTok", titleColor: "#F97316", gridCols: "xl:grid-cols-4", items: [
              { username: "nadiniaga0", handle: "nadiniaga0", followers: "25K", status: "Active", badge: "Homeless Media", categories: ["Bisnis"], desc: "Tips jualan online dan strategi pemasaran digital", photo: "/profile-photos/nadiniaga.jpeg" },
              { username: "pusatlapak1", handle: "pusatlapak1", followers: "10.5K", status: "Active", badge: "Homeless Media", categories: ["Bisnis"], desc: "Review produk UMKM dan rekomendasi tools bisnis", photo: "/profile-photos/pusatlapak.jpeg" },
              { username: "klikbisnis1", handle: "klikbisnis1", followers: "73.2K", status: "Active", badge: "Homeless Media", categories: ["Bisnis", "UMKM Focused"], desc: "Berita dan tren bisnis UMKM terbaru", photo: "/profile-photos/klikbisnis.jpeg" },
              { username: "sentrakarya1", handle: "sentrakarya1", followers: "10.1K", status: "Active", badge: "Homeless Media", categories: ["UMKM Focused"], desc: "Inspirasi kreativitas dan inovasi produk lokal", photo: "/profile-photos/sentrakarya.jpeg" },
              { username: "arusniaga", handle: "arusniaga", followers: "48.6K", status: "Active", badge: "Homeless Media", categories: ["Bisnis"], desc: "Analisis tren pasar dan peluang bisnis UMKM", photo: "/profile-photos/arusniaga.jpeg" },
              { username: "sobatusaha", handle: "sobatusaha", followers: "10.2K", status: "Active", badge: "Homeless Media", categories: ["Bisnis"], desc: "Tips motivasi dan pengelolaan keuangan usaha", photo: "/profile-photos/sobatusaha.jpeg" },
              { username: "kawanlokal0", handle: "kawanlokal", followers: "28.6K", status: "Active", badge: "Homeless Media", categories: ["UMKM Focused"], desc: "Cerita perjalanan UMKM dari nol hingga sukses", photo: "/profile-photos/kawanlokal.jpeg" },
              { username: "ceritadagang", handle: "ceritadagang", followers: "39.9K", status: "Active", badge: "Homeless Media", categories: ["Bisnis"], desc: "Tips berjualan dan membangun brand personal", photo: "/profile-photos/ceritadagang.jpeg" },
              { username: "terasbisnis", handle: "terasbisnis", followers: "21.8K", status: "Active", badge: "Homeless Media", categories: ["Bisnis"], desc: "Ide usaha kreatif dan strategi pemasaran offline", photo: "/profile-photos/terasbisnis.jpeg" },
              { username: "halousaha", handle: "halousaha", followers: "17.4K", status: "Active", badge: "Homeless Media", categories: ["Bisnis", "UMKM Focused"], desc: "Panduan memulai usaha dari rumah untuk pemula", photo: "/profile-photos/halousaha.jpeg" },
            ]},
            { section: "Nano (1K+) TikTok", titleColor: "#8B5CF6", gridCols: "xl:grid-cols-4", items: [
              { username: "jakbrebes1928", handle: "jakbrebes1928", followers: "1.2K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Tips usaha kecil-kecilan", photo: "/profile-photos/jakbrebes1928.jpeg" },
              { username: "vera04_", handle: "veraa04_", followers: "1.5K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Inspirasi UMKM lokal", photo: "/profile-photos/veraa04_.jpeg" },
              { username: "novel.best.seller8", handle: "novel.best.seller8", followers: "2.1K", status: "Active", badge: "Clipper", categories: ["Umum"], desc: "Review produk UMKM viral", photo: "/profile-photos/novel.best.seller8.jpeg" },
              { username: "beatrixchan7", handle: "beatrixchan7", followers: "1.8K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Cerita sukses pelaku usaha", photo: "/profile-photos/beatrixchan7.jpeg" },
              { username: "Ferdhyontop", handle: "ferdhhyontop", followers: "3.2K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Strategi pemasaran digital", photo: "/profile-photos/ferdhhyontop.jpeg" },
              { username: "Putri Keyza", handle: "keyzaa04_", followers: "1.1K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Kreasi produk lokal", photo: "/profile-photos/keyzaa04_.jpeg" },
              { username: "anakmama", handle: "anakmama", followers: "1.4K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Tips jualan dari rumah", photo: "/profile-photos/anakmama.jpeg" },
              { username: "KhoiriyahAP", handle: "khoiriyahap", followers: "2.5K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Inspirasi bisnis kreatif", photo: "/profile-photos/khoiriyahap.jpeg" },
              { username: "Ageaa21", handle: "ageaa21", followers: "1.3K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Ide usaha modal kecil", photo: "" },
              { username: "cerita.bucin1", handle: "cerita.bucin1", followers: "1.7K", status: "Active", badge: "Clipper", categories: ["Umum"], desc: "Konten hiburan seputar UMKM", photo: "/profile-photos/cerita.bucin1.jpeg" },
              { username: "ayycanns24", handle: "ayycanss24", followers: "2K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Tips branding produk", photo: "/profile-photos/ayycanss24.jpeg" },
              { username: "mama.ichacut", handle: "mama.ichacut", followers: "1.6K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Resep jualan laris", photo: "/profile-photos/mama.ichacut.jpeg" },
              { username: "rivakah032", handle: "rivakah032", followers: "1.1K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Analisis tren pasar", photo: "/profile-photos/rivakah032.jpeg" },
              { username: "cyllabcdefghijk", handle: "cyllabcdefghijk", followers: "1.2K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Cerita perjalanan usaha", photo: "/profile-photos/cyllabcdefghijk.jpeg" },
              { username: "reyhanz056", handle: "reyhanz056", followers: "1.9K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Tips pengelolaan keuangan", photo: "/profile-photos/reyhanz056.jpeg" },
              { username: "nayazarwkclr", handle: "rindunay_", followers: "1.4K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Inspirasi produk lokal", photo: "/profile-photos/rindunay_.jpg" },
              { username: "jeryyv2", handle: "jeryyv2", followers: "1.5K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Strategi jualan online", photo: "/profile-photos/jeryyv2.jpeg" },
              { username: "jennarxvender", handle: "jennarxvender", followers: "1.3K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Tips memulai usaha", photo: "/profile-photos/jennarxvender.jpeg" },
              { username: "jbceltastr", handle: "jbceltastr", followers: "1.1K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Review tools bisnis", photo: "/profile-photos/jbceltastr.jpeg" },
              { username: "mey.sibal", handle: "mey.sibal", followers: "1.8K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Kreasi produk kreatif", photo: "/profile-photos/mey.sibal.jpeg" },
            ]},
            { section: "Nano (1K+) Instagram", titleColor: "#E1306C", gridCols: "xl:grid-cols-4", items: [
              { username: "Lovelyy.v2", handle: "lovelyy.v2", followers: "1.2K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Inspirasi gaya hidup dan tips bisnis kreatif", photo: "/profile-photos/lovelyy.v2.jpg" },
              { username: "rachmanti_mantiie", handle: "rachmanti_mantiie", followers: "1.1K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Konten edukasi dan motivasi usaha", photo: "/profile-photos/rachmanti_mantiie.jpg" },
              { username: "meymey0519", handle: "meymey0519", followers: "1K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Tips jualan dan inspirasi UMKM", photo: "/profile-photos/meymey0519.jpg" },
              { username: "vt_nay", handle: "vt_nay", followers: "1.3K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Strategi pemasaran digital untuk UMKM", photo: "/profile-photos/vt_nay.jpg" },
              { username: "rindunay_", handle: "rindunay_", followers: "1.4K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Inspirasi produk lokal dan UMKM", photo: "/profile-photos/rindunay_.jpg" },
              { username: "amelia_srswt", handle: "amelia_srswt", followers: "1.1K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Tips branding dan strategi jualan", photo: "/profile-photos/amelia_srswt.jpg" },
              { username: "ilyiee", handle: "ilyiee", followers: "1K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Konten kreatif seputar UMKM lokal", photo: "/profile-photos/ilyiee.jpg" },
              { username: "citracalinda", handle: "citracalinda", followers: "1.2K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Tips usaha dari rumah untuk pemula", photo: "/profile-photos/citracalinda.jpg" },
              { username: "milaamirandaa09", handle: "milaamirandaa09", followers: "1.1K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Inspirasi produk kreatif lokal", photo: "/profile-photos/milaamirandaa09.jpg" },
              { username: "3acsyaaa", handle: "3acsyaaa", followers: "1.3K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Strategi pemasaran online untuk UMKM", photo: "/profile-photos/3acsyaaa.jpg" },
              { username: "maryati2542", handle: "maryati2542", followers: "1K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Tips pengelolaan keuangan usaha kecil", photo: "/profile-photos/maryati2542.jpg" },
              { username: "clara4calista4", handle: "clara4calista4", followers: "1.1K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Inspirasi bisnis kreatif untuk pemula", photo: "/profile-photos/clara4calista4.jpg" },
              { username: "parcia.cia", handle: "parcia.cia", followers: "1K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Konten edukasi seputar dunia UMKM", photo: "/profile-photos/parcia.cia.jpg" },
              { username: "mahesagantengbangett", handle: "mahesagantengbangett", followers: "1.2K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Tips berjualan online dan brand building", photo: "/profile-photos/mahesagantengbangett.jpg" },
              { username: "heraaharsaa", handle: "heraaharsaa", followers: "1.5K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Inspirasi produk lokal dan tips usaha", photo: "/profile-photos/heraaharsaa.jpg" },
              { username: "meyden1501", handle: "meyden1501", followers: "1.1K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Strategi digital marketing untuk UMKM", photo: "/profile-photos/meyden1501.jpg" },
              { username: "ara anak baik", handle: "ara.anak.baik", followers: "1K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Konten kreatif dan inspirasi usaha", photo: "" },
              { username: "bebyze3_", handle: "bebyze3_", followers: "1.2K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Tips jualan laris dan branding produk", photo: "" },
              { username: "anjanizeina", handle: "anjanizeina", followers: "1.3K", status: "Active", badge: "Clipper", categories: ["UMKM Focused"], desc: "Inspirasi produk lokal dan UMKM", photo: "/profile-photos/anjanizeina.jpg" },
              { username: "Minka.min9", handle: "minka.min9", followers: "1K", status: "Active", badge: "Clipper", categories: ["Bisnis"], desc: "Tips usaha kecil dan pengelolaan keuangan", photo: "/profile-photos/minka.min9.jpg" },
            ]},
          ].map((section) => (
            <div key={section.section} className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
              <div className="px-4 py-3 border-b" style={{ borderColor: "var(--ch-border)" }}>
                <p className="text-[13px] font-bold" style={{ color: section.titleColor }}>{section.section}</p>
              </div>
              <div className={`p-3 grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch ${section.gridCols}`}>
                {section.items.map((r) => (
                  <div key={r.handle} className="rounded-xl border overflow-hidden hover:scale-[1.01] transition-all flex flex-col" style={{ borderColor: "var(--ch-border)", background: "var(--ch-bg)" }}>
                    <div className="p-3.5 flex flex-col flex-1">
                      <div className="flex items-start gap-3 mb-2.5">
                        <div className="relative shrink-0">
                          {r.photo ? (
                            <img src={r.photo} alt={r.username} className="w-11 h-11 rounded-lg object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden"); }} />
                          ) : null}
                          <div className={`w-11 h-11 rounded-lg flex items-center justify-center text-[14px] font-bold text-white ${r.photo ? "hidden" : ""}`} style={{ background: `linear-gradient(135deg, ${section.titleColor}, ${section.titleColor}99)` }}>
                            {r.username[0].toUpperCase()}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-bold truncate" style={{ color: "var(--ch-text)" }}>@{r.handle}</p>
                          <p className="text-[14px] font-extrabold mt-0.5" style={{ color: "var(--ch-text)" }}>{r.followers} <span className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>followers</span></p>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.15)", color: "#10B981" }}>Status: {r.status}</span>
                          <span className="text-[10px] font-bold px-2 py-1 rounded-md" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}>{r.badge}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {r.categories.map((cat) => (
                          <span key={cat} className="text-[10px] font-bold px-2 py-0.5 rounded-md" style={{
                            background: cat === "UMKM Focused" ? "rgba(249,115,22,0.15)" : cat === "Bisnis" ? "rgba(16,185,129,0.15)" : "rgba(148,163,184,0.15)",
                            color: cat === "UMKM Focused" ? "#F97316" : cat === "Bisnis" ? "#10B981" : "#94A3B8",
                          }}>{cat}</span>
                        ))}
                      </div>
                      <p className="text-[11px] leading-relaxed mb-3 flex-1" style={{ color: "var(--ch-text-muted)" }}>{r.desc}</p>
                      <button className="w-full py-2 rounded-lg text-[12px] font-bold text-white transition-opacity hover:opacity-90 mt-auto" style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
                        Lihat Profile {'>'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
