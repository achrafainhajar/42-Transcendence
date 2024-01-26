import { useQuery } from "@tanstack/react-query";
import apiClient from "../services/api-client";
import Achievements from "../entities/Achievement";

type userAchievement = {
  achievement_id: string;
  achievements: Achievements;
};

const useAchievement = (id: string | undefined) =>
  useQuery<userAchievement[]>({
    queryKey: ["achivement", id],
    queryFn: () =>
      apiClient.get(`/achievement/user/${id}`).then((res) => res.data),
    retry: false,
  });

export default useAchievement;
