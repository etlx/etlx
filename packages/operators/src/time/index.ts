const parseDuration = require('parse-duration')

/**
 * Converts human-readable duration string to milliseconds
 *
 * Example:
 *
 * ```
 * let ns = time('1ns') // => 1 / 1e6
 * let μs = time('1μs') // => 1 / 1000
 * let ms = time('1ms') // => 1
 * let s = time('1s')   // => ms * 1000
 * let m = time('1m')   // => s * 60
 * let h = time('1h')   // => m * 60
 * let d = time('1d')   // => h * 24
 * let w = time('1w')   // => d * 7
 * let y = time('1y')   // => d * 365.25
 * ```
 *
 * See <a href="https://github.com/jkroso/parse-duration">parse-duration</a>
 * @param duration Duration expression (e.g. `1h`, `2d 3h 42s`)
 * @returns Duration in milliseconds
 */
export const time = (duration: string) => parseDuration(duration)

export * from './utils'
