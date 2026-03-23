import EMOTIONS from '../../data/emotionsData'
import { useTranslation } from '../../hooks/useTranslation'
import {
  CORE_ANGLES, R0,
  makePath, radialTransform,
  fSize, scaleOrigin, segScale,
  SCALE_TRANSITION, SCALE_TRANSITION_PRESS,
} from '../../utils/wheelGeometry'

/**
 * Renders all core-emotion segments for the interactive step-by-step wheel.
 *
 * Must be rendered inside an SVG `<g transform="translate(cx,cy)">` block.
 *
 * @param {{
 *   step: string,
 *   coreId: string | null,
 *   hov: {ring:string, idx:number} | null,
 *   pressed: {ring:string, idx:number} | null,
 *   justClicked: {ring:string, idx:number} | null,
 *   dynR1: number,
 *   mobileFontMult: number,
 *   wheelFontWeight: string,
 *   onPick: (emotion: object) => void,
 *   onHover: (idx: number) => void,
 *   onLeave: () => void,
 *   onPress: (info: object) => void,
 *   onRelease: () => void,
 *   onCancel: () => void,
 * }} props
 */
export default function CoreRing({
  step, coreId,
  hov, pressed, justClicked,
  dynR1, mobileFontMult, wheelFontWeight,
  onPick, onHover, onLeave, onPress, onRelease, onCancel,
}) {
  const { t } = useTranslation()
  const hovIdx = hov?.ring === 'core' ? hov.idx : null

  const segs = EMOTIONS.map((em, i) => {
    const { s, e }      = CORE_ANGLES[i]
    const isActive      = coreId === em.id
    const isDimmed      = step !== 'core' && !isActive
    const dist          = hovIdx !== null ? (i === hovIdx ? 0 : 1) : null
    const isPressed     = pressed?.ring === 'core' && pressed?.idx === i
    const isJustClicked = justClicked?.ring === 'core' && justClicked?.idx === i
    const effectiveDist = isJustClicked ? null : dist
    const scale         = isPressed ? 0.9 : (effectiveDist !== null ? segScale(effectiveDist) : 1)
    const transition    = isPressed ? SCALE_TRANSITION_PRESS : SCALE_TRANSITION
    const fontSize      = Math.round(fSize(s, e, R0, dynR1, 26) * mobileFontMult)

    return {
      isHov: i === hovIdx,
      jsx: (
        <g
          key={em.id}
          onClick={step === 'core' ? () => onPick(em) : undefined}
          onPointerEnter={() => step === 'core' && onHover(i)}
          onPointerLeave={onLeave}
          onPointerDown={() => step === 'core' && onPress({ ring: 'core', idx: i })}
          onPointerUp={onRelease}
          onPointerCancel={onCancel}
          style={{
            cursor: step === 'core' ? 'pointer' : 'default',
            transformOrigin: scaleOrigin(s, e, R0, dynR1),
            transform: `scale(${scale})`,
            transition,
            opacity: isDimmed ? 0.18 : 1,
          }}
        >
          <path
            d={makePath(R0, dynR1, s, e)}
            fill={em.colors[1]}
            stroke="#ffffff18"
            strokeWidth={0.8}
          />
          <text
            transform={radialTransform(s, e, R0, dynR1)}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="'Manrope', sans-serif"
            fontWeight={wheelFontWeight}
            fontSize={fontSize}
            fill={em.textColors[1]}
            pointerEvents="none"
          >
            {t(`em_${em.id}`)}
          </text>
        </g>
      ),
    }
  })

  // Paint hovered segment last so it renders on top
  const sorted = hovIdx !== null
    ? [...segs.filter((_, i) => i !== hovIdx), segs[hovIdx]]
    : segs

  return <>{sorted.map((s) => s.jsx)}</>
}
