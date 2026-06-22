import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Briefcase, ChevronRight, Calendar, DollarSign, User, Building2,
  TrendingUp, Eye, FileText, BarChart3, FolderOpen,
  Clock, CheckCircle2, Instagram, Youtube, ChevronDown,
  Activity, Layers, Users
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
    projectManager: "Sapar Alfaris",
    budget: "Rp 350.000.000",
    budgetSpent: "Rp 255.500.000",
    hue: 142,
    logo: "/client-logos/kementrian-umkm.png",
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
  },
};

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  active: { bg: "#16A34A", text: "#FFFFFF" },
  completed: { bg: "#2563EB", text: "#FFFFFF" },
  draft: { bg: "#94A3B8", text: "#FFFFFF" },
  ongoing: { bg: "#F59E0B", text: "#000000" },
};

const PLAN_STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Published: { bg: "#16A34A", text: "#FFFFFF" },
  Scheduled: { bg: "#2563EB", text: "#FFFFFF" },
  "In Progress": { bg: "#F59E0B", text: "#000000" },
  Draft: { bg: "#94A3B8", text: "#FFFFFF" },
  Planned: { bg: "#A855F7", text: "#FFFFFF" },
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
      <div className="rounded-xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}>
        <div className="flex flex-col lg:flex-row">
          {/* Left: Logo */}
          <div className="w-full lg:w-56 h-48 lg:h-auto flex items-center justify-center shrink-0 p-6" style={{ background: "rgba(255,255,255,0.03)" }}>
            <div className="w-32 h-32 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.08)" }}>
              <img src={project.logo} alt={project.name} className="w-24 h-24 object-contain" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
              <span className="text-[11px] font-bold text-white/40 absolute">LOGO</span>
            </div>
          </div>

          {/* Center: Info */}
          <div className="flex-1 p-6 lg:p-8 space-y-4">
            <span
              className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: statusStyle.bg, color: statusStyle.text }}
            >
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </span>

            <h1 className="text-[22px] lg:text-[26px] font-extrabold text-white leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {project.project}
            </h1>

            <p className="text-[13px] text-white/60 max-w-2xl leading-relaxed">
              {project.brief}
            </p>

            <div className="flex items-center gap-3 pt-1">
              {project.platforms.map((p) => (
                <span key={p} className="flex items-center gap-1.5 text-[12px] font-semibold text-white/70">
                  {p === "instagram" && <Instagram className="w-4 h-4" />}
                  {p === "tiktok" && <span className="text-[13px]">♪</span>}
                  {p === "youtube" && <Youtube className="w-4 h-4" />}
                  {PLATFORM_ICONS[p]}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Meta + Actions */}
          <div className="w-full lg:w-64 p-6 lg:pl-0 space-y-4 shrink-0">
            <div className="flex justify-end">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white/70 border border-white/10 hover:bg-white/5 transition-colors">
                Project Actions <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-white/40 shrink-0" />
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Client</p>
                  <p className="text-[13px] text-white font-medium">{project.client}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-white/40 shrink-0" />
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Project Manager</p>
                  <p className="text-[13px] text-white font-medium">{project.projectManager}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-white/40 shrink-0" />
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Timeline</p>
                  <p className="text-[13px] text-white font-medium">{project.timeline}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-white/40 shrink-0" />
                <div>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Budget</p>
                  <p className="text-[13px] text-white font-medium">{project.budget}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <StatCard icon={Layers} iconBg="#EEF2FF" iconColor="#6366F1" label="Total Content" value={String(project.stats.totalContent)} change={project.stats.totalContentChange} />
            <StatCard icon={Eye} iconBg="#FFF7ED" iconColor="#F97316" label="Total Reach" value={project.stats.totalReach} change={project.stats.totalReachChange} />
            <StatCard icon={TrendingUp} iconBg="#F0FDF4" iconColor="#22C55E" label="Engagement Rate" value={project.stats.engagementRate} change={project.stats.engagementChange} />
            <StatCard icon={CheckCircle2} iconBg="#FFF7ED" iconColor="#F97316" label="Completed" value={`${project.stats.completedPct}%`} progress={project.stats.completedPct} />
            <StatCard icon={DollarSign} iconBg="#FEF3C7" iconColor="#D97706" label="Remaining Budget" value={project.stats.remainingBudget} change={project.stats.remainingBudgetPct} />
          </div>

          {/* Content Plan + Performance Trend */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Content Plan Overview */}
            <div className="rounded-xl border p-5 space-y-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold flex items-center gap-2" style={{ color: "var(--ch-text)" }}>
                  <Calendar className="w-4 h-4" /> Content Plan Overview
                </h3>
                <button className="text-[12px] font-semibold px-3 py-1 rounded-lg border" style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
                  View Full Calendar
                </button>
              </div>

              <div className="grid grid-cols-5 gap-2">
                {project.contentPlan.map((day) => (
                  <div key={day.day} className="space-y-2">
                    <p className="text-[11px] font-bold text-center" style={{ color: "var(--ch-text-muted)" }}>{day.day}</p>
                    <p className="text-[10px] text-center" style={{ color: "var(--ch-text-muted)" }}>{day.date}</p>
                    {day.items.map((item, i) => {
                      const planStatus = PLAN_STATUS_COLORS[item.status] || PLAN_STATUS_COLORS.Draft;
                      return (
                        <div key={i} className="rounded-lg p-2 space-y-1.5 border" style={{ borderColor: "var(--ch-border)", background: "var(--ch-bg)" }}>
                          <p className="text-[10px] font-medium leading-tight" style={{ color: "var(--ch-text)" }}>{item.title}</p>
                          <div className="flex items-center gap-1">
                            {item.platform === "instagram" && <Instagram className="w-3 h-3 text-pink-500" />}
                            {item.platform === "tiktok" && <span className="text-[10px]">♪</span>}
                            {item.platform === "youtube" && <Youtube className="w-3 h-3 text-red-500" />}
                          </div>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: planStatus.bg, color: planStatus.text }}>
                            {item.status}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 pt-2 border-t" style={{ borderColor: "var(--ch-border)" }}>
                {Object.entries(PLAN_STATUS_COLORS).map(([label, colors]) => (
                  <span key={label} className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: "var(--ch-text-muted)" }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: colors.bg }} />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Performance Trend */}
            <div className="rounded-xl border p-5 space-y-4" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
              <div className="flex items-center justify-between">
                <h3 className="text-[15px] font-bold flex items-center gap-2" style={{ color: "var(--ch-text)" }}>
                  <Activity className="w-4 h-4" /> Performance Trend
                </h3>
                <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg border" style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
                  Last 30 Days
                </span>
              </div>

              {/* Chart Placeholder */}
              <div className="relative h-48 rounded-lg overflow-hidden" style={{ background: "var(--ch-bg)" }}>
                <svg viewBox="0 0 500 200" className="w-full h-full">
                  {/* Grid lines */}
                  {[0, 1, 2, 3, 4].map((i) => (
                    <line key={i} x1="40" y1={20 + i * 40} x2="480" y2={20 + i * 40} stroke="var(--ch-border)" strokeWidth="0.5" />
                  ))}
                  {/* Y-axis labels */}
                  {["3M", "2M", "1M", "0"].map((label, i) => (
                    <text key={label} x="35" y={24 + i * 40} textAnchor="end" fill="var(--ch-text-muted)" fontSize="9">{label}</text>
                  ))}
                  {/* Reach line (blue) */}
                  <polyline
                    fill="none" stroke="#3B82F6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    points="60,140 120,120 180,130 240,100 300,80 360,60 420,50 460,40"
                  />
                  <circle cx="460" cy="40" r="4" fill="#3B82F6" />
                  {/* Engagement line (orange) */}
                  <polyline
                    fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                    points="60,150 120,145 180,140 240,135 300,120 360,110 420,100 460,95"
                  />
                  <circle cx="460" cy="95" r="4" fill="#F97316" />
                  {/* X-axis labels */}
                  {["24 May", "31 May", "7 Jun", "14 Jun", "21 Jun"].map((label, i) => (
                    <text key={label} x={60 + i * 100} y="195" textAnchor="middle" fill="var(--ch-text-muted)" fontSize="9">{label}</text>
                  ))}
                </svg>
                {/* Tooltip */}
                <div className="absolute top-8 right-4 rounded-lg p-2 border text-[10px] space-y-0.5" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                  <p className="font-bold" style={{ color: "var(--ch-text)" }}>21 Jun 2025</p>
                  <p style={{ color: "#3B82F6" }}>Reach: 2.45M</p>
                  <p style={{ color: "#F97316" }}>Engagement: 8.76%</p>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: "var(--ch-text-muted)" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "#3B82F6" }} /> Reach
                </span>
                <span className="flex items-center gap-1.5 text-[10px] font-medium" style={{ color: "var(--ch-text-muted)" }}>
                  <span className="w-2 h-2 rounded-full" style={{ background: "#F97316" }} /> Engagement
                </span>
              </div>
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

function StatCard({ icon: Icon, iconBg, iconColor, label, value, change, progress }: {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  label: string;
  value: string;
  change?: string;
  progress?: number;
}) {
  return (
    <div className="rounded-xl border p-4 space-y-3" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: iconBg }}>
          <Icon className="w-4 h-4" style={{ color: iconColor }} />
        </div>
        <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{label}</p>
      </div>
      <p className="text-[22px] font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        {value}
      </p>
      {change && (
        <p className="text-[11px] font-medium" style={{ color: "#22C55E" }}>{change}</p>
      )}
      {progress !== undefined && (
        <div className="space-y-1">
          <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--ch-border)" }}>
            <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "#F97316" }} />
          </div>
        </div>
      )}
    </div>
  );
}
