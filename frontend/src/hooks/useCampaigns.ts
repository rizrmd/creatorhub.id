import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { campaignsApi } from "@/lib/api";
import type { CreateCampaignRequest } from "@/types";

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: campaignsApi.list,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCampaignRequest) => campaignsApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignsApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}
