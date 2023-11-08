<script setup lang="ts">
import {KeyCombination, KeyCombinationWithInfo, modifierLabels} from "@/utils/keyboardinput";

const props = defineProps({
  'combination': {
    type: KeyCombination || KeyCombinationWithInfo
  },
  'pressedModifiers': {
    type: Array
  },
  'pressedKeys': {
    type: Array
  }
})
</script>


<template>
  <tr>
    <td>
      <template v-for="modifier in combination.modifiers">
        <span class="btn pe-none text-uppercase"
          :class="pressedModifiers.some(mod => modifier.includes(mod)) ? 'btn-primary' : 'btn-outline-primary'">
            {{ modifierLabels[JSON.stringify(modifier)]}}
        </span>
      </template>
    </td>
    <td>{{ (combination.modifiers.length > 0) ? '+' : '' }}</td>
    <td>
      <span class="btn pe-none text-uppercase"
          :class="pressedKeys.includes(combination.key) ? 'btn-primary' : 'btn-outline-primary'"> {{ combination.key }} </span>
    </td>
    <td>{{ combination.description }}</td>
  </tr>
</template>

<style>
td {
  vertical-align: middle;
}
</style>