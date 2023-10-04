<script setup>
import {ref, onMounted} from 'vue'

const props = defineProps(['tabs', 'title'])
const tabContainerRef = ref(null)
const tab_entry = ref({title: props.title, containerRef: tabContainerRef, activate: activate})


onMounted(() => {
    props.tabs.list.push(tab_entry.value)
})

function get_position() {
    return props.tabs.list.indexOf(tab_entry.value)
}

function is_active() {
    return props.tabs.active_tab === get_position()
}

function activate() {
    props.tabs.active_tab = get_position()
}

defineExpose([activate])

</script>

<template>
    <div ref="tabContainerRef" class="p-3" :style="{display: (is_active()) ? 'block' : 'none'}"> 
        <slot></slot>
    </div>
</template>