import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api-client";
import Achievements from "../entities/Achievement";

const useAchievements = () =>
  useQuery<Achievements[]>({
    queryKey: ["achivements"],
    queryFn: () => apiClient.get("/achievement").then((res) => res.data),
    retry: false,
  });

export default useAchievements;
