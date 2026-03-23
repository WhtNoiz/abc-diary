import { create } from 'zustand'

const SUPPORTED = ['it', 'en']

function loadLocale() {
  try {
    const saved = localStorage.getItem('locale')
    if (saved && SUPPORTED.includes(saved)) return saved
  } catch (_) { /* localStorage unavailable */ }
  return 'it'
}

const useI18nStore = create((set) => ({
  locale: loadLocale(),
  setLocale: (locale) => {
    if (!SUPPORTED.includes(locale)) return
    try { localStorage.setItem('locale', locale) } catch (_) {}
    set({ locale })
  },
}))

export default useI18nStore
