<script setup lang="ts">
import {onMounted, ref, StyleValue} from 'vue'
import {Color} from '@/utils/colors/ColorManagement'
import SelectableColor from '@/components/elements/SelectableColor.vue'
import {useSettingsStore} from '@/stores/settings'
import {useToolsStore} from "@/stores/tools";


const props = defineProps({
  color: {
    type: Color
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const settings = useSettingsStore()
const toolsStore = useToolsStore()

const colorBlockRef = ref(null)

onMounted(() => {
})
</script>

<template>
  <SelectableColor :color="color" v-model:selecting="color.selectingBlock"
                   :active="toolsStore.tools.colorsTool.state.active">
    <div ref="colorBlockRef" class="color_block"
         :class="{highlighted: color.highlighted}"
         :style="<StyleValue>{backgroundColor: settings.color_mode.value ? props.color.css_rgb : settings.get_grayScaledColor(props.color)}"
    ></div>
  </SelectableColor>
</template>

<style scoped>
.color_block {
  display: inline-block;
  width: 50px;
  height: 50px;
  border: 2px solid rgba(0, 0, 0, 0);
}
</style>