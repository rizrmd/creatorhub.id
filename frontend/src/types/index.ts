export interface Creator {
  id: string;
  name: string;
  city: string;
  country: string;
  category: string;
  platforms: string[];
  followers: number;
  followersText: string;
  engagementRate: number;
  price: number;
  priceText: string;
  verified: boolean;
  rating: number;
  fastResponse: boolean;
  topRated: boolean;
  imageUrl: string;
  bio: string;
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

export interface Campaign {
  id: string;
  title: string;
  description: string;
  status: "draft" | "active" | "completed" | "paused";
  budget: number;
  startDate?: string;
  endDate?: string;
  creators?: Creator[];
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
