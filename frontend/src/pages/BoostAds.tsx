import { useState } from "react";
import { Rocket, Users, BarChart2, Megaphone, ChevronRight, Target, Zap, TrendingUp, Plus, X } from "lucide-react";
import { toast } from "sonner";

type TabKey = "launch" | "audience" | "manager" | "campaigns";

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "launch",    label: "Launch Ads",        icon: Rocket },
  { key: "audience",  label: "Create Audience",   icon: Users },
  { key: "manager",   label: "Audience Manager",  icon: BarChart2 },
  { key: "campaigns", label: "Campaign Manager",  icon: Megaphone },
];

const AD_FORMATS = [
  { key: "story",    label: "Story",    icon: "📖", desc: "9:16 vertical, max 15s" },
  { key: "reel",     label: "Reels",    icon: "🎬", desc: "Short-form video, max 60s" },
  { key: "feed",     label: "Feed Post", icon: "🖼️", desc: "1:1 square or landscape" },
  { key: "carousel", label: "Carousel", icon: "🎠", desc: "Up to 10 slides" },
];

const INTERESTS = [
  "Fashion", "Beauty", "Travel", "Food", "Tech", "Gaming", "Fitness",
  "Parenting", "Finance", "Education", "Music", "Art", "Sports", "Automotive",
];

const AUDIENCES = [
  { id: "1", name: "Beauty Enthusiasts 18-28", size: "2.1M", status: "active", reach: "487K", ctr: "3.2%" },
  { id: "2", name: "Tech Early Adopters", size: "1.3M", status: "active", reach: "312K", ctr: "2.8%" },
  { id: "3", name: "Millennial Parents", size: "890K", status: "paused", reach: "198K", ctr: "1.9%" },
];

const CAMPAIGNS_DATA = [
  { id: "1", name: "Lebaran Glow Up", audience: "Beauty Enthusiasts", budget: 15000000, spent: 8400000, clicks: 24800, ctr: "3.1%", status: "active" },
  { id: "2", name: "Tech Launch Q2", audience: "Tech Early Adopters", budget: 20000000, spent: 12600000, clicks: 18200, ctr: "2.7%", status: "active" },
  { id: "3", name: "Summer Vibes", audience: "Gen Z Lifestyle", budget: 8000000, spent: 8000000, clicks: 31400, ctr: "4.2%", status: "completed" },
];

function formatRp(n: number) {
  return "Rp " + (n >= 1_000_000 ? (n / 1_000_000).toFixed(1) + "jt" : (n / 1000).toFixed(0) + "rb");
}

