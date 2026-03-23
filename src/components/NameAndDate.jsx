import useEmotionsStore  from '../store/emotionsStore'
import { formatDate }    from '../utils/formatDate'
import { useTranslation } from '../hooks/useTranslation'

const inputStyle = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: 'var(--fs-base)',
  background: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  color: 'var(--input-text)',
  transition: 'border-color 0.2s ease',
}

const labelStyle = {
  fontFamily: "'Manrope', sans-serif",
  fontSize: 'var(--fs-sm)',
  color: 'var(--text-muted)',
}

const Name = () => {
  const name      = useEmotionsStore((s) => s.name)
  const surname   = useEmotionsStore((s) => s.surname)
  const date      = useEmotionsStore((s) => s.date)
  const setName    = useEmotionsStore((s) => s.setName)
  const setSurname = useEmotionsStore((s) => s.setSurname)
  const setDate    = useEmotionsStore((s) => s.setDate)
  const { t }     = useTranslation()

  const onFocus = (e) => (e.target.style.borderColor = 'var(--input-border-focus)')
  const onBlur  = (e) => (e.target.style.borderColor = 'var(--input-border)')

  return (
    <div
      className="relative flex flex-col items-center justify-start select-none font-sans w-full overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      <div className="pointer-events-none absolute inset-0" style={{ background: 'var(--gradient)' }} />

      <form className="space-y-3 w-full">
        <div>
          <label htmlFor="name" className="block font-semibold tracking-widest uppercase mb-2" style={labelStyle}>
            {t('labelName')}
          </label>
          <input
            id="name" type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('placeholderName')}
            onFocus={onFocus} onBlur={onBlur}
            className="w-full px-4 py-2.5 rounded-lg focus:outline-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="surname" className="block font-semibold tracking-widest uppercase mb-2" style={labelStyle}>
            {t('labelSurname')}
          </label>
          <input
            id="surname" type="text" value={surname}
            onChange={(e) => setSurname(e.target.value)}
            placeholder={t('placeholderSurname')}
            onFocus={onFocus} onBlur={onBlur}
            className="w-full px-4 py-2.5 rounded-lg focus:outline-none"
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="date" className="block font-semibold tracking-widest uppercase mb-2" style={labelStyle}>
            {t('labelDate')}
          </label>
          <input
            id="date" type="date" value={date}
            onChange={(e) => setDate(e.target.value)}
            onFocus={onFocus} onBlur={onBlur}
            className="w-full min-w-0 px-4 py-2.5 rounded-lg focus:outline-none"
            style={inputStyle}
          />
          {date && (
            <p className="mt-1" style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'var(--fs-sm)', color: 'var(--text-muted)' }}>
              {formatDate(date)}
            </p>
          )}
        </div>
      </form>
    </div>
  )
}

export default Name
