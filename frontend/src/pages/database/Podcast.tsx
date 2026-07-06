import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Mic, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type PodcastEntry = {
  no: number;
  name: string;
  platform: string;
  category: string;
  followers: string;
  city: string;
  link: string;
};

const podcastData: PodcastEntry[] = [
  { no: 1, name: "Close the Door", platform: "Spotify", category: "Comedy & Talk Show", followers: "1.2M", city: "Jakarta", link: "https://open.spotify.com/show/closethedoor" },
  { no: 2, name: "Podcast Deddy Corbuzier", platform: "YouTube", category: "News & Politics", followers: "8.5M", city: "Jakarta", link: "https://www.youtube.com/@deddycorbuzier" },
  { no: 3, name: "Ruang Sandi", platform: "Spotify", category: "Business & Entrepreneurship", followers: "850K", city: "Jakarta", link: "https://open.spotify.com/show/ruangsandi" },
  { no: 4, name: "Generasi Mic", platform: "Spotify", category: "Music & Entertainment", followers: "420K", city: "Surabaya", link: "https://open.spotify.com/show/generasimic" },
  { no: 5, name: "Podcast Bahagia", platform: "Spotify", category: "Self-Improvement", followers: "680K", city: "Bandung", link: "https://open.spotify.com/show/podcastbahagia" },
  { no: 6, name: "Suara Seksualitas", platform: "Spotify", category: "Health & Wellness", followers: "310K", city: "Jakarta", link: "https://open.spotify.com/show/suaraseksualitas" },
  { no: 7, name: "Ngehits", platform: "YouTube", category: "Pop Culture & Trends", followers: "2.1M", city: "Jakarta", link: "https://www.youtube.com/@ngehits" },
  { no: 8, name: "Teman Tidur", platform: "Spotify", category: "Storytelling & Fiction", followers: "560K", city: "Yogyakarta", link: "https://open.spotify.com/show/temantidur" },
  { no: 9, name: "Bincang Bisnis", platform: "Spotify", category: "Business & Finance", followers: "290K", city: "Jakarta", link: "https://open.spotify.com/show/bincangbisnis" },
  { no: 10, name: "Kuliah Kerja", platform: "Spotify", category: "Education & Career", followers: "180K", city: "Malang", link: "https://open.spotify.com/show/kuliahkerja" },
];

export default function Podcast() {
  const [search, setSearch] = useState("");

  const filtered = podcastData.filter((item) => {
    const q = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.platform.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.city.toLowerCase().includes(q)
    );
  });

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <Link
        to="/dashboard/database"
        className="inline-flex items-center gap-1.5 text-[13px] font-semibold transition-colors"
        style={{ color: "var(--ch-primary)" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Database
      </Link>

      <div>
        <h1
          className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Podcast
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Daftar podcast populer dan host di berbagai platform audio.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--ch-primary-50)" }}>
              <Mic className="w-5 h-5" style={{ color: "var(--ch-primary)" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{podcastData.length}</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Total Podcasts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#DCFCE7" }}>
              <Mic className="w-5 h-5" style={{ color: "#16A34A" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>
                {new Set(podcastData.map((d) => d.platform)).size}
              </p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Platforms</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FEF3C7" }}>
              <Mic className="w-5 h-5" style={{ color: "#D97706" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>
                {new Set(podcastData.map((d) => d.category)).size}
              </p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Categories</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
        <input
          type="text"
          placeholder="Cari podcast, platform, atau kategori..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border"
          style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)", background: "var(--ch-surface)" }}
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                  <th className="text-left px-5 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>No</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Name</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Platform</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Category</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Followers</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>City</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Link</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={`${item.name}-${item.platform}`}
                    className="border-b transition-colors hover:bg-white/5"
                    style={{ borderColor: "var(--ch-border)" }}
                  >
                    <td className="px-5 py-2.5 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{item.no}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{item.name}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{
                        background: item.platform.includes("Spotify") ? "rgba(30,215,96,0.1)" : "rgba(255,0,0,0.1)",
                        color: item.platform.includes("Spotify") ? "#1ED760" : "#FF0000",
                      }}>{item.platform}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{item.category}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{item.followers}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{item.city}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "var(--ch-primary)" }}>
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
