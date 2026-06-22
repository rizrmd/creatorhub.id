import { useState, Fragment } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Briefcase, ChevronRight, Calendar,
  Eye, FileText, BarChart3, FolderOpen,
  Clock, Instagram, Youtube, ChevronDown,
  Users
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  budgetSpent: string;
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
  contentPlan: {
    day: string;
    date: string;
    items: { title: string; platform: string; icon: string; status: string }[];
  }[];
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
    timeline: "12 Jun - 30 Sep 2025",
    deliverables: "50 Reels, 20 Carousel, 8 Video Tutorial",
    client: "Kementerian UMKM",
    projectManager: "Irfan Fitriansyah",
    budget: "Rp 350.000.000",
    budgetSpent: "Rp 255.500.000",
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
    contentPlan: [
      { day: "Mon", date: "22 Jun", items: [{ title: "IG Post Edukasi UMKM", platform: "instagram", icon: "ig", status: "Published" }] },
      { day: "Tue", date: "23 Jun", items: [{ title: "TikTok Video Tips Bisnis", platform: "tiktok", icon: "tt", status: "Scheduled" }] },
      { day: "Wed", date: "24 Jun", items: [{ title: "YouTube Short Kisah Sukses", platform: "youtube", icon: "yt", status: "In Progress" }] },
      { day: "Thu", date: "25 Jun", items: [{ title: "IG Story Q&A Session", platform: "instagram", icon: "ig", status: "Draft" }] },
      { day: "Fri", date: "26 Jun", items: [{ title: "TikTok Live Diskusi UMKM", platform: "tiktok", icon: "tt", status: "Planned" }] },
    ],
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

export default function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

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

      {/* Hero Banner */}
      <div className="rounded-xl overflow-hidden relative" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}>
        <div className="flex flex-col lg:flex-row relative">
          {/* Center: Info */}
          <div className="flex-1 p-6 lg:p-8 lg:pr-72 relative z-10">
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: statusStyle.bg, color: statusStyle.text }}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>

            <h1 className="text-[20px] lg:text-[24px] font-extrabold text-white leading-tight mt-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {project.project}
            </h1>

            <p className="text-[12px] text-white/50 max-w-xl leading-relaxed mt-2">
              {project.brief}
            </p>

            <div className="flex items-center gap-3 mt-3">
              {project.platforms.map((p) => (
                <span key={p} className="flex items-center gap-1.5 text-[11px] font-semibold text-white/60">
                  {p === "instagram" && <Instagram className="w-3.5 h-3.5" />}
                  {p === "tiktok" && <span className="text-[12px]">♪</span>}
                  {p === "youtube" && <Youtube className="w-3.5 h-3.5" />}
                  {PLATFORM_ICONS[p]}
                </span>
              ))}
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
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">Budget</p>
                <p className="text-[13px] text-white font-medium">{project.budget}</p>
              </div>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="absolute top-6 right-6 z-20">
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white/70 border border-white/10 hover:bg-white/5 transition-colors">
              Project Actions <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        {/* Photo overlay - right side, full height */}
        <img src={project.logo} alt={project.name} className="hidden lg:block absolute right-0 bottom-0 h-full max-h-80 w-auto object-contain object-right" style={{ filter: "brightness(0.9)" }} onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
      </div>

      {/* Tabs */}
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
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className={`text-[13px] font-bold px-3 py-1.5 rounded-lg transition-all ${
                activeTab === tab.value
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                  : "text-white/50 hover:text-white/80"
              }`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              <tab.icon className="w-4 h-4 mr-1.5" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          {/* Target & KPI - full width */}

          {/* Target & KPI */}
          {project.kpi && (
            <div className="rounded-xl border overflow-hidden" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
              <div className="flex">
                {/* Left label */}
                <div className="w-10 shrink-0 flex flex-col items-center justify-center py-4" style={{ background: "rgba(6,182,212,0.08)", borderRight: "2px solid rgba(6,182,212,0.3)" }}>
                  <FolderOpen className="w-5 h-5 mb-2" style={{ color: "#06B6D4" }} />
                  <span className="text-[10px] font-bold tracking-widest" style={{ color: "#06B6D4", writingMode: "vertical-lr", transform: "rotate(180deg)" }}>Target & KPI</span>
                </div>

                {/* Table */}
                <div className="flex-1 overflow-x-auto">
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
                          {/* Section header */}
                          <tr>
                            <td colSpan={6} className="px-4 py-2 text-[13px] font-bold" style={{ color: "#06B6D4", borderLeft: "3px solid #06B6D4" }}>
                              {section.name}
                            </td>
                          </tr>
                          {/* Rows */}
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
                      {/* Total row */}
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
