import { useState } from "react";
import {
  Settings, MessageSquare, BarChart3, Flame, FileText,
  Search, X, ChevronDown, ExternalLink,
  Heart, MessageCircle, Eye, Share2, Play,
  CheckCircle, Info, Edit3,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsContent } from "@/components/ui/tabs";

const dataSources = [
  { id: "twitter", name: "X (Twitter)", icon: "X", checked: true, color: "#000" },
  { id: "instagram", name: "Instagram", icon: "IG", checked: true, color: "#E1306C" },
  { id: "facebook", name: "Facebook", icon: "FB", checked: true, color: "#1877F2" },
  { id: "tiktok", name: "TikTok", icon: "TT", checked: true, color: "#000" },
  { id: "youtube", name: "YouTube", icon: "YT", checked: true, color: "#FF0000" },
  { id: "news", name: "News Websites", icon: "NW", checked: true, color: "#0EA5E9" },
  { id: "forums", name: "Forums & Blogs", icon: "FB", checked: true, color: "#8B5CF6" },
];

const includeKeywords = ["demo", "kebakaran", "kerusuhan", "demonstrasi", "protes", "tabrakan", "kecelakaan", "rusuh"];
const excludeKeywords = ["Jakarta band", "Jakarta song", "Jakarta movie"];

const mentions = [
  {
    id: 1, platform: "X", platformIcon: "X", platformColor: "#000", username: "@infojakarta", verified: true, time: "15m ago",
    content: "Macet parah di Jl. TB Simatupang arah Cilandak sejak pagi. Banyak warga ngeluh waktu tempuh makin panjang. #Jakarta #macet",
    matchedKeywords: ["Jakarta", "macet", "TB Simatupang", "Cilandak"],
    thumbnail: "https://picsum.photos/seed/traffic1/200/150", hasVideo: false,
    comments: 620, reposts: "1.8K", likes: "8.4K", views: "245K",
    aiSentiment: "Negative", aiSentimentColor: "#DC2626", aiTopic: "Macet", aiLocation: "Jakarta Selatan",
  },
  {
    id: 2, platform: "Instagram", platformIcon: "IG", platformColor: "#E1306C", username: "@jaksel.info", verified: true, time: "32m ago",
    content: "Hujan deras sejak dini hari bikin beberapa wilayah Jakarta tergenang lagi. Semoga cepat surut.",
    matchedKeywords: ["Jakarta", "banjir", "hujan"],
    thumbnail: "https://picsum.photos/seed/flood1/200/150", hasVideo: false,
    likes: "3.4K", comments: 412, shares: 732, views: "82K",
    aiSentiment: "Negative", aiSentimentColor: "#DC2626", aiTopic: "Banjir", aiLocation: "Jakarta Selatan",
  },
  {
    id: 3, platform: "TikTok", platformIcon: "TT", platformColor: "#000", username: "@warga.jaksel", verified: false, time: "1h ago",
    content: "Setiap hari macet, solusi transportasi kapan ya? Jakarta harus berubah! #jakarta #macet #transportasi",
    matchedKeywords: ["Jakarta", "macet", "transportasi"],
    thumbnail: "https://picsum.photos/seed/transport1/200/150", hasVideo: true, videoDuration: "06:30",
    likes: "5.8K", comments: 860, shares: "1.2K", views: "128K",
    aiSentiment: "Negative", aiSentimentColor: "#DC2626", aiTopic: "Transportasi", aiLocation: "Jakarta Selatan",
  },
  {
    id: 4, platform: "YouTube", platformIcon: "YT", platformColor: "#FF0000", username: "MetroJakarta TV", verified: true, time: "2h ago",
    content: "Kemacetan Jakarta Selatan Meningkat saat Jam Pulang Kerja",
    matchedKeywords: ["Jakarta", "kemacetan", "jam pulang kerja"],
    thumbnail: "https://picsum.photos/seed/commute1/200/150", hasVideo: true, videoDuration: "04:32",
    likes: "1.2K", comments: 238, views: "56K",
    aiSentiment: "Neutral", aiSentimentColor: "#F59E0B", aiTopic: "Kemacetan", aiLocation: "Jakarta Selatan",
  },
];

