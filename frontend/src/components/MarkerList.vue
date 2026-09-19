<template>
  <div class="panel">
    <div class="panel-head">
      <h3>📌 频率标记清单 <span class="count" v-if="sortedMarkers.length">（{{ sortedMarkers.length }}）</span></h3>
      <el-button
        v-if="sortedMarkers.length" size="small" text type="danger"
        @click="markerStore.clearAll()"
      >清空全部</el-button>
    </div>

    <!-- 数据为空 -->
    <div v-if="!hasData" class="empty">
      <el-icon :size="28"><DataAnalysis /></el-icon>
      <p>暂无频谱数据</p>
      <span>请先点击「生成信号并分析」获取曲线，再在曲线上点击添加标记。</span>
    </div>

    <template v-else>
      <!-- 频率筛选 -->
      <div class="filter-row" v-if="sortedMarkers.length">
        <span class="filter-label">频率范围</span>
        <el-input-number
          v-model="filterMin" :min="-Infinity" :max="filterMax ?? Infinity"
          :step="freqStep" controls-position="right" size="small" placeholder="最低"
        />
        <span class="tilde">~</span>
        <el-input-number
          v-model="filterMax" :min="filterMin ?? -Infinity" :max="Infinity"
          :step="freqStep" controls-position="right" size="small" placeholder="最高"
        />
        <span class="unit">Hz</span>
        <el-button v-if="filterMin !== null || filterMax !== null" size="small" text @click="resetFilter">重置</el-button>
        <span class="filter-count">显示 {{ filteredMarkers.length }}/{{ sortedMarkers.length }}</span>
      </div>

      <!-- 没有任何标记 -->
      <div v-if="sortedMarkers.length === 0" class="empty">
        <el-icon :size="28"><Aim /></el-icon>
        <p>还没有频率标记</p>
        <span>在上方频谱曲线上点击任意位置，即可在最近的频点打一个标记。</span>
      </div>

      <!-- 筛选无结果 -->
      <div v-else-if="filteredMarkers.length === 0" class="empty">
        <el-icon :size="28"><Search /></el-icon>
        <p>没有符合筛选条件的标记</p>
        <span>请调整或重置频率范围。</span>
      </div>

      <!-- 标记列表 -->
      <ul v-else class="marker-list">
        <li
          v-for="m in filteredMarkers" :key="m.id"
          class="marker-item"
          :class="{ active: m.id === markerStore.activeId, disabled: !m.enabled }"
          @click="markerStore.locate(m.id)"
        >
          <div class="marker-info">
            <span class="freq">{{ formatFrequency(m.frequency) }}</span>
            <span class="magnitude">
              {{ magnitudeOf(m) != null ? magnitudeOf(m)!.toFixed(2) + ' dB' : '幅度不可用' }}
            </span>
          </div>
          <div class="marker-actions" @click.stop>
            <el-tooltip :content="locateHint(m)" placement="top" :disabled="inRange(m)">
              <span class="locate-wrap">
                <el-button
                  size="small" text :disabled="!inRange(m)"
                  :type="m.id === markerStore.activeId ? 'primary' : 'default'"
                  @click="markerStore.locate(m.id)"
                >
                  <el-icon><Location /></el-icon>定位
                </el-button>
              </span>
            </el-tooltip>
            <el-tooltip :content="m.enabled ? '关闭后曲线上的标记将消失' : '在曲线上重新显示'" placement="top">
              <el-switch :model-value="m.enabled" @change="markerStore.toggleEnabled(m.id)" />
            </el-tooltip>
            <el-button size="small" text type="danger" @click="markerStore.removeMarker(m.id)">
              <el-icon><Close /></el-icon>
            </el-button>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { DataAnalysis, Aim, Search, Location, Close } from '@element-plus/icons-vue'
import { useSignalStore } from '../store/signal'
import { useMarkerStore } from '../store/markers'
import { formatFrequency, visibleSpectrum, resolveMagnitude } from '../utils/spectrum'
import type { FreqMarker } from '@/types'

const store = useSignalStore()
const markerStore = useMarkerStore()

const filterMin = ref<number | null>(null)
const filterMax = ref<number | null>(null)

const hasData = computed(() => !!store.result && store.result.spectrum.frequencies.length > 0)
const spectrum = computed(() => visibleSpectrum(store.result))
const freqRange = computed(() => {
  const f = spectrum.value.frequencies
  return f.length ? { min: f[0], max: f[f.length - 1] } : null
})
// 筛选输入框步进取频谱跨度的 1%，方便快速调整
const freqStep = computed(() => {
  const r = freqRange.value
  return r ? Math.max((r.max - r.min) / 100, 1) : 100
})

const sortedMarkers = computed(() =>
  [...markerStore.markers].sort((a, b) => a.frequency - b.frequency)
)

const filteredMarkers = computed(() =>
  sortedMarkers.value.filter(m =>
    (filterMin.value === null || m.frequency >= filterMin.value) &&
    (filterMax.value === null || m.frequency <= filterMax.value)
  )
)

function magnitudeOf(m: FreqMarker): number | null {
  return resolveMagnitude(m, spectrum.value.frequencies, spectrum.value.magnitudes)
}

function inRange(m: FreqMarker): boolean {
  const r = freqRange.value
  if (!r) return false
  return m.frequency >= r.min - 1e-6 && m.frequency <= r.max + 1e-6
}

function locateHint(m: FreqMarker): string {
  return inRange(m) ? '在曲线上定位到此标记' : '该标记频率不在当前频谱范围内，无法定位'
}

function resetFilter() {
  filterMin.value = null
  filterMax.value = null
}
</script>

<style scoped>
.panel { background:#1a2332; border-radius:8px; padding:16px; border:1px solid #2a3a4a }
.panel-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px }
.panel h3 { color:#90caf9; font-size:14px }
.count { font-size:12px; font-weight:400; color:#8899aa }
.filter-row { display:flex; align-items:center; gap:6px; flex-wrap:wrap; margin-bottom:10px; font-size:12px }
.filter-label { color:#8899aa }
.tilde { color:#8899aa }
.unit { color:#8899aa; font-size:11px }
.filter-count { margin-left:auto; color:#607d8b; font-size:11px }
.empty { text-align:center; padding:24px 12px; color:#607d8b }
.empty .el-icon { color:#455a64; margin-bottom:8px }
.empty p { font-size:13px; color:#90a4ae; margin-bottom:4px }
.empty span { font-size:11px; line-height:1.6 }
.marker-list { list-style:none; margin:0; padding:0; max-height:240px; overflow-y:auto }
.marker-item {
  display:flex; align-items:center; justify-content:space-between; gap:8px;
  padding:7px 10px; margin-bottom:6px; background:#0d1520; border:1px solid transparent;
  border-radius:6px; cursor:pointer; transition:border-color .15s
}
.marker-item:hover { border-color:#34506b }
.marker-item.active { border-color:#ff5252; box-shadow:0 0 0 1px rgba(255,82,82,.25) }
.marker-item.disabled { opacity:.55 }
.marker-info { display:flex; flex-direction:column; gap:2px; min-width:0 }
.freq { font-size:13px; font-weight:600; color:#ffd54f }
.magnitude { font-size:11px; color:#8899aa }
.marker-actions { display:flex; align-items:center; gap:8px; flex-shrink:0 }
.locate-wrap { display:inline-flex }
</style>
