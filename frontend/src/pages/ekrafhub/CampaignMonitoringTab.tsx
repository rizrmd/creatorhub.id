import { useState } from "react";
import { Check, ExternalLink, TrendingUp, BadgeCheck, FileText } from "lucide-react";

const PANEL = { background: "linear-gradient(180deg, #111827 0%, #0d1525 100%)", border: "1px solid rgba(255,255,255,0.08)" };
const MUTED = "rgba(255,255,255,0.55)";
const ORANGE = "#F97316";

const TiktokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
  </svg>
);

const VIEWS_SERIES = [96, 112, 88, 124, 142, 118, 150, 138, 156, 144, 161, 152];
const ENG_SERIES = [8, 12, 9, 15, 18, 13, 21, 17, 23, 19, 26, 21];
const X_LABELS = ["Aug 1", "Aug 5", "Aug 10", "Aug 15", "Aug 20", "Aug 25"];

function SectionTitle({ title, tag }: { title: string; tag?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #F97316, #EA580C)", boxShadow: "0 0 10px rgba(249,115,22,0.5)" }} />
      <h3 className="text-[13px] font-bold text-white">{title}</h3>
      {tag && <span className="ml-auto">{tag}</span>}
    </div>
  );
}

function DeltaChip({ value }: { value: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold" style={{ background: "rgba(63,208,127,0.12)", color: "#3fd07f" }}>
      <TrendingUp className="w-2.5 h-2.5" /> {value}
    </span>
  );
}

