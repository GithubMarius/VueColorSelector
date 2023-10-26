<script setup lang="ts">
defineProps({
    contentVisibility: {
        type: Boolean,
        default: true
    }
})

</script>

<template>
    <div class="card container mb-2">
        <div class="card-header row" :class="{'border-bottom-0': !contentVisibility}">
            <slot name="header"></slot>
        </div>
        <div class="p-3" v-if="contentVisibility">
            <slot name="content"></slot>
        </div>
    </div>
</template>
