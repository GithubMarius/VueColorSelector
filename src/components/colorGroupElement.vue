<script setup lang="ts">
import { Color } from './color';
import colorBlockElement from './colorBlockElement.vue'

import { ref, computed } from 'vue'


const props = defineProps({
    'colors': Array<Color>,
    'group_name': String,
    show_all:{
        type: Boolean,
        default: false
    }})

function toggle_visibility() {
    show_colors.value = !show_colors.value
    group_colors.value.forEach(color => color.visible = show_colors.value)
}

const group_colors = computed(() => props.colors.filter(color => color.group === props.group_name))

const show_group = ref(true)
const show_colors = ref(true)
</script>

<template>
    <p>
        <p class="w-100 bg-light p-2">
            <span class="h3">{{ group_name ? group_name : 'Remaining colors' }}</span>
            <div v-if="!show_all" class="btn-group group-menu" role="group" aria-label="Basic checkbox toggle button group">
            <input type="checkbox" class="btn-check" autocomplete="off">
            <label class="btn btn-outline-pri"
            @click="show_group = !show_group"><i class="bi" :class="[show_group ? 'bi-caret-up' : 'bi-caret-down']"></i>
            </label>
            <input type="checkbox" class="btn-check" autocomplete="off">
            <label class="btn btn-outline-pri"
            @click="show_colors = !show_colors"><i class="bi" :class="[show_colors ? 'bi-eye-fill' : 'bi-eye-slash']"></i>
            </label>
            </div>
        </p>
        <div v-if="show_group">
            <colorBlockElement v-for="(color, index) in group_colors" :key="index" :color="color" :colors="colors" :group_name="group_name" :show_all="show_all" :visible="show_colors"></colorBlockElement>
        </div>
    </p>
</template>

<style>
.group-menu {
    float: right;
}
</style>