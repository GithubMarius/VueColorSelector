<script setup lang="ts">
import {useToolsStore} from '@/stores/tools'

const toolStore = useToolsStore()
</script>


<template>
  <div class="w-100 vh-100 m-0 position-relative overflow-hidden" ondragstart="return false;" ondrop="return false;">
    <slot>
    </slot>
    <div id="rectangular-selection" :style="toolStore.selectionTool.style">
    </div>
  </div>
</template>

<style scoped>

#rectangular-selection {
  z-index: 15;
  position: absolute;
  padding: 0;
  background-color: transparent;
  border: 1px dashed black;
}
</style>