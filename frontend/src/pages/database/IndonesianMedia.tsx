import { useState, useEffect, useCallback, Fragment } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Search, Building2, Globe, Database,
  ExternalLink, Check, ChevronDown, ChevronRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { mediaNetworkApi, type MediaGroup, type MediaOutlet } from "@/lib/api";

function socialPill(handle: string | null, followers: string | null, color: string) {
  if (!handle) return <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>-</span>;
  return (
    <div className="flex flex-col">
      <span className="text-[11px] font-semibold" style={{ color }}>{handle}</span>
      {followers && <span className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{followers}</span>}
    </div>
  );
}

export default function IndonesianMedia() {
  const [search, setSearch] = useState("");
  const [groups, setGroups] = useState<MediaGroup[]>([]);
  const [expandedGroupId, setExpandedGroupId] = useState<string | null>(null);
  const [groupOutlets, setGroupOutlets] = useState<Record<string, MediaOutlet[]>>({});
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingOutlets, setLoadingOutlets] = useState(false);

  useEffect(() => {
    if (groups.length > 0) return;
    setLoadingGroups(true);
    mediaNetworkApi.listGroups().then(setGroups).catch(console.error).finally(() => setLoadingGroups(false));
  }, [groups.length]);

  const toggleGroup = useCallback((groupId: string) => {
    setExpandedGroupId((prev) => (prev === groupId ? null : groupId));
  }, []);

  useEffect(() => {
    if (!expandedGroupId) return;
    if (groupOutlets[expandedGroupId]) return;
    setLoadingOutlets(true);
    mediaNetworkApi.listOutlets(expandedGroupId)
      .then((data) => setGroupOutlets((prev) => ({ ...prev, [expandedGroupId]: data })))
      .catch(console.error)
      .finally(() => setLoadingOutlets(false));
  }, [expandedGroupId, groupOutlets]);

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
          Indonesian Media Network
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Jaringan media nasional dengan subdomain dan outlet di seluruh Indonesia.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--ch-primary-50)" }}>
              <Building2 className="w-5 h-5" style={{ color: "var(--ch-primary)" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{groups.length}</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Media Groups</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#DCFCE7" }}>
              <Globe className="w-5 h-5" style={{ color: "#16A34A" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>
                {groups.reduce((sum, g) => sum + g.outletCount, 0)}
              </p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Total Subdomains</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FEF3C7" }}>
              <Database className="w-5 h-5" style={{ color: "#D97706" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>
                {Object.values(groupOutlets).flat().filter((o) => o.googleNews).length}
              </p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Google News Indexed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
        <input
          type="text"
          placeholder="Cari media group..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border"
          style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)", background: "var(--ch-surface)" }}
        />
      </div>

      {loadingGroups ? (
        <Card>
          <CardContent className="py-8 text-center text-[13px]" style={{ color: "var(--ch-text-muted)" }}>
            Loading media groups...
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                    <th className="text-left px-5 py-3 text-[11px] font-semibold w-8" style={{ color: "var(--ch-text-muted)" }}></th>
                    <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Grup Media / Subdomain</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Total Brand</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Harga Agency</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Harga Rate Card</th>
                    <th className="text-center px-3 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Google News</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Instagram</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Facebook</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Threads</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>TikTok</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Twitter</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>YouTube</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Genre</th>
                    <th className="text-left px-3 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Keterangan</th>
                    <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Link</th>
                  </tr>
                </thead>
                <tbody>
                  {groups
                    .filter((g) => g.name.toLowerCase().includes(search.toLowerCase()))
                    .map((group) => {
                      const isExpanded = expandedGroupId === group.id;
                      const outlets = groupOutlets[group.id] ?? [];
                      return (
                        <Fragment key={group.id}>
                          <tr
                            key={`group-${group.id}`}
                            onClick={() => toggleGroup(group.id)}
                            className="border-b transition-colors cursor-pointer hover:bg-white/5"
                            style={{ borderColor: "var(--ch-border)" }}
                          >
                            <td className="px-5 py-3">
                              {isExpanded
                                ? <ChevronDown className="w-4 h-4" style={{ color: "var(--ch-primary)" }} />
                                : <ChevronRight className="w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
                              }
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{group.name}</span>
                            </td>
                            <td className="px-3 py-3 text-center">
                              <span className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{group.outletCount}</span>
                            </td>
                            <td className="px-3 py-3" colSpan={12}></td>
                            <td className="px-4 py-3 text-right">
                              {outlets.length > 0 && outlets[0]?.url && (
                                <a href={outlets[0].url!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[12px] font-semibold" style={{ color: "var(--ch-primary)" }}>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </td>
                          </tr>
                          {isExpanded && (
                            loadingOutlets && outlets.length === 0 ? (
                              <tr key={`loading-${group.id}`}>
                                <td colSpan={15} className="px-5 py-4 text-center text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Loading outlets...</td>
                              </tr>
                            ) : (
                              outlets.map((o) => (
                                <tr key={`outlet-${o.id}`} className="border-b transition-colors hover:bg-white/3" style={{ borderColor: "var(--ch-border)" }}>
                                  <td className="px-5 py-2"></td>
                                  <td className="px-4 py-2">
                                    <span className="text-[12px] font-medium" style={{ color: o.isGroupHeader ? "var(--ch-text)" : "var(--ch-text-muted)" }}>{o.name}</span>
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{o.totalBrands ?? "-"}</span>
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className="text-[11px] font-medium" style={{ color: "var(--ch-text)" }}>{o.hargaAgency ?? "-"}</span>
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className="text-[11px] font-medium" style={{ color: "var(--ch-text)" }}>{o.hargaRateCard ?? "-"}</span>
                                  </td>
                                  <td className="px-3 py-2 text-center">
                                    {o.googleNews ? (
                                      <Check className="w-4 h-4 mx-auto" style={{ color: "#10B981" }} />
                                    ) : (
                                      <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>-</span>
                                    )}
                                  </td>
                                  <td className="px-3 py-2">{socialPill(o.instagramHandle, o.instagramFollowers, "#E1306C")}</td>
                                  <td className="px-3 py-2">{socialPill(o.facebookHandle, o.facebookFollowers, "#1877F2")}</td>
                                  <td className="px-3 py-2">{socialPill(o.threadsHandle, o.threadsFollowers, "#000")}</td>
                                  <td className="px-3 py-2">{socialPill(o.tiktokHandle, o.tiktokFollowers, "#000")}</td>
                                  <td className="px-3 py-2">{socialPill(o.twitterHandle, o.twitterFollowers, "#1DA1F2")}</td>
                                  <td className="px-3 py-2">{socialPill(o.youtubeHandle, o.youtubeFollowers, "#FF0000")}</td>
                                  <td className="px-3 py-2">
                                    <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{o.genre ?? "-"}</span>
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{o.keterangan ?? "-"}</span>
                                  </td>
                                  <td className="px-4 py-2 text-right">
                                    {o.url && (
                                      <a href={o.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--ch-primary)" }}>
                                        <ExternalLink className="w-3 h-3" />
                                      </a>
                                    )}
                                  </td>
                                </tr>
                              ))
                            )
                          )}
                        </Fragment>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
