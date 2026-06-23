import { useState } from "react";
import {
  Settings, MessageSquare, BarChart3, Flame, FileText,
  Search, X, ChevronDown, ExternalLink,
  Heart, MessageCircle, Eye, Share2, Play,
  CheckCircle, Info, Edit3,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
    content: "Macet parah di Jl. TB Simatupang arah Ciilndak sejak pagi. Banyak warga ngeluh waktu tempuh makin panjang. #Jakarta #macet",
    matchedKeywords: ["Jakarta", "macet", "TB Simatupang", "Cilandak"],
    thumbnail: "linear-gradient(135deg, #374151 0%, #6B7280 100%)",
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
    thumbnail: "linear-gradient(135deg, #1E40AF 0%, #3B82F6 100%)",
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
    thumbnail: "linear-gradient(135deg, #DC2626 0%, #F87171 100%)",
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
    thumbnail: "linear-gradient(135deg, #7C3AED 0%, #A78BFA 100%)",
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
  const [monitoringName, setMonitoringName] = useState("Jakarta - Public Conversation Monitor");
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
        <div className="flex items-center justify-between border-b" style={{ borderColor: "var(--ch-border)" }}>
          <TabsList variant="line" className="border-b-0 w-auto justify-start gap-0">
            <TabsTrigger
              value="setup"
              className="text-[13px] font-semibold px-4 py-2.5 rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:shadow-none gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              Setup
            </TabsTrigger>
            <TabsTrigger
              value="mentions"
              className="text-[13px] font-semibold px-4 py-2.5 rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:shadow-none gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Mentions
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="text-[13px] font-semibold px-4 py-2.5 rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:shadow-none gap-1.5"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Analysis
            </TabsTrigger>
            <TabsTrigger
              value="heatmap"
              className="text-[13px] font-semibold px-4 py-2.5 rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:shadow-none gap-1.5"
            >
              <Flame className="w-3.5 h-3.5" />
              Topical Heatmap
            </TabsTrigger>
            <TabsTrigger
              value="reports"
              className="text-[13px] font-semibold px-4 py-2.5 rounded-t-lg rounded-b-none border-b-2 border-transparent data-[state=active]:border-[#2563EB] data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:shadow-none gap-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              Reports
            </TabsTrigger>
          </TabsList>
          <button className="flex items-center gap-1.5 text-[12px] font-semibold text-[#2563EB] hover:underline px-4">
            <ExternalLink className="w-3.5 h-3.5" />
            View Other Projects
          </button>
        </div>

        {/* Tab: Setup */}
        <TabsContent value="setup" className="mt-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Setup Form */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-none">
                <CardContent className="p-6">
                  <h2 className="text-[18px] font-bold mb-1" style={{ color: "var(--ch-text)" }}>
                    Keyword Monitoring Setup
                  </h2>
                  <p className="text-[13px] mb-6" style={{ color: "var(--ch-text-muted)" }}>
                    Create and configure keyword monitoring to track public conversations.
                  </p>

                  <div className="space-y-6">
                    {/* Primary Keyword + Language */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>
                          Primary Keyword <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={primaryKeyword}
                          onChange={(e) => setPrimaryKeyword(e.target.value)}
                          className="w-full px-3 py-2 text-[13px] rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                        />
                        <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>
                          The main keyword you want to monitor.
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>
                          Language
                        </label>
                        <div className="relative">
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full px-3 py-2 text-[13px] rounded-lg border bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                          >
                            <option>Indonesian</option>
                            <option>English</option>
                            <option>Malay</option>
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
                        </div>
                      </div>
                    </div>

                    {/* Include Keywords */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold flex items-center gap-1.5" style={{ color: "var(--ch-text)" }}>
                        Include
                        <Info className="w-3.5 h-3.5" style={{ color: "var(--ch-text-muted)" }} />
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {incKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-green-50 text-green-700 border border-green-200"
                          >
                            {kw}
                            <button onClick={() => removeIncludeKeyword(kw)} className="hover:text-green-900">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={includeInput}
                            onChange={(e) => setIncludeInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addIncludeKeyword()}
                            placeholder="Add Keyword"
                            className="w-28 px-2 py-1 text-[12px] border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
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
                      <label className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>
                        Exclusion Keywords <span className="text-red-500">(Exclude)</span>
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {excKeywords.map((kw) => (
                          <span
                            key={kw}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium bg-red-50 text-red-700 border border-red-200"
                          >
                            {kw}
                            <button onClick={() => removeExcludeKeyword(kw)} className="hover:text-red-900">
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={excludeInput}
                            onChange={(e) => setExcludeInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addExcludeKeyword()}
                            placeholder="Add Keyword"
                            className="w-28 px-2 py-1 text-[12px] border rounded-full bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                            style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
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
                      <label className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>
                        Monitoring Name
                      </label>
                      <input
                        type="text"
                        value={monitoringName}
                        onChange={(e) => setMonitoringName(e.target.value)}
                        className="w-full px-3 py-2 text-[13px] rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                      />
                      <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>
                        Give your monitoring a recognizable name.
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        className="px-5 py-2.5 text-[13px] font-semibold rounded-lg border transition-colors hover:bg-slate-50"
                        style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                      >
                        Cancel
                      </button>
                      <button className="px-5 py-2.5 text-[13px] font-semibold rounded-lg bg-[#2563EB] text-white hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4" />
                        Save Monitoring
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Data Sources + Crawl Settings */}
            <div className="space-y-6">
              <Card>
                <CardContent className="p-5">
                  <h3 className="text-[15px] font-bold mb-1" style={{ color: "var(--ch-text)" }}>
                    Data Sources
                  </h3>
                  <p className="text-[12px] mb-4" style={{ color: "var(--ch-text-muted)" }}>
                    Select platforms & sources to crawl
                  </p>
                  <div className="space-y-3">
                    {sources.map((src) => (
                      <label
                        key={src.id}
                        className="flex items-center gap-3 cursor-pointer group"
                      >
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${
                            src.checked
                              ? "bg-[#2563EB] border-[#2563EB]"
                              : "border-slate-300 group-hover:border-slate-400"
                          }`}
                          onClick={() => toggleSource(src.id)}
                        >
                          {src.checked && (
                            <CheckCircle className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                        <span
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ background: src.color }}
                        >
                          {src.icon}
                        </span>
                        <span className="text-[13px] font-medium" style={{ color: "var(--ch-text)" }}>
                          {src.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-5">
                  <h3 className="text-[15px] font-bold mb-4" style={{ color: "var(--ch-text)" }}>
                    Crawl Settings
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium" style={{ color: "var(--ch-text-muted)" }}>
                        Crawl Frequency
                      </label>
                      <div className="relative">
                        <select
                          value={crawlFrequency}
                          onChange={(e) => setCrawlFrequency(e.target.value)}
                          className="w-full px-3 py-2 text-[13px] rounded-lg border bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                        >
                          <option>Real-time</option>
                          <option>Hourly</option>
                          <option>Daily</option>
                          <option>Weekly</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[12px] font-medium" style={{ color: "var(--ch-text-muted)" }}>
                        Historical Data
                      </label>
                      <div className="relative">
                        <select
                          value={historicalData}
                          onChange={(e) => setHistoricalData(e.target.value)}
                          className="w-full px-3 py-2 text-[13px] rounded-lg border bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                        >
                          <option>Last 7 Days</option>
                          <option>Last 30 Days</option>
                          <option>Last 90 Days</option>
                          <option>All Time</option>
                        </select>
                        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Mentions */}
        <TabsContent value="mentions" className="mt-0">
          <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-muted)" }} />
                <input
                  type="text"
                  placeholder="Search mentions..."
                  className="w-full pl-9 pr-3 py-2 text-[13px] rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                />
              </div>
              <div className="relative">
                <select
                  value={platformFilter}
                  onChange={(e) => setPlatformFilter(e.target.value)}
                  className="px-3 py-2 text-[12px] font-medium rounded-lg border bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                >
                  {platforms.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
              </div>
              <div className="relative">
                <select
                  value={mentionTypeFilter}
                  onChange={(e) => setMentionTypeFilter(e.target.value)}
                  className="px-3 py-2 text-[12px] font-medium rounded-lg border bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                >
                  {mentionTypes.map((t) => (
                    <option key={t.id} value={t.id}>{t.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
              </div>
              <div className="relative">
                <select
                  value={sentimentFilter}
                  onChange={(e) => setSentimentFilter(e.target.value)}
                  className="px-3 py-2 text-[12px] font-medium rounded-lg border bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                >
                  {sentimentTypes.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
              </div>
              <div className="relative">
                <select
                  value={impactFilter}
                  onChange={(e) => setImpactFilter(e.target.value)}
                  className="px-3 py-2 text-[12px] font-medium rounded-lg border bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                >
                  {impactLevels.map((l) => (
                    <option key={l.id} value={l.id}>{l.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none" style={{ color: "var(--ch-text-muted)" }} />
              </div>
              <button className="px-3 py-2 text-[12px] font-medium rounded-lg border hover:bg-slate-50 transition-colors flex items-center gap-1.5" style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}>
                More Filters
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Active Filters */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[12px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Active Filters:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Project: Jakarta <X className="w-3 h-3 cursor-pointer" />
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                Date: May 16 – May 22, 2024 <X className="w-3 h-3 cursor-pointer" />
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                All Platforms <X className="w-3 h-3 cursor-pointer" />
              </span>
              <button className="text-[12px] font-semibold text-blue-600 hover:underline">
                Clear all
              </button>
            </div>

            {/* Mention Cards */}
            <div className="space-y-4">
              {mentions.map((m) => (
                <div
                  key={m.id}
                  className="rounded-xl border overflow-hidden transition-all duration-200 hover:shadow-md"
                  style={{ background: "#FFFFFF", borderColor: "var(--ch-border)" }}
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Thumbnail */}
                    <div
                      className="w-full sm:w-36 h-24 sm:h-auto flex items-center justify-center shrink-0 relative"
                      style={{ background: m.thumbnail }}
                    >
                      <span className="text-white/80 text-[11px] font-bold">{m.platformIcon}</span>
                      {m.hasVideo && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-black/40 flex items-center justify-center">
                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                          </div>
                          <span className="absolute bottom-2 right-2 text-[10px] font-semibold text-white bg-black/60 px-1.5 py-0.5 rounded">
                            {m.videoDuration}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-white shrink-0"
                          style={{ background: m.platformColor }}
                        >
                          {m.platformIcon}
                        </span>
                        <span className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>
                          {m.username}
                        </span>
                        {m.verified && (
                          <CheckCircle className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                        )}
                        <span className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>
                          · {m.time}
                        </span>
                      </div>
                      <p className="text-[13px] leading-relaxed" style={{ color: "var(--ch-text)" }}>
                        {m.content}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>
                          Matched Keywords:
                        </span>
                        {m.matchedKeywords.map((kw) => (
                          <span key={kw} className="text-[11px] font-semibold text-blue-600">
                            {kw}
                          </span>
                        ))}
                      </div>

                      {/* AI Analysis */}
                      <div className="flex flex-wrap items-center gap-4 pt-1 border-t" style={{ borderColor: "var(--ch-border)" }}>
                        <span className="text-[11px] flex items-center gap-1.5" style={{ color: "var(--ch-text-muted)" }}>
                          <SparkleIcon className="w-3 h-3 text-purple-500" /> AI Sentiment
                          <span className="font-semibold" style={{ color: m.aiSentimentColor }}>
                            {m.aiSentiment}
                          </span>
                        </span>
                        <span className="text-[11px] flex items-center gap-1.5" style={{ color: "var(--ch-text-muted)" }}>
                          AI Topic
                          <span className="w-2 h-2 rounded-full bg-blue-500" />
                          <span className="font-semibold" style={{ color: "var(--ch-text)" }}>{m.aiTopic}</span>
                        </span>
                        <span className="text-[11px] flex items-center gap-1.5" style={{ color: "var(--ch-text-muted)" }}>
                          AI Location
                          <span className="w-2 h-2 rounded-full bg-purple-500" />
                          <span className="font-semibold" style={{ color: "var(--ch-text)" }}>{m.aiLocation}</span>
                        </span>
                      </div>
                    </div>

                    {/* Stats + Actions */}
                    <div className="p-4 flex flex-col items-end justify-between shrink-0">
                      <div className="flex flex-wrap items-center gap-4">
                        {m.comments !== undefined && (
                          <span className="text-[11px] flex flex-col items-center gap-0.5" style={{ color: "var(--ch-text-muted)" }}>
                            <MessageCircle className="w-4 h-4" />
                            {typeof m.comments === "number" ? m.comments.toLocaleString("id-ID") : m.comments}
                            <span className="text-[9px]">Comments</span>
                          </span>
                        )}
                        {m.reposts !== undefined && (
                          <span className="text-[11px] flex flex-col items-center gap-0.5" style={{ color: "var(--ch-text-muted)" }}>
                            <Share2 className="w-4 h-4" />
                            {m.reposts}
                            <span className="text-[9px]">Reposts</span>
                          </span>
                        )}
                        {m.likes !== undefined && (
                          <span className="text-[11px] flex flex-col items-center gap-0.5" style={{ color: "var(--ch-text-muted)" }}>
                            <Heart className="w-4 h-4" />
                            {m.likes}
                            <span className="text-[9px]">Likes</span>
                          </span>
                        )}
                        {m.shares !== undefined && (
                          <span className="text-[11px] flex flex-col items-center gap-0.5" style={{ color: "var(--ch-text-muted)" }}>
                            <Share2 className="w-4 h-4" />
                            {m.shares}
                            <span className="text-[9px]">Shares</span>
                          </span>
                        )}
                        {m.views !== undefined && (
                          <span className="text-[11px] flex flex-col items-center gap-0.5" style={{ color: "var(--ch-text-muted)" }}>
                            <Eye className="w-4 h-4" />
                            {m.views}
                            <span className="text-[9px]">Views</span>
                          </span>
                        )}
                      </div>
                      <button className="mt-3 flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors">
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
        <TabsContent value="analysis" className="mt-0">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-2">
              <BarChart3 className="w-12 h-12 mx-auto" style={{ color: "var(--ch-text-muted)" }} />
              <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text)" }}>Analysis Dashboard</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Coming soon — deeper insights into your monitoring data.</p>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Topical Heatmap */}
        <TabsContent value="heatmap" className="mt-0">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-2">
              <Flame className="w-12 h-12 mx-auto" style={{ color: "var(--ch-text-muted)" }} />
              <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text)" }}>Topical Heatmap</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Coming soon — visualize trending topics across platforms.</p>
            </div>
          </div>
        </TabsContent>

        {/* Tab: Reports */}
        <TabsContent value="reports" className="mt-0">
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-2">
              <FileText className="w-12 h-12 mx-auto" style={{ color: "var(--ch-text-muted)" }} />
              <p className="text-[14px] font-semibold" style={{ color: "var(--ch-text)" }}>Reports</p>
              <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>Coming soon — generate monitoring reports automatically.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M19 14l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z" opacity="0.5" />
    </svg>
  );
}
