/// <reference types="../../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { ref, computed } from 'vue';
import { DataAnalysis, Aim, Search, Location, Close } from '@element-plus/icons-vue';
import { useSignalStore } from '../store/signal';
import { useMarkerStore } from '../store/markers';
import { formatFrequency, visibleSpectrum, resolveMagnitude } from '../utils/spectrum';
const store = useSignalStore();
const markerStore = useMarkerStore();
const filterMin = ref(null);
const filterMax = ref(null);
const hasData = computed(() => !!store.result && store.result.spectrum.frequencies.length > 0);
const spectrum = computed(() => visibleSpectrum(store.result));
const freqRange = computed(() => {
    const f = spectrum.value.frequencies;
    return f.length ? { min: f[0], max: f[f.length - 1] } : null;
});
// 筛选输入框步进取频谱跨度的 1%，方便快速调整
const freqStep = computed(() => {
    const r = freqRange.value;
    return r ? Math.max((r.max - r.min) / 100, 1) : 100;
});
const sortedMarkers = computed(() => [...markerStore.markers].sort((a, b) => a.frequency - b.frequency));
const filteredMarkers = computed(() => sortedMarkers.value.filter(m => (filterMin.value === null || m.frequency >= filterMin.value) &&
    (filterMax.value === null || m.frequency <= filterMax.value)));
