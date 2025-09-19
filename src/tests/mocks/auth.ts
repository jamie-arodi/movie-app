import type { AuthResponse } from '../../types/auth'

export const mockAuthResponse: AuthResponse = {
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