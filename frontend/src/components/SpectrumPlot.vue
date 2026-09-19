<template>
  <div class="panel">
    <h3>📊 FFT频谱图 <span class="hint">（在曲线上点击即可添加频率标记）</span></h3>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { useSignalStore } from '../store/signal'
import { useMarkerStore } from '../store/markers'
import { formatFrequency, visibleSpectrum, nearestBinIndex, resolveMagnitude } from '../utils/spectrum'

const store = useSignalStore()
const markerStore = useMarkerStore()
const chart = ref<HTMLDivElement>()
let instance: echarts.ECharts | null = null

function update() {
  if (!instance || !store.result) return
  const { frequencies, magnitudes } = visibleSpectrum(store.result)
  const lineData: [number, number][] = frequencies.map((f, i) => [f, magnitudes[i]!])

  // 启用的标记才显示在曲线上；幅度始终按当前频谱解析
  const enabled = markerStore.markers.filter(m => m.enabled)
  const allMarkerData = enabled.map(m => {
    const mag = resolveMagnitude(m, frequencies, magnitudes)
    return mag == null ? null : { id: m.id, value: [m.frequency, mag] as [number, number] }
  }).filter((d): d is { id: string; value: [number, number] } => d !== null)

  const pinData = allMarkerData.filter(d => d.id !== markerStore.activeId)
  const activeData = allMarkerData.filter(d => d.id === markerStore.activeId)

  instance.setOption({
    backgroundColor: 'transparent',
    grid: { left: 50, right: 15, top: 30, bottom: 35 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      formatter: (params: unknown) => {
        const list = params as { marker: string; seriesName: string; data: number[] | { value: number[] } }[]
        if (!Array.isArray(list) || list.length === 0) return ''
        const raw = list[0].data
        const point = Array.isArray(raw) ? raw : raw.value
        let html = `<b>${formatFrequency(point[0])}</b>`
        for (const p of list) {
          const v = Array.isArray(p.data) ? p.data[1] : p.data.value[1]
          html += `<br/>${p.marker}${p.seriesName}: ${Number.isFinite(v) ? v.toFixed(2) + ' dB' : '-'}`
        }
        return html
      }
    },
    xAxis: { type: 'value', name: '频率 (Hz)', nameLocation: 'middle', nameGap: 25, axisLabel: { color: '#8899aa' } },
    yAxis: { type: 'value', name: '幅度 (dB)', nameLocation: 'middle', nameGap: 40, axisLabel: { color: '#8899aa' } },
    series: [
      {
        name: '频谱曲线',
        type: 'line', data: lineData, symbol: 'none',
        lineStyle: { color: '#42a5f5', width: 1.5 },
        areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(66,165,245,0.4)' }, { offset: 1, color: 'rgba(66,165,245,0.02)' }]) }
      },
      {
        name: '频率标记',
        type: 'scatter', data: pinData,
        symbol: 'pin', symbolSize: 36,
        itemStyle: { color: '#ffb300' },
        label: {
          show: true, position: 'top', distance: 6, color: '#ffd54f', fontSize: 10,
          formatter: (p: { value: number[] }) => formatFrequency(p.value[0])
        },
        emphasis: { scale: 1.2 },
        z: 5
      },
      {
        // 当前在清单中定位到的标记：脉冲高亮
        name: '当前定位',
        type: 'effectScatter', data: activeData,
        symbol: 'circle', symbolSize: 11,
        itemStyle: { color: '#ff5252', borderColor: '#fff', borderWidth: 1 },
        rippleEffect: { period: 3, scale: 2.8, brushType: 'stroke' },
        label: {
          show: true, position: 'top', distance: 14, color: '#ff8a80', fontSize: 11, fontWeight: 'bold',
          formatter: (p: { value: number[] }) => formatFrequency(p.value[0])
        },
        z: 6
      }
    ],
    animation: false
  }, { notMerge: true })

  focusActive()
}

function focusActive() {
  if (!instance || !store.result) return
  const id = markerStore.activeId
  if (!id) return
  const m = markerStore.markers.find(x => x.id === id)
  if (!m || !m.enabled) return
  const { frequencies } = visibleSpectrum(store.result)
  if (frequencies.length === 0) return
  // 曲线上的数据点顺序与频点一致
  const dataIndex = nearestBinIndex(frequencies, m.frequency)
  instance.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex })
}

function onCanvasClick(params: { offsetX: number; offsetY: number }) {
  if (!instance || !store.result) return
  const { frequencies, magnitudes } = visibleSpectrum(store.result)
  if (frequencies.length === 0) return
  const coord = instance.convertFromPixel({ xAxisIndex: 0 }, [params.offsetX, params.offsetY]) as number[]
  const x = coord[0]
  const first = frequencies[0]
  const last = frequencies[frequencies.length - 1]
  if (first == null || last == null || x < first || x > last) return
  const idx = nearestBinIndex(frequencies, x)
  const f = frequencies[idx]
  const mag = magnitudes[idx]
  if (f == null || mag == null) return
  markerStore.addMarker(f, mag)
}

onMounted(() => {
  if (chart.value) {
    instance = echarts.init(chart.value)
    const zr = instance.getZr()
    zr.on('click', onCanvasClick)
    if (zr.dom) zr.dom.style.cursor = 'crosshair'
    window.addEventListener('resize', resize)
    update()
  }
})

function resize() { instance?.resize() }

watch(() => store.result, update)
watch(() => markerStore.markers, update, { deep: true })
watch(() => markerStore.locateToken, focusActive)
onUnmounted(() => {
  window.removeEventListener('resize', resize)
  instance?.dispose()
})
</script>

<style scoped>
.panel { background:#1a2332; border-radius:8px; padding:16px; border:1px solid #2a3a4a }
.panel h3 { margin-bottom:8px; color:#90caf9; font-size:14px }
.hint { font-size:11px; font-weight:400; color:#8899aa }
.chart { width:100%; height:300px }
</style>
