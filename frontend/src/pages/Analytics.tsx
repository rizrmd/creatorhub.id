import { useState } from "react";
import { TrendingUp, Eye, MousePointer, Coins, MapPin } from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell,
} from "recharts";

const metrics = [
  { label: "Total Reach", value: "8.4M", change: "+15.2% vs last month", icon: Eye, hue: 220, positive: true },
  { label: "Avg. Engagement", value: "4.62%", change: "+0.75% vs last month", icon: MousePointer, hue: 188, positive: true },
  { label: "Impressions", value: "12.8M", change: "+22.1% vs last month", icon: TrendingUp, hue: 28, positive: true },
  { label: "ROAS", value: "3.8x", change: "+0.4x vs last month", icon: Coins, hue: 42, positive: true },
];

const growthData = [
  { month: "Jan", views: 42000, engagements: 18000 },
  { month: "Feb", views: 55000, engagements: 22000 },
  { month: "Mar", views: 49000, engagements: 20000 },
  { month: "Apr", views: 63000, engagements: 27000 },
  { month: "Mei", views: 78000, engagements: 35000 },
  { month: "Jun", views: 91000, engagements: 42000 },
  { month: "Jul", views: 85000, engagements: 39000 },
];

const nicheData = [
  { name: "Lifestyle", value: 45, color: "#2563EB" },
  { name: "Tech", value: 25, color: "#16A34A" },
  { name: "Beauty", value: 20, color: "#F97316" },
  { name: "Other", value: 10, color: "#06b6d4" },
];

const topCreators = [
  { name: "Reza Alvaro", category: "Travel", impressi: "1.2M", engagement: "5.67%", conversions: 1240, roi: "4.8x" },
  { name: "Nadia Aurellia", category: "Lifestyle", impressi: "890K", engagement: "4.21%", conversions: 860, roi: "3.9x" },
  { name: "Dimas Arya", category: "Sports", impressi: "750K", engagement: "7.21%", conversions: 980, roi: "3.7x" },
  { name: "Andi Pratama", category: "Travel", impressi: "620K", engagement: "5.12%", conversions: 640, roi: "3.2x" },
  { name: "Fajar Nugroho", category: "Tech", impressi: "510K", engagement: "3.45%", conversions: 420, roi: "2.9x" },
];

const cities = [
  { name: "Jakarta", count: 2840, x: 22, y: 52 },
  { name: "Surabaya", count: 1240, x: 52, y: 54 },
  { name: "Bandung", count: 960, x: 25, y: 56 },
  { name: "Medan", count: 720, x: 8, y: 18 },
  { name: "Bali", count: 680, x: 58, y: 62 },
  { name: "Yogyakarta", count: 540, x: 44, y: 57 },
  { name: "Makassar", count: 380, x: 72, y: 58 },
  { name: "Semarang", count: 340, x: 42, y: 52 },
  { name: "Palembang", count: 280, x: 18, y: 52 },
  { name: "Manado", count: 180, x: 82, y: 32 },
];

const maxCount = Math.max(...cities.map((c) => c.count));

