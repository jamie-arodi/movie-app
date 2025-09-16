export interface AuthUser {
  id: string;
  email: string;
  role: string;
  email_confirmed_at: string | null;
  last_sign_in_at: string | null;
  app_metadata: {
    provider: string;
    providers: string[];
  };
  user_metadata: {
    email: string;
    email_verified: boolean;
    name?: string;
    phone_verified: boolean;
    sub: string;
  };
  created_at: string;
  updated_at: string;
  is_anonymous: boolean;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  expires_at: number;
  refresh_token: string;
  user: AuthUser;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  email: string;
  password: string;
  name?: string;
}

export interface AuthError {
  message: string;
  status?: number;
}
