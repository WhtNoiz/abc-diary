import useEmotionsStore  from '../store/emotionsStore'
import generatePDF       from '../utils/pdfBuilder'
import { useTranslation } from '../hooks/useTranslation'

const ActionButtons = () => {
  const name          = useEmotionsStore((s) => s.name)
  const surname       = useEmotionsStore((s) => s.surname)
  const savedEmotions = useEmotionsStore((s) => s.savedEmotions)
  
  // Pass the full snapshot to the PDF builder (it needs all fields)
  const state         = useEmotionsStore()
  const { t }         = useTranslation()

  const handleExport = () => {
    if (!name.trim() || !surname.trim()) {
      alert(t('alertNameRequired'))
      return
    }
    if (savedEmotions.length === 0) {
      alert(t('alertEmotionRequired'))
      return
    }
    if (window.confirm(t('confirmPDF', name, surname))) generatePDF(state, {}, t)
  }

  const resetEverything = () => {
    if (window.confirm(t('confirmRestart'))) window.location.reload()
  }

  return (
    <div className="md:col-span-2 flex justify-center gap-4 pb-10">
      <button
        onClick={handleExport}
        className="px-8 py-3 rounded-full text-[13px] font-bold tracking-wide cursor-pointer transition-opacity hover:opacity-80"
        style={{ fontFamily: "'Manrope', sans-serif", background: 'var(--accent-bg)', color: 'var(--accent-text)' }}
      >
        {t('generatePDF')}
      </button>
      <button
        onClick={resetEverything}
        className="px-8 py-3 rounded-full text-[13px] font-bold tracking-wide bg-transparent cursor-pointer group"
        style={{ fontFamily: "'Manrope', sans-serif", color: 'var(--text-muted)', border: '1px solid var(--btn-border)', transition: 'color 0.2s ease, border-color 0.2s ease, background 0.2s ease' }}
        onMouseEnter={e => {
          e.currentTarget.style.color = '#ef4444'
          e.currentTarget.style.borderColor = '#ef444466'
          e.currentTarget.style.background = '#ef44440f'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.color = 'var(--text-muted)'
          e.currentTarget.style.borderColor = 'var(--btn-border)'
          e.currentTarget.style.background = 'transparent'
        }}
      >
        {t('restart')}
      </button>
    </div>
  )
}

export default ActionButtons
