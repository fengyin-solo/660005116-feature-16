/// <reference types="../node_modules/.vue-global-types/vue_3.5_0_0_0.d.ts" />
import { reactive } from 'vue';
import SpectrumPlot from './components/SpectrumPlot.vue';
import ConstellationPlot from './components/ConstellationPlot.vue';
import WaterfallPlot from './components/WaterfallPlot.vue';
import ModulationResult from './components/ModulationResult.vue';
import MarkerList from './components/MarkerList.vue';
import { useSignalStore } from './store/signal';
const store = useSignalStore();
const form = reactive({ modulation: 'QPSK', samples: 1024, snr: 20 });
function generate() { store.analyze({ ...form }); }
debugger; /* PartiallyEnd: #3632/scriptSetup.vue */
const __VLS_ctx = {};
let __VLS_components;
let __VLS_directives;
// CSS variable injection 
// CSS variable injection end 
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "app-container" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.header, __VLS_intrinsicElements.header)({
    ...{ class: "app-header" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.h1, __VLS_intrinsicElements.h1)({});
__VLS_asFunctionalElement(__VLS_intrinsicElements.p, __VLS_intrinsicElements.p)({
    ...{ class: "subtitle" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.main, __VLS_intrinsicElements.main)({
    ...{ class: "app-main" },
});
__VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
    ...{ class: "control-card" },
});
const __VLS_0 = {}.ElForm;
/** @type {[typeof __VLS_components.ElForm, typeof __VLS_components.elForm, typeof __VLS_components.ElForm, typeof __VLS_components.elForm, ]} */ ;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent(__VLS_0, new __VLS_0({
    model: (__VLS_ctx.form),
    inline: true,
}));
const __VLS_2 = __VLS_1({
    model: (__VLS_ctx.form),
    inline: true,
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
__VLS_3.slots.default;
const __VLS_4 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_5 = __VLS_asFunctionalComponent(__VLS_4, new __VLS_4({
    label: "调制方式",
}));
const __VLS_6 = __VLS_5({
    label: "调制方式",
}, ...__VLS_functionalComponentArgsRest(__VLS_5));
__VLS_7.slots.default;
const __VLS_8 = {}.ElSelect;
/** @type {[typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, typeof __VLS_components.ElSelect, typeof __VLS_components.elSelect, ]} */ ;
// @ts-ignore
const __VLS_9 = __VLS_asFunctionalComponent(__VLS_8, new __VLS_8({
    modelValue: (__VLS_ctx.form.modulation),
}));
const __VLS_10 = __VLS_9({
    modelValue: (__VLS_ctx.form.modulation),
}, ...__VLS_functionalComponentArgsRest(__VLS_9));
__VLS_11.slots.default;
for (const [m] of __VLS_getVForSourceType((['AM', 'FM', 'BPSK', 'QPSK', '16QAM']))) {
    const __VLS_12 = {}.ElOption;
    /** @type {[typeof __VLS_components.ElOption, typeof __VLS_components.elOption, ]} */ ;
    // @ts-ignore
    const __VLS_13 = __VLS_asFunctionalComponent(__VLS_12, new __VLS_12({
        key: (m),
        label: (m),
        value: (m),
    }));
    const __VLS_14 = __VLS_13({
        key: (m),
        label: (m),
        value: (m),
    }, ...__VLS_functionalComponentArgsRest(__VLS_13));
}
var __VLS_11;
var __VLS_7;
const __VLS_16 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_17 = __VLS_asFunctionalComponent(__VLS_16, new __VLS_16({
    label: "样本数",
}));
const __VLS_18 = __VLS_17({
    label: "样本数",
}, ...__VLS_functionalComponentArgsRest(__VLS_17));
__VLS_19.slots.default;
const __VLS_20 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_21 = __VLS_asFunctionalComponent(__VLS_20, new __VLS_20({
    modelValue: (__VLS_ctx.form.samples),
    min: (256),
    max: (8192),
    step: (256),
}));
const __VLS_22 = __VLS_21({
    modelValue: (__VLS_ctx.form.samples),
    min: (256),
    max: (8192),
    step: (256),
}, ...__VLS_functionalComponentArgsRest(__VLS_21));
var __VLS_19;
const __VLS_24 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_25 = __VLS_asFunctionalComponent(__VLS_24, new __VLS_24({
    label: "SNR(dB)",
}));
const __VLS_26 = __VLS_25({
    label: "SNR(dB)",
}, ...__VLS_functionalComponentArgsRest(__VLS_25));
__VLS_27.slots.default;
const __VLS_28 = {}.ElInputNumber;
/** @type {[typeof __VLS_components.ElInputNumber, typeof __VLS_components.elInputNumber, ]} */ ;
// @ts-ignore
const __VLS_29 = __VLS_asFunctionalComponent(__VLS_28, new __VLS_28({
    modelValue: (__VLS_ctx.form.snr),
    min: (0),
    max: (40),
    step: (5),
}));
const __VLS_30 = __VLS_29({
    modelValue: (__VLS_ctx.form.snr),
    min: (0),
    max: (40),
    step: (5),
}, ...__VLS_functionalComponentArgsRest(__VLS_29));
var __VLS_27;
const __VLS_32 = {}.ElFormItem;
/** @type {[typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, typeof __VLS_components.ElFormItem, typeof __VLS_components.elFormItem, ]} */ ;
// @ts-ignore
const __VLS_33 = __VLS_asFunctionalComponent(__VLS_32, new __VLS_32({}));
const __VLS_34 = __VLS_33({}, ...__VLS_functionalComponentArgsRest(__VLS_33));
__VLS_35.slots.default;
const __VLS_36 = {}.ElButton;
/** @type {[typeof __VLS_components.ElButton, typeof __VLS_components.elButton, typeof __VLS_components.ElButton, typeof __VLS_components.elButton, ]} */ ;
// @ts-ignore
const __VLS_37 = __VLS_asFunctionalComponent(__VLS_36, new __VLS_36({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.store.loading),
}));
const __VLS_38 = __VLS_37({
    ...{ 'onClick': {} },
    type: "primary",
    loading: (__VLS_ctx.store.loading),
}, ...__VLS_functionalComponentArgsRest(__VLS_37));
let __VLS_40;
let __VLS_41;
let __VLS_42;
const __VLS_43 = {
    onClick: (__VLS_ctx.generate)
};
__VLS_39.slots.default;
var __VLS_39;
var __VLS_35;
var __VLS_3;
if (__VLS_ctx.store.result) {
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "results-grid" },
    });
    __VLS_asFunctionalElement(__VLS_intrinsicElements.div, __VLS_intrinsicElements.div)({
        ...{ class: "spectrum-column" },
    });
    /** @type {[typeof SpectrumPlot, ]} */ ;
    // @ts-ignore
    const __VLS_44 = __VLS_asFunctionalComponent(SpectrumPlot, new SpectrumPlot({}));
    const __VLS_45 = __VLS_44({}, ...__VLS_functionalComponentArgsRest(__VLS_44));
    /** @type {[typeof MarkerList, ]} */ ;
    // @ts-ignore
    const __VLS_47 = __VLS_asFunctionalComponent(MarkerList, new MarkerList({}));
    const __VLS_48 = __VLS_47({}, ...__VLS_functionalComponentArgsRest(__VLS_47));
    /** @type {[typeof ConstellationPlot, ]} */ ;
    // @ts-ignore
    const __VLS_50 = __VLS_asFunctionalComponent(ConstellationPlot, new ConstellationPlot({}));
    const __VLS_51 = __VLS_50({}, ...__VLS_functionalComponentArgsRest(__VLS_50));
}
else {
    /** @type {[typeof MarkerList, ]} */ ;
    // @ts-ignore
    const __VLS_53 = __VLS_asFunctionalComponent(MarkerList, new MarkerList({}));
    const __VLS_54 = __VLS_53({}, ...__VLS_functionalComponentArgsRest(__VLS_53));
}
if (__VLS_ctx.store.result) {
    /** @type {[typeof WaterfallPlot, ]} */ ;
    // @ts-ignore
    const __VLS_56 = __VLS_asFunctionalComponent(WaterfallPlot, new WaterfallPlot({}));
    const __VLS_57 = __VLS_56({}, ...__VLS_functionalComponentArgsRest(__VLS_56));
}
if (__VLS_ctx.store.result) {
    /** @type {[typeof ModulationResult, ]} */ ;
    // @ts-ignore
    const __VLS_59 = __VLS_asFunctionalComponent(ModulationResult, new ModulationResult({}));
    const __VLS_60 = __VLS_59({}, ...__VLS_functionalComponentArgsRest(__VLS_59));
}
/** @type {__VLS_StyleScopedClasses['app-container']} */ ;
/** @type {__VLS_StyleScopedClasses['app-header']} */ ;
/** @type {__VLS_StyleScopedClasses['subtitle']} */ ;
/** @type {__VLS_StyleScopedClasses['app-main']} */ ;
/** @type {__VLS_StyleScopedClasses['control-card']} */ ;
/** @type {__VLS_StyleScopedClasses['results-grid']} */ ;
/** @type {__VLS_StyleScopedClasses['spectrum-column']} */ ;
var __VLS_dollars;
const __VLS_self = (await import('vue')).defineComponent({
    setup() {
        return {
            SpectrumPlot: SpectrumPlot,
            ConstellationPlot: ConstellationPlot,
            WaterfallPlot: WaterfallPlot,
            ModulationResult: ModulationResult,
            MarkerList: MarkerList,
            store: store,
            form: form,
            generate: generate,
        };
    },
});
export default (await import('vue')).defineComponent({
    setup() {
        return {};
    },
});
; /* PartiallyEnd: #4569/main.vue */
