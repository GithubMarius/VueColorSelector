<script setup lang="ts">
import {Color, ColorArray} from './color';
import {onMounted, ref} from 'vue'
import "bootstrap-icons/font/bootstrap-icons.css";

const settings = ref({
    background_color: <ColorArray>[0, 1, 2, 1],
    background_color_light: <ColorArray>[0, 1, 2, 1]
})

onMounted(() => {
    console.log(Color)
})

</script>

<template>
    

<div class="btn-group" role="group" aria-label="Basic checkbox toggle button group">
  <input type="checkbox" class="btn-check" id="btncheck1" autocomplete="off">
  <label class="btn btn-outline-primary" for="btncheck1">V</label>

  <input type="checkbox" class="btn-check" id="btncheck2" autocomplete="off">
  <label class="btn btn-outline-primary" for="btncheck2">M</label>
</div>

<div class="form-check form-switch">
  <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault">
  <label class="form-check-label" for="flexSwitchCheckDefault">Default switch checkbox input</label>
</div><i class="bi bi-caret-down display-6"></i>
</template>