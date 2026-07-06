import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Search, Globe2, Database, Building2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const INTL_OUTLETS_DATA = [
  { no: 1, media: "The Strait Times", platform: "Online", package: "Branded Content", targets: "65m avg monthly page views", benefits: "4 Weeks", details: "Max 1,000 words advertorial with 3-4 images. Content produced by The Strait Times.", priceUSD: "$11,500" },
  { no: 2, media: "Washington Post", platform: "Print", package: "1.5 Page Advertorial", targets: "Circulation 173,156", benefits: "4 Weeks", details: "Native article created by WaPo. Client must supply background copy and imagery.", priceUSD: "$46,000" },
  { no: 3, media: "TIME", platform: "Print (APAC)", package: "Single Page Spread", targets: "APAC Circulation 64,633", benefits: "4 Weeks", details: "Content supplied by client with light editing from TIME.", priceUSD: "$23,000" },
  { no: 3, media: "TIME", platform: "Print (APAC+EMEA)", package: "Single Page Spread", targets: "APAC + EMEA Circulation 153,826", benefits: "4 Weeks", details: "Content supplied by client with light editing from TIME.", priceUSD: "$46,000" },
  { no: 3, media: "TIME", platform: "Print (Global)", package: "Single Page Spread", targets: "Global Circulation 1,373,390", benefits: "4 Weeks", details: "Content supplied by client with light editing from TIME.", priceUSD: "$69,000" },
  { no: 4, media: "Wall Street Journal", platform: "Print", package: "Quarter Page", targets: "Circulation 730,000", benefits: "Quarter Page", details: "Client-supplied material. Refer to Ads Spec for detailed size.", priceUSD: "$56,877" },
  { no: 4, media: "Wall Street Journal", platform: "Print", package: "Half Page", targets: "Circulation 730,000", benefits: "Half Page", details: "Client-supplied material.", priceUSD: "$113,754" },
  { no: 4, media: "Wall Street Journal", platform: "Print", package: "Full Page", targets: "Circulation 730,000", benefits: "Full Page", details: "Client-supplied material.", priceUSD: "$227,507" },
  { no: 4, media: "WSJ Magazine", platform: "Print (Magazine)", package: "Full Page", targets: "WSJ Magazine readership", benefits: "Full Page", details: "Client-supplied material for WSJ Magazine.", priceUSD: "$235,350" },
  { no: 5, media: "Reuters / Reuters Plus", platform: "Digital", package: "Video + Article", targets: "4 Weeks", benefits: "800 words", details: "Video 60s with production. Article + social cut promoted through Reuters Plus.", priceUSD: "$138,000" },
  { no: 5, media: "Reuters / Reuters Plus", platform: "Digital", package: "Article Only", targets: "4 Weeks", benefits: "Article only", details: "Client-supplied or written by media. Includes production and promotion.", priceUSD: "$84,000" },
  { no: 6, media: "Bloomberg", platform: "Digital", package: "Native Content", targets: "Bloomberg audience", benefits: "600-800 words", details: "Minimal Spending $96,000. All native with production, imagery and licensing.", priceUSD: "$96,000" },
  { no: 7, media: "AP News", platform: "Digital", package: "Article + Social", targets: "3 weeks", benefits: "Unlimited words", details: "Client supplied content. Social amplification included.", priceUSD: "$17,500" },
  { no: 8, media: "Fortune (US)", platform: "Digital", package: "1x Syndicated Article", targets: "5 weeks", benefits: "Client-supplied content", details: "Global targeting. Social amplification. Native touts on Fortune.com.", priceUSD: "$29,000" },
  { no: 8, media: "Fortune (US)", platform: "Digital", package: "5x Syndicated Articles", targets: "5 weeks", benefits: "5 articles", details: "Global targeting. 100% SOV display banners.", priceUSD: "$86,300" },
  { no: 8, media: "Fortune (US)", platform: "Digital", package: "1x Original Content", targets: "5-7 weeks", benefits: "Fortune Brand Studio write-up", details: "Long form article by Fortune Brand Studio. 6-8 weeks campaign.", priceUSD: "$35,000" },
  { no: 8, media: "Fortune (US)", platform: "Digital", package: "5x Original Content", targets: "5-7 weeks", benefits: "5 articles by Fortune Brand Studio", details: "5 original content articles. Global targeting.", priceUSD: "$173,000" },
  { no: 9, media: "Forbes", platform: "Digital", package: "Digital Advertorial", targets: "Forbes global audience", benefits: "Min. spend USD 100k+", details: "Digital Advertorial. Min. spend USD 100,000+.", priceUSD: "$100,000" },
  { no: 10, media: "Times of India", platform: "Digital", package: "Advertorial", targets: "50,000 views", benefits: "3-4 pictures, 1 YouTube embed", details: "Client supplied content. Cannot publish on weekend.", priceUSD: "$4,100" },
  { no: 11, media: "The Economic Times", platform: "Digital", package: "Advertorial", targets: "3,000 views", benefits: "3-4 pictures, 1 YouTube embed", details: "Client supplied content. Cannot publish on weekend.", priceUSD: "$2,200" },
  { no: 12, media: "Times Now News", platform: "Digital", package: "Advertorial", targets: "30,000 views", benefits: "800 words, 3-4 pictures", details: "Client supplied content. Cannot publish on weekend.", priceUSD: "$4,100" },
  { no: 13, media: "ET Now", platform: "Digital", package: "Advertorial", targets: "30,000 views", benefits: "800 words, 3-4 pictures", details: "Client supplied content. Cannot publish on weekend.", priceUSD: "$3,600" },
  { no: 14, media: "Forbes Middle East", platform: "Online", package: "Article + Print", targets: "19.2M avg annual pageviews", benefits: "500 word limit", details: "1 Online Article + 1x full page print. Social media (IG, Twitter, FB, LinkedIn).", priceUSD: "$29,000" },
  { no: 14, media: "Forbes Middle East", platform: "Online", package: "Video Interview", targets: "19.2M avg annual pageviews", benefits: "Video 3-5 min + print + social", details: "Video interview Q&A. Full page advertorial. Boosting included.", priceUSD: "$57,500" },
  { no: 14, media: "Forbes Middle East", platform: "Print", package: "Inside Full-Page", targets: "Forbes ME print readership", benefits: "Full-page advertorial", details: "Content provided by the client.", priceUSD: "$29,000" },
  { no: 15, media: "Japan Times", platform: "Print & Digital", package: "1 Page (Color)", targets: "Japan Times readership", benefits: "1 Page Full Color", details: "1 advertorial Full Color.", priceUSD: "$49,000" },
  { no: 15, media: "Japan Times", platform: "Print & Digital", package: "1 Page (B&W)", targets: "Japan Times readership", benefits: "1 Page B&W", details: "1 Advertorial B&W.", priceUSD: "$32,600" },
  { no: 15, media: "Japan Times", platform: "Digital", package: "1800 Words", targets: "Japan Times online audience", benefits: "1800 words, max 3 images", details: "1 Advertorial, 1800 words, max 3 images.", priceUSD: "$32,600" },
  { no: 16, media: "Asahi Shimbun", platform: "Print", package: "1 Page (B&W)", targets: "Asahi Shimbun readership", benefits: "1 Page B&W", details: "B&W advertorial.", priceUSD: "$250,000" },
  { no: 16, media: "Asahi Shimbun", platform: "Print", package: "1 Page (Color)", targets: "Asahi Shimbun readership", benefits: "1 Page Full Colour", details: "Full colour advertorial.", priceUSD: "$300,000" },
  { no: 17, media: "Hong Kong Economic Times", platform: "Digital", package: "Native Ad", targets: "HKET homepage 100% entry for 3 days", benefits: "800-1,000 words", details: "HKET handles copywriting. 800-1,000 words. Client provides material.", priceUSD: "$5,000" },
];