export default function Analytics() {
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("30d");

  const DATE_RANGES = [
    { value: "7d", label: "7d" },
    { value: "30d", label: "30d" },
    { value: "90d", label: "90d" },
    { value: "YTD", label: "YTD" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      {/* Header with date selector */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
            style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Analytics
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
            Reach, engagement, ROI, and creator distribution across Indonesia.
          </p>
        </div>

        {/* Date range selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {DATE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => setDateRange(range.value)}
              className={`px-3 py-1.5 rounded-lg text-[13px] font-semibold transition-colors ${
                dateRange === range.value
                  ? "text-white"
                  : "text-[var(--ch-text-muted)]"
              }`}
              style={{
                background: dateRange === range.value ? "var(--ch-primary)" : "var(--ch-bg)",
                border: dateRange === range.value ? "none" : "1px solid var(--ch-border)",
              }}
              onMouseEnter={(e) => {
                if (dateRange !== range.value) {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-primary)";
                  (e.currentTarget as HTMLElement).style.color = "var(--ch-primary)";
                }
              }}
              onMouseLeave={(e) => {
                if (dateRange !== range.value) {
                  (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-border)";
                  (e.currentTarget as HTMLElement).style.color = "var(--ch-text-muted)";
                }
              }}
            >
              {range.label}
            </button>
          ))}
          <button
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold border transition-colors"
            style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)", background: "var(--ch-surface)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-primary)";
              (e.currentTarget as HTMLElement).style.color = "var(--ch-primary)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-border)";
              (e.currentTarget as HTMLElement).style.color = "var(--ch-text-muted)";
            }}
          >
            Export
          </button>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <div key={m.label}
            className="rounded-[14px] border p-[18px] flex items-start justify-between"
            style={{ background: "#FFFFFF", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div>
              <p className="text-[13px] font-medium" style={{ color: "var(--ch-text-muted)" }}>{m.label}</p>
              <p className="text-[26px] font-extrabold mt-1 tracking-[-0.5px]" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{m.value}</p>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold mt-2 px-2 py-0.5 rounded-full"
                style={{ background: m.positive ? "#DCFCE7" : "#FEE2E2", color: m.positive ? "#16A34A" : "#DC2626" }}>
                {m.change}
              </span>
            </div>
            <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
              style={{ background: `hsl(${m.hue}, 80%, 95%)`, color: `hsl(${m.hue}, 70%, 45%)` }}>
              <m.icon style={{ width: 24, height: 24 }} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line chart */}
        <div className="rounded-xl border p-5"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <p className="text-[14px] font-bold mb-4" style={{ color: "var(--ch-text)" }}>Views & Engagement Growth</p>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={growthData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--ch-border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "var(--ch-text-soft)" }} />
              <YAxis tick={{ fontSize: 11, fill: "var(--ch-text-soft)" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip formatter={(v) => (typeof v === "number" ? v.toLocaleString("id-ID") : v)} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="views" name="Views" stroke="var(--ch-primary)" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="engagements" name="Engagements" stroke="var(--ch-orange)" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut chart */}
        <div className="rounded-xl border p-5"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <p className="text-[14px] font-bold mb-4" style={{ color: "var(--ch-text)" }}>Engagement Share by Niche</p>
          <div className="flex items-center gap-6">
            <div className="relative shrink-0">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie data={nicheData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} dataKey="value" strokeWidth={0}>
                    {nicheData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>Reach</p>
                <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>4.2M</p>
              </div>
            </div>
            <div className="space-y-2 flex-1">
              {nicheData.map((n) => (
                <div key={n.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: n.color }} />
                  <span className="text-[13px]" style={{ color: "var(--ch-text)" }}>{n.name}</span>
                  <span className="text-[13px] font-semibold ml-auto" style={{ color: "var(--ch-text)" }}>{n.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* SVG Indonesia city map */}
      <div className="rounded-xl border p-5"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>
            <MapPin className="inline w-4 h-4 mr-1 mb-0.5" style={{ color: "var(--ch-primary)" }} />
            Creator Distribution by City
          </p>
          <span className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>
            {cities.reduce((a, c) => a + c.count, 0).toLocaleString("id-ID")} total kreator
          </span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* SVG map */}
          <div className="lg:col-span-2 relative" style={{ background: "var(--ch-primary-50)", borderRadius: 12, padding: 16 }}>
            <svg viewBox="0 0 100 80" className="w-full" style={{ height: 220 }}>
              {/* Simplified Indonesia silhouette */}
              <ellipse cx="28" cy="52" rx="22" ry="10" fill="#DBEAFE" opacity="0.5" />
              <ellipse cx="48" cy="54" rx="15" ry="8" fill="#DBEAFE" opacity="0.5" />
              <ellipse cx="64" cy="56" rx="10" ry="6" fill="#DBEAFE" opacity="0.5" />
              <ellipse cx="78" cy="48" rx="12" ry="6" fill="#DBEAFE" opacity="0.5" />
              <ellipse cx="87" cy="40" rx="7" ry="5" fill="#DBEAFE" opacity="0.5" />
              <ellipse cx="10" cy="24" rx="8" ry="14" fill="#DBEAFE" opacity="0.5" />
              {cities.map((city) => {
                const r = 1.5 + (city.count / maxCount) * 4;
                const isHovered = hoveredCity === city.name;
                return (
                  <g key={city.name}>
                    <circle
                      cx={city.x} cy={city.y} r={isHovered ? r + 1 : r}
                      fill="var(--ch-primary)" opacity={isHovered ? 1 : 0.75}
                      style={{ cursor: "pointer", transition: "all 0.15s" }}
                      onMouseEnter={() => setHoveredCity(city.name)}
                      onMouseLeave={() => setHoveredCity(null)}
                    />
                    {isHovered && (
                      <g>
                        <rect x={city.x - 14} y={city.y - 11} width={28} height={9} rx="2" fill="#0F172A" opacity="0.9" />
                        <text x={city.x} y={city.y - 5} textAnchor="middle" fill="white" fontSize="3" fontWeight="600">
                          {city.name} · {city.count.toLocaleString("id-ID")}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
            <p className="text-center text-[11px] mt-1" style={{ color: "var(--ch-text-soft)" }}>
              Hover a dot to see details
            </p>
          </div>
          {/* City list */}
          <div className="space-y-2.5">
            {cities.map((city, i) => (
              <div key={city.name} className="flex items-center gap-2">
                <span className="text-[11px] font-bold w-4 text-right shrink-0" style={{ color: "var(--ch-text-soft)" }}>
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex justify-between text-[12px] mb-0.5">
                    <span className="font-semibold" style={{ color: "var(--ch-text)" }}>{city.name}</span>
                    <span style={{ color: "var(--ch-text-muted)" }}>{city.count.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: "var(--ch-border)" }}>
                    <div className="h-1.5 rounded-full transition-all"
                      style={{ width: `${(city.count / maxCount) * 100}%`, background: "var(--ch-primary)" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Demographics & Heatmap */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Demographics Card */}
        <div className="rounded-[14px] border p-5"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <p className="text-[15px] font-bold mb-4" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Audience Demographics
          </p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>Female</span>
              <div className="flex-1 h-3 rounded-full" style={{ background: "#E5E7EB" }}>
                <div className="h-3 rounded-full" style={{ width: "62%", background: "#EC4899" }} />
              </div>
              <span className="text-[13px] font-bold" style={{ color: "#EC4899" }}>62%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>Male</span>
              <div className="flex-1 h-3 rounded-full" style={{ background: "#E5E7EB" }}>
                <div className="h-3 rounded-full" style={{ width: "38%", background: "#2563EB" }} />
              </div>
              <span className="text-[13px] font-bold" style={{ color: "#2563EB" }}>38%</span>
            </div>
          </div>
          <p className="text-[12px] mt-4" style={{ color: "var(--ch-text-muted)" }}>
            Based on audience data from all active campaigns
          </p>
        </div>

        {/* Best Posting Times Heatmap */}
        <div className="rounded-[14px] border p-5"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <p className="text-[15px] font-bold mb-4" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Best Posting Times
          </p>
          <div className="space-y-1">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="flex items-center gap-1">
                <span className="text-[11px] font-medium w-8" style={{ color: "var(--ch-text-muted)" }}>{day}</span>
                {Array.from({ length: 24 }).map((_, hour) => {
                  const intensity = Math.random();
                  const bgColor = intensity > 0.7 ? "#16A34A" : intensity > 0.4 ? "#FBBF24" : "#E5E7EB";
                  return (
                    <div
                      key={hour}
                      className="h-5 rounded-sm flex-1"
                      style={{ background: bgColor }}
                      title={`${hour}:00 - ${hour + 1}:00`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px]" style={{ color: "var(--ch-text-muted)" }}>
            <span>12 AM</span>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ background: "#E5E7EB" }} />
                Low
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ background: "#FBBF24" }} />
                Medium
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-sm" style={{ background: "#16A34A" }} />
                High
              </span>
            </div>
            <span>11 PM</span>
          </div>
        </div>
      </div>

      {/* Top creators table */}
      <div className="rounded-xl border overflow-hidden"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="px-5 py-4 border-b" style={{ borderColor: "var(--ch-border)" }}>
          <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>Top Performing Creator</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                <th className="text-left px-5 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Creator</th>
                <th className="text-left px-4 py-3 text-[11px] font-semibold hidden sm:table-cell" style={{ color: "var(--ch-text-muted)" }}>Kategori</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Impressi</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Engagement</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold hidden md:table-cell" style={{ color: "var(--ch-text-muted)" }}>Konversi</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>ROI</th>
              </tr>
            </thead>
            <tbody>
              {topCreators.map((c, i) => (
                <tr key={c.name} className="border-b transition-colors hover:bg-slate-50"
                  style={{ borderColor: "var(--ch-border)" }}>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                        style={{ background: "var(--ch-bg)", color: "var(--ch-text-soft)" }}>
                        {i + 1}
                      </span>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold text-white"
                        style={{ background: "var(--ch-primary)" }}>
                        {c.name[0]}
                      </div>
                      <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
                      {c.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-right" style={{ color: "var(--ch-text-muted)" }}>{c.impressi}</td>
                  <td className="px-4 py-3 text-[13px] font-semibold text-right" style={{ color: "var(--ch-green)" }}>{c.engagement}</td>
                  <td className="px-4 py-3 text-[13px] text-right hidden md:table-cell" style={{ color: "var(--ch-text-muted)" }}>
                    {c.conversions.toLocaleString("id-ID")}
                  </td>
                  <td className="px-4 py-3 text-[13px] font-bold text-right" style={{ color: "var(--ch-primary)" }}>{c.roi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
