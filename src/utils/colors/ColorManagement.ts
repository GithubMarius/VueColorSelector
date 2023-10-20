import {ColorArray, ColorAlphaArray, RGBtoHSL} from '@/utils/colors/helpers'

export class Color {
    // Color

    constructor(
        public RGBA: ColorAlphaArray, public xPos: number, public yPos: number, public group: ColorGroup,
        public hovered: Boolean = false, public selected: Boolean=false,
        public selectingCircle: Boolean = false,
        public selectingBlock: Boolean = false) {
            this.group.add_color(this)
        }
    
    get selecting() {
        // True if either related circle or block is inside current temporary selection
        return this.selectingCircle || this.selectingBlock
    }

    get RGB(): ColorArray {
        // Get RGB array
        return <ColorArray>this.RGBA.slice(0,3)
    }


    get HSL(): [number, number, number] {
        // Get HSL array
        return RGBtoHSL([...this.RGB])
    }

    get HSLA(): ColorArray {
        // Get HSLA array
        const HSLA: ColorArray|any = this.HSL
        HSLA.push(this.RGBA[3])
        return <ColorArray>HSLA
    }

    get lightness(): number {
        // Get lightness
        return this.HSL[2]
    }

    get css_bw_hsl(): string {
        // Color as greytone (based on lightness)
        return `hsla(0 0% ${this.lightness}%)`
    }

    get css_rgba(): string {
        // CSS rgba color string
        return `rgba(${this.RGBA})`
    }

    get css_rgb(): string {
        // CSS rgb color string
        return `rgb(${this.RGBA.slice(0,3)})`
    }

    get css_xPos(): string {
        // Return xPos as string + 'px'
        return this.xPos + 'px'
    }

    get css_yPos(): string {
        // Return yPos as string + 'px'
        return this.yPos + 'px'
    }

    get visible() {
        // Return whether own group is currently visible (if not color won't displayed)
        return this.group.visibility_colors
    }

    change_group(group) {
        // Move to new group
        this.group.move_color_to_group(this, group)
    }

    drop_from_group() {
        // Drop from group colors of own group
        this.group.drop(this)
    }
}

export class ColorGroup {

    constructor(public name: string = '', public colors: Array<Color> = [], public visibility=true, public visibility_colors: Boolean = true) {}

    get is_default() {
        // Check if default group (nameless group)
        return this.name === ''
    }

    add_color(color) {
        // Add color to own group colors
        this.colors.push(color)
    }

    move_color_to_group(color: Color, group: ColorGroup) {
        // Remove color from own group colors and add to provided group colors
        this.drop(color)
        color.group = group
        group.add_color(color)
    }

    drop(color: Color) {
        // Remove color from own group colors
        const index = this.colors.indexOf(color)
        this.colors.splice(index, 1)
    }

    get num_colors() {
        // Return number of colors
        return this.colors.length
    }

}
