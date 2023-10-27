<script setup lang="ts">
import colorGroupElement from '@/components/elements/colorGroupElement.vue'
import { useColorStore } from '@/stores/color'
import cardContainer from '@/components/ui/cardContainer.vue'
import formGroup from '@/components/ui/formGroup.vue'
import toggleGroup from '@/components/ui/toggleGroup.vue'
import toggleButton from '@/components/ui/toggleButton.vue'
import { useSettingsStore } from '@/stores/settings'

const settingsStore = useSettingsStore()

// Stores
const colorStore = useColorStore()

</script>

<template>
<cardContainer>
    <template #header>
        <span class="fs-5">Preferences</span>
    </template>
    <template #content>
        <formGroup :label="settingsStore.colorsSortBy.label">
            <toggleGroup v-model="settingsStore.colorsSortBy.value" :options="settingsStore.colorsSortBy.options"></toggleGroup>
        </formGroup>
        <formGroup :label="'Color order'">
            <toggleButton v-model="settingsStore.colorsOrderAscending.value" :icons="['bi-arrow-up-right', 'bi-arrow-down-right']" :labels="[' Ascending', ' Descending']"></toggleButton>
        </formGroup>
    </template>
</cardContainer>
<colorGroupElement v-for="(group, index) in colorStore.groups" :key="index" :group="<any>group"></colorGroupElement>
</template>