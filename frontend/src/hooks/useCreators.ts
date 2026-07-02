import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { creatorsApi } from "@/lib/api";
import type { CreatorListParams } from "@/types";

export function useCreators(params: CreatorListParams) {
  return useQuery({
    queryKey: ["creators", params],
    queryFn: () => creatorsApi.list(params),
    staleTime: 30_000,
  });
}

export function useInfiniteCreators(params: CreatorListParams) {
  return useInfiniteQuery({
    queryKey: ["creators", "infinite", params],
    queryFn: ({ pageParam }) => creatorsApi.list({ ...params, page: pageParam }),
    initialPageParam: params.page ?? 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 30_000,
  });
}

export function useCreator(id: string) {
  return useQuery({
    queryKey: ["creator", id],
    queryFn: () => creatorsApi.getById(id),
    enabled: !!id,
  });
}

export function useMarketplaceStats() {
  return useQuery({
    queryKey: ["marketplace-stats"],
    queryFn: () => creatorsApi.stats(),
    staleTime: 60_000,
  });
}
