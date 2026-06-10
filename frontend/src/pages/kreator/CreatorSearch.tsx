import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Mail,
  Briefcase,
  Coins,
  MessageSquare,
  TrendingUp,
  Share2,
  ChevronRight,
} from "lucide-react";
import { useKreatorData } from "@/context/KreatorDataContext";
import {
  formatRp,
  searchKreatorContent,
  type KreatorInvitation,
  type KreatorMessageChannel,
  type KreatorPayment,
  type KreatorSearchResults,
  type KreatorTask,
  type PlatformInsight,
  type TopPost,
} from "@/data/kreatorData";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

const SECTIONS: {
  key: keyof Omit<KreatorSearchResults, "total">;
  label: string;
  href: string;
  icon: React.ElementType;
}[] = [
  { key: "invitations", label: "Undangan", href: "/kreator/invitations", icon: Mail },
  { key: "tasks", label: "Pekerjaan", href: "/kreator/work", icon: Briefcase },
  { key: "payments", label: "Pembayaran", href: "/kreator/earnings", icon: Coins },
  { key: "messages", label: "Pesan", href: "/kreator/messages", icon: MessageSquare },
  { key: "posts", label: "Konten Teratas", href: "/kreator/insights", icon: TrendingUp },
  { key: "platforms", label: "Platform", href: "/kreator/insights", icon: Share2 },
];

function ResultCard({
  title,
  subtitle,
  meta,
  to,
}: {
  title: string;
  subtitle: string;
  meta?: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="w-full rounded-xl border p-4 flex items-center gap-3 text-left cursor-pointer transition-all hover:shadow-md hover:border-green-200"
      style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", boxShadow: "var(--ch-shadow-sm)" }}
    >
      <div className="flex-1 min-w-0">
        <p className="text-[14px] font-bold truncate" style={{ color: "var(--ch-text)" }}>{title}</p>
        <p className="text-[12px] mt-0.5 truncate" style={{ color: "var(--ch-text-muted)" }}>{subtitle}</p>
        {meta && <p className="text-[11px] mt-0.5" style={{ color: "var(--ch-text-soft)" }}>{meta}</p>}
      </div>
      <ChevronRight className="w-4 h-4 shrink-0" style={{ color: "var(--ch-text-soft)" }} />
    </Link>
  );
}

function SearchSection({
  label,
  icon: Icon,
  count,
  href,
  query,
  children,
}: {
  label: string;
  icon: React.ElementType;
  count: number;
  href: string;
  query: string;
  children: React.ReactNode;
}) {
  if (count === 0) return null;
  const viewAllTo = query ? `${href}?search=${encodeURIComponent(query)}` : href;

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon style={{ width: 16, height: 16, color: "#16A34A" }} />
          <p className="text-[14px] font-bold" style={{ color: "var(--ch-text)" }}>{label}</p>
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: "#DCFCE7", color: "#15803D" }}
          >
            {count}
          </span>
        </div>
        <Link
          to={viewAllTo}
          className="text-[12px] font-semibold cursor-pointer hover:underline"
          style={{ color: "#16A34A" }}
        >
          Lihat semua
        </Link>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

