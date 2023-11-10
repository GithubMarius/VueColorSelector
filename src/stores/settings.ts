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
import {customModifiers, KeyCombinationWithInfo, specialKeys} from "@/utils/keyboardinput"


const keyCombinations = {
    'undo': new KeyCombinationWithInfo('z', [customModifiers.cmd], 'Undo'),
    'forward': new KeyCombinationWithInfo('y', [customModifiers.cmd], 'Redo'),
    'change_image_opacity': new KeyCombinationWithInfo(specialKeys.plusMinus, [customModifiers.cmd]),
    'open_file': new KeyCombinationWithInfo('o', [customModifiers.cmd], 'Open image'),
    'export': new KeyCombinationWithInfo('e', [customModifiers.cmd], 'Export color points and captured images (if option set)'),
    'import': new KeyCombinationWithInfo('i', [customModifiers.cmd], 'Import color points and captured images (if option set)'),
    'open_tab': new KeyCombinationWithInfo(specialKeys.number, [customModifiers.alt], 'Open nth tab'),
    'toggle_cam': new KeyCombinationWithInfo('q', [customModifiers.cmd], 'Activate camera'),
    'toggle_color_group': new KeyCombinationWithInfo(specialKeys.number, [customModifiers.cmd], 'Toggle visibility of nth color group (0th: colors without group)'),
    'toggle_color_mode': new KeyCombinationWithInfo('b', [customModifiers.cmd], 'Toggle color mode'),
    'toggle_preview': new KeyCombinationWithInfo('d', [customModifiers.cmd], 'Toggle preview mode'),
    'toggle_split_mode': new KeyCombinationWithInfo('x', [customModifiers.cmd], 'Toggle split screen mode'),
    'toggle_theme': new KeyCombinationWithInfo('g', [customModifiers.cmd], 'Toggle theme (light/dark)'),
    'show_keyboard_shortcuts': new KeyCombinationWithInfo('k', [customModifiers.cmd], 'Show keyboard shortcuts'),
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

            url: 'YemiWallington.jpg',

            captureVideo: new BooleanPropertyWithIcons('Capture video', false, ['bi-camera-video', 'bi-camera-video-off'], 'danger'),

            ui: {
                show_short_cuts: new BooleanPropertyWithIcons('Show shortcuts', false, ['bi-keyboard', 'bi-keyboard'], 'secondary'),
                light: new BooleanProperty('Light/Dark UI', true),
                hide_settings_column: new BooleanPropertyWithIcons('Hide side menu', false, ['bi-window', 'bi-window-sidebar'], 'secondary'),
                split_mode: new BooleanPropertyWithIcons('Split mode', false, ['bi-window-split', 'bi-window'], 'secondary'),

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