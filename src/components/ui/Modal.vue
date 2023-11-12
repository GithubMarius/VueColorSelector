<script setup lang="ts">
import {allModifiers} from "@/utils/keyboardinput"
import {onMounted, onUnmounted, ref} from "vue";

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  pressedModifiers: {
    type: Array,
    default: []
  },
  pressedKeys: {
    type: Array,
    default: []
  }
})

const emits = defineEmits(['update:visible', 'update:pressedModifiers', 'pressedKeys'])

function keyboard_call(event: KeyboardEvent) {
  props.pressedModifiers.length = 0
  Object.values(allModifiers).filter((value) => event[<string>value]).forEach(modifier => props.pressedModifiers.push(modifier))
  event.stopPropagation()
  event.preventDefault()
}

function keyup(event: KeyboardEvent) {
  const index = props.pressedKeys.indexOf(event.key)
  if (index >= 0) {
    props.pressedKeys.splice(index, 1)
  }
  keyboard_call(event)
}

function keydown(event: KeyboardEvent) {
  const key = event.key
  if(key === 'Escape') {
    close()
  }

  if (!props.pressedKeys.includes(key)) {
    props.pressedKeys.push(key)
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
  props.pressedModifiers.length = 0
  props.pressedKeys.length = 0
}

function close() {
  emits('update:visible', false)
}

onMounted(() => {listen()})
onUnmounted(() => {mute()})
</script>

<template>
  <transition>
    <div class="modal fade d-block show bg-opacity-50 bg-body-tertiary" id="exampleModal" tabindex="-1"
         v-if="visible"
         @click="close">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">
              <slot name="header"/>
            </h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                    @click="close"></button>
          </div>
          <div class="modal-body">
            <slot name="body"/>
          </div>
          <div class="modal-footer">
            <slot name="footer"/>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
</style>