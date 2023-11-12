<script setup lang="ts">
import {KeyCombination} from "@/utils/keyboardinput";

defineProps({
  combination: {
    type: KeyCombination
  }
})
</script>

<template>
  <span class="shortcut">
    <span class="badge bg-secondary fs-6 fw-normal" v-for="modifier in combination.modifiers_as_strings">{{ modifier }}</span>
    {{ (combination.modifiers.length > 0 ? '+' : '') }}
    <span class="badge bg-secondary fs-6 fw-normal" v-for="modifier in combination.key">{{ modifier }}</span>
  </span>
</template>

<style scoped>
.badge {
  padding: 5px;
}

.shortcut {
  float: right;
}
</style>