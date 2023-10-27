import { Ref, ref } from "vue"
import { defineStore } from "pinia"
import { isStringObject } from "util/types"
import { Color } from "@/utils/colors/ColorManagement"
import { colorToChromaOrSaturation, colorToLightness, colorToGrayscale, colorToType } from "@/utils/colors/helpers"

interface SettingsProperty {
    label: string
    value: any
}

export class BooleanValue implements SettingsProperty {
    constructor(public label: string, public value: Boolean = true) {}

    toggle() {
        this.value = !this.value
    }
}


export class RangeValue implements SettingsProperty {
    constructor(public label: string, public value: number, public min: number = 0, public max: number = 50, public step: number = 1) {}

    update_from_event(event) {
        // Input event handler
        this.value = event.target.value
    }
}

export class Radius extends RangeValue implements SettingsProperty {

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

export class Selection implements SettingsProperty {
    constructor(public label: string, public options: Array<string>, public current_index: number = 0) {}

    get value () {
        return this.options[this.current_index]
    }
    
    set value (value: string) {
        this.current_index = this.options.indexOf(value)
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

export class KeyCombination {
    default: Array<Array<string>>
    static bound_combinations = []
    _fcn: Function

    static check_bound_combinations(event: KeyboardEvent) {
        // Check if key combination is already bound to function call
        this.bound_combinations.forEach(comb => comb.call_if_pressed(event))
    }

    constructor(public key, public modifiers = []) {
        this.default = modifiers
    }
    is_pressed(event: KeyboardEvent) {
        // Check if key and correct modifiers are pressed
        return event.key !== '' && this.key.includes(event.key) && this.modifers_pressed(event)
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

    bind(fcn: Function) {
        KeyCombination.bound_combinations.push(this)
        this._fcn = fcn
    }

    call_if_pressed(event: KeyboardEvent) {
        if (this.is_pressed(event)) {
            this._fcn(event)
        }
    }
}

const keycombinations = {
    'undo': new KeyCombination('z', [customModifiers.cmd]),
    'forward': new KeyCombination('y', [customModifiers.cmd]),
    'toggle_theme': new KeyCombination('g', [customModifiers.cmd]),
    'toggle_color_group': new KeyCombination('0123456789', [customModifiers.cmd]),
    'open_tab': new KeyCombination('0123456789', [customModifiers.alt]),
    'import': new KeyCombination('i', [customModifiers.cmd]),
    'export': new KeyCombination('e', [customModifiers.cmd]),
    'toggle_cam': new KeyCombination('q', [customModifiers.cmd]),
    'toggle_color_mode': new KeyCombination('b', [customModifiers.cmd]),
    'change_image_opacity': new KeyCombination('-+', [customModifiers.cmd]),
    'toggle_preview': new KeyCombination('d', [customModifiers.cmd])
}

export const useSettingsStore = defineStore("settings", {
    state: () => {
      return {
        chrOrSat: new RangeValue('Chroma/Saturation', 0.5, 0, 1, 0.01),
        opacity: new RangeValue('Opacity', 1, 0, 1, 0.01),
        color_mode: new BooleanValue('Color/BW mode', true),
        color_circle_radius: new Radius('Color circle radius', 15),
        reference_circle_radius: new Radius('Reference circle radius', 8),
        colorspace: new Selection('Color space', ['okhcl', 'hsl']),
        colorsSortBy: new Selection('Sort colors by', ['Hue', 'Chroma/Saturation', 'Lightness'], 2),
        colorsOrderAscending: new BooleanValue('Ascending', true),
        scale: 0.5,
        light: new BooleanValue('Light/Dark UI', true),
        url: 'src/assets/Fritz.jpg',
        keycombinations: keycombinations,
        view_side_by_side: new BooleanValue('View side by side', true),
        captureVideo: new BooleanValue('Capture video', false),
        exportSettings: {
            export_images: new BooleanValue('Export images', true),
            import_images: new BooleanValue('Import images', true)
        }
      }
    },
    actions: {
        set_chrOrSat(color: Color) {
            this.chrOrSat.value = this.get_chrOrSatOfColor(color)
        },
        get_hueOfColor(color: Color): number {
            return colorToType[this.colorspace.value](color).h
        },
        get_chrOrSatOfColor(color: Color): number {
            return colorToChromaOrSaturation[this.colorspace.value](color)
        },
        get_lightnessOfColor(color: Color): number {
            return colorToLightness[this.colorspace.value](color)
        },
        get_grayscaledColor(color: Color) {
            return colorToGrayscale[this.colorspace.value](color)
        },
        get_color_sorting_value(color: Color): number {
            switch (this.colorsSortBy.value) {
                case('Hue'): {
                    return this.get_hueOfColor(color)
                }
                case('Chroma/Saturation'): {
                    return -this.get_chrOrSatOfColor(color)
                }
                case('Lightness'): {
                    return this.get_lightnessOfColor(color)
                }
            } 
        }

    },
    getters: {
        theme() {
            return (this.light.value) ? 'light' : 'dark'
        }
    }
  });