import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api-client';
import User from '../entities/User';

const usePlayers = () =>
  useQuery<User[]>({
    queryKey: ['players'],
    queryFn: () => apiClient.get('/users').then((res) => res.data),
    retry: false,
  });

export default usePlayers;
