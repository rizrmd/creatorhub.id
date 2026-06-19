import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const PERKS = [
  { emoji: "🚀", text: "Access 10,000+ verified creators" },
  { emoji: "📊", text: "Real-time analytics & automated reports" },
  { emoji: "💰", text: "Secure escrow payment protection" },
  { emoji: "🤖", text: "AI matching best creator-brand" },
];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login({ email, password });
      navigate(user.role === "kreator" ? "/dashboard/kreator/home" : "/dashboard/marketplace", { replace: true });
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "Login gagal, coba lagi";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--ch-bg)" }}>
      {/* Left: branding panel */}
      <div className="hidden lg:flex w-[480px] shrink-0 flex-col justify-between p-12 relative overflow-hidden"
        style={{ background: "linear-gradient(145deg, #1e3a5f 0%, #2563EB 55%, #3b82f6 100%)" }}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full opacity-10 bg-white -translate-y-24 translate-x-24" />
        <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full opacity-10 bg-white translate-y-16 -translate-x-16" />

        {/* Logo */}
        <div className="relative">
          <img
            src="/logo.png"
            alt="CreatorHub"
            className="h-12 w-auto max-w-[200px] object-contain"
          />
        </div>

        {/* Main copy */}
        <div className="relative">
          <h1 className="text-[36px] font-extrabold text-white leading-tight tracking-[-0.5px] mb-4"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Influencer Campaign<br />
            Management Platform<br />
            <span style={{ color: "#93C5FD" }}>#1 in Indonesia</span>
          </h1>
          <p className="text-blue-200 text-[15px] mb-8">
            Connect your brand with 10,000+ best content creators efficiently.
          </p>
          <div className="space-y-3">
            {PERKS.map((p) => (
              <div key={p.text} className="flex items-center gap-3">
                <span className="text-xl">{p.emoji}</span>
                <span className="text-blue-100 text-[14px]">{p.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom social proof */}
        <div className="relative">
          <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.1)" }}>
            <div className="flex -space-x-2">
              {["A","B","C","D"].map((l, i) => (
                <div key={l} className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[11px] font-bold text-white"
                  style={{ background: `hsl(${i * 60 + 200}, 65%, 50%)`, zIndex: 4 - i }}>
                  {l}
                </div>
              ))}
            </div>
            <div>
              <p className="text-white text-[13px] font-bold">500+ brand aktif</p>
              <p className="text-blue-200 text-[11px]">bergabung bulan ini</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right: login form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="flex justify-center mb-8 lg:hidden">
            <img
              src="/logo.png"
              alt="CreatorHub"
              className="h-10 w-auto max-w-[180px] object-contain"
            />
          </div>

          <h2 className="text-[26px] font-extrabold mb-1 tracking-[-0.5px]"
            style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Sign in to your account
          </h2>
          <p className="text-[14px] mb-7" style={{ color: "var(--ch-text-muted)" }}>
            All-in-one influencer campaign management platform
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
                onClick={() => toast.info("Forgot password feature not available")}>
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full mt-2 font-bold text-[14px] transition-all duration-200 hover:opacity-90"
              disabled={loading}
              style={{ background: loading ? "var(--ch-border)" : "var(--ch-primary)", boxShadow: loading ? "none" : "var(--ch-nav-shadow)" }}>
              {loading ? "Signing in..." : "Sign in to CreatorHub"}
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t text-center" style={{ borderColor: "var(--ch-border)" }}>
            <p className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>
              Don't have an account?{" "}
              <a href="/apply" style={{ color: "var(--ch-primary)", fontWeight: 600 }}>
                Sign up as a creator →
              </a>
            </p>
          </div>

          <p className="text-center text-[11px] mt-6" style={{ color: "var(--ch-text-soft)" }}>
            CreatorHub.id © 2026 · Indonesia Influencer Campaign Platform
          </p>
        </div>
      </div>
    </div>
  );
}
