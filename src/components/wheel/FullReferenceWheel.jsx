import EMOTIONS from '../../data/emotionsData'
import { useTranslation } from '../../hooks/useTranslation'
import {
  CORE_ANGLES,
  makePath, radialTransform,
  fSizeFW, scaleOrigin,
} from '../../utils/wheelGeometry'

const FW_TRANS = 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1)'
const FW_PRESS = 'transform 0.1s ease'

/**
 * Static full-reference wheel — renders all three rings simultaneously.
 * Used inside the `/wheel` page when `showFullWheel` is true.
 *
 * Must be placed inside an SVG with viewBox="0 0 1100 1100" and a
 * `<g transform="translate(550,550)">` parent.
 *
 * @param {{
 *   fwHov: object | null,
 *   fwPressed: object | null,
 *   setFwHov: (v: object | null) => void,
 *   setFwPressed: (v: object | null) => void,
 *   onJump: (ei: number, ci: number | null, gi: number | null) => void,
 * }} props
 */
export default function FullReferenceWheel({
  fwHov, fwPressed, setFwHov, setFwPressed, onJump, rotationDeg = 0,
}) {
  const { t } = useTranslation()

  // ── Core ring ──────────────────────────────────────────────────────────────
  const coreArr = EMOTIONS.map((em, ei) => {
    const { s, e } = CORE_ANGLES[ei]
    const fs     = fSizeFW(s, e, 0, 165, 22)
    const isHov  = fwHov?.ring === 'core' && fwHov.ei === ei
    const isPrs  = fwPressed?.ring === 'core' && fwPressed.ei === ei
    const scale  = isPrs ? 0.92 : isHov ? 1.12 : 1

    return {
      isHov,
      jsx: (
        <g
          key={em.id}
          style={{
            cursor: 'pointer',
            transform: `scale(${scale})`,
            transformOrigin: scaleOrigin(s, e, 0, 165),
            transition: isPrs ? FW_PRESS : FW_TRANS,
          }}
          onPointerEnter={() => setFwHov({ ring: 'core', ei })}
          onPointerLeave={() => { setFwHov(null); setFwPressed(null) }}
          onPointerDown={() => setFwPressed({ ring: 'core', ei })}
          onPointerUp={() => setFwPressed(null)}
          onPointerCancel={() => setFwPressed(null)}
          onClick={() => { onJump(ei, null, null); setFwHov(null); setFwPressed(null) }}
        >
          <path d={makePath(0, 165, s, e)} fill={em.colors[1]} stroke="#ffffff22" strokeWidth={0.8} />
          <text
            transform={radialTransform(s, e, 0, 165, rotationDeg)}
            textAnchor="middle" dominantBaseline="central"
            fontFamily="'Manrope',sans-serif" fontWeight="500"
            fontSize={fs} fill={em.textColors[1]} pointerEvents="none"
          >
            {t(`em_${em.id}`)}
          </text>
        </g>
      ),
    }
  })

  const hovCi      = coreArr.findIndex((s) => s.isHov)
  const orderedCore = hovCi >= 0
    ? [...coreArr.filter((_, i) => i !== hovCi), coreArr[hovCi]]
    : coreArr

  // ── Secondary ring ─────────────────────────────────────────────────────────
  const secArr = EMOTIONS.flatMap((em, ei) => {
    const { s: cs, e: ce } = CORE_ANGLES[ei]
    const span = (ce - cs) / em.children.length
    return em.children.map((ch, ci) => {
      const sa   = cs + ci * span
      const ea   = cs + (ci + 1) * span
      const fs   = fSizeFW(sa, ea, 165, 315, 22)
      const isHov = fwHov?.ring === 'sec' && fwHov.ei === ei && fwHov.ci === ci
      const isPrs = fwPressed?.ring === 'sec' && fwPressed.ei === ei && fwPressed.ci === ci
      const scale = isPrs ? 0.92 : isHov ? 1.12 : 1

      return {
        isHov,
        jsx: (
          <g
            key={ch.id}
            style={{
              cursor: 'pointer',
              transform: `scale(${scale})`,
              transformOrigin: scaleOrigin(sa, ea, 165, 315),
              transition: isPrs ? FW_PRESS : FW_TRANS,
            }}
            onPointerEnter={() => setFwHov({ ring: 'sec', ei, ci })}
            onPointerLeave={() => { setFwHov(null); setFwPressed(null) }}
            onPointerDown={() => setFwPressed({ ring: 'sec', ei, ci })}
            onPointerUp={() => setFwPressed(null)}
            onPointerCancel={() => setFwPressed(null)}
            onClick={() => { onJump(ei, ci, null); setFwHov(null); setFwPressed(null) }}
          >
            <path d={makePath(165, 315, sa, ea)} fill={em.colors[0]} stroke="#ffffff22" strokeWidth={0.8} />
            <text
              transform={radialTransform(sa, ea, 165, 315, rotationDeg)}
              textAnchor="middle" dominantBaseline="central"
              fontFamily="'Manrope',sans-serif" fontWeight="400"
              fontSize={fs} fill={em.textColors[0]} pointerEvents="none"
            >
              {t(`em_${ch.id}`)}
            </text>
          </g>
        ),
      }
    })
  })

  const hovSi      = secArr.findIndex((s) => s.isHov)
  const orderedSec = hovSi >= 0
    ? [...secArr.filter((_, i) => i !== hovSi), secArr[hovSi]]
    : secArr

  // ── Tertiary ring ──────────────────────────────────────────────────────────
  const terArr = EMOTIONS.flatMap((em, ei) => {
    const { s: cs, e: ce } = CORE_ANGLES[ei]
    const secSpan = (ce - cs) / em.children.length
    return em.children.flatMap((ch, ci) => {
      const segS  = cs + ci * secSpan
      const gSpan = secSpan / ch.children.length
      return ch.children.map((gr, gi) => {
        const sa   = segS + gi * gSpan
        const ea   = segS + (gi + 1) * gSpan
        const fs   = fSizeFW(sa, ea, 315, 520, 14)
        const isHov = fwHov?.ring === 'ter' && fwHov.ei === ei && fwHov.ci === ci && fwHov.gi === gi
        const isPrs = fwPressed?.ring === 'ter' && fwPressed.ei === ei && fwPressed.ci === ci && fwPressed.gi === gi
        const scale = isPrs ? 0.92 : isHov ? 1.15 : 1

        return {
          isHov,
          jsx: (
            <g
              key={gr.id}
              style={{
                cursor: 'pointer',
                transform: `scale(${scale})`,
                transformOrigin: scaleOrigin(sa, ea, 315, 520),
                transition: isPrs ? FW_PRESS : FW_TRANS,
              }}
              onPointerEnter={() => setFwHov({ ring: 'ter', ei, ci, gi })}
              onPointerLeave={() => { setFwHov(null); setFwPressed(null) }}
              onPointerDown={() => setFwPressed({ ring: 'ter', ei, ci, gi })}
              onPointerUp={() => setFwPressed(null)}
              onPointerCancel={() => setFwPressed(null)}
              onClick={() => { onJump(ei, ci, gi); setFwHov(null); setFwPressed(null) }}
            >
              <path d={makePath(315, 520, sa, ea)} fill={em.colors[2]} stroke="#ffffff22" strokeWidth={0.8} />
              <text
                transform={radialTransform(sa, ea, 315, 520, rotationDeg)}
                textAnchor="middle" dominantBaseline="central"
                fontFamily="'Manrope',sans-serif" fontWeight="400"
                fontSize={fs} fill={em.textColors[2]} pointerEvents="none"
              >
                {t(`em_${gr.id}`)}
              </text>
            </g>
          ),
        }
      })
    })
  })

  const hovTi      = terArr.findIndex((s) => s.isHov)
  const orderedTer = hovTi >= 0
    ? [...terArr.filter((_, i) => i !== hovTi), terArr[hovTi]]
    : terArr

  return (
    <>
      {orderedCore.map((s) => s.jsx)}
      {orderedSec.map((s) => s.jsx)}
      {orderedTer.map((s) => s.jsx)}
    </>
  )
}
