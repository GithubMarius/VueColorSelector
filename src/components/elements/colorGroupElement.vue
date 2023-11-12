<script setup lang="ts">
import {ColorGroup} from '@/utils/colors/ColorManagement';
import ColorBlockElement from '@/components/elements/ColorBlockElement.vue'
import ToggleButton from '@/components/ui/ToggleButton.vue'
import {useColorStore} from '@/stores/color'

import {computed, nextTick, ref} from 'vue'
import {useSettingsStore} from '@/stores/settings';
import {RenameGroup} from "@/actions/coloractions";

const colorStore = useColorStore()
const settingsStore = useSettingsStore()

const props = defineProps({
  group: ColorGroup,
  show_all: {
    type: Boolean,
    default: false
  }
})

const group_name_input_ref = ref(null)

const editing_name = ref(false)

function activate_name_editing() {
  if (!props.group.is_default) {
    editing_name.value = true
    nextTick(() => group_name_input_ref.value.focus())
  }
}

function submit_name() {
  const name = group_name_input_ref.value.value
  const actionFeedback = RenameGroup.create(props.group.name, name)
  if (actionFeedback.success) {
    reset()
  } else {
    feedback.value = actionFeedback
  }
}

function reset() {
  editing_name.value = false
  feedback.value = null
}

const displayed_group_name = computed(() => props.group.name !== '' ? props.group.name : 'Groupless Colors')
const feedback = ref(null)

function sorted_values() {
  // Sort colors (sorting depends on settings: hue, chroma/saturation or lightness)
  const colors = props.group.colors
  const sorting_values = colors.map(settingsStore.get_color_sorting_value)
  const indices = [...sorting_values.keys()]
  indices.sort((b, a) => (settingsStore.colorsOrderAscending.value) ? sorting_values[a] - sorting_values[b] : sorting_values[b] - sorting_values[a])
  return indices.map(indice => colors[indice])
}
</script>

<template>
  <CardContainer :content-visibility="group.visibility">
    <template #header>
      <div class="col-9 p-0 fs-6">
        <div class="input-group group-name-container h-100" @click="activate_name_editing()">
          <input ref="group_name_input_ref" type="text" class="form-control" :value="displayed_group_name"
                 :disabled="!editing_name"
                 :class="{
                        'pl-2 disabled-name-input fs-5': !editing_name,
                        'group-name-input': !editing_name && !group.is_default,
                        'is-invalid': feedback && !feedback.success
                        }"
                 @keydown.enter="submit_name"
                 @focusout="reset">
          <div class="input-group-text rounded-right" :class="{'group-name-icon-active': editing_name}"
               v-if="!group.is_default"><i class="bi bi-pen"></i></div>
        </div>
      </div>
      <div v-if="!show_all" class="col-3" role="group" aria-label="Basic checkbox toggle button group">
        <div class="btn-group group-menu">
          <ToggleButton v-model="group.visibility"
                        :icons="['bi-chevron-double-up', 'bi-chevron-double-down']"></ToggleButton>
          <ToggleButton v-model="group.visibility_colors" :icons="['bi-eye-fill', 'bi-eye-slash']"></ToggleButton>
        </div>
      </div>
      <div class="row invalid-feedback text-danger" v-if="feedback && !feedback.success"
           style="display: block !important;">
        {{ feedback.msg }}
      </div>
    </template>
    <template #content>
      <ColorBlockElement v-for="(color, _) in sorted_values()" :key="colorStore.color_index(color)"
                         :color="color"></ColorBlockElement>
    </template>
  </CardContainer>
</template>

<style scoped>
.group-menu {
  float: right;
}

.disabled-name-input {
  padding: 0 0 0 15px !important;
  background-color: transparent !important;
  border-color: transparent !important;
}

.group-name-icon-active {
  color: var(--bs-dark) !important;
  border-color: var(--bs-dark) !important;
}

.group-name-icon-active i {
  color: var(--bs-dark) !important;
  border-color: var(--bs-dark) !important;
}

.group-name-container * {
  transition-duration: 0.2s;
}

.group-name-container div {
  border-color: transparent;
}

.group-name-container:hover div:first-of-type {
  cursor: pointer;
  border-color: var(--bs-dark) !important;
  transition-duration: 0.2s;
}

.group-name-container div:first-of-type {
  color: transparent !important;

}

.group-name-container:hover div:first-of-type {
  color: var(--bs-dark) !important;

}

.group-name-input:hover {
  border: solid 1px var(--bs-dark);
  border-color: var(--bs-dark) !important;
}
</style>