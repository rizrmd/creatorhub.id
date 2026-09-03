import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Clock, CheckCircle2, User, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useRole } from "@/context/RoleContext";

const projects = [
  {
    id: "demokrat-creative",
    name: "Partai Demokrat",
    project: "Lomba Kreasi Biru — Demokrat Creative Challenge",
    brief: "Lomba kreator digital dalam rangka HUT ke-25 Partai Demokrat: Video Pendek, Poster Digital, Bumper Logo HUT, dan Voice Over. Memantau performa kanal @creativedemokrat di Instagram dan TikTok.",
    status: "active" as const,
    timeline: "26 Agu – 8 Sep 2026",
    deliverables: "148 karya dari 96 peserta, 4 mata lomba",
    hue: 220,
    logo: "",
  },
  {
    id: "komdigi",
    name: "Komdigi",
    project: "Kampanye Swasembada Air",
    brief: "Kampanye media sosial lintas platform untuk mempromosikan program swasembada air nasional.",
    status: "completed" as const,
    timeline: "Jan - Mar 2026",
    deliverables: "30 Reels, 15 Stories, 10 Feed Posts",
    hue: 210,
    logo: "/client-logos/komdigi.png",
  },
  {
    id: "kementrian-umkm",
    name: "Kementrian UMKM",
    project: "Amplifikasi Narasi & Edukasi UMKM",
    brief: "Amplifikasi Narasi, Edukasi Program untuk Meningkatkan Engagement Akun Sosial Media Kementerian UMKM.",
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
    brief: "Inisiatif pemberdayaan koperasi nasional dengan konten storytelling anggota koperasi sukses.",
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
    brief: "Kampanye kesadaran pembayaran digital BNI QRIS dengan konten edukatif dan challenge viral.",
    status: "active" as const,
    timeline: "Feb - Jun 2026",
    deliverables: "25 Reels, 10 Carousel, 5 Video",
    hue: 35,
    logo: "/client-logos/bni.png",
  },
  {
    id: "davo",
    name: "Dave Laksono",
    project: "Personal Branding & Content Strategy",
    brief: "Strategi konten personal branding untuk figur publik melalui konten harian dan behind-the-scenes.",
    status: "completed" as const,
    timeline: "Jan - Apr 2026",
    deliverables: "60 Reels, 20 Stories, 15 Feed Posts",
    hue: 190,
    logo: "/client-logos/davo.png",
  },
  {
    id: "nurul",
    name: "Nurul Arifin",
    project: "Beauty Campaign & Product Review",
    brief: "Kampanye produk kecantikan dengan fokus review jujur dan tutorial makeup sehari-hari.",
    status: "draft" as const,
    timeline: "Apr - Aug 2026",
    deliverables: "30 Reels, 15 Stories, 8 Feed Posts",
    hue: 340,
    logo: "/client-logos/nurul.png",
  },
];

const leads = [
  { id: "l1", name: "Pertamina", contact: "Marketing Director", status: "proposal", budget: "Rp 500M", lastContact: "2 hari lalu" },
  { id: "l2", name: "Telkomsel", contact: "Brand Manager", status: "negotiation", budget: "Rp 350M", lastContact: "1 hari lalu" },
  { id: "l3", name: "Gojek", contact: "Head of Marketing", status: "contacted", budget: "Rp 200M", lastContact: "3 hari lalu" },
  { id: "l4", name: "Shopee", contact: "Campaign Lead", status: "follow-up", budget: "Rp 400M", lastContact: "Hari ini" },
  { id: "l5", name: "Bank Mandiri", contact: "Digital Marketing", status: "proposal", budget: "Rp 600M", lastContact: "5 hari lalu" },
];

const statusConfig: Record<string, { label: string; bg: string; color: string; icon: typeof CheckCircle2 }> = {
  active: { label: "Active", bg: "#DCFCE7", color: "#16A34A", icon: CheckCircle2 },
  completed: { label: "Completed", bg: "#DBEAFE", color: "#2563EB", icon: CheckCircle2 },
  draft: { label: "Draft", bg: "#F3F4F6", color: "#6B7280", icon: Clock },
};

const leadStatusConfig: Record<string, { label: string; bg: string; color: string }> = {
  contacted: { label: "Contacted", bg: "#DBEAFE", color: "#2563EB" },
  proposal: { label: "Proposal", bg: "#E0E7FF", color: "#4F46E5" },
  negotiation: { label: "Negosiasi", bg: "#FEF3C7", color: "#D97706" },
  "follow-up": { label: "Follow Up", bg: "#F3E8FF", color: "#7C3AED" },
};

