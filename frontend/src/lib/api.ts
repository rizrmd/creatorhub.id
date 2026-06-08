import axios from "axios";
import type {
  Creator,
  CreatorListParams,
  CreatorListResponse,
  Campaign,
  CreateCampaignRequest,
  ChatChannel,
  Message,
} from "@/types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api/v1",
});

export const creatorsApi = {
  list: (params: CreatorListParams) =>
    api.get<CreatorListResponse>("/creators", { params }).then((r) => r.data),
  getById: (id: string) =>
    api.get<Creator>(`/creators/${id}`).then((r) => r.data),
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

export default api;
