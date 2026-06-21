import axios from "axios";
import type {
  Creator,
  CreatorListParams,
  CreatorListResponse,
  MarketplaceStats,
  Campaign,
  CreateCampaignRequest,
  ChatChannel,
  Message,
  LoginRequest,
  LoginResponse,
  ScrapeRequest,
  ScrapeResponse,
  CreateCreatorRequest,
} from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api/v1",
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/auth/login", data).then((r) => r.data),
};

export const creatorsApi = {
  list: (params: CreatorListParams) =>
    api.get<CreatorListResponse>("/creators", { params }).then((r) => r.data),
  getById: (id: string) =>
    api.get<Creator>(`/creators/${id}`).then((r) => r.data),
  stats: () =>
    api.get<MarketplaceStats>("/creators/stats").then((r) => r.data),
  scrapeSocial: (data: ScrapeRequest) =>
    api.post<ScrapeResponse>("/creators/scrape", data).then((r) => r.data),
  create: (data: CreateCreatorRequest) =>
    api.post<Creator>("/creators", data).then((r) => r.data),
};

export const campaignsApi = {
  list: () => api.get<Campaign[]>("/campaigns").then((r) => r.data),
  create: (data: CreateCampaignRequest) =>
    api.post<Campaign>("/campaigns", data).then((r) => r.data),
  getById: (id: string) =>
    api.get<Campaign>(`/campaigns/${id}`).then((r) => r.data),
  update: (id: string, data: Partial<Campaign>) =>
    api.put<Campaign>(`/campaigns/${id}`, data).then((r) => r.data),
  delete: (id: string) => api.delete(`/campaigns/${id}`),
  addCreator: (campaignId: string, creatorId: string) =>
    api.post(`/campaigns/${campaignId}/creators`, { creatorId }),
  removeCreator: (campaignId: string, creatorId: string) =>
    api.delete(`/campaigns/${campaignId}/creators/${creatorId}`),
};

export const messagesApi = {
  listChannels: () =>
    api.get<ChatChannel[]>("/messages/channels").then((r) => r.data),
  createChannel: (creatorId: string) =>
    api
      .post<ChatChannel>("/messages/channels", { creatorId })
      .then((r) => r.data),
  listMessages: (channelId: string) =>
    api
      .get<Message[]>(`/messages/channels/${channelId}/messages`)
      .then((r) => r.data),
  sendMessage: (channelId: string, content: string) =>
    api
      .post<Message>(`/messages/channels/${channelId}/messages`, { content })
      .then((r) => r.data),
};

export interface MediaGroup {
  id: string;
  name: string;
  outletCount: number;
  createdAt: string;
}

export interface MediaOutlet {
  id: number;
  groupId: string | null;
  groupName?: string;
  name: string;
  isGroupHeader: boolean;
  url: string | null;
  totalBrands: number | null;
  hargaAgency: string | null;
  hargaRateCard: string | null;
  googleNews: boolean;
  instagramHandle: string | null;
  instagramFollowers: string | null;
  facebookHandle: string | null;
  facebookFollowers: string | null;
  threadsHandle: string | null;
  threadsFollowers: string | null;
  tiktokHandle: string | null;
  tiktokFollowers: string | null;
  twitterHandle: string | null;
  twitterFollowers: string | null;
  youtubeHandle: string | null;
  youtubeFollowers: string | null;
  genre: string | null;
  keterangan: string | null;
  createdAt: string;
  updatedAt: string;
}

export const mediaNetworkApi = {
  listGroups: () =>
    api.get<MediaGroup[]>("/media-groups").then((r) => r.data),
  listOutlets: (groupId: string) =>
    api.get<MediaOutlet[]>(`/media-groups/${groupId}/outlets`).then((r) => r.data),
  searchOutlets: (query: string) =>
    api.get<MediaOutlet[]>("/media-outlets/search", { params: { q: query } }).then((r) => r.data),
  bulkUpdate: (outlets: Partial<MediaOutlet>[]) =>
    api.put<{ updated: number }>("/media-outlets/bulk", { outlets }).then((r) => r.data),
};

export default api;
