import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const RESTRICTED_EMAILS: string[] = ["itsbanuun@creatorhub.id"];
const RESTRICTED_PATHS: string[] = [
  "/dashboard/ekrafhub/creative-hub",
  "/dashboard/ekrafhub/creative-indonesia",
  "/dashboard/ekrafhub/media-monitoring",
];

export function isAccessRestricted(email: string | undefined, pathname: string): boolean {
  if (!email) return false;
  return RESTRICTED_EMAILS.includes(email.toLowerCase()) && RESTRICTED_PATHS.some((p) => pathname.startsWith(p));
}

export default function AccessRestricted() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: "rgba(239,68,68,.12)" }}>
        <ShieldAlert className="w-8 h-8 text-red-400" />
      </div>
      <h2 className="text-xl font-extrabold mb-2" style={{ color: "var(--ch-text)" }}>Akses Dibatasi</h2>
      <p className="text-sm text-center max-w-md mb-6" style={{ color: "var(--ch-text-muted)" }}>
        Akun Anda ({user?.email}) tidak memiliki akses ke halaman ini. Hubungi administrator jika Anda membutuhkan akses.
      </p>
      <button
        onClick={() => navigate("/dashboard/ekrafhub")}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        style={{ background: "var(--ch-primary)", color: "white" }}
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Dashboard
      </button>
    </div>
  );
}
