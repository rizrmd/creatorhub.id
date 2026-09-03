import { useState } from "react";
import { MM_KEYWORDS, type MmKeyword } from "./demokrat-mm-data";

// â”€â”€â”€ Data (from Social Media Listening & Media Monitoring page) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const ANA_OVERVIEW: [string, string, string][] = [
  ["Total mentions", "113", ""], ["Total reach", "85 K", ""], ["Positive mentions", "107", ""],
  ["Negative mentions", "0", ""], ["Average Presence Score", "4/100", "360%"], ["AVE", "$9,266", ""],
  ["Social media reach", "84 K", ""], ["Non-social reach", "345", ""], ["User generated content", "111", ""],
  ["Social media mentions", "111", ""], ["Non-social mentions", "2", ""], ["Social media reactions (e.g. likes)", "1,144", ""],
  ["Social media comments", "124", ""], ["Social media shares", "57", ""], ["Total social media interactions", "1,325", ""]
];

const ANA_CATS: [string, string, string][] = [
  ["X (Twitter)", "13%", "#22D3EE"], ["Facebook", "10%", "#3B82F6"], ["Instagram", "37%", "#EC4899"],
  ["Blog", "0%", "#A78BFA"], ["Video", "0%", "#8B5CF6"], ["TikTok", "38%", "#10B981"],
  ["Podcast", "0%", "#F59E0B"], ["Sosial Lain", "0%", "#FBBF24"], ["Berita", "2%", "#EF4444"], ["Web", "0%", "#94A3B8"]
];

const ANA_SOV: [string, string, string, string, string][] = [
  ["creativedemokrat", "instagram.com", "3", "32 rb", "37,971%"],
  ["panca66", "x.com", "1", "12 rb", "14,328%"],
  ["PDemokrat", "x.com", "1", "12 rb", "14,14%"],
  ["Indomusikgram", "facebook.com", "1", "6,8 rb", "8,097%"],
  ["demokratpacitan", "instagram.com", "1", "2,6 rb", "3,064%"]
];

const ANA_FOL: [string, string, string, string, string, string][] = [
  ["pdemokrat", "tiktok.com", "1", "827", "266 rb", "10"],
  ["panca66", "x.com", "1", "12 rb", "241 rb", "10"],
  ["PDemokrat", "x.com", "1", "12 rb", "238 rb", "10"],
  ["demokratjabar", "tiktok.com", "1", "218", "220 rb", "10"],
  ["Indomusikgram", "facebook.com", "1", "6,8 rb", "170 rb", "10"]
];

const ANA_EMOJI: [string, number][] = [
  ["🎬", 38], ["🎤", 30], ["🎨", 34], ["💰", 26], ["⭐", 24], ["🏅", 22], ["🥇", 20], ["🏆", 20],
  ["✨", 26], ["📱", 22], ["🔥", 18], ["📌", 18], ["📎", 18], ["🗓️", 18], ["📷", 16], ["🆓", 16]
];

const ANA_WORDS: { w: string; s: number; c: string }[] = [
  { w: "kreativitasmu", s: 11, c: "#475569" }, { w: "indonesia", s: 20, c: "#60A5FA" }, { w: "sinar", s: 17, c: "#93C5FD" },
  { w: "partai", s: 19, c: "#818CF8" }, { w: "kreativitas", s: 22, c: "#A78BFA" }, { w: "puluhan", s: 18, c: "#60A5FA" },
  { w: "kategorimu", s: 11, c: "#475569" }, { w: "lomba", s: 32, c: "#3B82F6" }, { w: "hadiah", s: 22, c: "#93C5FD" },
  { w: "ide", s: 18, c: "#A5B4FC" }, { w: "video", s: 30, c: "#8B5CF6" }, { w: "logo", s: 28, c: "#60A5FA" },
  { w: "medium", s: 11, c: "#475569" }, { w: "poster", s: 30, c: "#6366F1" }, { w: "baik", s: 18, c: "#93C5FD" },
  { w: "hut", s: 26, c: "#3B82F6" }, { w: "demokrat", s: 26, c: "#A78BFA" }, { w: "panggung", s: 15, c: "#64748B" },
  { w: "anak", s: 16, c: "#7DD3FC" }, { w: "pendek", s: 34, c: "#2563EB" }, { w: "2026", s: 36, c: "#8B5CF6" },
  { w: "juta", s: 20, c: "#818CF8" }, { w: "over", s: 22, c: "#60A5FA" }, { w: "publik", s: 14, c: "#64748B" },
  { w: "rangka", s: 13, c: "#475569" }, { w: "digital", s: 28, c: "#6366F1" }, { w: "karya", s: 30, c: "#A78BFA" },
  { w: "total", s: 14, c: "#64748B" }, { w: "gratis", s: 16, c: "#7DD3FC" }, { w: "rupiah", s: 15, c: "#64748B" },
  { w: "juara", s: 14, c: "#64748B" }, { w: "kategori", s: 26, c: "#3B82F6" }, { w: "voice", s: 24, c: "#93C5FD" },
  { w: "pilih", s: 18, c: "#A5B4FC" }, { w: "bumper", s: 30, c: "#8B5CF6" }, { w: "nama", s: 13, c: "#475569" },
  { w: "terfavorit", s: 14, c: "#64748B" }, { w: "muda", s: 15, c: "#64748B" }, { w: "sambut", s: 17, c: "#93C5FD" },
  { w: "kreasimu", s: 18, c: "#A78BFA" }, { w: "semangat", s: 14, c: "#64748B" }, { w: "kompetisi", s: 12, c: "#475569" }
];

const ANA_HASHTAGS: [string, string][] = [["#demokratcreativechallenge", "100"], ["#creativedemokrat", "99"], ["#partaidemokrat", "56"], ["#25tahunpartaidemokrat", "55"], ["#bersamarakyat", "53"]];
const ANA_LINKS: [string, string][] = [
  ["https://bit.ly/regulationcreativedmkrt", "1"],
  ["https://drive.google.com/drive/folders/14oUO-7bqnAsX5vCuvPYRYwoM3p2a23Ge", "1"],
  ["https://www.instagram.com/p/dcgmk85j3w9", "1"],
  ["https://x.com/bekasidpc/status/2093898697109340256", "1"],
  ["https://x.com/demokratrohil14/status/2093657451946233947", "1"]
];
const ANA_SITES: [string, string][] = [["tiktok.com", "43"], ["instagram.com", "42"], ["x.com", "15"], ["facebook.com", "11"], ["voa.co.id", "1"]];

const ANA_HOT_ROWS: Record<string, Record<number, number>> = {
  Mon: { 5: 3 }, Tue: { 17: 2 }, Wed: { 2: 2, 4: 2, 5: 4, 10: 2, 19: 2, 20: 3, 21: 2 },
  Thu: { 5: 1, 20: 2 }, Fri: { 0: 4, 1: 2, 2: 2, 3: 2, 5: 2, 18: 2, 19: 2, 20: 2 },
  Sat: { 2: 2, 3: 2, 4: 2, 6: 2, 15: 2, 19: 2, 20: 2, 23: 2 }, Sun: { 1: 2, 18: 2, 20: 2 }
};
const HOT_BG = ["#131C2C", "rgba(59,130,246,.3)", "#60A5FA", "#3B82F6", "#7C3AED"];

const ANA_PRES_PTS: [number, number][] = [[34, 104], [175, 86], [317, 68], [458, 50], [600, 33]];
const ANA_PRES_DATES = ["26 Agu", "28 Agu", "30 Agu", "01 Sep", "03 Sep"];

const TOPIC_ROWS: { emoji: string; name: string; desc: string; mentions: string; reach: string; sov: string }[] = [
  { emoji: "🌸", name: "Demokrat Creative Challenge 2026", desc: "Promotion of the Demokrat Creative Challenge 2026 competition celebrating the 25th anniversary of Partai Demokrat, offering cash prizes for creative works.", mentions: "72", reach: "51K", sov: "61.13%" },
  { emoji: "🏅", name: "Youth Creative Competition Categories", desc: "Call for young Indonesians to showcase their creativity across multiple competition categories in the Demokrat Creative Challenge 2026.", mentions: "38", reach: "32K", sov: "38.87%" }
];

const ANA_POPULAR: [string, string, string, string, string, string, string][] = [
  ["creativedemokrat", "instagram.com", "494 pengikut", "26 Agu 2026", "Positif", "Satu panggung, lima medium, satu semangat! Saatnya karya anak muda Indonesia bersinar di Demokrat Creative Challenge 2026 Tunjukkan kreasimu dan pilih medium terbaikmu: Poster Digital Video Pendek Voice Over Bumper Logo HUT ke-25\u2026", "#4ADE80"],
  ["Demokrat Creative Challenge 2026 Digelar DPC \u2026", "voa.co.id", "1.812 kunjungan", "02 Sep 2026", "Netral", "Dewan Pimpinan Cabang (DPC) Partai Demokrat Kabupaten Asahan menggelar Demokrat Creative Challenge 2026, kompetisi kreatif berskala nasional yang menyasar generasi muda, khususnya\u2026", "#94A3B8"],
  ["creativedemokrat", "instagram.com", "494 pengikut", "28 Agu 2026", "Positif", "TOTAL HADIAH PULUHAN JUTA RUPIAH MENANTIMU! Punya karya kreatif? Saatnya bawa karyamu ke Demokrat Creative Challenge 2026! Lomba Video Pendek Rp6.000.000 | Rp3.000.000 | Rp1.500.000 Lomba Poster Digital Rp5.000.000 [\u2026]", "#4ADE80"],
  ["Partai Demokrat Asahan Wadahi Kreativitas Gene\u2026", "poskotasumatera.com", "3.266 kunjungan", "01 Sep 2026", "Netral", "Asahan \u2014 Dewan Pimpinan Cabang (DPC) Partai Demokrat Kabupaten Asahan membuka ruang berekspresi bagi generasi kreatif melalui\u2026", "#94A3B8"]
];

