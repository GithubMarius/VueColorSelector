<script setup lang="ts">
import {useSettingsStore} from "@/stores/settings";

const settingsStore = useSettingsStore()
</script>

<template>
  <transition>
    <div class="modal fade d-block show bg-opacity-25 bg-body-tertiary" id="exampleModal" tabindex="-1"
         aria-labelledby="exampleModalLabel" aria-hidden="true"
         v-if="settingsStore.ui.show_short_cuts.value"
         @click="settingsStore.ui.show_short_cuts.value = false">
      <div class="modal-dialog" @click.stop>
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Active keyboard shortcuts</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                    @click="settingsStore.ui.show_short_cuts.value = false"></button>
          </div>
          <div class="modal-body">
            ... Nice ...
          </div>
          <div class="modal-footer">
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>