import { useState, useRef, useEffect, useMemo } from 'react'
import useEmotionsStore    from '../store/emotionsStore'
import AutoTextarea        from './AutoTextarea'
import { isDark }          from '../utils/colorUtils'
import { useTranslation }  from '../hooks/useTranslation'
import EMOTIONS            from '../data/emotionsData'

const MAX_CHILDREN   = Math.max(...EMOTIONS.map((e) => e.children.length))
const BUBBLE_TRANS   = 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.32s ease, box-shadow 0.3s ease'

// Repulsion: nearest bubbles get pushed MAX_PUSH px, falloff over INFLUENCE px.
const INFLUENCE = 250
const MAX_PUSH  = 130

function computeRepulsion(bx, by, hovPos) {
  if (!hovPos) return { pdx: 0, pdy: 0 }
  const ddx = bx - hovPos.dx
  const ddy = by - hovPos.dy
  const d   = Math.sqrt(ddx * ddx + ddy * ddy)
  if (d < 1) return { pdx: 0, pdy: 0 }

  // Influence zone grows with the hovered bubble's size (×1.13 for hover scale)
  const influence = INFLUENCE + (hovPos.r ?? 0) * 1.13
  const t = Math.max(0, 1 - d / influence)
  
  // Quadratic falloff: strong push close-in, drops off quickly with distance
  const strength = t * t * MAX_PUSH
  return { pdx: (ddx / d) * strength, pdy: (ddy / d) * strength }
}

// Computes the minimum circle radius needed to contain `label` without overflow.
const FS_T = 11
const CW = 0.52 // approximate char-width ratio for DM Sans Bold
const PAD = 9 // radial padding (half of horizontal bubble padding)

function minRForLabel(label) {
  const charPx = FS_T * CW
  const lineH = FS_T * 1.3
  const words = label.split(' ')

  const singleR = (label.length * charPx) / 2 + PAD
  if (words.length === 1) return Math.ceil(singleR)

  // Try every word-split point; pick the split yielding the smallest radius.
  let bestR = singleR
  for (let i = 1; i < words.length; i++) {
    const maxLen = Math.max(
      words.slice(0, i).join(' ').length,
      words.slice(i).join(' ').length,
    )
    const r = Math.sqrt((maxLen * charPx / 2 + PAD) ** 2 + (lineH / 2) ** 2)
    if (r < bestR) bestR = r
  }
  return Math.ceil(bestR)
}

//Pure helpers

function coreR(em) {
  const base = 30 + (em.children.length / MAX_CHILDREN) * 18 // 30–48 px
  return Math.max(base, minRForLabel(em.label))
}

function orbit(n, r) {
  return Array.from({ length: n }, (_, i) => ({
    dx: Math.cos(-Math.PI / 2 + (2 * Math.PI * i) / n) * r,
    dy: Math.sin(-Math.PI / 2 + (2 * Math.PI * i) / n) * r,
  }))
}

// Bubble element
// Defined outside parent so React keeps the same component type across renders.

function Bubble({ dx, dy, pushDx = 0, pushDy = 0, r, fill, textColor, label, opacity, z, onClick, onHover, onLeave }) {
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const size  = r * 2
  const fs    = Math.max(9, Math.min(18, r * 0.26))
  const scale = pressed ? 0.88 : hovered ? 1.13 : 1

  return (
    <div
      onClick={opacity > 0.05 ? onClick : undefined}
      onPointerEnter={() => { if (opacity > 0.05) { setHovered(true); onHover?.() } }}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => { setPressed(false); setHovered(false); onLeave?.() }}
      onPointerLeave={() => { setPressed(false); setHovered(false); onLeave?.() }}
      style={{
        position: 'absolute',
        left: '50%', top: '50%',
        width: size, height: size,
        borderRadius: '50%',
        background: fill,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: 4, boxSizing: 'border-box',
        cursor: opacity > 0.05 ? 'pointer' : 'default',
        userSelect: 'none',
        pointerEvents: opacity < 0.05 ? 'none' : 'auto',
        opacity,
        zIndex: hovered ? z + 10 : z,
        willChange: 'transform, opacity, box-shadow',
        transform: `translate(calc(-50% + ${dx + pushDx}px), calc(-50% + ${dy + pushDy}px)) scale(${scale})`,
        transition: BUBBLE_TRANS,
        boxShadow: opacity > 0.4
          ? hovered
            ? `0 6px 32px ${fill}99, 0 0 0 3px ${fill}44`
            : `0 2px 18px ${fill}66`
          : 'none',
      }}
    >
      <span style={{
        fontFamily: "'Manrope', sans-serif",
        fontSize: fs, fontWeight: 700,
        color: textColor, lineHeight: 1.2,
        pointerEvents: 'none',
      }}>
        {label}
      </span>
    </div>
  )
}

