import { TrendingUp, Users, Eye, Heart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const metrics = [
  { label: "Total Impressi", value: "12.4M", change: "+22%", icon: Eye, color: "text-blue-600 bg-blue-50" },
  { label: "Total Reach", value: "8.7M", change: "+15%", icon: Users, color: "text-purple-600 bg-purple-50" },
  { label: "Avg. Engagement", value: "4.73%", change: "+0.3%", icon: Heart, color: "text-red-500 bg-red-50" },
  { label: "Konversi", value: "3.2%", change: "+0.8%", icon: TrendingUp, color: "text-green-600 bg-green-50" },
];

const topCreators = [
  { name: "Nadia Aurellia", impressi: "3.2M", engagement: "4.91%", platform: "Instagram" },
  { name: "Andi Pratama", impressi: "2.8M", engagement: "5.12%", platform: "YouTube" },
  { name: "Dimas Arya", impressi: "1.9M", engagement: "7.21%", platform: "TikTok" },
  { name: "Fajar Nugroho", impressi: "1.5M", engagement: "3.45%", platform: "YouTube" },
  { name: "Reza Alvaro", impressi: "1.2M", engagement: "4.21%", platform: "Instagram" },
];

export default function Analytics() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Analytics</h1>
        <p className="text-sm text-slate-500 mt-1">Performa kampanye dan kreator secara keseluruhan</p>
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
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performing Kreator</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topCreators.map((c, i) => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                    {i + 1}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-semibold text-blue-700">
                    {c.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                    <p className="text-xs text-slate-500">{c.platform}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-800">{c.impressi}</p>
                    <p className="text-xs text-green-600">{c.engagement}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Performa per Platform</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { platform: "Instagram", share: 48, value: "5.9M", color: "bg-pink-500" },
              { platform: "TikTok", share: 32, value: "3.9M", color: "bg-slate-800" },
              { platform: "YouTube", share: 20, value: "2.5M", color: "bg-red-500" },
            ].map((p) => (
              <div key={p.platform}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-slate-700">{p.platform}</span>
                  <span className="text-slate-500">{p.value} reach</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className={`${p.color} h-2 rounded-full`} style={{ width: `${p.share}%` }} />
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{p.share}% total reach</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
