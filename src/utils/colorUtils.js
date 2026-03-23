/**
 * Returns true when the given hex colour is dark enough that white text
 * will be legible on top of it.
 *
 * Uses the ITU-R BT.601 luma formula: Y = 0.299R + 0.587G + 0.114B
 * Threshold: Y < 140  →  dark background, use white text.
 *
 * @param {string} hex  Six-digit hex colour, e.g. "#1a2b3c"
 * @returns {boolean}
 */

export function isDark(hex) {
  if (!hex || hex[0] !== '#') return false
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return (r * 299 + g * 587 + b * 114) / 1000 < 140
}
