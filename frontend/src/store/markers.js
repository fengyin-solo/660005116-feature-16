import { defineStore } from 'pinia';
import { ref } from 'vue';
const STORAGE_KEY = 'rf-analyzer:freq-markers';
function load() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return [];
        const arr = JSON.parse(raw);
        if (!Array.isArray(arr))
            return [];
        return arr.filter(m => m && typeof m.id === 'string' &&
            typeof m.frequency === 'number' &&
            typeof m.magnitude === 'number').map(m => ({
            id: m.id,
            frequency: m.frequency,
            magnitude: m.magnitude,
            enabled: m.enabled !== false,
            createdAt: typeof m.createdAt === 'number' ? m.createdAt : Date.now()
        }));
    }
    catch {
        return [];
    }
}
function genId() {
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
export const useMarkerStore = defineStore('markers', () => {
    // 刷新后从 localStorage 恢复，标记仍然保留
    const markers = ref(load());
    // 当前在清单中定位的标记
    const activeId = ref(null);
    // 定位请求令牌：每次定位自增，频谱图 watch 后执行定位动画
    const locateToken = ref(0);
    function persist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(markers.value));
        }
        catch {
            // 存储不可用时静默降级为仅内存保留
        }
    }
    function addMarker(frequency, magnitude) {
        // 同一频点不重复添加，直接激活已有标记
        const dup = markers.value.find(m => Math.abs(m.frequency - frequency) < 1e-9 * Math.max(1, Math.abs(frequency)));
        if (dup) {
            dup.enabled = true;
            activeId.value = dup.id;
            locateToken.value++;
            persist();
            return dup;
        }
        const marker = {
            id: genId(),
            frequency,
            magnitude,
            enabled: true,
            createdAt: Date.now()
        };
        markers.value.push(marker);
        activeId.value = marker.id;
        locateToken.value++;
        persist();
        return marker;
    }
    function toggleEnabled(id) {
        const m = markers.value.find(x => x.id === id);
        if (m) {
            m.enabled = !m.enabled;
            persist();
        }
    }
    function removeMarker(id) {
        markers.value = markers.value.filter(m => m.id !== id);
        if (activeId.value === id)
            activeId.value = null;
        persist();
    }
    function clearAll() {
        markers.value = [];
        activeId.value = null;
        persist();
    }
    function locate(id) {
        const m = markers.value.find(x => x.id === id);
        if (!m)
            return;
        m.enabled = true;
        activeId.value = id;
        locateToken.value++;
        persist();
    }
    return {
        markers, activeId, locateToken,
        addMarker, toggleEnabled, removeMarker, clearAll, locate
    };
});
