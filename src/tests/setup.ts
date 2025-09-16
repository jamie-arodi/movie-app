import '@testing-library/jest-dom'
import { beforeEach, vi } from 'vitest'

Object.defineProperty(import.meta, 'env', {
  value: {
    VITE_TMDB_API_KEY: 'test-api-key'
  },
  writable: true
})

// Mock fetch for API calls
globalThis.fetch = vi.fn()

beforeEach(() => {
  vi.clearAllMocks()
})