export default function InternationalMedia() {
  const [intlSearch, setIntlSearch] = useState("");

  const filtered = INTL_OUTLETS_DATA.filter((m) =>
    m.media.toLowerCase().includes(intlSearch.toLowerCase()) ||
    m.platform.toLowerCase().includes(intlSearch.toLowerCase())
  );

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
          International Media Outlets
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Daftar paket advertorial dan branded content dari media internasional.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "var(--ch-primary-50)" }}>
              <Globe2 className="w-5 h-5" style={{ color: "var(--ch-primary)" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{new Set(INTL_OUTLETS_DATA.map((m) => m.media)).size}</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Media Internasional</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#DCFCE7" }}>
              <Database className="w-5 h-5" style={{ color: "#16A34A" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{INTL_OUTLETS_DATA.length}</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Total Packages</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "#FEF3C7" }}>
              <Building2 className="w-5 h-5" style={{ color: "#D97706" }} />
            </div>
            <div>
              <p className="text-[20px] font-bold" style={{ color: "var(--ch-text)" }}>{new Set(INTL_OUTLETS_DATA.map((m) => m.platform)).size}</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Platforms</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative max-w-sm w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
        <input
          type="text"
          placeholder="Cari media internasional..."
          value={intlSearch}
          onChange={(e) => setIntlSearch(e.target.value)}
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
                  <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>No</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Media</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Platform</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Package</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Targets</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Benefits</th>
                  <th className="text-left px-4 py-3 text-[11px] font-semibold min-w-[250px]" style={{ color: "var(--ch-text-muted)" }}>Details</th>
                  <th className="text-right px-4 py-3 text-[11px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Price (USD)</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m, idx) => {
                  const prev = idx > 0 ? filtered[idx - 1] : null;
                  const isNewMedia = !prev || prev.media !== m.media;
                  return (
                    <tr key={`${m.media}-${m.package}`} className="border-b transition-colors hover:bg-white/5" style={{ borderColor: "var(--ch-border)" }}>
                      <td className="px-4 py-2.5 text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{isNewMedia ? m.no : ""}</td>
                      <td className="px-4 py-2.5"><span className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{m.media}</span></td>
                      <td className="px-4 py-2.5">
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{
                          background: m.platform.toLowerCase().includes("digital") ? "rgba(59,130,246,0.1)" : m.platform.toLowerCase().includes("print") ? "rgba(249,115,22,0.1)" : "rgba(139,92,246,0.1)",
                          color: m.platform.toLowerCase().includes("digital") ? "#3B82F6" : m.platform.toLowerCase().includes("print") ? "#F97316" : "#8B5CF6",
                        }}>{m.platform}</span>
                      </td>
                      <td className="px-4 py-2.5"><span className="text-[12px] font-medium" style={{ color: "var(--ch-text)" }}>{m.package}</span></td>
                      <td className="px-4 py-2.5"><span className="text-[11px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{m.targets}</span></td>
                      <td className="px-4 py-2.5"><span className="text-[11px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{m.benefits}</span></td>
                      <td className="px-4 py-2.5"><span className="text-[11px] leading-relaxed" style={{ color: "var(--ch-text-muted)" }}>{m.details}</span></td>
                      <td className="px-4 py-2.5 text-right"><span className="text-[12px] font-bold" style={{ color: "var(--ch-text)" }}>{m.priceUSD}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