export default function Analytics() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const { effectiveRole } = useRole();

  const visibleProjects = effectiveRole === "demokrat"
    ? projects.filter(p => p.id === "demokrat-creative")
    : projects;

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
            style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Projects
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
            {effectiveRole !== "demokrat" && "Manage and track your projects and leads."}
          </p>
        </div>
        {effectiveRole !== "demokrat" && (
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white shrink-0"
            style={{ background: "var(--ch-primary)" }}>
            <Plus style={{ width: 13, height: 13 }} />
            {activeTab === "leads" ? "New Lead" : "New Project"}
          </button>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {effectiveRole !== "demokrat" && (
          <TabsList variant="line" className="border-b w-full justify-start gap-0">
            <TabsTrigger value="projects"
              className={`text-[13px] font-bold px-3 py-1.5 rounded-lg transition-all ${activeTab === "projects" ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-white/50 hover:text-white/80"}`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <Briefcase className="w-4 h-4 mr-1.5" />Projects
            </TabsTrigger>
            <TabsTrigger value="leads"
              className={`text-[13px] font-bold px-3 py-1.5 rounded-lg transition-all ${activeTab === "leads" ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "text-white/50 hover:text-white/80"}`}
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <User className="w-4 h-4 mr-1.5" />Leads
            </TabsTrigger>
          </TabsList>
        )}

        <TabsContent value="projects" className="mt-4">
          <div className="flex flex-col gap-4">
            {visibleProjects.map((p) => {
              const status = statusConfig[p.status];
              const StatusIcon = status.icon;
              const isDemokrat = p.id === "demokrat-creative";
              return (
                <div key={p.id} onClick={() => navigate(isDemokrat ? `/dashboard/projects/demokrat-creative` : `/dashboard/projects/${p.id}`)}
                  className="rounded-[14px] border overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
                  style={{ background: isDemokrat ? "#0F172A" : "var(--ch-surface)", borderColor: isDemokrat ? "rgba(37,99,235,.4)" : "var(--ch-border)", boxShadow: isDemokrat ? "0 0 0 1px rgba(37,99,235,.12), 0 4px 14px rgba(37,99,235,.1)" : "var(--ch-shadow-sm)" }}>
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-48 h-32 sm:h-auto flex items-center justify-center shrink-0"
                      style={{ background: isDemokrat ? "linear-gradient(135deg, rgba(37,99,235,.2), rgba(29,78,216,.15))" : `hsl(${p.hue}, 80%, 95%)` }}>
                      {"logo" in p && p.logo ? (
                        <img src={p.logo} alt={p.name} className="w-20 h-20 object-contain" />
                      ) : isDemokrat ? (
                        <img src="/creative-demokrat-pp.png" alt="Creative Demokrat" className="w-16 h-16 object-contain" />
                      ) : (
                        <Briefcase className="w-8 h-8" style={{ color: `hsl(${p.hue}, 60%, 45%)` }} />
                      )}
                    </div>
                    <div className="flex-1 p-4 sm:p-5 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: isDemokrat ? "#93C5FD" : `hsl(${p.hue}, 60%, 45%)` }}>{p.name}</span>
                        <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: isDemokrat ? "rgba(34,197,94,.12)" : status.bg, color: isDemokrat ? "#4ADE80" : status.color }}>
                          <StatusIcon className="w-3 h-3 mr-1" />{status.label}
                        </span>
                        {isDemokrat && (
                          <span className="inline-flex items-center text-[10px] font-extrabold px-2 py-0.5 rounded" style={{ background: "rgba(37,99,235,.14)", color: "#93C5FD", border: "1px solid rgba(37,99,235,.4)" }}>Rp63,5 jt</span>
                        )}
                      </div>
                      <p className="text-[15px] font-bold leading-tight" style={{ color: isDemokrat ? "#F8FAFC" : "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{p.project}</p>
                      <p className="text-[12px] leading-relaxed line-clamp-2" style={{ color: isDemokrat ? "#94A3B8" : "var(--ch-text-muted)" }}>{p.brief}</p>
                      <div className="flex flex-wrap items-center gap-4 pt-1">
                        <span className="text-[11px] flex items-center gap-1" style={{ color: isDemokrat ? "#64748B" : "var(--ch-text-muted)" }}><Clock className="w-3 h-3" /> {p.timeline}</span>
                        <span className="text-[11px]" style={{ color: isDemokrat ? "#64748B" : "var(--ch-text-muted)" }}>{p.deliverables}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="leads" className="mt-4">
          <div className="flex flex-col gap-3">
            {leads.map((l) => {
              const ls = leadStatusConfig[l.status];
              return (
                <div key={l.id}
                  className="rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center gap-3 transition-all duration-200 hover:shadow-md"
                  style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>{l.name}</span>
                      <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: ls.bg, color: ls.color }}>{ls.label}</span>
                    </div>
                    <p className="text-[12px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>{l.contact} · Last contact: {l.lastContact}</p>
                  </div>
                  <span className="px-3 py-1.5 rounded-lg text-[12px] font-bold" style={{ background: "var(--ch-bg)", color: "var(--ch-text-muted)", border: "1px solid var(--ch-border)" }}>{l.budget}</span>
                </div>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