const ANA_PROFILES: [string, string, string, string, string, string, string][] = [
  ["creativedemokrat", "instagram.com", "494 pengikut", "26 Agu 2026", "Positif", "Satu panggung, lima medium, satu semangat! Saatnya karya anak muda Indonesia bersinar di Demokrat Creative Challenge 2026 Tunjukkan kreasimu dan pilih medium terbaikmu: Poster Digital Video Pendek Voice O\u2026", "#4ADE80"],
  ["panca66", "x.com", "241 rb pengikut \u00b7 623 tayangan", "26 Agu 2026", "Netral", "Dalam rangka 25 Tahun Partai Demokrat, akan hadir Demokrat Creative Challenge 2026. Ada 4 kategori lomba kreatif untuk anak muda Indonesia: Poster Digital Video Pendek Voice Over Bumper Logo HUT ke-25 Follow I\u2026", "#94A3B8"],
  ["PDemokrat", "x.com", "238 rb pengikut \u00b7 529 tayangan", "28 Agu 2026", "Positif", "Punya ide, karya, dan kreativitas? Saatnya ikut Demokrat Creative Challenge 2026 dalam rangka menyambut HUT ke-25 Partai Demokrat. MENANGKAN HADIAH PULUHAN JUTA RUPIAH! 4 KATEGORI LOMBA: Video Pendek Poster\u2026", "#4ADE80"],
  ["Indomusikgram", "facebook.com", "170 rb pengikut", "27 Agu 2026", "Netral", "MENTION TEMEN LO YANG JAGO BIKIN LAGU! Partai Demokrat lagi bikin kompetisi cipta lagu bernama Demokrat Bernada. Terbuka untuk umum, gratis, dan yang menarik: genre-nya bebas total. Pop, rock, folk, dangdut,\u2026", "#94A3B8"]
];

const ANA_KPIS = [
  { label: "PENYEBUTAN", value: "41", delta: "+242%", color: "#4ADE80", note: "vs periode sebelumnya" },
  { label: "JANGKAUAN SOSIAL", value: "60,2 rb", delta: "Instagram \u00b7 TikTok \u00b7 X", color: "#64748B", note: "Akumulasi tayangan estimasi" },
  { label: "JANGKAUAN NON-SOSIAL", value: "1,4 rb", delta: "Berita & web", color: "#64748B", note: "Portal berita dan blog" },
  { label: "INTERAKSI", value: "6.284", delta: "Suka \u00b7 komentar \u00b7 bagikan", color: "#64748B", note: "Total pada penyebutan" },
  { label: "AVE", value: "Rp 31,4 jt", delta: "Estimasi", color: "#64748B", note: "Nilai ekuivalensi iklan" },
  { label: "SKOR KEHADIRAN", value: "68/100", delta: "+9", color: "#4ADE80", note: "vs periode sebelumnya" }
];

void ANA_KPIS;

const MM_DATES = ["26 Agu", "27 Agu", "28 Agu", "29 Agu", "30 Agu", "31 Agu", "01 Sep", "02 Sep", "03 Sep"];

// â”€â”€â”€ Sub components â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function SentimentBadge({ sent, color }: { sent: string; color: string }) {
  const bg = color === "#4ADE80" ? "rgba(34,197,94,.12)" : color === "#F87171" ? "rgba(220,38,38,.12)" : "rgba(148,163,184,.1)";
  const border = color === "#4ADE80" ? "rgba(34,197,94,.4)" : color === "#F87171" ? "rgba(220,38,38,.4)" : "rgba(148,163,184,.3)";
  return (
    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded" style={{ color, background: bg, border: `1px solid ${border}` }}>
      {sent}
    </span>
  );
}

function PlatformAvatar({ kind, name }: { kind: string; name: string }) {
  const bgMap: Record<string, string> = {
    ig: "linear-gradient(135deg,#F58529,#DD2A7B 50%,#8134AF)",
    x: "#0F172A",
    tt: "#0F172A",
    fb: "rgba(59,130,246,.18)",
    news: "rgba(251,191,36,.16)",
  };
  const bg = bgMap[kind] || "#0F172A";
  return (
    <span className="w-[26px] h-[26px] rounded-full flex items-center justify-center shrink-0 text-[9px] font-extrabold"
      style={{ background: bg, border: "1px solid #1E293B", color: "#CBD5E1" }}>
      {(name || "?").charAt(0).toUpperCase()}
    </span>
  );
}

const ACTIONS = [
  { label: "Kunjungi", icon: "M13 5l7 7-7 7M4 12h15" },
  { label: "Tag", icon: "M20.6 13.4 12 22l-9-9 8.6-8.6A2 2 0 0 1 13 4h6a2 2 0 0 1 2 2v6a2 2 0 0 1-.4 1.4z" },
  { label: "Hapus", icon: "M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" },
  { label: "Tambah ke laporan PDF", icon: "M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5M12 12v5M9.5 14.5h5" },
];

// Sumber filter (mockup: counts from K.src)
const MM_SOURCES: { label: string; mono: string; count: number }[] = [
  { label: "Facebook", mono: "f", count: 3 },
  { label: "Instagram", mono: "ig", count: 16 },
  { label: "X (Twitter)", mono: "X", count: 5 },
  { label: "TikTok", mono: "tt", count: 17 },
  { label: "Video", mono: "\u25B6", count: 0 },
  { label: "Berita", mono: "N", count: 0 },
  { label: "Podcast", mono: "P", count: 0 },
  { label: "Sosial Lain", mono: "S", count: 0 },
  { label: "Blog", mono: "B", count: 0 },
  { label: "Web", mono: "W", count: 0 },
];

