import type { AuthResponse, LoginCredentials, SignupCredentials, AuthError } from '../types/auth';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

class AuthHttpClient {
  private getHeaders(): Record<string, string> {
    return {
      'Accept': '*/*',
      'apiKey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    };
  }

  private async makeRequest(endpoint: string, body: any): Promise<AuthResponse> {
    const response = await fetch(`${SUPABASE_URL}${endpoint}`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const error: AuthError = {
        message: `Authentication failed: ${response.statusText}`,
        status: response.status
      };
      throw error;
    }

    return response.json();
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return this.makeRequest('/auth/v1/token?grant_type=password', {
      email: credentials.email,
      password: credentials.password
    });
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const body: any = {
      email: credentials.email,
      password: credentials.password
    };

    if (credentials.name) {
      body.data = {
        name: credentials.name
      };
    }

    return this.makeRequest('/auth/v1/signup', body);
  }

  async logout(accessToken: string): Promise<void> {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
      method: 'POST',
      headers: {
        ...this.getHeaders(),
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      const error: AuthError = {
        message: `Logout failed: ${response.statusText}`,
        status: response.status
      };
      throw error;
    }
  }

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return this.makeRequest('/auth/v1/token?grant_type=refresh_token', {
      refresh_token: refreshToken
    });
  }
}

export const authHttpClient = new AuthHttpClient();
