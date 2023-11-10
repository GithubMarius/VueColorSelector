<script setup lang="ts">
import {useToolsStore} from '@/stores/tools'

const toolStore = useToolsStore()
</script>


<template>
  <div class="row w-100 vh-100 m-0 position-relative" ondragstart="return false;" ondrop="return false;">
    <div>
      <!--             <Transition @after-enter="groupNameInputRef.focus()">
                      <div class="position-absolute rounded group-name-input-div" v-if="numberSelectedEntries > 0">
                          <input ref="groupNameInputRef" id="groupName" class="form-control" type="text" placeholder="GROUP NAME"
                          @click.prevent
                          @keydown.stop
                          @keypress.stop
                          @keyup.enter="update_selection_groups"
                          @keyup.esc="abort_rename"
                          >
                      </div>
                  </Transition> -->
    </div>
    <slot>
    </slot>
    <div class="point" :style="(<any>toolStore.selectionTool).end.style" v-if="toolStore.selectionTool.visible"></div>
    <div id="rectangular-selection" :style="toolStore.selectionTool.style">
    </div>
  </div>
</template>

<style scoped>
.point {
  z-index: 20;
  border-radius: 50%;
  position: absolute;
  width: 3px;
  height: 3px;
  padding: 0;
  background-color: var(--bs-dark);
  opacity: 0.5;
  transform: translate(-50%, -50%);
}

#rectangular-selection {
  z-index: 15;
  position: absolute;
  padding: 0;
  background-color: transparent;
  border: 1px dashed black;
}

.group-name-input-div {
  z-index: 20;
  top: 10px;
  left: 50%;
  transform: translateX(-50%)
}
</style>