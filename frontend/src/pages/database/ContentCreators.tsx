import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { creatorsApi } from "@/lib/api";
import { formatFollowers } from "@/lib/utils";
import type { Creator } from "@/types";

export default function ContentCreators() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    creatorsApi
      .list({ page: 1, pageSize: 50000, verified: true })
      .then((res) => {
        setCreators(res.data);
        setTotal(res.total);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = creators.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.handle.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
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
          Content Creators
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Daftar content creators terverifikasi di CreatorHub.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--ch-primary-50)" }}>
              <Users className="w-5 h-5" style={{ color: "var(--ch-primary)" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{total}</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Total Creators</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#DCFCE7" }}>
              <Users className="w-5 h-5" style={{ color: "#16A34A" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{filtered.length}</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Filtered</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FEF3C7" }}>
              <Users className="w-5 h-5" style={{ color: "#D97706" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>
                {creators.length > 0
                  ? `${(creators.reduce((s, c) => s + c.engagementRate, 0) / creators.length).toFixed(1)}%`
                  : "0%"}
              </p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Avg Engagement</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
        <input
          type="text"
          placeholder="Cari nama, handle, atau kota..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border"
          style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)", background: "var(--ch-surface)" }}
        />
      </div>

      {loading ? (
        <Card>
          <CardContent className="py-8 text-center text-[13px]" style={{ color: "var(--ch-text-muted)" }}>
            Loading creators...
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>No</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Name</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Handle</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Platform</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>City</th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Category</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Followers</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Engagement</th>
                    <th className="text-center px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, idx) => (
                    <tr
                      key={c.id}
                      className="border-b transition-colors hover:bg-white/5"
                      style={{ borderColor: "var(--ch-border)" }}
                    >
                      <td className="px-5 py-2.5 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{idx + 1}</td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{c.name}</span>
                          {c.verified && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: "rgba(59,130,246,0.15)", color: "#3B82F6" }}>
                              Verified
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[12px] font-medium" style={{ color: "var(--ch-primary)" }}>{c.handle}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
                          {c.platforms?.[0] ?? "-"}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{c.city}</span>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{c.category}</span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>
                          {formatFollowers(c.followers)}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>
                          {c.engagementRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {c.starCreator ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(234,179,8,0.15)", color: "#EAB308" }}>
                            Star
                          </span>
                        ) : c.topRated ? (
                          <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ background: "rgba(34,197,94,0.15)", color: "#22C55E" }}>
                            Top
                          </span>
                        ) : (
                          <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
