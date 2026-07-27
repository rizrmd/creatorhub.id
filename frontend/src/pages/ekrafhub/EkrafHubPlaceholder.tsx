import { Construction } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export default function EkrafHubPlaceholder({ title, description }: Props) {
  return (
    <div className="p-4 md:p-6" style={{ background: "var(--ch-bg)" }}>
      <div className="rounded-xl border p-12 text-center"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}>
        <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
          style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
          <Construction className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold mb-2" style={{ color: "var(--ch-text)" }}>{title}</h2>
        <p className="text-[14px] max-w-md mx-auto" style={{ color: "var(--ch-text-muted)" }}>{description}</p>
      </div>
    </div>
  );
}
