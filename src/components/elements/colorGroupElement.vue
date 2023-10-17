<script setup lang="ts">
import { ColorGroup } from '@/utils/colors/ColorManagement';
import colorBlockElement from '@/components/elements/colorBlockElement.vue'
import toggleButton from '@/components/ui/toggleButton.vue'
import { useGroupStore } from '@/stores/color'

import { ref, nextTick, computed, onMounted, triggerRef, reactive } from 'vue'

const groupStore = useGroupStore()

const props = defineProps({
    'group': ColorGroup,
    show_all:{
        type: Boolean,
        default: false
    }})

const group_name_input_ref = ref(null)

const editing_name = ref(false)

function activate_name_editing() {
    editing_name.value = true
    nextTick(() => group_name_input_ref.value.focus())   
}

function submit_name() {
    const name = group_name_input_ref.value.value
    groupStore.rename_group(props.group, name)
    editing_name.value = false
}

const displayed_group_name = computed(() => props.group.name !== '' ? props.group.name : 'Groupless Colors')

console.log(props.group)

</script>

<template>
            <div class="card container mb-2">
                <div class="card-header row"
                    :class="{rounded: !group.visibility}">
                    <div class="col-9 p-0 fs-6">
                        <div class="input-group h-100">
                            <div class="input-group-text rounded-left" :class="{'rounded': !editing_name}"  v-if="group.name !== ''" @click="activate_name_editing()" ><i class="bi bi-pen"></i></div>
                            <input ref="group_name_input_ref" type="text" class="form-control" :value="displayed_group_name" :disabled="!editing_name"
                            :class="{'p-0 disabled-name-input fs-5': !editing_name}"
                            @keydown.enter="submit_name"
                            @focusout="editing_name = false">
                        </div>
                    </div>
                    <div v-if="!show_all" class="col-3" role="group" aria-label="Basic checkbox toggle button group">
                        <div class="btn-group group-menu">
                            <toggleButton v-model="group.visibility" :icons="['bi-caret-up', 'bi-caret-down']"></toggleButton>
                            <toggleButton v-model="group.visibility_colors" :icons="['bi-eye-fill', 'bi-eye-slash']"></toggleButton>
                        </div>
                    </div>
                </div>
                <div class="p-3" v-if="group.visibility">
                    <colorBlockElement v-for="(color, index) in group.colors" :key="index" :color="color"></colorBlockElement>
                </div>
            </div>
</template>

<style>
.group-menu {
    float: right;
}
.disabled-name-input {
    padding-left: 15px !important;
    background-color: transparent !important;
    border-color: transparent !important;
}
</style>