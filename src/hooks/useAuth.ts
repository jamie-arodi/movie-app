import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authHttpClient } from '../services/auth-http-client'
import { useAuthStore } from '../store/authStore'
import type { LoginCredentials, SignupCredentials, AuthResponse, AuthError } from '../types/auth'

export const useLogin = () => {
  const queryClient = useQueryClient()
  const { setAuthenticatedUser } = useAuthStore()
  
  return useMutation<AuthResponse, AuthError, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => authHttpClient.login(credentials),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(['auth', 'user'], data.user)
      
      setAuthenticatedUser(data.user, data.access_token, data.refresh_token, data.expires_at)
      
      localStorage.setItem('accessToken', data.access_token)
      localStorage.setItem('refreshToken', data.refresh_token)
    }
  })
}

export const useSignup = () => {
  const queryClient = useQueryClient()
  const { setAuthenticatedUser } = useAuthStore()
  
  return useMutation<AuthResponse, AuthError, SignupCredentials>({
    mutationFn: (credentials: SignupCredentials) => authHttpClient.signup(credentials),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(['auth', 'user'], data.user)
      
      setAuthenticatedUser(data.user, data.access_token, data.refresh_token, data.expires_at)

      localStorage.setItem('accessToken', data.access_token)
      localStorage.setItem('refreshToken', data.refresh_token)
    }
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  const { clearAuthentication, accessToken } = useAuthStore()
  
  return useMutation<void, AuthError, void>({
    mutationFn: async () => {
      if (accessToken) {
        await authHttpClient.logout(accessToken)
      }
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['auth'] })
      
      clearAuthentication()
    }
  })
}
