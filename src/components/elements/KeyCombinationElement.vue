<script setup lang="ts">
import {get_display_string_for_key_of_combination, KeyCombinationWithInfo} from "@/utils/keyboardinput";

defineProps({
  'combination': {
    type: KeyCombinationWithInfo
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
      <template v-for="(modifier, index) in combination.modifiers">
        <span class="btn pe-none text-uppercase"
          :class="pressedModifiers.some(mod => modifier.includes(mod)) ? 'btn-primary' : 'btn-outline-primary'">
            {{ combination.modifiers_as_strings[index] }}
        </span>
      </template>
    </td>
    <td>{{ (combination.modifiers.length > 0) ? '+' : '' }}</td>
    <td>
      <span class="btn pe-none text-uppercase"
          :class="pressedKeys.some((key: string) => combination.check_key(key))? 'btn-primary' : 'btn-outline-primary'"> {{
          get_display_string_for_key_of_combination(combination.key)
        }} </span>
    </td>
    <td>{{ combination?.description }}</td>
  </tr>
</template>

<style>
td {
  vertical-align: middle;
}
</style>