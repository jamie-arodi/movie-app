import '@testing-library/jest-dom'
import { beforeEach, vi } from 'vitest'

Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_TMDB_API_KEY: process.env.VITE_TMDB_API_KEY,
    VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL,
    VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY
  },
  writable: true
})

// Store original fetch for integration tests (used when making lve API calls in the tests)
const originalFetch = globalThis.fetch

// Mock fetch for unit tests by default
globalThis.fetch = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
  // Restore mock by default
  globalThis.fetch = vi.fn()
})

// Export original fetch for integration tests
export { originalFetch }
