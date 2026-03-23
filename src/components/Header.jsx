import { useState, useRef } from 'react'
import LanguageSwitcher from './ui/LanguageSwitcher'
import { useTranslation } from '../hooks/useTranslation'

function ThemeToggle({ darkMode, setDarkMode }) {
  const { t }       = useTranslation()
  const [tip, setTip] = useState(false)
  const timer         = useRef(null)

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', flexDirection: 'column', alignItems: 'center' }}
      onMouseEnter={() => { timer.current = setTimeout(() => setTip(true), 600) }}
      onMouseLeave={() => { clearTimeout(timer.current); setTip(false) }}
    >
      <button
        onClick={() => setDarkMode((d) => !d)}
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        style={{
          width: 52, height: 28, borderRadius: 999,
          border: darkMode ? '1.5px solid #4f4a8a' : '1.5px solid #a0a0c8',
          background: darkMode ? '#2d2b55' : '#dde0f5',
          cursor: 'pointer', flexShrink: 0, transition: 'background 0.3s ease, border-color 0.3s ease',
          position: 'relative',
          boxShadow: darkMode ? '0 0 0 1px #3b3878' : '0 0 0 1px #b0b4d8',
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: darkMode ? 26 : 3,
          width: 20, height: 20, borderRadius: '50%',
          background: darkMode ? '#c8c2ff' : '#3b3670',
          transition: 'left 0.3s ease',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 10, lineHeight: 1,
        }}>
          {darkMode ? '🌙' : '☀️'}
        </span>
      </button>

      {tip && (
        <span style={{
          position: 'absolute',
          top: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: "'Manrope', sans-serif",
          fontSize: 10, fontWeight: 500, letterSpacing: '0.4px',
          color: 'var(--text-dim)',
          background: 'var(--input-bg)',
          border: '1px solid var(--btn-border)',
          borderRadius: 8,
          padding: '3px 8px',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 100,
        }}>
          {darkMode ? t('switchLight') : t('switchDark')}
        </span>
      )}
    </div>
  )
}

const Header = ({ darkMode, setDarkMode, onBack }) => {
  const { t } = useTranslation()

  const title = (
    <h1
      className="text-[clamp(28px,4vw,48px)] tracking-tight"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, color: 'var(--text-main)' }}
    >
     {t("title")}
    </h1>
  )

  const backBtn = onBack && (
    <button
      onClick={onBack}
      style={{
        fontFamily: "'Manrope', sans-serif",
        fontSize: 12, letterSpacing: '0.5px',
        color: 'var(--text-muted)', border: '1px solid var(--btn-border)',
        background: 'transparent', borderRadius: 999,
        padding: '4px 16px', cursor: 'pointer', whiteSpace: 'nowrap',
      }}
    >
      {t('backBtn')}
    </button>
  )

  return (
    <header style={{ borderBottom: '1px solid var(--header-border)', transition: 'border-color 0.3s ease' }}>
      {onBack ? (
        <>
          {/* Mobile: [backBtn | toggle] on first row, title centred on second row */}
          <div className="flex flex-col md:hidden">
            <div className="flex items-center justify-between px-6 py-3">
              {backBtn}
              <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
            </div>
            <div className="flex items-center justify-center px-6 pb-3">
              {title}
            </div>
          </div>

          {/* Desktop: single row — [langSwitch + backBtn] left, title centre, toggle right */}
          <div className="hidden md:flex items-center justify-center relative px-6 py-5">
            <span className="flex items-center gap-2" style={{ position: 'absolute', left: 24 }}>
              <LanguageSwitcher />
              {backBtn}
            </span>
            {title}
            <span style={{ position: 'absolute', right: 64 }}><ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} /></span>
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center relative px-6 py-5">
          <span style={{ position: 'absolute', left: 24 }}>
            <LanguageSwitcher />
          </span>
          {title}
          <span style={{ position: 'absolute', right: 64 }}><ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} /></span>
        </div>
      )}
    </header>
  )
}

export default Header
