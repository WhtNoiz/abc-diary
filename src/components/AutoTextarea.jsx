import { useLayoutEffect, useRef } from 'react'

const AutoTextarea = ({ value, style, ...props }) => {
  const ref = useRef(null)

  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = el.scrollHeight + 'px'
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      style={{ ...style, overflow: 'hidden', resize: 'none' }}
      {...props}
    />
  )
}

export default AutoTextarea
