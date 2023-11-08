<script setup lang="ts">
import {useSettingsStore} from "@/stores/settings";
import KeyCombinationElement from "@/components/KeyCombinationElement.vue";
import {allModifiers, KeyCombinationWithInfo} from "@/utils/keyboardinput";
import {reactive} from "vue";

const settingsStore = useSettingsStore()
const pressedModifiers = reactive([])
const pressedKeys = reactive([])

function keyboard_call(event: KeyboardEvent) {
  pressedModifiers.length = 0
  Object.values(allModifiers).filter((value:string) => event[value]).forEach(modifier => pressedModifiers.push(modifier))
  event.stopPropagation()
  event.preventDefault()
}

function keyup(event: KeyboardEvent) {
  const index = pressedKeys.indexOf(event.key)
  if (index >= 0) {
    pressedKeys.splice(index, 1)
  }
  keyboard_call(event)
}

function keydown(event: KeyboardEvent) {
  if(event.key === 'Escape') {
    close_window()
  }

  if (!event.repeat) {
    pressedKeys.push(event.key)
  }
  keyboard_call(event)
}

function listen() {
  document.addEventListener('keyup', keyup, {capture: true})
  document.addEventListener('keydown', keydown, {capture: true})
}

function mute() {
  document.removeEventListener('keyup', keyup, {capture: true})
  document.removeEventListener('keydown', keydown, {capture: true})
  pressedModifiers.length = 0
  pressedKeys.length = 0
}

function close_window() {
  settingsStore.ui.show_short_cuts.value = false
}

</script>

<template>
  <transition @enter="listen" @leave="mute">
    <div class="modal fade d-block show bg-opacity-50 bg-body-tertiary" id="exampleModal" tabindex="-1"
         aria-labelledby="exampleModalLabel" aria-hidden="true"
         v-if="settingsStore.ui.show_short_cuts.value"
         @click="settingsStore.ui.show_short_cuts.value = false">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Active keyboard shortcuts</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                    @click="close_window"></button>
          </div>
          <div class="modal-body">
            While displaying the shortcuts you can try out key combinations with exception of (ESC) without causing any real actions.
            (ESC closes shortcut the window.)
            <table class="table">
              <thead>
                <tr>
                  <td colspan="2">Modifier(s)*</td>
                  <td>Key</td>
                  <td>Description</td>
                </tr>
              </thead>
              <tbody>
                <KeyCombinationElement v-for="combination in KeyCombinationWithInfo.combinations"
                                       :combination="combination"
                                       :pressedModifiers="pressedModifiers"
                                       :pressedKeys="pressedKeys"
                />
              </tbody>
            </table>
          </div>
          <div class="modal-footer">
            *The <i class="bi bi-command"/>-key corresponds to CTRL for Mac users.
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
table {
  table-layout: auto;
}

table td:last-of-type {
  width: 100%;
}
</style>