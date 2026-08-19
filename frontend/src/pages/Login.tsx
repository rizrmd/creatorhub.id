import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff, Building2, Palette } from "lucide-react";

const CLIENT_PERKS = [
  { emoji: "🚀", text: "Akses 10.000+ kreator verified" },
  { emoji: "📊", text: "Analytics real-time & laporan otomatis" },
  { emoji: "💰", text: "Pembayaran escrow yang aman" },
  { emoji: "🤖", text: "AI matching kreator & brand" },
];

const CREATOR_PERKS = [
  { emoji: "🎨", text: "Creator Hub untuk manage konten" },
  { emoji: "📢", text: "Terima undangan campaign dari brand" },
  { emoji: "📈", text: "Insights & performa akun" },
  { emoji: "💸", text: "Pembayaran langsung dari brand" },
];

type UserRole = "client" | "creator" | null;

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ email, password });
      if (user.role === "kreator") {
        navigate("/dashboard/kreator/home", { replace: true });
      } else if (user.role === "media_monitoring") {
        navigate("/dashboard/media-monitoring", { replace: true });
      } else if (user.role === "ekrafhub") {
        navigate("/dashboard/ekrafhub", { replace: true });
      } else {
        navigate("/dashboard/marketplace", { replace: true });
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "Login gagal, coba lagi";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const perks = role === "creator" ? CREATOR_PERKS : CLIENT_PERKS;

  return (
    <div className="min-h-screen flex" style={{ background: "#070B14" }}>
      {/* Left: branding panel */}
      <div className="hidden lg:flex w-[480px] shrink-0 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0B1120 0%, #040e1f 40%, #0f1d32 100%)" }}>
        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-[0.07] -translate-y-32 translate-x-32"
          style={{ background: "radial-gradient(circle, #F97316, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-[0.05] translate-y-20 -translate-x-20"
          style={{ background: "radial-gradient(circle, #3B82F6, transparent 70%)" }} />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <img src="/favicon.png?v=14" alt="CreatorHub" className="h-11 w-11" />
          <span className="text-2xl font-extrabold text-white tracking-tight"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            CreatorHub.ID
          </span>
        </div>

        {/* Main copy */}
        <div className="relative">
          <h1 className="text-[34px] font-extrabold text-white leading-tight tracking-[-0.5px] mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Content Creator &<br />
            Media Collaboration<br />
            Platform <span className="text-orange-400">#1 in Indonesia</span>
          </h1>
          <p className="text-slate-400 text-[15px] mb-8 leading-relaxed">
            Connect your brand with creators, homeless media, publishers, and digital communities across Indonesia.
          </p>
          <div className="space-y-3">
            {perks.map((p) => (
              <div key={p.text} className="flex items-center gap-3">
                <span className="text-xl">{p.emoji}</span>
                <span className="text-slate-300 text-[14px]">{p.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom social proof */}
        <div className="relative">
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex -space-x-2">
              {["A","B","C","D"].map((l, i) => (
                <div key={l} className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-[11px] font-bold text-white"
                  style={{ background: `hsl(${i * 60 + 200}, 65%, 50%)`, borderColor: "#0B1120", zIndex: 4 - i }}>
                  {l}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-[13px] font-bold">500+ brand aktif</p>
              <p className="text-slate-400 text-[11px]">bergabung bulan ini</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center justify-center gap-2.5 mb-8 lg:hidden">
            <img src="/favicon.png?v=14" alt="CreatorHub" className="h-10 w-10" />
            <span className="text-xl font-extrabold text-white tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              CreatorHub.ID
            </span>
          </div>

          {!role ? (
            /* Role selection */
            <>
              <h2 className="text-[26px] font-extrabold mb-2 tracking-[-0.5px] text-center"
                style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Welcome to CreatorHub.ID
              </h2>
              <p className="text-[14px] mb-8 text-center" style={{ color: "var(--ch-text-muted)" }}>
                Choose your account type
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  onClick={() => setRole("client")}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-200 hover:scale-[1.02]"
                  style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(59,130,246,.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(59,130,246,.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--ch-border)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(59,130,246,.12)" }}>
                    <Building2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Brand / Client</p>
                    <p className="text-[11px] mt-1" style={{ color: "var(--ch-text-muted)" }}>Find & hire creators</p>
                  </div>
                </button>

                <button
                  onClick={() => setRole("creator")}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl border transition-all duration-200 hover:scale-[1.02]"
                  style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(249,115,22,.5)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(249,115,22,.1)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--ch-border)"; e.currentTarget.style.boxShadow = "none"; }}
                >
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: "rgba(249,115,22,.12)" }}>
                    <Palette className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>Content Creator</p>
                    <p className="text-[11px] mt-1" style={{ color: "var(--ch-text-muted)" }}>Get discovered & earn</p>
                  </div>
                </button>
              </div>

              <div className="text-center">
                <p className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>
                  Don't have an account?{" "}
                  <Link to="/apply" style={{ color: "var(--ch-primary)", fontWeight: 600 }}>
                    Register →
                  </Link>
                </p>
              </div>
            </>
          ) : (
            /* Login form */
            <>
              <button
                onClick={() => { setRole(null); setEmail(""); setPassword(""); }}
                className="flex items-center gap-1.5 text-[13px] font-semibold mb-6 px-3 py-1.5 rounded-lg border transition-all"
                style={{ color: "var(--ch-text-muted)", borderColor: "var(--ch-border)", background: "var(--ch-surface)" }}
                onMouseEnter={(e) => { e.currentTarget.style.color = "var(--ch-text)"; e.currentTarget.style.borderColor = "var(--ch-text-muted)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.color = "var(--ch-text-muted)"; e.currentTarget.style.borderColor = "var(--ch-border)"; }}
              >
                ← Back
              </button>

              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: role === "creator" ? "rgba(249,115,22,.12)" : "rgba(59,130,246,.12)" }}>
                  {role === "creator"
                    ? <Palette className="w-4 h-4 text-orange-400" />
                    : <Building2 className="w-4 h-4 text-blue-400" />}
                </div>
                <h2 className="text-[22px] font-extrabold tracking-[-0.5px]"
                  style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {role === "creator" ? "Welcome back, Creator!" : "Sign in to your account"}
                </h2>
              </div>
              <p className="text-[13px] mb-6" style={{ color: "var(--ch-text-muted)" }}>
                {role === "creator"
                  ? "Sign in to manage your profile & content hub"
                  : "Access your brand dashboard & campaign tools"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Email</label>
                  <Input
                    type="email"
                    placeholder="admin@creatorhub.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    disabled={loading}
                    className="focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Password</label>
                  <div className="relative">
                    <Input
                      type={showPw ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPw(s => !s)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: "var(--ch-text-soft)" }}>
                      {showPw ? <EyeOff style={{ width: 15, height: 15 }} /> : <Eye style={{ width: 15, height: 15 }} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[12px]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="rounded" />
                    <span style={{ color: "var(--ch-text-muted)" }}>Remember me</span>
                  </label>
                  <button type="button" className="transition-colors"
                    style={{ color: "var(--ch-primary)" }}
                    onClick={() => toast.info("Fitur forgot password belum tersedia")}>
                    Forgot password?
                  </button>
                </div>

                <Button
                  type="submit"
                  className="w-full mt-2 font-bold text-[14px] transition-all duration-200 hover:opacity-90"
                  disabled={loading}
                  style={{
                    background: loading ? "var(--ch-border)" : role === "creator" ? "#F97316" : "var(--ch-primary)",
                    boxShadow: loading ? "none" : role === "creator" ? "0 4px 14px rgba(249,115,22,.35)" : "var(--ch-nav-shadow)",
                  }}>
                  {loading ? "Signing in..." : role === "creator" ? "Sign in as Creator" : "Sign in to CreatorHub.ID"}
                </Button>
              </form>

              <div className="mt-6 pt-5 border-t text-center" style={{ borderColor: "var(--ch-border)" }}>
                {role === "creator" ? (
                  <p className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>
                    Belum punya akun?{" "}
                    <Link to="/apply" style={{ color: "#F97316", fontWeight: 600 }}>
                      Daftar sebagai Creator →
                    </Link>
                  </p>
                ) : (
                  <p className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>
                    Ingin bermitra dengan CreatorHub?{" "}
                    <Link to="/apply" style={{ color: "var(--ch-primary)", fontWeight: 600 }}>
                      Daftar sebagai Client →
                    </Link>
                  </p>
                )}
              </div>
            </>
          )}

          <p className="text-center text-[11px] mt-6" style={{ color: "var(--ch-text-soft)" }}>
            CreatorHub.ID © 2026 · Indonesia Creator Collaboration Platform
          </p>
        </div>
      </div>
    </div>
  );
}
