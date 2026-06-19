import { useParams, useNavigate } from "react-router-dom";
import { useSetBreadcrumbTitle } from "@/contexts/BreadcrumbContext";
import { ArrowLeft, Coins, Calendar, Users, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampaign, useDeleteCampaign } from "@/hooks/useCampaigns";
import { formatRupiah } from "@/lib/utils";
import { CAMPAIGN_STATUS, type CampaignStatus } from "@/types";

function StatusBadge({ status }: { status: CampaignStatus }) {
  const s = CAMPAIGN_STATUS[status] ?? CAMPAIGN_STATUS.draft;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold"
      style={{ background: s.bg, color: s.fg }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: campaign, isLoading } = useCampaign(id ?? "");
  const deleteMutation = useDeleteCampaign();

  useSetBreadcrumbTitle(campaign?.title);

  const handleDelete = async () => {
    if (!id) return;
    await deleteMutation.mutateAsync(id);
    navigate("/campaigns");
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-5"
              style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}>
              <Skeleton className="h-16" />
            </div>
          ))}
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-6 text-center">
        <p style={{ color: "var(--ch-text-muted)" }}>Kampanye tidak ditemukan.</p>
        <Button className="mt-4" onClick={() => navigate("/campaigns")}>Kembali</Button>
      </div>
    );
  }

  const creators = campaign.creators ?? [];

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      {/* Header */}
      <div className="flex items-start gap-4">
        <button
          onClick={() => navigate("/campaigns")}
          className="mt-1 w-9 h-9 rounded-lg border flex items-center justify-center transition-colors hover:bg-slate-50"
          style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1
              className="text-[24px] font-extrabold tracking-[-0.5px]"
              style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {campaign.title}
            </h1>
            <StatusBadge status={campaign.status as CampaignStatus} />
          </div>
          {campaign.description && (
            <p className="text-[13px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
              {campaign.description}
            </p>
          )}
        </div>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="w-9 h-9 rounded-lg border flex items-center justify-center transition-colors hover:bg-red-50 hover:border-red-200 disabled:opacity-50"
          style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-soft)" }}
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Budget", value: formatRupiah(campaign.budget), icon: Coins, hue: 42 },
          { label: "Kreator", value: `${creators.length} bergabung`, icon: Users, hue: 220 },
          { label: "Dibuat", value: new Date(campaign.createdAt).toLocaleDateString("id-ID"), icon: Calendar, hue: 142 },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl border p-5 flex items-center gap-4"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: `hsl(${stat.hue}, 80%, 95%)`, color: `hsl(${stat.hue}, 60%, 40%)` }}
            >
              <stat.icon style={{ width: 18, height: 18 }} />
            </div>
            <div>
              <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>{stat.label}</p>
              <p
                className="text-[18px] font-extrabold"
                style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
              >
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Creators list */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}
      >
        <div className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "var(--ch-border)" }}>
          <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>
            Kreator dalam Kampanye
          </p>
          <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}>
            {creators.length} kreator
          </span>
        </div>
        <div className="p-5">
          {creators.length === 0 ? (
            <div className="text-center py-8">
              <Users style={{ width: 40, height: 40, margin: "0 auto 8px", opacity: 0.3, color: "var(--ch-text-soft)" }} />
              <p className="text-[13px] mb-3" style={{ color: "var(--ch-text-muted)" }}>
                Belum ada kreator yang ditambahkan
              </p>
              <button
                onClick={() => navigate("/marketplace")}
                className="px-4 py-2 rounded-lg border text-[13px] font-semibold transition-colors hover:bg-blue-50"
                style={{ borderColor: "var(--ch-primary)", color: "var(--ch-primary)" }}
              >
                Cari Kreator di Content Creators
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              {creators.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ background: "var(--ch-bg)" }}
                >
                  <div
                    className="w-10 h-10 rounded-full overflow-hidden shrink-0 flex items-center justify-center font-semibold text-[14px]"
                    style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}
                  >
                    {c.imageUrl ? (
                      <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      c.name[0]
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-[13px] font-semibold truncate" style={{ color: "var(--ch-text)" }}>
                        {c.name}
                      </p>
                      {c.verified && (
                        <CheckCircle style={{ width: 13, height: 13, color: "#2563EB", flexShrink: 0 }} />
                      )}
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--ch-text-muted)" }}>
                      {c.city} · {c.followersText} followers
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[13px] font-bold" style={{ color: "var(--ch-text)" }}>{c.priceText}</p>
                    <p className="text-[11px] capitalize" style={{ color: "var(--ch-text-soft)" }}>{c.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={() => navigate("/campaigns")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border text-[13px] font-semibold transition-colors hover:bg-slate-50"
          style={{ borderColor: "var(--ch-border)", color: "var(--ch-text-muted)" }}
        >
          <ArrowLeft style={{ width: 14, height: 14 }} />
          Kembali ke Kampanye
        </button>
        <button
          onClick={() => navigate("/marketplace")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white text-[13px] font-semibold transition-opacity hover:opacity-90"
          style={{ background: "var(--ch-primary)", boxShadow: "var(--ch-nav-shadow)" }}
        >
          + Tambah Kreator
        </button>
      </div>
    </div>
  );
}
