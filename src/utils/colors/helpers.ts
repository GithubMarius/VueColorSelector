import {Color} from "./ColorManagement"
import {formatCss} from '@/../node_modules/culori'

// Types
export type ColorArray = [number, number, number]
export type ColorAlphaArray = [number, number, number, number]

// Functions
export function RGBtoHSL(RGB: ColorArray): ColorArray {
    // Convert RGB color to HSL

    const rgb = <ColorArray>RGB.map(color => color / 255)
    const hsl = rgbtohsl(rgb)
    const mult = [360, 100, 100]
    return <ColorArray>hsl.map((color, index) => color * mult[index])
    // return [H, S, L]
}

export function rgbtohsl(rgb: ColorArray): ColorArray {
    // Convert rgb color to hsl
    const [r, g, b] = rgb
    const max = Math.max(...rgb)
    const index_max = rgb.indexOf(max)

    const min = Math.min(...rgb)


    const diff = max - min
    const sum = max + min
    const l = sum / 2

    if (diff === 0) {
        // Gray tone
        var [s, h] = [0, 0]
    } else {
        // No gray tone
        var s = (l > 0.5) ? diff / (2 - sum) : diff / sum

        var h: number
        switch (index_max) {
            case 0: {
                h = (g - b) / diff
                break;
            }
            case 1: {
                h = 2 + (b - r) / diff
                break;
            }
            case 2: {
                h = 4 + (r - g) / diff
                break;
            }
        }
    }
    return [h, s, l]
}

export const colorToType = {
    'okhcl': (color: Color) => color.culori_oklch,
    'hsl': (color: Color) => color.culori_hsl
}

export const colorToChromaOrSaturation = {
    'okhcl': (color: Color) => color.culori_oklch.c / .4,
    'hsl': (color: Color) => color.culori_hsl.s
}

export const colorToLightness = {
    'okhcl': (color: Color) => color.culori_oklch.l,
    'hsl': (color: Color) => color.culori_hsl.l
}

export const colorToGrayscale = {
    'okhcl': (color: Color) => formatCss({
        l: color.culori_oklch.l,
        c: 0,
        h: 0,
        mode: 'oklch'
    }),
    'hsl': (color: Color) => formatCss({
        h: 0,
        s: 0,
        l: color.culori_hsl.l,
        mode: 'hsl'
    })
}