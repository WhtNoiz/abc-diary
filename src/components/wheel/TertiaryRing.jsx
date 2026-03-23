import EMOTIONS from '../../data/emotionsData'
import { useTranslation } from '../../hooks/useTranslation'
import {
  makePath, radialTransform,
  fSize, scaleOrigin, segScale,
  SCALE_TRANSITION, SCALE_TRANSITION_PRESS,
} from '../../utils/wheelGeometry'

/**
 * Renders the tertiary-emotion ring for the interactive step-by-step wheel.
 * Only mounts when step is 'tertiary' or 'done'.
 *
 * Must be rendered inside an SVG `<g transform="translate(cx,cy)">` block.
 */
export default function TertiaryRing({
  step, coreId, secIdx, terIdx,
  hov, pressed, justClicked,
  dynR2, dynR3, mobileFontMult,
  onPick, onHover, onLeave, onPress, onRelease, onCancel,
}) {
  const { t } = useTranslation()
  const emotion = coreId ? EMOTIONS.find((e) => e.id === coreId) : null
  const child   = emotion && secIdx !== null ? emotion.children[secIdx] : null

  if (!emotion || !child || (step !== 'tertiary' && step !== 'done')) return null

  const secSpan  = (2 * Math.PI) / emotion.children.length
  const segS     = -Math.PI / 2 + secIdx * secSpan
  const segE     = -Math.PI / 2 + (secIdx + 1) * secSpan
  const gSpan    = (segE - segS) / child.children.length
  const hovIdx   = hov?.ring === 'ter' ? hov.idx : null

  const segs = child.children.map((gr, gi) => {
    const sa = segS + gi * gSpan
    const ea = segS + (gi + 1) * gSpan

    const isActive      = terIdx === gi
    const isDimmed      = step === 'done' && !isActive
    const dist          = hovIdx !== null ? (gi === hovIdx ? 0 : 1) : null
    const isPressed     = pressed?.ring === 'ter' && pressed?.idx === gi
    const isJustClicked = justClicked?.ring === 'ter' && justClicked?.idx === gi
    const effectiveDist = isJustClicked ? null : dist
    const scale         = isPressed ? 0.9 : (effectiveDist !== null ? segScale(effectiveDist) : 1)
    const transition    = isPressed ? SCALE_TRANSITION_PRESS : SCALE_TRANSITION
    const fontSize      = Math.round(fSize(sa, ea, dynR2, dynR3, 32) * mobileFontMult)

    return {
      isHov: gi === hovIdx,
      jsx: (
        <g
          key={gr.id}
          onClick={step === 'tertiary' ? () => onPick(gi) : undefined}
          onPointerEnter={() => step === 'tertiary' && onHover(gi)}
          onPointerLeave={onLeave}
          onPointerDown={() => step === 'tertiary' && onPress({ ring: 'ter', idx: gi })}
          onPointerUp={onRelease}
          onPointerCancel={onCancel}
          style={{
            cursor: step === 'tertiary' ? 'pointer' : 'default',
            transformOrigin: scaleOrigin(sa, ea, dynR2, dynR3),
            transform: `scale(${scale})`,
            transition,
            opacity: isDimmed ? 0.18 : 1,
          }}
        >
          <path
            d={makePath(dynR2, dynR3, sa, ea)}
            fill={emotion.colors[2]}
            stroke="#ffffff18"
            strokeWidth={0.8}
            filter={isActive ? 'url(#glow)' : undefined}
          />
          <text
            transform={radialTransform(sa, ea, dynR2, dynR3)}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="'Manrope', sans-serif"
            fontWeight="500"
            fontSize={fontSize}
            fill={emotion.textColors[2]}
            pointerEvents="none"
          >
            {t(`em_${gr.id}`)}
          </text>
        </g>
      ),
    }
  })

  const sorted = hovIdx !== null
    ? [...segs.filter((_, i) => i !== hovIdx), segs[hovIdx]]
    : segs

  return <g className="ring-bloom">{sorted.map((s) => s.jsx)}</g>
}
