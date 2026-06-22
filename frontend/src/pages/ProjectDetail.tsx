import { useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Briefcase, ChevronRight, Calendar,
  Eye, FileText, BarChart3, FolderOpen,
  Clock, ChevronDown,
  Users, Instagram, Music, Youtube,
  Shield, Gauge, Cpu, Settings, ArrowDown,
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
            { value: "deliverables", label: "Deliverables", icon: FileText },
            { value: "analytics", label: "Analytics", icon: BarChart3 },
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
                <div className="space-y-4">
                  <h2 className="text-[16px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Strategy Roadmap Dashboard</h2>

                  {/* Theme — Vision / Mission / Values */}
                  <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider w-28" style={{ color: "var(--ch-text-muted)" }}>Theme</th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Details</th>
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
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider w-28" style={{ color: "var(--ch-text-muted)" }}>Priorities</th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: "var(--ch-text-muted)" }}>Strategic</th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: "var(--ch-text-muted)" }}>Measurable</th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: "var(--ch-text-muted)" }}>Algorithmic</th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: "var(--ch-text-muted)" }}>Operational</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-3 text-[11px] font-bold" style={{ color: "var(--ch-text-muted)" }}>Focus</td>
                          {WORKSTREAM_PRIORITIES.map((p) => (
                            <td key={p.label} className="px-4 py-3 text-[11px] text-center" style={{ color: "var(--ch-text-muted)" }}>{p.sub}</td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                    <p className="text-[11px] text-center pb-3 italic" style={{ color: "var(--ch-text-muted)" }}>"Summary of goals vs issues/challenges"</p>
                  </div>

                  {/* Strategic Initiatives — simple table */}
                  <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider w-28" style={{ color: "var(--ch-text-muted)" }}>Initiatives</th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "#3B82F6" }}>Proactive</th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "#10B981" }}>Collaborative</th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "#8B5CF6" }}>Educative</th>
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider" style={{ color: "#F97316" }}>Responsive</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="px-4 py-3 text-[11px] font-bold" style={{ color: "var(--ch-text-muted)" }}>Actions</td>
                          {WORKSTREAM_INITIATIVES.map((ini) => (
                            <td key={ini.label} className="px-3 py-3">
                              <ul className="space-y-1">
                                {ini.items.map((item, i) => (
                                  <li key={i} className="text-[10px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>• {item}</li>
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
                          <th className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider w-28" style={{ color: "var(--ch-text-muted)" }}>Tactical</th>
                          {WORKSTREAM_TACTICAL.map((t) => (
                            <th key={t.label} className="px-4 py-3 text-[11px] font-bold uppercase tracking-wider text-center" style={{ color: "var(--ch-text-muted)" }}>{t.label}</th>
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
                    <div className="px-4 pb-3">
                      <div className="rounded-lg p-2 border text-center" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                        <p className="text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Dashboard real-time analytics: reach, ER, sentiment</p>
                      </div>
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
                        <p className="text-[11px] mt-1 font-bold" style={{ color: "#3B82F6" }}>Akun Dedicated</p>
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
                        <p className="text-[11px] mt-1 font-bold" style={{ color: "#10B981" }}>Akun Clippers</p>
                        <div className="flex items-center justify-center gap-2 mt-1">
                          <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{SKEMA_CLIPPERS.nano.ig} Akun Instagram</span>
                          <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>·</span>
                          <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{SKEMA_CLIPPERS.nano.tiktok} Akun TikTok</span>
                        </div>
                        <p className="text-[10px] font-semibold mt-1" style={{ color: "#10B981" }}>{SKEMA_CLIPPERS.nano.followers} Followers</p>
                      </div>
                    </div>

                    {/* Arrows down + labels */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="flex flex-col items-center">
                        <ArrowDown className="w-5 h-5" style={{ color: "#3B82F6" }} />
                        <div className="rounded-lg px-3 py-2 border text-center mt-1 w-full" style={{ borderColor: "rgba(59,130,246,0.3)", background: "rgba(59,130,246,0.05)" }}>
                          <p className="text-[10px] font-semibold" style={{ color: "#3B82F6" }}>Glorifikasi konten oleh akun dedicated</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <ArrowDown className="w-5 h-5" style={{ color: "#10B981" }} />
                        <div className="rounded-lg px-3 py-2 border text-center mt-1 w-full" style={{ borderColor: "rgba(16,185,129,0.3)", background: "rgba(16,185,129,0.05)" }}>
                          <p className="text-[10px] font-semibold" style={{ color: "#10B981" }}>Adaptasi konten oleh clippers</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Down — Clippers to Official Accounts */}
                  <div className="flex justify-center"><ArrowDown className="w-5 h-5" style={{ color: "var(--ch-text-muted)" }} /></div>

                  {/* Tier 2 — OFFICIAL ACCOUNTS (3 boxes) */}
                  <div className="rounded-xl border p-5" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "#F97316" }}>Official Accounts</p>
                    <div className="flex items-center justify-center gap-3">
                      <div className="rounded-lg px-4 py-3 border text-center" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                        <p className="text-[12px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Menteri UMKM</p>
                      </div>
                      <div className="rounded-lg px-5 py-3 border-2 text-center" style={{ borderColor: "#F97316", background: "rgba(249,115,22,0.08)" }}>
                        <p className="text-[13px] font-extrabold" style={{ color: "#F97316", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Kementerian UMKM</p>
                      </div>
                      <div className="rounded-lg px-4 py-3 border text-center" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
                        <p className="text-[12px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Wakil Menteri UMKM</p>
                      </div>
                    </div>
                  </div>

                  {/* Arrow Up + label */}
                  <div className="flex items-center gap-4">
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <svg width="40" height="30" viewBox="0 0 40 30">
                        <line x1="20" y1="30" x2="20" y2="5" stroke="#F97316" strokeWidth="3" />
                        <polygon points="14,6 20,0 26,6" fill="#F97316" />
                      </svg>
                    </div>
                    <div className="shrink-0 text-center">
                      <p className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "var(--ch-text-muted)" }}>Likes, Comments, Shares, Mentions</p>
                    </div>
                    <div className="flex-1 flex flex-col items-center gap-1">
                      <svg width="40" height="30" viewBox="0 0 40 30">
                        <line x1="20" y1="30" x2="20" y2="5" stroke="#F97316" strokeWidth="3" />
                        <polygon points="14,6 20,0 26,6" fill="#F97316" />
                      </svg>
                    </div>
                  </div>

                  {/* Tier 3 — Shelter + Amplifier per platform */}
                  <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-bg)", borderColor: "var(--ch-border)" }}>
                    <p className="text-[10px] font-bold uppercase tracking-widest px-4 pt-4 pb-2" style={{ color: "#F97316" }}>Content Distribution</p>
                    <div className="space-y-0">
                      {SKEMA_SHELTERS.map((s) => {
                        const amp = SKEMA_AMPLIFIERS.find((a) => a.platform === s.platform)!;
                        return (
                          <div key={s.platform} className="grid grid-cols-[1fr_50px_1fr] items-center border-t" style={{ borderColor: "var(--ch-border)" }}>
                            {/* Shelter */}
                            <div className="p-3">
                              <div className="rounded-lg border p-3" style={{ borderColor: `${s.color}40`, background: `${s.color}08` }}>
                                <div className="flex items-center gap-2 mb-1.5">
                                  {s.platform === "Instagram" && <Instagram className="w-3.5 h-3.5" style={{ color: s.color }} />}
                                  {s.platform === "TikTok" && <Music className="w-3.5 h-3.5" style={{ color: s.color }} />}
                                  {s.platform === "YouTube" && <Youtube className="w-3.5 h-3.5" style={{ color: s.color }} />}
                                  <p className="text-[11px] font-extrabold" style={{ color: s.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Shelter {s.platform}</p>
                                </div>
                                {s.type && <p className="text-[9px] font-bold uppercase" style={{ color: s.color }}>{s.type}</p>}
                                <p className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>{s.followers} Followers</p>
                                <ul className="mt-1 space-y-0.5">
                                  {s.kanal.map((k) => (
                                    <li key={k} className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>• {k}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            {/* Arrow — from Amplifier to Shelter (right → left) */}
                            <div className="flex items-center justify-center">
                              <svg width="50" height="30" viewBox="0 0 50 30">
                                <line x1="40" y1="15" x2="10" y2="15" stroke={s.color} strokeWidth="2" />
                                <polygon points="10,10 0,15 10,20" fill={s.color} />
                              </svg>
                            </div>

                            {/* Amplifier */}
                            <div className="p-3">
                              <div className="rounded-lg border p-3 text-center" style={{ borderColor: `${amp.color}40`, background: `${amp.color}08` }}>
                                <div className="flex items-center justify-center gap-2 mb-1">
                                  {amp.platform === "Instagram" && <Instagram className="w-3.5 h-3.5" style={{ color: amp.color }} />}
                                  {amp.platform === "TikTok" && <Music className="w-3.5 h-3.5" style={{ color: amp.color }} />}
                                  {amp.platform === "YouTube" && <Youtube className="w-3.5 h-3.5" style={{ color: amp.color }} />}
                                  <p className="text-[11px] font-extrabold" style={{ color: amp.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Amplifier {amp.platform}</p>
                                </div>
                                <p className="text-[22px] font-extrabold leading-none" style={{ color: amp.color, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{amp.count}</p>
                                <p className="text-[10px] font-semibold mt-0.5" style={{ color: "var(--ch-text-muted)" }}>Akun Amplifier</p>
                                <p className="text-[9px]" style={{ color: "var(--ch-text-muted)" }}>(100 – 1.000 Followers)</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-center py-3 italic border-t" style={{ color: "var(--ch-text-muted)", borderColor: "var(--ch-border)" }}>Likes, Comments, Shares, Mentions</p>
                  </div>
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
