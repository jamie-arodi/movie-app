import { describe, it, expect } from 'vitest'
import { isTokenExpired, getTimeUntilExpiry, formatTimeRemaining } from '../utils/auth'

describe('Auth Utils', () => {
  describe('isTokenExpired', () => {
    it('should return true when expiresAt is null', () => {
      expect(isTokenExpired(null)).toBe(true)
    })

    it('should return true when token is expired', () => {
      const pastTime = (Date.now() / 1000) - 3600 // 1 hour ago
      expect(isTokenExpired(pastTime)).toBe(true)
    })

    it('should return false when token is not expired', () => {
      const futureTime = (Date.now() / 1000) + 3600 // 1 hour from now
      expect(isTokenExpired(futureTime)).toBe(false)
    })

    it('should return true when token expires exactly now', () => {
      const now = Date.now() / 1000
      expect(isTokenExpired(now)).toBe(true)
    })
  })

  describe('getTimeUntilExpiry', () => {
    it('should return 0 when expiresAt is null', () => {
      expect(getTimeUntilExpiry(null)).toBe(0)
    })

    it('should return 0 when token is expired', () => {
      const pastTime = (Date.now() / 1000) - 3600 // 1 hour ago
      expect(getTimeUntilExpiry(pastTime)).toBe(0)
    })

    it('should return correct time remaining when token is valid', () => {
      const futureTime = (Date.now() / 1000) + 3600 // 1 hour from now
      const remaining = getTimeUntilExpiry(futureTime)
      expect(remaining).toBeGreaterThan(3500) // Should be close to 3600
      expect(remaining).toBeLessThanOrEqual(3600)
    })
  })

  describe('formatTimeRemaining', () => {
    it('should return "Expired" for 0 or negative seconds', () => {
      expect(formatTimeRemaining(0)).toBe('Expired')
      expect(formatTimeRemaining(-100)).toBe('Expired')
    })

    it('should format seconds only', () => {
      expect(formatTimeRemaining(30)).toBe('30s')
      expect(formatTimeRemaining(59)).toBe('59s')
    })

    it('should format minutes and seconds', () => {
      expect(formatTimeRemaining(90)).toBe('1m 30s')
      expect(formatTimeRemaining(150)).toBe('2m 30s')
      expect(formatTimeRemaining(3599)).toBe('59m 59s')
    })

    it('should format hours and minutes', () => {
      expect(formatTimeRemaining(3600)).toBe('1h 0m')
      expect(formatTimeRemaining(3661)).toBe('1h 1m')
      expect(formatTimeRemaining(7320)).toBe('2h 2m')
    })
  })
})