export default function CampaignMonitoringTab() {
  const [metric, setMetric] = useState<"views" | "engagements">("views");
  const data = metric === "views" ? VIEWS_SERIES : ENG_SERIES;
  const max = Math.max(...data);

  const metrics = [
    { label: "Video Views", value: "261.5K", delta: "+18.4%", sub: "vs. campaign average" },
    { label: "Engagements", value: "24.3K", delta: "+12.7%", sub: "8.30% engagement rate" },
    { label: "Profile Visits", value: "9,860", delta: "+9.2%", sub: "from campaign content" },
    { label: "Public Inquiries", value: "318", delta: "+21.5%", sub: "qualified responses" },
  ];

  const chain = [
    { n: 1, t: "Output", v: "4", d: "Published content" },
    { n: 2, t: "Exposure", v: "293.3K", d: "Views & impressions" },
    { n: 3, t: "Engagement", v: "24.3K", d: "Audience interactions" },
    { n: 4, t: "Outcome", v: "2,140", d: "Campaign link clicks" },
    { n: 5, t: "Impact", v: "96", d: "Recorded transactions" },
  ];

  const topics = [
    { l: "Local attractions", p: 31 },
    { l: "Culinary products", p: 24 },
    { l: "Accessibility", p: 18 },
    { l: "Local crafts", p: 15 },
    { l: "Accommodation", p: 12 },
  ];

  const actions = [
    { l: "Campaign link clicks", v: "2,140" },
    { l: "Map & location opens", v: "680" },
    { l: "Public inquiries", v: "318" },
    { l: "Program registrations", v: "126" },
  ];

  const MONITOR_TABLE = [
  { level: "Output", q: "Apa yang telah dipublikasikan?", ind: "Jumlah konten, akun dan kreator aktif, platform, penggunaan #DesaKreatif, wilayah terjangkau, konsistensi jadwal" },
  { level: "Exposure", q: "Seberapa luas konten tersebar?", ind: "Reach, impressions, views, unique viewers, video completion rate, pertumbuhan mentions" },
  { level: "Engagement", q: "Bagaimana respons audiens?", ind: "Likes, comments, shares, saves, engagement rate, engagement per 1.000 views, organic amplification" },
  { level: "Audience Quality", q: "Siapa yang berinteraksi?", ind: "Akun real vs suspected bots, follower range, lokasi audiens, local audience share, commenter quality" },
  { level: "Public Response", q: "Apa yang dibicarakan publik?", ind: "Sentiment, top topics, pertanyaan publik, aspirasi, keluhan, misinformation, share of positive conversation" },
  { level: "Outcome", q: "Tindakan apa yang terjadi?", ind: "Klik informasi, kunjungan profil, pencarian lokasi, pendaftaran program, kunjungan acara, inquiry produk, kontak kemitraan" },
  { level: "Impact", q: "Apa manfaatnya bagi desa?", ind: "Peningkatan wisatawan, penjualan UMKM, pelaku kreatif terlibat, lapangan kerja, kemitraan, dan pendapatan desa" },
];

const contentItems = [
    { name: "Instagram Reel", v: "58.4K" },
    { name: "Instagram Carousel", v: "31.9K" },
    { name: "TikTok Video 01", v: "128.7K" },
    { name: "TikTok Video 02", v: "74.4K" },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-3xl p-6" style={PANEL}>
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold tracking-wider" style={{ background: "rgba(63,208,127,0.12)", border: "1px solid rgba(63,208,127,0.35)", color: "#3fd07f" }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#3fd07f" }} /> ACTIVE CAMPAIGN
              </span>
              <span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.5)" }}>#DesaKreatif</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-2.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Desa Kreatif Gampong Nusa
            </h2>
            <div className="mt-4 rounded-2xl overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.1)" }}>
              <div className="grid grid-cols-2 md:grid-cols-[110px_1fr_1.4fr] gap-3 px-4 py-2.5" style={{ background: "rgba(255,255,255,0.06)" }}>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.6)" }}>Level</p>
                <p className="text-[10px] font-bold uppercase tracking-wider hidden md:block" style={{ color: "rgba(255,255,255,0.6)" }}>Pertanyaan utama</p>
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.6)" }}>Indikator yang dipantau</p>
              </div>
              {MONITOR_TABLE.map((r, i) => (
                <div key={r.level} className="grid grid-cols-2 md:grid-cols-[110px_1fr_1.4fr] gap-3 px-4 py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)", background: i % 2 === 1 ? "rgba(255,255,255,0.02)" : "transparent" }}>
                  <p className="text-[12px] font-bold" style={{ color: "#FF8B4D" }}>{r.level}</p>
                  <p className="text-[11.5px] hidden md:block leading-snug" style={{ color: "rgba(255,255,255,0.8)" }}>{r.q}</p>
                  <p className="text-[11.5px] leading-snug" style={{ color: "rgba(255,255,255,0.65)" }}>{r.ind}</p>
                </div>
              ))}
            </div>
            <p className="text-[11px] mt-3">
              <span style={{ color: MUTED }}>Performance Data Updated: </span>
              <span style={{ color: "#FB923C", fontWeight: 700 }}>Aug 25, 2026</span>
              <span style={{ color: "#F97316", fontWeight: 700, textShadow: "0 0 12px rgba(249,115,22,0.5)" }}> · 9:12 PM</span>
            </p>
          </div>
          <div className="shrink-0 flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-[11px] font-semibold" style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.75)" }}>
              Aug 1–25, 2026
            </span>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold" style={{ background: ORANGE, color: "#fff", boxShadow: "0 4px 14px rgba(249,115,22,0.35)" }}>
              <FileText className="w-3 h-3" /> Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Creator Contribution */}
      <div className="rounded-3xl p-6" style={PANEL}>
        <p className="text-[10px] font-bold tracking-[0.22em] mb-3" style={{ color: "#F97316" }}>CREATOR CONTRIBUTION</p>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-12 h-12 rounded-full shrink-0" style={{ background: "linear-gradient(140deg,#2b3648,#161d29)" }} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="text-lg font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Ainul Mardhiah Lubis</p>
              <BadgeCheck className="w-4 h-4" style={{ color: "#3fd07f" }} />
            </div>
            <div className="flex items-center gap-3 mt-1 text-[12px]" style={{ color: "rgba(255,255,255,0.6)" }}>
              <span className="inline-flex items-center gap-1.5">◎ @itsbanuun</span>
              <span className="inline-flex items-center gap-1.5"><TiktokIcon className="w-3 h-3" /> @itsbanuun</span>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-wrap shrink-0">
            {[
              { l: "Content Published", v: "4 posts" },
              { l: "Platforms", v: "Instagram · TikTok" },
              { l: "Primary Audience", v: "Aceh · 44%" },
            ].map((c) => (
              <div key={c.l} className="rounded-xl px-3 py-2 text-center" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-[9px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{c.l}</p>
                <p className="text-[12.5px] font-bold text-white mt-0.5">{c.v}</p>
              </div>
            ))}
            <button className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-[11.5px] font-bold text-white" style={{ background: "rgba(249,115,22,0.16)", border: "1px solid rgba(249,115,22,0.4)", color: "#FF8B4D" }}>
              View Posts <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
          {metrics.map((m) => (
            <div key={m.label} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="flex items-center justify-between">
                <DeltaChip value={m.delta} />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>{m.label}</p>
              <p className="text-2xl font-extrabold text-white mt-1.5" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontVariantNumeric: "tabular-nums" }}>
                {m.value}
              </p>
              <p className="text-[10.5px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>{m.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Value Chain */}
      <div className="rounded-3xl p-6" style={PANEL}>
        <SectionTitle title="From Content to Impact" tag={<span className="text-[10px] font-bold" style={{ color: "rgba(255,255,255,0.45)" }}>● Tracking verified</span>} />
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
          {chain.map((s, i) => (
            <div key={s.n} className="relative rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold" style={{ background: "rgba(249,115,22,0.16)", color: "#FF8B4D" }}>
                {s.n}
              </div>
              <p className="text-[10px] font-bold uppercase tracking-wider mt-2.5" style={{ color: "#F97316" }}>{s.t}</p>
              <p className="text-[22px] font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontVariantNumeric: "tabular-nums" }}>{s.v}</p>
              <p className="text-[10.5px]" style={{ color: "rgba(255,255,255,0.5)" }}>{s.d}</p>
              {i < chain.length - 1 && (
                <span className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-white/30">›</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Content Performance + Public Response */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-3xl p-6" style={PANEL}>
          <SectionTitle
            title="Content Performance"
            tag={
              <div className="inline-flex rounded-lg overflow-hidden" style={{ border: "1px solid rgba(255,255,255,0.12)" }}>
                {(["views", "engagements"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMetric(m)}
                    className="px-2.5 py-1 text-[10px] font-bold capitalize transition-colors"
                    style={metric === m ? { background: "rgba(242,101,34,0.16)", color: "#FF8B4D" } : { color: "#8a97ab" }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            }
          />
          <div className="flex items-end gap-1.5 h-32">
            {data.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{ height: `${(v / max) * 100}%`, background: metric === "views" ? "linear-gradient(180deg,#FB923C,#EA580C)" : "linear-gradient(180deg,#38bdf8,#0284C7)" }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1.5 text-[9.5px]" style={{ color: "rgba(255,255,255,0.4)" }}>
            {X_LABELS.map((l) => <span key={l}>{l}</span>)}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {contentItems.map((c) => (
              <span key={c.name} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px]" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.8)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: labelColor(c.name) }} /> {c.name} <b style={{ color: "white" }}>{c.v}</b>
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl p-6" style={PANEL}>
          <SectionTitle title="Conversation Topics" tag={<span className="text-[10.5px] font-bold" style={{ color: "#3fd07f" }}>72% positive</span>} />
          <p className="text-[12px] mb-4" style={{ color: MUTED }}>828 comments</p>
          <div className="space-y-3">
            {topics.map((t) => (
              <div key={t.l}>
                <div className="flex justify-between text-[11.5px] mb-1">
                  <span style={{ color: "rgba(255,255,255,0.75)" }}>{t.l}</span>
                  <b style={{ color: "white" }}>{t.p}%</b>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                  <div className="h-full rounded-full" style={{ width: `${t.p * 2.4}%`, background: "linear-gradient(90deg,#FB923C,#EA580C)" }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl px-4 py-3.5 flex items-start gap-2.5" style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.18)" }}>
            <span className="text-xl leading-none" style={{ color: "#FF8B4D" }}>“</span>
            <p className="text-[12px] leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
              Audiences showed the strongest interest in local attractions, culinary products, and practical information about visiting Gampong Nusa.
            </p>
          </div>
        </div>
      </div>

      {/* Outcome + AVE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-3xl p-6" style={PANEL}>
          <SectionTitle title="Audience Actions" tag={<button className="text-[10.5px] font-bold hover:underline" style={{ color: "#FF8B4D" }}>View details</button>} />
          <div className="grid grid-cols-2 gap-3">
            {actions.map((a) => (
              <div key={a.l} className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <p className="text-[22px] font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontVariantNumeric: "tabular-nums" }}>{a.v}</p>
                <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>{a.l}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl p-6" style={{ background: "linear-gradient(180deg, #16202f 0%, #101825 100%)", border: "1px solid rgba(249,115,22,0.25)" }}>
          <SectionTitle title="Advertising Value Equivalent" />
          <p className="text-[11.5px]" style={{ color: MUTED }}>from Ainul's Campaigns</p>
          <div className="flex items-end justify-between mt-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Estimated AVE</p>
              <p className="text-4xl font-extrabold mt-1" style={{ color: "#FB923C", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Rp64.8M</p>
              <p className="text-[10.5px] mt-1" style={{ color: "rgba(255,255,255,0.45)" }}>based on 293.3K exposures across Instagram and TikTok</p>
            </div>
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold" style={{ background: "rgba(63,208,127,0.12)", color: "#3fd07f" }}>
              <TrendingUp className="w-3 h-3" /> ↗
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 mt-5">
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>Instagram AVE</p>
              <p className="text-lg font-extrabold text-white mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Rp18.9M</p>
            </div>
            <div className="rounded-2xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <p className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: MUTED }}>TikTok AVE</p>
              <p className="text-lg font-extrabold text-white mt-1" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Rp45.9M</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <Check className="w-3.5 h-3.5" style={{ color: "#3fd07f" }} />
            <p className="text-[11px]" style={{ color: "rgba(255,255,255,0.6)" }}><b style={{ color: "white" }}>8</b> Equivalent media placements</p>
          </div>
        </div>
      </div>

      <p className="text-center text-[10px]" style={{ color: "rgba(255,255,255,0.4)" }}>
        Campaign performance by CreatorHub.ID · Data sources: Instagram, TikTok, campaign tracking & verified field reports
      </p>
    </div>
  );
}

function labelColor(name: string) {
  if (name.startsWith("Instagram Carousel")) return "#FB923C";
  if (name.startsWith("Instagram Reel")) return "#FD1D1D";
  if (name.startsWith("TikTok")) return "#25F4EE";
  return "#A78BFA";
}