//Consequence field IDs (translation keys built from prefix)
const CONSEQ_IDS = ['sensazioni', 'fatto', 'voluto', 'nonVoluto']


export default function EmotionBubbles({ darkMode = true, onViewWheel }) {

  // Granular selectors — each re-renders only when its slice changes
  const step  = useEmotionsStore((s) => s.step)
  const coreId = useEmotionsStore((s) => s.coreId)
  const secIdx = useEmotionsStore((s) => s.secIdx)
  const terIdx = useEmotionsStore((s) => s.terIdx)
  const selectedEmotion = useEmotionsStore((s) => s.selectedEmotion)
  const savedEmotions = useEmotionsStore((s) => s.savedEmotions)
  const conseqValues = useEmotionsStore((s) => s.conseqValues)
  const setConseqValue = useEmotionsStore((s) => s.setConseqValue)
  const pickCore = useEmotionsStore((s) => s.pickCore)
  const pickSec = useEmotionsStore((s) => s.pickSec)
  const pickTer = useEmotionsStore((s) => s.pickTer)
  const goBack = useEmotionsStore((s) => s.goBack)
  const reset = useEmotionsStore((s) => s.reset)
  const addEmotion = useEmotionsStore((s) => s.addEmotion)
  const removeEmotion = useEmotionsStore((s) => s.removeEmotion)
  const [intensity, setIntensity] = useState(null)
  const [hoveredPos, setHoveredPos] = useState(null)
  const containerRef = useRef(null)
  const [cw, setCw] = useState(320)
  const { t } = useTranslation()

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(() => setCw(el.offsetWidth))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const coreEm = coreId ? EMOTIONS.find((e) => e.id === coreId) : null
  const secEm  = coreEm && secIdx !== null ? coreEm.children[secIdx] : null

  // Orbit radii scale with container width
  const cOrbitR = Math.min(cw * 0.30, 220)
  const sOrbitR = Math.min(cw * 0.33, 245)
  const tOrbitR = Math.min(cw * 0.30, 220)

  const cPos = useMemo(() => orbit(EMOTIONS.length, cOrbitR), [cOrbitR])
  const sPos = useMemo(() => coreEm ? orbit(coreEm.children.length, sOrbitR) : [], [coreEm, sOrbitR])
  const tPos = useMemo(() => secEm  ? orbit(secEm.children.length,  tOrbitR) : [], [secEm,  tOrbitR])

  const bScale = Math.max(1, cOrbitR / 115)
  const maxR   = 56 * bScale
  const canvasH = (Math.max(cOrbitR, sOrbitR, tOrbitR) + maxR) * 2 + 24

  const dk = darkMode

  const stepLabel = t(`step_${step}`)

  // Breadcrumbs
  const crumbs = []
  if (coreEm) crumbs.push({ label: t(`em_${coreEm.id}`), color: coreEm.colors[1], tc: coreEm.textColors[1] })
  if (secEm)  crumbs.push({ label: t(`em_${secEm.id}`),  color: coreEm.colors[0], tc: coreEm.textColors[0] })
  if (secEm && terIdx !== null) {
    const gr = secEm.children[terIdx]
    if (gr) crumbs.push({ label: t(`em_${gr.id}`), color: coreEm.colors[2], tc: coreEm.textColors[2] })
  }

  // Position / opacity
  function coreBubbleProps(em, i) {
    const isSelected = coreId === em.id
    const r = coreR(em) * bScale
    if (step === 'core')      return { dx: cPos[i].dx, dy: cPos[i].dy, r, opacity: 1, z: 1 }
    if (step === 'secondary') {
      if (isSelected) return { dx: 0, dy: 0, r: r + 6 * bScale, opacity: 1, z: 3 }
      return { dx: cPos[i].dx, dy: cPos[i].dy, r, opacity: 0, z: 1 }
    }
    return { dx: 0, dy: 0, r, opacity: 0, z: 1 }
  }

  function secBubbleProps(ci, child) {
    const r  = Math.max(38, minRForLabel(child.label)) * bScale
    const rS = Math.max(42, minRForLabel(child.label) + 4) * bScale
    const isSelected = secIdx === ci
    const p = sPos[ci] ?? { dx: 0, dy: 0 }
    if (step === 'core')      return { dx: 0, dy: 0, r, opacity: 0, z: 1 }
    if (step === 'secondary') return { dx: p.dx, dy: p.dy, r, opacity: 1, z: 2 }
    if (step === 'tertiary' || step === 'done') {
      if (isSelected) return { dx: 0, dy: 0, r: rS, opacity: 1, z: 3 }
      return { dx: p.dx, dy: p.dy, r, opacity: 0, z: 1 }
    }
    return { dx: 0, dy: 0, r, opacity: 0, z: 1 }
  }

  function terBubbleProps(gi, grand) {
    const r = Math.max(34, minRForLabel(grand.label)) * bScale
    const isSelected = terIdx === gi
    const p = tPos[gi] ?? { dx: 0, dy: 0 }
    if (step === 'tertiary') return { dx: p.dx, dy: p.dy, r, opacity: 1, z: 2 }
    if (step === 'done')     return { dx: p.dx, dy: p.dy, r, opacity: isSelected ? 1 : 0.22, z: isSelected ? 3 : 1 }
    return { dx: 0, dy: 0, r, opacity: 0, z: 1 }
  }


  return (
    <div className="flex flex-col items-center w-full select-none" style={{ fontFamily: "'Manrope', sans-serif" }}>

      {/* ── Title ── */}
      <div className="text-center mb-2 w-full">
        <h1 className="pb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 'var(--fs-xl)', color: 'var(--text-muted)' }}>
          {t('sectionConsequences')}
        </h1>
        <span className="block text-[10px] tracking-[5px] uppercase mb-1"
          style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-dim)' }}>
          {t('wheelSubtitle')}
        </span>
        <h1 className="m-0 text-[clamp(20px,5vw,28px)] tracking-tight"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'var(--text-main)' }}>
          {t('wheelTitle')}
        </h1>
      </div>

      {/* ── Wheel hint (only at core step) ── */}
      {step === 'core' && onViewWheel && (
        <p className="text-center text-[11px] mb-3 px-4"
          style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-dim)', lineHeight: 1.6 }}>
          {t('wheelHint')}{' '}
          <button
            onClick={onViewWheel}
            style={{
              background: 'none', border: 'none', padding: 0,
              fontFamily: "'Manrope', sans-serif",
              fontSize: 11, fontWeight: 700, cursor: 'pointer',
              color: 'var(--text-muted)',
              textDecoration: 'underline', textUnderlineOffset: 3,
            }}
          >
            {t('wheelHintLink')}
          </button>
        </p>
      )}

      {/* ── Step label ── */}
      <div className="min-h-[20px] mb-1">
        <span className="text-[11px] font-semibold tracking-widest uppercase"
          style={{ fontFamily: "'Manrope', sans-serif", color: step === 'done' ? (dk ? '#7ec87e' : '#3a9c3a') : 'var(--text-muted)' }}>
          {stepLabel}
        </span>
      </div>

      {/* ── Breadcrumbs ── */}
      <div className="flex items-center gap-1 flex-wrap justify-center min-h-[24px] mb-2">
        {crumbs.length === 0
          ? <span className="text-[11px] italic" style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-dim)' }}>
              {t('breadcrumbEmpty')}
            </span>
          : crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-sm" style={{ color: 'var(--text-dim)' }}>›</span>}
                <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold tracking-tight"
                  style={{ background: c.color, color: isDark(c.color) ? '#fff' : '#111', fontFamily: "'Manrope', sans-serif" }}>
                  {c.label}
                </span>
              </span>
            ))
        }
      </div>

      {/* ── Bubble canvas ── */}
      <div ref={containerRef} className="relative w-full" style={{ height: canvasH }}>

        {/* Core bubbles */}
        {EMOTIONS.map((em, i) => {
          const { dx, dy, r, opacity, z } = coreBubbleProps(em, i)
          const { pdx, pdy } = opacity > 0.1 ? computeRepulsion(dx, dy, hoveredPos) : { pdx: 0, pdy: 0 }
          return (
            <Bubble
              key={em.id}
              dx={dx} dy={dy} pushDx={pdx} pushDy={pdy} r={r}
              fill={em.colors[1]} textColor={em.textColors[1]}
              label={t(`em_${em.id}`)} opacity={opacity} z={z}
              onClick={step === 'core' ? () => { pickCore(em); setIntensity(null) } : undefined}
              onHover={() => setHoveredPos({ dx, dy, r })}
              onLeave={() => setHoveredPos(null)}
            />
          )
        })}

        {/* Secondary bubbles */}
        {coreEm && coreEm.children.map((ch, ci) => {
          const { dx, dy, r, opacity, z } = secBubbleProps(ci, ch)
          const { pdx, pdy } = opacity > 0.1 ? computeRepulsion(dx, dy, hoveredPos) : { pdx: 0, pdy: 0 }
          return (
            <Bubble
              key={ch.id}
              dx={dx} dy={dy} pushDx={pdx} pushDy={pdy} r={r}
              fill={coreEm.colors[0]} textColor={coreEm.textColors[0]}
              label={t(`em_${ch.id}`)} opacity={opacity} z={z}
              onClick={step === 'secondary' ? () => { pickSec(ci); setIntensity(null) } : undefined}
              onHover={() => setHoveredPos({ dx, dy, r })}
              onLeave={() => setHoveredPos(null)}
            />
          )
        })}

        {/* Tertiary bubbles */}
        {secEm && secEm.children.map((gr, gi) => {
          const { dx, dy, r, opacity, z } = terBubbleProps(gi, gr)
          const { pdx, pdy } = opacity > 0.1 ? computeRepulsion(dx, dy, hoveredPos) : { pdx: 0, pdy: 0 }
          return (
            <Bubble
              key={gr.id}
              dx={dx} dy={dy} pushDx={pdx} pushDy={pdy} r={r}
              fill={coreEm.colors[2]} textColor={coreEm.textColors[2]}
              label={t(`em_${gr.id}`)} opacity={opacity} z={z}
              onClick={step === 'tertiary' ? () => { pickTer(gi); setIntensity(null) } : undefined}
              onHover={() => setHoveredPos({ dx, dy, r })}
              onLeave={() => setHoveredPos(null)}
            />
          )
        })}

      </div>

      {/* ── Intensity selector ── */}
      {step !== 'core' && selectedEmotion && (
        <div className="flex flex-col items-center gap-3 mt-3 w-full">
          <span className="text-[12px]" style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-muted)' }}>
            {t('intensityLabel')} <strong style={{ color: 'var(--text-main)' }}>{t(`em_${selectedEmotion.id}`)}</strong>?
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            {[1,2,3,4,5,6,7,8,9,10].map((n) => (
              <button key={n} onClick={() => setIntensity(n)}
                className="w-8 h-8 rounded-full text-[12px] font-bold border cursor-pointer"
                style={intensity === n
                  ? { background: 'var(--accent-bg)', color: 'var(--accent-text)', borderColor: 'var(--accent-bg)' }
                  : { background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--btn-border)' }}>
                {n}
              </button>
            ))}
          </div>
          {intensity && (
            <button
              onClick={() => { addEmotion({ emotion: selectedEmotion, intensity }); setIntensity(null) }}
              className="px-6 py-1.5 rounded-full text-[12px] font-bold cursor-pointer"
              style={{ fontFamily: "'Manrope', sans-serif", background: 'var(--accent-bg)', color: 'var(--accent-text)' }}
            >
              {t('save')}
            </button>
          )}
        </div>
      )}

      {/* ── Saved emotions ── */}
      {savedEmotions.length > 0 && (
        <div className="mt-4 w-full">
          <h2 className="text-[11px] font-semibold mb-2"
            style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-muted)' }}>
            {t('savedEmotions')}
          </h2>
          <ul className="space-y-1">
            {savedEmotions.map((item, idx) => (
              <li key={idx}
                className="flex justify-between items-center text-[12px] px-3 py-1 rounded group"
                style={{ background: 'var(--saved-bg)' }}>
                <span style={{ color: 'var(--text-main)' }}>{t(`em_${item.emotion.id}`)}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold" style={{ color: 'var(--text-muted)' }}>× {item.intensity}</span>
                  <button onClick={() => removeEmotion(idx)}
                    className="hover:text-red-400 transition-colors sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer text-[14px] font-bold"
                    style={{ color: 'var(--text-dim)' }}>✕</button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Navigation ── */}
      <div className="flex gap-2 mt-4">
        {step !== 'core' && (
          <button onClick={() => { goBack(); setIntensity(null) }}
            className="px-5 py-1.5 rounded-full text-[12px] bg-transparent cursor-pointer"
            style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: '0.5px', color: 'var(--text-muted)', border: '1px solid var(--btn-border)' }}>
            {t('back')}
          </button>
        )}
        {step !== 'core' && (
          <button onClick={() => { reset(); setIntensity(null) }}
            className="px-5 py-1.5 rounded-full text-[12px] bg-transparent cursor-pointer"
            style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: '0.5px', color: 'var(--text-dim)', border: '1px solid var(--btn-border-dim)' }}>
            {t('restart')}
          </button>
        )}
      </div>

      {/* ── Consequence form ── */}
      <form className="space-y-4 w-full mt-6">
        {CONSEQ_IDS.map((id) => (
          <div key={id}>
            <label htmlFor={`eb-${id}`}
              className="block text-[11px] font-semibold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-muted)' }}>
              {t(`cLabel_${id}`)}
            </label>
            <AutoTextarea
              id={`eb-${id}`}
              rows={1}
              value={conseqValues[id]}
              onChange={(e) => setConseqValue(id, e.target.value)}
              placeholder={t(`cPlaceholder_${id}`)}
              className="w-full px-4 py-2.5 rounded-lg text-[12px] focus:outline-none"
              style={{
                fontFamily: "'Manrope', sans-serif",
                background: 'var(--input-bg)',
                border: '1px solid var(--input-border)',
                color: 'var(--input-text)',
                transition: 'border-color 0.2s ease',
              }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--input-border-focus)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--input-border)')}
            />
          </div>
        ))}
      </form>

    </div>
  )
}
