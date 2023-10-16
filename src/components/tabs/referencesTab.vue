<script setup lang="ts">

import { ref } from 'vue';
import toggleButton from '../ui/toggleButton.vue'
import switchButton from '../ui/switchButton.vue'
import formGroup from '../ui/formGroup.vue'


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
        <span class="form-group row p-4">
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
    <div class="card p-0 mt-3">
        <div class="card-header">Visibility</div>
        <span class="form-group row p-4">
            <formGroup :label="'Digital'">
                <switchButton v-model="referenceToolRef.show_digital"></switchButton>
            </formGroup>
            <formGroup :label="'Real'">
                <switchButton v-model="referenceToolRef.show_real"></switchButton>
            </formGroup>
        </span>
    </div>
    <ul class="list-group p-0 mt-2">
        <li class="list-group-item" v-for="(pair, _) in referenceToolRef.pairs">{{ pair.length_org.toFixed(2) }}<span class="btn-group float-end">
            <toggleButton v-model="pair.visible" :icons="['bi-eye-fill', 'bi-eye-slash']"></toggleButton>
            <button class="btn btn-danger bi bi-trash" @click="referenceToolRef.remove_pair(pair)"></button>
        </span></li>
    </ul>
</template>