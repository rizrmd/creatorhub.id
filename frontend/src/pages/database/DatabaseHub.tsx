import { Link } from "react-router-dom";
import { Users, Globe, Video, Mic, Building2, Globe2 } from "lucide-react";

const cards = [
  {
    title: "Content Creators",
    description: "Daftar content creators terverifikasi dengan data followers, engagement, dan platform.",
    icon: Users,
    to: "/dashboard/database/contentcreators",
    iconBg: "var(--ch-primary-50)",
    iconColor: "var(--ch-primary)",
  },
  {
    title: "Homeless Media",
    description: "Media sosial independen tanpa afiliasi media mainstream di seluruh Indonesia.",
    icon: Globe,
    to: "/dashboard/database/homelessmedia",
    iconBg: "#DCFCE7",
    iconColor: "#16A34A",
  },
  {
    title: "Live Shopping",
    description: "Host dan creator live shopping di berbagai platform e-commerce.",
    icon: Video,
    to: "/dashboard/database/liveshopping",
    iconBg: "#DBEAFE",
    iconColor: "#2563EB",
  },
  {
    title: "Podcast",
    description: "Daftar podcast populer dan host di berbagai platform audio.",
    icon: Mic,
    to: "/dashboard/database/podcast",
    iconBg: "#FEF3C7",
    iconColor: "#D97706",
  },
  {
    title: "Indonesian Media Network",
    description: "Jaringan media nasional dengan subdomain dan outlet di seluruh Indonesia.",
    icon: Building2,
    to: "/dashboard/database/indonesianmedia",
    iconBg: "#F3E8FF",
    iconColor: "#9333EA",
  },
  {
    title: "International Media Outlets",
    description: "Paket advertorial dan branded content dari media internasional.",
    icon: Globe2,
    to: "/dashboard/database/internationalmedia",
    iconBg: "#FCE7F3",
    iconColor: "#DB2777",
  },
];

export default function DatabaseHub() {
  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <div>
        <h1
          className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Database
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Akses database content creators, media, dan aset konten di seluruh Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="group block rounded-xl border p-5 transition-all duration-200 hover:scale-[1.02]"
            style={{
              borderColor: "var(--ch-border)",
              background: "var(--ch-surface)",
            }}
          >
            <div className="flex items-start gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                style={{ background: card.iconBg }}
              >
                <card.icon className="w-6 h-6" style={{ color: card.iconColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className="text-[15px] font-bold mb-1"
                  style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {card.title}
                </h3>
                <p className="text-[12px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>
                  {card.description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
