import { useState, useMemo } from "react";
import { Search, RotateCcw, Instagram, Youtube, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AmplifierAccount {
  id: string;
  name: string;
  handle: string;
  platform: string;
  followers: number;
  followersText: string;
  engagementRate: number;
  hue: number;
}

const FIRST_NAMES = [
  "Rina","Budi","Siti","Dedi","Rina","Andi","Maya","Rudi","Dewi","Eko","Lina","Tono","Sari","Bambang","Nina","Agus","Ratna","Hendra","Wati","Joko",
  "Ani","Fajar","Rina","Dian","Yoga","Lina","Rizky","Putri","Adi","Fani","Bayu","Citra","Raka","Sinta","Dimas","Ayunda","Firman","Galih","Hana","Indra",
  "Jati","Kartika","Lukman","Mila","Nanda","Omar","Pratiwi","Raka","Sinta","Taufik","Ulya","Vina","Winda","Yoga","Zaki","Ayu","Bagus","Citra","Darma",
  "Eka","Fajar","Gita","Hadi","Ika","Joko","Kiki","Lestari","Manuel","Nadia","Oki","Putra","Rina","Surya","Tari","Udin","Vera","Wahyu","Yani","Zainal",
  "Aldi","Bella","Cahya","Dian","Eka","Firman","Gina","Hendra","Ira","Jaya","Koko","Lina","Maya","Nadi","Oni","Putri","Rudi","Sari","Tono","Ucok",
  "Vera","Wati","Yanto","Zahra","Arif","Bunga","Dani","Ella","Fadil","Gina","Hari","Iin","Joni","Kemal","Lia","Mita","Nur","Omar","Prita","Rudi",
  "Siti","Tono","Umi","Vivi","Winda","Yudi","Zara","Asep","Budi","Caca","Dina","Eko","Fitri","Guntur","Hendra","Ika","Jaya","Kartini","Luki","Mira",
  "Nina","Oka","Pranata","Rina","Siti","Tono","Ujang","Vera","Winda","Yoga","Zaki","Ayu","Bagus","Cahya","Darma","Ella","Fajar","Gita","Hadi","Ira",
];

const LAST_NAMES = [
  "Pratama","Putri","Sari","Ramadhan","Wijaya","Saputra","Handayani","Santoso","Permata","Setiawan","Lestari","Kurniawan","Putri","Sari","Pratama","Wijaya",
  "Saputra","Handayani","Santoso","Permata","Setiawan","Lestari","Kurniawan","Putri","Sari","Pratama","Wijaya","Saputra","Handayani","Santoso","Permata",
  "Setiawan","Lestari","Kurniawan","Putri","Sari","Pratama","Wijaya","Saputra","Handayani","Santoso","Permata","Setiawan","Lestari","Kurniawan","Putri",
  "Sari","Pratama","Wijaya","Saputra","Handayani","Santoso","Permata","Setiawan","Lestari","Kurniawan","Putri","Sari","Pratama","Wijaya","Saputra",
  "Handayani","Santoso","Permata","Setiawan","Lestari","Kurniawan","Putri","Sari","Pratama","Wijaya","Saputra","Handayani","Santoso","Permata","Setiawan",
  "Lestari","Kurniawan","Putri","Sari","Pratama","Wijaya","Saputra","Handayani","Santoso","Permata","Setiawan","Lestari","Kurniawan","Putri","Sari",
  "Pratama","Wijaya","Saputra","Handayani","Santoso","Permata","Setiawan","Lestari","Kurniawan","Putri","Sari","Pratama","Wijaya","Saputra","Handayani",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function generateAccounts(platform: string, count: number): AmplifierAccount[] {
  const rand = seededRandom(platform.charCodeAt(0) * 1000 + count);
  const accounts: AmplifierAccount[] = [];

  for (let i = 0; i < count; i++) {
    const firstName = FIRST_NAMES[Math.floor(rand() * FIRST_NAMES.length)];
    const lastName = LAST_NAMES[Math.floor(rand() * LAST_NAMES.length)];
    const name = `${firstName} ${lastName}`;
    const handle = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(rand() * 999)}`;
    const followers = Math.floor(rand() * 900) + 50;
    const er = parseFloat((rand() * 0.5 + 0.5).toFixed(2));

    accounts.push({
      id: `${platform}-${i}`,
      name,
      handle: `@${handle}`,
      platform,
      followers,
      followersText: followers.toLocaleString("id-ID"),
      engagementRate: er,
      hue: Math.floor(rand() * 360),
    });
  }

  return accounts;
}

const PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#E1306C", icon: Instagram },
  { id: "tiktok", label: "TikTok", color: "#000000", icon: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
    </svg>
  )},
  { id: "youtube", label: "YouTube", color: "#FF0000", icon: Youtube },
  { id: "x", label: "X (Twitter)", color: "#000000", icon: () => (
    <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
  )},
];

export default function AmplifiersTab({ onBoostEngagement }: { onBoostEngagement: () => void }) {
  const [activePlatform, setActivePlatform] = useState("instagram");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortByEr, setSortByEr] = useState(false);

  const allAccounts = useMemo(() => {
    const accounts: AmplifierAccount[] = [];
    for (const plat of PLATFORMS) {
      accounts.push(...generateAccounts(plat.id, 1000));
    }
    return accounts;
  }, []);

  const filteredAccounts = useMemo(() => {
    let result = allAccounts.filter((a) => a.platform === activePlatform);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.name.toLowerCase().includes(q) || a.handle.toLowerCase().includes(q));
    }
    if (sortByEr) {
      result = [...result].sort((a, b) => b.engagementRate - a.engagementRate);
    }
    return result;
  }, [allAccounts, activePlatform, search, sortByEr]);

  const allSelected = filteredAccounts.length > 0 && filteredAccounts.every((a) => selectedIds.includes(a.id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !filteredAccounts.some((a) => a.id === id)));
    } else {
      setSelectedIds((prev) => [...new Set([...prev, ...filteredAccounts.map((a) => a.id)])]);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const selectedCount = selectedIds.filter((id) => allAccounts.some((a) => a.id === id && a.platform === activePlatform)).length;

  return (
    <div className="flex flex-col h-full">
      {/* Platform Tabs */}
      <div className="px-3 sm:px-4 pt-3 pb-2 flex flex-wrap items-center gap-2" style={{ background: "#182337" }}>
        {PLATFORMS.map((plat) => {
          const PlatIcon = plat.icon;
          const isActive = activePlatform === plat.id;
          return (
            <button
              key={plat.id}
              onClick={() => { setActivePlatform(plat.id); setSelectedIds([]); setSearch(""); }}
              className={`flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-lg text-[13px] font-medium border transition-all duration-200 cursor-pointer ${
                isActive ? "text-white" : "hover:text-slate-200"
              }`}
              style={isActive
                ? { background: plat.color, borderColor: plat.color }
                : { background: "#0F1B2D", borderColor: "#2A3850", color: "#8B96AA" }
              }
            >
              <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: isActive ? "rgba(255,255,255,0.2)" : plat.color }}>
                <PlatIcon className="w-3.5 h-3.5" style={{ color: "white" }} />
              </span>
              {plat.label}
            </button>
          );
        })}

        <button
          onClick={() => { setSelectedIds([]); setSearch(""); setSortByEr(false); }}
          className="flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-lg text-[13px] font-medium border transition-all duration-200 cursor-pointer hover:text-slate-200"
          style={{ background: "#0F1B2D", borderColor: "#2A3850", color: "#8B96AA" }}
        >
          <span className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: "#475569" }}>
            <RotateCcw className="w-3.5 h-3.5 text-white" />
          </span>
          Reset
        </button>
      </div>

      {/* Search + Select All + ER Sort */}
      <div className="px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2" style={{ background: "#182337" }}>
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#8B96AA" }} />
          <input
            type="text"
            placeholder="Find accounts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border"
            style={{ background: "#0B1220", borderColor: "#2A3850", color: "#E5EAF3" }}
          />
        </div>

        <label className="flex items-center gap-2 h-9 px-3 rounded-lg text-[13px] font-medium border cursor-pointer"
          style={{ background: "#0F1B2D", borderColor: "#2A3850", color: "#8B96AA" }}>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded accent-orange-500"
          />
          Select All
        </label>

        <button
          onClick={() => setSortByEr(!sortByEr)}
          className={`flex items-center gap-2 h-9 pl-1.5 pr-3 rounded-lg text-[13px] font-medium border transition-all duration-200 cursor-pointer ${
            sortByEr ? "text-white" : "hover:text-slate-200"
          }`}
          style={sortByEr
            ? { background: "var(--ch-orange)", borderColor: "var(--ch-orange)" }
            : { background: "#0F1B2D", borderColor: "#2A3850", color: "#8B96AA" }
          }
        >
          <Zap className="w-3.5 h-3.5" />
          ER
        </button>
      </div>

      {/* Results info + Boost button */}
      <div className="sticky top-0 z-30 px-3 sm:px-4 py-2 bg-[#0B1120]/95 backdrop-blur border-b border-white/10 shadow-[0_10px_28px_rgba(0,0,0,0.28)] flex flex-wrap items-center gap-2">
        <div className="flex-1 min-w-[200px]">
          <p className="text-sm font-bold text-white">{filteredAccounts.length} Accounts</p>
          <p className="text-[10px] text-slate-500">{selectedCount} selected</p>
        </div>
        {selectedCount > 0 && (
          <Button size="sm" className="gap-1.5 bg-orange-600 hover:bg-orange-700 text-white" onClick={onBoostEngagement}>
            <Zap className="w-3.5 h-3.5" /> Boost Engagement
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto p-3 sm:p-4">
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}>
          <table className="w-full">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                <th className="text-left px-4 py-2.5 w-10">
                  <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} className="w-4 h-4 rounded accent-orange-500" />
                </th>
                <th className="text-left px-2 py-2.5 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}></th>
                <th className="text-left px-2 py-2.5 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Name</th>
                <th className="text-left px-2 py-2.5 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Handle</th>
                <th className="text-right px-2 py-2.5 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Followers</th>
                <th className="text-right px-4 py-2.5 text-[10px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>E/R</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: "var(--ch-border)" }}>
              {filteredAccounts.slice(0, 100).map((account) => (
                <tr key={account.id} className="hover:bg-black/[0.02] transition-colors cursor-pointer" onClick={() => toggleSelect(account.id)}>
                  <td className="px-4 py-2.5">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(account.id)}
                      onChange={() => toggleSelect(account.id)}
                      className="w-4 h-4 rounded accent-orange-500"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </td>
                  <td className="px-2 py-2.5">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: `hsl(${account.hue}, 55%, 45%)` }}>
                      {account.name[0]}
                    </div>
                  </td>
                  <td className="px-2 py-2.5">
                    <p className="text-[12px] font-semibold truncate" style={{ color: "var(--ch-text)" }}>{account.name}</p>
                  </td>
                  <td className="px-2 py-2.5">
                    <p className="text-[11px] truncate" style={{ color: "var(--ch-text-muted)" }}>{account.handle}</p>
                  </td>
                  <td className="px-2 py-2.5 text-right">
                    <span className="text-[11px] font-bold" style={{ color: "var(--ch-text)" }}>{account.followersText}</span>
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="text-[11px] font-bold" style={{ color: account.engagementRate >= 0.8 ? "#16A34A" : "var(--ch-text)" }}>{account.engagementRate}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredAccounts.length > 100 && (
            <div className="px-4 py-3 text-center text-[11px] text-slate-500 border-t" style={{ borderColor: "var(--ch-border)" }}>
              Showing 100 of {filteredAccounts.length} accounts
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function BoostEngagementDialog({ open, onOpenChange, selectedCount }: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCount: number;
}) {
  const [link, setLink] = useState("");
  const [boostLikes, setBoostLikes] = useState("");
  const [boostShares, setBoostShares] = useState("");
  const [boostComments, setBoostComments] = useState(false);
  const [commentInstructions, setCommentInstructions] = useState("");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-orange-500" /> Boost Engagement
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-3 text-[12px] text-orange-300">
            Boost engagement for <strong>{selectedCount}</strong> selected accounts
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-300">Link of Post</label>
            <Input
              placeholder="Enter link of social media post you want to boost"
              value={link}
              onChange={(e) => setLink(e.target.value)}
            />
            <p className="text-[10px] text-slate-500">Enter link of social media post you want to boost</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Boost Options</label>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!boostLikes} onChange={(e) => { if (!e.target.checked) setBoostLikes(""); }} className="w-4 h-4 rounded accent-orange-500" />
                <span className="text-[13px] text-slate-300">Likes</span>
              </label>
              <Input
                type="number"
                placeholder="0"
                value={boostLikes}
                onChange={(e) => setBoostLikes(e.target.value)}
                className="w-28"
                disabled={!boostLikes && false}
              />
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!boostShares} onChange={(e) => { if (!e.target.checked) setBoostShares(""); }} className="w-4 h-4 rounded accent-orange-500" />
                <span className="text-[13px] text-slate-300">Shares</span>
              </label>
              <Input
                type="number"
                placeholder="0"
                value={boostShares}
                onChange={(e) => setBoostShares(e.target.value)}
                className="w-28"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={boostComments}
                  onChange={(e) => setBoostComments(e.target.checked)}
                  className="w-4 h-4 rounded accent-orange-500"
                />
                <span className="text-[13px] text-slate-300">Comments</span>
              </div>
              {boostComments && (
                <textarea
                  placeholder="Enter instructions for comments..."
                  value={commentInstructions}
                  onChange={(e) => setCommentInstructions(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] rounded-lg border resize-none"
                  style={{ background: "#0B1220", borderColor: "#2A3850", color: "#E5EAF3" }}
                  rows={3}
                />
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            disabled={!link.trim()}
            onClick={() => {
              toast.success(`Boost engagement started for ${selectedCount} accounts!`);
              onOpenChange(false);
            }}
          >
            <Zap className="w-4 h-4 mr-1" /> Generate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

import { toast } from "sonner";
