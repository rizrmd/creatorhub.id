import { useState } from "react";
import {
  Settings, MessageSquare, BarChart3, Flame, FileText,
  Search, X, ChevronDown, ExternalLink,
  Heart, MessageCircle, Eye, Share2, Play,
  CheckCircle, Info, Edit3,
  Plus, Sparkles,
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
    id: 1,
    platform: "X",
    platformIcon: "X",
    platformColor: "#000",
    username: "@infojakarta",
    verified: true,
    time: "15m ago",
    content: "Macet parah di Jl. TB Simatupang arah Cilandak sejak pagi. Banyak warga ngeluh waktu tempuh makin panjang. #Jakarta #macet",
    matchedKeywords: ["Jakarta", "macet", "TB Simatupang", "Cilandak"],
    thumbnail: "https://picsum.photos/seed/traffic1/200/150",
    hasVideo: false,
    comments: 620,
    reposts: "1.8K",
    likes: "8.4K",
    views: "245K",
    aiSentiment: "Negative",
    aiSentimentColor: "#DC2626",
    aiTopic: "Macet",
    aiLocation: "Jakarta Selatan",
  },
  {
    id: 2,
    platform: "Instagram",
    platformIcon: "IG",
    platformColor: "#E1306C",
    username: "@jaksel.info",
    verified: true,
    time: "32m ago",
    content: "Hujan deras sejak dini hari bikin beberapa wilayah Jakarta tergenang lagi. Semoga cepat surut.",
    matchedKeywords: ["Jakarta", "banjir", "hujan"],
    thumbnail: "https://picsum.photos/seed/flood1/200/150",
    hasVideo: false,
    likes: "3.4K",
    comments: 412,
    shares: 732,
    views: "82K",
    aiSentiment: "Negative",
    aiSentimentColor: "#DC2626",
    aiTopic: "Banjir",
    aiLocation: "Jakarta Selatan",
  },
  {
    id: 3,
    platform: "TikTok",
    platformIcon: "TT",
    platformColor: "#000",
    username: "@warga.jaksel",
    verified: false,
    time: "1h ago",
    content: "Setiap hari macet, solusi transportasi kapan ya? Jakarta harus berubah! #jakarta #macet #transportasi",
    matchedKeywords: ["Jakarta", "macet", "transportasi"],
    thumbnail: "https://picsum.photos/seed/transport1/200/150",
    hasVideo: true,
    videoDuration: "06:30",
    likes: "5.8K",
    comments: 860,
    shares: "1.2K",
    views: "128K",
    aiSentiment: "Negative",
    aiSentimentColor: "#DC2626",
    aiTopic: "Transportasi",
    aiLocation: "Jakarta Selatan",
  },
  {
    id: 4,
    platform: "YouTube",
    platformIcon: "YT",
    platformColor: "#FF0000",
    username: "MetroJakarta TV",
    verified: true,
    time: "2h ago",
    content: "Kemacetan Jakarta Selatan Meningkat saat Jam Pulang Kerja",
    matchedKeywords: ["Jakarta", "kemacetan", "jam pulang kerja"],
    thumbnail: "https://picsum.photos/seed/commute1/200/150",
    hasVideo: true,
    videoDuration: "04:32",
    likes: "1.2K",
    comments: 238,
    views: "56K",
    aiSentiment: "Neutral",
    aiSentimentColor: "#F59E0B",
    aiTopic: "Kemacetan",
    aiLocation: "Jakarta Selatan",
  },
];

const platforms = [
  { id: "all", label: "All Platforms" },
  { id: "twitter", label: "X (Twitter)" },
  { id: "instagram", label: "Instagram" },
  { id: "facebook", label: "Facebook" },
  { id: "tiktok", label: "TikTok" },
  { id: "youtube", label: "YouTube" },
];

const mentionTypes = [
  { id: "all", label: "All Types" },
  { id: "post", label: "Post" },
  { id: "comment", label: "Comment" },
  { id: "story", label: "Story" },
  { id: "reel", label: "Reel" },
];

const sentimentTypes = [
  { id: "all", label: "All Sentiment" },
  { id: "positive", label: "Positive" },
  { id: "neutral", label: "Neutral" },
  { id: "negative", label: "Negative" },
];

