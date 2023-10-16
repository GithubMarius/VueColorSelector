import { Ref, ref } from "vue"
import { defineStore } from "pinia"
import { Color, ColorArray } from "../components/color"

export class Radius {
    constructor(public label, public value: number, public min: number = 0, public max: number = 50) {}

    get css_diameter() {
        // Return css diameter
        return this.value * 2 + 'px'
    }

    get css_size() {
        // Return width & height properties
        return {
            width: this.css_diameter,
            height: this.css_diameter
        }
    }

    update_from_event(event) {
        // Input event handler
        this.value = event.target.value
    }
}

export const useSettingsStore = defineStore("settings", {
    state: () => {
      return { 
        opacity: 1,
        color_mode: true,
        color_circle_radius: new Radius('Color circle radius', 15),
        reference_circle_radius: new Radius('Reference circle radius', 8),
        scale: 0.5,
        theme: 'light',
        bright: true,
        url: 'src/assets/Fritz.jpg'
      }
    }
  });