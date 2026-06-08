import { TrendingUp, Eye, MousePointer, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, PieChart, Pie, Cell,
} from "recharts";

const metrics = [
  { label: "Total Impressi", value: "4.2M", change: "+15.2%", icon: Eye, color: "text-blue-600 bg-blue-50" },
  { label: "Campaign ROI", value: "3.8x", change: "+0.4x", icon: TrendingUp, color: "text-orange-600 bg-orange-50" },
  { label: "Avg. Engagement", value: "4.62%", change: "+0.75%", icon: MousePointer, color: "text-cyan-600 bg-cyan-50" },
  { label: "Cost Per Engagement", value: "Rp 12.400", change: "-8.2%", icon: DollarSign, color: "text-amber-600 bg-amber-50" },
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
  { name: "Lifestyle", value: 45, color: "#3b82f6" },
  { name: "Tech", value: 25, color: "#22c55e" },
  { name: "Beauty", value: 20, color: "#f97316" },
  { name: "Other", value: 10, color: "#06b6d4" },
];

const topCreators = [
  { name: "Reza Alvaro", category: "travel", impressi: "1.2M", engagement: "5.67%", conversions: 1240, roi: "4.8x" },
  { name: "Nadia Aurellia", category: "lifestyle", impressi: "890K", engagement: "4.21%", conversions: 860, roi: "3.9x" },
  { name: "Dimas Arya", category: "sports", impressi: "750K", engagement: "7.21%", conversions: 980, roi: "3.7x" },
  { name: "Andi Pratama", category: "travel", impressi: "620K", engagement: "5.12%", conversions: 640, roi: "3.2x" },
  { name: "Fajar Nugroho", category: "tech", impressi: "510K", engagement: "3.45%", conversions: 420, roi: "2.9x" },
];

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analytics Insights</h1>
        <p className="text-sm text-slate-500 mt-1">Analisis performa, jangkauan, dan ROI seluruh kampanye</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{m.label}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{m.value}</p>
                  <Badge variant="success" className="mt-2 text-xs">{m.change}</Badge>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${m.color}`}>
                  <m.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Views & Engagement Growth</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={growthData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }} />
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip formatter={(v) => (typeof v === "number" ? v.toLocaleString("id-ID") : v)} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                <Line type="monotone" dataKey="views" name="Views" stroke="#3b82f6" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="engagements" name="Engagements" stroke="#f97316" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Donut chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Engagement Share by Niche</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="relative">
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
                <p className="text-xs text-slate-500">Reach</p>
                <p className="text-sm font-bold text-slate-800">4.2M</p>
              </div>
            </div>
            <div className="space-y-2">
              {nicheData.map((n) => (
                <div key={n.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: n.color }} />
                  <span className="text-sm text-slate-700">{n.name}</span>
                  <span className="text-sm font-semibold text-slate-800 ml-auto">{n.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top creators table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top Performing Kreator</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500">Kreator</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-slate-500 hidden sm:table-cell">Kategori</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Impressi</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">Engagement</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500 hidden md:table-cell">Konversi</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-slate-500">ROI</th>
                </tr>
              </thead>
              <tbody>
                {topCreators.map((c, i) => (
                  <tr key={c.name} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                          {i + 1}
                        </span>
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                          {c.name[0]}
                        </div>
                        <span className="text-sm font-medium text-slate-800">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge variant="secondary" className="text-xs capitalize">{c.category}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-right">{c.impressi}</td>
                    <td className="px-4 py-3 text-sm font-medium text-green-600 text-right">{c.engagement}</td>
                    <td className="px-4 py-3 text-sm text-slate-700 text-right hidden md:table-cell">
                      {c.conversions.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3 text-sm font-bold text-blue-600 text-right">{c.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
