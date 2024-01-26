import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api-client";
import GameHistory from "../entities/GameHistory";

const useHistory = (id: string | undefined) =>
  useQuery<GameHistory[]>({
    queryKey: ["history", id],
    queryFn: () => apiClient.get(`/game/player/${id}`).then((res) => res.data),
    retry: false,
  });

export default useHistory;