export default function CreatorSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { invitations } = useKreatorData();
  const [search, setSearch] = useState(() => searchParams.get("search") ?? "");
  const debouncedSearch = useDebouncedValue(search, 250);

  useEffect(() => {
    if (!searchParams.has("search")) return;
    setSearch(searchParams.get("search") ?? "");
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams]);

  const results = useMemo(
    () => searchKreatorContent(debouncedSearch, invitations),
    [debouncedSearch, invitations],
  );

  const renderInvitation = (inv: KreatorInvitation) => (
    <ResultCard
      key={`inv-${inv.id}`}
      title={inv.campaign}
      subtitle={`${inv.brand} · ${inv.category}`}
      meta={formatRp(inv.budget)}
      to={`/kreator/invitations/${inv.id}`}
    />
  );

  const renderTask = (task: KreatorTask) => (
    <ResultCard
      key={`task-${task.id}`}
      title={task.deliverable}
      subtitle={`${task.brand} · ${task.campaign}`}
      meta={`Due ${new Date(task.due).toLocaleDateString("id-ID")}`}
      to="/kreator/work"
    />
  );

  const renderPayment = (payment: KreatorPayment) => (
    <ResultCard
      key={`pay-${payment.id}`}
      title={payment.campaign}
      subtitle={`${payment.brand} · ${payment.id}`}
      meta={`${formatRp(payment.amount)} · ${payment.status === "paid" ? "Lunas" : "Menunggu"}`}
      to="/kreator/earnings"
    />
  );

  const renderMessage = (channel: KreatorMessageChannel) => (
    <ResultCard
      key={`msg-${channel.id}`}
      title={channel.brand}
      subtitle={channel.campaign}
      meta={channel.lastMsg}
      to="/kreator/messages"
    />
  );

  const renderPost = (post: TopPost, index: number) => (
    <ResultCard
      key={`post-${index}`}
      title={post.content}
      subtitle={post.platform}
      meta={`${post.reach} reach · ${post.engagement} engagement`}
      to="/kreator/insights"
    />
  );

  const renderPlatform = (platform: PlatformInsight) => (
    <ResultCard
      key={`plat-${platform.name}`}
      title={platform.name}
      subtitle={`${platform.followers} followers · ${platform.eng} engagement`}
      meta={`${platform.posts} posts`}
      to="/kreator/insights"
    />
  );

  const renderers: Record<keyof Omit<KreatorSearchResults, "total">, (items: never[]) => React.ReactNode[]> = {
    invitations: (items) => (items as KreatorInvitation[]).map(renderInvitation),
    tasks: (items) => (items as KreatorTask[]).map(renderTask),
    payments: (items) => (items as KreatorPayment[]).map(renderPayment),
    messages: (items) => (items as KreatorMessageChannel[]).map(renderMessage),
    posts: (items) => (items as TopPost[]).map(renderPost),
    platforms: (items) => (items as PlatformInsight[]).map(renderPlatform),
  };

  return (
    <div className="p-4 md:p-6 space-y-6" style={{ background: "var(--ch-bg)" }}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1
            className="text-2xl md:text-[28px] font-extrabold tracking-[-0.5px]"
            style={{ color: "var(--ch-text)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
          >
            Pencarian
          </h1>
          <p className="text-[14px] mt-1" style={{ color: "var(--ch-text-muted)" }}>
            Cari undangan, pekerjaan, pembayaran, pesan, dan konten
          </p>
        </div>
        <div className="relative w-full sm:w-72 lg:w-80 shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--ch-text-soft)" }} />
          <input
            autoFocus
            className="w-full rounded-xl border pl-9 pr-3 py-2.5 text-[13px] outline-none"
            style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)", color: "var(--ch-text)" }}
            placeholder="Cari undangan, pekerjaan, pembayaran, pesan…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {!debouncedSearch.trim() ? (
        <div
          className="rounded-xl border p-6 text-center"
          style={{ background: "var(--ch-surface)", borderColor: "var(--ch-border)" }}
        >
          <Search style={{ width: 28, height: 28, margin: "0 auto 12px", color: "var(--ch-text-soft)", opacity: 0.5 }} />
          <p className="text-[14px] font-medium" style={{ color: "var(--ch-text-muted)" }}>
            Ketik kata kunci untuk mencari di seluruh portal kreator
          </p>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {SECTIONS.map((s) => (
              <span
                key={s.key}
                className="px-3 py-1 rounded-full text-[12px] font-semibold"
                style={{ background: "#F0FDF4", color: "#15803D" }}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>
      ) : results.total === 0 ? (
        <div className="py-16 text-center" style={{ color: "var(--ch-text-soft)" }}>
          <Search style={{ width: 32, height: 32, margin: "0 auto 12px", opacity: 0.4 }} />
          <p className="text-[14px] font-medium">Tidak ada hasil untuk &quot;{debouncedSearch}&quot;</p>
          <p className="text-[12px] mt-1">Coba kata kunci lain seperti nama brand atau kampanye</p>
        </div>
      ) : (
        <div className="space-y-6">
          <p className="text-[13px]" style={{ color: "var(--ch-text-muted)" }}>
            <strong style={{ color: "var(--ch-text)" }}>{results.total} hasil</strong> untuk &quot;{debouncedSearch}&quot;
          </p>
          {SECTIONS.map((section) => (
            <SearchSection
              key={section.key}
              label={section.label}
              icon={section.icon}
              count={results[section.key].length}
              href={section.href}
              query={debouncedSearch}
            >
              {renderers[section.key](results[section.key] as never[])}
            </SearchSection>
          ))}
        </div>
      )}
    </div>
  );
}