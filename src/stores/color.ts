import { defineStore } from "pinia";

export const useColorStore = defineStore("color", {
  state: () => {
    return { 
      colors: [],
      groups: []
    }
  },
  actions: {
    increment(value = 1) {
      this.colors.push(value)
    },
  },
  getters: {
  },
});

/*


const colorModule = {
    state: () => ({
      colors: [],
      groups: []
    }),
    mutations: {
      increment (state) {
        // `state` is the local module state
        state.colors.push(1)
      }
    },
    getters: {
      test(state) {
        return state.colors
      }
    }
  }



*/