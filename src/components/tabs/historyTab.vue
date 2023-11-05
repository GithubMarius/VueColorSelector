<script setup lang="ts">
import {useHistoryStore} from '@/stores/history'

const historyStore = useHistoryStore()
</script>

<template>
  <div class="btn-group my-2 p-0">
    <button class="btn btn-primary" @click="historyStore.forward()" :disabled="!historyStore.forward_possible">Forward
    </button>
    <button class="btn btn-primary" @click="historyStore.undo()" :disabled="!historyStore.undo_possible">Undo</button>
  </div>
  <ul class="list-group p-0">
    <li class="list-group-item" v-for="(action, index) in historyStore.history"
        :class="{'fw-bold': index === historyStore.index}"> {{ action }}
    </li>
  </ul>
</template>