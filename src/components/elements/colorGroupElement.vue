<script setup lang="ts">
import { ColorGroup } from '@/utils/colors/ColorManagement';
import colorBlockElement from '@/components/elements/colorBlockElement.vue'
import toggleButton from '@/components/ui/toggleButton.vue'
import { useColorStore } from '@/stores/color'
import { useHistoryStore } from '@/stores/history';

import { ref, nextTick, computed, onMounted, triggerRef, reactive } from 'vue'
import { fail } from 'assert';

const colorStore = useColorStore()
const historyStore = useHistoryStore()

const props = defineProps({
    'group': ColorGroup,
    show_all:{
        type: Boolean,
        default: false
    }})

const group_name_input_ref = ref(null)

const editing_name = ref(false)

function activate_name_editing() {
    if (!props.group.is_default) {
        editing_name.value = true
        nextTick(() => group_name_input_ref.value.focus())
    }
}

function submit_name() {
    const name = group_name_input_ref.value.value
    const actionFeedback = historyStore.rename_group(props.group.name, name)
    if (actionFeedback.success) {
        reset()
    }
    else {
        feedback.value = actionFeedback
    }
}

function reset() {
    editing_name.value = false
    feedback.value = null
}

const displayed_group_name = computed(() => props.group.name !== '' ? props.group.name : 'Groupless Colors')
const feedback = ref(null)


</script>

<template>
            <div class="card container mb-2">
                <div class="card-header row"
                    :class="{rounded: !group.visibility}">
                    <div class="col-9 p-0 fs-6">
                        <div class="input-group group-name-container h-100" @click="activate_name_editing()">
                            <input ref="group_name_input_ref" type="text" class="form-control" :value="displayed_group_name" :disabled="!editing_name"
                            :class="{
                                'pl-2 disabled-name-input fs-5': !editing_name,
                                'group-name-input': !editing_name && !group.is_default,
                                'is-invalid': feedback && !feedback.success
                                }"
                            @keydown.enter="submit_name"
                            @focusout="reset">
                            <div class="input-group-text rounded-right" :class="{'group-name-icon-active': editing_name}"
                            v-if="!group.is_default" ><i class="bi bi-pen"></i></div>
                        </div>
                    </div>
                    <div v-if="!show_all" class="col-3" role="group" aria-label="Basic checkbox toggle button group">
                        <div class="btn-group group-menu">
                            <toggleButton v-model="group.visibility" :icons="['bi-caret-up', 'bi-caret-down']"></toggleButton>
                            <toggleButton v-model="group.visibility_colors" :icons="['bi-eye-fill', 'bi-eye-slash']"></toggleButton>
                        </div>
                    </div>
                <div class="row invalid-feedback text-danger" v-if="feedback && !feedback.success" style="display: block !important;">
                    {{ feedback.msg }}
                </div>
                </div>
                <div class="p-3" v-if="group.visibility">
                    <colorBlockElement v-for="(color, _) in group.colors" :key="colorStore.color_index(color)" :color="color"></colorBlockElement>
                </div>
            </div>
</template>

<style scoped>
.group-menu {
    float: right;
}
.disabled-name-input {
    padding: 0 0 0 15px !important;
    background-color: transparent !important;
    border-color: transparent !important;
}

.group-name-icon-active {
    color: var(--bs-dark) !important;
    border-color: var(--bs-dark) !important;
}

.group-name-icon-active i {
    color: var(--bs-dark) !important;
    border-color: var(--bs-dark) !important;
}

.group-name-container * {
    transition-duration: 0.2s;
}
.group-name-container div {
    border-color: transparent;
}

.group-name-container:hover div:first-of-type {
    cursor: pointer;
    border-color: var(--bs-dark) !important;
    transition-duration: 0.2s;
}

.group-name-container div:first-of-type {
    color: transparent !important;

}
.group-name-container:hover div:first-of-type {
    color: var(--bs-dark) !important;

}

.group-name-input:hover {
    border: solid 1px var(--bs-dark);
    border-color: var(--bs-dark) !important;
}
</style>