import { useState, useEffect, useRef } from 'react'
import useI18nStore from '../../store/i18nStore'

const LOCALES = [
  { code: 'it', flag: '🇮🇹', label: 'IT' },
  { code: 'en', flag: '🇬🇧', label: 'EN' },
]

export default function LanguageSwitcher() {
  const locale    = useI18nStore((s) => s.locale)
  const setLocale = useI18nStore((s) => s.setLocale)
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [open])

  const active = LOCALES.find((l) => l.code === locale)
  const others = LOCALES.filter((l) => l.code !== locale)

  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
    padding: '4px 6px',
    borderRadius: 12,
    border: '1px solid var(--btn-border)',
    background: 'var(--input-bg)',
    minWidth: 68,
  }

  const btnStyle = (isActive) => ({
    fontFamily: "'Manrope', sans-serif",
    fontSize: 11,
    fontWeight: isActive ? 700 : 400,
    letterSpacing: '0.5px',
    color: isActive ? 'var(--accent-text)' : 'var(--text-dim)',
    background: isActive ? 'var(--accent-bg)' : 'transparent',
    border: 'none',
    borderRadius: 8,
    padding: '3px 8px',
    cursor: isActive ? 'default' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 5,
    transition: 'color 0.2s, background 0.2s',
    whiteSpace: 'nowrap',
    width: '100%',
  })

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div style={containerStyle}>
        {/* Active locale — always visible, click to toggle list */}
        <button style={btnStyle(true)} onClick={() => setOpen((o) => !o)}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <span>{active.flag}</span>
            <span>{active.label}</span>
          </span>
          <span style={{
            fontSize: 8,
            color: 'var(--accent-text)',
            transition: 'transform 0.2s',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            display: 'inline-block',
          }}>▾</span>
        </button>

        {/* Other locales — visible only when open */}
        {open && others.map(({ code, flag, label }) => (
          <button
            key={code}
            style={btnStyle(false)}
            onClick={() => { setLocale(code); setOpen(false) }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span>{flag}</span>
              <span>{label}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}