export default function BoostAds() {
  const [tab, setTab] = useState<TabKey>("launch");
  const [budget, setBudget] = useState(5000000);
  const [adFormat, setAdFormat] = useState("reel");
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["Fashion", "Beauty"]);
  const [ageRange, setAgeRange] = useState([18, 35]);
  const [gender, setGender] = useState("all");
  const [cities, setCities] = useState(["Jakarta", "Surabaya"]);
  const [cityInput, setCityInput] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [isLaunching, setIsLaunching] = useState(false);

  const toggleInterest = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  };

  const addCity = () => {
    const v = cityInput.trim();
    if (v && !cities.includes(v)) setCities((c) => [...c, v]);
    setCityInput("");
  };

  const handleLaunch = () => {
    if (!campaignName) { toast.error("Campaign name must be filled"); return; }
    setIsLaunching(true);
    setTimeout(() => {
      setIsLaunching(false);
      toast.success("Ad campaign launched successfully! 🚀");
    }, 1800);
  };

  const statusChip = (status: string) => {
    const map: Record<string, { bg: string; fg: string }> = {
      active:    { bg: "#DCFCE7", fg: "#15803D" },
      paused:    { bg: "#FEF3C7", fg: "#B45309" },
      completed: { bg: "#DBEAFE", fg: "#1D4ED8" },
    };
    const s = map[status] ?? map.active;
    return (
      <span className="px-2 py-0.5 rounded-full text-[11px] font-bold"
        style={{ background: s.bg, color: s.fg }}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-6 space-y-5" style={{ background: "var(--ch-bg)" }}>
      {/* Header with Quota Cards */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-[28px] font-extrabold tracking-[-0.5px] flex items-center gap-2.5"
            style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <span className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "var(--ch-primary)", boxShadow: "var(--ch-nav-shadow)" }}>
              <Rocket style={{ width: 18, height: 18, color: "white" }} />
            </span>
            Boost Ads
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
            Amplifikasi konten kreator dengan iklan berbayar lintas platform
          </p>
        </div>

        {/* Quota Cards */}
        <div className="flex gap-3">
          <div className="rounded-xl border px-4 py-2.5"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Remaining Budget</p>
            <p className="text-[15px] font-bold" style={{ color: "var(--ch-text)" }}>Rp 15jt</p>
          </div>
          <div className="rounded-xl border px-4 py-2.5"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <p className="text-[11px] font-medium" style={{ color: "var(--ch-text-muted)" }}>Remaining Quota</p>
            <p className="text-[15px] font-bold" style={{ color: "var(--ch-text)" }}>847 ad clicks</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[12px]"
          style={{ color: "var(--ch-text-muted)" }}>
          <TrendingUp style={{ width: 14, height: 14, color: "#16A34A" }} />
          <span style={{ color: "#16A34A", fontWeight: 600 }}>+34%</span>
          rata-rata peningkatan reach
        </div>
      </div>

      {/* 3-Step Stepper */}
      <div className="flex items-center justify-between mb-4">
        {[
          { key: "campaign", label: "Campaign", completed: true },
          { key: "adset", label: "Ad Set", completed: false },
          { key: "creative", label: "Ads Creative", completed: false },
        ].map((step, index) => (
          <div key={step.key} className="flex-1 flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                step.completed ? "text-white" : "text-[var(--ch-text-muted)]"
              }`}
                style={{ background: step.completed ? "#16A34A" : "var(--ch-border)" }}>
                {step.completed ? "✓" : index + 1}
              </div>
              <span className={`text-[13px] font-semibold ${step.completed ? "" : "text-[var(--ch-text-muted)]"}`}
                style={{ color: step.completed ? "var(--ch-text)" : undefined }}>
                {step.label}
              </span>
            </div>
            {index < 2 && (
              <div className="flex-1 h-0.5 mx-2" style={{ background: step.completed ? "#16A34A" : "var(--ch-border)" }} />
            )}
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b" style={{ borderColor: "var(--ch-border)" }}>
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors"
              style={active
                ? { borderColor: "var(--ch-primary)", color: "var(--ch-primary)" }
                : { borderColor: "transparent", color: "var(--ch-text-muted)" }}>
              <Icon style={{ width: 14, height: 14 }} />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Launch Ads */}
      {tab === "launch" && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: form */}
          <div className="lg:col-span-3 space-y-5">
            {/* Campaign Objective Selection */}
            <div className="rounded-[14px] border p-[22px]"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <p className="text-[13px] font-bold mb-3" style={{ color: "var(--ch-text)" }}>Campaign Objective</p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "awareness", label: "Awareness", icon: "👁️", desc: "Maximum reach and impressions" },
                  { key: "engagement", label: "Engagement", icon: "💬", desc: "Drive interactions and conversations" },
                  { key: "traffic", label: "Traffic", icon: "🔗", desc: "Send users to your website" },
                  { key: "conversions", label: "Conversions", icon: "🎯", desc: "Drive sales and sign-ups" },
                ].map((objective) => (
                  <button
                    key={objective.key}
                    className="p-3 rounded-xl border text-left transition-all hover:shadow-md"
                    style={{ borderColor: "var(--ch-border)", background: "var(--ch-bg)" }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-primary)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-border)"}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{objective.icon}</span>
                      <span className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{objective.label}</span>
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{objective.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Campaign name */}
            <div className="rounded-[14px] border p-[22px]"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <p className="text-[13px] font-bold mb-3" style={{ color: "var(--ch-text)" }}>Campaign Name</p>
              <input
                className="w-full rounded-lg border px-3 py-2 text-[13px] outline-none transition-colors"
                style={{ borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
                placeholder="Contoh: Lebaran Glow Up 2026"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ch-primary)")}
                onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ch-border)")}
              />
            </div>

            {/* Budget slider */}
            <div className="rounded-[14px] border p-[22px]"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <div className="flex items-center justify-between mb-3">
                <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Daily Budget</p>
                <p className="text-[18px] font-extrabold" style={{ color: "var(--ch-primary)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {formatRp(budget)}
                </p>
              </div>
              <input type="range" min={100000} max={20000000} step={100000}
                value={budget} onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: "var(--ch-primary)" }}
              />
              <div className="flex justify-between text-[11px] mt-1.5" style={{ color: "var(--ch-text-soft)" }}>
                <span>Rp 100rb</span>
                <span>Rp 20jt</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-3">
                {[1000000, 5000000, 10000000].map((v) => (
                  <button key={v}
                    onClick={() => setBudget(v)}
                    className="py-1.5 rounded-lg text-[12px] font-semibold border transition-colors"
                    style={budget === v
                      ? { borderColor: "var(--ch-primary)", color: "var(--ch-primary)", background: "var(--ch-primary-50)" }
                      : { borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
                    {formatRp(v)}
                  </button>
                ))}
              </div>
              <div className="mt-3 p-3 rounded-lg text-[12px]" style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
                Estimated reach: <strong>{(budget / 1200).toFixed(0)}–{(budget / 800).toFixed(0)} people/day</strong>
              </div>
            </div>

            {/* Ad format */}
            <div className="rounded-[14px] border p-[22px]"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <p className="text-[13px] font-bold mb-3" style={{ color: "var(--ch-text)" }}>Format Iklan</p>
              <div className="grid grid-cols-2 gap-3">
                {AD_FORMATS.map((f) => (
                  <button key={f.key}
                    onClick={() => setAdFormat(f.key)}
                    className="p-3 rounded-xl border text-left transition-all"
                    style={adFormat === f.key
                      ? { borderColor: "var(--ch-primary)", background: "var(--ch-primary-50)" }
                      : { borderColor: "var(--ch-border)", background: "var(--ch-bg)" }}>
                    <div className="text-xl mb-1">{f.icon}</div>
                    <p className="text-[13px] font-semibold" style={{ color: adFormat === f.key ? "var(--ch-primary)" : "var(--ch-text)" }}>{f.label}</p>
                    <p className="text-[11px]" style={{ color: "var(--ch-text-soft)" }}>{f.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Upload Zone */}
            <div className="rounded-[14px] border-2 border-dashed p-[22px] text-center transition-colors cursor-pointer"
              style={{ borderColor: "var(--ch-border)", background: "var(--ch-bg)" }}
              onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-primary)"}
              onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-border)"}>
              <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
                <Plus style={{ width: 24, height: 24 }} />
              </div>
              <p className="text-[13px] font-bold mb-1" style={{ color: "var(--ch-text)" }}>
                Upload Ad Creative
              </p>
              <p className="text-[12px] mb-3" style={{ color: "var(--ch-text-muted)" }}>
                Drag & drop file atau klik untuk browse
              </p>
              <div className="flex items-center justify-center gap-2 text-[11px]" style={{ color: "var(--ch-text-soft)" }}>
                <span>MP4, MOV, JPG, PNG</span>
                <span>•</span>
                <span>Max 100MB</span>
                <span>•</span>
                <span>9:16 atau 1:1</span>
              </div>
            </div>

            <button
              onClick={handleLaunch}
              disabled={isLaunching}
              className="w-full py-3 rounded-xl text-white text-[14px] font-bold flex items-center justify-center gap-2 transition-opacity"
              style={{ background: isLaunching ? "#94A3B8" : "var(--ch-primary)", boxShadow: isLaunching ? "none" : "var(--ch-nav-shadow)" }}>
              {isLaunching
                ? <><span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" /> Meluncurkan...</>
                : <><Rocket style={{ width: 16, height: 16 }} /> Launch Campaign</>}
            </button>
          </div>

          {/* Right: preview */}
          <div className="lg:col-span-2">
            <div className="rounded-xl border p-5 sticky top-6"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <p className="text-[13px] font-bold mb-4" style={{ color: "var(--ch-text)" }}>Ad Preview</p>
              {/* Phone mockup */}
              <div className="mx-auto w-[180px] rounded-[28px] border-[6px] border-slate-800 overflow-hidden shadow-xl"
                style={{ background: "#000" }}>
                <div className="relative" style={{ paddingBottom: "177.78%", background: "linear-gradient(145deg, #1e3a5f, #2563EB)" }}>
                  <div className="absolute inset-0 flex flex-col p-3">
                    <div className="flex items-center gap-1.5 mt-auto mb-2">
                      <div className="w-6 h-6 rounded-full bg-white/20" />
                      <div>
                        <p className="text-white text-[8px] font-bold">@kreator</p>
                        <p className="text-white/60 text-[7px]">Sponsored</p>
                      </div>
                    </div>
                    <p className="text-white text-[9px] font-semibold mb-2">
                      {campaignName || "Nama kampanye Anda..."}
                    </p>
                    <div className="rounded-lg py-1.5 text-center text-[9px] font-bold text-white"
                      style={{ background: "var(--ch-primary)" }}>
                      Pelajari Selengkapnya <ChevronRight style={{ width: 8, height: 8, display: "inline" }} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-[12px]">
                <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--ch-border)" }}>
                  <span style={{ color: "var(--ch-text-muted)" }}>Format</span>
                  <span className="font-semibold" style={{ color: "var(--ch-text)" }}>
                    {AD_FORMATS.find((f) => f.key === adFormat)?.label}
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b" style={{ borderColor: "var(--ch-border)" }}>
                  <span style={{ color: "var(--ch-text-muted)" }}>Budget/Hari</span>
                  <span className="font-semibold" style={{ color: "var(--ch-text)" }}>{formatRp(budget)}</span>
                </div>
                <div className="flex justify-between py-2">
                  <span style={{ color: "var(--ch-text-muted)" }}>Est. Reach</span>
                  <span className="font-semibold" style={{ color: "#16A34A" }}>
                    {(budget / 1200).toFixed(0)}–{(budget / 800).toFixed(0)}/hari
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Audience */}
      {tab === "audience" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Interests */}
          <div className="rounded-xl border p-5"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
            <div className="flex items-center gap-2 mb-4">
              <Target style={{ width: 15, height: 15, color: "var(--ch-primary)" }} />
              <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Interests</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map((i) => (
                <button key={i}
                  onClick={() => toggleInterest(i)}
                  className="px-3 py-1 rounded-full text-[12px] font-semibold border transition-all"
                  style={selectedInterests.includes(i)
                    ? { borderColor: "var(--ch-primary)", background: "var(--ch-primary)", color: "white" }
                    : { borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
                  {i}
                </button>
              ))}
            </div>
            <p className="text-[11px] mt-3" style={{ color: "var(--ch-text-soft)" }}>
              {selectedInterests.length} interest dipilih
            </p>
          </div>

          {/* Demographics */}
          <div className="space-y-4">
            <div className="rounded-xl border p-5"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <p className="text-[13px] font-bold mb-3" style={{ color: "var(--ch-text)" }}>Age Range</p>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-[11px] mb-1" style={{ color: "var(--ch-text-muted)" }}>
                    <span>Min: {ageRange[0]}</span>
                    <span>Max: {ageRange[1]}</span>
                  </div>
                  <input type="range" min={13} max={65} value={ageRange[0]}
                    onChange={(e) => setAgeRange([Number(e.target.value), ageRange[1]])}
                    className="w-full" style={{ accentColor: "var(--ch-primary)" }} />
                  <input type="range" min={13} max={65} value={ageRange[1]}
                    onChange={(e) => setAgeRange([ageRange[0], Number(e.target.value)])}
                    className="w-full mt-1" style={{ accentColor: "var(--ch-orange)" }} />
                </div>
                <div className="text-center px-3 py-2 rounded-lg"
                  style={{ background: "var(--ch-primary-50)" }}>
                  <p className="text-[16px] font-extrabold" style={{ color: "var(--ch-primary)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {ageRange[0]}–{ageRange[1]}
                  </p>
                  <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>tahun</p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border p-5"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <p className="text-[13px] font-bold mb-3" style={{ color: "var(--ch-text)" }}>Gender</p>
              <div className="flex gap-2">
                {[{ v: "all", l: "Semua" }, { v: "female", l: "Perempuan" }, { v: "male", l: "Laki-laki" }].map((g) => (
                  <button key={g.v} onClick={() => setGender(g.v)}
                    className="flex-1 py-2 rounded-lg text-[12px] font-semibold border transition-colors"
                    style={gender === g.v
                      ? { borderColor: "var(--ch-primary)", background: "var(--ch-primary)", color: "white" }
                      : { borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
                    {g.l}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-xl border p-5"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
              <p className="text-[13px] font-bold mb-3" style={{ color: "var(--ch-text)" }}>Location</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {cities.map((c) => (
                  <span key={c} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[12px] font-semibold"
                    style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
                    {c}
                    <button onClick={() => setCities((list) => list.filter((x) => x !== c))}>
                      <X style={{ width: 10, height: 10 }} />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  className="flex-1 rounded-lg border px-3 py-1.5 text-[12px] outline-none"
                  style={{ borderColor: "var(--ch-border)" }}
                  placeholder="Tambah kota..."
                  value={cityInput}
                  onChange={(e) => setCityInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addCity()}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "var(--ch-primary)")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "var(--ch-border)")}
                />
                <button onClick={addCity}
                  className="px-3 py-1.5 rounded-lg text-white text-[12px] font-semibold"
                  style={{ background: "var(--ch-primary)" }}>
                  <Plus style={{ width: 13, height: 13 }} />
                </button>
              </div>
            </div>

            <button
              onClick={() => toast.success("Audience berhasil disimpan!")}
              className="w-full py-2.5 rounded-xl text-white text-[13px] font-bold flex items-center justify-center gap-2"
              style={{ background: "var(--ch-primary)", boxShadow: "var(--ch-nav-shadow)" }}>
              <Zap style={{ width: 14, height: 14 }} />
              Save Audience
            </button>
          </div>
        </div>
      )}

      {/* Audience Manager */}
      {tab === "manager" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>
              {AUDIENCES.length} saved audiences
            </p>
            <button
              onClick={() => setTab("audience")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white"
              style={{ background: "var(--ch-primary)" }}>
              <Plus style={{ width: 13, height: 13 }} />
              New Audience
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {AUDIENCES.map((a) => (
              <div key={a.id} className="rounded-xl border p-5"
                style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>{a.name}</p>
                    <p className="text-[12px] mt-0.5" style={{ color: "var(--ch-text-muted)" }}>
                      Size: {a.size}
                    </p>
                  </div>
                  {statusChip(a.status)}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Reach", value: a.reach },
                    { label: "CTR", value: a.ctr },
                  ].map((s) => (
                    <div key={s.label} className="p-2.5 rounded-lg text-center"
                      style={{ background: "var(--ch-bg)" }}>
                      <p className="text-[16px] font-extrabold" style={{ color: "var(--ch-primary)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{s.value}</p>
                      <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 py-1.5 rounded-lg border text-[12px] font-semibold transition-colors"
                    style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-primary)"; (e.currentTarget as HTMLElement).style.color = "var(--ch-primary)"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "var(--ch-border)"; (e.currentTarget as HTMLElement).style.color = "var(--ch-text-muted)"; }}
                    onClick={() => toast.success(`Editing ${a.name}`)}>
                    Edit
                  </button>
                  <button className="flex-1 py-1.5 rounded-lg text-white text-[12px] font-semibold"
                    style={{ background: "var(--ch-primary)" }}
                    onClick={() => { setTab("launch"); toast.info(`Audience "${a.name}" dipilih`); }}>
                    Use in Ad
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Campaign Manager */}
      {tab === "campaigns" && (
        <div className="rounded-xl border overflow-hidden"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
          <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: "var(--ch-border)" }}>
            <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>Active Ad Campaigns</p>
            <button onClick={() => setTab("launch")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-white"
              style={{ background: "var(--ch-primary)" }}>
              <Plus style={{ width: 13, height: 13 }} />
              New Campaign
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b" style={{ borderColor: "var(--ch-border)" }}>
                  {["Kampanye", "Audience", "Budget", "Spent", "Clicks", "CTR", "Status"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold"
                      style={{ color: "var(--ch-text-muted)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CAMPAIGNS_DATA.map((c) => {
                  const pct = Math.round((c.spent / c.budget) * 100);
                  return (
                    <tr key={c.id} className="border-b transition-colors hover:bg-slate-50"
                      style={{ borderColor: "var(--ch-border)" }}>
                      <td className="px-4 py-4">
                        <p className="text-[13px] font-semibold" style={{ color: "var(--ch-text)" }}>{c.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <div className="w-full max-w-[80px] rounded-full h-1"
                            style={{ background: "var(--ch-border)" }}>
                            <div className="h-1 rounded-full" style={{ width: `${pct}%`, background: "var(--ch-primary)" }} />
                          </div>
                          <span className="text-[10px]" style={{ color: "var(--ch-text-soft)" }}>{pct}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{c.audience}</td>
                      <td className="px-4 py-4 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{formatRp(c.budget)}</td>
                      <td className="px-4 py-4 text-[12px] font-semibold" style={{ color: "var(--ch-text)" }}>{formatRp(c.spent)}</td>
                      <td className="px-4 py-4 text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{c.clicks.toLocaleString("id-ID")}</td>
                      <td className="px-4 py-4 text-[12px] font-semibold" style={{ color: "var(--ch-green)" }}>{c.ctr}</td>
                      <td className="px-4 py-4">{statusChip(c.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