const impactLevels = [
  { id: "all", label: "All Impact" },
  { id: "high", label: "High" },
  { id: "medium", label: "Medium" },
  { id: "low", label: "Low" },
];

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

  const [platformFilter, setPlatformFilter] = useState("all");
  const [mentionTypeFilter, setMentionTypeFilter] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [impactFilter, setImpactFilter] = useState("all");

  const toggleSource = (id: string) => {
    setSources((prev) =>
      prev.map((s) => (s.id === id ? { ...s, checked: !s.checked } : s))
    );
  };

  const addIncludeKeyword = () => {
    if (includeInput.trim() && !incKeywords.includes(includeInput.trim())) {
      setIncKeywords((prev) => [...prev, includeInput.trim()]);
      setIncludeInput("");
    }
  };

  const removeIncludeKeyword = (kw: string) => {
    setIncKeywords((prev) => prev.filter((k) => k !== kw));
  };

  const addExcludeKeyword = () => {
    if (excludeInput.trim() && !excKeywords.includes(excludeInput.trim())) {
      setExcKeywords((prev) => [...prev, excludeInput.trim()]);
      setExcludeInput("");
    }
  };

  const removeExcludeKeyword = (kw: string) => {
    setExcKeywords((prev) => prev.filter((k) => k !== kw));
  };

  const tabItems = [
    { value: "setup", icon: Settings, label: "Setup" },
    { value: "mentions", icon: MessageSquare, label: "Mentions" },
    { value: "analysis", icon: BarChart3, label: "Analysis" },
    { value: "heatmap", icon: Flame, label: "Topical Heatmap" },
    { value: "reports", icon: FileText, label: "Reports" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-0" style={{ background: "var(--ch-bg)" }}>
      <div className="mb-4">
        <h1
          className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Media Monitoring
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Pantau percakapan publik secara real-time di berbagai platform.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Tab Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-0">
          <div className="flex items-center gap-2">
            {tabItems.map((tab) => {
              const isActive = activeTab === tab.value;
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.value}
                  onClick={() => setActiveTab(tab.value)}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-semibold rounded-full transition-all duration-150
                    ${isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }
                  `}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>
          <button className="flex items-center gap-1.5 text-[12px] font-semibold text-blue-600 hover:underline px-4">
            <ExternalLink className="w-3.5 h-3.5" />
            View Other Projects
          </button>
        </div>

        {/* Tab: Setup */}
        <TabsContent value="setup" className="mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left: Setup Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h2 className="text-[18px] font-bold mb-1" style={{ color: "#1E293B" }}>
                  Keyword Monitoring Setup
                </h2>
                <p className="text-[13px] mb-6" style={{ color: "#64748B" }}>
                  Create and configure keyword monitoring to track public conversations.
                </p>

                <div className="space-y-5">
                  {/* Primary Keyword + Language */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-slate-700">
                        Primary Keyword <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={primaryKeyword}
                        onChange={(e) => setPrimaryKeyword(e.target.value)}
                        className="w-full px-3 py-2 text-[13px] rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{ color: "#1E293B" }}
                      />
                      <p className="text-[11px] text-slate-400">
                        The main keyword you want to monitor.
                      </p>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-slate-700">
                        Language
                      </label>
                      <div className="relative">
                        <select
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          className="w-full px-3 py-2 text-[13px] rounded-lg border border-slate-200 bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          style={{ color: "#1E293B" }}
                        >
                          <option>Indonesian</option>
                          <option>English</option>
                          <option>Malay</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  {/* Include Keywords */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700 flex items-center gap-1.5">
                      Include
                      <Info className="w-3.5 h-3.5 text-slate-400" />
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {incKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-green-50 text-green-700 border border-green-200"
                        >
                          {kw}
                          <button onClick={() => removeIncludeKeyword(kw)} className="hover:text-green-900 ml-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={includeInput}
                          onChange={(e) => setIncludeInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addIncludeKeyword()}
                          placeholder="Add Keyword"
                          className="w-28 px-2.5 py-1 text-[12px] border border-slate-200 rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          style={{ color: "#1E293B" }}
                        />
                        <button
                          onClick={addIncludeKeyword}
                          className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Exclusion Keywords */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700">
                      Exclusion Keywords <span className="text-red-500">(Exclude)</span>
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {excKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-red-50 text-red-700 border border-red-200"
                        >
                          {kw}
                          <button onClick={() => removeExcludeKeyword(kw)} className="hover:text-red-900 ml-0.5">
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          value={excludeInput}
                          onChange={(e) => setExcludeInput(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && addExcludeKeyword()}
                          placeholder="Add Keyword"
                          className="w-28 px-2.5 py-1 text-[12px] border border-slate-200 rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                          style={{ color: "#1E293B" }}
                        />
                        <button
                          onClick={addExcludeKeyword}
                          className="w-6 h-6 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:border-blue-500 hover:text-blue-500 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Monitoring Name */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-semibold text-slate-700">
                      Monitoring Name
                    </label>
                    <input
                      type="text"
                      value={monitoringName}
                      onChange={(e) => setMonitoringName(e.target.value)}
                      className="w-full px-3 py-2 text-[13px] rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      style={{ color: "#1E293B" }}
                    />
                    <p className="text-[11px] text-slate-400">
                      Give your monitoring a recognizable name.
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                    <button className="px-5 py-2.5 text-[13px] font-semibold rounded-lg border border-slate-200 text-slate-700 transition-colors hover:bg-slate-50">
                      Cancel
                    </button>
                    <button className="px-5 py-2.5 text-[13px] font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5 shadow-sm">
                      <CheckCircle className="w-4 h-4" />
                      Save Monitoring
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Data Sources + Crawl Settings */}
            <div className="space-y-5">
              {/* Data Sources */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-[15px] font-bold text-slate-800 mb-1">
                  Data Sources
                </h3>
                <p className="text-[12px] text-slate-400 mb-4">
                  Select platforms & sources to crawl
                </p>
                <div className="space-y-3">
                  {sources.map((src) => (
                    <label
                      key={src.id}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={src.checked}
                        onChange={() => toggleSource(src.id)}
                        className="w-5 h-5 rounded border-2 border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                      />
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ background: src.color }}
                      >
                        {src.icon}
                      </span>
                      <span className="text-[13px] font-medium text-slate-700">
                        {src.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Crawl Settings */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-[15px] font-bold text-slate-800 mb-4">
                  Crawl Settings
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-slate-500">
                      Crawl Frequency
                    </label>
                    <div className="relative">
                      <select
                        value={crawlFrequency}
                        onChange={(e) => setCrawlFrequency(e.target.value)}
                        className="w-full px-3 py-2 text-[13px] rounded-lg border border-slate-200 bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{ color: "#1E293B" }}
                      >
                        <option>Real-time</option>
                        <option>Hourly</option>
                        <option>Daily</option>
                        <option>Weekly</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[12px] font-medium text-slate-500">
                      Historical Data
                    </label>
                    <div className="relative">
                      <select
                        value={historicalData}
                        onChange={(e) => setHistoricalData(e.target.value)}
                        className="w-full px-3 py-2 text-[13px] rounded-lg border border-slate-200 bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        style={{ color: "#1E293B" }}
                      >
                        <option>Last 7 Days</option>
                        <option>Last 30 Days</option>
                        <option>Last 90 Days</option>
                        <option>All Time</option>
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
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
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search mentions..."
                  className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  style={{ color: "#1E293B" }}
                />
              </div>
              <div className="relative">
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="px-3 py-2 text-[12px] font-medium rounded-lg border border-slate-200 bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ color: "#1E293B" }}
                >
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={mentionTypeFilter}
                  onChange={(e) => setMentionTypeFilter(e.target.value)}
                  className="px-3 py-2 text-[12px] font-medium rounded-lg border border-slate-200 bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ color: "#1E293B" }}
                >
                  {mentionTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={sentimentFilter}
                  onChange={(e) => setSentimentFilter(e.target.value)}
                  className="px-3 py-2 text-[12px] font-medium rounded-lg border border-slate-200 bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ color: "#1E293B" }}
                >
                  {sentimentTypes.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={impactFilter}
                  onChange={(e) => setImpactFilter(e.target.value)}
                  className="px-3 py-2 text-[12px] font-medium rounded-lg border border-slate-200 bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ color: "#1E293B" }}
                >
                  {impactLevels.map((l) => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
              </div>
              <button className="px-3 py-2 text-[12px] font-medium rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors flex items-center gap-1.5 text-slate-600">
                More Filters
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-medium text-slate-500">Active Filters:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Project: Jakarta <X className="w-3 h-3 cursor-pointer hover:text-blue-900" />
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Date: May 16 – May 22, 2024 <X className="w-3 h-3 cursor-pointer hover:text-blue-900" />
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                All Platforms <X className="w-3 h-3 cursor-pointer hover:text-blue-900" />
              </span>
              <button className="text-[12px] font-semibold text-blue-600 hover:underline ml-1">
                Clear all
              </button>
            </div>

            {/* Mention Cards */}
            <div className="space-y-4">
              {mentions.map((m) => (
                <div
                  key={m.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
                >
                  <div className="flex">
                    {/* Left: Platform Icon + Thumbnail */}
                    <div className="flex flex-col items-center gap-2 p-4 shrink-0">
                      <span
                        className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                        style={{ background: m.platformColor }}
                      >
                        {m.platformIcon}
                      </span>
                      <div
                        className="w-[120px] h-[90px] rounded-lg overflow-hidden relative"
                        style={{ background: "#E2E8F0" }}
                      >
                        <img
                          src={m.thumbnail}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                          }}
                        />
                        {m.hasVideo && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <div className="w-9 h-9 rounded-full bg-black/50 flex items-center justify-center">
                              <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                            </div>
                            <span className="absolute bottom-1.5 right-1.5 text-[9px] font-semibold text-white bg-black/60 px-1.5 py-0.5 rounded">
                              {m.videoDuration}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Center: Content */}
                    <div className="flex-1 p-4 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[13px] font-bold text-slate-800">
                          {m.username}
                        </span>
                        {m.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                        )}
                        <span className="text-[11px] text-slate-400">
                          · {m.time}
                        </span>
                      </div>
                      <p className="text-[13px] leading-relaxed text-slate-700 mb-2">
                        {m.content}
                      </p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <span className="text-[11px] font-medium text-slate-400">
                          Matched Keywords:
                        </span>
                        {m.matchedKeywords.map((kw) => (
                          <span key={kw} className="text-[11px] font-semibold text-blue-600">
                            {kw}
                          </span>
                        ))}
                      </div>

                      {/* AI Analysis */}
                      <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100">
                        <span className="text-[11px] flex items-center gap-1.5 text-slate-500">
                          <Sparkles className="w-3 h-3 text-purple-500" /> AI Sentiment
                          <span className="font-semibold" style={{ color: m.aiSentimentColor }}>
                            {m.aiSentiment}
                          </span>
                        </span>
                        <span className="text-[11px] flex items-center gap-1.5 text-slate-500">
                          AI Topic
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="font-semibold text-slate-700">{m.aiTopic}</span>
                        </span>
                        <span className="text-[11px] flex items-center gap-1.5 text-slate-500">
                          AI Location
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          <span className="font-semibold text-slate-700">{m.aiLocation}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right: Stats + Action */}
                    <div className="p-4 flex flex-col items-end justify-between shrink-0 border-l border-slate-100">
                      <div className="flex flex-col items-end gap-2.5">
                        {m.comments !== undefined && (
                          <span className="text-[11px] flex items-center gap-2 text-slate-500">
                            <MessageCircle className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold text-slate-700">
                              {typeof m.comments === "number" ? m.comments.toLocaleString("id-ID") : m.comments}
                            </span>
                            <span className="text-[9px] text-slate-400 w-14 text-right">Comments</span>
                          </span>
                        )}
                        {m.reposts !== undefined && (
                          <span className="text-[11px] flex items-center gap-2 text-slate-500">
                            <Share2 className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold text-slate-700">{m.reposts}</span>
                            <span className="text-[9px] text-slate-400 w-14 text-right">Reposts</span>
                          </span>
                        )}
                        {m.likes !== undefined && (
                          <span className="text-[11px] flex items-center gap-2 text-slate-500">
                            <Heart className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold text-slate-700">{m.likes}</span>
                            <span className="text-[9px] text-slate-400 w-14 text-right">Likes</span>
                          </span>
                        )}
                        {m.shares !== undefined && (
                          <span className="text-[11px] flex items-center gap-2 text-slate-500">
                            <Share2 className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold text-slate-700">{m.shares}</span>
                            <span className="text-[9px] text-slate-400 w-14 text-right">Shares</span>
                          </span>
                        )}
                        {m.views !== undefined && (
                          <span className="text-[11px] flex items-center gap-2 text-slate-500">
                            <Eye className="w-4 h-4 text-slate-400" />
                            <span className="font-semibold text-slate-700">{m.views}</span>
                            <span className="text-[9px] text-slate-400 w-14 text-right">Views</span>
                          </span>
                        )}
                      </div>
                      <button className="mt-4 flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
                        <Edit3 className="w-3 h-3" />
                        Review & Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Tab: Analysis */}
        <TabsContent value="analysis" className="mt-5">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-2">
              <BarChart3 className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-[14px] font-semibold text-slate-700">Analysis Dashboard</p>
              <p className="text-[12px] text-slate-400">Coming soon — deeper insights into your monitoring data.</p>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Topical Heatmap */}
        <TabsContent value="heatmap" className="mt-5">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-2">
              <Flame className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-[14px] font-semibold text-slate-700">Topical Heatmap</p>
              <p className="text-[12px] text-slate-400">Coming soon — visualize trending topics across platforms.</p>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Reports */}
        <TabsContent value="reports" className="mt-5">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-2">
              <FileText className="w-12 h-12 mx-auto text-slate-300" />
              <p className="text-[14px] font-semibold text-slate-700">Reports</p>
              <p className="text-[12px] text-slate-400">Coming soon — generate monitoring reports automatically.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
