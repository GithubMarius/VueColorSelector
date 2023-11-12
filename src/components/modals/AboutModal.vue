<script setup lang="ts">
import Modal from "@/components/ui/Modal.vue";
import {ref} from "vue";

const pressedModifiers = ref([])
const pressedKeys = ref([])
</script>

<template>
  <Modal v-model:pressed-modifiers="pressedModifiers" v-model:pressed-keys="pressedKeys">
    <template #header>About</template>
    <template #body>This software is still under development and provided as is.
    </template>
    <template #footer>Test</template>
  </Modal>
</template>

<style scoped>

</style>