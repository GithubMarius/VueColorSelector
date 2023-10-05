<script setup lang="ts">
import { Color, ColorGroup } from './color';
import colorBlockElement from './colorBlockElement.vue'

import { ref, nextTick, computed, onMounted, triggerRef } from 'vue'


const props = defineProps({
    'group': ColorGroup,
    show_all:{
        type: Boolean,
        default: false
    }})

const group_name_input_ref = ref(null)

const editing_name = ref(false)

//editing_name != editing_name
const show_colors = ref(true)

function activate_name_editing() {
    editing_name.value = true
    nextTick(() => group_name_input_ref.value.focus())   
}

function submit_name() {
    const group_name = group_name_input_ref.value
    if (!ColorGroup.exists(group_name)) {
        props.group.group_name = group_name_input_ref.value.value
    }
    editing_name.value = false
}

</script>

<template>
    <div class="container">
        <div class="bg-light p-2 row">
            <div class="col-9">
                <div class="input-group">
                <input ref="group_name_input_ref" type="text" class="form-control" :value="group.group_name" :disabled="!editing_name"
                @keydown.enter="submit_name"
                @focusout="editing_name = false">
                <div class="input-group-text"  @click="activate_name_editing()" ><i class="bi bi-pen"></i></div>
                </div>
            </div>
            <div v-if="!show_all" class="col-3" role="group" aria-label="Basic checkbox toggle button group">
                <div class="btn-group group-menu">
                    <input type="checkbox" class="btn-check" autocomplete="off">
                    <label class="btn btn-outline-primary"
                    @click="group.toggle_group_visibility()"><i class="bi" :class="[group.visibility_group ? 'bi-caret-up' : 'bi-caret-down']"></i>
                    </label>
                    <input type="checkbox" class="btn-check" autocomplete="off">
                    <label class="btn btn-outline-pri"
                    @click="group.toggle_colors_visibility()"><i class="bi" :class="[show_colors ? 'bi-eye-fill' : 'bi-eye-slash']"></i>
                    </label>
                </div>
            </div>
        </div>
        <div v-if="group.visibility_group">
            <colorBlockElement v-for="(color, index) in group.colors" :key="index" :color="color"></colorBlockElement>
        </div>
    </div>
</template>

<style>
.group-menu {
    float: right;
}
</style>