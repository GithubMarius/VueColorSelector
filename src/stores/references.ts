import { defineStore } from "pinia"

export const test = defineStore("references", {
    state: () => {
        return {
            references: []
        }
    }
})