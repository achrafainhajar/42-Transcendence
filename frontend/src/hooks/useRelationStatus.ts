import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api-client";
import Relation from "../entities/Relation";

const useRelationStatus = (status: string) =>
  useQuery<Relation[]>({
    queryKey: ["user/relation/status", status],
    queryFn: () =>
      apiClient
        .get(`/users/relationships/status/${status}`)
        .then((res) => res.data),
    retry: false,
  });

export default useRelationStatus;
