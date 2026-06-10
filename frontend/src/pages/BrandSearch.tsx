import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Search,
  Users,
  Megaphone,
  MessageSquare,
  ChevronRight,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreators } from "@/hooks/useCreators";
import { useCampaigns } from "@/hooks/useCampaigns";
import { useChatChannels } from "@/hooks/useMessages";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";
import { filterCampaigns, filterChatChannels } from "@/lib/brandSearch";
import { formatRupiah } from "@/lib/utils";
import { CAMPAIGN_STATUS } from "@/types";
import type { Campaign, ChatChannel, Creator } from "@/types";

function ResultCard({
  title,
  subtitle,
  meta,
  onClick,
}: {
  title: string;
  subtitle: string;
  meta?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border p-4 flex items-center gap-3 text-left transition-all hover:shadow-md hover:border-blue-200"
      style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold truncate" style={{ color: "var(--ch-text)" }}>{title}</p>
        <p className="text-[12px] mt-0.5 truncate" style={{ color: "var(--ch-text-muted)" }}>{subtitle}</p>
        {meta && <p className="text-[11px] mt-0.5" style={{ color: "var(--ch-text-soft)" }}>{meta}</p>}
      </div>
      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "var(--ch-text-soft)" }} />
    </button>
  );
}

function SearchSection({
  label,
  icon: Icon,
  count,
  href,
  query,
  loading,
  children,
}: {
  label: string;
  icon: React.ElementType;
  count: number;
  href: string;
  query: string;
  loading?: boolean;
  children: React.ReactNode;
}) {
  const navigate = useNavigate();
  if (!loading && count === 0) return null;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon style={{ width: 16, height: 16, color: "var(--ch-primary)" }} />
          <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>{label}</p>
          {!loading && (
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}
            >
              {count}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => navigate(query ? `${href}?search=${encodeURIComponent(query)}` : href)}
          className="text-[12px] font-semibold hover:underline"
          style={{ color: "var(--ch-primary)" }}
        >
          Lihat semua
        </button>
      </div>
      <div className="space-y-2">
        {loading ? (
          <>
            <Skeleton className="h-16 w-full rounded-xl" />
            <Skeleton className="h-16 w-full rounded-xl" />
          </>
        ) : (
          children
        )}
      </div>
    </section>
  );
}

export default function BrandSearch() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const debouncedSearch = useDebouncedValue(search, 300);

  useEffect(() => {
    if (!searchParams.has("search")) return;
    setSearch(searchParams.get("search") ?? "");
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const hasQuery = !!debouncedSearch.trim();

  const { data: creatorsData, isLoading: loadingCreators } = useCreators({
    search: hasQuery ? debouncedSearch : undefined,
    pageSize: 10,
    verified: undefined,
  });
  const { data: campaigns, isLoading: loadingCampaigns } = useCampaigns();
  const { data: channels, isLoading: loadingChannels } = useChatChannels();

  const creators = creatorsData?.data ?? [];
  const matchedCampaigns = useMemo(
    () => filterCampaigns(campaigns ?? [], debouncedSearch),
    [campaigns, debouncedSearch],
  );
  const matchedChannels = useMemo(
    () => filterChatChannels(channels ?? [], debouncedSearch),
    [channels, debouncedSearch],
  );

  const total = hasQuery
    ? (creatorsData?.total ?? 0) + matchedCampaigns.length + matchedChannels.length
    : 0;

  const renderCreator = (creator: Creator) => (
    <ResultCard
      key={creator.id}
      title={creator.name}
      subtitle={`${creator.city} · ${creator.category}`}
      meta={`${creator.followersText} · ${creator.priceText} · ⭐ ${creator.rating}`}
      onClick={() => navigate("/marketplace")}
    />
  );

  const renderCampaign = (campaign: Campaign) => {
    const status = CAMPAIGN_STATUS[campaign.status];
    return (
      <ResultCard
        key={campaign.id}
        title={campaign.title}
        subtitle={campaign.brand ?? campaign.description.slice(0, 60)}
        meta={`${formatRupiah(campaign.budget)} · ${status?.label ?? campaign.status}`}
        onClick={() => navigate(`/campaigns/${campaign.id}`)}
      />
    );
  };

  const renderChannel = (channel: ChatChannel) => (
    <ResultCard
      key={channel.id}
      title={channel.creatorName}
      subtitle={channel.lastMessage}
      meta={channel.unreadCount > 0 ? `${channel.unreadCount} belum dibaca` : undefined}
      onClick={() => navigate("/messages")}
    />
  );

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <div>
        <h1
          className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
          style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
        >
          Pencarian
        </h1>
        <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
          Cari kreator, kampanye, dan percakapan di seluruh platform
        </p>
      </div>

      <div className="relative max-w-2xl">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-soft)" }} />
        <input
          autoFocus
          className="w-full rounded-xl border pl-9 pr-3 py-3 text-[14px] outline-none"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
          placeholder="Cari kreator, kampanye, pesan…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {!hasQuery ? (
        <div
          className="rounded-xl border p-6 text-center"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}
        >
          <Search style={{ width: 28, height: 28, margin: "0 auto 12px", color: "var(--ch-text-soft)", opacity: 0.5 }} />
          <p className="text-[14px] font-medium" style={{ color: "var(--ch-text-muted)" }}>
            Ketik kata kunci untuk mencari kreator, kampanye, atau pesan
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {[
              { label: "Kreator", icon: Users },
              { label: "Kampanye", icon: Megaphone },
              { label: "Pesan", icon: MessageSquare },
            ].map((s) => (
              <span
                key={s.label}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold"
                style={{ background: "var(--ch-primary-50)", color: "var(--ch-primary)" }}
              >
                <s.icon style={{ width: 12, height: 12 }} />
                {s.label}
              </span>
            ))}
          </div>
        </div>
      ) : total === 0 && !loadingCreators && !loadingCampaigns && !loadingChannels ? (
        <div className="py-16 text-center" style={{ color: "var(--ch-text-soft)" }}>
          <Search style={{ width: 32, height: 32, margin: "0 auto 12px", opacity: 0.4 }} />
          <p className="text-[14px] font-medium">Tidak ada hasil untuk &quot;{debouncedSearch}&quot;</p>
          <p className="text-[12px] mt-1">Coba nama kreator, judul kampanye, atau kata kunci lain</p>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>
            <strong style={{ color: "var(--ch-text)" }}>{total} hasil</strong> untuk &quot;{debouncedSearch}&quot;
          </p>

          <SearchSection
            label="Kreator"
            icon={Users}
            count={creatorsData?.total ?? 0}
            href="/marketplace"
            query={debouncedSearch}
            loading={loadingCreators}
          >
            {creators.map(renderCreator)}
          </SearchSection>

          <SearchSection
            label="Kampanye"
            icon={Megaphone}
            count={matchedCampaigns.length}
            href="/campaigns"
            query={debouncedSearch}
            loading={loadingCampaigns}
          >
            {matchedCampaigns.map(renderCampaign)}
          </SearchSection>

          <SearchSection
            label="Pesan"
            icon={MessageSquare}
            count={matchedChannels.length}
            href="/messages"
            query={debouncedSearch}
            loading={loadingChannels}
          >
            {matchedChannels.map(renderChannel)}
          </SearchSection>
        </div>
      )}
    </div>
  );
}