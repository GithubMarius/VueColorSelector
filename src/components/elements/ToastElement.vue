<script setup lang="ts">
import { onMounted } from "vue";

const props = defineProps({
  type: {
    type: String
  },
  msg: {
    type: String
  },
  visible: {
    type: Boolean
  },
  timeout: {
    type: Number,
    default: 3000
  }
})
const emits = defineEmits(['update:visible'])

const typeClassMapping = new Map([
  ['error', 'bg-danger'],
  ['warning', 'bg-warning'],
  ['success', 'bg-success']
])

onMounted(() =>
    setTimeout(() => emits('update:visible', false), props.timeout)

)

</script>

<template>
  <transition name="fade">
    <div class="toast align-items-center text-white border-0 show bg-opacity-75" :class="typeClassMapping.get(type)" role="alert" aria-live="assertive" aria-atomic="true"
    v-if="visible">
      <div class="d-flex">
        <div class="toast-body" v-html="msg">
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close" @click="$emit('update:visible', false)"></button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>