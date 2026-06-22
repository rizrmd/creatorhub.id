import { useState } from "react";
import {
  Newspaper, Search, Users, MapPin,
  TrendingUp, ExternalLink, Instagram,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface HomelessMediaEntry {
  no: number;
  name: string;
  handle: string;
  followers: string;
  region: string;
  category: string;
  engagementRate: string;
}

const HOMELESS_MEDIA: HomelessMediaEntry[] = [
  { no: 1, name: "Jakarta Keras", handle: "jakarta.keras", followers: "5.8M", region: "DKI Jakarta", category: "News", engagementRate: "3.2" },
  { no: 2, name: "Jakarta Zone", handle: "jakartazoone", followers: "3M", region: "DKI Jakarta", category: "Lifestyle", engagementRate: "4.1" },
  { no: 3, name: "Jakarta Terkini", handle: "jakarta.terkini", followers: "2M", region: "DKI Jakarta", category: "News", engagementRate: "3.8" },
  { no: 4, name: "Info Depok", handle: "infodepok_id", followers: "893K", region: "Jabodetabek", category: "News", engagementRate: "5.2" },
  { no: 5, name: "Lambe Turah", handle: "lambe_turah", followers: "12.8M", region: "Regional", category: "Entertainment", engagementRate: "2.8" },
  { no: 6, name: "City Of Bandung", handle: "cityofbdg", followers: "157K", region: "Jawa Barat", category: "Travel", engagementRate: "6.1" },
  { no: 7, name: "Ini Surabaya", handle: "ini_surabaya", followers: "529K", region: "Jawa Timur", category: "News", engagementRate: "4.5" },
  { no: 8, name: "Makasar Info", handle: "omsottamks", followers: "400K", region: "Sulawesi", category: "News", engagementRate: "3.9" },
  { no: 9, name: "Info Banjarmasin", handle: "info_kejadian_banjarmasin", followers: "346K", region: "Kalimantan", category: "News", engagementRate: "5.0" },
  { no: 10, name: "Palembang Info", handle: "palembanginfo", followers: "298K", region: "Sumatra", category: "News", engagementRate: "4.3" },
];

const REGIONS = ["Semua", "DKI Jakarta", "Jabodetabek", "Regional", "Jawa Barat", "Jawa Timur", "Sumatra", "Sulawesi", "Kalimantan"];

export default function HomelessMedia() {
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("Semua");

  const filtered = HOMELESS_MEDIA.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.handle.toLowerCase().includes(search.toLowerCase());
    const matchRegion = regionFilter === "Semua" || m.region === regionFilter;
    return matchSearch && matchRegion;
  });

  const totalFollowers = HOMELESS_MEDIA.reduce((sum, m) => {
    const f = m.followers.replace(/[+MmKk\s]/g, "").toLowerCase();
    if (f.includes("m")) return sum + parseFloat(f) * 1000000;
    if (f.includes("k")) return sum + parseFloat(f) * 1000;
    return sum + parseFloat(f) || 0;
  }, 0);

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <div>
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Homeless Media
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Kelola dan pantau media tanpa afiliasi untuk amplifikasi kampanye
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(249,115,22,0.1)" }}>
              <Newspaper className="w-5 h-5" style={{ color: "#F97316" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{HOMELESS_MEDIA.length}</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Total Media</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(16,185,129,0.1)" }}>
              <Users className="w-5 h-5" style={{ color: "#10B981" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{(totalFollowers / 1000000).toFixed(1)}M</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Total Followers</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(59,130,246,0.1)" }}>
              <MapPin className="w-5 h-5" style={{ color: "#3B82F6" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{new Set(HOMELESS_MEDIA.map(m => m.region)).size}</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Wilayah</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(139,92,246,0.1)" }}>
              <TrendingUp className="w-5 h-5" style={{ color: "#8B5CF6" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>4.3%</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Avg Engagement</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
          <input
            type="text"
            placeholder="Cari media..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border"
            style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)", background: "var(--ch-surface)" }}
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="px-3 py-2 text-[13px] font-semibold rounded-lg border cursor-pointer"
            style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)", background: "var(--ch-surface)" }}
          >
            {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>No</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Nama Media</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Platform</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold hidden sm:table-cell" style={{ color: "var(--ch-text-muted)" }}>Wilayah</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold hidden sm:table-cell" style={{ color: "var(--ch-text-muted)" }}>Kategori</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Followers</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>ER</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Link</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, idx) => (
                  <tr key={m.handle} className="border-b transition-colors hover:bg-white/5" style={{ borderColor: "var(--ch-border)" }}>
                    <td className="px-5 py-2.5 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{idx + 1}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{m.name}</span>
                      <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>@{m.handle}</p>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="flex items-center gap-1.5 text-[12px] font-medium" style={{ color: "#E1306C" }}>
                        <Instagram className="w-3.5 h-3.5" style={{ color: "#E1306C" }} />
                        Instagram
                      </span>
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>{m.region}</span>
                    </td>
                    <td className="px-4 py-2.5 hidden sm:table-cell">
                      <span className="text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{m.category}</span>
                    </td>
                    <td className="px-4 py-2.5 text-[13px] font-semibold text-right" style={{ color: "var(--ch-text)" }}>{m.followers}</td>
                    <td className="px-4 py-2.5 text-[13px] font-semibold text-right" style={{ color: "#10B981" }}>{m.engagementRate}%</td>
                    <td className="px-4 py-2.5 text-right">
                      <a href={`https://instagram.com/${m.handle}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "var(--ch-primary)" }}>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
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
