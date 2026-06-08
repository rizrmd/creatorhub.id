import { Users, Megaphone, TrendingUp, DollarSign, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const stats = [
  { label: "Total Kreator", value: "1.247", change: "+12%", icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "Kampanye Aktif", value: "8", change: "+2", icon: Megaphone, color: "bg-purple-50 text-purple-600" },
  { label: "Avg. Engagement", value: "4.73%", change: "+0.3%", icon: TrendingUp, color: "bg-green-50 text-green-600" },
  { label: "Total Budget", value: "Rp 125M", change: "+18%", icon: DollarSign, color: "bg-amber-50 text-amber-600" },
];

const activities = [
  { text: "Nadia Aurellia menerima tawaran kampanye Ramadan", time: "2 menit lalu", type: "success" },
  { text: "Kampanye 'Brand Awareness Q1' dibuat", time: "15 menit lalu", type: "info" },
  { text: "Reza Alvaro diundang ke kampanye baru", time: "1 jam lalu", type: "info" },
  { text: "Pembayaran Rp 8.000.000 ke Andi Pratama selesai", time: "3 jam lalu", type: "success" },
  { text: "Laporan analytics Q4 tersedia", time: "5 jam lalu", type: "info" },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Selamat datang kembali, Admin</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-slate-500">{s.label}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{s.value}</p>
                  <div className="flex items-center gap-1 mt-2 text-green-600 text-xs font-medium">
                    <ArrowUpRight className="w-3 h-3" />
                    {s.change} bulan ini
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <s.icon className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity log */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Aktivitas Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {activities.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${a.type === "success" ? "bg-green-500" : "bg-blue-500"}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700">{a.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Top kreator */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Kreator Terpopuler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Nadia Aurellia", cat: "Beauty", followers: "1.2M", rating: 4.9 },
              { name: "Andi Pratama", cat: "Travel", followers: "890K", rating: 4.7 },
              { name: "Dimas Arya", cat: "Sports", followers: "567K", rating: 4.7 },
              { name: "Fajar Nugroho", cat: "Tech", followers: "678K", rating: 4.5 },
            ].map((c) => (
              <div key={c.name} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600">
                  {c.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                  <p className="text-xs text-slate-500">{c.followers} followers</p>
                </div>
                <Badge variant="secondary">{c.cat}</Badge>
                <span className="text-xs font-semibold text-amber-500">★ {c.rating}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
