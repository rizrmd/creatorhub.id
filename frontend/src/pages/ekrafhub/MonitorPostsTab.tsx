import { useEffect, useRef, useState } from "react";

const CARD_BG = "linear-gradient(158deg, #16202f 0%, #101825 55%, #0e1521 100%)";
const CELL_BG = "#0d141f";
const MUTED = "#7f8da2";
const SOFT = "#a9b6c8";
const ORANGE = "#f26522";
const ORANGE_LIGHT = "#ff8b4d";

type Stats = { views: string; likes: string; shares: string; repost: string; comments: string };

type Post = {
  id: number;
  caption: string;
  meta: string;
  thumbnail?: string;
  postType?: string;
  link?: string;
  er?: { value: string; color: string };
  stats: Stats;
  commentsCount: string;
};

type CommentBase = {
  user: string;
  text: string;
  text2?: string;
  hashtags?: string;
  time: string;
  likes?: string;
  avatar?: string;
  pinkRing?: boolean;
};

type Reply = CommentBase;
type TopComment = CommentBase & { replies?: Reply[] };

const POSTS: Post[] = [
  {
    id: 1,
    caption: "pov : punya temen , beda selera humor😭",
    meta: "Data updated on Aug 25, 2026 | 09:12",
    thumbnail: "/monitor/post-pov-temen.jpg",
    postType: "Reels",
    link: "https://www.instagram.com/p/DTo5kHOEc51/",
    stats: { views: "4.4M", likes: "215K", shares: "28.2K", repost: "6,545", comments: "371" },
    commentsCount: "371",
  },
  {
    id: 2,
    caption: "Pov : kesempatan dalam Kesempitan😍",
    meta: "Main Grid · 18w · ID 17f22b90",
    thumbnail: "/monitor/post-kesempatan.jpg",
    postType: "Main Grid",
    link: "https://www.instagram.com/",
    er: { value: "ER 6.1%", color: "#3fd07f" },
    stats: { views: "3.5M", likes: "208K", shares: "10.6K", repost: "3,020", comments: "468" },
    commentsCount: "468",
  },
  {
    id: 3,
    caption: "5 kedai kopi Banda Aceh buat kerja seharian",
    meta: "Carousel · 9w · ID 17c81de4",
    er: { value: "ER 3.2%", color: "#e0b74a" },
    stats: { views: "2.1M", likes: "92.4K", shares: "4.6K", repost: "8.9K", comments: "1.1K" },
    commentsCount: "1.1K",
  },
];

const SENTIMENT_SEED =
  "Sentimen mayoritas komentator sangat positif (±92%), emosi dominan lucu dan kagum. Kata kunci '#lucu', '#ngakak' dan 'kejang' paling sering muncul, menandakan respons hangat. Interaksi tinggi: 371 komentar, 22 balasan, keterlibatan audiens kuat pada konten ini.";

const REPLIES: Reply[] = [
  { user: "llyaaww__", text: "@your.neighbour90", text2: "😭😭", time: "30w", likes: "7 likes", avatar: "/monitor/av-llyaaww.png" },
  { user: "enyyna.km", text: "@your.neighbour90 @xyz.sayy @syisyisyifaa_", text2: "😭😭", time: "30w", likes: "3 likes", avatar: "/monitor/av-enyyna.png" },
  { user: "birlycantikaa", text: "@your.neighbour90 @cnttgrce", text2: "😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭😭", time: "29w", likes: "2 likes", avatar: "/monitor/av-birlycantikaa.png" },
  { user: "justcallniss", text: "@your.neighbour90 @cyhningrum, @camnit_, @n4nudu0t", text2: "😭😭😭", time: "29w", likes: "1 like", avatar: "/monitor/av-justcallniss.png" },
  { user: "rsm_alwyh", text: "@your.neighbour90 @rayyayw @dess_fraa", time: "26w", likes: "1 like", avatar: "/monitor/av-rsm_alwyh.png" },
  { user: "dess_fraa", text: "@rsm_alwyh", text2: "😭😭😭😭", time: "26w", avatar: "/monitor/av-dess_fraa.png" },
  { user: "syfarhmaptri", text: "@your.neighbours90", text2: "😭😭😭😭", time: "26w" },
  { user: "taavv___", text: "@your.neighbours90", text2: "😭😭😭😭😭", time: "26w" },
  { user: "dirarizky__", text: "@your.neighbours90", text2: "😭😭", time: "24w" },
  { user: "kiaaaptr._", text: "@your.neighbours90", text2: "NGAKAK😭", time: "24w" },
  { user: "_safza", text: "@your.neighbours90 @nasaaaaa_03", text2: "bisi ek join hadroh tuh😭😭😭", time: "24w" },
  { user: "nnsasrll", text: "@nnnadiiiie", text2: "😭😭😭", time: "24w" },
  { user: "naddiva__", text: "@nnsasrll", text2: "😭", time: "24w" },
  { user: "tmmatee", text: "@your.neighbours90", text2: "😭😭😭", time: "23w" },
  { user: "4izu.zu_", text: "@bwgmerahbwgputih", time: "23w" },
];

