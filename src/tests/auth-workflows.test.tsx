import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useLogin, useSignup, useLogout } from '../hooks/useAuth'
import { useAuthStore } from '../store/authStore'
import { authHttpClient } from '../services/auth-http-client'
import type { AuthResponse, LoginCredentials, SignupCredentials } from '../types/auth'

vi.mock('../services/auth-http-client')

const mockAuthResponse: AuthResponse = {
  access_token: 'mock-access-token',
  token_type: 'bearer',
  expires_in: 3600,
  expires_at: 1758021187,
  refresh_token: 'mock-refresh-token',
  user: {
    id: '991caea3-6cad-4052-abe1-4e1954d12534',
    email: 'test@example.com',
    role: 'authenticated',
    email_confirmed_at: '2025-09-16T10:11:18.26493Z',
    last_sign_in_at: '2025-09-16T10:13:07.163302936Z',
    app_metadata: {
      provider: 'email',
      providers: ['email']
    },
    user_metadata: {
      email: 'test@example.com',
      email_verified: true,
      name: 'Test User',
      firstName: 'Test',
      lastName: 'User',
      phone_verified: false,
      sub: '991caea3-6cad-4052-abe1-4e1954d12534'
    },
    created_at: '2025-09-16T10:06:30.771932Z',
    updated_at: '2025-09-16T10:13:07.177812Z',
    is_anonymous: false
  }
}

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  })

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('Authentication Workflows', () => {
  let wrapper: ReturnType<typeof createWrapper>

  beforeEach(() => {
    vi.clearAllMocks()
    wrapper = createWrapper()
    
    // Reset the auth store to initial state
    useAuthStore.getState().reset()
    
    // Clear localStorage
    vi.stubGlobal('localStorage', {
      setItem: vi.fn(),
      removeItem: vi.fn(),
      getItem: vi.fn(),
    })
  })

  afterEach(() => {
    useAuthStore.getState().reset()
  })

  describe('Login Workflow', () => {
    it('should update authStore state when login is successful', async () => {
      vi.mocked(authHttpClient.login).mockResolvedValueOnce(mockAuthResponse)

      const { result } = renderHook(() => useLogin(), { wrapper })
      const { result: storeResult } = renderHook(() => useAuthStore())

      // Verify initial state
      expect(storeResult.current.isAuthenticated).toBe(false)
      expect(storeResult.current.user).toBe(null)
      expect(storeResult.current.accessToken).toBe(null)
      expect(storeResult.current.refreshToken).toBe(null)

      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'password123'
      }

      // Perform login
      await act(async () => {
        await result.current.mutateAsync(credentials)
      })

      // Verify auth store state is updated
      expect(storeResult.current.isAuthenticated).toBe(true)
      expect(storeResult.current.user).toEqual(mockAuthResponse.user)
      expect(storeResult.current.accessToken).toBe(mockAuthResponse.access_token)
      expect(storeResult.current.refreshToken).toBe(mockAuthResponse.refresh_token)
      expect(storeResult.current.currentView).toBe('home')

      // Verify localStorage was updated
      expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', mockAuthResponse.access_token)
      expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', mockAuthResponse.refresh_token)
    })

    it('should not update authStore state when login fails', async () => {
      // Mock failed login response
      const mockError = {
        code: 400,
        error_code: 'invalid_credentials',
        msg: 'Invalid login credentials'
      }
      vi.mocked(authHttpClient.login).mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useLogin(), { wrapper })
      const { result: storeResult } = renderHook(() => useAuthStore())

      // Verify initial state
      expect(storeResult.current.isAuthenticated).toBe(false)

      const credentials: LoginCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      }

      // Attempt login and expect it to fail
      await act(async () => {
        await expect(result.current.mutateAsync(credentials)).rejects.toEqual(mockError)
      })

      // Verify auth store state remains unchanged
      expect(storeResult.current.isAuthenticated).toBe(false)
      expect(storeResult.current.user).toBe(null)
      expect(storeResult.current.accessToken).toBe(null)
      expect(storeResult.current.refreshToken).toBe(null)

      // Verify localStorage was not updated
      expect(localStorage.setItem).not.toHaveBeenCalled()
    })
  })

  describe('Signup Workflow', () => {
    it('should update authStore state when signup is successful', async () => {
      // Mock successful signup response
      vi.mocked(authHttpClient.signup).mockResolvedValueOnce(mockAuthResponse)

      const { result } = renderHook(() => useSignup(), { wrapper })
      const { result: storeResult } = renderHook(() => useAuthStore())

      // Verify initial state
      expect(storeResult.current.isAuthenticated).toBe(false)
      expect(storeResult.current.user).toBe(null)

      const credentials: SignupCredentials = {
        email: 'newuser@example.com',
        password: 'newpassword123',
        firstName: 'New',
        lastName: 'User'
      }

      // Perform signup
      await act(async () => {
        await result.current.mutateAsync(credentials)
      })

      // Verify auth store state is updated
      expect(storeResult.current.isAuthenticated).toBe(true)
      expect(storeResult.current.user).toEqual(mockAuthResponse.user)
      expect(storeResult.current.accessToken).toBe(mockAuthResponse.access_token)
      expect(storeResult.current.refreshToken).toBe(mockAuthResponse.refresh_token)
      expect(storeResult.current.currentView).toBe('home')

      // Verify localStorage was updated
      expect(localStorage.setItem).toHaveBeenCalledWith('accessToken', mockAuthResponse.access_token)
      expect(localStorage.setItem).toHaveBeenCalledWith('refreshToken', mockAuthResponse.refresh_token)
    })

    it('should not update authStore state when signup fails', async () => {
      // Mock failed signup response
      const mockError = {
        code: 422,
        error_code: 'signup_disabled',
        msg: 'Signup is disabled'
      }
      vi.mocked(authHttpClient.signup).mockRejectedValueOnce(mockError)

      const { result } = renderHook(() => useSignup(), { wrapper })
      const { result: storeResult } = renderHook(() => useAuthStore())

      // Verify initial state
      expect(storeResult.current.isAuthenticated).toBe(false)

      const credentials: SignupCredentials = {
        email: 'newuser@example.com',
        password: 'newpassword123',
        firstName: 'New',
        lastName: 'User'
      }

      // Attempt signup and expect it to fail
      await act(async () => {
        await expect(result.current.mutateAsync(credentials)).rejects.toEqual(mockError)
      })

      // Verify auth store state remains unchanged
      expect(storeResult.current.isAuthenticated).toBe(false)
      expect(storeResult.current.user).toBe(null)
      expect(storeResult.current.accessToken).toBe(null)
      expect(storeResult.current.refreshToken).toBe(null)

      // Verify localStorage was not updated
      expect(localStorage.setItem).not.toHaveBeenCalled()
    })
  })

  describe('Logout Workflow', () => {
    it('should clear authStore state when logout is successful', async () => {
      // Mock successful logout response
      vi.mocked(authHttpClient.logout).mockResolvedValueOnce(undefined)

      // First, set up authenticated state
      const { result: storeResult } = renderHook(() => useAuthStore())
      
      act(() => {
        storeResult.current.setAuthenticatedUser(
          mockAuthResponse.user,
          mockAuthResponse.access_token,
          mockAuthResponse.refresh_token
        )
      })

      // Verify authenticated state
      expect(storeResult.current.isAuthenticated).toBe(true)
      expect(storeResult.current.user).toEqual(mockAuthResponse.user)

      // Now test logout
      const { result } = renderHook(() => useLogout(), { wrapper })

      // Perform logout
      await act(async () => {
        await result.current.mutateAsync()
      })

      // Verify auth store state is cleared
      expect(storeResult.current.isAuthenticated).toBe(false)
      expect(storeResult.current.user).toBe(null)
      expect(storeResult.current.accessToken).toBe(null)
      expect(storeResult.current.refreshToken).toBe(null)
      expect(storeResult.current.currentView).toBe('login')

      // Verify localStorage was cleared
      expect(localStorage.removeItem).toHaveBeenCalledWith('accessToken')
      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken')
    })

    it('should handle logout errors gracefully', async () => {
      // Mock failed logout response
      const mockError = {
        code: 401,
        error_code: 'invalid_token',
        msg: 'Invalid access token'
      }
      vi.mocked(authHttpClient.logout).mockRejectedValueOnce(mockError)

      // First, set up authenticated state
      const { result: storeResult } = renderHook(() => useAuthStore())
      
      act(() => {
        storeResult.current.setAuthenticatedUser(
          mockAuthResponse.user,
          mockAuthResponse.access_token,
          mockAuthResponse.refresh_token
        )
      })

      // Verify authenticated state
      expect(storeResult.current.isAuthenticated).toBe(true)

      // Now test logout
      const { result } = renderHook(() => useLogout(), { wrapper })

      // Attempt logout and expect it to fail
      await act(async () => {
        await expect(result.current.mutateAsync()).rejects.toEqual(mockError)
      })

      // Verify auth store state remains authenticated (since logout failed)
      expect(storeResult.current.isAuthenticated).toBe(true)
      expect(storeResult.current.user).toEqual(mockAuthResponse.user)
      expect(storeResult.current.accessToken).toBe(mockAuthResponse.access_token)
      expect(storeResult.current.refreshToken).toBe(mockAuthResponse.refresh_token)

      // Verify localStorage was not cleared
      expect(localStorage.removeItem).not.toHaveBeenCalled()
    })
  })

  describe('Store State Transitions', () => {
    it('should transition from unauthenticated to authenticated after login', async () => {
      // Mock successful login
      vi.mocked(authHttpClient.login).mockResolvedValueOnce(mockAuthResponse)

      const { result: loginResult } = renderHook(() => useLogin(), { wrapper })
      const { result: storeResult } = renderHook(() => useAuthStore())

      // Initial state - unauthenticated
      expect(storeResult.current.isAuthenticated).toBe(false)
      expect(storeResult.current.currentView).toBe('login')

      // Perform login
      await act(async () => {
        await loginResult.current.mutateAsync({
          email: 'test@example.com',
          password: 'password123'
        })
      })

      // Final state - authenticated
      expect(storeResult.current.isAuthenticated).toBe(true)
      expect(storeResult.current.currentView).toBe('home')
      expect(storeResult.current.user?.email).toBe('test@example.com')
    })

    it('should transition from authenticated to unauthenticated after logout', async () => {
      // Mock successful logout
      vi.mocked(authHttpClient.logout).mockResolvedValueOnce(undefined)

      const { result: storeResult } = renderHook(() => useAuthStore())

      // Set initial authenticated state
      act(() => {
        storeResult.current.setAuthenticatedUser(
          mockAuthResponse.user,
          mockAuthResponse.access_token,
          mockAuthResponse.refresh_token
        )
      })

      expect(storeResult.current.isAuthenticated).toBe(true)

      // Perform logout
      const { result: logoutResult } = renderHook(() => useLogout(), { wrapper })
      
      await act(async () => {
        await logoutResult.current.mutateAsync()
      })

      // Final state - unauthenticated
      expect(storeResult.current.isAuthenticated).toBe(false)
      expect(storeResult.current.currentView).toBe('login')
      expect(storeResult.current.user).toBe(null)
    })
  })
})
