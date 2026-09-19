import type { FreqMarker } from '@/types'

/** 按数量级格式化频率: Hz / kHz / MHz / GHz */
export function formatFrequency(hz: number): string {
  const a = Math.abs(hz)
  if (a >= 1e9) return (hz / 1e9).toFixed(3) + ' GHz'
  if (a >= 1e6) return (hz / 1e6).toFixed(3) + ' MHz'
  if (a >= 1e3) return (hz / 1e3).toFixed(2) + ' kHz'
  return hz.toFixed(1) + ' Hz'
}

/**
 * 频谱曲线显示非负频率的一半。
 * 后端 freqs 由 fftshift 排序 (负→正)，故取 0..正频率部分，
 * 与后端瀑布图 mag_db[half:] 的取法保持一致。
 */
export function visibleSpectrum(result: { spectrum: { frequencies: number[]; magnitudes: number[] } } | null) {
  if (!result) return { frequencies: [] as number[], magnitudes: [] as number[] }
  const { frequencies, magnitudes } = result.spectrum
  const start = frequencies.findIndex(f => f >= 0)
  const begin = start === -1 ? Math.floor(frequencies.length / 2) : start
  return {
    frequencies: frequencies.slice(begin),
    magnitudes: magnitudes.slice(begin)
  }
}

/** 在当前频谱上找到与给定频率最近的频点索引 */
export function nearestBinIndex(frequencies: number[], frequency: number): number {
  let best = 0
  let bestDist = Infinity
  for (let i = 0; i < frequencies.length; i++) {
    const d = Math.abs(frequencies[i] - frequency)
    if (d < bestDist) { bestDist = d; best = i }
  }
  return best
}

/** 解析标记在当前数据下的幅度；数据为空时回退到打标记时记录的幅度 */
export function resolveMagnitude(marker: FreqMarker, frequencies: number[], magnitudes: number[]): number | null {
  if (frequencies.length === 0) return Number.isFinite(marker.magnitude) ? marker.magnitude : null
  const idx = nearestBinIndex(frequencies, marker.frequency)
  const mag = magnitudes[idx]
  return Number.isFinite(mag) ? mag : null
}
