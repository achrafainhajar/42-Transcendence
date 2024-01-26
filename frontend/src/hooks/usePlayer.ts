import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api-client';
import User from '../entities/User';

const usePlayer = (username: string) =>
  useQuery<User>({
    queryKey: ['player', username],
    queryFn: () =>
      apiClient.get(`/users/username/${username}`).then((res) => res.data),
    retry: false,
  });

export default usePlayer;
