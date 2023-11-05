import {defineStore} from "pinia"
import {Color} from "@/utils/colors/ColorManagement"
import {colorToChromaOrSaturation, colorToGrayscale, colorToLightness, colorToType} from "@/utils/colors/helpers"
import {
    BooleanProperty,
    BooleanPropertyWithIcons,
    BooleanPropertyWithSwitch,
    RadiusProperty,
    RangeProperty,
    SelectionProperty
} from "@/utils/properties"
import {customModifiers, KeyCombination} from "@/utils/keyboardinput"


const keyCombinations = {
    'change_image_opacity': new KeyCombination('-+', [customModifiers.cmd]),
    'export': new KeyCombination('e', [customModifiers.cmd]),
    'forward': new KeyCombination('y', [customModifiers.cmd]),
    'import': new KeyCombination('i', [customModifiers.cmd]),
    'open_tab': new KeyCombination('0123456789', [customModifiers.alt]),
    'toggle_cam': new KeyCombination('q', [customModifiers.cmd]),
    'toggle_color_group': new KeyCombination('0123456789', [customModifiers.cmd]),
    'toggle_color_mode': new KeyCombination('b', [customModifiers.cmd]),
    'toggle_preview': new KeyCombination('d', [customModifiers.cmd]),
    'toggle_split_mode': new KeyCombination('x', [customModifiers.cmd]),
    'toggle_theme': new KeyCombination('g', [customModifiers.cmd]),
    'undo': new KeyCombination('z', [customModifiers.cmd])
}

export const useSettingsStore = defineStore("settings", {
    state: () => {
        return {
            keyCombinations: keyCombinations,

            chrOrSat: new RangeProperty('Chroma/Saturation', 0.5, 0, 1, 0.01),
            color_mode: new BooleanProperty('Color/BW mode', true),
            colorspace: new SelectionProperty('Color space', ['okhcl', 'hsl']),
            colorsSortBy: new SelectionProperty('Sort colors by', ['Hue', 'Chroma/Saturation', 'Lightness'], 2),
            colorsOrderAscending: new BooleanProperty('Ascending', true),

            url: 'src/assets/YemiWallington.jpg',

            captureVideo: new BooleanPropertyWithIcons('Capture video', false, ['bi-camera-video', 'bi-camera-video-off'], 'danger'),

            ui: {
                light: new BooleanProperty('Light/Dark UI', true),
                hide_settings_column: new BooleanPropertyWithIcons('Hide side menu', false, ['bi-window', 'bi-window-sidebar'], 'warning'),
                split_mode: new BooleanProperty('Split mode', false),

                color_circle_radius: new RadiusProperty('Color circle radius', 15, 4, 50),
                reference_circle_radius: new RadiusProperty('Reference circle radius', 8, 2, 50),

                scale: new RangeProperty('Scale', 0.5, 0, 5, 0.01),
                opacity: new RangeProperty('Opacity', 1, 0, 1, 0.01),
                check_gamut: new BooleanPropertyWithSwitch('Mark colors outside of RGB gamut', true)

            },

            exportSettings: {
                export_images: new BooleanProperty('Export captured images', true),
                import_images: new BooleanProperty('Import captured images', true)
            },
            // Development
            // TODO: Check if used
            debug_mode: new BooleanProperty('Debug mode', true)
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
        get_grayScaledColor(color: Color) {
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
        },
        get_circle_radius() {
            return this.ui.color_circle_radius.value / this.ui.scale.value
        }

    },
    getters: {
        theme() {
            return (this.ui.light.value) ? 'light' : 'dark'
        }
    }
});