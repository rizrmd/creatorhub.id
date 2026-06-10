import type { Campaign, ChatChannel } from "@/types";

export function matchesBrandQuery(query: string, fields: (string | undefined)[]): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return false;
  return fields.some((field) => field?.toLowerCase().includes(q));
}

export function filterCampaigns(campaigns: Campaign[], query: string): Campaign[] {
  const q = query.trim();
  if (!q) return [];
  return campaigns.filter((c) =>
    matchesBrandQuery(q, [c.title, c.description, c.brand, c.objective, c.status]),
  );
}

export function filterChatChannels(channels: ChatChannel[], query: string): ChatChannel[] {
  const q = query.trim();
  if (!q) return [];
  return channels.filter((c) =>
    matchesBrandQuery(q, [c.creatorName, c.lastMessage]),
  );
}