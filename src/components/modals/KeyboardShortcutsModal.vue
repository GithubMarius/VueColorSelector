<script setup lang="ts">
import {ref} from "vue";

import Modal from "@/components/ui/Modal.vue";
import KeyCombinationElement from "@/components/elements/KeyCombinationElement.vue";

import {KeyCombinationWithInfo} from "@/utils/keyboardinput";

const pressedModifiers = ref([])
const pressedKeys = ref([])
</script>

<template>
  <Modal v-model:pressed-modifiers="pressedModifiers" v-model:pressed-keys="pressedKeys">
    <template #header>Active keyboard shortcuts</template>
    <template #body>
        While displaying this overview you can try out key combinations with exception of some browser dependent ones (e.g. CTRL/META + w will close the tab) without causing any real actions.
        Press "ESC" to close the overview.
        <table class="table">
          <thead>
            <tr>
              <td colspan="2">Modifier(s)*</td>
              <td>Key</td>
              <td>Description</td>
            </tr>
          </thead>
          <tbody>
            <KeyCombinationElement v-for="combination in <KeyCombinationWithInfo[]>KeyCombinationWithInfo.combinations"
                                   :combination="combination"
                                   :pressedModifiers="pressedModifiers"
                                   :pressedKeys="pressedKeys"
            />
          </tbody>
        </table>
      </template>
    <template #footer>
            *The <i class="bi bi-command"/>-key corresponds to CTRL for Mac users.
    </template>
  </Modal>
</template>

<style scoped>
table {
  table-layout: auto;
}

table td:last-of-type {
  width: 100%;
}
</style>