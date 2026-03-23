import { useState, useMemo, useEffect, useRef } from 'react'
import useEmotionsStore    from '../store/emotionsStore'
import EMOTIONS            from '../data/emotionsData'
import AutoTextarea        from './AutoTextarea'
import { isDark }          from '../utils/colorUtils'
import { useTranslation }  from '../hooks/useTranslation'
import {
  R0, R1_BASE, R2_BASE, R3_BASE,
  makePath, radialTransform, scaleOrigin,
  CORE_ANGLES,
} from '../utils/wheelGeometry'

// ── Sub-components ────────────────────────────────────────────────────────────
import WheelDefs          from './wheel/WheelDefs'
import CoreRing           from './wheel/CoreRing'
import SecondaryRing      from './wheel/SecondaryRing'
import TertiaryRing       from './wheel/TertiaryRing'
import FullReferenceWheel from './wheel/FullReferenceWheel'

// ── Consequence field IDs ──────────────────────────────────────────────────────
const CONSEQ_IDS = ['sensazioni', 'fatto', 'voluto', 'nonVoluto']

// ── Main component ────────────────────────────────────────────────────────────

/**
 * Emotion-wheel view.
 *
 * Props:
 *  - darkMode        — current theme
 *  - showFullWheel   — render the full reference wheel (all rings at once)
 *  - wheelSize       — zoom level (integer, 0 = default)
 *  - setWheelSize    — zoom setter
 *  - forceOpen       — skip the "open" button and render inline
 */
