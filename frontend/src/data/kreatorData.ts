export type InvitationStatus = "pending" | "accepted" | "declined";
export type TaskStatus = "pending" | "in-progress" | "submitted" | "revision";
export type PaymentStatus = "paid" | "pending";

export interface KreatorInvitation {
  id: string;
  brand: string;
  campaign: string;
  budget: number;
  deadline: string;
  category: string;
  status: InvitationStatus;
  brief: string;
}

export interface KreatorTask {
  id: string;
  brand: string;
  campaign: string;
  deliverable: string;
  due: string;
  status: TaskStatus;
}

export interface KreatorPayment {
  id: string;
  brand: string;
  campaign: string;
  amount: number;
  status: PaymentStatus;
  date: string;
}

export interface MonthlyEarning {
  month: string;
  amount: number;
}

export interface TopPost {
  platform: string;
  content: string;
  reach: string;
  engagement: string;
  emoji: string;
}

export interface PlatformInsight {
  name: string;
  followers: string;
  eng: string;
  posts: number;
  color: string;
}

export const CREATOR_RATING = 4.9;
export const CREATOR_REVIEW_COUNT = 24;
export const KREATOR_UNREAD_MESSAGES = 2;

export const KREATOR_INVITATIONS: KreatorInvitation[] = [
  { id: "1", brand: "Wardah", campaign: "Ramadan Glow Campaign", budget: 5_000_000, deadline: "2026-07-02", category: "Beauty", status: "pending", brief: "Buat 2 konten IG Reel + 1 Story unboxing produk Wardah terbaru." },
  { id: "2", brand: "Tokopedia", campaign: "Flash Sale Juli 2026", budget: 3_500_000, deadline: "2026-07-07", category: "E-Commerce", status: "pending", brief: "Review & unboxing haul produk dari Tokopedia Flash Sale." },
  { id: "3", brand: "Grab", campaign: "GrabFood Summer Promo", budget: 4_200_000, deadline: "2026-07-10", category: "Food", status: "pending", brief: "Konten kuliner & vlog pengiriman GrabFood musim panas." },
  { id: "4", brand: "ASUS", campaign: "ROG Phone Launch", budget: 8_000_000, deadline: "2026-06-28", category: "Tech", status: "accepted", brief: "Unboxing + first look ROG Phone 9 series." },
  { id: "5", brand: "Eiger", campaign: "Outdoor Ready", budget: 2_500_000, deadline: "2026-06-20", category: "Lifestyle", status: "declined", brief: "Konten outdoor & hiking menampilkan gear Eiger." },
];

export const KREATOR_TASKS: KreatorTask[] = [
  { id: "1", brand: "ASUS", campaign: "ROG Phone Launch", deliverable: "Unboxing Reel 60s", due: "2026-06-28", status: "in-progress" },
  { id: "2", brand: "ASUS", campaign: "ROG Phone Launch", deliverable: "IG Story Announcement", due: "2026-06-27", status: "submitted" },
  { id: "3", brand: "Wardah", campaign: "Ramadan Glow", deliverable: "Tutorial Reel", due: "2026-07-02", status: "pending" },
];

export const KREATOR_PAYMENTS: KreatorPayment[] = [
  { id: "P-001", brand: "ASUS", campaign: "ROG Phone Launch", amount: 8_000_000, status: "paid", date: "2026-06-20" },
  { id: "P-002", brand: "Wardah", campaign: "Ramadan Glow", amount: 5_000_000, status: "pending", date: "2026-07-02" },
  { id: "P-003", brand: "Tokopedia", campaign: "Flash Sale Juni", amount: 3_500_000, status: "paid", date: "2026-06-10" },
  { id: "P-004", brand: "Eiger", campaign: "Outdoor Ready", amount: 2_500_000, status: "paid", date: "2026-05-28" },
];

export const KREATOR_MONTHLY_EARNINGS: MonthlyEarning[] = [
  { month: "Jan", amount: 8_000_000 },
  { month: "Feb", amount: 12_000_000 },
  { month: "Mar", amount: 7_500_000 },
  { month: "Apr", amount: 15_000_000 },
  { month: "Mei", amount: 19_000_000 },
  { month: "Jun", amount: 24_000_000 },
];

