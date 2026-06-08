import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, DollarSign, Calendar, Users, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useCampaign, useDeleteCampaign } from "@/hooks/useCampaigns";
import { formatRupiah } from "@/lib/utils";

const statusVariant: Record<string, "default" | "success" | "secondary" | "warning"> = {
  active: "success",
  draft: "secondary",
  completed: "default",
  paused: "warning",
};

const statusLabel: Record<string, string> = {
  active: "Aktif",
  draft: "Draft",
  completed: "Selesai",
  paused: "Dijeda",
};

export default function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: campaign, isLoading } = useCampaign(id ?? "");
  const deleteMutation = useDeleteCampaign();

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
            <Card key={i}><CardContent className="p-5"><Skeleton className="h-16" /></CardContent></Card>
          ))}
        </div>
        <Skeleton className="h-48" />
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="p-6 text-center">
        <p className="text-slate-500">Kampanye tidak ditemukan.</p>
        <Button className="mt-4" onClick={() => navigate("/campaigns")}>Kembali</Button>
      </div>
    );
  }

  const creators = campaign.creators ?? [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate("/campaigns")} className="mt-1">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-800">{campaign.title}</h1>
            <Badge variant={statusVariant[campaign.status]}>{statusLabel[campaign.status]}</Badge>
          </div>
          {campaign.description && (
            <p className="text-sm text-slate-500 mt-1">{campaign.description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-red-500"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Budget</p>
              <p className="text-lg font-bold text-slate-800">{formatRupiah(campaign.budget)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Kreator</p>
              <p className="text-lg font-bold text-slate-800">{creators.length} bergabung</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-slate-500">Dibuat</p>
              <p className="text-lg font-bold text-slate-800">
                {new Date(campaign.createdAt).toLocaleDateString("id-ID")}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Creators list */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Kreator dalam Kampanye</CardTitle>
        </CardHeader>
        <CardContent>
          {creators.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">Belum ada kreator yang ditambahkan</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate("/marketplace")}>
                Cari Kreator di Marketplace
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {creators.map((c) => (
                <div key={c.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0">
                    {c.imageUrl ? (
                      <img src={c.imageUrl} alt={c.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-semibold text-slate-600">
                        {c.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-sm font-medium text-slate-800 truncate">{c.name}</p>
                      {c.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500 shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500">{c.city} · {c.followersText} followers</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-700">{c.priceText}</p>
                    <p className="text-xs text-slate-400 capitalize">{c.category}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" onClick={() => navigate("/campaigns")}>
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Kampanye
        </Button>
        <Button onClick={() => navigate("/marketplace")}>
          + Tambah Kreator
        </Button>
      </div>
    </div>
  );
}
