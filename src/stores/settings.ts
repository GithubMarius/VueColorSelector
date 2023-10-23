import { Ref, ref } from "vue"
import { defineStore } from "pinia"


export class RangeValue {
    constructor(public label: string, public value: number, public min: number = 0, public max: number = 50, public step: number = 1) {}

    update_from_event(event) {
        // Input event handler
        this.value = event.target.value
    }
}

export class Radius extends RangeValue {

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
}

const allModifiers = {
    shift: 'shiftKey',
    alt: 'altKey',
    ctrl: 'ctrlKey',
    meta: 'metaKey'
}

const customModifiers = {
    shift: [allModifiers.shift],
    alt: [allModifiers.alt],
    cmd: [allModifiers.ctrl, allModifiers.meta]
}

class KeyCombination {
    default: Array<Array<string>>
    constructor(public key, public modifiers = []) {
        this.default = modifiers
    }
    is_pressed(event: KeyboardEvent) {
        // Check if key and correct modifiers are pressed
        return event.key === this.key && this.modifers_pressed(event)
    }

    private modifers_pressed(event: KeyboardEvent) {
        // Check if modifiers are pressed

        const pressed_modifiers = Object.values(allModifiers).filter(m => event[m]) // Filter for pressed modifers in of event
        return this.check_same_length(pressed_modifiers) && this.check_all_modifiers_pressed(pressed_modifiers) // Check modifiers align
    }

    private check_all_modifiers_pressed(pressed_modifiers: string[]) {
        // Check if every pressed modifier is also in necessary modifiers
        return pressed_modifiers.every(m => this.modifiers.some(ms => ms.includes(m)))
    }

    private check_same_length(pressed_modifiers: string[]) {
        // Check if the number of pressed modifiers is correct
        return pressed_modifiers.length === this.modifiers.length
    }
}

const keycombinations = {
    'undo': new KeyCombination('z', [customModifiers.cmd]),
    'forward': new KeyCombination('y', [customModifiers.cmd]),
    'toggle_theme': new KeyCombination('t', [])
}

export const useSettingsStore = defineStore("settings", {
    state: () => {
      return { 
        opacity: new RangeValue('Opacity', 1, 0, 1, 0.01),
        color_mode: true,
        color_circle_radius: new Radius('Color circle radius', 15),
        reference_circle_radius: new Radius('Reference circle radius', 8),
        scale: 0.5,
        bright: true,
        url: 'src/assets/Fritz.jpg',
        keycombinations: keycombinations
      }
    },
    getters: {
        theme() {
            return (this.bright) ? 'light' : 'dark'
        }
    }
  });