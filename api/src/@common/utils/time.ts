/**
 * Utility functions to convert time units to milliseconds.
 * These functions are useful for setting timeouts, intervals, or any other time-related operations.
 */
export function msSeconds(seconds: number): number {
	return seconds * 1000;
}

/**
 * Utility functions to convert time units to milliseconds.
 * These functions are useful for setting timeouts, intervals, or any other time-related operations.
 */
export function msMinutes(minutes: number): number {
	return msSeconds(minutes * 60);
}

/**
 * Utility functions to convert time units to milliseconds.
 * These functions are useful for setting timeouts, intervals, or any other time-related operations.
 */
export function msHours(hours: number): number {
	return msMinutes(hours * 60);
}

/**
 * Utility functions to convert time units to milliseconds.
 * These functions are useful for setting timeouts, intervals, or any other time-related operations.
 */
export function msDays(days: number): number {
	return msHours(days * 24);
}

/**
 * Utility functions to convert time units to milliseconds.
 * These functions are useful for setting timeouts, intervals, or any other time-related operations.
 */
export function msWeeks(weeks: number): number {
	return msDays(weeks * 7);
}

/**
 * Utility functions to convert time units to milliseconds.
 * These functions are useful for setting timeouts, intervals, or any other time-related operations.
 *
 * Based on the average month length of 30 days.
 */
export function msMonths(months: number): number {
	return msDays(months * 30);
}

/**
 * Utility functions to convert time units to milliseconds.
 * These functions are useful for setting timeouts, intervals, or any other time-related operations.
 */
export function msYears(years: number): number {
	return msDays(years * 365);
}
