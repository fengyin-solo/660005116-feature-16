<template>
  <div class="panel">
    <h3>📊 FFT频谱图</h3>
    <p class="hint">✚ 在曲线上点击任意位置可添加频率标记</p>
    <div ref="chart" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus'
import { useSignalStore } from '../store/signal'
import { nearestIndex } from '../utils/frequency'

const store = useSignalStore()
const chart = ref<HTMLDivElement>()
let instance: echarts.ECharts | null = null
let resizeObserver: ResizeObserver | null = null

/** 当前曲线使用的前半段频率（与绘制区域一一对应） */
function chartData(): { data: [number, number][]; frequencies: number[] } {
  const data: [number, number][] = []
  const frequencies: number[] = []
  const spectrum = store.result?.spectrum
  if (spectrum) {
    const halfN = Math.floor(spectrum.frequencies.length / 2)
    for (let i = 0; i < halfN; i++) {
      frequencies.push(spectrum.frequencies[i])
      data.push([spectrum.frequencies[i], spectrum.magnitudes[i]])
    }
  }
  return { data, frequencies }
}

/** 标记按频率排序后的序号（与标记清单一致，#1 从低频开始） */
function markerRanks(): Map<string, number> {
  const ranks = new Map<string, number>()
  store.markers.slice().sort((a, b) => a.frequency - b.frequency)
    .forEach((m, i) => ranks.set(m.id, i + 1))
  return ranks
}

function update() {
  if (!instance) return
  const { data, frequencies } = chartData()
  const ranks = markerRanks()

  const visibleMarkers = store.markers.filter((m) => m.visible)
  const markerPoints = visibleMarkers.map((m) => ({
    name: m.id,
    value: [m.frequency, m.magnitude],
    markerRank: ranks.get(m.id)
  }))

  const focused = store.markers.find((m) => m.id === store.focusedMarkerId && m.visible)
  const focusDataIndex = focused && frequencies.length
    ? nearestIndex(frequencies, focused.frequency)
    : -1

  // 定位的标记不在当前视口内时，以其为中心平移相同宽度的频率窗口
  const fullMin = frequencies.length ? frequencies[0] : undefined
  const fullMax = frequencies.length ? frequencies[frequencies.length - 1] : undefined
  const fullSpan = fullMin !== undefined && fullMax !== undefined ? fullMax - fullMin : 0
  let xRange: { min?: number; max?: number } = {}
  if (focused && fullSpan > 0) {
    const opt = instance.getOption() as { xAxis?: Array<{ min?: number; max?: number }> }
    const cur = opt.xAxis?.[0] ?? {}
    const vMin = cur.min ?? fullMin!
    const vMax = cur.max ?? fullMax!
    if (focused.frequency < vMin || focused.frequency > vMax) {
      xRange = { min: focused.frequency - fullSpan / 2, max: focused.frequency + fullSpan / 2 }
    }
  } else if (!focused) {
    xRange = { min: undefined, max: undefined }
  }

  instance.setOption({
    backgroundColor: 'transparent',
    grid: { left: 50, right: 15, top: 25, bottom: 35 },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross', label: { backgroundColor: '#37474f' } },
      backgroundColor: '#22303f',
      borderColor: '#2a3a4a',
      textStyle: { color: '#e0e0e0' },
      formatter: (params: unknown) => {
        const p = (params as Array<{ value?: [number, number] }>).find(
          (x) => Array.isArray(x.value)
        )
        if (!p || !p.value) return ''
        return `频率: ${p.value[0].toFixed(1)} Hz<br/>幅度: ${p.value[1].toFixed(2)} dB`
      }
    },
    xAxis: {
      type: 'value', name: '频率 (Hz)', nameLocation: 'middle', nameGap: 25,
      min: xRange.min, max: xRange.max,
      axisLabel: { color: '#8899aa' }, nameTextStyle: { color: '#8899aa' },
      axisLine: { lineStyle: { color: '#2a3a4a' } },
      splitLine: { lineStyle: { color: 'rgba(42,58,74,0.5)' } }
    },
    yAxis: {
      type: 'value', name: '幅度 (dB)', nameLocation: 'middle', nameGap: 40,
      axisLabel: { color: '#8899aa' }, nameTextStyle: { color: '#8899aa' },
      axisLine: { lineStyle: { color: '#2a3a4a' } },
      splitLine: { lineStyle: { color: 'rgba(42,58,74,0.5)' } }
    },
    series: [
      {
        name: 'spectrum',
        type: 'line',
        data,
        symbol: 'none',
        lineStyle: { color: '#42a5f5', width: 1.5 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(66,165,245,0.4)' },
            { offset: 1, color: 'rgba(66,165,245,0.02)' }
          ])
        },
        emphasis: { disabled: true }
      },
      {
        name: 'markers',
        type: 'scatter',
        data: markerPoints,
        symbol: 'circle',
        symbolSize: 12,
        z: 5,
        itemStyle: {
          color: (p: { data: { name: string } }) =>
            p.data.name === store.focusedMarkerId ? '#ffca28' : '#ef5350',
          borderColor: '#fff',
          borderWidth: 1.5
        },
        label: {
          show: true,
          position: 'top',
          color: '#ffe082',
          fontSize: 10,
          formatter: (p: { data: { markerRank?: number } }) => `#${p.data.markerRank ?? ''}`
        },
        emphasis: { scale: 1.3 },
        tooltip: {
          formatter: (p: { data: { markerRank?: number; value: [number, number] } }) =>
            `标记 #${p.data.markerRank ?? ''}<br/>频率: ${p.data.value[0].toFixed(1)} Hz<br/>幅度: ${p.data.value[1].toFixed(2)} dB`
        }
      },
      {
        name: 'focus-line',
        type: 'line',
        data: focused ? [[focused.frequency, focused.magnitude]] : [],
        symbol: 'diamond',
        symbolSize: 18,
        z: 6,
        itemStyle: { color: '#ffca28', borderColor: '#fff', borderWidth: 1.5 },
        lineStyle: { opacity: 0 },
        markLine: {
          silent: true,
          symbol: 'none',
          label: { color: '#ffca28', formatter: '定位' },
          lineStyle: { color: '#ffca28', type: 'dashed', width: 1.5 },
          data: focused ? [{ xAxis: focused.frequency }] : []
        },
        tooltip: { show: false }
      }
    ],
    animation: false
  }, { replaceMerge: ['series'] })

  // 定位标记：把它带到视口中央并弹出读数
  if (focused && focusDataIndex >= 0) {
    instance.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: focusDataIndex
    })
  }
}

