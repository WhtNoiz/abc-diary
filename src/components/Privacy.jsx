import { useTranslation } from '../hooks/useTranslation'

const Privacy = () => {
  const { t } = useTranslation()

  return (
    <div
      className="md:col-span-2 flex justify-center pb-4 pt-4 mx-8 mb-6 rounded-2xl"
      style={{ background: 'rgba(122,170,124,0.08)', border: '1px solid rgba(90,130,92,0.35)' }}
    >
      <p className="text-[15px] md:text-[14px] text-neutral-500 text-center" style={{ fontFamily: "'Manrope', sans-serif" }}>
        <span className="font-bold text-neutral-400">{t('privacyTitle')}</span>{' '}
        {t('privacyText')}
      </p>
    </div>
  )
}

export default Privacy
