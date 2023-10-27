<script setup lang="ts">
import { useCamImageStore } from '@/stores/camImageStore';

const camImageStore = useCamImageStore()

</script>


<template><div class="container px-4">
    <div class="row row-cols-3 gx-5">
      <div class="col p-3 overflow-hidden" v-for="(imgUrl, index) in camImageStore.imageUrls" >
        <img class="mw-100 rounded" :class="{'border border-primary border-5': camImageStore.active_image_index === index}" :src="imgUrl" @click="camImageStore.activate_by_index(index)">
      </div>
    </div>
  </div>

</template>