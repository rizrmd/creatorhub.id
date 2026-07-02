import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function formatRupiah(n: number): string {
  return `Rp ${n.toLocaleString("id-ID")}`;
}

export function resolveCreatorPhoto(img?: string, imageUrl?: string): string {
  const localOrRemote = img?.trim() ?? "";
  if (localOrRemote) {
    if (/^(https?:|data:|blob:)/i.test(localOrRemote) || localOrRemote.startsWith("/")) {
      return localOrRemote;
    }
    if (!localOrRemote.includes("/") && !localOrRemote.includes("\\")) {
      return `/creators/${localOrRemote}`;
    }
  }
  return imageUrl?.trim() ?? "";
}
