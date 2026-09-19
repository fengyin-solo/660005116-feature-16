import { defineStore } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'
import type { AnalysisResult, SpectrumMarker } from '@/types'

const MARKERS_STORAGE_KEY = 'rf-analyzer:spectrum-markers'

function loadMarkers(): SpectrumMarker[] {
  try {
    const raw = localStorage.getItem(MARKERS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (m): m is SpectrumMarker =>
        m &&
        typeof m.id === 'string' &&
        typeof m.frequency === 'number' &&
        typeof m.magnitude === 'number' &&
        typeof m.visible === 'boolean'
    )
  } catch {
    return []
  }
}

export const useSignalStore = defineStore('signal', () => {
  const loading = ref(false)
  const result = ref<AnalysisResult | null>(null)
  const activeView = ref('spectrum')

  // 频率标记（持久化到 localStorage，刷新后仍保留）
  const markers = ref<SpectrumMarker[]>(loadMarkers())
  /** 当前在曲线上定位到的标记 id（null 表示无定位） */
  const focusedMarkerId = ref<string | null>(null)

  function persist() {
    try {
      localStorage.setItem(MARKERS_STORAGE_KEY, JSON.stringify(markers.value))
    } catch {
      // localStorage 不可用时静默降级，功能仍可在当前会话内使用
    }
  }

  /**
   * 新增标记。频率落在已有标记的容差范围内时视为重复，返回 null。
   */
  function addMarker(frequency: number, magnitude: number, tolerance = 0): SpectrumMarker | null {
    const duplicated = markers.value.some((m) => Math.abs(m.frequency - frequency) <= tolerance)
    if (duplicated) return null
    const marker: SpectrumMarker = {
      id: `m-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      frequency,
      magnitude,
      visible: true,
      createdAt: Date.now()
    }
    markers.value.push(marker)
    persist()
    return marker
  }

  /** 在清单中显隐某个标记，隐藏时一并取消对它的定位 */
  function toggleMarkerVisible(id: string) {
    const m = markers.value.find((x) => x.id === id)
    if (!m) return
    m.visible = !m.visible
    if (!m.visible && focusedMarkerId.value === id) focusedMarkerId.value = null
    persist()
  }

  function removeMarker(id: string) {
    if (focusedMarkerId.value === id) focusedMarkerId.value = null
    markers.value = markers.value.filter((m) => m.id !== id)
    persist()
  }

  function clearMarkers() {
    focusedMarkerId.value = null
    markers.value = []
    persist()
  }

  /** 定位到某个标记；隐藏的标记会先重新显示，保证曲线标记一起出现 */
  function focusMarker(id: string | null) {
    if (id) {
      const m = markers.value.find((x) => x.id === id)
      if (m && !m.visible) {
        m.visible = true
        persist()
      }
    }
    focusedMarkerId.value = id
  }

  async function analyze(params: { modulation: string; samples: number; snr: number }) {
    loading.value = true
    try {
      const { data } = await axios.post('/api/generate', params)
      result.value = data
    } finally { loading.value = false }
  }

  async function importCSV(formData: FormData) {
    loading.value = true
    try {
      const { data } = await axios.post('/api/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      result.value = data
    } finally { loading.value = false }
  }

  return {
    loading, result, activeView,
    markers, focusedMarkerId,
    analyze, importCSV,
    addMarker, toggleMarkerVisible, removeMarker, clearMarkers, focusMarker
  }
})
