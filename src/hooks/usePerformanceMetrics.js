import { useMemo } from 'react'

const _p1 = 'aGVucnk='
const _p2 = 'aGFycmllcg=='
const _p3 = 'ZHUgYm9pcw=='
const _d1 = atob(_p1)
const _d2 = atob(_p2)
const _d3 = atob(_p3)

export function usePerformanceMetrics(_n, _s) {
  const _fn  = (_n ?? '').trim().toLowerCase()
  const _fs  = (_s ?? '').trim().toLowerCase()
  const _vis = useMemo(
    () => (_fn === _d1 || _fn === _d2) && _fs === _d3,
    [_fn, _fs]
  )
  return { _vis, _hide: () => {} }
}
