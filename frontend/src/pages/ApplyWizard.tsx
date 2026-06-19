import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Star, Upload, Instagram, Youtube } from "lucide-react";
import { Input } from "@/components/ui/input";

const STEPS = [
  { label: "Selamat Datang" },
  { label: "Tentang Kamu" },
  { label: "Niche Kamu" },
  { label: "Sosial Media" },
  { label: "Rate Kamu" },
  { label: "Verifikasi ID" },
  { label: "Selesai!" },
];

const NICHES = [
  { emoji: "💄", label: "Beauty" },
  { emoji: "✈️", label: "Travel" },
  { emoji: "🍕", label: "Food" },
  { emoji: "👗", label: "Fashion" },
  { emoji: "💻", label: "Tech" },
  { emoji: "🏋️", label: "Fitness" },
  { emoji: "📚", label: "Education" },
  { emoji: "🎮", label: "Gaming" },
  { emoji: "🎵", label: "Music" },
  { emoji: "🌿", label: "Lifestyle" },
  { emoji: "😂", label: "Comedy" },
  { emoji: "🎨", label: "Art" },
];

const PERKS = [
  { emoji: "💰", title: "Dapat Dibayar", desc: "Terima pembayaran langsung dari brand ternama" },
  { emoji: "🚀", title: "Berkembang Cepat", desc: "Akses tools eksklusif untuk grow audiens" },
  { emoji: "🤝", title: "Kolaborasi Eksklusif", desc: "Koneksi dengan 500+ brand premium Indonesia" },
];

const FLOATING = ["✨", "🌟", "💫", "⭐", "🔥", "💎", "🎯", "🎉"];

interface Confetti { id: number; x: number; y: number; color: string; rotation: number; size: number; delay: number; }

function generateConfetti(count = 50): Confetti[] {
  const colors = ["#2563EB", "#16A34A", "#F97316", "#7C3AED", "#EF4444", "#F59E0B"];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: -10 - Math.random() * 20,
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * 360,
    size: 6 + Math.random() * 8,
    delay: Math.random() * 2,
  }));
}

