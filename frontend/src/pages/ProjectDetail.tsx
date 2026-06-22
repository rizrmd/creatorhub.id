import { useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Briefcase, ChevronRight, Calendar,
  Eye, FileText, BarChart3, FolderOpen,
  Clock, ChevronDown,
  Users,
  Target, Heart, Star, Shield, Gauge,
  Cpu, Settings, ArrowDown,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  "kemenkop-umkm": {
    id: "kemenkop-umkm",
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

const PLATFORM_ICONS: Record<string, string> = {
  instagram: "Instagram",
  tiktok: "TikTok",
  youtube: "YouTube",
};

const PLATFORM_LOGOS: Record<string, string> = {
  instagram: "/logo-instagram.png",
  tiktok: "/logo-tiktok.png",
  youtube: "/logo-youtube.png",
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

const SKEMA_CLIPPERS = {
  micro: { count: 15, ig: 5, tiktok: 10, followers: "10K+" },
  nano: { count: 40, ig: 20, tiktok: 20, followers: "1K – <10K" },
};

const SKEMA_SHELTERS = [
  { platform: "Instagram", color: "#E1306C", followers: "100K+", type: "Akun Makro", kanal: ["Homeless Media", "Citizen Journalism"] },
  { platform: "TikTok", color: "#00F2EA", followers: "450K+", kanal: ["Berita terkait UMKM", "Kementerian UMKM"] },
  { platform: "YouTube", color: "#FF0000", followers: "500K+", kanal: ["Berita terkait UMKM"] },
];

const SKEMA_AMPLIFIERS = [
  { platform: "Instagram", color: "#E1306C", count: 150 },
  { platform: "TikTok", color: "#00F2EA", count: 150 },
  { platform: "YouTube", color: "#FF0000", count: 150 },
];

/* ═══════════════════════════════ COMPONENT ═══════════════════════════════ */

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSubTab, setActiveSubTab] = useState("workstream");

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
              <div className="flex items-center gap-2 bg-white/5 rounded-lg px-2.5 py-1.5 border border-white/10">
                {project.platforms.map((p) => (
                  <img key={p} src={PLATFORM_LOGOS[p]} alt={PLATFORM_ICONS[p]} className="h-5 w-auto object-contain" style={{ filter: "brightness(1.2) contrast(1.1)" }} />
                ))}
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
            { value: "deliverables", label: "Deliverables", icon: FileText },
            { value: "analytics", label: "Analytics", icon: BarChart3 },
            { value: "files", label: "Files & Assets", icon: FolderOpen },
            { value: "activity", label: "Activity Log", icon: Clock },
          ].map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className={`text-[13px] font-bold px-3 py-1.5 rounded-lg transition-all ${activeTab === tab.value ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-[#94A3B8] hover:text-white/80"}`} style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
                    <span className="text-[11px] font-bold tracking-widest select-none" style={{ writingMode: "vertical-lr", transform: "rotate(180deg)", color: isActive ? "#F97316" : "#E2E8F0", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
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
                <div className="space-y-5">
                  <h2 className="text-[16px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Strategy Roadmap Dashboard</h2>

                  {/* Theme — Vision / Mission / Values */}
                  <div className="rounded-xl border p-5 space-y-4" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#F97316" }}>Theme</p>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.1)" }}><Star className="w-4 h-4" style={{ color: "#3B82F6" }} /></div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#3B82F6" }}>Why — Vision</p>
                          <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: "var(--ch-text)" }}>{WORKSTREAM_THEME.vision}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.1)" }}><Target className="w-4 h-4" style={{ color: "#10B981" }} /></div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#10B981" }}>What — Mission / Purpose</p>
                          <p className="text-[12px] leading-relaxed mt-0.5" style={{ color: "var(--ch-text)" }}>{WORKSTREAM_THEME.mission}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(139,92,246,0.1)" }}><Heart className="w-4 h-4" style={{ color: "#8B5CF6" }} /></div>
                        <div>
                          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8B5CF6" }}>Values</p>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {WORKSTREAM_THEME.values.map((v) => (
                              <span key={v} className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "rgba(139,92,246,0.1)", color: "#8B5CF6" }}>{v}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Priorities — 4 cards */}
                  <div className="rounded-xl border p-5" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#F97316" }}>Priorities</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {WORKSTREAM_PRIORITIES.map((p) => (
                        <div key={p.label} className="rounded-lg p-3 border text-center" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                          <p.icon className="w-5 h-5 mx-auto mb-2" style={{ color: p.color }} />
                          <p className="text-[12px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.label}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{p.sub}</p>
                        </div>
                      ))}
                    </div>
                    <p className="text-[11px] text-center mt-3 italic" style={{ color: "var(--ch-text-muted)" }}>"Summary of goals vs issues/challenges"</p>
                  </div>

                  {/* Strategic Initiatives — 4 cards */}
                  <div className="rounded-xl border p-5" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#F97316" }}>Strategic Options & Initiatives</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {WORKSTREAM_INITIATIVES.map((ini) => (
                        <div key={ini.label} className="rounded-lg p-3 border-t-2" style={{ borderColor: ini.color, background: "var(--ch-surface)" }}>
                          <p className="text-[12px] font-bold mb-2" style={{ color: ini.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{ini.label}</p>
                          <ul className="space-y-1">
                            {ini.items.map((item, i) => (
                              <li key={i} className="text-[10px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>• {item}</li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tactical Activities — stat cards */}
                  <div className="rounded-xl border p-5" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "#F97316" }}>Tactical & Executional Activities</p>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      {WORKSTREAM_TACTICAL.map((t) => (
                        <div key={t.label} className="rounded-lg p-4 border text-center" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                          <p className="text-[28px] font-extrabold leading-none" style={{ color: t.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{t.value}</p>
                          <p className="text-[11px] font-semibold mt-1.5" style={{ color: "var(--ch-text)" }}>{t.label}</p>
                          {t.sub && <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{t.sub}</p>}
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 rounded-lg p-3 border text-center" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                      <p className="text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Dashboard real-time analytics: reach, ER, sentiment</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ═══ SKEMA GLORIFIKASI FLOWCHART ═══ */}
              {activeSubTab === "skema" && (
                <div className="space-y-4">
                  <h2 className="text-[16px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Skema Glorifikasi, Kampanye & Edukasi</h2>

                  {/* Tier 1 — Clippers */}
                  <div className="rounded-xl border p-5" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: "#F97316" }}>Clippers</p>
                    <p className="text-[11px] mb-3" style={{ color: "var(--ch-text-muted)" }}>Memproduksi video dari clips postingan Menteri UMKM / Kementerian UMKM</p>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg p-4 border text-center" style={{ borderColor: "rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.05)" }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#3B82F6" }}>Micro Influencer</p>
                        <p className="text-[28px] font-extrabold leading-none mt-1" style={{ color: "#3B82F6", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{SKEMA_CLIPPERS.micro.count}</p>
                        <p className="text-[11px] mt-1 font-semibold" style={{ color: "var(--ch-text)" }}>Akun</p>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{SKEMA_CLIPPERS.micro.ig} Akun Instagram</span>
                          <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>·</span>
                          <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{SKEMA_CLIPPERS.micro.tiktok} Akun TikTok</span>
                        </div>
                        <p className="text-[10px] font-semibold mt-1" style={{ color: "#3B82F6" }}>{SKEMA_CLIPPERS.micro.followers} Followers</p>
                      </div>
                      <div className="rounded-lg p-4 border text-center" style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.05)" }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#10B981" }}>Nano Influencer</p>
                        <p className="text-[28px] font-extrabold leading-none mt-1" style={{ color: "#10B981", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{SKEMA_CLIPPERS.nano.count}</p>
                        <p className="text-[11px] mt-1 font-semibold" style={{ color: "var(--ch-text)" }}>Akun</p>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{SKEMA_CLIPPERS.nano.ig} Akun Instagram</span>
                          <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>·</span>
                          <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{SKEMA_CLIPPERS.nano.tiktok} Akun TikTok</span>
                        </div>
                        <p className="text-[10px] font-semibold mt-1" style={{ color: "#10B981" }}>{SKEMA_CLIPPERS.nano.followers} Followers</p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Down — Clippers to Official Accounts */}
                  <div className="flex justify-center"><ArrowDown className="w-5 h-5" style={{ color: "var(--ch-text-muted)" }} /></div>

                  {/* Tier 2 — OFFICIAL ACCOUNTS */}
                  <div className="rounded-xl border p-5" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#F97316" }}>Official Accounts</p>
                    <div className="flex items-center justify-center">
                      <div className="rounded-lg px-6 py-3 border-2 text-center" style={{ borderColor: "#F97316", background: "rgba(249,115,22,0.08)" }}>
                        <p className="text-[14px] font-extrabold" style={{ color: "#F97316", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kementerian UMKM</p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Up + Left/Right — Shelter & Amplifier to Official Accounts */}
                  <div className="flex items-center gap-4">
                    {/* Shelter side — arrows up */}
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <svg width="40" height="30" viewBox="0 0 40 30">
                        <line x1="20" y1="30" x2="20" y2="5" stroke="#F97316" strokeWidth="2" />
                        <polygon points="15,5 20,0 25,5" fill="#F97316" />
                      </svg>
                    </div>
                    {/* Center label */}
                    <div className="shrink-0 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Likes, Comments, Shares, Mentions</p>
                    </div>
                    {/* Amplifier side — arrows up */}
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <svg width="40" height="30" viewBox="0 0 40 30">
                        <line x1="20" y1="30" x2="20" y2="5" stroke="#F97316" strokeWidth="2" />
                        <polygon points="15,5 20,0 25,5" fill="#F97316" />
                      </svg>
                    </div>
                  </div>

                  {/* Tier 3 — Shelter + Amplifier side by side */}
                  <div className="grid grid-cols-[1fr_40px_1fr] gap-0 items-start">

                    {/* Shelter column */}
                    <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest px-4 pt-4 pb-2" style={{ color: "#F97316" }}>Shelter Accounts</p>
                      <div className="space-y-2 px-3 pb-3">
                        {SKEMA_SHELTERS.map((s) => (
                          <div key={s.platform} className="rounded-lg border p-3" style={{ borderColor: `${s.color}40`, background: `${s.color}08` }}>
                            <div className="flex items-center gap-2 mb-1.5">
                              <img src={PLATFORM_LOGOS[s.platform.toLowerCase()]} alt={s.platform} className="h-3.5 w-auto" />
                              <p className="text-[11px] font-extrabold" style={{ color: s.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.platform}</p>
                            </div>
                            {s.type && <p className="text-[9px] font-bold uppercase" style={{ color: s.color }}>{s.type}</p>}
                            <p className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>{s.followers} Followers</p>
                            <ul className="mt-1 space-y-0.5">
                              {s.kanal.map((k) => (
                                <li key={k} className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>• {k}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Center arrows — amplifier to shelter */}
                    <div className="flex flex-col items-center justify-center h-full py-6">
                      {SKEMA_AMPLIFIERS.map((a, i) => (
                        <svg key={a.platform} width="40" height="50" viewBox="0 0 40 50">
                          <line x1="5" y1="25" x2="35" y2="25" stroke={a.color} strokeWidth="2" />
                          <polygon points="5,20 0,25 5,30" fill={a.color} />
                          <line x1="20" y1={i * 50 + 40} x2="20" y2={i * 50 + 30} stroke="transparent" strokeWidth="1" />
                        </svg>
                      ))}
                    </div>

                    {/* Amplifier column — wrapped in one frame */}
                    <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                      <p className="text-[10px] font-bold uppercase tracking-widest px-4 pt-4 pb-2" style={{ color: "#F97316" }}>Amplifier Accounts</p>
                      <div className="space-y-2 px-3 pb-3">
                        {SKEMA_AMPLIFIERS.map((a) => (
                          <div key={a.platform} className="rounded-lg border p-3 text-center" style={{ borderColor: `${a.color}40`, background: `${a.color}08` }}>
                            <div className="flex items-center justify-center gap-2 mb-1">
                              <img src={PLATFORM_LOGOS[a.platform.toLowerCase()]} alt={a.platform} className="h-3.5 w-auto" />
                              <p className="text-[11px] font-extrabold" style={{ color: a.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{a.platform}</p>
                            </div>
                            <p className="text-[22px] font-extrabold leading-none" style={{ color: a.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{a.count}</p>
                            <p className="text-[10px] font-semibold mt-0.5" style={{ color: "var(--ch-text-muted)" }}>Akun Amplifier</p>
                            <p className="text-[9px]" style={{ color: "var(--ch-text-muted)" }}>(100 – 1.000 Followers)</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-[10px] text-center italic" style={{ color: "var(--ch-text-muted)" }}>Likes, Comments, Shares, Mentions</p>
                </div>
              )}

              {/* ═══ TARGET & KPI ═══ */}
              {activeSubTab === "target-kpi" && project.kpi && (
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
              )}
            </div>
          </div>
        </TabsContent>

        {/* Placeholder tabs */}
        {["content-plan", "influencers", "deliverables", "analytics", "files", "activity"].map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-6">
            <div className="rounded-xl border p-12 text-center" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" style={{ color: "var(--ch-text-muted)" }} />
              <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text)" }}>{tab.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
              <p className="text-[12px] mt-1" style={{ color: "var(--ch-text-muted)" }}>Coming soon</p>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
