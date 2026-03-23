import useEmotionsStore from '../store/emotionsStore'
import AutoTextarea     from './AutoTextarea'
import { useTranslation } from '../hooks/useTranslation'

const inputStyle = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: 'var(--fs-base)',
  background: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  color: 'var(--input-text)',
  transition: 'border-color 0.2s ease',
}

/** Field IDs in display order. */
const FIELD_IDS = ['cosa', 'quando', 'dove', 'chi', 'facendo']

const Situation = () => {
  const situationValues  = useEmotionsStore((s) => s.situationValues)
  const setSituationValue = useEmotionsStore((s) => s.setSituationValue)
  const { t } = useTranslation()

  const onFocus = (e) => (e.target.style.borderColor = 'var(--input-border-focus)')
  const onBlur  = (e) => (e.target.style.borderColor = 'var(--input-border)')

  return (
    <div
      className="relative flex flex-col items-center justify-start select-none font-sans"
      style={{ background: 'var(--bg)' }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: 'var(--gradient)' }} />

      <h1
        className="pb-2"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, fontSize: 'var(--fs-xl)', color: 'var(--text-muted)' }}
      >
        {t('sectionSituation')}
      </h1>

      <form className="space-y-4 w-full z-10">
        {FIELD_IDS.map((id) => (
          <div key={id}>
            <label
              htmlFor={id}
              className="block font-semibold tracking-widest uppercase mb-2"
              style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}
            >
              {t(`sLabel_${id}`)}
            </label>
            <AutoTextarea
              id={id}
              rows={1}
              value={situationValues[id]}
              onChange={(e) => setSituationValue(id, e.target.value)}
              placeholder={t(`sPlaceholder_${id}`)}
              onFocus={onFocus}
              onBlur={onBlur}
              className="w-full px-4 py-2.5 rounded-lg focus:outline-none"
              style={inputStyle}
            />
          </div>
        ))}
      </form>
    </div>
  )
}

export default Situation
