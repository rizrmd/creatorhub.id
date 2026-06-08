import { useQuery } from "@tanstack/react-query";
import { creatorsApi } from "@/lib/api";
import type { CreatorListParams } from "@/types";

export function useCreators(params: CreatorListParams) {
  return useQuery({
    queryKey: ["creators", params],
    queryFn: () => creatorsApi.list(params),
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
