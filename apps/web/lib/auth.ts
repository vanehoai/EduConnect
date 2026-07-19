'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AuthUser } from '@school/shared-types';
import { apiRequest } from './api-client';

export interface LoginCredentials {
  email: string;
  password: string;
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => apiRequest<AuthUser>('/auth/me'),
    retry: false,
    staleTime: 30_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: LoginCredentials) =>
      apiRequest<AuthUser>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify(credentials) },
        false,
      ),
    onSuccess: (user) => queryClient.setQueryData(['auth', 'me'], user),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => apiRequest<null>('/auth/logout', { method: 'POST' }, false),
    onSettled: () => {
      queryClient.removeQueries({ queryKey: ['auth'] });
    },
  });
}
