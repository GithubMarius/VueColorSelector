<script setup lang="ts">
defineProps(['label'])

</script>

<template>
<div class="form-group row">
    <label for="switchColorMode" class="col-sm-4 col-form-label">{{ label }}</label>
    <div class="col-sm-8 m-auto">
        <slot></slot>
    </div>
</div>
</template>