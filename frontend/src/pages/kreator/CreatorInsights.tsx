import { BarChart2, TrendingUp, Users, Eye, Heart } from "lucide-react";

const kpis = [
  { label: "Total Reach", value: "2.4M", change: "+12%", hue: 220, icon: Eye },
  { label: "Total Followers", value: "486K", change: "+3.2K", hue: 142, icon: Users },
  { label: "Avg Engagement", value: "5.8%", change: "+0.4%", hue: 28, icon: Heart },
  { label: "Content Views", value: "8.1M", change: "+22%", hue: 300, icon: BarChart2 },
];

const platforms = [
  { name: "Instagram", followers: "284K", eng: "5.1%", posts: 42, color: "#E1306C" },
  { name: "TikTok",    followers: "152K", eng: "8.4%", posts: 67, color: "#010101" },
  { name: "YouTube",   followers: "50K",  eng: "3.8%", posts: 18, color: "#FF0000" },
];

export default function CreatorInsights() {
  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <div>
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Insights
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Analisis performa konten dan pertumbuhan audiens
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <div key={k.label} className="rounded-xl border p-4"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
              style={{ background: `hsl(${k.hue}, 80%, 95%)`, color: `hsl(${k.hue}, 60%, 40%)` }}>
              <k.icon style={{ width: 14, height: 14 }} />
            </div>
            <p className="text-[20px] font-extrabold"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{k.value}</p>
            <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{k.label}</p>
            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-1 inline-block"
              style={{ background: "#DCFCE7", color: "#15803D" }}>{k.change}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-5"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <p className="text-[14px] font-bold mb-4" style={{ color: "var(--ch-text)" }}>Platform Performance</p>
        <div className="space-y-4">
          {platforms.map((p) => (
            <div key={p.name} className="flex items-center gap-4 p-3 rounded-xl"
              style={{ background: "var(--ch-bg)" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white text-[13px] font-bold shrink-0"
                style={{ background: p.color }}>{p.name[0]}</div>
              <div className="flex-1">
                <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{p.name}</p>
                <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{p.posts} konten diterbitkan</p>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>{p.followers}</p>
                <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>followers</p>
              </div>
              <div className="text-right">
                <p className="text-[14px] font-bold" style={{ color: "#16A34A" }}>{p.eng}</p>
                <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>engagement</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border p-5 text-center"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <TrendingUp style={{ width: 32, height: 32, margin: "0 auto 12px", color: "var(--ch-text-soft)", opacity: 0.4 }} />
        <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>
          Audience demographics & detailed analytics
        </p>
        <p className="text-[12px] mt-1" style={{ color: "var(--ch-text-soft)" }}>
          Fitur lengkap sedang dalam pengembangan
        </p>
      </div>
    </div>
  );
}
