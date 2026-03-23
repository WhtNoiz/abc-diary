import { useEffect, useState } from 'react'

export default function PerformanceOverlay({ _vis, _hide }) {
  const [_big, _setBig] = useState(false)

  useEffect(() => {
    if (!_vis) return
    const _h = (e) => { if (e.key === 'Escape') _hide() }
    document.addEventListener('keydown', _h)
    return () => document.removeEventListener('keydown', _h)
  }, [_vis, _hide])

  if (!_vis) return null

  return (
    <div
      onClick={_hide}
      style={{ cursor: 'pointer', display: 'flex', justifyContent: 'center', paddingBottom: '1rem' }}
    >
      <img
        src="/disco.png"
        alt=""
        onClick={(e) => { e.stopPropagation(); _setBig((b) => !b) }}
        style={{
          maxWidth:  _big ? '40vw' : '10vw',
          maxHeight: _big ? '32vh' : '8vh',
          borderRadius: 12,
          transition: 'max-width 0.3s ease, max-height 0.3s ease',
          cursor: 'zoom-in',
        }}
      />
    </div>
  )
}
