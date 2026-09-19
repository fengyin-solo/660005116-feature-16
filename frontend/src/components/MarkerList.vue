<template>
  <div class="panel marker-panel">
    <div class="header">
      <h3>📍 频率标记清单</h3>
      <el-button
        v-if="store.markers.length"
        size="small"
        type="danger"
        plain
        @click="clearAll"
      >清空全部</el-button>
    </div>

    <!-- 没有频谱数据 -->
    <div v-if="!hasData" class="empty">
      <el-empty description="暂无频谱数据，请先生成或导入信号" :image-size="70" />
    </div>

    <template v-else>
      <div class="filters">
        <span class="filter-label">频率范围 (Hz)</span>
        <el-input-number
          v-model="minFreq"
          :controls="false"
          :placeholder="`最小 ${dataFreqRange.min.toFixed(0)}`"
          class="freq-input"
        />
        <span class="range-sep">~</span>
        <el-input-number
          v-model="maxFreq"
          :controls="false"
          :placeholder="`最大 ${dataFreqRange.max.toFixed(0)}`"
          class="freq-input"
        />
        <el-button size="small" @click="resetFilter">重置筛选</el-button>
        <span class="count-info">
          显示 {{ filteredMarkers.length }} / {{ store.markers.length }} 个标记
        </span>
      </div>

      <!-- 一个标记都没有 -->
      <div v-if="store.markers.length === 0" class="empty">
        <el-empty description="暂无标记，在上方频谱曲线上点击即可添加" :image-size="70" />
      </div>

      <!-- 有标记但被筛选条件过滤光 -->
      <div v-else-if="filteredMarkers.length === 0" class="empty">
        <el-empty
          :description="rangeInvalid ? '频率范围无效：最小值不能大于最大值' : '当前频率范围内没有匹配的标记'"
          :image-size="70"
        />
      </div>

      <ul v-else class="marker-list">
        <li
          v-for="m in filteredMarkers"
          :key="m.id"
          class="marker-row"
          :class="{ focused: m.id === store.focusedMarkerId, disabled: !m.visible }"
          @click="locate(m.id)"
        >
          <div class="col-rank">
            <span class="rank-badge">#{{ ranks.get(m.id) }}</span>
          </div>
          <div class="col-freq">
            <span class="freq-value" :title="`${m.frequency.toFixed(2)} Hz`">
              {{ formatFrequency(m.frequency) }}
            </span>
            <span class="freq-raw">{{ m.frequency.toFixed(2) }} Hz</span>
          </div>
          <div class="col-mag">{{ m.magnitude.toFixed(2) }} dB</div>
          <div class="col-toggle" @click.stop>
            <el-switch
              :model-value="m.visible"
              inline-prompt
              active-text="显"
              inactive-text="隐"
              @change="store.toggleMarkerVisible(m.id)"
            />
          </div>
          <div class="col-actions" @click.stop>
            <el-button
              size="small"
              :type="m.id === store.focusedMarkerId ? 'warning' : 'primary'"
              plain
              @click="locate(m.id)"
            >{{ m.id === store.focusedMarkerId ? '已定位' : '定位' }}</el-button>
            <el-button size="small" type="danger" plain @click="store.removeMarker(m.id)">
              删除
            </el-button>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useSignalStore } from '../store/signal'
import { formatFrequency } from '../utils/frequency'

const store = useSignalStore()

const minFreq = ref<number | null>(null)
const maxFreq = ref<number | null>(null)

const hasData = computed(
  () => !!store.result && store.result.spectrum.frequencies.length > 0
)

const dataFreqRange = computed(() => {
  const freqs = store.result?.spectrum.frequencies ?? []
  if (!freqs.length) return { min: 0, max: 0 }
  // 曲线只绘制 fftshift 后的前半段
  return { min: freqs[0], max: freqs[Math.floor(freqs.length / 2) - 1] }
})

const rangeInvalid = computed(
  () => minFreq.value !== null && maxFreq.value !== null && minFreq.value > maxFreq.value
)

/** 标记编号按频率从低到高排列（与曲线上 #编号 一致） */
const ranks = computed(() => {
  const map = new Map<string, number>()
  store.markers.slice().sort((a, b) => a.frequency - b.frequency)
    .forEach((m, i) => map.set(m.id, i + 1))
  return map
})

const filteredMarkers = computed(() => {
  if (rangeInvalid.value) return []
  return store.markers
    .filter((m) => minFreq.value === null || m.frequency >= minFreq.value)
    .filter((m) => maxFreq.value === null || m.frequency <= maxFreq.value)
    .sort((a, b) => a.frequency - b.frequency)
})

function resetFilter() {
  minFreq.value = null
  maxFreq.value = null
}

function locate(id: string) {
  store.focusMarker(id)
}

async function clearAll() {
  try {
    await ElMessageBox.confirm('确定清空全部频率标记吗？此操作不可恢复。', '清空标记', {
      confirmButtonText: '清空',
      cancelButtonText: '取消',
      type: 'warning'
    })
    store.clearMarkers()
  } catch {
    // 用户取消
  }
}
</script>

<style scoped>
.marker-panel { margin-top:16px }
.header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px }
.header h3 { color:#90caf9; font-size:14px }
.filters { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:12px }
.filter-label { font-size:12px; color:#8899aa }
.freq-input { width:150px }
.range-sep { color:#8899aa }
.count-info { margin-left:auto; font-size:12px; color:#6b7c8f }
.empty { padding:12px 0 }
.marker-list { list-style:none; display:flex; flex-direction:column; gap:6px }
.marker-row {
  display:grid;
  grid-template-columns:56px 1fr 120px 70px 150px;
  align-items:center;
  gap:12px;
  padding:8px 12px;
  background:#0d1520;
  border:1px solid #2a3a4a;
  border-radius:6px;
  cursor:pointer;
  transition:border-color .15s, background .15s;
}
.marker-row:hover { border-color:#42a5f5 }
.marker-row.focused { border-color:#ffca28; background:#1e2412 }
.marker-row.disabled { opacity:.5 }
.rank-badge {
  display:inline-flex; align-items:center; justify-content:center;
  min-width:34px; height:22px; padding:0 6px;
  background:#2d3e50; color:#90caf9; border-radius:11px; font-size:12px;
}
.marker-row.focused .rank-badge { background:#ffca28; color:#1a2332 }
.col-freq { display:flex; flex-direction:column }
.freq-value { font-size:13px; color:#e0e0e0; font-weight:600 }
.freq-raw { font-size:11px; color:#6b7c8f }
.col-mag { font-size:13px; color:#ffa726; font-variant-numeric:tabular-nums }
.col-actions { display:flex; gap:6px }
</style>
