import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Users, Eye, BarChart3, Target, CheckCircle, Clock, Flame } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const chartData = [
  { day: "1 Jul", reach: 4200, engagement: 1800 },
  { day: "2 Jul", reach: 3800, engagement: 1600 },
  { day: "3 Jul", reach: 5100, engagement: 2200 },
  { day: "4 Jul", reach: 4600, engagement: 1900 },
  { day: "5 Jul", reach: 6200, engagement: 2800 },
  { day: "6 Jul", reach: 5800, engagement: 2500 },
  { day: "7 Jul", reach: 4900, engagement: 2100 },
  { day: "8 Jul", reach: 7100, engagement: 3200 },
  { day: "9 Jul", reach: 6500, engagement: 2900 },
  { day: "10 Jul", reach: 5400, engagement: 2400 },
  { day: "11 Jul", reach: 4800, engagement: 2000 },
  { day: "12 Jul", reach: 6900, engagement: 3100 },
  { day: "13 Jul", reach: 7500, engagement: 3400 },
  { day: "14 Jul", reach: 8200, engagement: 3800 },
  { day: "15 Jul", reach: 7800, engagement: 3500 },
  { day: "16 Jul", reach: 6100, engagement: 2700 },
  { day: "17 Jul", reach: 5500, engagement: 2400 },
  { day: "18 Jul", reach: 7300, engagement: 3300 },
  { day: "19 Jul", reach: 8100, engagement: 3700 },
  { day: "20 Jul", reach: 9200, engagement: 4200 },
  { day: "21 Jul", reach: 8600, engagement: 3900 },
  { day: "22 Jul", reach: 7400, engagement: 3300 },
  { day: "23 Jul", reach: 6800, engagement: 3000 },
  { day: "24 Jul", reach: 5900, engagement: 2600 },
  { day: "25 Jul", reach: 7600, engagement: 3400 },
  { day: "26 Jul", reach: 8400, engagement: 3800 },
  { day: "27 Jul", reach: 9500, engagement: 4300 },
  { day: "28 Jul", reach: 8900, engagement: 4000 },
  { day: "29 Jul", reach: 7200, engagement: 3200 },
  { day: "30 Jul", reach: 9800, engagement: 4500 },
];

const indicators = [
  { label: "Nano influencer aktif", value: "14 / 20" },
  { label: "Warga yang ikut challenge", value: "87 orang" },
  { label: "UMKM yang dipromosikan", value: "12 UMKM" },
  { label: "Event desa yang diliput", value: "4 event" },
  { label: "Konten warga yang direpost", value: "26 konten" },
];

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode; label: string; value: string; sub: string; color: string }) {
  return (
    <div className="flex-1 min-w-[140px] rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
      <div className="flex items-center gap-2 mb-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${color}20`, color }}>
          {icon}
        </div>
        <span className="text-xs font-medium" style={{ color: "var(--ch-text-muted)" }}>{label}</span>
      </div>
      <p className="text-xl font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{value}</p>
      <p className="text-[11px] mt-1" style={{ color: "var(--ch-text-muted)" }}>{sub}</p>
    </div>
  );
}

