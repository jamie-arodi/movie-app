import { useMutation, useQueryClient } from '@tanstack/react-query'
import { authHttpClient } from '../services/auth-http-client'
import type { LoginCredentials, SignupCredentials, AuthResponse, AuthError } from '../types/auth'

export const useLogin = () => {
  const queryClient = useQueryClient()
  
  return useMutation<AuthResponse, AuthError, LoginCredentials>({
    mutationFn: (credentials: LoginCredentials) => authHttpClient.login(credentials),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(['auth', 'user'], data.user)
      localStorage.setItem('accessToken', data.access_token)
      localStorage.setItem('refreshToken', data.refresh_token)
    },
    onError: (error: AuthError) => {
      console.error('Login failed:', error.message)
    }
  })
}

export const useSignup = () => {
  const queryClient = useQueryClient()
  
  return useMutation<AuthResponse, AuthError, SignupCredentials>({
    mutationFn: (credentials: SignupCredentials) => authHttpClient.signup(credentials),
    onSuccess: (data: AuthResponse) => {
      queryClient.setQueryData(['auth', 'user'], data.user)
      localStorage.setItem('accessToken', data.access_token)
      localStorage.setItem('refreshToken', data.refresh_token)
    },
    onError: (error: AuthError) => {
      console.error('Signup failed:', error.message)
    }
  })
}

export const useLogout = () => {
  const queryClient = useQueryClient()
  
  return useMutation<void, AuthError, void>({
    mutationFn: async () => {
      const accessToken = localStorage.getItem('accessToken')
      if (accessToken) {
        await authHttpClient.logout(accessToken)
      }
    },
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ['auth'] })
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
    },
    onError: (error: AuthError) => {
      console.error('Logout failed:', error.message)
    }
  })
}

export const useRefreshToken = () => {
  return useMutation<AuthResponse, AuthError, string>({
    mutationFn: (refreshToken: string) => authHttpClient.refreshToken(refreshToken),
    onSuccess: (data: AuthResponse) => {
      localStorage.setItem('accessToken', data.access_token)
      localStorage.setItem('refreshToken', data.refresh_token)
    },
    onError: (error: AuthError) => {
      console.error('Token refresh failed:', error.message)
    }
  })
}
