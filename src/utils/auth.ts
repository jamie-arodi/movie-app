/**
 * Utility functions for token management and authentication
 */

/**
 * Check if a JWT token has expired based on Unix timestamp
 * @param expiresAt - Unix timestamp when the token expires
 * @returns true if token is expired, false otherwise
 */
export const isTokenExpired = (expiresAt: number | null): boolean => {
  if (!expiresAt) return true
  return Date.now() / 1000 >= expiresAt
}

/**
 * Get time remaining until token expires
 * @param expiresAt - Unix timestamp when the token expires
 * @returns number of seconds until expiration, or 0 if already expired
 */
export const getTimeUntilExpiry = (expiresAt: number | null): number => {
  if (!expiresAt) return 0
  const timeRemaining = expiresAt - (Date.now() / 1000)
  return Math.max(0, timeRemaining)
}

/**
 * Format time remaining in a human-readable format
 * @param seconds - Number of seconds
 * @returns formatted string like "5m 30s" or "1h 2m"
 */
export const formatTimeRemaining = (seconds: number): string => {
  if (seconds <= 0) return 'Expired'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`
  } else {
    return `${secs}s`
  }
}