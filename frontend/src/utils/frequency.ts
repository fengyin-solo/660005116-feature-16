/**
 * 频率相关的展示与数值工具
 */

/** 将 Hz 频率格式化为易读单位 */
export function formatFrequency(freq: number): string {
  const abs = Math.abs(freq)
  if (abs >= 1e6) return `${(freq / 1e6).toFixed(3)} MHz`
  if (abs >= 1e3) return `${(freq / 1e3).toFixed(3)} kHz`
  return `${freq.toFixed(1)} Hz`
}

/** 在升序数组中查找与 x 最接近的下标（二分查找，边界自动收敛） */
export function nearestIndex(arr: number[], x: number): number {
  let lo = 0
  let hi = arr.length - 1
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (arr[mid] < x) lo = mid + 1
    else hi = mid
  }
  if (lo > 0 && Math.abs(arr[lo - 1] - x) < Math.abs(arr[lo] - x)) return lo - 1
  return lo
}