export const KREATOR_INSIGHT_KPIS = [
  { label: "Total Reach", value: "2.4M", change: "+12%", hue: 220 },
  { label: "Total Followers", value: "486K", change: "+3.2K", hue: 142 },
  { label: "Avg Engagement", value: "5.8%", change: "+0.4%", hue: 28 },
  { label: "Content Views", value: "8.1M", change: "+22%", hue: 300 },
] as const;

export const KREATOR_PLATFORMS: PlatformInsight[] = [
  { name: "Instagram", followers: "284K", eng: "5.1%", posts: 42, color: "#E1306C" },
  { name: "TikTok", followers: "152K", eng: "8.4%", posts: 67, color: "#010101" },
  { name: "YouTube", followers: "50K", eng: "3.8%", posts: 18, color: "#FF0000" },
];

export const KREATOR_TOP_POSTS: TopPost[] = [
  { platform: "Instagram", content: "Skincare routine pagi hari ☀️", reach: "84K", engagement: "6.2%", emoji: "📸" },
  { platform: "TikTok", content: "GRWM ke kondangan bestie!", reach: "210K", engagement: "8.4%", emoji: "🎬" },
  { platform: "YouTube", content: "Review Skincare Budget Rp50rb", reach: "42K", engagement: "4.8%", emoji: "▶️" },
];

export const KREATOR_EARNINGS_BREAKDOWN = [
  { label: "Instagram Reels", pct: 52, color: "#E1306C" },
  { label: "TikTok", pct: 31, color: "#010101" },
  { label: "YouTube", pct: 17, color: "#FF0000" },
];

export const KREATOR_LIFETIME_EARNINGS = 124_600_000;

export function formatRp(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export function formatRpShort(n: number): string {
  if (n >= 1_000_000_000) return `Rp ${(n / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (n >= 1_000_000) return `Rp ${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}jt`;
  if (n >= 1_000) return `Rp ${Math.round(n / 1_000)}rb`;
  return formatRp(n);
}

export function formatDeadlineLeft(deadline: string): string {
  const days = Math.ceil((new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  if (days < 0) return "Lewat deadline";
  if (days === 0) return "Hari ini";
  if (days === 1) return "1 hari lagi";
  return `${days} hari lagi`;
}

export function computeKreatorStats(invitations: KreatorInvitation[]) {
  const pendingInvitations = invitations.filter((i) => i.status === "pending");
  const activeTasks = KREATOR_TASKS.filter((t) => t.status === "in-progress" || t.status === "pending");
  const inProgressTasks = KREATOR_TASKS.filter((t) => t.status === "in-progress");

  const monthly = KREATOR_MONTHLY_EARNINGS;
  const currentMonth = monthly[monthly.length - 1]?.amount ?? 0;
  const prevMonth = monthly[monthly.length - 2]?.amount ?? 0;
  const earningsGrowthPct = prevMonth > 0 ? Math.round(((currentMonth - prevMonth) / prevMonth) * 100) : 0;

  const totalPaid = KREATOR_PAYMENTS.filter((p) => p.status === "paid").reduce((a, p) => a + p.amount, 0);
  const totalPending = KREATOR_PAYMENTS.filter((p) => p.status === "pending").reduce((a, p) => a + p.amount, 0);

  return {
    pendingInvitationCount: pendingInvitations.length,
    pendingInvitations,
    activeJobCount: activeTasks.length,
    inProgressJobCount: inProgressTasks.length,
    currentMonthEarnings: currentMonth,
    earningsGrowthPct,
    rating: CREATOR_RATING,
    reviewCount: CREATOR_REVIEW_COUNT,
    totalPaid,
    totalPending,
    lifetimeEarnings: KREATOR_LIFETIME_EARNINGS,
    unreadMessages: KREATOR_UNREAD_MESSAGES,
  };
}