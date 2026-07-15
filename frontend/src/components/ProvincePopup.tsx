import { X, MapPin, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";

interface Creator {
  name: string;
  img?: string;
}

interface ProvincePopupProps {
  province: string;
  count: number;
  creators: Creator[];
  onClose: () => void;
}

const AVATAR_COLORS = [
  "from-blue-500 to-blue-600",
  "from-orange-500 to-red-500",
  "from-green-500 to-emerald-600",
  "from-purple-500 to-violet-600",
  "from-pink-500 to-rose-500",
  "from-teal-500 to-cyan-500",
  "from-amber-500 to-yellow-500",
  "from-indigo-500 to-blue-700",
];

function getAvatarColor(name: string): string {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function CreatorAvatar({ creator, size = "md" }: { creator: Creator; size?: "sm" | "md" }) {
  const sizeClasses = size === "md" ? "w-9 h-9 text-[12px]" : "w-7 h-7 text-[10px]";
  const hasPhoto = !!creator.img;

  if (hasPhoto) {
    return (
      <img
        src={`/creators/${creator.img}`}
        alt={creator.name}
        className={`${sizeClasses} rounded-full object-cover ring-2 ring-[var(--ch-surface)]`}
        onError={(e) => {
          (e.target as HTMLImageElement).style.display = "none";
          (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
        }}
      />
    );
  }

  return (
    <>
      <div className={`${sizeClasses} rounded-full bg-gradient-to-br ${getAvatarColor(creator.name)} flex items-center justify-center text-white font-bold ring-2 ring-[var(--ch-surface)] shrink-0`}>
        {creator.name[0]}
      </div>
    </>
  );
}

export default function ProvincePopup({ province, count, creators, onClose }: ProvincePopupProps) {
  const displayed = creators.slice(0, 4);
  const remaining = count - displayed.length;

  return (
    <div className="absolute z-50 animate-slide-in" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
      <div className="rounded-xl border p-4 w-72" style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 w-5 h-5 rounded-md flex items-center justify-center hover:bg-white/10 transition-colors">
          <X className="w-3 h-3" style={{ color: "var(--ch-text-muted)" }} />
        </button>

        {/* Province header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <h4 className="text-[13px] font-bold" style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {province}
            </h4>
            <p className="text-[10px]" style={{ color: "var(--ch-text-muted)" }}>
              {count} Content Creator{count !== 1 ? "s" : ""} Registered
            </p>
          </div>
        </div>

        {/* Creator avatars */}
        <div className="flex items-center gap-1 mb-3">
          {displayed.map((c, i) => (
            <div key={i} className="relative group">
              <CreatorAvatar creator={c} />
              <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded text-[9px] font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: "var(--ch-bg)", color: "var(--ch-text)", border: "1px solid var(--ch-border)" }}>
                {c.name}
              </div>
            </div>
          ))}
          {remaining > 0 && (
            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[11px] font-bold" style={{ color: "var(--ch-text-muted)" }}>
              +{remaining}
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-2 mb-3">
          <div className="flex-1 rounded-lg p-2 text-center" style={{ background: "var(--ch-bg)" }}>
            <p className="text-[14px] font-extrabold" style={{ color: "var(--ch-text)" }}>{count}</p>
            <p className="text-[9px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Creators</p>
          </div>
          <div className="flex-1 rounded-lg p-2 text-center" style={{ background: "var(--ch-bg)" }}>
            <p className="text-[14px] font-extrabold text-orange-400">{Math.floor(count * 0.3)}</p>
            <p className="text-[9px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Active</p>
          </div>
          <div className="flex-1 rounded-lg p-2 text-center" style={{ background: "var(--ch-bg)" }}>
            <p className="text-[14px] font-extrabold text-green-400">{Math.floor(count * 0.15)}</p>
            <p className="text-[9px] font-semibold" style={{ color: "var(--ch-text-muted)" }}>Verified</p>
          </div>
        </div>

        {/* Action */}
        <Link
          to="/dashboard/marketplace"
          className="flex items-center justify-center gap-1.5 w-full px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold transition-colors"
        >
          View All in Marketplace <ExternalLink className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
