import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api-client";
import Relation from "../entities/Relation";

const useRelations = () =>
  useQuery<Relation[]>({
    queryKey: ["user/relations"],
    queryFn: () =>
      apiClient.get("/users/relationships").then((res) => res.data),
    retry: false,
  });

export default useRelations;
