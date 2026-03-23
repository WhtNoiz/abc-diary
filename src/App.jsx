import { useState, useEffect } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import EmotionWheel   from './components/EmotionWheel'
import EmotionBubbles from './components/EmotionBubbles'
import Name           from './components/NameAndDate'
import Situation      from './components/Situation'
import Thougts        from './components/Thougts'
import Header         from './components/Header'
import Privacy        from './components/Privacy'
import ActionButtons  from './components/ActionButtons'
import useEmotionsStore          from './store/emotionsStore'
import { useTranslation }        from './hooks/useTranslation'
import { useSEO }                from './hooks/useSeo'
import { usePerformanceMetrics } from './hooks/usePerformanceMetrics'
import PerformanceOverlay        from './components/ui/PerformanceOverlay'
import { Analytics } from '@vercel/analytics/react';

function MainPage({ darkMode, setDarkMode }) {
  const navigate   = useNavigate()
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768)
  const name    = useEmotionsStore((s) => s.name)
  const surname = useEmotionsStore((s) => s.surname)
  const { t }   = useTranslation()
  const { _vis, _hide } = usePerformanceMetrics(name, surname)

  useEffect(() => {
    const h = () => setIsDesktop(window.innerWidth >= 768)
    window.addEventListener('resize', h)
    return () => window.removeEventListener('resize', h)
  }, [])

  return (
    <div
      className={`flex flex-col w-full min-h-screen overflow-x-hidden ${darkMode ? 'theme-dark' : 'theme-light'}`}
      style={{ background: 'var(--bg)', transition: 'background 0.3s ease' }}
    >
      <Analytics />
      <Header darkMode={darkMode} setDarkMode={setDarkMode} />

      {name && surname && (
        <div className="w-full text-center py-3 px-6">
          <p style={{ fontFamily: "'Manrope', sans-serif", fontSize: 'clamp(14px, 1.1vw, 19px)', color: 'var(--text-muted)' }}>
            {t('welcome')}{' '}
            <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 600, color: 'var(--text-main)' }}>
              {name} {surname}
            </span>!
          </p>
        </div>
      )}

      <PerformanceOverlay _vis={_vis} _hide={_hide} />

      {isDesktop ? (
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="grid grid-cols-2 grid-rows-1 gap-6 px-8 py-8 h-full overflow-hidden">
            <div className="flex flex-col justify-between overflow-y-auto h-full">
              <Name />
              <Situation />
              <Thougts />
            </div>
            <div className="flex flex-col overflow-y-auto h-full">
              <EmotionBubbles darkMode={darkMode} onViewWheel={() => navigate('/wheel')} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8 px-6 py-8 flex-1">
          <Name />
          <Situation />
          <Thougts />
          <EmotionBubbles darkMode={darkMode} onViewWheel={() => navigate('/wheel')} />
        </div>
      )}

      <ActionButtons />
      <Privacy />
    </div>
  )
}

function WheelPage({ darkMode, setDarkMode, wheelSize, setWheelSize }) {
  const navigate = useNavigate()

  return (
    <div
      className={`flex flex-col w-full min-h-screen ${darkMode ? 'theme-dark' : 'theme-light'}`}
      style={{ background: 'var(--bg)', transition: 'background 0.3s ease' }}
    >
      <Header darkMode={darkMode} setDarkMode={setDarkMode} onBack={() => navigate(-1)} />

      <div className="flex flex-col flex-1 min-h-0">
        <EmotionWheel
          darkMode={darkMode}
          showFullWheel={true}
          forceOpen={true}
          wheelSize={wheelSize}
          setWheelSize={setWheelSize}
        />
      </div>
    </div>
  )
}

function App() {
  const [darkMode, setDarkMode]   = useState(true)
  const [wheelSize, setWheelSize] = useState(0)
  useSEO()

  return (
    <Routes>
      <Route path="/"      element={<MainPage  darkMode={darkMode} setDarkMode={setDarkMode} />} />
      <Route path="/wheel" element={<WheelPage darkMode={darkMode} setDarkMode={setDarkMode} wheelSize={wheelSize} setWheelSize={setWheelSize} />} />
    </Routes>
  )
}

export default App
