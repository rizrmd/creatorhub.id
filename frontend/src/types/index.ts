export interface PlatformMetric {
  platform: string;
  handle?: string;
  followers: number;
  engagementRate: number;
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  city: string;
  country: string;
  category: string;
  platforms: string[];
  platformMetrics: PlatformMetric[];
  followers: number;
  followersText: string;
  engagementRate: number;
  price: number;
  priceText: string;
  verified: boolean;
  starCreator: boolean;
  rating: number;
  fastResponse: boolean;
  topRated: boolean;
  responseTime?: string;
  lastSeen?: string;
  imageUrl: string;
  img?: string;
  focus?: string;
  hue?: number;
  bio: string;
  tags?: string[];
  createdAt?: string;
}

export interface CreatorListParams {
  category?: string;
  city?: string;
  platform?: string;
  minFollowers?: number;
  maxFollowers?: number;
  minEngagement?: number;
  maxEngagement?: number;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  verified?: boolean;
  fastResponse?: boolean;
  topRated?: boolean;
  search?: string;
  sortBy?: string;
  sortDir?: string;
  page?: number;
  pageSize?: number;
}

export interface CreatorListResponse {
  data: Creator[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface MarketplaceStats {
  totalCreators: number;
  activeCampaigns: number;
  avgEngagementRate: number;
  totalBudget: number;
}

export type CampaignStatus = "draft" | "in-review" | "active" | "completed" | "archived" | "paused";
export type CampaignObjective = "Awareness" | "Engagement" | "Traffic" | "Conversions";

export const CAMPAIGN_STATUS: Record<CampaignStatus, { label: string; bg: string; fg: string; dot: string }> = {
  draft:      { label: "Draft",     bg: "#F1F5F9", fg: "#475569", dot: "#94A3B8" },
  "in-review":{ label: "In Review", bg: "#FEF3C7", fg: "#B45309", dot: "#F59E0B" },
  active:     { label: "Active",    bg: "#DCFCE7", fg: "#15803D", dot: "#16A34A" },
  completed:  { label: "Completed", bg: "#DBEAFE", fg: "#1D4ED8", dot: "#2563EB" },
  archived:   { label: "Archived",  bg: "#FEE2E2", fg: "#B91C1C", dot: "#DC2626" },
  paused:     { label: "Paused",    bg: "#FEF3C7", fg: "#92400E", dot: "#F59E0B" },
};

export interface CampaignDeliverables {
  total: number;
  completed: number;
  inReview: number;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  brand?: string;
  status: CampaignStatus;
  objective?: CampaignObjective;
  budget: number;
  budgetSpent?: number;
  startDate?: string;
  endDate?: string;
  daysLeft?: number | null;
  creators?: Creator[];
  deliverables?: CampaignDeliverables;
  hue?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignRequest {
  title: string;
  description: string;
  budget: number;
}

export interface ChatChannel {
  id: string;
  creatorId: string;
  creatorName: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
  updatedAt: string;
}

export interface Message {
  id: string;
  channelId: string;
  senderId: string;
  senderType: "user" | "creator";
  content: string;
  createdAt: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
  province?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface ScrapeRequest {
  platform: string;
  handle: string;
}

export interface ScrapeResponse {
  profilePictureUrl: string;
  followerCount: number;
  followingCount?: number;
  likesCount?: number;
  bio?: string;
  displayName: string;
  success: boolean;
  error?: string;
}

export interface PlatformInput {
  platform: string;
  handle: string;
  profilePictureUrl: string;
  followers: number;
  following?: number;
  likes?: number;
  bio?: string;
}

export interface CreateCreatorRequest {
  name: string;
  bio: string;
  category: string;
  city: string;
  imageUrl: string;
  platforms: PlatformInput[];
  tags?: string[];
}
