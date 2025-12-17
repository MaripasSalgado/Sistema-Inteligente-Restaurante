/**
 * Helper functions for handling Costa Rica timezone (UTC-6)
 */

/**
 * Get the start of a month in Costa Rica timezone, converted to UTC
 * @param {number} month - Month (0-11)
 * @param {number} year - Year
 * @returns {string} ISO string in UTC
 */
export function getMonthStartCR(month, year) {
    // Create date in UTC: YYYY-MM-01 00:00:00
    const date = new Date(Date.UTC(year, month, 1, 0, 0, 0))
    // Add 6 hours to convert CR midnight to UTC
    date.setUTCHours(date.getUTCHours() + 6)
    return date.toISOString()
}

/**
 * Get the end of a month in Costa Rica timezone, converted to UTC
 * @param {number} month - Month (0-11)
 * @param {number} year - Year
 * @returns {string} ISO string in UTC
 */
export function getMonthEndCR(month, year) {
    // Get last day of month
    const lastDay = new Date(Date.UTC(year, month + 1, 0)).getUTCDate()
    // Create date in UTC: YYYY-MM-LastDay 23:59:59
    const date = new Date(Date.UTC(year, month, lastDay, 23, 59, 59, 999))
    // Add 6 hours to convert CR time to UTC
    date.setUTCHours(date.getUTCHours() + 6)
    return date.toISOString()
}

/**
 * Get today's date in Costa Rica timezone, converted to UTC range
 * @returns {object} { start: ISO string, end: ISO string }
 */
export function getTodayCR() {
    const now = new Date()
    // Get CR time by subtracting 6 hours from UTC
    const crTime = new Date(now.getTime() - (6 * 60 * 60 * 1000))
    const year = crTime.getUTCFullYear()
    const month = crTime.getUTCMonth()
    const day = crTime.getUTCDate()

    // Start of day in CR (00:00:00 CR = 06:00:00 UTC)
    const start = new Date(Date.UTC(year, month, day, 6, 0, 0))
    // End of day in CR (23:59:59 CR = 05:59:59 UTC next day)
    const end = new Date(Date.UTC(year, month, day + 1, 5, 59, 59, 999))

    return {
        start: start.toISOString(),
        end: end.toISOString()
    }
}
