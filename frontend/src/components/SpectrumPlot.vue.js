/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, watch, onMounted, onUnmounted } from 'vue';
import * as echarts from 'echarts';
import { useSignalStore } from '../store/signal';
import { useMarkerStore } from '../store/markers';
import { formatFrequency, visibleSpectrum, nearestBinIndex, resolveMagnitude } from '../utils/spectrum';
const store = useSignalStore();
const markerStore = useMarkerStore();
const chart = ref();
let instance = null;
function update() {
    if (!instance || !store.result)
        return;
    const { frequencies, magnitudes } = visibleSpectrum(store.result);
    const lineData = frequencies.map((f, i) => [f, magnitudes[i]]);
    // 启用的标记才显示在曲线上；幅度始终按当前频谱解析
    const enabled = markerStore.markers.filter(m => m.enabled);
    const allMarkerData = enabled.map(m => {
        const mag = resolveMagnitude(m, frequencies, magnitudes);
        return mag == null ? null : { id: m.id, value: [m.frequency, mag] };
    }).filter((d) => d !== null);
    const pinData = allMarkerData.filter(d => d.id !== markerStore.activeId);
    const activeData = allMarkerData.filter(d => d.id === markerStore.activeId);
    instance.setOption({
        backgroundColor: 'transparent',
        grid: { left: 50, right: 15, top: 30, bottom: 35 },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'cross' },
            formatter: (params) => {
                const list = params;
                if (!Array.isArray(list) || list.length === 0)
                    return '';
                const raw = list[0].data;
                const point = Array.isArray(raw) ? raw : raw.value;
                let html = `<b>${formatFrequency(point[0])}</b>`;
                for (const p of list) {
                    const v = Array.isArray(p.data) ? p.data[1] : p.data.value[1];
                    html += `<br/>${p.marker}${p.seriesName}: ${Number.isFinite(v) ? v.toFixed(2) + ' dB' : '-'}`;
                }
                return html;
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
                    formatter: (p) => formatFrequency(p.value[0])
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
                    formatter: (p) => formatFrequency(p.value[0])
                },
                z: 6
            }
        ],
        animation: false
    }, { notMerge: true });
    focusActive();
}
function focusActive() {
    if (!instance || !store.result)
        return;
    const id = markerStore.activeId;
    if (!id)
        return;
    const m = markerStore.markers.find(x => x.id === id);
    if (!m || !m.enabled)
        return;
    const { frequencies } = visibleSpectrum(store.result);
    if (frequencies.length === 0)
        return;
    // 曲线上的数据点顺序与频点一致
    const dataIndex = nearestBinIndex(frequencies, m.frequency);
    instance.dispatchAction({ type: 'showTip', seriesIndex: 0, dataIndex });
}
function onCanvasClick(params) {
    if (!instance || !store.result)
        return;
    const { frequencies, magnitudes } = visibleSpectrum(store.result);
    if (frequencies.length === 0)
        return;
    const coord = instance.convertFromPixel({ xAxisIndex: 0 }, [params.offsetX, params.offsetY]);
    const x = coord[0];
    const first = frequencies[0];
    const last = frequencies[frequencies.length - 1];
    if (first == null || last == null || x < first || x > last)
        return;
    const idx = nearestBinIndex(frequencies, x);
    const f = frequencies[idx];
    const mag = magnitudes[idx];
    if (f == null || mag == null)
        return;
    markerStore.addMarker(f, mag);
}
onMounted(() => {
    if (chart.value) {
        instance = echarts.init(chart.value);
        const zr = instance.getZr();
        zr.on('click', onCanvasClick);
        if (zr.dom)
            zr.dom.style.cursor = 'crosshair';
        window.addEventListener('resize', resize);
        update();
    }
});
function resize() { instance?.resize(); }
watch(() => store.result, update);
watch(() => markerStore.markers, update, { deep: true });
watch(() => markerStore.locateToken, focusActive);
onUnmounted(() => {
    window.removeEventListener('resize', resize);
    instance?.dispose();
});
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
    ...{ class: "hint" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ref: "chart",
    ...{ class: "chart" },
});
/** @type {typeof __VLS_ctx.chart} */ ;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['hint']} */ ;
/** @type {__VLS_StyleScopedClasses['chart']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            chart: chart,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
