import * as d3    from 'd3'
import EMOTIONS   from '../data/emotionsData'

// ── d3 arc generator (shared instance) ───────────────────────────────────────
const arcGen = d3.arc()

// ── Radii ─────────────────────────────────────────────────────────────────────
export const R0      = 0
export const R1_BASE = 205
export const R2_BASE = 305
export const R3_BASE = 430

// ── Animation transitions ─────────────────────────────────────────────────────
export const SCALE_TRANSITION       = 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease'
export const SCALE_TRANSITION_PRESS = 'transform 0.1s ease, opacity 0.4s ease'

// ── Arc path helpers ──────────────────────────────────────────────────────────

/**
 * Build an SVG arc path string.
 * @param {number} ir Inner radius
 * @param {number} or Outer radius
 * @param {number} sa Start angle (radians)
 * @param {number} ea End angle (radians)
 */
export function makePath(ir, or, sa, ea) {
  return arcGen({ innerRadius: ir, outerRadius: or, startAngle: sa, endAngle: ea })
}

/**
 * Return the [x, y] centroid of an arc segment.
 */
export function makeCentroid(ir, or, sa, ea) {
  return arcGen.centroid({ innerRadius: ir, outerRadius: or, startAngle: sa, endAngle: ea })
}

/**
 * SVG `transform` string that places text radially along an arc, auto-flipping
 * text in the lower half so it reads correctly.
 * @param {number} rotationOffset  Extra wheel rotation (degrees) — used so the
 *   flip logic accounts for the wheel's current drag angle.
 */
export function radialTransform(sa, ea, ir, or, rotationOffset = 0) {
  const mid      = (sa + ea) / 2
  const [cx, cy] = makeCentroid(ir, or, sa, ea)
  let deg        = (mid * 180) / Math.PI - 90
  const norm     = (((deg + rotationOffset) % 360) + 360) % 360
  if (norm > 90 && norm < 270) deg += 180
  return `translate(${cx},${cy}) rotate(${deg})`
}

/**
 * Compute start / end angles for each core emotion, sized proportionally to
 * child count so that each core slice has equal granularity.
 *
 * @param {typeof EMOTIONS} emotions
 * @returns {{ s: number, e: number }[]}
 */
export function computeCoreAngles(emotions) {
  const total  = emotions.reduce((sum, e) => sum + e.children.length, 0)
  const angles = []
  let current  = -Math.PI / 2
  for (const e of emotions) {
    const slice = (e.children.length / total) * (2 * Math.PI)
    angles.push({ s: current, e: current + slice })
    current += slice
  }
  return angles
}

/** Pre-computed core angles — stable reference, not recreated on each render. */
export const CORE_ANGLES = computeCoreAngles(EMOTIONS)

// ── Font-size helpers ─────────────────────────────────────────────────────────

/**
 * Compute a font size that fits within a ring segment.
 * Used for the interactive step-by-step wheel.
 */
export function fSize(sa, ea, ir, or, max) {
  const span = ea - sa
  const rMid = (ir + or) / 2
  return Math.min(max, Math.max(20, span * rMid / 2.0), (or - ir) * 0.58)
}

/**
 * Variant for the dense full-reference wheel — lower minimum so text fits
 * inside small outer-ring segments.
 */
export function fSizeFW(sa, ea, ir, or, max) {
  const span = ea - sa
  const rMid = (ir + or) / 2
  return Math.min(max, Math.max(7, span * rMid / 2.5), (or - ir) * 0.52)
}

// ── Scale helpers ─────────────────────────────────────────────────────────────

/**
 * CSS transform-origin string for scaling a segment around its centroid.
 */
export function scaleOrigin(sa, ea, ir, or) {
  const [cx, cy] = makeCentroid(ir, or, sa, ea)
  return `${cx}px ${cy}px`
}

/**
 * Reorder an array so the element at `hovIdx` is rendered last (on top in SVG).
 * @template T
 * @param {T[]} arr
 * @param {number | null | undefined} hovIdx
 * @returns {T[]}
 */
export function bringToFront(arr, hovIdx) {
  if (hovIdx === null || hovIdx === undefined) return arr
  const result = arr.filter((_, i) => i !== hovIdx)
  result.push(arr[hovIdx])
  return result
}

/**
 * Scale factor for a hovered segment.
 * @param {number | null} dist  0 = hovered segment, 1 = neighbour, null = no hover
 */
export function segScale(dist) {
  return dist === 0 ? 1.28 : 1
}
