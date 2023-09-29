<script setup>
import { ref, onMounted } from 'vue'

// reactive state
const count = ref(0)
const image = ref(null)
const canvasElement = ref(null)
const imgurl = ref('https://upload.wikimedia.org/wikipedia/commons/f/f2/Generalstaatsanwalt_Fritz_Bauer.jpg')

// functions that mutate state and trigger updates
function increment() {
  count.value++
}

function test(event) {
  console.log(event)
  console.log(image)
  event.clientX
  event.clientY

  console.log(event.offsetX)
  console.log(event.offsetY)
  

}

function urlupdated() {
  console.log(imgurl)
  canvasElement.value.getContext('2d')
}

// lifecycle hooks
onMounted(() => {
  console.log(`The initial count is ${count.value}.`)
})
</script>

<template>
  <div class="container">

    <div class="row">
      <div class="col-sm-8 d-flex justify-content-center">
        <canvas ref="canvasElement"></canvas>
        <img ref="image" :src="imgurl" @click="test">
      </div>
      <div class="col-sm-4 ">
    <input ref="url" @model="imgurl" @input="urlupdated" type="text">
    <button class="btn btn-primary" @click="increment">Count is: {{ count }}</button>
      </div>
    </div>
    
  </div>
</template>