function CampaignCard({ title, badge, badgeColor, description, progress, progressColor, detail }: { title: string; badge: string; badgeColor: string; description: string; progress: number; progressColor: string; detail: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-bold" style={{ color: "var(--ch-text)" }}>{title}</h4>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: `${badgeColor}20`, color: badgeColor, border: `1px solid ${badgeColor}40` }}>{badge}</span>
      </div>
      <p className="text-xs mb-3 leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{description}</p>
      <div className="w-full h-2 rounded-full mb-2" style={{ background: "var(--ch-border)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: progressColor }} />
      </div>
      <p className="text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{detail}</p>
    </div>
  );
}

function TrainingCard({ title, pct, pctColor, barColor, status }: { title: string; pct: number; pctColor: string; barColor: string; status: string }) {
  return (
    <div className="rounded-xl p-4" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)" }}>
      <h4 className="text-sm font-bold mb-1" style={{ color: "var(--ch-text)" }}>{title}</h4>
      <p className="text-xs font-semibold mb-3" style={{ color: pctColor }}>{pct}%</p>
      <div className="w-full h-2 rounded-full mb-3" style={{ background: "var(--ch-border)" }}>
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <div className="flex items-center gap-1.5">
        {pct === 100 ? (
          <CheckCircle className="w-3.5 h-3.5" style={{ color: "var(--ch-green)" }} />
        ) : (
          <Clock className="w-3.5 h-3.5" style={{ color: pctColor }} />
        )}
        <span className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>{status}</span>
      </div>
    </div>
  );
}

export default function DesaKreatifDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 space-y-5" style={{ background: "var(--ch-bg)", minHeight: "100vh" }}>
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/dashboard/ekrafhub/desa-kreatif/discover")}
          className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
          style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", color: "var(--ch-text)" }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl font-extrabold tracking-tight" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Desa Kreatif Detail
          </h1>
          <p className="text-xs" style={{ color: "var(--ch-text-muted)" }}>ID: {id}</p>
        </div>
      </div>

      <div className="rounded-xl p-5 md:p-6" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", boxShadow: "var(--ch-shadow-md)" }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-5">
          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="Made Aditya"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div className="flex-1">
            <h2 className="text-lg font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Made Aditya</h2>
            <p className="text-xs" style={{ color: "var(--ch-text-muted)" }}>Brand Ambassador Desa Penglipuran Bali Level 4 Ambassador</p>
          </div>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-opacity hover:opacity-80"
            style={{ background: "var(--ch-primary)", color: "#fff" }}
          >
            <Star className="w-3.5 h-3.5" />
            Upgrade
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <StatCard icon={<Users className="w-4 h-4" />} label="Followers Impact" value="28.4K" sub="↑ 12% bulan ini" color="#3B82F6" />
          <StatCard icon={<Eye className="w-4 h-4" />} label="Konten Bulan Ini" value="18" sub="Target 15 tercapai" color="#22C55E" />
          <StatCard icon={<BarChart3 className="w-4 h-4" />} label="Engagement Rate" value="8.7%" sub="Di atas rata-rata desa" color="#A855F7" />
          <StatCard icon={<Target className="w-4 h-4" />} label="Skor Pengaruh Desa" value="92/100" sub="Top 5 Provinsi" color="#F97316" />
        </div>
      </div>

      <div className="rounded-xl p-5 md:p-6" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", boxShadow: "var(--ch-shadow-md)" }}>
        <h3 className="text-base font-extrabold mb-1" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Performa konten 30 hari</h3>
        <p className="text-xs mb-5" style={{ color: "var(--ch-text-muted)" }}>Perbandingan jangkauan dan engagement konten brand ambassador dalam 30 hari terakhir.</p>
        <div className="w-full h-[280px] md:h-[340px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ch-border)" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "var(--ch-text-muted)" }}
                tickLine={false}
                axisLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "var(--ch-text-muted)" }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "var(--ch-text)", fontWeight: 700 }}
              />
              <Line type="monotone" dataKey="reach" stroke="#3B82F6" strokeWidth={2.5} dot={false} name="Reach" />
              <Line type="monotone" dataKey="engagement" stroke="#22C55E" strokeWidth={2.5} dot={false} name="Engagement" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1 rounded-full" style={{ background: "#3B82F6" }} />
            <span className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Reach</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-1 rounded-full" style={{ background: "#22C55E" }} />
            <span className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Engagement</span>
          </div>
        </div>
      </div>

      <div className="rounded-xl p-5 md:p-6" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", boxShadow: "var(--ch-shadow-md)" }}>
        <h3 className="text-base font-extrabold mb-1" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Community Influence Tracker</h3>
        <p className="text-xs mb-4" style={{ color: "var(--ch-text-muted)" }}>
          This is the <span className="font-bold" style={{ color: "var(--ch-text)" }}>important differentiator</span>.
        </p>
        <div className="overflow-x-auto mb-5">
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--ch-border)" }}>
                <th className="pb-2 text-xs font-bold" style={{ color: "var(--ch-text-muted)" }}>Indikator</th>
                <th className="pb-2 text-xs font-bold" style={{ color: "var(--ch-text-muted)" }}>Nilai</th>
              </tr>
            </thead>
            <tbody>
              {indicators.map((ind) => (
                <tr key={ind.label} style={{ borderBottom: "1px solid var(--ch-border)" }}>
                  <td className="py-2.5 text-xs" style={{ color: "var(--ch-text)" }}>{ind.label}</td>
                  <td className="py-2.5 text-xs font-semibold" style={{ color: "var(--ch-text)" }}>{ind.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-xl p-4" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4" style={{ color: "var(--ch-orange)" }} />
              <span className="text-sm font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Village Influence Heat Score</span>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: "var(--ch-green)", color: "#000" }}>Aktif</span>
          </div>
          <div className="flex items-baseline gap-1 mb-2">
            <span className="text-2xl font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>78</span>
            <span className="text-sm font-bold" style={{ color: "var(--ch-text-muted)" }}>/100</span>
          </div>
          <div className="w-full h-3 rounded-full mb-2" style={{ background: "var(--ch-border)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: "78%",
                background: "linear-gradient(90deg, var(--ch-green), var(--ch-orange))",
              }}
            />
          </div>
          <p className="text-[11px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>
            Skor ini mengukur seberapa besar pengaruh komunitas desa terhadap visibilitas konten digital. Semakin aktif warga berpartisipasi, semakin tinggi skor yang dicapai.
          </p>
        </div>
      </div>

      <div className="rounded-xl p-5 md:p-6" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", boxShadow: "var(--ch-shadow-md)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <h3 className="text-base font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Misi Kampanye Bulan Ini</h3>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ color: "var(--ch-green)", border: "1px solid var(--ch-green)", background: "#22C55E10" }}>3 aktif</span>
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ color: "var(--ch-orange)", border: "1px solid var(--ch-orange)", background: "#F9731610" }}>1 hampir selesai</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <CampaignCard
            title="Minggu Kuliner Tradisional"
            badge="78%"
            badgeColor="var(--ch-green)"
            description="Upload 5 Reels + ajak 10 nano influencer ikut challenge."
            progress={78}
            progressColor="var(--ch-green)"
            detail="14/18 konten"
          />
          <CampaignCard
            title="Cerita Pengrajin Bambu"
            badge="92%"
            badgeColor="var(--ch-green)"
            description="Buat 1 video hero dan 3 potongan Shorts untuk distribusi lintas platform."
            progress={92}
            progressColor="var(--ch-green)"
            detail="11/12 aset"
          />
          <CampaignCard
            title="Festival Desa Agustus"
            badge="45%"
            badgeColor="var(--ch-orange)"
            description="Koordinasi liputan live report dan briefing relawan dokumentasi sebelum hari H."
            progress={45}
            progressColor="var(--ch-orange)"
            detail="9/20 checklist"
          />
        </div>
      </div>

      <div className="rounded-xl p-5 md:p-6" style={{ background: "var(--ch-surface)", border: "1px solid var(--ch-border)", boxShadow: "var(--ch-shadow-md)" }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <h3 className="text-base font-extrabold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Progress Pelatihan Tim Digital</h3>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full self-start" style={{ color: "var(--ch-green)", border: "1px solid var(--ch-green)", background: "#22C55E10" }}>4 modul aktif</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TrainingCard title="Storytelling Desa" pct={100} pctColor="var(--ch-green)" barColor="var(--ch-green)" status="Lulus" />
          <TrainingCard title="Editing Reels" pct={80} pctColor="var(--ch-green)" barColor="var(--ch-green)" status="4 dari 5 anggota" />
          <TrainingCard title="Live Report & Streaming" pct={40} pctColor="var(--ch-orange)" barColor="var(--ch-orange)" status="Perlu pendampingan" />
          <TrainingCard title="Analytics & Insight" pct={65} pctColor="var(--ch-orange)" barColor="var(--ch-orange)" status="Target selesai minggu depan" />
        </div>
        <div className="flex items-center gap-2 mt-4 px-3 py-2.5 rounded-lg" style={{ background: "var(--ch-bg)", border: "1px solid var(--ch-border)" }}>
          <CheckCircle className="w-4 h-4 shrink-0" style={{ color: "var(--ch-green)" }} />
          <span className="text-xs" style={{ color: "var(--ch-text-muted)" }}>Sertifikasi otomatis muncul ketika seluruh modul mencapai 100%.</span>
        </div>
      </div>
    </div>
  );
}
