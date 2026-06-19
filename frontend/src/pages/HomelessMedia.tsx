import { Newspaper } from "lucide-react";

export default function HomelessMedia() {
  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <div>
        <h1 className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Homeless Media
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Kelola dan pantau media tanpa afiliasi
        </p>
      </div>

      <div className="rounded-xl border p-12 flex flex-col items-center justify-center text-center"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
          style={{ background: "var(--ch-primary-50)" }}>
          <Newspaper className="w-8 h-8" style={{ color: "var(--ch-primary)" }} />
        </div>
        <p className="text-lg font-bold" style={{ color: "var(--ch-text)" }}>Coming Soon</p>
        <p className="text-sm mt-1 max-w-md" style={{ color: "var(--ch-text-muted)" }}>
          Fitur Homeless Media sedang dalam pengembangan. Nantikan pembaruan selanjutnya.
        </p>
      </div>
    </div>
  );
}