/** 通过 zrender 监听点击（曲线下方的面积区域也能点中） */
function onClick(params: { target?: unknown; offsetX?: number; offsetY?: number }) {
  if (!instance) return
  const { frequencies } = chartData()
  if (!frequencies.length) return

  const point: [number, number] = [params.offsetX ?? 0, params.offsetY ?? 0]
  const coord = instance.convertFromPixel({ seriesIndex: 0 }, point) as number[] | null
  if (!coord) return
  const x = coord[0]

  // 仅响应绘图区域内的点击（网格 insets：上25 右15 下35 左50）
  const w = chart.value?.clientWidth ?? 0
  const h = chart.value?.clientHeight ?? 0
  if (point[0] < 50 || point[0] > w - 15 || point[1] < 25 || point[1] > h - 35) return

  const idx = nearestIndex(frequencies, x)
  const frequency = frequencies[idx]
  const magnitude = store.result!.spectrum.magnitudes[idx]

  // 与相邻频点一半间距作为重复判定容差
  const binWidth = frequencies.length > 1
    ? Math.abs(frequencies[1] - frequencies[0])
    : 0
  const created = store.addMarker(frequency, magnitude, binWidth / 2)
  if (created) {
    const rank = [...store.markers].sort((a, b) => a.frequency - b.frequency)
      .findIndex((m) => m.id === created.id) + 1
    store.focusMarker(created.id)
    ElMessage.success(`已添加标记 #${rank}：${frequency.toFixed(1)} Hz`)
  } else {
    ElMessage.warning('该频率附近已存在标记')
  }
}

onMounted(() => {
  if (chart.value) {
    instance = echarts.init(chart.value)
    instance.getZr().on('click', onClick)
    resizeObserver = new ResizeObserver(() => instance?.resize())
    resizeObserver.observe(chart.value)
    update()
  }
})

watch(() => store.result, update)
watch(() => store.markers, update, { deep: true })
watch(
  () => store.focusedMarkerId,
  (id) => {
    update()
    if (id) {
      // 让曲线平滑滚动到可视区域，便于观察定位
      chart.value?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }
)

onUnmounted(() => {
  resizeObserver?.disconnect()
  instance?.dispose()
  instance = null
})
</script>

<style scoped>
.panel { background:#1a2332; border-radius:8px; padding:16px; border:1px solid #2a3a4a }
.panel h3 { margin-bottom:4px; color:#90caf9; font-size:14px }
.hint { font-size:12px; color:#6b7c8f; margin-bottom:6px }
.chart { width:100%; height:280px; cursor:crosshair }
</style>
