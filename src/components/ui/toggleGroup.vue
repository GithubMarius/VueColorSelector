<script setup lang="ts">

defineProps({
    modelValue: {},
    options: {
        type: Array
    }
})

const emits = defineEmits(['update:modelValue'])

function update_from_event(event) {
    const selected = event.target.dataset.value
    emits('update:modelValue', selected)
}

</script>

<template>
    <div class="btn-group" role="group" aria-label="Basic radio toggle button group" @input="update_from_event($event)">
        <template v-for="(option, index) in options">
            <input type="radio" class="btn-check" :data-value="index" name="btnradio" autocomplete="off" :id="<string>option" :checked="index===modelValue">
            <label class="btn btn-outline-primary" :for="<string>option">{{ option }}</label>
        </template>
    </div>
</template>