function magnitudeOf(m) {
    return resolveMagnitude(m, spectrum.value.frequencies, spectrum.value.magnitudes);
}
function inRange(m) {
    const r = freqRange.value;
    if (!r)
        return false;
    return m.frequency >= r.min - 1e-6 && m.frequency <= r.max + 1e-6;
}
function locateHint(m) {
    return inRange(m) ? '在曲线上定位到此标记' : '该标记频率不在当前频谱范围内，无法定位';
}
function resetFilter() {
    filterMin.value = null;
    filterMax.value = null;
}
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-item']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-item']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-item']} */ ;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "panel-head" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h3, __VLS_intrinsicElements.h3)({});
if (__VLS_ctx.sortedMarkers.length) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
        ...{ class: "count" },
    });
    (__VLS_ctx.sortedMarkers.length);
}
if (__VLS_ctx.sortedMarkers.length) {
    const __VLS_0 = {}.ElButton;
    /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
    // @ts-ignore
    const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
        ...{ 'onClick': {} },
        size: "small",
        text: true,
        type: "danger",
    }));
    const __VLS_2 = __VLS_1({
        ...{ 'onClick': {} },
        size: "small",
        text: true,
        type: "danger",
    }, ...__VLS_functionalComponentArgsRest(__VLS_1));
    let __VLS_4;
    let __VLS_5;
    let __VLS_6;
    const __VLS_7 = {
        onClick: (...[$event]) => {
            if (!(__VLS_ctx.sortedMarkers.length))
                return;
            __VLS_ctx.markerStore.clearAll();
        }
    };
    __VLS_3.slots.default;
    var __VLS_3;
}
if (!__VLS_ctx.hasData) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "empty" },
    });
    const __VLS_8 = {}.ElIcon;
    /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
    // @ts-ignore
    const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
        size: (28),
    }));
    const __VLS_10 = __VLS_9({
        size: (28),
    }, ...__VLS_functionalComponentArgsRest(__VLS_9));
    __VLS_11.slots.default;
    const __VLS_12 = {}.DataAnalysis;
    /** @type {[typeof __VLS_components.DataAnalysis, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({}));
    const __VLS_14 = __VLS_13({}, ...__VLS_functionalComponentArgsRest(__VLS_13));
    var __VLS_11;
    __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
    __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
}
else {
    if (__VLS_ctx.sortedMarkers.length) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "filter-row" },
        });
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "filter-label" },
        });
        const __VLS_16 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
            modelValue: (__VLS_ctx.filterMin),
            min: (-Infinity),
            max: (__VLS_ctx.filterMax ?? Infinity),
            step: (__VLS_ctx.freqStep),
            controlsPosition: "right",
            size: "small",
            placeholder: "最低",
        }));
        const __VLS_18 = __VLS_17({
            modelValue: (__VLS_ctx.filterMin),
            min: (-Infinity),
            max: (__VLS_ctx.filterMax ?? Infinity),
            step: (__VLS_ctx.freqStep),
            controlsPosition: "right",
            size: "small",
            placeholder: "最低",
        }, ...__VLS_functionalComponentArgsRest(__VLS_17));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "tilde" },
        });
        const __VLS_20 = {}.ElInputNumber;
        /** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
        // @ts-ignore
        const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
            modelValue: (__VLS_ctx.filterMax),
            min: (__VLS_ctx.filterMin ?? -Infinity),
            max: (Infinity),
            step: (__VLS_ctx.freqStep),
            controlsPosition: "right",
            size: "small",
            placeholder: "最高",
        }));
        const __VLS_22 = __VLS_21({
            modelValue: (__VLS_ctx.filterMax),
            min: (__VLS_ctx.filterMin ?? -Infinity),
            max: (Infinity),
            step: (__VLS_ctx.freqStep),
            controlsPosition: "right",
            size: "small",
            placeholder: "最高",
        }, ...__VLS_functionalComponentArgsRest(__VLS_21));
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "unit" },
        });
        if (__VLS_ctx.filterMin !== null || __VLS_ctx.filterMax !== null) {
            const __VLS_24 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
                ...{ 'onClick': {} },
                size: "small",
                text: true,
            }));
            const __VLS_26 = __VLS_25({
                ...{ 'onClick': {} },
                size: "small",
                text: true,
            }, ...__VLS_functionalComponentArgsRest(__VLS_25));
            let __VLS_28;
            let __VLS_29;
            let __VLS_30;
            const __VLS_31 = {
                onClick: (__VLS_ctx.resetFilter)
            };
            __VLS_27.slots.default;
            var __VLS_27;
        }
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
            ...{ class: "filter-count" },
        });
        (__VLS_ctx.filteredMarkers.length);
        (__VLS_ctx.sortedMarkers.length);
    }
    if (__VLS_ctx.sortedMarkers.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "empty" },
        });
        const __VLS_32 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({
            size: (28),
        }));
        const __VLS_34 = __VLS_33({
            size: (28),
        }, ...__VLS_functionalComponentArgsRest(__VLS_33));
        __VLS_35.slots.default;
        const __VLS_36 = {}.Aim;
        /** @type {[typeof __VLS_components.Aim, ]} */ ;
        // @ts-ignore
        const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({}));
        const __VLS_38 = __VLS_37({}, ...__VLS_functionalComponentArgsRest(__VLS_37));
        var __VLS_35;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    else if (__VLS_ctx.filteredMarkers.length === 0) {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
            ...{ class: "empty" },
        });
        const __VLS_40 = {}.ElIcon;
        /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
        // @ts-ignore
        const __VLS_41 = __VLS_asFunctionalComponent(__VLS_40, new __VLS_40({
            size: (28),
        }));
        const __VLS_42 = __VLS_41({
            size: (28),
        }, ...__VLS_functionalComponentArgsRest(__VLS_41));
        __VLS_43.slots.default;
        const __VLS_44 = {}.Search;
        /** @type {[typeof __VLS_components.Search, ]} */ ;
        // @ts-ignore
        const __VLS_45 = __VLS_asFunctionalComponent(__VLS_44, new __VLS_44({}));
        const __VLS_46 = __VLS_45({}, ...__VLS_functionalComponentArgsRest(__VLS_45));
        var __VLS_43;
        __VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({});
        __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({});
    }
    else {
        __VLS_asFunctionalElement(__VLS_intrinsicElements.ul, __VLS_intrinsicElements.ul)({
            ...{ class: "marker-list" },
        });
        for (const [m] of __VLS_getVForSourceType((__VLS_ctx.filteredMarkers))) {
            __VLS_asFunctionalElement(__VLS_intrinsicElements.li, __VLS_intrinsicElements.li)({
                ...{ onClick: (...[$event]) => {
                        if (!!(!__VLS_ctx.hasData))
                            return;
                        if (!!(__VLS_ctx.sortedMarkers.length === 0))
                            return;
                        if (!!(__VLS_ctx.filteredMarkers.length === 0))
                            return;
                        __VLS_ctx.markerStore.locate(m.id);
                    } },
                key: (m.id),
                ...{ class: "marker-item" },
                ...{ class: ({ active: m.id === __VLS_ctx.markerStore.activeId, disabled: !m.enabled }) },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ class: "marker-info" },
            });
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "freq" },
            });
            (__VLS_ctx.formatFrequency(m.frequency));
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "magnitude" },
            });
            (__VLS_ctx.magnitudeOf(m) != null ? __VLS_ctx.magnitudeOf(m).toFixed(2) + ' dB' : '幅度不可用');
            __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
                ...{ onClick: () => { } },
                ...{ class: "marker-actions" },
            });
            const __VLS_48 = {}.ElTooltip;
            /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
            // @ts-ignore
            const __VLS_49 = __VLS_asFunctionalComponent(__VLS_48, new __VLS_48({
                content: (__VLS_ctx.locateHint(m)),
                placement: "top",
                disabled: (__VLS_ctx.inRange(m)),
            }));
            const __VLS_50 = __VLS_49({
                content: (__VLS_ctx.locateHint(m)),
                placement: "top",
                disabled: (__VLS_ctx.inRange(m)),
            }, ...__VLS_functionalComponentArgsRest(__VLS_49));
            __VLS_51.slots.default;
            __VLS_asFunctionalElement(__VLS_intrinsicElements.span, __VLS_intrinsicElements.span)({
                ...{ class: "locate-wrap" },
            });
            const __VLS_52 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_53 = __VLS_asFunctionalComponent(__VLS_52, new __VLS_52({
                ...{ 'onClick': {} },
                size: "small",
                text: true,
                disabled: (!__VLS_ctx.inRange(m)),
                type: (m.id === __VLS_ctx.markerStore.activeId ? 'primary' : 'default'),
            }));
            const __VLS_54 = __VLS_53({
                ...{ 'onClick': {} },
                size: "small",
                text: true,
                disabled: (!__VLS_ctx.inRange(m)),
                type: (m.id === __VLS_ctx.markerStore.activeId ? 'primary' : 'default'),
            }, ...__VLS_functionalComponentArgsRest(__VLS_53));
            let __VLS_56;
            let __VLS_57;
            let __VLS_58;
            const __VLS_59 = {
                onClick: (...[$event]) => {
                    if (!!(!__VLS_ctx.hasData))
                        return;
                    if (!!(__VLS_ctx.sortedMarkers.length === 0))
                        return;
                    if (!!(__VLS_ctx.filteredMarkers.length === 0))
                        return;
                    __VLS_ctx.markerStore.locate(m.id);
                }
            };
            __VLS_55.slots.default;
            const __VLS_60 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_61 = __VLS_asFunctionalComponent(__VLS_60, new __VLS_60({}));
            const __VLS_62 = __VLS_61({}, ...__VLS_functionalComponentArgsRest(__VLS_61));
            __VLS_63.slots.default;
            const __VLS_64 = {}.Location;
            /** @type {[typeof __VLS_components.Location, ]} */ ;
            // @ts-ignore
            const __VLS_65 = __VLS_asFunctionalComponent(__VLS_64, new __VLS_64({}));
            const __VLS_66 = __VLS_65({}, ...__VLS_functionalComponentArgsRest(__VLS_65));
            var __VLS_63;
            var __VLS_55;
            var __VLS_51;
            const __VLS_68 = {}.ElTooltip;
            /** @type {[typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, typeof __VLS_components.ElTooltip, typeof __VLS_components.elTooltip, ]} */ ;
            // @ts-ignore
            const __VLS_69 = __VLS_asFunctionalComponent(__VLS_68, new __VLS_68({
                content: (m.enabled ? '关闭后曲线上的标记将消失' : '在曲线上重新显示'),
                placement: "top",
            }));
            const __VLS_70 = __VLS_69({
                content: (m.enabled ? '关闭后曲线上的标记将消失' : '在曲线上重新显示'),
                placement: "top",
            }, ...__VLS_functionalComponentArgsRest(__VLS_69));
            __VLS_71.slots.default;
            const __VLS_72 = {}.ElSwitch;
            /** @type {[typeof __VLS_components.ElSwitch, typeof __VLS_components.elSwitch, ]} */ ;
            // @ts-ignore
            const __VLS_73 = __VLS_asFunctionalComponent(__VLS_72, new __VLS_72({
                ...{ 'onChange': {} },
                modelValue: (m.enabled),
            }));
            const __VLS_74 = __VLS_73({
                ...{ 'onChange': {} },
                modelValue: (m.enabled),
            }, ...__VLS_functionalComponentArgsRest(__VLS_73));
            let __VLS_76;
            let __VLS_77;
            let __VLS_78;
            const __VLS_79 = {
                onChange: (...[$event]) => {
                    if (!!(!__VLS_ctx.hasData))
                        return;
                    if (!!(__VLS_ctx.sortedMarkers.length === 0))
                        return;
                    if (!!(__VLS_ctx.filteredMarkers.length === 0))
                        return;
                    __VLS_ctx.markerStore.toggleEnabled(m.id);
                }
            };
            var __VLS_75;
            var __VLS_71;
            const __VLS_80 = {}.ElButton;
            /** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
            // @ts-ignore
            const __VLS_81 = __VLS_asFunctionalComponent(__VLS_80, new __VLS_80({
                ...{ 'onClick': {} },
                size: "small",
                text: true,
                type: "danger",
            }));
            const __VLS_82 = __VLS_81({
                ...{ 'onClick': {} },
                size: "small",
                text: true,
                type: "danger",
            }, ...__VLS_functionalComponentArgsRest(__VLS_81));
            let __VLS_84;
            let __VLS_85;
            let __VLS_86;
            const __VLS_87 = {
                onClick: (...[$event]) => {
                    if (!!(!__VLS_ctx.hasData))
                        return;
                    if (!!(__VLS_ctx.sortedMarkers.length === 0))
                        return;
                    if (!!(__VLS_ctx.filteredMarkers.length === 0))
                        return;
                    __VLS_ctx.markerStore.removeMarker(m.id);
                }
            };
            __VLS_83.slots.default;
            const __VLS_88 = {}.ElIcon;
            /** @type {[typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, typeof __VLS_components.ElIcon, typeof __VLS_components.elIcon, ]} */ ;
            // @ts-ignore
            const __VLS_89 = __VLS_asFunctionalComponent(__VLS_88, new __VLS_88({}));
            const __VLS_90 = __VLS_89({}, ...__VLS_functionalComponentArgsRest(__VLS_89));
            __VLS_91.slots.default;
            const __VLS_92 = {}.Close;
            /** @type {[typeof __VLS_components.Close, ]} */ ;
            // @ts-ignore
            const __VLS_93 = __VLS_asFunctionalComponent(__VLS_92, new __VLS_92({}));
            const __VLS_94 = __VLS_93({}, ...__VLS_functionalComponentArgsRest(__VLS_93));
            var __VLS_91;
            var __VLS_83;
        }
    }
}
/** @type {__VLS_StyleScopedClasses['panel']} */ ;
/** @type {__VLS_StyleScopedClasses['panel-head']} */ ;
/** @type {__VLS_StyleScopedClasses['count']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-row']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-label']} */ ;
/** @type {__VLS_StyleScopedClasses['tilde']} */ ;
/** @type {__VLS_StyleScopedClasses['unit']} */ ;
/** @type {__VLS_StyleScopedClasses['filter-count']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['empty']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-list']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-item']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-info']} */ ;
/** @type {__VLS_StyleScopedClasses['freq']} */ ;
/** @type {__VLS_StyleScopedClasses['magnitude']} */ ;
/** @type {__VLS_StyleScopedClasses['marker-actions']} */ ;
/** @type {__VLS_StyleScopedClasses['locate-wrap']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            DataAnalysis: DataAnalysis,
            Aim: Aim,
            Search: Search,
            Location: Location,
            Close: Close,
            formatFrequency: formatFrequency,
            markerStore: markerStore,
            filterMin: filterMin,
            filterMax: filterMax,
            hasData: hasData,
            freqStep: freqStep,
            sortedMarkers: sortedMarkers,
            filteredMarkers: filteredMarkers,
            magnitudeOf: magnitudeOf,
            inRange: inRange,
            locateHint: locateHint,
            resetFilter: resetFilter,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
