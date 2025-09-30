import { describe, it, expect, vi, beforeEach } from "vitest";
import { authHttpClient } from "../services/auth-http-client";
import type { LoginCredentials, SignupCredentials } from "../types/auth";
import { originalFetch } from "./setup";
import { mockAuthResponse } from "./mocks";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

describe("AuthHttpClient", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  //this should be an actual API call
  it("should login with valid credentials", async () => {
    // Restore real fetch for live API calls
    globalThis.fetch = originalFetch;

    try {
      const credentials: LoginCredentials = {
        email: "test@test.com",
        password: "password123",
      };

      const result = await authHttpClient.login(credentials);

      // Verify the response structure matches our AuthResponse interface
      expect(result).toBeDefined();
      expect(typeof result.access_token).toBe("string");
      expect(typeof result.token_type).toBe("string");
      expect(typeof result.expires_in).toBe("number");
      expect(typeof result.expires_at).toBe("number");
      expect(typeof result.refresh_token).toBe("string");
      expect(result.user).toBeDefined();
      expect(typeof result.user.id).toBe("string");
      expect(result.user.email).toBe("test@test.com");
      expect(result.user.role).toBe("authenticated");
      expect(result.access_token.length).toBeGreaterThan(100);
    } catch (error) {
      // If the test user doesn't exist or credentials are invalid,
      // we still want to verify the error handling works
      console.log("Login test failed (expected if test user does not exist):", error);
      throw new Error("Login failed catastrophically❌");
    } finally {
      // Restore mock fetch for other tests
      globalThis.fetch = vi.fn();
    }
  });

  it("should signup with valid credentials", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAuthResponse,
    } as Response);

    const credentials: SignupCredentials = {
      email: "newuser@example.com",
      password: "newpassword123",
      firstName: "New",
      lastName: "User",
    };

    const result = await authHttpClient.signup(credentials);

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${SUPABASE_URL}/auth/v1/signup`,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          apiKey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        }),
        body: JSON.stringify({
          email: "newuser@example.com",
          password: "newpassword123",
          data: {
            firstName: "New",
            lastName: "User",
            name: "New User",
          },
        }),
      })
    );

    expect(result).toEqual(mockAuthResponse);
  });

  it("should handle login errors", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
    } as Response);

    const credentials: LoginCredentials = {
      email: "wrong@example.com",
      password: "wrongpassword",
    };

    await expect(authHttpClient.login(credentials)).rejects.toThrow();
  });

  it("should refresh token", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockAuthResponse,
    } as Response);

    const result = await authHttpClient.refreshToken("mock-refresh-token");

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          apiKey: SUPABASE_ANON_KEY,
          Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        }),
        body: JSON.stringify({
          refresh_token: "mock-refresh-token",
        }),
      })
    );

    expect(result).toEqual(mockAuthResponse);
  });

  it("should logout successfully", async () => {
    vi.mocked(globalThis.fetch).mockResolvedValueOnce({
      ok: true,
    } as Response);

    await expect(authHttpClient.logout("mock-access-token")).resolves.toBeUndefined();

    expect(globalThis.fetch).toHaveBeenCalledWith(
      `${SUPABASE_URL}/auth/v1/logout`,
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "Content-Type": "application/json",
          apiKey: SUPABASE_ANON_KEY,
          Authorization: "Bearer mock-access-token",
        }),
      })
    );
  });
});
