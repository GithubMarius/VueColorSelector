<script setup lang="ts">
defineProps(['label'])

</script>

<template>
<div class="form-group row mb-2">
    <label class="col-sm-3 col-form-label">{{ label }}</label>
    <div class="col-sm-9 m-auto">
        <slot></slot>
    </div>
</div>
</template>