<script setup lang="ts">
const props = defineProps(['selecting', 'selected'])
const emit = defineEmits(['update:selecting', 'update:selected'])

function update_selected() {
    if (props.selecting) {
        emit('update:selected', true)
    }
}
</script>

<template>
<span class="selectable"
@selecting="($event) => {$emit('update:selecting', $event.detail)}"
@toselection="update_selected"
>
<slot></slot></span>
</template>