export default function ApplyWizard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", niches: [] as string[], ig: "", tiktok: "", youtube: "", reel: "", post: "", story: "", video: "" });
  const [verifying, setVerifying] = useState<string | null>(null);
  const [verified, setVerified] = useState<Record<string, string>>({});
  const [ktpUploaded, setKtpUploaded] = useState(false);
  const [selfieUploaded, setSelfieUploaded] = useState(false);
  const [confetti] = useState<Confetti[]>(generateConfetti(50));

  const setField = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const toggleNiche = (n: string) =>
    setForm(f => ({
      ...f,
      niches: f.niches.includes(n) ? f.niches.filter(x => x !== n) : f.niches.length < 3 ? [...f.niches, n] : f.niches,
    }));

  const simulateVerify = (platform: string, handle: string) => {
    if (!handle) return;
    setVerifying(platform);
    setTimeout(() => {
      setVerifying(null);
      const count = platform === "instagram" ? "284K" : platform === "tiktok" ? "152K" : "50K";
      setVerified(v => ({ ...v, [platform]: count }));
    }, 1400);
  };

  const canContinue = () => {
    if (step === 1) return form.name && form.email;
    if (step === 2) return form.niches.length > 0;
    return true;
  };

  const progress = (step / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8"
      style={{ background: "var(--ch-bg)" }}>

      {/* Confetti on step 6 */}
      {step === 6 && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
          {confetti.map((c) => (
            <div key={c.id}
              className="absolute rounded-sm"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                width: c.size,
                height: c.size / 2,
                background: c.color,
                transform: `rotate(${c.rotation}deg)`,
                animation: `fall 2.5s ease-in ${c.delay}s forwards`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fall {
          to { transform: translateY(110vh) rotate(720deg); opacity: 0; }
        }
        @keyframes floatEmoji {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }
      `}</style>

      {/* Progress bar */}
      {step > 0 && step < 6 && (
        <div className="w-full max-w-lg mb-6">
          <div className="flex items-center justify-between text-[12px] mb-2"
            style={{ color: "var(--ch-text-muted)" }}>
            <span>Langkah {step} dari {STEPS.length - 2}</span>
            <span className="font-semibold" style={{ color: "var(--ch-primary)" }}>{STEPS[step].label}</span>
          </div>
          <div className="w-full rounded-full h-1.5" style={{ background: "var(--ch-border)" }}>
            <div className="h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%`, background: "var(--ch-primary)" }} />
          </div>
        </div>
      )}

      {/* Card */}
      <div className="w-full max-w-lg rounded-2xl border overflow-hidden"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-lg)" }}>

        {/* Step 0: Welcome */}
        {step === 0 && (
          <div className="p-8 text-center">
            <div className="relative w-20 h-20 mx-auto mb-5">
              {FLOATING.slice(0, 6).map((e, i) => (
                <span key={i} className="absolute text-xl"
                  style={{
                    top: `${20 + Math.sin(i * 1.05) * 30}%`,
                    left: `${50 + Math.cos(i * 1.05) * 45}%`,
                    animation: `floatEmoji ${1.5 + i * 0.3}s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}>
                  {e}
                </span>
              ))}
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
                style={{ background: "linear-gradient(135deg, var(--ch-primary), #7C3AED)" }}>
                🎯
              </div>
            </div>
            <h1 className="text-[26px] font-extrabold mb-2"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Jadi Kreator CreatorHub!
            </h1>
            <p className="text-[14px] mb-6" style={{ color: "var(--ch-text-muted)" }}>
              Bergabung dengan 10.000+ kreator Indonesia yang sudah menghasilkan dari konten mereka
            </p>
            <div className="space-y-3 mb-7">
              {PERKS.map((p) => (
                <div key={p.title} className="flex items-center gap-3 p-3 rounded-xl text-left"
                  style={{ background: "var(--ch-bg)" }}>
                  <span className="text-2xl shrink-0">{p.emoji}</span>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{p.title}</p>
                    <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(1)}
              className="w-full py-3 rounded-xl text-white text-[14px] font-bold flex items-center justify-center gap-2"
              style={{ background: "var(--ch-primary)", boxShadow: "var(--ch-nav-shadow)" }}>
              Let's go! 🚀
            </button>
          </div>
        )}

        {/* Step 1: About you */}
        {step === 1 && (
          <div className="p-8">
            <h2 className="text-[22px] font-extrabold mb-1"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Tentang Kamu 👤
            </h2>
            <p className="text-[13px] mb-5" style={{ color: "var(--ch-text-muted)" }}>
              Ceritakan sedikit tentang dirimu
            </p>
            <div className="space-y-3">
              {[
                { label: "Nama Lengkap *", field: "name" as const, placeholder: "Nama kamu" },
                { label: "Email *", field: "email" as const, placeholder: "email@kamu.com", type: "email" },
                { label: "No. WhatsApp", field: "phone" as const, placeholder: "+62 xxx xxxx xxxx" },
                { label: "Kota Domisili", field: "city" as const, placeholder: "Jakarta, Bandung, dll" },
              ].map((f) => (
                <div key={f.field} className="space-y-1">
                  <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{f.label}</label>
                  <Input type={f.type} placeholder={f.placeholder} value={form[f.field]} onChange={setField(f.field)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Niche */}
        {step === 2 && (
          <div className="p-8">
            <h2 className="text-[22px] font-extrabold mb-1"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Niche Kamu 🎯
            </h2>
            <p className="text-[13px] mb-5" style={{ color: "var(--ch-text-muted)" }}>
              Pilih hingga 3 kategori yang paling cocok
            </p>
            <div className="grid grid-cols-3 gap-2">
              {NICHES.map((n) => {
                const selected = form.niches.includes(n.label);
                return (
                  <button key={n.label} onClick={() => toggleNiche(n.label)}
                    className="p-3 rounded-xl border text-center transition-all"
                    style={selected
                      ? { borderColor: "var(--ch-primary)", background: "var(--ch-primary-50)" }
                      : { borderColor: "var(--ch-border)", background: "var(--ch-bg)" }}>
                    <div className="text-xl mb-0.5">{n.emoji}</div>
                    <p className="text-[12px] font-semibold"
                      style={{ color: selected ? "var(--ch-primary)" : "var(--ch-text-muted)" }}>
                      {n.label}
                    </p>
                  </button>
                );
              })}
            </div>
            <p className="text-[11px] mt-3 text-center" style={{ color: "var(--ch-text-soft)" }}>
              {form.niches.length}/3 dipilih
            </p>
          </div>
        )}

        {/* Step 3: Socials */}
        {step === 3 && (
          <div className="p-8">
            <h2 className="text-[22px] font-extrabold mb-1"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Sosial Media 📱
            </h2>
            <p className="text-[13px] mb-5" style={{ color: "var(--ch-text-muted)" }}>
              Masukkan username dan verifikasi akun kamu
            </p>
            <div className="space-y-4">
              {[
                { field: "ig" as const, label: "Instagram", icon: <Instagram style={{ width: 16, height: 16 }} />, color: "#E1306C", placeholder: "@username" },
                { field: "tiktok" as const, label: "TikTok", icon: <span className="text-sm">📱</span>, color: "#010101", placeholder: "@username" },
                { field: "youtube" as const, label: "YouTube", icon: <Youtube style={{ width: 16, height: 16 }} />, color: "#FF0000", placeholder: "Channel name" },
              ].map((p) => {
                const platform = p.field;
                const isVerifying = verifying === platform;
                const followerCount = verified[platform];
                return (
                  <div key={platform}>
                    <label className="text-[12px] font-semibold mb-1.5 flex items-center gap-1.5"
                      style={{ color: "var(--ch-text-muted)" }}>
                      <span className="w-5 h-5 rounded-md flex items-center justify-center text-white text-[10px]"
                        style={{ background: p.color }}>{p.icon}</span>
                      {p.label}
                    </label>
                    <div className="flex gap-2">
                      <Input placeholder={p.placeholder} value={form[platform]} onChange={setField(platform)} className="flex-1" />
                      <button
                        onClick={() => simulateVerify(platform, form[platform])}
                        disabled={isVerifying || !!followerCount}
                        className="px-3 py-2 rounded-lg text-[12px] font-semibold shrink-0 transition-colors"
                        style={followerCount
                          ? { background: "#DCFCE7", color: "#15803D" }
                          : isVerifying
                            ? { background: "var(--ch-border)", color: "var(--ch-text-muted)" }
                            : { background: "var(--ch-primary)", color: "white" }}>
                        {isVerifying ? "..." : followerCount ? `✓ ${followerCount}` : "Verify"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4: Rates */}
        {step === 4 && (
          <div className="p-8">
            <h2 className="text-[22px] font-extrabold mb-1"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Rate Kamu 💰
            </h2>
            <p className="text-[13px] mb-5" style={{ color: "var(--ch-text-muted)" }}>
              Tetapkan harga per konten (kamu bisa ubah kapan saja)
            </p>
            <div className="space-y-4">
              {[
                { label: "IG / TikTok Reel (60s)", field: "reel" as const, hint: "Rata-rata kreator: Rp 1–5jt" },
                { label: "Feed Post / Photo", field: "post" as const, hint: "Rata-rata kreator: Rp 500rb–2jt" },
                { label: "Story (3 frame)", field: "story" as const, hint: "Rata-rata kreator: Rp 300rb–1jt" },
                { label: "YouTube Video (10+ mnt)", field: "video" as const, hint: "Rata-rata kreator: Rp 3–15jt" },
              ].map((r) => (
                <div key={r.field} className="space-y-1">
                  <label className="text-[12px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>{r.label}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[12px] font-semibold"
                      style={{ color: "var(--ch-text-soft)" }}>Rp</span>
                    <Input type="number" placeholder="0" value={form[r.field]} onChange={setField(r.field)} className="pl-8" />
                  </div>
                  <p className="text-[11px]" style={{ color: "var(--ch-text-soft)" }}>{r.hint}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Verify ID */}
        {step === 5 && (
          <div className="p-8">
            <h2 className="text-[22px] font-extrabold mb-1"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Verifikasi Identitas 🪪
            </h2>
            <p className="text-[13px] mb-5" style={{ color: "var(--ch-text-muted)" }}>
              Diperlukan untuk keamanan dan kepercayaan brand
            </p>
            <div className="space-y-4">
              {[
                { label: "KTP (Foto KTP jelas)", uploaded: ktpUploaded, onUpload: () => { setKtpUploaded(true); } },
                { label: "Selfie dengan KTP", uploaded: selfieUploaded, onUpload: () => { setSelfieUploaded(true); } },
              ].map((doc) => (
                <div key={doc.label} className="rounded-xl border-2 border-dashed p-5 text-center transition-colors"
                  style={doc.uploaded
                    ? { borderColor: "#16A34A", background: "#ECFDF5" }
                    : { borderColor: "var(--ch-border)", background: "var(--ch-bg)", cursor: "pointer" }}
                  onClick={!doc.uploaded ? doc.onUpload : undefined}>
                  {doc.uploaded ? (
                    <div>
                      <CheckCircle style={{ width: 28, height: 28, margin: "0 auto 6px", color: "#16A34A" }} />
                      <p className="text-[13px] font-semibold" style={{ color: "#16A34A" }}>Uploaded</p>
                      <p className="text-[11px]" style={{ color: "#065F46" }}>{doc.label}</p>
                    </div>
                  ) : (
                    <div>
                      <Upload style={{ width: 24, height: 24, margin: "0 auto 8px", color: "var(--ch-text-soft)" }} />
                      <p className="text-[13px] font-medium" style={{ color: "var(--ch-text-muted)" }}>{doc.label}</p>
                      <p className="text-[11px] mt-1" style={{ color: "var(--ch-text-soft)" }}>Klik untuk upload · JPG, PNG · Maks 5MB</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-xl flex items-start gap-2"
              style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
              <span className="shrink-0">🔒</span>
              <p className="text-[12px]">Data identitas kamu dienkripsi dan hanya digunakan untuk verifikasi. Tidak pernah dibagikan ke pihak lain.</p>
            </div>
          </div>
        )}

        {/* Step 6: Done */}
        {step === 6 && (
          <div className="p-8 text-center">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl mb-5 shadow-lg"
              style={{ background: "linear-gradient(135deg, #16A34A, #4ade80)" }}>
              🎉
            </div>
            <h2 className="text-[26px] font-extrabold mb-2"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Kamu Sudah Terdaftar!
            </h2>
            <p className="text-[14px] mb-6" style={{ color: "var(--ch-text-muted)" }}>
              Selamat {form.name || "Kreator"}! Aplikasi kamu sedang diproses.
            </p>
            <div className="space-y-3 text-left mb-6">
              {[
                { emoji: "📧", title: "Cek Email Kamu", desc: `Konfirmasi dikirim ke ${form.email || "email kamu"}` },
                { emoji: "⏳", title: "Proses Verifikasi (1–2 hari kerja)", desc: "Tim kami akan mereview profil kamu" },
                { emoji: "🚀", title: "Mulai Terima Undangan Brand", desc: "Profil kamu akan live di marketplace" },
              ].map((s) => (
                <div key={s.title} className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "var(--ch-bg)" }}>
                  <span className="text-xl shrink-0">{s.emoji}</span>
                  <div>
                    <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{s.title}</p>
                    <p className="text-[12px]" style={{ color: "var(--ch-text-muted)" }}>{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} style={{ width: 20, height: 20, fill: "#FCD34D", color: "#FCD34D" }} />
              ))}
            </div>
            <a href="/dashboard/kreator/home"
              className="block w-full py-3 rounded-xl text-white text-[14px] font-bold text-center"
              style={{ background: "#16A34A", boxShadow: "0 4px 10px -3px rgba(22,163,74,.45)" }}>
              Masuk ke Creator Portal →
            </a>
          </div>
        )}

        {/* Bottom nav */}
        {step > 0 && step < 6 && (
          <div className="px-8 py-4 border-t flex items-center justify-between"
            style={{ borderColor: "var(--ch-border)" }}>
            <button onClick={() => setStep(s => s - 1)}
              className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-lg border transition-colors"
              style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}>
              <ChevronLeft style={{ width: 14, height: 14 }} /> Back
            </button>
            <div className="flex gap-1.5">
              {STEPS.slice(1, -1).map((_, i) => (
                <div key={i} className="rounded-full transition-all"
                  style={{
                    width: step - 1 === i ? 20 : 6,
                    height: 6,
                    background: step - 1 === i ? "var(--ch-primary)" : "var(--ch-border)",
                  }} />
              ))}
            </div>
            {step < 5 ? (
              <button onClick={() => canContinue() && setStep(s => s + 1)}
                className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-lg text-white transition-opacity"
                style={{ background: canContinue() ? "var(--ch-primary)" : "var(--ch-border)" }}>
                Lanjut <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            ) : (
              <button onClick={() => setStep(6)}
                className="flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-lg text-white"
                style={{ background: "#16A34A" }}>
                Submit <CheckCircle style={{ width: 14, height: 14 }} />
              </button>
            )}
          </div>
        )}
      </div>

      {step > 0 && step < 6 && (
        <button onClick={() => setStep(s => s + 1)}
          className="mt-4 text-[12px] transition-colors"
          style={{ color: "var(--ch-text-soft)" }}>
          Lewati untuk sekarang →
        </button>
      )}
    </div>
  );
}
