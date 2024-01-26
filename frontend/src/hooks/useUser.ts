import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/api-client';
import User from '../entities/User';

const useUser = () =>
  useQuery<User>({
    queryKey: ['user'],
    queryFn: () => apiClient.get('/auth/me').then((res) => res?.data),
    retry: false,

  });

export default useUser;
