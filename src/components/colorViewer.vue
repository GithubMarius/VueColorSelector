<script setup lang="ts">

import { rgb, oklab, oklch } from '@/../node_modules/culori'
import formSlider from '@/components/ui/formSlider.vue'
import formGroup from '@/components/ui/formGroup.vue'
import toggleGroup from '@/components/ui/toggleGroup.vue'
import colorViewerElement from './elements/colorViewerElement.vue'
import { onMounted, ref, watch } from 'vue';
import { useColorStore } from '@/stores/color';

// Store
const colorStore = useColorStore()

// Refs
const colorViewerRef = ref(null)
const chroma = ref(0)
const color_representation = ref(0)

// Watches
watch(chroma, () => {
    drawColorViewer()
})
watch(color_representation, (_a, _b) => {
    drawColorViewer()
})

// onMounted: Draw colorviewer
onMounted(() => {
    drawColorViewer();
})
function drawColorViewer() {
    const ctx = colorViewerRef.value.getContext("2d");

    const func = Object.values(csscolortransforms)[color_representation.value]
    for (var row = 0; row < colorViewerRef.value.width; row++) {
        for (var col = 0; col < colorViewerRef.value.height; col++) {
            const hue = col / (colorViewerRef.value.width - 1);
            const light = row / (colorViewerRef.value.height - 1);

            /*
            ctx.fillStyle = cssoklab(y, x, -1);
            ctx.fillStyle = csshsl(x, 0, y);
            */
            ctx.fillStyle = func(hue, chroma.value, light);
            ctx.fillRect(col, row, 1, 1);
        }
    }
}



function cssokhcl(h, c, l) {
    return `oklch(${l*100}% ${c*100}% ${h*360}deg)`;
}

/*
function cssoklab(a, b, l) {
    return `oklab(${l*100}% ${-0.4 + 0.8*a} ${-0.4 + 0.8*b})`;
}
*/

function csshsl(h, s, l) {
    return `hsl(${h*360}deg ${s*100}% ${l*100}%)`;
}

const csscolortransforms = {
    'hcl': cssokhcl,
    'hsl': csshsl
}

const postransforms = {
    'hcl': posokhcl,
    'hsl': poshsl
}

</script>

<template>
    <div class="color-viewer-container">
        <form class="m-4">
            <formGroup :label="'Chroma/Saturation'">
                <formSlider v-model="chroma" :min="0" :max="1" :step="0.05"></formSlider>
            </formGroup>
            <formGroup :label="'Colorrepresentation'">
                <toggleGroup v-model="color_representation" :options="Object.keys(csscolortransforms)"></toggleGroup>
            </formGroup>
        </form>
        <div class="color-viewer-canvas-container">
            <canvas ref="colorViewerRef" class="color-viewer" width="200" height="200">
            </canvas>
            <colorViewerElement v-for="(color, _) in colorStore.colors" :key="colorStore.color_index(color)" :color="color"></colorViewerElement>
        </div>

    </div>
</template>

<style>

.color-viewer-canvas-container {
    position: static;
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