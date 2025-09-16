import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authHttpClient } from '../services/auth-http-client'
import type { AuthResponse, LoginCredentials, SignupCredentials } from '../types/auth'

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
      phone_verified: false,
      sub: '991caea3-6cad-4052-abe1-4e1954d12534'
    },
    created_at: '2025-09-16T10:06:30.771932Z',
    updated_at: '2025-09-16T10:13:07.177812Z',
    is_anonymous: false
  }
}

describe('AuthHttpClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should login with valid credentials', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAuthResponse,
    } as Response)

    const credentials: LoginCredentials = {
      email: 'test@example.com',
      password: 'password123'
    }

    const result = await authHttpClient.login(credentials)

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://njrnzecqmbtgyhybdmma.supabase.co/auth/v1/token?grant_type=password',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'apiKey': expect.any(String),
          'Authorization': expect.stringContaining('Bearer')
        }),
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      })
    )

    expect(result).toEqual(mockAuthResponse)
    expect(result.user.email).toBe('test@example.com')
    expect(result.access_token).toBe('mock-access-token')
  })

  it('should signup with valid credentials', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAuthResponse,
    } as Response)

    const credentials: SignupCredentials = {
      email: 'newuser@example.com',
      password: 'newpassword123',
      name: 'New User'
    }

    const result = await authHttpClient.signup(credentials)

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://njrnzecqmbtgyhybdmma.supabase.co/auth/v1/signup',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          email: 'newuser@example.com',
          password: 'newpassword123',
          data: {
            name: 'New User'
          }
        })
      })
    )

    expect(result).toEqual(mockAuthResponse)
  })

  it('should handle login errors', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
    } as Response)

    const credentials: LoginCredentials = {
      email: 'wrong@example.com',
      password: 'wrongpassword'
    }

    await expect(authHttpClient.login(credentials)).rejects.toThrow('Authentication failed: Unauthorized')
  })

  it('should refresh token', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAuthResponse,
    } as Response)

    const result = await authHttpClient.refreshToken('mock-refresh-token')

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://njrnzecqmbtgyhybdmma.supabase.co/auth/v1/token?grant_type=refresh_token',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          refresh_token: 'mock-refresh-token'
        })
      })
    )

    expect(result).toEqual(mockAuthResponse)
  })

  it('should logout successfully', async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
    } as Response)

    await expect(authHttpClient.logout('mock-access-token')).resolves.toBeUndefined()

    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://njrnzecqmbtgyhybdmma.supabase.co/auth/v1/logout',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Authorization': 'Bearer mock-access-token'
        })
      })
    )
  })
})
