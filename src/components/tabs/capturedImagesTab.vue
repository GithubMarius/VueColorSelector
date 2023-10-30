<script setup lang="ts">
import { useCamImageStore } from '@/stores/camImageStore';
import { useSettingsStore } from '@/stores/settings';
import { onUnmounted } from 'vue';
import AutoForm from '../ui/AutoForm.vue';


const camImageStore = useCamImageStore()
const settingsStore = useSettingsStore()

function edit_image(index) {
  camImageStore.activate_by_index(index)
  camImageStore.editing_image = true
}

const step_big = 50;
const step_small = 1;

function adjust_position(event, direction) {
  /* Direction
  0: upwards
  1: rightwards
  2: downwards
  3: leftwards
  */
  const step = (event.ctrlKey) ? step_small : step_big

  switch (direction) {
    case 0:
      camImageStore.active_image.offSetY -= step
      break
    case 1:
      camImageStore.active_image.offSetX += step
      break
    case 2:
      camImageStore.active_image.offSetY += step
      break
    case 3:
      camImageStore.active_image.offSetX -= step
  }
}

function flip(direction) {
  switch (direction) {
    case 0:
      camImageStore.active_image.angle.flipRight()
      break
    case 1:
      camImageStore.active_image.angle.flipLeft()
      break
  }
}

function reset() {
  camImageStore.active_image.resetOffset()
  camImageStore.active_image.resetAngle()
}

onUnmounted(() => {
  camImageStore.editing_image = false
})

</script>


<template>
  <CardContainer v-if="camImageStore.editing_image">
    <template #header>
      Adjust Image
    </template>
    <template #content>
      <AutoForm v-model="settingsStore.opacity"></AutoForm>
      <AutoForm v-model="camImageStore.active_image.angle"></AutoForm>
      <AutoForm v-model="camImageStore.active_image.scale"></AutoForm>
      <formGroup label="Adjust position">
        <div class="position-relative align-container">
          <button class="position-absolute top-0 start-50 translate-middle-x btn btn-outline-primary" @click="adjust_position($event, 0)"><i class="bi bi-arrow-up"></i></button>
          <button class="position-absolute top-50 end-0 translate-middle-y btn btn-outline-primary" @click="adjust_position($event, 1)"><i class="bi bi-arrow-right"></i></button>
          <button class="position-absolute top-50 start-50 translate-middle btn btn-outline-primary" @click="reset"><i class="bi bi-crosshair"></i></button>
          <button class="position-absolute top-0 start-0 btn btn-outline-primary" @click="flip(0)"><i class="bi bi-arrow-clockwise"></i></button>
          <button class="position-absolute top-0 end-0 btn btn-outline-primary" @click="flip(1)"><i class="bi bi-arrow-counterclockwise"></i></button>
          <button class="position-absolute bottom-0 start-50 translate-middle-x btn btn-outline-primary" @click="adjust_position($event, 2)"><i class="bi bi-arrow-down"></i></button>
          <button class="position-absolute top-50 start-0 translate-middle-y btn btn-outline-primary" @click="adjust_position($event, 3)"><i class="bi bi-arrow-left"></i></button>
        </div>
      </formGroup>
    </template>
  </CardContainer>
  
  
  <div class="container px-4">
    <div class="row row-cols-3 gx-5">
      <div class="col p-3 overflow-hidden position-relative" v-for="(imgUrl, index) in camImageStore.imageUrls" >
        <img class="mw-100 rounded" :class="{'border border-primary border-5': camImageStore.is_active_index(index)}" :src="imgUrl" @click="camImageStore.activate_by_index(index)">
        <button class="bi bi-gear position-absolute edit-icon" @click="edit_image(index)"></button>
      </div>
    </div>
  </div>

</template>

<style scoped>
.align-container {
  width: 200px;
  height: 200px;
}

.align-container button {
  container-type: inline-size;
  container-name: btn-container / size;
  padding: 10px;
  width: 31%;
  height: 31%;
  border: 0px;
  text-align: center;

}

i {
  vertical-align: top;
  font-size: 100cqw;
}

i::before {
  vertical-align: top;
}

img {
  cursor: pointer;
}

.edit-icon {
  color: var(--bs-light);
  opacity: 0.3;
  font-size: 30px;
  top: 10%;
  right: 10%;
  background-color: transparent;
  border: none;
}
.edit-icon:hover {
  opacity: 0.7;
}

</style>