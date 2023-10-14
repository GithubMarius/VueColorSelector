<script setup lang="ts">

import { ref } from 'vue';
import toggleButton from '../ui/toggleButton.vue'
import selectableElement from '../elements/selectableElement.vue'
const props = defineProps(['settings'])


import { referenceTool } from '../Tool';

const referenceToolRef = ref(referenceTool)

function update_scale(event) {
    const number = Number((<HTMLInputElement>event.target).value)
    if (number) {
        referenceToolRef.value.scale = number
    } else {
        event.target.value = referenceToolRef.value.scale
    }
}

</script>


<template>
    
    <div class="card p-0">
        <div class="card-header">Scale</div>
        <span class="form-group row p-2">
        <label for="rangeReferenceCircleSize" class="col">
            <input type="text" class="form-control" :value="referenceToolRef.scale" @input.stop="update_scale">
        </label>
        <div class="col-sm-8 m-auto">
            <input type="range" class="form-range" id="rangeReferenceCircleSize"
            :value="referenceToolRef.scale"
            :min="0.05" max="10" step="0.001" @input.stop="referenceToolRef.scale = (<HTMLInputElement>$event.target).value">
        </div>
    </span>
    </div>
    <ul class="list-group p-0 mt-2">
        <li class="list-group-item" v-for="(pair, _) in referenceToolRef.pairs">{{ pair.length_org.toFixed(2) }}<span class="btn-group float-end">
            <toggleButton v-model="pair.visible" :icons="['bi-eye-fill', 'bi-eye-slash']"></toggleButton>
            <button class="btn btn-primary bi bi-trash" @click="console.log(referenceToolRef.remove_pair(pair))"></button>
        </span></li>
    </ul>
    <selectableElement @click="console.log"><div>asdasd</div></selectableElement>
</template>