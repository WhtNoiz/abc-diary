import EMOTIONS from '../../data/emotionsData'
import { useTranslation } from '../../hooks/useTranslation'
import {
  makePath, radialTransform,
  fSize, scaleOrigin, segScale,
  SCALE_TRANSITION, SCALE_TRANSITION_PRESS,
} from '../../utils/wheelGeometry'

/**
 * Renders the secondary-emotion ring for the interactive step-by-step wheel.
 * Only mounts segments when a core emotion is selected.
 *
 * Must be rendered inside an SVG `<g transform="translate(cx,cy)">` block.
 */
export default function SecondaryRing({
  step, coreId, secIdx,
  hov, pressed, justClicked,
  dynR1, dynR2, mobileFontMult,
  onPick, onHover, onLeave, onPress, onRelease, onCancel,
}) {
  const { t } = useTranslation()
  const emotion = coreId ? EMOTIONS.find((e) => e.id === coreId) : null
  if (!emotion || step === 'core') return null

  const span     = (2 * Math.PI) / emotion.children.length
  const secStart = -Math.PI / 2
  const hovIdx   = hov?.ring === 'sec' ? hov.idx : null

  const segs = emotion.children.map((ch, ci) => {
    const sa = secStart + ci * span
    const ea = secStart + (ci + 1) * span

    const isActive      = secIdx === ci
    const isDimmed      = step !== 'secondary' && !isActive
    const dist          = hovIdx !== null ? (ci === hovIdx ? 0 : 1) : null
    const isPressed     = pressed?.ring === 'sec' && pressed?.idx === ci
    const isJustClicked = justClicked?.ring === 'sec' && justClicked?.idx === ci
    const effectiveDist = isJustClicked ? null : dist
    const scale         = isPressed ? 0.9 : (effectiveDist !== null ? segScale(effectiveDist) : 1)
    const transition    = isPressed ? SCALE_TRANSITION_PRESS : SCALE_TRANSITION
    const fontSize      = Math.round(fSize(sa, ea, dynR1, dynR2, 34) * mobileFontMult)

    return {
      isHov: ci === hovIdx,
      jsx: (
        <g
          key={ch.id}
          onClick={step === 'secondary' ? () => onPick(ci) : undefined}
          onPointerEnter={() => step === 'secondary' && onHover(ci)}
          onPointerLeave={onLeave}
          onPointerDown={() => step === 'secondary' && onPress({ ring: 'sec', idx: ci })}
          onPointerUp={onRelease}
          onPointerCancel={onCancel}
          style={{
            cursor: step === 'secondary' ? 'pointer' : 'default',
            transformOrigin: scaleOrigin(sa, ea, dynR1, dynR2),
            transform: `scale(${scale})`,
            transition,
            opacity: isDimmed ? 0.18 : 1,
          }}
        >
          <path
            d={makePath(dynR1, dynR2, sa, ea)}
            fill={emotion.colors[0]}
            stroke="#ffffff18"
            strokeWidth={0.8}
          />
          <text
            transform={radialTransform(sa, ea, dynR1, dynR2)}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="'Manrope', sans-serif"
            fontWeight="500"
            fontSize={fontSize}
            fill={emotion.textColors[0]}
            pointerEvents="none"
          >
            {t(`em_${ch.id}`)}
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
