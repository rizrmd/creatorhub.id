import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Briefcase, Clock, CheckCircle2, Loader2, User, Plus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    id: "kemenkop-umkm",
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
            Projects
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
            Portofolio proyek kampanye digital dan pipeline klien kami.
          </p>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white shrink-0"
          style={{ background: "var(--ch-primary)" }}
        >
          <Plus style={{ width: 13, height: 13 }} />
          {activeTab === "leads" ? "New Lead" : "New Project"}
        </button>
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
      </Tabs>
    </div>
  );
}
