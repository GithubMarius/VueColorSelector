<script setup lang="ts">
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore()

</script>

<template>
    <div id="sideBySideViewerContainer" :hidden="!settingsStore.view_side_by_side.value">
            <div class="row">
                <div id="leftSideOfViewer" class="col"></div>
                <div id="rightSideOfViewer" class="col" :hidden="!settingsStore.captureVideo.value"></div>
            </div>
    </div>
</template>

<style>
#sideBySideViewerContainer {
    position: absolute;
    background-color: transparent;
    width: 100vw;
    height: 100vh;
    z-index: 100;
    background-color: var(--bs-body-bg);
    overflow-y: scroll;
    overflow-x: hidden;
}

#sideBySideViewerContainer div {
    position: relative;
    text-align: center;
    padding: 0px;
    height: auto;
}

#sideBySideViewerContainer canvas {
    position: relative;
}
</style>