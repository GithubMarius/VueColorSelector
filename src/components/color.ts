
export default class Color {
    rgba: ColorArray
    xPos: Number
    yPos: Number
    hovered: Boolean
    selected: Boolean
    selecting: Boolean
    group: string

    constructor(rgba: ColorArray, xPos: Number, yPos: Number,
        hovered: Boolean = false, selected: Boolean=false,  selecting: Boolean = false,
        group: string = '') {

        this.rgba = rgba
        this.xPos = xPos
        this.yPos = yPos
        this.hovered = hovered
        this.selected = selected
        this.selecting = selecting
        this.group = group

    }

    get css_rgba (): string {
        // CSS rgba color string
        return `rgba(${this.rgba})`
    }

    get css_rgb (): string {
        // CSS rgb color string
        return `rgba(${this.rgba.slice(0,3)})`
    }

    get css_xPos (): string {
        // Return xPos as string + 'px'
        return this.xPos + 'px'
    }

    get css_yPos (): string {
        // Return yPos as string + 'px'
        return this.yPos + 'px'
    }

}

export type ColorArray = [Number, Number, Number, Number]