// Platform avatar icons (mockup: IG/X/TT/News/FB glyphs)
function PlatformIcon({ kind }: { kind: string }) {
  const base = "w-[30px] h-[30px] rounded-full shrink-0 flex items-center justify-center";
  if (kind === "ig") {
    return (
      <span className={base} style={{ background: "linear-gradient(135deg,#F58529,#DD2A7B 50%,#8134AF)", border: "1px solid #334155" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.4 5.9a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2z"></path></svg>
      </span>
    );
  }
  if (kind === "x") {
    return (
      <span className={base} style={{ background: "#0F172A", border: "1px solid #334155" }}>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#F1F5F9"><path d="M18.9 2H22l-6.7 7.6L22.6 22h-6.3l-4.4-6.1L6.4 22H3.3l7-8L2.8 2h6.4l4 5.7zm-1.2 18h1.7L7.4 3.8H5.6z"></path></svg>
      </span>
    );
  }
  if (kind === "tt") {
    return (
      <span className={base} style={{ background: "#0F172A", border: "1px solid #334155" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#22D3EE"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.8a5.9 5.9 0 1 0 4.9 5.8V8.7a7.3 7.3 0 0 0 4.4 1.4V7a4.3 4.3 0 0 1-3.3-1.2z"></path></svg>
      </span>
    );
  }
  if (kind === "news") {
    return (
      <span className={base} style={{ background: "rgba(251,191,36,.16)", border: "1px solid #334155" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="2" strokeLinecap="round"><path d="M4 5h13v14H4zM17 9h3v8a2 2 0 0 1-3 1.7M7 9h7M7 13h7M7 16h4"></path></svg>
      </span>
    );
  }
  if (kind === "fb") {
    return (
      <span className={base} style={{ background: "rgba(59,130,246,.18)", border: "1px solid #334155" }}>
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#60A5FA"><path d="M13.5 21v-7.4h2.6l.4-3h-3V8.7c0-.9.3-1.5 1.6-1.5h1.5V4.5c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.4-4 4.1v2.1H7.5v3h2.2V21z"></path></svg>
      </span>
    );
  }
  return (
    <span className={base} style={{ background: "#0F172A", border: "1px solid #334155" }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9"></circle></svg>
    </span>
  );
}

// Checkbox with mono avatar + label + count (mockup source filter)
function SourceCheckbox({ label, mono, count, selected, onToggle, hideMono, color }: {
  label: string; mono: string; count: number | string; selected: boolean;
  onToggle: () => void; hideMono?: boolean; color?: string;
}) {
  return (
    <div onClick={onToggle} className="flex items-center gap-1.5 cursor-pointer min-w-0">
      <span className="w-3.5 h-3.5 shrink-0 rounded flex items-center justify-center"
        style={{ border: `1.5px solid ${selected ? "#2563EB" : "#334155"}`, background: selected ? "#2563EB" : "transparent" }}>
        {selected && (
          <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><path d="m5 13 4 4L19 7"></path></svg>
        )}
      </span>
      {!hideMono && (
        <span className="w-[19px] h-[19px] shrink-0 rounded-full flex items-center justify-center text-[9px] font-extrabold"
          style={{ background: "#0F172A", border: "1px solid #334155", color: "#94A3B8" }}>{mono}</span>
      )}
      <span className="min-w-0">
        <span className="block text-[11px] font-semibold leading-tight truncate" style={{ color: color || "#CBD5E1" }}>{label}</span>
        {count !== "" && <span className="block text-[9.5px] leading-tight" style={{ color: "#475569" }}>({count})</span>}
      </span>
    </div>
  );
}


// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function DemokratMediaMonitoring() {
  const [kwIdx, setKwIdx] = useState(0);
  const [tabIdx, setTabIdx] = useState(1); // 0= Mentions, 1= Analysis (default per mockup)
  const [page, setPage] = useState(0);
  const [showExact, setShowExact] = useState(false);
  const [chartTab, setChartTab] = useState(0); // 0= Penyebutan & Jangkauan, 1= Sentimen
  const [gran, setGran] = useState(0); // 0=Hari, 1=Minggu, 2=Bulan
  const [srcSel, setSrcSel] = useState<Record<string, boolean>>({});
  const [sentSel, setSentSel] = useState<Record<string, boolean>>({});
  const [presTab, setPresTab] = useState(0); // 0=Weeks 1=Months
  const [exNeutral, setExNeutral] = useState(false);
  const [hotTab, setHotTab] = useState(1); // 0=Mentions 1=Reach 2=Interactions
  const [ctxSent, setCtxSent] = useState(false);

  const K: MmKeyword = MM_KEYWORDS[kwIdx];
  const kwTotal = K.m.reduce((a, b) => a + b, 0);
  const axMax = Math.max(4, Math.ceil(Math.max.apply(null, K.m) * 1.3));
  const rMax = Math.max(2, Math.ceil(Math.max.apply(null, K.r) * 1.3));
  const peakI = K.m.indexOf(Math.max.apply(null, K.m));

  const px = (vals: number[], mx: number) => vals.map((v, i) => `${30 + i * 90},${(125 - (v / mx) * 105).toFixed(1)}`).join(" ");

  const pages = [K.list, K.list2, K.list3, K.list4].filter(Boolean);
  const pageList = pages[page] || K.list || [];
  const pageCount = pages.length;

  const tabs = ["Mentions", "Analysis", "Topic Analysis", "Comparison", "Demographics", "Influencers & Sources", "Reports"];

  return (
    <div className="flex flex-col gap-4 pb-10">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-extrabold tracking-[1.1px]" style={{ color: "#64748B" }}>MEDIA MONITORING</span>
            <span className="text-[10px] font-extrabold tracking-wide" style={{ color: "#93C5FD", background: "rgba(37,99,235,.14)", border: "1px solid rgba(37,99,235,.42)", borderRadius: 5, padding: "2px 7px" }}>
              {kwTotal} PENYEBUTAN
            </span>
            <span className="text-[10px] font-bold" style={{ color: "#475569" }}>5 kata kunci lain belum ada data</span>
          </div>
          <div className="text-[23px] font-extrabold tracking-tight mt-1.5" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Social Media Listening &amp; Media Monitoring
          </div>
          <div className="text-xs leading-relaxed mt-1 max-w-[820px]" style={{ color: "#94A3B8" }}>
            Tools di bawah ini menyisir media sosial, berita, blog, dan web untuk menemukan setiap penyebutan enam kata kunci di bawah &mdash; siapa yang membicarakan, dari kanal mana, dan dengan nada apa. Rentang aktif <span className="font-bold" style={{ color: "#CBD5E1" }}>26 Agu &ndash; 3 Sep 2026</span>.
          </div>
          {/* Keywords */}
          <div className="flex items-center gap-2 flex-wrap mt-3">
            <span className="text-sm font-extrabold tracking-wide" style={{ color: "#CBD5E1" }}>
              Kata Kunci yang Dipantau <span className="text-[11px] font-semibold" style={{ color: "#64748B" }}>&mdash; klik untuk ganti data</span>
            </span>
            {MM_KEYWORDS.map((k, i) => {
              const on = i === kwIdx;
              return (
                <button key={k.label} onClick={() => { setKwIdx(i); setPage(0); }}
                  className="inline-flex items-center gap-1.5 text-[11.5px] font-bold cursor-pointer rounded-full px-2.5 py-1"
                  style={{ background: on ? "rgba(37,99,235,.22)" : "rgba(255,255,255,.03)", border: `1px solid ${on ? "#2563EB" : "#1E293B"}`, color: on ? "#DBEAFE" : "#94A3B8" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4.2-4.2"></path></svg>
                  {k.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-end gap-0.5 flex-wrap relative z-10">
        {tabs.map((label, i) => (
          <button key={label} onClick={() => setTabIdx(i)}
            className="text-[15.5px] font-extrabold tracking-tight px-4 py-2 rounded-t-lg cursor-pointer"
            style={{ background: i === tabIdx ? "rgba(37,99,235,.14)" : "transparent", color: i === tabIdx ? "#93C5FD" : "#64748B" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="rounded-b-lg rounded-tr-lg p-4 relative z-0"
        style={{ background: "rgba(37,99,235,.035)", border: "1px solid rgba(37,99,235,.32)", borderTopColor: "#2563EB" }}>

        {/* Data bar */}
        <div className="flex items-center gap-2.5 mb-3.5 pb-3 border-b" style={{ borderColor: "rgba(37,99,235,.22)" }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2.4" strokeLinecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4.2-4.2"></path></svg>
          <span className="text-[11.5px]" style={{ color: "#94A3B8" }}>Semua data pada tab ini hanya untuk kata kunci</span>
          <span className="text-[12.5px] font-extrabold" style={{ color: "#DBEAFE" }}>{K.label}</span>
          <span className="text-[10.5px] font-bold" style={{ color: "#93C5FD", background: "rgba(37,99,235,.16)", borderRadius: 5, padding: "3px 8px" }}>{kwTotal} PENYEBUTAN</span>
        </div>

        {/* Date range bar */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-[11px] font-bold rounded-lg px-2.5 py-1.5" style={{ background: "#0B1220", border: "1px solid #1E293B", color: "#CBD5E1" }}>
            2026-08-26 â€” 2026-09-03
          </span>
          <span className="text-[11px] font-bold rounded-lg px-2 py-1.5 cursor-pointer" style={{ color: "#CBD5E1", border: "1px solid #334155" }}>âœ• Bersihkan filter</span>
          <span className="text-[11px] font-bold rounded-lg px-2 py-1.5 cursor-pointer" style={{ color: "#CBD5E1", border: "1px solid #334155" }}>ðŸ—„ Simpan filter</span>
          <span className="text-[11px] font-bold rounded-lg px-2 py-1.5 cursor-pointer" style={{ color: "#CBD5E1", border: "1px solid #334155" }}>â¬‡ Ekspor</span>
          <span className="text-[11px] font-bold rounded-lg px-2.5 py-1.5" style={{ background: "#0B1220", border: "1px solid #1E293B", color: "#CBD5E1", marginLeft: "auto" }}>
            2026-08-28 â€” 2026-09-03
          </span>
          <button className="text-[11.5px] font-extrabold text-white rounded-lg px-4 py-1.5 cursor-pointer" style={{ background: "#1D4ED8" }}>â˜° Filter</button>
        </div>

        {/* Analysis tab (default per mockup) */}
        {tabIdx === 1 && (
          <>
          <div className="flex gap-3.5 items-start">
            {/* Penyebutan paling populer */}
            <div className="flex-1 min-w-0 rounded-xl p-3.5 flex flex-col gap-3" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              <div className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Penyebutan paling populer</div>
              {ANA_POPULAR.map((a, i) => (
                <div key={i} className="border-t pt-2.5" style={{ borderColor: "rgba(30,41,59,.8)" }}>
                  <div className="flex items-start gap-2">
                    <PlatformAvatar kind={a[1] === "instagram.com" ? "ig" : "news"} name={a[0]} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-extrabold leading-snug" style={{ color: "#F1F5F9" }}>{a[0]}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>
                        <span className="font-semibold" style={{ color: "#93C5FD" }}>{a[1]}</span> &middot; {a[2]} &middot; {a[3]}
                      </div>
                    </div>
                    <SentimentBadge sent={a[4]} color={a[6]} />
                  </div>
                  <div className="text-[11.5px] leading-relaxed mt-2" style={{ color: "#94A3B8" }}>{a[5]}</div>
                </div>
              ))}
              <div className="flex items-center justify-end gap-0.5 border-t pt-2.5" style={{ borderColor: "rgba(30,41,59,.8)" }}>
                {["1", "2", "3", "4", "5", "\u2026", "25", "\u2026"].map((l, i) => (
                  <span key={i} className="min-w-[22px] h-[22px] rounded flex items-center justify-center text-[11px] font-bold cursor-pointer"
                    style={{ background: i === 0 ? "rgba(37,99,235,.2)" : "transparent", color: i === 0 ? "#93C5FD" : "#64748B" }}>{l}</span>
                ))}
              </div>
            </div>

            {/* Dari profil publik teratas */}
            <div className="flex-1 min-w-0 rounded-xl p-3.5 flex flex-col gap-3" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              <div className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Dari profil publik teratas</div>
              {ANA_PROFILES.map((a, i) => (
                <div key={i} className="border-t pt-2.5" style={{ borderColor: "rgba(30,41,59,.8)" }}>
                  <div className="flex items-start gap-2">
                    <PlatformAvatar kind={a[1] === "instagram.com" ? "ig" : a[1] === "facebook.com" ? "fb" : "x"} name={a[0]} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-extrabold leading-snug" style={{ color: "#F1F5F9" }}>{a[0]}</div>
                      <div className="text-[10px] mt-0.5" style={{ color: "#64748B" }}>
                        <span className="font-semibold" style={{ color: "#93C5FD" }}>{a[1]}</span> &middot; {a[2]} &middot; {a[3]}
                      </div>
                    </div>
                    <SentimentBadge sent={a[4]} color={a[6]} />
                  </div>
                  <div className="text-[11.5px] leading-relaxed mt-2" style={{ color: "#94A3B8" }}>{a[5]}</div>
                </div>
              ))}
              <div className="flex items-center justify-end gap-0.5 border-t pt-2.5" style={{ borderColor: "rgba(30,41,59,.8)" }}>
                {["1", "2", "3", "4", "5", "\u2026", "8", "\u2026"].map((l, i) => (
                  <span key={i} className="min-w-[22px] h-[22px] rounded flex items-center justify-center text-[11px] font-bold cursor-pointer"
                    style={{ background: i === 0 ? "rgba(37,99,235,.2)" : "transparent", color: i === 0 ? "#93C5FD" : "#64748B" }}>{l}</span>
                ))}
              </div>
            </div>

            {/* Ikhtisar */}
            <div className="w-[388px] shrink-0 rounded-xl p-3.5" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              <div className="flex items-center gap-2.5">
                <span className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Ikhtisar</span>
                <span className="ml-auto flex items-center gap-1.5">
                  <span className="text-[10px]" style={{ color: "#64748B" }}>Tampilkan angka persis</span>
                  <button onClick={() => setShowExact(!showExact)}
                    className="w-[26px] h-[14px] rounded-full relative cursor-pointer"
                    style={{ background: showExact ? "#1D4ED8" : "#1E293B" }}>
                    <span className="absolute top-[2px] w-[10px] h-[10px] rounded-full transition-all"
                      style={{ left: showExact ? "14px" : "2px", background: showExact ? "#fff" : "#64748B" }} />
                  </button>
                </span>
              </div>
              <div className="grid grid-cols-3 mt-3 rounded-lg overflow-hidden" style={{ border: "1px solid #1E293B" }}>
                {ANA_OVERVIEW.map((o, i) => (
                  <div key={i} className="px-2.5 py-2 min-w-0" style={{ borderRight: "1px solid rgba(30,41,59,.8)", borderBottom: "1px solid rgba(30,41,59,.8)" }}>
                    <div className="flex items-start gap-1">
                      <span className="flex-1 text-[9.5px] font-bold leading-tight" style={{ color: "#64748B" }}>{o[0]}</span>
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.4" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8v.01"></path></svg>
                    </div>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-base font-extrabold tabular-nums" style={{ color: "#F8FAFC" }}>{o[1]}</span>
                      {o[2] && <span className="text-[9.5px] font-extrabold" style={{ color: "#4ADE80" }}>&#9650; {o[2]}</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center gap-1.5 mt-3 cursor-pointer">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"></path></svg>
                <span className="text-[11.5px] font-extrabold" style={{ color: "#60A5FA" }}>Lihat perbandingan detail</span>
              </div>
            </div>
          </div>

          {/* Penyebutan & Jangkauan chart | Penyebutan per kategori */}
          <div className="flex gap-3.5 items-start">
            <div className="flex-1 min-w-0 rounded-xl p-3.5 pb-2" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              <div className="flex items-center gap-3">
                <div className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Penyebutan &amp; Jangkauan</div>
                <div className="ml-auto flex gap-[3px] rounded-lg" style={{ background: "#0F172A", border: "1px solid #1E293B", padding: 3, flex: "none" }}>
                  {["Hari", "Minggu", "Bulan"].map((l, i) => (
                    <button key={l} onClick={() => setGran(i)} className="text-[11px] font-bold rounded cursor-pointer"
                      style={{ padding: "5px 10px", background: i === gran ? "rgba(37,99,235,.2)" : "transparent", color: i === gran ? "#93C5FD" : "#64748B" }}>{l}</button>
                  ))}
                </div>
              </div>
              <svg viewBox="0 0 800 172" width="100%" height="172" style={{ display: "block", marginTop: 8, overflow: "visible" }}>
                <g stroke="#1E293B" strokeWidth="1">
                  <line x1="30" y1="20" x2="750" y2="20"></line>
                  <line x1="30" y1="72.5" x2="750" y2="72.5"></line>
                  <line x1="30" y1="125" x2="750" y2="125"></line>
                </g>
                <g fill="#475569" fontFamily="Inter, sans-serif" fontSize="9.5" textAnchor="end">
                  <text x="24" y="23">45</text><text x="24" y="76">15</text><text x="24" y="128">0</text>
                </g>
                <g fill="#475569" fontFamily="Inter, sans-serif" fontSize="9.5" textAnchor="start">
                  <text x="756" y="23">45 K</text><text x="756" y="76">15 K</text><text x="756" y="128">0</text>
                </g>
                <line x1="210" y1="20" x2="210" y2="125" stroke="#334155" strokeWidth="1" strokeDasharray="3 3"></line>
                <rect x="199" y="6" width="22" height="15" rx="4" fill="#2563EB"></rect>
                <text x="210" y="17" fill="#fff" fontFamily="Inter, sans-serif" fontSize="9.5" fontWeight="700" textAnchor="middle">40</text>
                <polyline points="30,122.7 120,115.7 210,31.7 300,36.3 390,120.3 480,122.7 570,122.7 660,104 750,108.7" fill="none" stroke="#3B82F6" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"></polyline>
                <polyline points="30,59.7 120,106.3 210,34 300,97 390,121.5 480,122.7 570,122.7 660,118 750,122.7" fill="none" stroke="#059669" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"></polyline>
                <g fill="#64748B" fontFamily="Inter, sans-serif" fontSize="9.5" textAnchor="middle">
                  <text x="30" y="143">26 Agu</text><text x="120" y="143">27 Agu</text><text x="210" y="143">28 Agu</text><text x="300" y="143">29 Agu</text><text x="390" y="143">30 Agu</text><text x="480" y="143">31 Agu</text><text x="570" y="143">01 Sep</text><text x="660" y="143">02 Sep</text><text x="750" y="143">03 Sep</text>
                </g>
              </svg>
              <div className="flex items-center gap-[18px]" style={{ padding: "2px 0 4px 30px" }}>
                <div className="flex items-center gap-1.5"><span style={{ width: 14, height: 2.5, borderRadius: 2, background: "#3B82F6" }}></span><span className="text-[10.5px] font-semibold" style={{ color: "#94A3B8" }}>Penyebutan</span></div>
                <div className="flex items-center gap-1.5"><span style={{ width: 14, height: 2.5, borderRadius: 2, background: "#059669" }}></span><span className="text-[10.5px] font-semibold" style={{ color: "#94A3B8" }}>Jangkauan</span></div>
              </div>
            </div>
            <div className="w-[388px] shrink-0 rounded-xl p-3.5" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              <div className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Penyebutan per kategori</div>
              <div className="flex items-center gap-3 mt-3">
                <svg viewBox="0 0 120 120" width="130" height="130" className="shrink-0">
                  {(() => {
                    const C = 2 * Math.PI * 60;
                    let cum = 0;
                    return ANA_CATS.map(([label, pct, color]) => {
                      const p = parseFloat(pct);
                      if (p <= 0) return null;
                      const len = (p / 100) * C;
                      const rot = -90 + cum * 3.6;
                      cum += p;
                      return <circle key={label as string} cx="60" cy="60" r="60" fill="none" stroke={color} strokeWidth="22" strokeDasharray={`${len.toFixed(1)} ${(C - len).toFixed(1)}`} transform={`rotate(${rot} 60 60)`} />;
                    });
                  })()}
                  <circle cx="60" cy="60" r="47" fill="#0B1220"></circle>
                </svg>
                <div className="flex-1 min-w-0 flex flex-col gap-[7px]">
                  {ANA_CATS.map(([label, pct, color]) => (
                    <div key={label} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: parseFloat(pct) > 0 ? color : "#334155" }} />
                      <span className="flex-1 text-[10.5px] leading-tight" style={{ color: parseFloat(pct) > 0 ? "#CBD5E1" : "#64748B" }}>{label}</span>
                      <span className="text-[10.5px] font-extrabold tabular-nums" style={{ color: parseFloat(pct) > 0 ? "#F1F5F9" : "#64748B" }}>{pct}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sentimen chart | Sentimen per kategori */}
          <div className="flex gap-3.5 items-start">
            <div className="flex-1 min-w-0 rounded-xl p-3.5 pb-2" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              <div className="flex items-center gap-3">
                <div className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sentimen</div>
                <div className="ml-auto flex gap-[3px] rounded-lg" style={{ background: "#0F172A", border: "1px solid #1E293B", padding: 3, flex: "none" }}>
                  {["Hari", "Minggu", "Bulan"].map((l, i) => (
                    <button key={l} onClick={() => setGran(i)} className="text-[11px] font-bold rounded cursor-pointer"
                      style={{ padding: "5px 10px", background: i === gran ? "rgba(37,99,235,.2)" : "transparent", color: i === gran ? "#93C5FD" : "#64748B" }}>{l}</button>
                  ))}
                </div>
              </div>
              <svg viewBox="0 0 800 172" width="100%" height="172" style={{ display: "block", marginTop: 8, overflow: "visible" }}>
                <g stroke="#1E293B" strokeWidth="1">
                  <line x1="30" y1="20" x2="750" y2="20"></line>
                  <line x1="30" y1="72.5" x2="750" y2="72.5"></line>
                  <line x1="30" y1="125" x2="750" y2="125"></line>
                </g>
                <g fill="#475569" fontFamily="Inter, sans-serif" fontSize="9.5" textAnchor="end">
                  <text x="24" y="23">60</text><text x="24" y="76">20</text><text x="24" y="128">0</text>
                </g>
                <polyline points="30,123.3 120,121.5 210,52.5 300,56.8 390,121.5 480,123.3 570,123.3 660,102.3 750,112.8" fill="none" stroke="#22C55E" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"></polyline>
                <polyline points="30,124.5 120,124.5 210,124.5 300,124.5 390,124.5 480,124.5 570,124.5 660,124.5 750,124.5" fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"></polyline>
                <g fill="#64748B" fontFamily="Inter, sans-serif" fontSize="9.5" textAnchor="middle">
                  <text x="30" y="143">26 Agu</text><text x="120" y="143">27 Agu</text><text x="210" y="143">28 Agu</text><text x="300" y="143">29 Agu</text><text x="390" y="143">30 Agu</text><text x="480" y="143">31 Agu</text><text x="570" y="143">01 Sep</text><text x="660" y="143">02 Sep</text><text x="750" y="143">03 Sep</text>
                </g>
              </svg>
              <div className="flex items-center gap-[18px]" style={{ padding: "2px 0 4px 30px" }}>
                <div className="flex items-center gap-1.5"><span style={{ width: 14, height: 2.5, borderRadius: 2, background: "#22C55E" }}></span><span className="text-[10.5px] font-semibold" style={{ color: "#94A3B8" }}>Positif</span></div>
                <div className="flex items-center gap-1.5"><span style={{ width: 14, height: 2.5, borderRadius: 2, background: "#DC2626" }}></span><span className="text-[10.5px] font-semibold" style={{ color: "#94A3B8" }}>Negatif</span></div>
              </div>
            </div>
            <div className="w-[388px] shrink-0 rounded-xl p-3.5" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              <div className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sentimen per kategori</div>
              <div className="flex items-center justify-between text-[9.5px] mt-2" style={{ color: "#475569" }}>
                <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
              </div>
              {[["X (Twitter)", 25], ["Facebook", 17], ["Berita", 0], ["Instagram", 82], ["TikTok", 84]].map(([label, v]) => (
                <div key={label as string} className="flex items-center gap-2.5 mt-2">
                  <span className="w-[96px] shrink-0 text-[10.5px]" style={{ color: "#94A3B8" }}>{label}</span>
                  <div className="flex-1 h-[14px] rounded" style={{ background: "linear-gradient(90deg, rgba(34,197,94,.35) 0%, #22C55E " + v + "%, #1E293B " + v + "%)" }} />
                  <span className="w-[26px] shrink-0 text-right text-[10.5px] font-bold tabular-nums" style={{ color: "#F1F5F9" }}>{v}</span>
                </div>
              ))}
              <div className="flex items-center gap-3 mt-3 pt-2 border-t" style={{ borderColor: "#1E293B" }}>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#DC2626" }} /><span className="text-[9.5px]" style={{ color: "#64748B" }}>Negatif</span></span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#64748B" }} /><span className="text-[9.5px]" style={{ color: "#64748B" }}>Netral</span></span>
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#22C55E" }} /><span className="text-[9.5px]" style={{ color: "#64748B" }}>Positif</span></span>
              </div>
            </div>
          </div>

          {/* Share of Voice | Pengikut terbanyak */}
          <div className="flex gap-3.5 items-start">
            <div className="flex-1 min-w-0 rounded-xl p-3.5" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              <div className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Share of Voice terbesar</div>
              <div className="grid text-[9.5px] font-extrabold tracking-wider text-center mt-2.5" style={{ gridTemplateColumns: "minmax(0,1.3fr) 92px 92px 108px", color: "#64748B", borderBottom: "1px solid #1E293B", paddingBottom: 8 }}>
                <span className="text-left">NAMA PROFIL</span><span>PENYEBUTAN</span><span>JANGKAUAN</span><span>SHARE OF VOICE</span>
              </div>
              {ANA_SOV.map((r, i) => (
                <div key={i} className="grid items-center text-center" style={{ gridTemplateColumns: "minmax(0,1.3fr) 92px 92px 108px", borderBottom: "1px solid rgba(30,41,59,.6)", padding: "9px 0" }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-[22px] h-[22px] shrink-0 rounded-full flex items-center justify-center text-[9px] font-extrabold"
                      style={{ background: r[1] === "instagram.com" ? "linear-gradient(135deg,#F58529,#DD2A7B 50%,#8134AF)" : r[1] === "facebook.com" ? "#2563EB" : "#0F172A", border: "1px solid #1E293B", color: "#CBD5E1" }}>{r[0].charAt(0).toUpperCase()}</span>
                    <span className="min-w-0"><span className="block text-[11.5px] font-extrabold truncate" style={{ color: "#F1F5F9" }}>{r[0]}</span><span className="block text-[9.5px]" style={{ color: "#64748B" }}>{r[1]}</span></span>
                  </div>
                  <span className="text-[11px] font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{r[2]}</span>
                  <span className="text-[11px] font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{r[3]}</span>
                  <span className="text-[11px] font-extrabold tabular-nums" style={{ color: "#93C5FD" }}>{r[4]}</span>
                </div>
              ))}
              <div className="flex items-center justify-end gap-0.5 pt-2.5">
                {["1", "2", "3", "4", "5", "…", "13"].map((l, i) => (
                  <span key={i} className="min-w-[22px] h-[22px] rounded flex items-center justify-center text-[11px] font-bold cursor-pointer"
                    style={{ background: i === 0 ? "rgba(37,99,235,.16)" : "transparent", color: i === 0 ? "#93C5FD" : "#64748B" }}>{l}</span>
                ))}
                <span className="w-[22px] h-[22px] rounded flex items-center justify-center cursor-pointer" style={{ color: "#64748B" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="m9 6 6 6-6 6"></path></svg>
                </span>
              </div>
            </div>
            <div className="flex-1 min-w-0 rounded-xl p-3.5" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              <div className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Pengikut terbanyak</div>
              <div className="grid text-[9.5px] font-extrabold tracking-wider text-center mt-2.5" style={{ gridTemplateColumns: "minmax(0,1.3fr) 80px 84px 108px 92px", color: "#64748B", borderBottom: "1px solid #1E293B", paddingBottom: 8 }}>
                <span className="text-left">NAMA PROFIL</span><span>PENYEBUTAN</span><span>JANGKAUAN</span><span>PENGIKUT</span><span>SKOR PENGARUH</span>
              </div>
              {ANA_FOL.map((r, i) => (
                <div key={i} className="grid items-center text-center" style={{ gridTemplateColumns: "minmax(0,1.3fr) 80px 84px 108px 92px", borderBottom: "1px solid rgba(30,41,59,.6)", padding: "9px 0" }}>
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-[22px] h-[22px] shrink-0 rounded-full flex items-center justify-center text-[9px] font-extrabold"
                      style={{ background: r[1] === "facebook.com" ? "#2563EB" : r[1] === "tiktok.com" ? "#1D4ED8" : "#0F172A", border: "1px solid #1E293B", color: "#CBD5E1" }}>{r[0].charAt(0).toUpperCase()}</span>
                    <span className="min-w-0"><span className="block text-[11.5px] font-extrabold truncate" style={{ color: "#F1F5F9" }}>{r[0]}</span><span className="block text-[9.5px]" style={{ color: "#64748B" }}>{r[1]}</span></span>
                  </div>
                  <span className="text-[11px] font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{r[2]}</span>
                  <span className="text-[11px] font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{r[3]}</span>
                  <span className="text-[11px] font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{r[4]}</span>
                  <span className="flex items-center justify-end gap-1.5">
                    <span className="w-[30px] h-[3px] rounded-full overflow-hidden" style={{ background: "#1E293B" }}>
                      <span className="block h-full rounded-full" style={{ width: "100%", background: "#3B82F6" }} />
                    </span>
                    <span className="text-[11px] font-extrabold tabular-nums" style={{ color: "#93C5FD" }}>{r[5]}</span>
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-end gap-0.5 pt-2.5">
                {["1", "2", "3", "4", "5", "…", "13"].map((l, i) => (
                  <span key={i} className="min-w-[22px] h-[22px] rounded flex items-center justify-center text-[11px] font-bold cursor-pointer"
                    style={{ background: i === 0 ? "rgba(37,99,235,.16)" : "transparent", color: i === 0 ? "#93C5FD" : "#64748B" }}>{l}</span>
                ))}
                <span className="w-[22px] h-[22px] rounded flex items-center justify-center cursor-pointer" style={{ color: "#64748B" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="m9 6 6 6-6 6"></path></svg>
                </span>
              </div>
            </div>
          </div>

          {/* Current Presence Score */}
          <div className="rounded-xl p-3.5 flex gap-4 items-stretch" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
            <div className="w-[210px] shrink-0 flex flex-col items-center gap-2.5 pr-3.5" style={{ borderRight: "1px solid #1E293B" }}>
              <span className="self-start text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Current Presence Score</span>
              <svg viewBox="0 0 120 120" width="112" height="112" className="mt-1">
                <circle cx="60" cy="60" r="46" fill="none" stroke="#1E293B" strokeWidth="15" />
                <circle cx="60" cy="60" r="46" fill="none" stroke="#2563EB" strokeWidth="15" strokeDasharray="17.3 271.7" transform="rotate(-90 60 60)" />
                <text x="60" y="60" fill="#F8FAFC" fontFamily="'Plus Jakarta Sans', sans-serif" fontSize="36" fontWeight="800" textAnchor="middle" dominantBaseline="central">6</text>
              </svg>
              <div className="text-[11px] text-center leading-relaxed" style={{ color: "#94A3B8" }}>
                Your Presence Score<br />is higher than <span className="font-extrabold" style={{ color: "#F1F5F9" }}>33%</span> of brands
              </div>
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <div className="flex justify-end">
                <div className="flex gap-0.5 rounded-lg p-0.5" style={{ background: "#0F172A", border: "1px solid #1E293B" }}>
                  {["Weeks", "Months"].map((l, i) => (
                    <button key={l} onClick={() => setPresTab(i)} className="text-[11px] font-bold px-3.5 py-1 rounded cursor-pointer"
                      style={{ background: i === presTab ? "#1D4ED8" : "transparent", color: i === presTab ? "#fff" : "#64748B" }}>{l}</button>
                  ))}
                </div>
              </div>
              <svg viewBox="0 0 660 160" width="100%" height="130" className="block mt-1 overflow-visible">
                <g stroke="#1E293B" strokeWidth="1">
                  <line x1="30" y1="18" x2="635" y2="18"></line>
                  <line x1="30" y1="61" x2="635" y2="61"></line>
                  <line x1="30" y1="104" x2="635" y2="104"></line>
                </g>
                <g fill="#475569" fontFamily="Inter, sans-serif" fontSize="9.5" textAnchor="end">
                  <text x="24" y="21">7</text><text x="24" y="64">5</text><text x="24" y="107">2</text>
                </g>
                <polyline points={ANA_PRES_PTS.map(p => p.join(",")).join(" ")} fill="none" stroke="#3B82F6" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
                {ANA_PRES_PTS.map((p, i) => <circle key={i} cx={p[0]} cy={p[1]} r="3.4" fill="#3B82F6" stroke="#0B1220" strokeWidth="2" />)}
                <g fill="#64748B" fontFamily="Inter, sans-serif" fontSize="9.5" textAnchor="middle">
                  {ANA_PRES_DATES.map((d, i) => <text key={d} x={34 + i * 141} y="132">{d}</text>)}
                </g>
              </svg>
              <div className="text-[11px] mt-1 text-center" style={{ color: "#64748B" }}>Your Presence Score</div>
            </div>
          </div>

          {/* Sentiment breakdown | Emojis */}
          <div className="flex gap-3.5 items-start">
            <div className="w-[388px] shrink-0 rounded-xl p-3.5" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              <div className="flex items-center gap-2">
                <span className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Sentiment breakdown</span>
                <span className="ml-auto flex items-center gap-1.5">
                  <span className="text-[10px]" style={{ color: "#64748B" }}>Exclude neutral</span>
                  <button onClick={() => setExNeutral(!exNeutral)} className="w-[26px] h-[14px] rounded-full relative cursor-pointer"
                    style={{ background: exNeutral ? "#1D4ED8" : "#1E293B" }}>
                    <span className="absolute top-[2px] w-[10px] h-[10px] rounded-full transition-all" style={{ left: exNeutral ? "14px" : "2px", background: exNeutral ? "#fff" : "#64748B" }} />
                  </button>
                </span>
              </div>
              <div className="flex items-center justify-center gap-8 mt-3">
                <svg viewBox="0 0 230 220" width="216" height="206">
                  <g transform="translate(113,110)" fill="none" strokeWidth="13">
                    <circle r="93" stroke="#1E293B"></circle>
                    {(() => {
                      const pos = exNeutral ? 0.918 : 0.78, neu = exNeutral ? 0 : 0.15;
                      const pt = (f: number) => { const a = (180 - f * 180) * Math.PI / 180; return [104 * Math.cos(a), -104 * Math.sin(a)]; };
                      const [ax, ay] = pt(pos);
                      const [bx, by] = pt(pos + neu);
                      return (
                        <>
                          <path d={`M${-93} 0 A93 93 0 0 1 ${ax} ${ay}`} stroke="#1E293B"></path>
                          <path d={`M${-93} 0 A93 93 0 0 1 ${ax} ${ay}`} stroke="#22C55E"></path>
                          <path d={`M${-93} 0 A93 93 0 1 1 ${bx} ${by}`} stroke="#475569"></path>
                          <path d={`M${-93} 0 A93 93 0 0 1 ${bx} ${by}`} stroke="#DC2626"></path>
                        </>
                      );
                    })()}
                    <circle r="75" fill="#0B1220"></circle>
                  </g>
                </svg>
                <div className="flex flex-col gap-2.5">
                  {[["Positive", exNeutral ? 91 : 78, "#4ADE80"], ["Neutral", exNeutral ? 0 : 15, "#64748B"], ["Negative", exNeutral ? 9 : 4, "#DC2626"]].map(([label, v, color]) => (
                    <div key={label as string} className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full" style={{ background: color as string }} />
                      <span className="text-[11px]" style={{ color: "#94A3B8" }}>{label}</span>
                      <span className="text-[11px] font-extrabold tabular-nums ml-auto" style={{ color: "#F1F5F9" }}>{v}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-0 rounded-xl p-3.5" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              <div className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>The most popular emojis</div>
              <div style={{ flex: 1, display: "flex", flexWrap: "wrap", alignItems: "center", alignContent: "space-around", justifyContent: "center", gap: "14px 26px", padding: "18px 10px 12px" }}>
                {ANA_EMOJI.map(([e, s], i) => (
                  <span key={i} style={{ fontSize: s, lineHeight: 1 }}>{e}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Context of a discussion */}
          <div className="rounded-xl p-3.5" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
            <div className="flex items-center gap-2">
              <span className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Context of a discussion</span>
              <button onClick={() => setCtxSent(!ctxSent)} className={`ml-auto inline-flex items-center gap-1.5 text-[11px] font-bold cursor-pointer ${ctxSent ? "" : ""}`} style={{ color: ctxSent ? "#93C5FD" : "#64748B" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 1 0 9 9h-9V3z"></path></svg>
                Show sentiment
              </button>
            </div>
            <div className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 px-4 pt-4 pb-3" style={{ lineHeight: 1.15 }}>
              {ANA_WORDS.map((x, i) => (
                <span key={i} style={{ fontSize: x.s, color: ctxSent ? (x.s > 20 ? "#22C55E" : "#94A3B8") : x.c, fontWeight: x.s > 18 ? 800 : 600 }}>{x.w}</span>
              ))}
            </div>
          </div>

          {/* Trending hashtags | links | sites */}
          <div className="flex gap-3.5 items-start">
            {[{ title: "Trending hashtags", rows: ANA_HASHTAGS, cols: ["HASHTAG", "MENTIONS"], pager: ["1", "2", "3", "4", "5", "…"] },
              { title: "Trending links", rows: ANA_LINKS, cols: ["LINK", "MENTIONS"], pager: ["1", "2", "3", "4", "…"] },
              { title: "Most active sites", rows: ANA_SITES, cols: ["SOURCE", "MENTIONS"], pager: ["1", "2", "…"], sites: true }
            ].map((s) => (
              <div key={s.title} className="flex-1 min-w-0 rounded-xl p-3.5" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
                <div className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.title}</div>
                <div className="flex items-center justify-between mt-3 pb-2.5 border-b text-[10px] font-extrabold tracking-wider" style={{ color: "#64748B", borderColor: "#1E293B" }}>
                  <span>{s.cols[0]}</span><span>{s.cols[1]}</span>
                </div>
                {s.rows.map(([t, c], i) => (
                  <div key={i} className="flex items-center gap-2.5 py-2.5 border-b" style={{ borderColor: "rgba(30,41,59,.6)" }}>
                    {(s.sites
                      ? <span className="w-[22px] h-[22px] shrink-0 rounded-full flex items-center justify-center"
                          style={t === "tiktok.com" ? { background: "#0F172A", border: "1px solid #334155" }
                            : t === "instagram.com" ? { background: "linear-gradient(135deg,#F58529,#DD2A7B 50%,#8134AF)" }
                            : t === "x.com" ? { background: "#0F172A", border: "1px solid #334155" }
                            : t === "facebook.com" ? { background: "#1877F2" } : { background: "#7C3AED" }}>
                          {t === "tiktok.com" ? <svg width="12" height="12" viewBox="0 0 24 24" fill="#22D3EE"><path d="M16.6 5.8A4.3 4.3 0 0 1 15.5 3h-3.1v12.4a2.6 2.6 0 1 1-1.8-2.5V9.8a5.9 5.9 0 1 0 4.9 5.8V8.7a7.3 7.3 0 0 0 4.4 1.4V7a4.3 4.3 0 0 1-3.3-1.2z"/></svg>
                            : t === "instagram.com" ? <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A4.5 4.5 0 1 1 7.5 12 4.5 4.5 0 0 1 12 7.5zm0 2A2.5 2.5 0 1 0 14.5 12 2.5 2.5 0 0 0 12 9.5zM17.4 5.9a1.2 1.2 0 1 1-1.2 1.2 1.2 1.2 0 0 1 1.2-1.2z"/></svg>
                            : t === "x.com" ? <svg width="11" height="11" viewBox="0 0 24 24" fill="#F1F5F9"><path d="M18.9 2H22l-6.7 7.6L22.6 22h-6.3l-4.4-6.1L6.4 22H3.3l7-8L2.8 2h6.4l4 5.7zm-1.2 18h1.7L7.4 3.8H5.6z"/></svg>
                            : t === "facebook.com" ? <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M13.5 22v-8h2.8l.4-3.2h-3.2V8.6c0-.9.3-1.5 1.6-1.5h1.7V4.2c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.2v2.5H7.3V14h2.8v8h3.4z"/></svg>
                            : <svg width="12" height="12" viewBox="0 0 24 24" fill="#fff"><path d="M4 5h4l4 10 4-10h4l-6 14h-4L4 5z"/></svg>}
                        </span>
                      : null)}
                    <span className="flex-1 min-w-0 text-[12.5px] font-extrabold truncate" style={{ color: "#93C5FD" }}>{t}</span>
                    <span className="text-[12.5px] font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{c}</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0"><path d="M14 4h6v6M20 4l-8 8M18 14v6H4V6h6"></path></svg>
                  </div>
                ))}
                <div className="flex items-center justify-end gap-0.5 pt-2.5">
                  {s.pager.map((l, i) => (
                    <span key={i} className="min-w-[22px] h-[22px] rounded flex items-center justify-center text-[11px] font-bold cursor-pointer"
                      style={{ background: i === 0 ? "rgba(37,99,235,.16)" : "transparent", color: i === 0 ? "#93C5FD" : "#64748B" }}>{l}</span>
                  ))}
                  <span className="w-[22px] h-[22px] rounded flex items-center justify-center cursor-pointer" style={{ color: "#64748B" }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="m9 6 6 6-6 6"></path></svg>
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Hot Hours | Emotions share */}
          <div className="flex gap-3.5 items-stretch">
            <div className="flex-1 min-w-0 rounded-xl p-3.5" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Hot Hours</span>
                <span className="inline-flex items-center gap-2 rounded-lg ml-auto" style={{ background: "#0F172A", border: "1px solid #1E293B", padding: "6px 11px", fontSize: 11, fontWeight: 700, color: "#CBD5E1", cursor: "pointer" }}>
                  Asia/Jakarta (GMT+7)
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"></path></svg>
                </span>
                <div className="flex gap-[3px] rounded-lg" style={{ background: "#0F172A", border: "1px solid #1E293B", padding: 3, flex: "none" }}>
                  {["Mentions", "Reach", "Interactions"].map((l, i) => (
                    <button key={l} onClick={() => setHotTab(i)} className="text-[11px] font-bold rounded cursor-pointer"
                      style={{ padding: "5px 11px", background: i === hotTab ? "#1D4ED8" : "transparent", color: i === hotTab ? "#fff" : "#64748B" }}>{l}</button>
                  ))}
                </div>
              </div>
              <div className="text-[12px] font-extrabold text-center mt-3.5" style={{ color: "#CBD5E1" }}>
                Mentions written on Friday at 12 AM generate the most {["mentions", "reach", "interactions"][hotTab]}
              </div>
              <div className="flex gap-[3px] mt-3 pl-[34px]">
                {Array.from({ length: 24 }, (_, h) => (
                  <span key={h} className="flex-1 min-w-0 text-center whitespace-nowrap" style={{ fontSize: 8.5, color: "#64748B", transform: "rotate(-45deg)", transformOrigin: "center" }}>
                    {(h % 12 === 0 ? 12 : h % 12) + (h < 12 ? " AM" : " PM")}
                  </span>
                ))}
              </div>
              <div className="flex flex-col gap-1 mt-1.5">
                {Object.entries(ANA_HOT_ROWS).map(([day, cells]) => (
                  <div key={day} className="flex items-center gap-[3px]">
                    <span className="w-[31px] shrink-0 text-[10px] font-bold" style={{ color: "#64748B" }}>{day}</span>
                    {Array.from({ length: 24 }, (_, h) => {
                      const lv = cells[h] || 0;
                      const s = [11, 12, 14, 15, 17][lv];
                      return (
                        <span key={h} className="flex-1 min-w-0 flex items-center justify-center" style={{ height: 19 }}>
                          <span style={{ width: s, height: s, borderRadius: "50%", background: HOT_BG[lv] }} />
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center gap-1.5 mt-4">
                <div className="flex w-[330px] max-w-full h-[9px] rounded-[3px] overflow-hidden">
                  <span className="flex-1" style={{ background: "#1E293B" }} />
                  <span className="flex-1" style={{ background: "#3B82F6" }} />
                  <span className="flex-1" style={{ background: "#7C3AED" }} />
                </div>
                <div className="flex w-[330px] max-w-full justify-between text-[9.5px] font-semibold" style={{ color: "#64748B" }}>
                  <span>Lowest {["mentions", "reach", "interactions"][hotTab]}</span>
                  <span>Greatest {["mentions", "reach", "interactions"][hotTab]}</span>
                </div>
              </div>
            </div>
            <div className="w-[388px] shrink-0 rounded-xl p-3.5" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              <div className="text-[14.5px] font-extrabold" style={{ color: "#F8FAFC", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Emotions share</div>
              <div className="flex justify-center pt-3 pb-1">
                <svg viewBox="0 0 160 160" width="168" height="168">
                  <g transform="translate(80,80)" fill="none" strokeWidth="24">
                    <circle r="62" stroke="#1E293B"></circle>
                    <circle r="62" stroke="#D9E021" strokeDasharray="194.8 194.8" transform="rotate(-90)"></circle>
                    <circle r="62" stroke="#D9A020" strokeDasharray="192.5 197.1" transform="rotate(90)"></circle>
                    <circle r="62" stroke="#10B981" strokeDasharray="2.3 387.3" transform="rotate(-92)"></circle>
                  </g>
                </svg>
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 pt-1">
                {[["Joy", "50%", "#D9E021"], ["Anticipation", "50%", "#D9A020"], ["Trust", "0%", "#10B981"]].map(([label, v, color]) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color }} />
                    <span className="text-[10.5px] font-bold" style={{ color: "#94A3B8" }}>{label}: <span style={{ color: "#F1F5F9" }}>{v}</span></span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </>
        )}

        {/* Topic Analysis tab */}
        {tabIdx === 2 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-[11.5px]" style={{ color: "#64748B" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4.2-4.2"></path></svg>
              <span>Overview</span>
              <span aria-hidden="true" style={{ color: "#334155" }}>&ndash;</span>
              <span>Discover the most important topics and trends in your industry.</span>
            </div>
            <div className="text-[11.5px]" style={{ color: "#64748B" }}>Check your customers expectations and the key communication channels for each topic.</div>
            <div className="rounded-xl overflow-hidden" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              <div className="grid text-[10px] font-extrabold tracking-wider" style={{ gridTemplateColumns: "minmax(0,1.15fr) minmax(0,1.5fr) 92px 78px 110px 108px 140px", color: "#64748B", borderBottom: "1px solid #1E293B" }}>
                <div className="p-2.5 pr-2">TOPIC NAME</div><div className="p-2.5">DESCRIPTION</div><div className="p-2.5 text-center">MENTIONS</div>
                <div className="p-2.5 text-center">REACH &darr;</div><div className="p-2.5 text-center">SHARE OF VOICE</div><div className="p-2.5 text-center">SENTIMENT SHARE</div><div className="p-2.5"></div>
              </div>
              {TOPIC_ROWS.map((t, i) => (
                <div key={t.name} className="grid items-center" style={{ gridTemplateColumns: "minmax(0,1.15fr) minmax(0,1.5fr) 92px 78px 110px 108px 140px", borderBottom: "1px solid rgba(30,41,59,.7)", background: i % 2 === 1 ? "rgba(255,255,255,.015)" : "transparent" }}>
                  <div className="px-3 py-3.5 flex items-start gap-2 min-w-0">
                    <span className="text-[13px] leading-none shrink-0">{t.emoji}</span>
                    <span className="text-[12.5px] font-extrabold leading-snug" style={{ color: "#F1F5F9" }}>{t.name}</span>
                  </div>
                  <div className="px-3 py-3.5 text-[11px] leading-relaxed" style={{ color: "#94A3B8" }}>{t.desc}</div>
                  <div className="px-3 py-3.5 flex items-center gap-1.5 justify-center">
                    <span className="text-[15px] font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{t.mentions}</span>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2.2" strokeLinecap="round"><path d="M14 4h6v6M20 4l-8 8M18 14v6H4V6h6"></path></svg>
                  </div>
                  <div className="px-3 py-3.5 text-center text-[15px] font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{t.reach}</div>
                  <div className="px-3 py-3.5 text-center text-[15px] font-extrabold tabular-nums" style={{ color: "#F1F5F9" }}>{t.sov}</div>
                  <div className="px-3 py-3.5 flex items-center justify-center">
                    <svg viewBox="0 0 90 52" width="76" height="44" className="block">
                      <g transform="translate(45,46)" fill="none" strokeWidth="13">
                        <path d="M-32 0 A32 32 0 0 1 32 0" stroke="#1E293B"></path>
                        <path d="M-32 0 A32 32 0 0 1 26.9 -17.3" stroke="#10B981"></path>
                      </g>
                    </svg>
                  </div>
                  <div className="px-3 py-3.5 flex flex-col gap-2">
                    <button className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold cursor-pointer" style={{ border: "1px solid #1E293B", background: "#0F172A", color: "#CBD5E1" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2" strokeLinecap="round"><path d="M12 3a9 9 0 1 0 9 9h-9V3z"></path></svg>More stats
                    </button>
                    <button className="inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold cursor-pointer" style={{ border: "1px solid #1E293B", background: "#0F172A", color: "#94A3B8" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13"></path></svg>Delete topic
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Mentions tab */}
        {tabIdx === 0 && (
          <div className="flex gap-3.5 items-start">
            {/* Left column */}
            <div className="flex-1 min-w-0 flex flex-col gap-3">
              {/* Chart */}
              <div className="rounded-xl p-3.5 pb-2.5" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
                <div className="flex items-center gap-3">
                  <div className="flex gap-0.5 rounded-lg p-0.5 shrink-0" style={{ background: "#0F172A", border: "1px solid #1E293B" }}>
                    {["Penyebutan & Jangkauan", "Sentimen"].map((l, i) => (
                      <button key={l} onClick={() => setChartTab(i)} className="text-[11.5px] font-bold px-2.5 py-1.5 rounded cursor-pointer"
                        style={{ background: i === chartTab ? "rgba(37,99,235,.2)" : "transparent", color: i === chartTab ? "#93C5FD" : "#64748B" }}>{l}</button>
                    ))}
                  </div>
                  <div className="flex-1 text-center text-[11px]" style={{ color: "#475569" }}>Klik grafik untuk memfilter berdasarkan tanggal</div>
                  <div className="flex gap-0.5 rounded-lg p-0.5 shrink-0" style={{ background: "#0F172A", border: "1px solid #1E293B" }}>
                    {["Hari", "Minggu", "Bulan"].map((l, i) => (
                      <button key={l} onClick={() => setGran(i)} className="text-[11px] font-bold px-2 py-1.5 rounded cursor-pointer"
                        style={{ background: i === gran ? "rgba(37,99,235,.2)" : "transparent", color: i === gran ? "#93C5FD" : "#64748B" }}>{l}</button>
                    ))}
                  </div>
                </div>
                <svg viewBox="0 0 800 172" width="100%" height="176" className="block mt-1.5 overflow-visible">
                  <g stroke="#1E293B" strokeWidth="1">
                    <line x1="30" y1="20" x2="750" y2="20"></line>
                    <line x1="30" y1="72.5" x2="750" y2="72.5"></line>
                    <line x1="30" y1="125" x2="750" y2="125"></line>
                  </g>
                  <g fill="#475569" fontFamily="Inter, sans-serif" fontSize="9.5" textAnchor="end">
                    <text x="24" y="23">{axMax}</text><text x="24" y="76">{Math.round(axMax / 2)}</text><text x="24" y="128">0</text>
                  </g>
                  <g fill="#475569" fontFamily="Inter, sans-serif" fontSize="9.5" textAnchor="start">
                    <text x="756" y="23">{rMax} rb</text><text x="756" y="76">{Math.round(rMax / 2)} rb</text><text x="756" y="128">0</text>
                  </g>
                  <line x1={30 + peakI * 90} y1="20" x2={30 + peakI * 90} y2="125" stroke="#334155" strokeWidth="1" strokeDasharray="3 3"></line>
                  <rect x={30 + peakI * 90 - 11} y="6" width="22" height="15" rx="4" fill="#2563EB"></rect>
                  <text x={30 + peakI * 90} y="17" fill="#fff" fontFamily="Inter, sans-serif" fontSize="9.5" fontWeight="700" textAnchor="middle">{K.m[peakI]}</text>
                  {chartTab === 0 ? (
                    <>
                      <polyline points={px(K.m, axMax)} fill="none" stroke="#3B82F6" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"></polyline>
                      <polyline points={px(K.r, rMax)} fill="none" stroke="#059669" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"></polyline>
                      <circle cx={30 + peakI * 90} cy={(125 - (K.m[peakI] / axMax) * 105).toFixed(1)} r="3.4" fill="#3B82F6" stroke="#0B1220" strokeWidth="2"></circle>
                    </>
                  ) : (
                    <>
                      <polyline points={px(K.m.map(v => v * K.sent[0] / 100), axMax)} fill="none" stroke="#22C55E" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"></polyline>
                      <polyline points={px(K.m.map(v => v * K.sent[1] / 100), axMax)} fill="none" stroke="#64748B" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"></polyline>
                      <polyline points={px(K.m.map(v => v * K.sent[2] / 100), axMax)} fill="none" stroke="#DC2626" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round"></polyline>
                    </>
                  )}
                  <g fill="#64748B" fontFamily="Inter, sans-serif" fontSize="9.5" textAnchor="middle">
                    {MM_DATES.map((d, i) => <text key={d} x={30 + i * 90} y="143">{d}</text>)}
                  </g>
                </svg>
                <div className="flex items-center gap-4 px-[30px] py-0.5">
                  {(chartTab === 0
                    ? [{ label: "Penyebutan", color: "#3B82F6" }, { label: "Jangkauan", color: "#059669" }]
                    : [{ label: "Positif", color: "#22C55E" }, { label: "Netral", color: "#64748B" }, { label: "Negatif", color: "#DC2626" }]
                  ).map((lg) => (
                    <span key={lg.label} className="flex items-center gap-1.5">
                      <span className="w-3.5 h-[2.5px] rounded" style={{ background: lg.color }} />
                      <span className="text-[10.5px] font-semibold" style={{ color: "#94A3B8" }}>{lg.label}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Sort bar + top pagination */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-[11.5px] font-bold px-2.5 py-1.5 cursor-pointer rounded-lg" style={{ background: "#0B1220", border: "1px solid #1E293B", color: "#CBD5E1" }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round"><path d="M4 6h16M4 12h10M4 18h6"></path></svg>
                  Terbaru dulu
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"></path></svg>
                </div>
                <div className="flex-1" />
                <span className="text-[11px] font-bold" style={{ color: "#64748B" }}>{pageList.length} penyebutan &middot; Halaman {page + 1} dari {pageCount}</span>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: pageCount }, (_, i) => (
                    <button key={i} onClick={() => setPage(i)}
                      className="min-w-[24px] h-6 rounded flex items-center justify-center text-[11.5px] font-bold cursor-pointer"
                      style={{ background: i === page ? "rgba(37,99,235,.2)" : "transparent", color: i === page ? "#93C5FD" : "#64748B" }}>{i + 1}</button>
                  ))}
                  <button className="w-6 h-6 rounded flex items-center justify-center cursor-pointer" style={{ color: "#64748B" }}
                    onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="m9 6 6 6-6 6"></path></svg>
                  </button>
                </div>
              </div>

              {/* Mention cards */}
              {pageList.map((m, i) => (
                <div key={page + "-" + i} className="rounded-xl p-3.5" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
                  <div className="flex items-start gap-3">
                    <PlatformIcon kind={m.kind} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-bold leading-snug" style={{ color: "#F1F5F9" }}>{m.author}</div>
                      <div className="flex items-center gap-2 mt-1.5 text-[10.5px] flex-wrap" style={{ color: "#64748B" }}>
                        <span className="font-semibold" style={{ color: "#93C5FD" }}>{m.source}</span>
                        {m.meta && <><span style={{ color: "#334155" }}>|</span><span>{m.meta}</span></>}
                        <span style={{ color: "#334155" }}>|</span>
                        <span className="inline-flex items-center gap-1">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M8 3v4M16 3v4M3 11h18"></path></svg>
                          {m.date}
                        </span>
                        {m.visited && (
                          <span className="inline-flex items-center gap-1 text-[9.5px] font-bold rounded px-1.5 py-0.5" style={{ color: "#4ADE80", background: "rgba(34,197,94,.1)" }}>
                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round"><path d="m5 13 4 4L19 7"></path></svg>
                            Sudah dikunjungi
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5 rounded-lg px-2 py-1 cursor-pointer"
                      style={{ background: m.sentColor === "#4ADE80" ? "rgba(34,197,94,.12)" : m.sentColor === "#F87171" ? "rgba(220,38,38,.12)" : "rgba(148,163,184,.1)", border: `1px solid ${m.sentColor === "#4ADE80" ? "rgba(34,197,94,.4)" : m.sentColor === "#F87171" ? "rgba(220,38,38,.4)" : "rgba(148,163,184,.3)"}` }}>
                      <span className="text-[11px] font-bold" style={{ color: m.sentColor }}>{m.sent}</span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" style={{ color: m.sentColor }}><path d="m6 9 6 6 6-6"></path></svg>
                    </div>
                  </div>
                  <div className="text-xs leading-relaxed mt-2.5 text-left" style={{ color: "#CBD5E1" }}>{m.body}</div>
                  <div className="flex items-center gap-4 mt-3 pt-2.5 border-t" style={{ borderColor: "#1E293B" }}>
                    {ACTIONS.map((a) => (
                      <span key={a.label} className="flex items-center gap-1.5 text-[11px] font-semibold cursor-pointer" style={{ color: "#64748B" }}>
                        <svg width="12.5" height="12.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={a.icon}></path></svg>
                        {a.label}
                      </span>
                    ))}
                    <div className="flex-1" />
                    <span className="w-3.5 h-3.5 rounded cursor-pointer shrink-0" style={{ border: "1.5px solid #334155" }} />
                  </div>
                </div>
              ))}

              {/* Bottom pagination */}
              <div className="flex items-center justify-end gap-0.5 pt-0.5">
                {Array.from({ length: pageCount }, (_, i) => (
                  <button key={i} onClick={() => setPage(i)}
                    className="min-w-[24px] h-6 rounded flex items-center justify-center text-[11.5px] font-bold cursor-pointer"
                    style={{ background: i === page ? "rgba(37,99,235,.2)" : "transparent", color: i === page ? "#93C5FD" : "#64748B" }}>{i + 1}</button>
                ))}
                <button className="w-6 h-6 rounded flex items-center justify-center cursor-pointer" style={{ color: "#64748B" }}
                  onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="m9 6 6 6-6 6"></path></svg>
                </button>
              </div>
            </div>

            {/* Right sidebar: Sumber + Sentimen filters */}
            <div className="w-[318px] shrink-0 rounded-xl p-3.5 flex flex-col gap-3.5" style={{ background: "#0B1220", border: "1px solid #1E293B" }}>
              {/* Date range */}
              <div className="flex items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer" style={{ background: "#0F172A", border: "1px solid #1E293B" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#60A5FA" strokeWidth="2"><rect x="3" y="5" width="18" height="16" rx="2"></rect><path d="M8 3v4M16 3v4M3 11h18"></path></svg>
                <span className="flex-1 text-[11.5px] font-bold tabular-nums" style={{ color: "#F1F5F9" }}>2026-08-26 &ndash; 2026-09-03</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round"><path d="m6 9 6 6 6-6"></path></svg>
              </div>

              {/* AI buttons */}
              <div className="flex gap-2">
                <div className="flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 cursor-pointer" style={{ border: "1px solid rgba(37,99,235,.45)" }}>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#60A5FA"><path d="M12 2l1.9 5.6L19.5 9l-5.6 1.4L12 16l-1.9-5.6L4.5 9l5.6-1.4z"></path></svg>
                  <span className="text-[11px] font-bold" style={{ color: "#93C5FD" }}>Ringkas dengan AI</span>
                </div>
                <div className="flex-1 flex items-center justify-center rounded-lg py-2 cursor-pointer" style={{ background: "#1D4ED8" }}>
                  <span className="text-[11px] font-extrabold text-white">Buat Laporan</span>
                </div>
              </div>

              {/* Sumber */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[11.5px] font-extrabold" style={{ color: "#F1F5F9" }}>Sumber</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8v.01"></path></svg>
                  <span className="ml-auto text-[10.5px] font-bold cursor-pointer" style={{ color: "#60A5FA" }}>Tampilkan semua (109)</span>
                </div>
                <div className="grid grid-cols-2 gap-x-2.5 gap-y-2">
                  {MM_SOURCES.map((s) => (
                    <SourceCheckbox key={s.label} label={s.label} mono={s.mono} count={s.count} selected={!!srcSel[s.label]}
                      onToggle={() => setSrcSel((prev) => ({ ...prev, [s.label]: !prev[s.label] }))} />
                  ))}
                </div>
              </div>

              {/* Sentimen */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-[11.5px] font-extrabold" style={{ color: "#F1F5F9" }}>Sentimen</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2"><circle cx="12" cy="12" r="9"></circle><path d="M12 11v5M12 8v.01"></path></svg>
                </div>
                <div className="flex items-center gap-3.5">
                  {[["Negatif", "#F87171"], ["Netral", "#94A3B8"], ["Positif", "#4ADE80"]].map(([label, color]) => (
                    <SourceCheckbox key={label} label={label} mono="" count="" selected={!!sentSel[label as string]} hideMono color={color as string}
                      onToggle={() => setSentSel((prev) => ({ ...prev, [label as string]: !prev[label as string] }))} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
