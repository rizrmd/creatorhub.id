import { Radio, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const mentions = [
  { creator: "Nadia Aurellia", platform: "Instagram", content: "Review produk skincare XYZ sangat bagus! Texture-nya ringan...", sentiment: "positive", time: "5 menit lalu" },
  { creator: "Andi Pratama", platform: "YouTube", content: "Unboxing koper baru dari brand ABC - kualitasnya luar biasa!", sentiment: "positive", time: "23 menit lalu" },
  { creator: "Dimas Arya", platform: "TikTok", content: "Workout challenge bersama brand suplemen DEF. Cobain yuk!", sentiment: "positive", time: "1 jam lalu" },
  { creator: "Sinta Dewi", platform: "Instagram", content: "Restoran baru di Surabaya ini agak mengecewakan, porsinya...", sentiment: "negative", time: "2 jam lalu" },
  { creator: "Fajar Nugroho", platform: "YouTube", content: "Laptop gaming terbaru dari brand GHI - performa oke di harga segitu", sentiment: "neutral", time: "3 jam lalu" },
];

const sentimentBadge = {
  positive: <Badge variant="success">Positif</Badge>,
  negative: <Badge variant="destructive">Negatif</Badge>,
  neutral: <Badge variant="secondary">Netral</Badge>,
};

export default function MediaMonitoring() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Media Monitoring</h1>
        <p className="text-sm text-slate-500 mt-1">Pantau mention dan sentimen brand Anda secara real-time</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">847</p>
              <p className="text-sm text-slate-500">Mention Positif</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <Radio className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">1.203</p>
              <p className="text-sm text-slate-500">Total Mention</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">127</p>
              <p className="text-sm text-slate-500">Perlu Perhatian</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Radio className="w-4 h-4 text-blue-600" />
            Feed Mention Terbaru
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {mentions.map((m, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
              <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-sm font-semibold text-slate-600 shrink-0">
                {m.creator[0]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-slate-800">{m.creator}</span>
                  <Badge variant="secondary" className="text-[10px]">{m.platform}</Badge>
                  {sentimentBadge[m.sentiment as keyof typeof sentimentBadge]}
                </div>
                <p className="text-sm text-slate-600 mt-1 line-clamp-2">{m.content}</p>
                <p className="text-xs text-slate-400 mt-1">{m.time}</p>
              </div>
              <TrendingUp className="w-4 h-4 text-slate-300 shrink-0 mt-0.5" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
