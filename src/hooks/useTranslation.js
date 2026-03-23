import useI18nStore from '../store/i18nStore'
import it from '../i18n/it'
import en from '../i18n/en'

const DICTS = { it, en }

export function useTranslation() {
  const locale = useI18nStore((s) => s.locale)
  const dict   = DICTS[locale] ?? it
  const t = (key, ...args) => {
    const val = dict[key]
    if (val === undefined) return key
    if (typeof val === 'function') return val(...args)
    return val
  }

  return { t, locale }
}
