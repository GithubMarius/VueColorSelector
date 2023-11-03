<script setup lang="ts">

import ToastElement from "@/components/elements/ToastElement.vue";
import {useToastStore} from "@/stores/toasts";

const toastStore = useToastStore()
</script>

<template>
  <div class="toast-container">
    <ToastElement v-for="(toast, _) in toastStore.toasts"
                  v-bind="toast"
                  v-model:visible="toast.visible">
    </ToastElement>
  </div>
</template>

<style scoped>
.toast-container {
  bottom: 30px;
  left: 30px;
  padding: 0;
}
</style>