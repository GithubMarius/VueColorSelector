<script setup lang="ts">
import { ref, onMounted, StyleValue } from 'vue'
import { Color } from '@/utils/colors/ColorManagement'
import selectableColor from '@/components/elements/selectableColor.vue'
import { useSettingsStore } from '@/stores/settings'
import { useColorStore } from '@/stores/color'
import { useHistoryStore } from '@/stores/history'


const props = defineProps({
  color: {
    type: Color
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const colorStore = useColorStore()
const historyStore = useHistoryStore()
const settings = useSettingsStore()


const colorBlockRef = ref(null)

onMounted(() => {
  })
</script>

<template>
  <selectableColor :color="color" v-model:selecting="color.selectingBlock">
    <div ref="colorBlockRef" class="color_block"
    :class="{highlighted: color.highlighted}"
    :style="<StyleValue>{backgroundColor: <StyleValue>[settings.color_mode ? props.color.css_rgb : props.color.css_bw_hsl]}"
    ></div>
  </selectableColor>
</template>

<style scoped>
.color_block {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 2px solid rgba(0,0,0,0);
}
</style>