export default function EmotionWheel({
  darkMode = true,
  showFullWheel = false,
  wheelSize = 0,
  setWheelSize = () => {},
  forceOpen = false,
}) {
  // Granular selectors
  const step            = useEmotionsStore((s) => s.step)
  const coreId          = useEmotionsStore((s) => s.coreId)
  const secIdx          = useEmotionsStore((s) => s.secIdx)
  const terIdx          = useEmotionsStore((s) => s.terIdx)
  const selectedEmotion = useEmotionsStore((s) => s.selectedEmotion)
  const savedEmotions   = useEmotionsStore((s) => s.savedEmotions)
  const conseqValues    = useEmotionsStore((s) => s.conseqValues)
  const setConseqValue  = useEmotionsStore((s) => s.setConseqValue)
  const pickCore        = useEmotionsStore((s) => s.pickCore)
  const pickSec         = useEmotionsStore((s) => s.pickSec)
  const pickTer         = useEmotionsStore((s) => s.pickTer)
  const goBack          = useEmotionsStore((s) => s.goBack)
  const reset           = useEmotionsStore((s) => s.reset)
  const addEmotion      = useEmotionsStore((s) => s.addEmotion)
  const removeEmotion   = useEmotionsStore((s) => s.removeEmotion)
  const jumpTo          = useEmotionsStore((s) => s.jumpTo)

  const { t } = useTranslation()
  const dk    = darkMode

  // ── Local UI state ────────────────────────────────────────────────────────
  const [hov, setHov]                   = useState(null)
  const [pressed, setPressed]           = useState(null)
  const [justClicked, setJustClicked]   = useState(null)
  const [intensity, setIntensity]       = useState(null)
  const [isMobile, setIsMobile]         = useState(() => window.innerWidth < 640)
  const [winWidth, setWinWidth]         = useState(() => window.innerWidth)
  const [fwHov, setFwHov]               = useState(null)
  const [fwPressed, setFwPressed]       = useState(null)
  const [wheelOpen, setWheelOpen]       = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [wheelRotation, setWheelRotation] = useState(0)
  const [isDraggingWheel, setIsDraggingWheel] = useState(false)
  const svgWrapperRef = useRef(null)
  const dragRef       = useRef(null)   // { pointerId, prevAngle }
  const rotRef        = useRef(0)      // accumulated rotation degrees

  useEffect(() => {
    const handler = () => {
      setIsMobile(window.innerWidth < 640)
      setWinWidth(window.innerWidth)
    }
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])

  const mobileFontMult  = isMobile ? 1.45 : 1
  const wheelFontWeight = isMobile ? '400' : '500'

  // Mobile + forceOpen: single scrollable column, no zoom controls
  const mobileForce = forceOpen && isMobile

  // ── Derived wheel geometry ─────────────────────────────────────────────────
  const emotion = coreId  ? EMOTIONS.find((e) => e.id === coreId) : null
  const child   = emotion && secIdx !== null ? emotion.children[secIdx] : null
  const grand   = child   && terIdx !== null ? child.children[terIdx]   : null

  const { dynR1, dynR2, dynR3 } = useMemo(() => {
    if (step === 'secondary') return { dynR1: R1_BASE, dynR2: R3_BASE, dynR3: R3_BASE }
    if (step === 'tertiary' || step === 'done') return { dynR1: R1_BASE, dynR2: R2_BASE, dynR3: R3_BASE + 100 }
    return { dynR1: R1_BASE, dynR2: R2_BASE, dynR3: R3_BASE }
  }, [step])

  const svgPad  = 30
  const svgSize = (dynR3 + svgPad) * 2
  const svgCX   = svgSize / 2
  const svgCY   = svgSize / 2

  // ── Breadcrumbs ────────────────────────────────────────────────────────────
  const crumbs = []
  if (emotion) crumbs.push({ label: t(`em_${emotion.id}`), bg: emotion.colors[1], tc: emotion.textColors[1] })
  if (child)   crumbs.push({ label: t(`em_${child.id}`),   bg: emotion.colors[0], tc: emotion.textColors[0] })
  if (grand)   crumbs.push({ label: t(`em_${grand.id}`),   bg: emotion.colors[2], tc: emotion.textColors[2] })

  const stepLabel = t(`step_${step}`)

  // Hovered label shown in the full-wheel tooltip badge
  const fwHovLabel = fwHov
    ? fwHov.ring === 'core'
      ? t(`em_${EMOTIONS[fwHov.ei]?.id}`)
      : fwHov.ring === 'sec'
      ? t(`em_${EMOTIONS[fwHov.ei]?.children[fwHov.ci]?.id}`)
      : t(`em_${EMOTIONS[fwHov.ei]?.children[fwHov.ci]?.children[fwHov.gi]?.id}`)
    : null

  // ── Layout constants ───────────────────────────────────────────────────────
  const RIGHT_MIN_PX    = 360
  const maxLeftFr       = Math.max(1.5, winWidth / RIGHT_MIN_PX - 1)
  const dynWheelSizeMax = Math.floor((maxLeftFr - 2) / 0.3)
  const overlayLeftFr   = Math.min(2 + wheelSize * 0.3, maxLeftFr)
  const rightColWidth   = winWidth / (overlayLeftFr + 1)
  const intensityGap    = Math.max(0, Math.floor((rightColWidth - 40 - 320) / 9))

  // ── Shared ring event handlers ─────────────────────────────────────────────
  const ringHandlers = {
    onLeave:   () => { setHov(null); setPressed(null); setJustClicked(null) },
    onRelease: () => setPressed(null),
    onCancel:  () => setPressed(null),
  }

  // ── Wheel rotation drag handlers ───────────────────────────────────────────
  function getWheelAngle(e) {
    const rect = svgWrapperRef.current.getBoundingClientRect()
    const x = e.clientX - (rect.left + rect.width  / 2)
    const y = e.clientY - (rect.top  + rect.height / 2)
    return Math.atan2(y, x) * 180 / Math.PI
  }

  function onWheelPointerDown(e) {
    dragRef.current = { pointerId: e.pointerId, prevAngle: getWheelAngle(e) }
    setIsDraggingWheel(true)
  }

  function onWheelPointerMove(e) {
    if (!dragRef.current || dragRef.current.pointerId !== e.pointerId) return
    const angle = getWheelAngle(e)
    let delta   = angle - dragRef.current.prevAngle
    // Normalize to [-180, 180] to handle the ±180° boundary
    delta = ((delta % 360) + 540) % 360 - 180
    dragRef.current.prevAngle = angle
    if (Math.abs(delta) < 0.05) return
    if (!dragRef.current.captured) {
      dragRef.current.captured = true
      e.currentTarget.setPointerCapture(e.pointerId)
    }
    rotRef.current += delta
    setWheelRotation(rotRef.current)
  }

  function onWheelPointerUp() {
    dragRef.current = null
    setIsDraggingWheel(false)
  }

  // ── Close button (overlay mode only) ──────────────────────────────────────
  const closeBtn = (
    <button
      onClick={() => setWheelOpen(false)}
      className="z-10 px-6 py-2 rounded-full text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-70 my-3"
      style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-muted)', border: '1px solid var(--btn-border)', background: 'transparent' }}
    >
      {t('closeWheel')}
    </button>
  )

  // ── Reusable: breadcrumb bar ───────────────────────────────────────────────
  const breadcrumbBar = (
    <div className="flex items-center gap-1 flex-wrap justify-center min-h-[28px] mb-0 z-10">
      {crumbs.length === 0
        ? <span className="text-[11px] italic" style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-dim)' }}>
            {t('breadcrumbEmpty')}
          </span>
        : crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-sm" style={{ color: 'var(--text-dim)' }}>›</span>}
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold tracking-tight"
                style={{ background: c.bg, color: isDark(c.bg) ? '#fff' : '#111', fontFamily: "'Manrope', sans-serif" }}>
                {c.label}
              </span>
            </span>
          ))
      }
    </div>
  )

  // ── Reusable: intensity + save overlay ────────────────────────────────────
  function IntensityPanel({ compact = false }) {
    if (step === 'core' || !selectedEmotion) return null
    return (
      <div className={`flex flex-col items-center gap-${compact ? 2 : 3} ${compact ? 'mt-1 z-10' : 'mt-4 w-full'}`}>
        <span className="text-[12px]" style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-muted)' }}>
          {t('intensityLabel')} <strong style={{ color: 'var(--text-main)' }}>{t(`em_${selectedEmotion.id}`)}</strong>?
        </span>
        <div className={compact ? 'flex' : 'flex flex-wrap justify-center gap-2'} style={compact ? { gap: intensityGap } : undefined}>
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
          <button onClick={() => { addEmotion({ emotion: selectedEmotion, intensity }); setIntensity(null) }}
            className="px-6 py-1.5 rounded-full text-[12px] font-bold cursor-pointer"
            style={{ fontFamily: "'Manrope', sans-serif", background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
            {t('save')}
          </button>
        )}
      </div>
    )
  }

  // ── Reusable: saved emotions list ─────────────────────────────────────────
  function SavedList({ maxW = false }) {
    if (savedEmotions.length === 0) return null
    return (
      <div className={`mt-1 z-10 ${maxW ? 'w-full max-w-xs' : 'w-full'}`}>
        <h2 className="text-[11px] font-semibold mb-2"
          style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-muted)' }}>
          {t('savedEmotions')}
        </h2>
        <ul className="space-y-1">
          {savedEmotions.map((item, idx) => (
            <li key={idx}
              className="flex justify-between items-center text-[12px] px-3 py-1 rounded group transition-colors"
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
    )
  }

  // ── Reusable: nav buttons ─────────────────────────────────────────────────
  function NavButtons() {
    if (step === 'core') return null
    return (
      <div className="flex gap-2 mt-1 z-10">
        <button onClick={() => { goBack(); setIntensity(null) }}
          className="px-5 py-1.5 rounded-full text-[12px] bg-transparent transition-colors cursor-pointer"
          style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: '0.5px', color: 'var(--text-muted)', border: '1px solid var(--btn-border)' }}>
          {t('back')}
        </button>
        <button onClick={() => { reset(); setIntensity(null) }}
          className="px-5 py-1.5 rounded-full text-[12px] bg-transparent transition-colors cursor-pointer"
          style={{ fontFamily: "'Manrope', sans-serif", letterSpacing: '0.5px', color: 'var(--text-dim)', border: '1px solid var(--btn-border-dim)' }}>
          {t('restart')}
        </button>
      </div>
    )
  }

  // ── Reusable: consequence form ────────────────────────────────────────────
  function ConseqForm({ maxW = false }) {
    return (
      <form className={`space-y-4 w-full mt-6 z-10 ${maxW ? 'max-w-sm' : ''}`}>
        {CONSEQ_IDS.map((id) => (
          <div key={id}>
            <label htmlFor={id}
              className="block text-[11px] font-semibold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-muted)' }}>
              {t(`cLabel_${id}`)}
            </label>
            <AutoTextarea id={id} rows={1}
              value={conseqValues[id]}
              onChange={(e) => setConseqValue(id, e.target.value)}
              placeholder={t(`cPlaceholder_${id}`)}
              className="w-full px-4 py-2.5 rounded-lg text-[12px] focus:outline-none"
              style={{ fontFamily: "'Manrope', sans-serif", background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--input-text)', transition: 'border-color 0.2s ease' }}
              onFocus={(e) => (e.target.style.borderColor = 'var(--input-border-focus)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--input-border)')}
            />
          </div>
        ))}
      </form>
    )
  }

  // ── Render: inline (mobile single-column, forceOpen=false not used here) ──
  // `inline` prop was removed — the previous "inline" rendering path is now
  // handled by the regular forceOpen + mobileForce path.

  // ── Render: "open" button (wheel closed, not forceOpen) ──────────────────
  if (!wheelOpen && !forceOpen) {
    return (
      <div className="relative flex flex-col items-center justify-start overflow-visible select-none font-sans"
        style={{ background: 'var(--bg)', transition: 'background 0.3s ease' }}>
        <h1 className="pb-4"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 'var(--fs-xl)', color: 'var(--text-muted)' }}>
          {t('sectionConsequences')}
        </h1>
        <button
          onClick={() => setWheelOpen(true)}
          className="px-8 py-5 rounded-2xl text-[15px] font-semibold cursor-pointer transition-opacity hover:opacity-80 text-center"
          style={{ fontFamily: "'Manrope', sans-serif", background: 'var(--accent-bg)', color: 'var(--accent-text)', maxWidth: 280, lineHeight: 1.5 }}
        >
          {t('wheelOpenBtn')}
        </button>
      </div>
    )
  }

  // ── Render: main layout ───────────────────────────────────────────────────
  return (
    <div
      className={forceOpen ? 'flex flex-1 min-h-0 w-full select-none font-sans' : 'fixed inset-0 z-50 flex flex-col select-none font-sans'}
      style={forceOpen ? { background: 'var(--bg)' } : { background: 'var(--bg)', transition: 'background 0.3s ease' }}
    >
      {!forceOpen && (
        <div className="pointer-events-none absolute inset-0" style={{ background: 'var(--gradient)' }} />
      )}

      {/* Close button — overlay mode only */}
      {!forceOpen && (
        <div className="flex items-center px-5 py-3 z-10 flex-shrink-0"
          style={{ borderBottom: '1px solid var(--btn-border)' }}>
          {closeBtn}
        </div>
      )}

      {/* ── Main flex row (single column on mobileForce) ── */}
      <div className={mobileForce ? 'flex flex-col flex-1 overflow-y-auto' : 'flex flex-1 min-h-0 overflow-hidden'}>

        {/* ── Left column: wheel + title + breadcrumbs ── */}
        <div
          className={`flex flex-col items-center py-4 px-3 ${mobileForce ? 'w-full' : 'overflow-y-auto'}`}
          style={mobileForce ? undefined : { flex: overlayLeftFr }}
        >
          {/* Title block */}
          <div className="text-center mb-3 z-10">
            <h1 className="pb-5"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 'var(--fs-xl)', color: 'var(--text-muted)' }}>
              {t('sectionConsequences')}
            </h1>
            <span className="block text-[10px] tracking-[5px] uppercase mb-1"
              style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-dim)' }}>
              {t('wheelSubtitle')}
            </span>
            <h1 className="m-0 text-[clamp(22px,3.5vw,34px)] tracking-tight"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'var(--text-main)' }}>
              {t('wheelTitle')}
            </h1>

            {/* Saved chips (fullscreen / mobile) */}
            {(isFullscreen || mobileForce) && savedEmotions.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                {savedEmotions.map((item, idx) => (
                  <span key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold group"
                    style={{ background: 'var(--saved-bg)', color: 'var(--text-main)', border: '1px solid var(--btn-border)' }}>
                    {t(`em_${item.emotion.id}`)}
                    <span style={{ color: 'var(--text-muted)', fontFamily: "'Manrope', sans-serif" }}>×{item.intensity}</span>
                    <button onClick={() => removeEmotion(idx)}
                      className="sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer text-[11px] font-bold transition-opacity"
                      style={{ color: 'var(--text-dim)' }}>✕</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Step label */}
          <div className="min-h-[20px] mb-1 z-10">
            <span className="text-[11px] font-semibold tracking-widest uppercase transition-colors duration-400"
              style={{ fontFamily: "'Manrope', sans-serif", color: step === 'done' ? (dk ? '#34D399' : '#10B981') : 'var(--text-dim)' }}>
              {stepLabel}
            </span>
          </div>

          {breadcrumbBar}

          {/* Full-wheel hover tooltip */}
          {showFullWheel && (
            <div className="z-10 mt-2 mb-1 px-4 py-1.5 rounded-full text-[13px] font-semibold"
              style={{
                fontFamily: "'Manrope', sans-serif", color: 'var(--text-main)',
                background: fwHovLabel ? 'var(--saved-bg)' : 'transparent',
                border: `1px solid ${fwHovLabel ? 'var(--btn-border)' : 'transparent'}`,
                whiteSpace: 'nowrap', visibility: fwHovLabel ? 'visible' : 'hidden',
              }}>
              {fwHovLabel || '\u00A0'}
            </div>
          )}

          {/* Pinch hint (mobile full-wheel only) */}
          {mobileForce && showFullWheel && (
            <p className="text-[11px] mb-1 z-10"
              style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-dim)', letterSpacing: '0.3px' }}>
              {t('wheelPinchHint')}
            </p>
          )}

          {/* ── Wheel SVG ── */}
          {showFullWheel ? (
            /* Full-reference wheel */
            <div className="relative flex flex-row items-center gap-2 z-10 flex-shrink-0"
              style={{
                width: mobileForce
                  ? 'calc(100% - 16px)'
                  : `min(calc(100% - 24px), calc(100vh - 300px + ${wheelSize * 80}px))`,
              }}>
              <div
                ref={svgWrapperRef}
                className="overflow-visible flex-1"
                style={{
                  aspectRatio: '1 / 1',
                  cursor: isDraggingWheel ? 'grabbing' : 'grab',
                  touchAction: 'none',
                  userSelect: 'none',
                }}
                onPointerDown={onWheelPointerDown}
                onPointerMove={onWheelPointerMove}
                onPointerUp={onWheelPointerUp}
                onPointerCancel={onWheelPointerUp}
              >
                <svg viewBox="0 0 1100 1100" width="100%" height="100%" style={{ display: 'block' }}>
                  <g transform="translate(550,550)">
                    <g transform={`rotate(${wheelRotation})`}>
                      <FullReferenceWheel
                        fwHov={fwHov}
                        fwPressed={fwPressed}
                        setFwHov={setFwHov}
                        setFwPressed={setFwPressed}
                        onJump={(ei, ci, gi) => { jumpTo(ei, ci, gi); setIntensity(null) }}
                        rotationDeg={wheelRotation}
                      />
                    </g>
                  </g>
                </svg>
              </div>

              {/* Fullscreen toggle */}
              {!mobileForce && (
                <button
                  onClick={() => setIsFullscreen((f) => !f)}
                  title={isFullscreen ? 'Esci dal fullscreen' : 'Fullscreen'}
                  style={{
                    flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'transparent', border: '1px solid var(--btn-border)',
                    color: 'var(--text-muted)', cursor: 'pointer',
                  }}
                >
                  {isFullscreen ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/>
                      <path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 7V3h4"/><path d="M21 7V3h-4"/>
                      <path d="M3 17v4h4"/><path d="M21 17v4h-4"/>
                    </svg>
                  )}
                </button>
              )}

              {/* Intensity overlay — shown on top of wheel when fullscreen or mobile */}
              {(isFullscreen || mobileForce) && step !== 'core' && selectedEmotion && (
                <div className="absolute inset-x-0 top-3 flex flex-col items-center gap-2 z-20 pointer-events-none">
                  <div className="pointer-events-auto flex flex-col items-center gap-2 px-5 py-3 rounded-2xl"
                    style={{ background: 'var(--bg)', border: '1px solid var(--btn-border)', opacity: 0.95 }}>
                    <span className="text-[12px]" style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-muted)' }}>
                      {t('intensityLabel')} <strong style={{ color: 'var(--text-main)' }}>{t(`em_${selectedEmotion.id}`)}</strong>?
                    </span>
                    <div className="flex gap-1.5 flex-wrap justify-center">
                      {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                        <button key={n} onClick={() => setIntensity(n)}
                          className="w-7 h-7 rounded-full text-[11px] font-bold border cursor-pointer"
                          style={intensity === n
                            ? { background: 'var(--accent-bg)', color: 'var(--accent-text)', borderColor: 'var(--accent-bg)' }
                            : { background: 'transparent', color: 'var(--text-muted)', borderColor: 'var(--btn-border)' }}>
                          {n}
                        </button>
                      ))}
                    </div>
                    {intensity && (
                      <button onClick={() => { addEmotion({ emotion: selectedEmotion, intensity }); setIntensity(null) }}
                        className="px-5 py-1 rounded-full text-[11px] font-bold cursor-pointer"
                        style={{ fontFamily: "'Manrope', sans-serif", background: 'var(--accent-bg)', color: 'var(--accent-text)' }}>
                        {t('save')}
                      </button>
                    )}
                    <div className="flex gap-2 pt-1" style={{ borderTop: '1px solid var(--btn-border)', width: '100%', justifyContent: 'center' }}>
                      <button onClick={() => { goBack(); setIntensity(null) }}
                        className="px-4 py-1 rounded-full text-[11px] bg-transparent cursor-pointer"
                        style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-muted)', border: '1px solid var(--btn-border)' }}>
                        {t('back')}
                      </button>
                      <button onClick={() => { reset(); setIntensity(null) }}
                        className="px-4 py-1 rounded-full text-[11px] bg-transparent cursor-pointer"
                        style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-dim)', border: '1px solid var(--btn-border-dim)' }}>
                        {t('restart')}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Step-by-step interactive wheel */
            <div className="z-10 w-full max-w-[760px] aspect-square max-h-[68vh] min-h-[300px] overflow-visible">
              <svg viewBox={`0 0 ${svgSize} ${svgSize}`} width="100%" height="100%" style={{ display: 'block', overflow: 'visible' }}>
                <WheelDefs />
                <g transform={`translate(${svgCX},${svgCY})`}>
                  <CoreRing
                    step={step} coreId={coreId}
                    hov={hov} pressed={pressed} justClicked={justClicked}
                    dynR1={dynR1} mobileFontMult={mobileFontMult} wheelFontWeight={wheelFontWeight}
                    onPick={(em) => { pickCore(em); setIntensity(null); setPressed(null) }}
                    onHover={(i) => setHov({ ring: 'core', idx: i })}
                    onPress={(info) => setPressed(info)}
                    {...ringHandlers}
                  />
                  <SecondaryRing
                    step={step} coreId={coreId} secIdx={secIdx}
                    hov={hov} pressed={pressed} justClicked={justClicked}
                    dynR1={dynR1} dynR2={dynR2} mobileFontMult={mobileFontMult}
                    onPick={(ci) => { pickSec(ci); setIntensity(null); setPressed(null) }}
                    onHover={(ci) => setHov({ ring: 'sec', idx: ci })}
                    onPress={(info) => setPressed(info)}
                    {...ringHandlers}
                  />
                  <TertiaryRing
                    step={step} coreId={coreId} secIdx={secIdx} terIdx={terIdx}
                    hov={hov} pressed={pressed} justClicked={justClicked}
                    dynR2={dynR2} dynR3={dynR3} mobileFontMult={mobileFontMult}
                    onPick={(gi) => { pickTer(gi); setIntensity(null); setPressed(null) }}
                    onHover={(gi) => setHov({ ring: 'ter', idx: gi })}
                    onPress={(info) => setPressed(info)}
                    {...ringHandlers}
                  />
                </g>
              </svg>
            </div>
          )}

          {/* Slider — shown under the wheel when fullscreen */}
          {!mobileForce && isFullscreen && showFullWheel && (
            <div className="w-full flex justify-center mt-3 px-8">
              <input type="range" min={0} max={dynWheelSizeMax} value={wheelSize}
                onChange={(e) => setWheelSize(Number(e.target.value))}
                style={{ width: '80%', accentColor: 'var(--accent-bg)', cursor: 'pointer' }}
              />
            </div>
          )}

        </div>{/* end left column */}

        {/* ── Right column — hidden when fullscreen ── */}
        {(!isFullscreen || mobileForce) && (
          <div
            className={mobileForce ? 'w-full flex flex-col' : 'flex flex-col overflow-hidden'}
            style={mobileForce ? undefined : { flex: 1 }}
          >
            {/* Scrollable content */}
            <div className={mobileForce ? 'flex flex-col items-center px-5 py-2' : 'flex flex-col flex-1 overflow-y-auto py-4 px-5'}>

              {!mobileForce && <IntensityPanel compact />}
              {!mobileForce && <SavedList maxW />}
              {!mobileForce && <NavButtons />}

              <ConseqForm maxW={!mobileForce} />

            </div>

            {/* Zoom slider — pinned at bottom of right column */}
            {!mobileForce && (
              <div className="flex-shrink-0 flex items-center justify-center py-4"
                style={{ borderTop: '1px solid var(--btn-border)' }}>
                <input type="range" min={0} max={dynWheelSizeMax} value={wheelSize}
                  onChange={(e) => setWheelSize(Number(e.target.value))}
                  style={{ width: '80%', accentColor: 'var(--accent-bg)', cursor: 'pointer' }}
                />
              </div>
            )}

          </div>
        )}

      </div>{/* end flex row */}
    </div>
  )
}
