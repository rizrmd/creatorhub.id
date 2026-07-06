import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Search, Video, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type LiveShoppingEntry = {
  no: number;
  name: string;
  platform: string;
  category: string;
  followers: string;
  city: string;
  link: string;
};

const liveShoppingData: LiveShoppingEntry[] = [
  { no: 1, name: "Chandra Liow", platform: "TikTok", category: "Electronics & Gadgets", followers: "8.2M", city: "Jakarta", link: "https://www.tiktok.com/@chandraliow" },
  { no: 2, name: "Tissa Biani", platform: "TikTok", category: "Fashion & Beauty", followers: "3.5M", city: "Jakarta", link: "https://www.tiktok.com/@tissabiani" },
  { no: 3, name: "Indra Jegel", platform: "TikTok", category: "Lifestyle & Home", followers: "2.8M", city: "Surabaya", link: "https://www.tiktok.com/@indrajejegel" },
  { no: 4, name: "Reza Oktovian", platform: "Shopee Live", category: "Electronics & Gaming", followers: "4.1M", city: "Jakarta", link: "https://www.shopee.co.id/shop/123456" },
  { no: 5, name: "Jessica Jane", platform: "Shopee Live", category: "Beauty & Skincare", followers: "2.3M", city: "Jakarta", link: "https://www.shopee.co.id/shop/789012" },
  { no: 6, name: "Deddy Corbuzier", platform: "Tokopedia Live", category: "Health & Supplements", followers: "12M", city: "Jakarta", link: "https://www.tokopedia.com/deddy-corbuzier" },
  { no: 7, name: "Atta Halilintar", platform: "TikTok", category: "Fashion & Lifestyle", followers: "15M", city: "Jakarta", link: "https://www.tiktok.com/@attahalilintar" },
  { no: 8, name: "Ria Ricis", platform: "Shopee Live", category: "Home & Living", followers: "9.7M", city: "Jakarta", link: "https://www.shopee.co.id/shop/345678" },
  { no: 9, name: "Baim Wong", platform: "Tokopedia Live", category: "Baby & Kids", followers: "6.5M", city: "Jakarta", link: "https://www.tokopedia.com/baim-wong" },
  { no: 10, name: "Nissa Sabyan", platform: "TikTok", category: "Fashion & Accessories", followers: "5.1M", city: "Jakarta", link: "https://www.tiktok.com/@nissasabyan" },
];

export default function LiveShopping() {
  const [search, setSearch] = useState("");

  const filtered = liveShoppingData.filter((item) => {
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
          Live Shopping
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Daftar host dan creator live shopping di berbagai platform e-commerce.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--ch-primary-50)" }}>
              <Video className="w-5 h-5" style={{ color: "var(--ch-primary)" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{liveShoppingData.length}</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Total Hosts</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#DCFCE7" }}>
              <Video className="w-5 h-5" style={{ color: "#16A34A" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>
                {new Set(liveShoppingData.map((d) => d.platform)).size}
              </p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Platforms</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FEF3C7" }}>
              <Video className="w-5 h-5" style={{ color: "#D97706" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>
                {new Set(liveShoppingData.map((d) => d.category)).size}
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
          placeholder="Cari host, platform, atau kategori..."
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
                        background: item.platform.includes("TikTok") ? "rgba(0,0,0,0.15)" : item.platform.includes("Shopee") ? "rgba(238,77,45,0.1)" : "rgba(59,130,246,0.1)",
                        color: item.platform.includes("TikTok") ? "#F1F5F9" : item.platform.includes("Shopee") ? "#EE4D2D" : "#3B82F6",
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