const COMMENTS: TopComment[] = [
  {
    user: "itsbanuun",
    text: "sumpah lucu kali , lucu kali dia 🙏🏻🙏🏻🙏🏻",
    hashtags: "#fyp #newreels #lucu #ngakak #memesdaily",
    time: "31w",
    avatar: "/monitor/av-itsbanuun.png",
    replies: REPLIES,
  },
  {
    user: "linardyhan",
    text: "sumpah lucu kali , lucu kali dia 🙏🏻🙏🏻🙏🏻",
    time: "31w",
    likes: "19,501 likes",
    avatar: "/monitor/av-linardyhan.png",
  },
  { user: "pahri_slebewww", text: "konsepnya main Hadroh dadakan ya", time: "31w", likes: "7,054 likes", avatar: "/monitor/av-pahri.png" },
  { user: "rechika_meylani", text: "uget-uget semua 😭", time: "30w", likes: "2,469 likes", avatar: "/monitor/av-rechika.png", pinkRing: true },
  { user: "novembriyana", text: "ini bukan ketawa nama nya tapi kejang² 😂😂", time: "30w", likes: "741 likes", avatar: "/monitor/av-novembriyana.png" },
  { user: "_wvrlly", text: "kenapa ga ketawa? belum gajian ya? 😭", time: "25w", likes: "105 likes", avatar: "/monitor/av-wvrlly.png" },
  { user: "ki_d1k1ter22", text: "😭", time: "31w", likes: "16 likes", avatar: "/monitor/av-kid1k1ter22.png" },
];

function crawlIn(el: HTMLDivElement | null, step: number, stagger: number, yd: number) {
  if (!el) return;
  const kids = Array.from(el.children);
  kids.forEach((k) => {
    (k as HTMLElement).style.opacity = "0";
    (k as HTMLElement).style.transform = `translateY(${yd}px)`;
    (k as HTMLElement).style.transition = "opacity .3s ease, transform .3s ease";
  });
  kids.forEach((k, i) => {
    window.setTimeout(() => {
      (k as HTMLElement).style.opacity = "1";
      (k as HTMLElement).style.transform = "none";
    }, step + i * stagger);
  });
}

function PinBadge() {
  return (
    <span className="absolute top-[7px] right-[7px] w-5 h-5 rounded-full flex items-center justify-center" style={{ background: "rgba(0,0,0,0.6)" }}>
      <svg viewBox="0 0 24 24" width="11" height="11" fill="currentColor" style={{ color: "#fff" }}>
        <path d="M15.2 2.2a1.6 1.6 0 0 1 2.3 0l4.3 4.3a1.6 1.6 0 0 1 0 2.3l-1.1 1.1-1.9-.5-4.1 4.1.6 2.3a1.4 1.4 0 0 1-.4 1.4l-1.3 1.3a1.1 1.1 0 0 1-1.6 0l-3-3-4.7 4.7a.9.9 0 0 1-1.3-1.3l4.7-4.7-3-3a1.1 1.1 0 0 1 0-1.6l1.3-1.3a1.4 1.4 0 0 1 1.4-.4l2.3.6 4.1-4.1-.5-1.9 1.1-1.1z" />
      </svg>
    </span>
  );
}

function Thumb({ post }: { post: Post }) {
  if (post.thumbnail) {
    return (
      <div className="relative w-24 h-[132px] shrink-0 rounded-[11px] overflow-hidden" style={{ background: "#151d29" }}>
        <img src={post.thumbnail} alt={post.caption} className="w-full h-full object-cover" />
        <PinBadge />
      </div>
    );
  }
  return (
    <div
      className="relative w-24 h-[132px] shrink-0 rounded-[11px] overflow-hidden flex items-end justify-center"
      style={{ background: "repeating-linear-gradient(135deg,#1b2432 0 7px,#151d29 7px 14px)" }}
    >
      <PinBadge />
      <span className="text-[10px] leading-[1] text-center pb-2" style={{ fontFamily: "ui-monospace,Menlo,monospace", color: "#6d7c92" }}>
        thumbnail
        <br />
        carousel
      </span>
    </div>
  );
}

function StatCell({ label, value, isComments, active, onClick }: {
  label: string;
  value: string;
  isComments: boolean;
  active: boolean;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <div
      onClick={onClick}
      className="relative px-0.5 py-2.5 min-w-0 text-center cursor-pointer"
      style={{
        background: isComments && active ? "#13202e" : CELL_BG,
        boxShadow: isComments && active ? "inset 0 0 0 1px rgba(242,101,34,0.35)" : undefined,
        borderRadius: isComments ? "0 11px 11px 0" : undefined,
      }}
    >
      <div className="text-[8.5px] font-bold tracking-[.2px] text-center" style={{ color: isComments && active ? "#ffb079" : MUTED }}>
        {label}
      </div>
      <div className="flex items-center justify-center mt-[3px]">
        <span className="text-[14.5px] font-extrabold whitespace-nowrap" style={{ color: "#fff" }}>
          {value}
        </span>
        {isComments && active && (
          <span className="absolute -right-2 bottom-2 flex items-center justify-center" style={{ width: 12, height: 26, borderRadius: "0 4px 4px 0", background: "rgba(242,101,34,0.85)", color: "#fff" }}>
            <svg viewBox="0 0 12 40" width="7" height="20" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3.5,4 8.5,20 3.5,36" />
            </svg>
          </span>
        )}
      </div>
    </div>
  );
}

