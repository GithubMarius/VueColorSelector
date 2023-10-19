<script setup lang="ts">
import { StyleValue, ref } from 'vue'
import { useHistoryStore } from '@/stores/history'

console.log( useHistoryStore)
const historyStore = useHistoryStore()
console.log(historyStore)
</script>

<template>
    <div class="btn-group my-2 p-0">
        <button class="btn btn-primary" @click="historyStore.forward()" :disabled="!historyStore.forward_possible">Forward</button>
        <button class="btn btn-primary" @click="historyStore.undo()" :disabled="!historyStore.undo_possible">Undo</button>
    </div>
    <ul class="list-group p-0">    
        <li class="list-group-item" v-for="(action, index) in historyStore.history" :class="{'fw-bold': index === historyStore.index}"> {{ action }}</li>
    </ul>
</template>