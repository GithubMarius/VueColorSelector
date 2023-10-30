<script setup lang="ts">

// https://culorijs.org/color-spaces/

import FormSlider from '@/components/ui/FormSlider.vue'
import formGroup from '@/components/ui/FormGroup.vue'
import ToggleGroup from '@/components/ui/ToggleGroup.vue'
import ColorViewerElement from '@/components/elements/ColorViewerElement.vue'
import { computed, onMounted, ref, watch } from 'vue';
import { useColorStore } from '@/stores/color';
import { Color } from '@/utils/colors/ColorManagement'
import { useSettingsStore } from '@/stores/settings'

const ColorViewerSize = ref({
    width: 300,
    height: 300
})

// Store
const colorStore = useColorStore()
const settingsStore = useSettingsStore()

// Refs
const colorViewerRef = ref(null)
const color_representation = ref(0)

// Watches
watch(settingsStore.chrOrSat, () => {
    drawColorViewer()
})
watch(settingsStore.colorspace, (_a, _b) => {
    drawColorViewer()
})

// onMounted: Draw colorviewer
onMounted(() => {
    drawColorViewer();
})
function drawColorViewer() {
    const ctx = colorViewerRef.value.getContext("2d");

    const func = current_csscolortransform.value
    for (var row = 0; row < colorViewerRef.value.width; row++) {
        for (var col = 0; col < colorViewerRef.value.height; col++) {
            const hue = col / (colorViewerRef.value.width - 1);
            const light = row / (colorViewerRef.value.height - 1);
            ctx.fillStyle = func(hue, settingsStore.chrOrSat.value, light);
            ctx.fillRect(col, row, 1, 1);
        }
    }
}



function cssokhcl(h, c, l) {
    return `oklch(${l*100}% ${c*100}% ${h*360}deg)`;
}

function csshsl(h, s, l) {
    return `hsl(${h*360}deg ${s*100}% ${l*100}%)`;
}

// https://culorijs.org/color-spaces/
function posokhcl(color: Color) {
    const col_oklch = color.culori_oklch
    const x = (col_oklch.h? col_oklch.h : 0) * ColorViewerSize.value.width / 360
    const y = col_oklch.l * ColorViewerSize.value.height
    const d = col_oklch.c / 0.4 - settingsStore.chrOrSat.value
    return [x, y, d]
}

function poshsl(color: Color) {
    const col_hsl = color.culori_hsl
    const x = col_hsl.h * ColorViewerSize.value.width /360
    const y = col_hsl.l * ColorViewerSize.value.height
    const d = col_hsl.s - settingsStore.chrOrSat.value
    return [x, y, d]
}

const csscolortransforms = {
    'okhcl': cssokhcl,
    'hsl': csshsl
}

const postransforms = {
        'okhcl': posokhcl,
        'hsl': poshsl
    }

const current_postransform = computed(() => {
    return postransforms[settingsStore.colorspace.value]
})

const current_csscolortransform = computed(() => {
    return csscolortransforms[settingsStore.colorspace.value]
})

function current_position(RGB) {
    return current_postransform.value(RGB)
} 



</script>

<template>
    <div class="color-viewer-container">
        <form class="m-4">
            <formGroup :label="'Chroma/Saturation'">
                <FormSlider v-model="settingsStore.chrOrSat.value" :min="settingsStore.chrOrSat.min" :max="settingsStore.chrOrSat.max" :step="settingsStore.chrOrSat.step"></FormSlider>
            </formGroup>
            <formGroup :label="'Colorrepresentation'">
                <ToggleGroup v-model="settingsStore.colorspace.value" :options="settingsStore.colorspace.options"></ToggleGroup>
            </formGroup>
        </form>
        <div  :style="{backgroundColor: (colorStore.get_detailed_color()) ? colorStore.get_detailed_color().css_rgb : ''}">
            <div class="color-viewer-canvas-container">
                <canvas ref="colorViewerRef" class="color-viewer" :width="ColorViewerSize.width" :height="ColorViewerSize.height">
                </canvas>
                <ColorViewerElement v-for="(color, _) in colorStore.colors" :key="colorStore.color_index(color)" :color="color" :pos="current_position(color)"></ColorViewerElement>
            </div>
        </div>
    </div>
</template>

<style>

.color-viewer-canvas-container {
    position: relative;
    width: fit-content;
    height: fit-content;
    margin: auto;
}

.color-viewer {
/*    background: linear-gradient(45deg, hsl(0, 30%, 100%), hsl(0, 100%, 0%)),
                linear-gradient(to right, #fff 0%, transparent 100%); */
    display: block;
    margin: auto;

}

</style>