function PostCard({ post, active, sentimentReady, analysis, onSelect, onToggleComments, onToggleAnalyze }: {
  post: Post;
  active: boolean;
  sentimentReady: boolean;
  analysis: boolean;
  onSelect: () => void;
  onToggleComments: () => void;
  onToggleAnalyze: () => void;
}) {
  const chipBase =
    "inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-[12px] font-semibold whitespace-nowrap transition-colors";
  return (
    <div
      onClick={onSelect}
      className="relative rounded-2xl p-[14px] flex gap-3.5 cursor-pointer transition-all"
      style={{
        background: CARD_BG,
        border: "1px solid",
        borderColor: active ? "rgba(242,101,34,0.5)" : "rgba(255,255,255,0.06)",
        boxShadow: active
          ? "0 24px 48px -24px rgba(0,0,0,0.95), 0 0 0 1px rgba(242,101,34,0.22), 0 0 34px -12px rgba(242,101,34,0.45)"
          : "0 14px 30px -22px rgba(0,0,0,0.9)",
      }}
    >
      {active && (
        <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-r-[3px]" style={{ background: "linear-gradient(#ff9a3c,#f26522)" }} />
      )}
      <Thumb post={post} />
      <div className="flex-1 min-w-0 flex flex-col gap-3">
        <div className="flex items-start gap-2.5">
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-bold leading-[1.35]" style={{ color: "#e8edf5" }}>
              {post.caption}
            </div>
            <div className="text-[11.5px] mt-1" style={{ color: MUTED }}>
              {post.meta}
            </div>
          </div>
          {(sentimentReady || analysis) && (
            <button
              onClick={(e) => { e.stopPropagation(); onToggleAnalyze(); }}
              className="shrink-0 inline-flex items-center gap-[5px] px-2.5 py-[5px] rounded-full text-[11px] font-bold whitespace-nowrap transition-colors hover:bg-orange-500/15"
              style={{ border: "1px solid rgba(242,101,34,0.4)", color: ORANGE_LIGHT }}
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M8.5 14.5a4.5 4.5 0 0 0 7 0M9 9.5h.01M15 9.5h.01" />
              </svg>
              Analyze
            </button>
          )}
          {post.er && (
            <span className="shrink-0 text-[11px] font-bold px-[9px] py-1 rounded-full whitespace-nowrap"
              style={{ color: post.er.color, background: `${post.er.color}1f` }}>
              {post.er.value}
            </span>
          )}
        </div>
        <div className="grid grid-cols-5 gap-px rounded-[11px] overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
          <StatCell label="VIEWS" value={post.stats.views} isComments={false} active={active} />
          <StatCell label="LIKES" value={post.stats.likes} isComments={false} active={active} />
          <StatCell label="SHARES" value={post.stats.shares} isComments={false} active={active} />
          <StatCell label="REPOST" value={post.stats.repost} isComments={false} active={active} />
          <StatCell label="COMMENTS" value={post.stats.comments} isComments active={active} onClick={(e) => { e.stopPropagation(); onToggleComments(); }} />
        </div>
        {post.postType && post.link && (
          <div className="flex flex-wrap gap-2">
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-[11px] py-2 rounded-[9px] text-[12px] font-bold whitespace-nowrap"
              style={{ background: "rgba(242,101,34,0.16)", color: ORANGE_LIGHT }}
            >
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4v16" />
                <path d="M9 5.4a.6.6 0 0 1 .93-.5l9.1 6.1a.6.6 0 0 1 0 1l-9.1 6.1a.6.6 0 0 1-.93-.5V5.4z" fill="currentColor" stroke="none" />
              </svg>
              {post.postType}
            </a>
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`${chipBase} hover:brightness-125`}
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: SOFT }}
            >
              View Post
            </a>
            <button onClick={(e) => e.stopPropagation()} className={`${chipBase} hover:text-[#e8edf5] hover:border-white/25`}
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: SOFT }}>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 11a8 8 0 1 0-2.3 5.7" />
                <path d="M20 4v7h-7" />
              </svg>
              Update
            </button>
            <button onClick={(e) => e.stopPropagation()} className={`${chipBase} hover:text-[#e8edf5] hover:border-white/25`}
              style={{ border: "1px solid rgba(255,255,255,0.1)", color: SOFT }}>
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M4 20V11M10 20V5M16 20v-6M22 20H2" />
              </svg>
              Insight
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function CommentRow({ c, size }: { c: TopComment | Reply; size?: "lg" | "sm" }) {
  const isLg = size === "lg";
  const avatarSize = isLg ? "w-[38px] h-[38px]" : "w-8 h-8";
  return (
    <div className="flex gap-3">
      <div className={`${avatarSize} shrink-0 rounded-full overflow-hidden flex-none flex items-center justify-center`} style={{ background: "#1b2432", ...(c.pinkRing ? { boxShadow: "0 0 0 2px #0c131e,0 0 0 3.5px #e1306c" } : {}) }}>
        {c.avatar ? (
          <img src={c.avatar} alt={c.user} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full" style={{ background: "linear-gradient(140deg,#2b3648,#161d29)" }} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="leading-[1.45]" style={{ fontSize: isLg ? 13 : 12.5, color: "#e8edf5" }}>
          <span className="font-semibold">{c.user}</span>{" "}
          {c.text}
          {c.text2 && <span style={{ color: "#6ea8ff" }}> {c.text2}</span>}
        </div>
        {c.hashtags && (
          <div className="leading-[1.45] mt-[3px]" style={{ fontSize: 13, color: "#6ea8ff" }}>
            {c.hashtags}
          </div>
        )}
        <div className="flex gap-3.5 mt-1.5 leading-none" style={{ fontSize: isLg ? 12 : 11.5, color: "#8a97ab" }}>
          <span>{c.time}</span>
          {c.likes && <span>{c.likes}</span>}
        </div>
      </div>
    </div>
  );
}

const SENTIMENT_SEGS = [
  { label: "Positif", pct: "70%", grad: "linear-gradient(90deg, #4ade80, #15803d)", glow: "0 0 16px rgba(74,222,128,0.45)" },
  { label: "Netral", pct: "29%", grad: "linear-gradient(90deg, #f8fafc, #b6c2d2)", glow: "0 0 12px rgba(226,232,240,0.35)" },
  { label: "Negatif", pct: "1%", grad: "linear-gradient(90deg, #f87171, #b91c1c)", glow: "0 0 16px rgba(248,113,113,0.45)" },
];

function SentimentBars() {
  const [widths, setWidths] = useState(["0%", "0%", "0%"]);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setWidths((w) => ["70%", w[1], w[2]]), 60),
      window.setTimeout(() => setWidths((w) => [w[0], "29%", w[2]]), 280),
      window.setTimeout(() => setWidths((w) => [w[0], w[1], "1%"]), 500),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <div className="mt-4 rounded-[12px] p-4" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#3fd07f" }} />
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.55)" }}>
            Sentiment Distribution
          </p>
        </div>
        <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>
          dari 371 komentar
        </span>
      </div>

      <div className="relative h-4 rounded-full flex overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", boxShadow: "0 0 20px rgba(74,222,128,0.12), inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
        {SENTIMENT_SEGS.map((s, i) => (
          <div
            key={s.label}
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: widths[i],
              minWidth: widths[i] !== "0%" ? "7px" : undefined,
              background: s.grad,
              boxShadow: s.glow,
              borderRadius: i === 0 ? "9999px 0 0 9999px" : undefined,
            }}
          />
        ))}
      </div>

      <div className="flex items-center flex-wrap gap-x-5 gap-y-2 mt-3">
        {SENTIMENT_SEGS.map((s) => (
          <div key={s.label} className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-[4px] shrink-0" style={{ background: s.grad, boxShadow: s.glow, opacity: widths[SENTIMENT_SEGS.indexOf(s)] === "0%" ? 0.35 : 1 }} />
            <span className="text-[12px]" style={{ color: "rgba(255,255,255,0.7)" }}>{s.label}</span>
            <span className="text-[12px] font-extrabold" style={{ color: "#e8edf5", fontVariantNumeric: "tabular-nums" }}>{s.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const AUDIENCE_SEED =
  "Audience analysis: 30% akun real high quality (verified, pengikut >200), 65% medium quality (pengikut <200, postingan terbatas), 2% low quality (postingan <3, stalker/buzzer), dan 3% suspected bots yang tidak mengganggu. Kualitas interaksi audiens tergolong sehat.";

const AUD_SEGS = [
  { label: "Real — High Quality", desc: "verified, pengikut >200", pct: "30%", grad: "linear-gradient(90deg, #4ade80, #15803d)", glow: "0 0 16px rgba(74,222,128,0.45)", color: "#4ade80" },
  { label: "Real — Medium Quality", desc: "pengikut <200, beberapa postingan", pct: "65%", grad: "linear-gradient(90deg, #38bdf8, #0369a1)", glow: "0 0 14px rgba(56,189,248,0.4)", color: "#38bdf8" },
  { label: "Real — Low Quality", desc: "postingan <3, stalker/buzzer", pct: "2%", grad: "linear-gradient(90deg, #fbbf24, #b45309)", glow: "0 0 14px rgba(251,191,36,0.4)", color: "#fbbf24" },
  { label: "Suspected Bots", desc: "tanpa postingan nyata, spam like/comment", pct: "3%", grad: "linear-gradient(90deg, #f87171, #b91c1c)", glow: "0 0 16px rgba(248,113,113,0.5)", color: "#f87171" },
];

function AudienceBars() {
  const [widths, setWidths] = useState(["0%", "0%", "0%", "0%"]);

  useEffect(() => {
    const timers = [
      window.setTimeout(() => setWidths((w) => ["30%", w[1], w[2], w[3]]), 60),
      window.setTimeout(() => setWidths((w) => [w[0], "65%", w[2], w[3]]), 280),
      window.setTimeout(() => setWidths((w) => [w[0], w[1], "2%", w[3]]), 500),
      window.setTimeout(() => setWidths((w) => [w[0], w[1], w[2], "3%"]), 720),
    ];
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <div className="mt-4 rounded-[12px] p-4" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "#38bdf8" }} />
          <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.55)" }}>
            Audience Quality Distribution
          </p>
        </div>
        <span className="text-[10px] font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>
          dari 371 komentator
        </span>
      </div>

      <div className="relative h-4 rounded-full flex overflow-hidden" style={{ background: "rgba(255,255,255,0.06)", boxShadow: "0 0 20px rgba(56,189,248,0.12), inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
        {AUD_SEGS.map((s, i) => (
          <div
            key={s.label}
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: widths[i],
              minWidth: widths[i] !== "0%" ? "7px" : undefined,
              background: s.grad,
              boxShadow: s.glow,
              borderRadius: i === 0 ? "9999px 0 0 9999px" : undefined,
            }}
          />
        ))}
      </div>

      <div className="flex flex-col gap-2.5 mt-3">
        {AUD_SEGS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-[4px] shrink-0" style={{ background: s.grad, boxShadow: s.glow, opacity: widths[i] === "0%" ? 0.35 : 1 }} />
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-semibold leading-tight" style={{ color: s.label === "Suspected Bots" ? s.color : "rgba(255,255,255,0.85)" }}>
                {s.label}
              </p>
              <p className="text-[10.5px] leading-tight" style={{ color: "rgba(255,255,255,0.45)" }}>
                {s.desc}
              </p>
            </div>
            <span className="text-[12px] font-extrabold shrink-0" style={{ color: "#e8edf5", fontVariantNumeric: "tabular-nums" }}>{s.pct}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MonitorPostsTab() {
  const [active, setActive] = useState(1);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [rLoading, setRLoading] = useState(false);
  const [rProgress, setRProgress] = useState(0);
  const [rFetched, setRFetched] = useState(false);
  const [analysis, setAnalysis] = useState(false);
  const [typed, setTyped] = useState("");
  const [analysisTab, setAnalysisTab] = useState<"sentiments" | "audience" | "sna">("sentiments");
  const [audState, setAudState] = useState<"idle" | "loading" | "done">("idle");
  const [audProgress, setAudProgress] = useState(0);
  const [audTyped, setAudTyped] = useState("");

  useEffect(() => {
    if (!analysis) {
      setTyped("");
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setTyped(SENTIMENT_SEED.slice(0, i));
      if (i >= SENTIMENT_SEED.length) window.clearInterval(id);
    }, 14);
    return () => window.clearInterval(id);
  }, [analysis]);

  const audIvRef = useRef<number | null>(null);

  const openAudience = () => {
    if (analysisTab === "audience") return;
    setAnalysisTab("audience");
    if (audState === "done") return;
    if (audState === "loading") return;
    setAudState("loading");
    setAudProgress(1);
    if (audIvRef.current) window.clearInterval(audIvRef.current);
    audIvRef.current = window.setInterval(() => {
      setAudProgress((p) => (p >= 100 ? 100 : p + 2 + Math.ceil(Math.random() * 6)));
    }, 150);
  };

  useEffect(() => {
    if (audState !== "loading" || audProgress < 100) return;
    if (audIvRef.current) window.clearInterval(audIvRef.current);
    tRef.current = window.setTimeout(() => {
      setAudState("done");
      setAudProgress(0);
    }, 450);
  }, [audState, audProgress]);

  useEffect(() => {
    if (!analysis || analysisTab !== "audience" || audState !== "done") {
      if (analysisTab !== "audience") setAudTyped("");
      return;
    }
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setAudTyped(AUDIENCE_SEED.slice(0, i));
      if (i >= AUDIENCE_SEED.length) window.clearInterval(id);
    }, 14);
    return () => window.clearInterval(id);
  }, [analysis, analysisTab, audState]);

  useEffect(() => {
    return () => {
      if (audIvRef.current) window.clearInterval(audIvRef.current);
    };
  }, []);

  const listRef = useRef<HTMLDivElement>(null);
  const repliesRef = useRef<HTMLDivElement>(null);
  const prevComments = useRef(false);
  const prevReplies = useRef(false);
  const ivRef = useRef<number | null>(null);
  const tRef = useRef<number | null>(null);

  useEffect(() => {
    if (showComments && !prevComments.current) {
      requestAnimationFrame(() => crawlIn(listRef.current, 90, 620, 10));
    }
    prevComments.current = showComments;
  }, [showComments]);

  useEffect(() => {
    if (showReplies && !prevReplies.current) {
      requestAnimationFrame(() => crawlIn(repliesRef.current, 60, 220, 8));
    }
    prevReplies.current = showReplies;
  }, [showReplies]);

  useEffect(() => {
    return () => {
      if (ivRef.current) window.clearInterval(ivRef.current);
      if (tRef.current) window.clearTimeout(tRef.current);
    };
  }, []);

  const post = POSTS.find((p) => p.id === active) ?? POSTS[0];

  const select = (n: number) => {
    if (active === n) return;
    if (ivRef.current) window.clearInterval(ivRef.current);
    if (tRef.current) window.clearTimeout(tRef.current);
    setActive(n);
    setShowComments(false);
    setLoading(false);
    setProgress(0);
    setClosing(false);
    setShowReplies(false);
    setRLoading(false);
  };

  const toggleComments = () => {
    if (showComments || loading || closing) return;
    if (fetched) {
      setShowComments(true);
      return;
    }
    setLoading(true);
    setProgress(10);
    setFetched(true);
    if (ivRef.current) window.clearInterval(ivRef.current);
    ivRef.current = window.setInterval(() => {
      setProgress((p) => {
        const np = (p || 10) + Math.ceil(Math.random() * 7) + 3;
        return np;
      });
    }, 130);
  };

  useEffect(() => {
    if (loading && progress >= 100) {
      if (ivRef.current) window.clearInterval(ivRef.current);
      tRef.current = window.setTimeout(() => {
        setLoading(false);
        setShowComments(true);
        setProgress(0);
      }, 420);
    }
  }, [loading, progress]);

  const rollDown = () => {
    if (closing) return;
    if (!showComments) {
      setShowComments(true);
      return;
    }
    setClosing(true);
    tRef.current = window.setTimeout(() => {
      setClosing(false);
      setShowComments(false);
    }, 900);
  };

  const toggleReplies = () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }
    if (rLoading) return;
    if (rFetched) {
      setShowReplies(true);
      return;
    }
    setRLoading(true);
    setRProgress(12);
    setRFetched(true);
    if (ivRef.current) window.clearInterval(ivRef.current);
    ivRef.current = window.setInterval(() => {
      setRProgress((p) => (p || 12) + Math.ceil(Math.random() * 8) + 4);
    }, 120);
  };

  useEffect(() => {
    if (rLoading && rProgress >= 100) {
      if (ivRef.current) window.clearInterval(ivRef.current);
      tRef.current = window.setTimeout(() => {
        setRLoading(false);
        setShowReplies(true);
        setRProgress(0);
      }, 380);
    }
  }, [rLoading, rProgress]);

  const sentimentReady = showComments && !loading && !closing && active === 1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] gap-[22px] items-start">
      {/* LEFT: Pinned Posts */}
      <div className="flex flex-col gap-3.5">
        <div className="flex items-center gap-2.5" style={{ height: 26 }}>
          <div className="w-[3px] h-[17px] rounded-[2px]" style={{ background: ORANGE }} />
          <h2 className="text-[17px] font-bold" style={{ color: "#e8edf5" }}>Pinned Posts</h2>
          <span className="text-[11.5px] font-bold px-2.5 py-1 rounded-full" style={{ color: ORANGE_LIGHT, background: "rgba(242,101,34,0.13)" }}>
            3 disematkan
          </span>
        </div>

        {POSTS.map((p) => (
          <PostCard
            key={p.id}
            post={p}
            active={active === p.id}
            sentimentReady={sentimentReady && p.id === 1}
            analysis={analysis && p.id === 1}
            onSelect={() => select(p.id)}
            onToggleComments={toggleComments}
            onToggleAnalyze={() => setAnalysis((a) => !a)}
          />
        ))}

        <div
          className="flex items-center justify-center gap-2 py-3 rounded-[14px] text-[12.5px] font-semibold cursor-pointer transition-colors hover:text-[#e8edf5]"
          style={{ border: "1px dashed rgba(255,255,255,0.14)", color: "#8a97ab" }}
        >
          View 21 more posts
        </div>
      </div>

      {/* RIGHT: Comments */}
      <div className="flex flex-col gap-3.5 min-w-0">
        {showComments ? (
          <div className="flex items-center gap-2.5" style={{ height: 26 }}>
            <h2 className="text-[17px] font-bold" style={{ color: "#e8edf5" }}>Comments</h2>
            <span className="text-[11.5px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap" style={{ color: ORANGE_LIGHT, background: "rgba(242,101,34,0.13)" }}>
              {post.commentsCount} komentar
            </span>
          </div>
        ) : (
          <div style={{ height: 26 }}>
            <button
              className="ml-auto flex items-center gap-1.5 h-[26px] px-3.5 rounded-[9px] text-[12px] font-bold cursor-pointer transition-colors hover:bg-[rgba(242,101,34,0.28)] hover:text-[#ffb079]"
              style={{ background: "rgba(242,101,34,0.16)", color: ORANGE_LIGHT }}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 11a8 8 0 1 0-2.3 5.7" />
                <path d="M20 4v7h-7" />
              </svg>
              Update All Posts
            </button>
          </div>
        )}

        {loading && (
          <div className="flex flex-col gap-[9px] px-[18px] py-4 rounded-[14px]" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#0f1621" }}>
            <div className="flex items-center gap-2.5">
              <span className="text-[12px] font-bold" style={{ color: "#c6d0dd" }}>Fetching comments</span>
              <span className="ml-auto text-[12px] font-extrabold" style={{ color: ORANGE_LIGHT, fontVariantNumeric: "tabular-nums" }}>
                {progress}%
              </span>
            </div>
            <div className="h-[6px] rounded-[6px] overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
              <div className="h-full rounded-[6px] transition-all duration-200 ease-linear" style={{ width: `${progress}%`, background: ORANGE }} />
            </div>
          </div>
        )}

        {showComments && (
          <div
            className="relative rounded-2xl p-5 transition-all"
            style={{
              background: CARD_BG,
              border: "1px solid rgba(242,101,34,0.5)",
              boxShadow: "0 24px 48px -24px rgba(0,0,0,0.95), 0 0 0 1px rgba(242,101,34,0.22), 0 0 34px -12px rgba(242,101,34,0.45)",
            }}
          >
            <div className="absolute left-0 top-5 bottom-5 w-[3px] rounded-r-[3px]" style={{ background: "linear-gradient(#ff9a3c,#f26522)" }} />
            <div
              className="absolute right-0 top-0 bottom-0 rounded-2xl z-[5] pointer-events-none"
              style={{
                width: closing ? "100%" : "0%",
                overflow: "hidden",
                background: "#0a0f17",
                boxShadow: "-16px 0 28px -14px rgba(0,0,0,0.85)",
                transition: "width .85s cubic-bezier(.55,.06,.68,.99)",
              }}
            />
            <div
              onClick={rollDown}
              title="Close comments"
              className="absolute z-[6] flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:text-[#ff8b4d] hover:border-orange-500/60"
              style={{
                top: "50%",
                right: -11,
                transform: "translateY(-50%)",
                width: 22,
                height: 72,
                borderRadius: 11,
                background: "#18232f",
                border: "1px solid rgba(255,255,255,0.13)",
                boxShadow: "0 20px 34px -14px rgba(0,0,0,0.95),0 4px 10px -4px rgba(0,0,0,0.7),inset 0 1px 0 rgba(255,255,255,0.1)",
                color: "#b3c0d1",
              }}
            >
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3.6" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15,5 8,12 15,19" />
              </svg>
              <span className="w-[3px] h-[18px] rounded-[3px]" style={{ background: "linear-gradient(#ff9a3c,#f26522)" }} />
            </div>

            <div
              className="rounded-[12px] px-5 pt-[18px] pb-5"
              style={{ background: "#0c131e", boxShadow: "0 10px 26px -16px rgba(0,0,0,0.9),inset 0 0 0 1px rgba(255,255,255,0.06)" }}
            >
              {analysis && (
                <>
                  <div className="flex gap-1 p-1 mb-4 rounded-[12px]" style={{ background: "#111a26", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
                    {[
                      { key: "sentiments" as const, label: "Sentiments" },
                      { key: "audience" as const, label: "Audience Analysis" },
                      { key: "sna" as const, label: "Social Network Analysis" },
                    ].map((t) => {
                      const activeTab = analysisTab === t.key;
                      return (
                        <button
                          key={t.key}
                          onClick={() => (t.key === "audience" ? openAudience() : setAnalysisTab(t.key))}
                          className="flex-1 text-center py-[9px] rounded-[9px] text-[12px] font-bold cursor-pointer transition-colors hover:text-[#e8edf5]"
                          style={activeTab ? { background: "rgba(242,101,34,0.16)", color: ORANGE_LIGHT } : { color: "#8a97ab" }}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                  {analysisTab === "sentiments" && (
                    <div className="rounded-[12px] p-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#3fd07f" }} />
                        <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.55)" }}>
                          Sentiment Analysis
                        </p>
                      </div>
                      <p className="text-[13px] leading-relaxed" style={{ color: "#c6d0dd" }}>
                        {typed}
                        <span className="inline-block w-[2px] h-[13px] ml-1 align-middle animate-pulse" style={{ background: ORANGE_LIGHT }} />
                      </p>
                      {typed.length >= SENTIMENT_SEED.length && <SentimentBars />}
                    </div>
                  )}
                  {analysisTab === "audience" && audState === "loading" && (
                    <div className="flex flex-col gap-[9px] px-[18px] py-4 mb-4 rounded-[14px]" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#0f1621" }}>
                      <div className="flex items-center gap-2.5">
                        <span className="text-[12px] font-bold" style={{ color: "#c6d0dd" }}>Analyzing Audience</span>
                        <span className="ml-auto text-[12px] font-extrabold" style={{ color: ORANGE_LIGHT, fontVariantNumeric: "tabular-nums" }}>
                          {audProgress}%
                        </span>
                      </div>
                      <div className="h-[6px] rounded-[6px] overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                        <div className="h-full rounded-[6px] transition-all duration-200 ease-linear" style={{ width: `${audProgress}%`, background: ORANGE }} />
                      </div>
                    </div>
                  )}
                  {analysisTab === "audience" && audState === "done" && (
                    <div className="rounded-[12px] p-4 mb-4" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: "#38bdf8" }} />
                        <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "rgba(255,255,255,0.55)" }}>
                          Audience Analysis
                        </p>
                      </div>
                      <p className="text-[13px] leading-relaxed" style={{ color: "#c6d0dd" }}>
                        {audTyped}
                        <span className="inline-block w-[2px] h-[13px] ml-1 align-middle animate-pulse" style={{ background: ORANGE_LIGHT }} />
                      </p>
                      {audTyped.length >= AUDIENCE_SEED.length && <AudienceBars />}
                    </div>
                  )}
                  {analysisTab === "sna" && (
                    <div className="rounded-[12px] px-4 py-8 mb-4 text-center" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <p className="text-[12px] font-semibold" style={{ color: "rgba(255,255,255,0.45)" }}>
                        Social Network Analysis — belum tersedia
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Mini post header */}
              <div className={`flex items-center gap-3 mb-4 pb-4 ${analysis ? "mt-6" : ""}`} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                {post.thumbnail ? (
                  <img src={post.thumbnail} alt={post.caption} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                ) : (
                  <div className="w-9 h-9 rounded-lg shrink-0" style={{ background: "repeating-linear-gradient(135deg,#1b2432 0 7px,#151d29 7px 14px)" }} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="text-[12.5px] font-bold leading-[1.35] truncate" style={{ color: "#e8edf5" }}>
                    {post.caption}
                  </div>
                  <div className="text-[11px] mt-0.5" style={{ color: MUTED }}>
                    Reels · 31w · {post.commentsCount} komentar
                  </div>
                </div>
              </div>

              <div ref={listRef} className="flex flex-col gap-[18px]">
                {COMMENTS.map((c, i) => (
                  <div key={c.user} className="flex flex-col gap-[18px]">
                    <CommentRow c={c} size={i === 0 ? "lg" : undefined} />
                    {c.replies && (
                      <>
                        {!showReplies && !rLoading && (
                          <button
                            onClick={toggleReplies}
                            className="ml-[50px] flex items-center gap-3.5 text-[12px] font-semibold cursor-pointer transition-colors hover:text-[#e8edf5]"
                            style={{ color: "#8a97ab" }}
                          >
                            <span className="w-[26px] h-px" style={{ background: "rgba(255,255,255,0.22)" }} />
                            View all 22 replies
                          </button>
                        )}
                        {rLoading && (
                          <div className="ml-[50px] flex flex-col gap-[7px] px-3.5 py-[11px] rounded-[11px]" style={{ border: "1px solid rgba(255,255,255,0.07)", background: "#0f1621" }}>
                            <div className="flex items-center gap-2.5">
                              <span className="text-[11.5px] font-bold" style={{ color: "#c6d0dd" }}>Fetching replies</span>
                              <span className="ml-auto text-[11.5px] font-extrabold" style={{ color: ORANGE_LIGHT, fontVariantNumeric: "tabular-nums" }}>
                                {rProgress}%
                              </span>
                            </div>
                            <div className="h-[5px] rounded-[5px] overflow-hidden" style={{ background: "rgba(255,255,255,0.07)" }}>
                              <div className="h-full rounded-[5px] transition-all duration-300 ease-linear" style={{ width: `${rProgress}%`, background: ORANGE }} />
                            </div>
                          </div>
                        )}
                        {showReplies && (
                          <div ref={repliesRef} className="ml-[50px] flex flex-col gap-[15px]">
                            <button
                              onClick={toggleReplies}
                              className="flex items-center gap-3.5 text-[12px] font-semibold cursor-pointer transition-colors hover:text-[#e8edf5]"
                              style={{ color: "#8a97ab" }}
                            >
                              <span className="w-[26px] h-px" style={{ background: "rgba(255,255,255,0.22)" }} />
                              Hide replies
                            </button>
                            {c.replies.map((r) => (
                              <CommentRow key={r.user} c={r} />
                            ))}
                            <div className="flex items-center gap-3.5 text-[12px] font-semibold cursor-pointer transition-colors hover:text-[#e8edf5]" style={{ color: "#8a97ab" }}>
                              <span className="w-[26px] h-px" style={{ background: "rgba(255,255,255,0.22)" }} />
                              Show more replies
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
                <div className="ml-11 flex items-center gap-3.5 text-[12px] font-semibold" style={{ color: "#8a97ab" }}>
                  <span className="w-6 h-px" style={{ background: "rgba(255,255,255,0.2)" }} />
                  View replies (1)
                </div>
              </div>
            </div>

            <div
              className="mt-[18px] py-3 flex items-center justify-center rounded-[12px] text-[12.5px] font-bold tracking-[.3px] cursor-pointer transition-colors hover:text-[#ff9a3c]"
              style={{ background: "radial-gradient(120% 140% at 50% 50%, rgba(242,101,34,0.22) 0%, rgba(242,101,34,0.11) 45%, rgba(242,101,34,0) 100%)", color: "rgba(255,154,60,0.7)" }}
            >
              Load more
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
