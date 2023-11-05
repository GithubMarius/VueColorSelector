<script setup lang="ts">
import {ref} from 'vue';

// Tabs
import GroupedColorsTab from '@/components/tabs/GroupedColorsTab.vue'
import HistoryTab from '@/components/tabs/HistoryTab.vue'
import ImportExportTab from '@/components/tabs/ImportExportTab.vue'

// import ReferenceTab from '@/components/tabs/ReferencesTab.vue'
import SettingsTab from '@/components/tabs/SettingsTab.vue'
import CapturedImagesTab from '@/components/tabs/CapturedImagesTab.vue'

// ColorViewer
import ColorViewer from '@/components/ColorViewer.vue'

// Stores
import {useSettingsStore} from '@/stores/settings'
import {useToolsStore} from "@/stores/tools";
import {useReferenceStore} from "@/stores/references";

const settingsStore = useSettingsStore()

// Create tabs object
const tabs = {
  active_tab_id: ref(0),
  tab_buttons: ref(0),
  list:
      {
        'Captured Images': CapturedImagesTab,
        'Colors': GroupedColorsTab,
//      'References': ReferenceTab,
    'Settings': SettingsTab,
    'Import/Export': ImportExportTab,
    'History': HistoryTab,
  },
  open_tab(index: number) {
    if ([...this.tab_buttons.value.keys()].includes(index)) {
      this.active_tab_id.value = index
    }
  }
}

// Go to tab
settingsStore.keyCombinations.open_tab.bind((event) => {
  tabs.open_tab(Number(event.key) - 1)
  event.preventDefault()
})

const toolStore = useToolsStore()

const referenceStore = useReferenceStore()
</script>

<template>
  <div id="settings-column" class="overflow-auto p-0 min-vh-100 mw-20 bg-body-tertiary"
       :class="[!settingsStore.ui.hide_settings_column.value? 'col-4' : 'd-none']">
    {{ referenceStore.points.length }}
    <div class="row">
      <!-- Color viewer -->
      <ColorViewer></ColorViewer>
    </div>
    <div class="row mt-4">
      <!-- Tab-Selection -->
      <nav>
        <div class="nav nav-pills px-2" id="nav-tab" role="tablist">
          <button :ref="tabs.tab_buttons" v-for="(tab, index) in Object.keys(tabs.list)" :key="index"
                  class="nav-link"
                  :class="{active: tabs.active_tab_id.value === index}"
                  @click="tabs.active_tab_id.value = index">{{ tab }}
          </button>
        </div>
      </nav>
    </div>
    <div class="row m-2 p-2 tab-content" id="nav-tabContent">
      <!-- Tabs -->
      <component :is="Object.values(tabs.list)[tabs.active_tab_id.value]"></component>
    </div>
  </div>
</template>

<style scoped>
#settings-column {
  height: fit-content;
}

</style>