const platforms = [
  { id: "all", label: "All Platforms" }, { id: "twitter", label: "X (Twitter)" },
  { id: "instagram", label: "Instagram" }, { id: "facebook", label: "Facebook" },
  { id: "tiktok", label: "TikTok" }, { id: "youtube", label: "YouTube" },
];
const mentionTypes = [
  { id: "all", label: "All Types" }, { id: "post", label: "Post" },
  { id: "comment", label: "Comment" }, { id: "story", label: "Story" }, { id: "reel", label: "Reel" },
];
const sentimentTypes = [
  { id: "all", label: "All Sentiment" }, { id: "positive", label: "Positive" },
  { id: "neutral", label: "Neutral" }, { id: "negative", label: "Negative" },
];
const impactLevels = [
  { id: "all", label: "All Impact" }, { id: "high", label: "High" },
  { id: "medium", label: "Medium" }, { id: "low", label: "Low" },
];

const inputStyle = { background: "var(--ch-surface)", border: "1px solid var(--ch-border)", color: "var(--ch-text)" };
const labelStyle = { color: "var(--ch-text)" };
const mutedStyle = { color: "var(--ch-text-muted)" };
const cardStyle = { background: "var(--ch-surface)", border: "1px solid var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" };

export default function MediaMonitoring() {
  const [activeTab, setActiveTab] = useState("setup");
  const [primaryKeyword, setPrimaryKeyword] = useState("Jakarta");
  const [language, setLanguage] = useState("Indonesian");
  const [includeInput, setIncludeInput] = useState("");
  const [excludeInput, setExcludeInput] = useState("");
  const [monitoringName, setMonitoringName] = useState("Jakarta – Public Conversation Monitor");
  const [crawlFrequency, setCrawlFrequency] = useState("Real-time");
  const [historicalData, setHistoricalData] = useState("Last 7 Days");
  const [sources, setSources] = useState(dataSources);
  const [incKeywords, setIncKeywords] = useState(includeKeywords);
  const [excKeywords, setExcKeywords] = useState(excludeKeywords);


  const toggleSource = (id: string) => setSources((prev) => prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s)));
  const addIncludeKeyword = () => { if (includeInput.trim() && !incKeywords.includes(includeInput.trim())) { setIncKeywords((prev) => [...prev, includeInput.trim()]); setIncludeInput(""); } };
  const removeIncludeKeyword = (kw: string) => setIncKeywords((prev) => prev.filter((k) => k !== kw));
  const addExcludeKeyword = () => { if (excludeInput.trim() && !excKeywords.includes(excludeInput.trim())) { setExcKeywords((prev) => [...prev, excludeInput.trim()]); setExcludeInput(""); } };
  const removeExcludeKeyword = (kw: string) => setExcKeywords((prev) => prev.filter((k) => k !== kw));

  const tabItems = [
    { value: "setup", icon: Settings, label: "Setup" },
    { value: "mentions", icon: MessageSquare, label: "Mentions" },
    { value: "analysis", icon: BarChart3, label: "Analysis" },
    { value: "heatmap", icon: Flame, label: "Topical Heatmap" },
    { value: "reports", icon: FileText, label: "Reports" },
    { value: "projects", icon: BarChart3, label: "Projects" },
  ];

  return (
    <div className="p-4 md:p-6" style={{ background: "var(--ch-bg)" }}>
      <div className="mb-4">
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Media Monitoring
        </h1>
        <p className="text-[14px] mt-1" style={mutedStyle}>Pantau percakapan publik secara real-time di berbagai platform.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tab Header */}
        <div className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid var(--ch-border)" }}>
          <div className="flex items-center gap-2">
            {tabItems.map((tab) => {
              const isActive = activeTab === tab.value;
              const TabIcon = tab.icon;
              return (
                <button key={tab.value} onClick={() => setActiveTab(tab.value)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold rounded-full transition-all duration-150"
                  style={isActive ? { background: "var(--ch-orange)", color: "white", boxShadow: "0 2px 8px rgba(249,115,22,.35)" } : { color: "var(--ch-text-muted)", border: "1px solid var(--ch-border)" }}>
                  <TabIcon className="w-3.5 h-3.5" />{tab.label}
                </button>
              );
            })}
          </div>
          <button className="flex items-center gap-1.5 text-[12px] font-semibold hover:underline px-4" style={{ color: "var(--ch-orange)" }}>
            <ExternalLink className="w-3.5 h-3.5" />View Other Projects
          </button>
        </div>

        {/* Tab: Setup */}
        <TabsContent value="setup" className="mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2">
              <div className="rounded-xl p-6" style={cardStyle}>
                <h2 className="text-[18px] font-bold mb-1" style={labelStyle}>Keyword Monitoring Setup</h2>
                <p className="text-[13px] mb-6" style={mutedStyle}>Create and configure keyword monitoring to track public conversations.</p>
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold" style={labelStyle}>Primary Keyword <span className="text-red-500">*</span></label>
                      <input type="text" value={primaryKeyword} onChange={(e) => setPrimaryKeyword(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle} />
                      <p className="text-[11px]" style={mutedStyle}>The main keyword you want to monitor.</p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold" style={labelStyle}>Language</label>
                      <div className="relative">
                        <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle}>
                          <option>Indonesian</option><option>English</option><option>Malay</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={mutedStyle} />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold flex items-center gap-1.5" style={labelStyle}>Include <Info className="w-3.5 h-3.5" style={mutedStyle} /></label>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {incKeywords.map((kw) => (
                        <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium" style={{ background: "#14532D", color: "#4ADE80", border: "1px solid #166534" }}>
                          {kw}<button onClick={() => removeIncludeKeyword(kw)} className="hover:text-green-300 ml-0.5"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="text" value={includeInput} onChange={(e) => setIncludeInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addIncludeKeyword(); } }} placeholder="Type a keyword and press Add" className="flex-1 px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle} />
                      <button onClick={addIncludeKeyword} className="px-4 py-2 text-[12px] font-semibold rounded-lg text-white transition-colors hover:opacity-90" style={{ background: "var(--ch-orange)" }}>Add</button>
                    </div>
                    <p className="text-[11px]" style={mutedStyle}>Add one keyword then press comma before pressing Add.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[13px] font-semibold" style={labelStyle}>Exclusion Keywords <span className="text-red-500">(Exclude)</span></label>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {excKeywords.map((kw) => (
                        <span key={kw} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium" style={{ background: "#450A0A", color: "#FCA5A5", border: "1px solid #7F1D1D" }}>
                          {kw}<button onClick={() => removeExcludeKeyword(kw)} className="hover:text-red-300 ml-0.5"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="text" value={excludeInput} onChange={(e) => setExcludeInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addExcludeKeyword(); } }} placeholder="Type a keyword and press Add" className="flex-1 px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle} />
                      <button onClick={addExcludeKeyword} className="px-4 py-2 text-[12px] font-semibold rounded-lg text-white transition-colors hover:opacity-90" style={{ background: "var(--ch-orange)" }}>Add</button>
                    </div>
                    <p className="text-[11px]" style={mutedStyle}>Add one keyword then press comma before pressing Add.</p>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold" style={labelStyle}>Monitoring Name</label>
                    <input type="text" value={monitoringName} onChange={(e) => setMonitoringName(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle} />
                    <p className="text-[11px]" style={mutedStyle}>Give your monitoring a recognizable name.</p>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-3" style={{ borderTop: "1px solid var(--ch-border)" }}>
                    <button className="px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-colors hover:opacity-80" style={{ border: "1px solid var(--ch-border)", color: "var(--ch-text)" }}>Cancel</button>
                    <button className="px-5 py-2.5 text-[13px] font-semibold rounded-lg text-white transition-colors flex items-center gap-1.5" style={{ background: "var(--ch-orange)" }}>
                      <CheckCircle className="w-4 h-4" />Save Monitoring
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="rounded-xl p-5" style={cardStyle}>
                <h3 className="text-[15px] font-bold mb-1" style={labelStyle}>Data Sources</h3>
                <p className="text-[12px] mb-4" style={mutedStyle}>Select platforms & sources to crawl</p>
                <div className="space-y-3">
                  {sources.map((src) => (
                    <label key={src.id} className="flex items-center gap-3 cursor-pointer group">
                      <input type="checkbox" checked={src.checked} onChange={() => toggleSource(src.id)} className="w-5 h-5 rounded border-2 cursor-pointer accent-orange-500" style={{ borderColor: "var(--ch-border)" }} />
                      <span className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: src.color }}>{src.icon}</span>
                      <span className="text-[13px] font-medium" style={labelStyle}>{src.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="rounded-xl p-5" style={cardStyle}>
                <h3 className="text-[15px] font-bold mb-4" style={labelStyle}>Crawl Settings</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium" style={mutedStyle}>Crawl Frequency</label>
                    <div className="relative">
                      <select value={crawlFrequency} onChange={(e) => setCrawlFrequency(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle}>
                        <option>Real-time</option><option>Hourly</option><option>Daily</option><option>Weekly</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={mutedStyle} />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium" style={mutedStyle}>Historical Data</label>
                    <div className="relative">
                      <select value={historicalData} onChange={(e) => setHistoricalData(e.target.value)} className="w-full px-3 py-2 text-[13px] rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle}>
                        <option>Last 7 Days</option><option>Last 30 Days</option><option>Last 90 Days</option><option>All Time</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={mutedStyle} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Mentions */}
        <TabsContent value="mentions" className="mt-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={mutedStyle} />
                <input type="text" placeholder="Search mentions..." className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle} />
              </div>
              {[platforms, mentionTypes, sentimentTypes, impactLevels].map((opts, i) => (
                <div key={i} className="relative">
                  <select className="px-3 py-2 text-[12px] font-medium rounded-lg appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-orange-500" style={inputStyle}>
                    {opts.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={mutedStyle} />
                </div>
              ))}
              <button className="px-3 py-2 text-[12px] font-medium rounded-lg transition-colors flex items-center gap-1.5" style={{ border: "1px solid var(--ch-border)", color: "var(--ch-text-muted)" }}>
                More Filters <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-medium" style={{ color: "var(--ch-text)" }}>Active Filters:</span>
              {["Project: Jakarta", "Date: May 16 – May 22, 2024", "All Platforms"].map((f) => (
                <span key={f} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-white" style={{ background: "rgba(255,255,255,.12)", border: "1px solid rgba(255,255,255,.2)", boxShadow: "0 0 8px rgba(255,255,255,.08)" }}>
                  {f} <X className="w-3 h-3 cursor-pointer hover:opacity-70" />
                </span>
              ))}
              <button className="text-[12px] font-semibold ml-1 hover:underline text-white">Clear all</button>
            </div>

            <div className="space-y-4">
              {mentions.map((m) => (
                <div key={m.id} className="rounded-xl overflow-hidden transition-all duration-200 hover:shadow-md" style={cardStyle}>
                  <div className="flex">
                    <div className="flex flex-col items-center gap-2 p-4 shrink-0">
                      <span className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: m.platformColor }}>{m.platformIcon}</span>
                      <div className="w-[120px] h-[90px] rounded-lg overflow-hidden relative" style={{ background: "var(--ch-border)" }}>
                        <img src={m.thumbnail} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                        {m.hasVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center"><Play className="w-4 h-4 text-white fill-white ml-0.5" /></div>
                            <span className="absolute bottom-1.5 right-1.5 text-[9px] font-semibold text-white bg-black/60 px-1.5 py-0.5 rounded">{m.videoDuration}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-bold" style={labelStyle}>{m.username}</span>
                        {m.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />}
                        <span className="text-[11px]" style={mutedStyle}>· {m.time}</span>
                      </div>
                      <p className="text-[13px] leading-relaxed mb-2" style={{ color: "var(--ch-text)" }}>{m.content}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="text-[11px] font-medium" style={mutedStyle}>Matched Keywords:</span>
                        {m.matchedKeywords.map((kw) => (<span key={kw} className="text-[11px] font-semibold" style={{ color: "var(--ch-orange)" }}>{kw}</span>))}
                      </div>
                      <div className="flex flex-wrap items-center gap-4 pt-3" style={{ borderTop: "1px solid var(--ch-border)" }}>
                        <span className="text-[11px] flex items-center gap-1.5" style={mutedStyle}>
                          <Sparkles className="w-3 h-3 text-purple-400" /> AI Analysis
                          <span className="font-semibold px-1.5 py-0.5 rounded-full text-[10px]"
                            style={m.aiSentiment === "Negative" ? { background: "#450A0A", color: "#FCA5A5", border: "1px solid #7F1D1D" }
                              : m.aiSentiment === "Positive" ? { background: "#14532D", color: "#4ADE80", border: "1px solid #166534" }
                              : { background: "#1E293B", color: "#CBD5E1", border: "1px solid #334155" }}>
                            {m.aiSentiment}
                          </span>
                        </span>
                        <span className="text-[11px] flex items-center gap-1.5" style={mutedStyle}>
                          AI Topic <span className="w-2 h-2 rounded-full bg-blue-500" /> <span className="font-semibold" style={labelStyle}>{m.aiTopic}</span>
                        </span>
                        <span className="text-[11px] flex items-center gap-1.5" style={mutedStyle}>
                          Detected Keyword Location <span className="w-2 h-2 rounded-full bg-purple-500" /> <span className="font-semibold" style={labelStyle}>{m.aiLocation}</span>
                        </span>
                      </div>
                    </div>

                    <div className="p-4 flex flex-col items-end justify-between shrink-0" style={{ borderLeft: "1px solid var(--ch-border)" }}>
                      <div className="flex flex-col items-end gap-2.5">
                        {m.comments !== undefined && (
                          <span className="text-[11px] flex items-center gap-2" style={mutedStyle}>
                            <MessageCircle className="w-4 h-4" />
                            <span className="font-semibold" style={labelStyle}>{typeof m.comments === "number" ? m.comments.toLocaleString("id-ID") : m.comments}</span>
                            <span className="text-[9px] w-14 text-right" style={mutedStyle}>Comments</span>
                          </span>
                        )}
                        {m.reposts !== undefined && (
                          <span className="text-[11px] flex items-center gap-2" style={mutedStyle}>
                            <Share2 className="w-4 h-4" /><span className="font-semibold" style={labelStyle}>{m.reposts}</span><span className="text-[9px] w-14 text-right" style={mutedStyle}>Reposts</span>
                          </span>
                        )}
                        {m.likes !== undefined && (
                          <span className="text-[11px] flex items-center gap-2" style={mutedStyle}>
                            <Heart className="w-4 h-4" /><span className="font-semibold" style={labelStyle}>{m.likes}</span><span className="text-[9px] w-14 text-right" style={mutedStyle}>Likes</span>
                          </span>
                        )}
                        {m.shares !== undefined && (
                          <span className="text-[11px] flex items-center gap-2" style={mutedStyle}>
                            <Share2 className="w-4 h-4" /><span className="font-semibold" style={labelStyle}>{m.shares}</span><span className="text-[9px] w-14 text-right" style={mutedStyle}>Shares</span>
                          </span>
                        )}
                        {m.views !== undefined && (
                          <span className="text-[11px] flex items-center gap-2" style={mutedStyle}>
                            <Eye className="w-4 h-4" /><span className="font-semibold" style={labelStyle}>{m.views}</span><span className="text-[9px] w-14 text-right" style={mutedStyle}>Views</span>
                          </span>
                        )}
                      </div>
                      <button className="mt-4 flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-colors hover:opacity-80" style={{ border: "1px solid rgba(249,115,22,.3)", color: "var(--ch-orange)" }}>
                        <Edit3 className="w-3 h-3" />Review & Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Placeholder tabs */}
        {(["analysis", "heatmap", "reports", "projects"] as const).map((tab) => {
          const icons = { analysis: BarChart3, heatmap: Flame, reports: FileText, projects: BarChart3 };
          const titles = { analysis: "Analysis Dashboard", heatmap: "Topical Heatmap", reports: "Reports", projects: "Projects" };
          const descs = { analysis: "Deeper insights into your monitoring data.", heatmap: "Visualize trending topics across platforms.", reports: "Generate monitoring reports automatically.", projects: "Manage and track your monitoring projects." };
          const Icon = icons[tab];
          return (
            <TabsContent key={tab} value={tab} className="mt-5">
              <div className="flex items-center justify-center py-20">
                <div className="text-center space-y-2">
                  <Icon className="w-12 h-12 mx-auto" style={{ color: "var(--ch-border-strong)" }} />
                  <p className="text-[14px] font-semibold" style={labelStyle}>{titles[tab]}</p>
                  <p className="text-[12px]" style={mutedStyle}>Coming soon — {descs[tab]}</p>
                </div>
              </div>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
