import {ColorArray, ColorAlphaArray, RGBtoHSL} from './helpers'

export class Color {

    group: ColorGroup
    static colors: Array<Color> = []

    constructor(
        public RGBA: ColorAlphaArray, public xPos: Number, public yPos: Number,
        public hovered: Boolean = false, public selected: Boolean=false,
        public selectingCircle: Boolean = false,
        public selectingBlock: Boolean = false, public visible: Boolean = true,
        group_name: string = ''
        ) {
            Color.colors.push(this)
            this.group_name = group_name
        }
    
    get selecting() {
        return this.selectingCircle ||this.selectingBlock
    }

    set group_name(value: string) {
        ColorGroup.add_to_group(this, value)
    }

    get group_name(): string {
        return this.group.group_name
    }

    get RGB(): ColorArray {
        return <ColorArray>this.RGBA.slice(0,3)
    }


    get HSL(): [number, number, number] {
        return RGBtoHSL([...this.RGB])
    }

    get HSLA(): ColorArray {
        const HSLA: ColorArray|any = this.HSL
        HSLA.push(this.RGBA[3])
        return <ColorArray>HSLA
    }

    get lightness(): number {
        return this.HSL[2]
    }

    get css_bw_hsl(): string {
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

    get index() {
        // Return color index
        return Color.colors.indexOf(this) 
    }
}

export class ColorGroup {
    
    static groups: Array<ColorGroup> = []

    static exists(group_name: string): Boolean {
        // Check if group instance with name exists
        return this.group_names.includes(group_name)
    }

    static drop_empty_groups(): void {
        ColorGroup.groups.forEach((group, index, object) => {
            if (group.group_name !== '' && group.colors.length === 0) {
                object.splice(index, 1)
            }
        })
    }

    static get group_names() {
        // Return names of groups
        return this.groups.map(group => group.group_name)
    }

    static return_existing_group(group_name: string) {
        // Return group instance with same name
        return this.groups.find(group => group.group_name === group_name)
    }

    static add_to_group(color: Color, group_name: string) {
        // Set group of color to existing group/new group (if not one with same name exists) and drop empty groups
        color.group = this.get_group(group_name)
        color.group.colors.push(color)
        ColorGroup.drop_empty_groups()
    }

    static get_group(group_name: string) {
        /* Get group:
            1. If already with same name existing: return existing group instance
            2. If not: Create new group instance 
        */
        if (this.exists(group_name)) {
            return this.return_existing_group(group_name)
        } else {
            return new ColorGroup(group_name)
        }
    }

    constructor(public group_name: string, public visibility_group: Boolean = true, private _visibility_colors: Boolean = true) {
        ColorGroup.groups.push(this)
    }

    get index() {
        // Return color group index
        return ColorGroup.groups.indexOf(this)
    }

    get colors(): Array<Color> {
        // Get colors within this group
        return Color.colors.filter(color => color.group_name === this.group_name)
    }

    get colors_sorted(): Array<Color> {
        const colors = this.colors
        return this.sort_colors(colors)
    }

    sort_colors(colors: Array<Color>): Array<Color> {
        // Sort colors by lightness
        const indices = [...colors.keys()]
        const lightness = colors.map(color => color.lightness)
        indices.sort((a,b) => lightness[a]-lightness[b])
        return indices.map(index => colors[index])
    }

    set visibility_colors(value) {
        this._visibility_colors = value
        this.colors.forEach(color => color.visible = value)
    }

    get visibility_colors() {
        return this._visibility_colors
    }

    delete(): void{
        // Remove group from group array
        ColorGroup.groups.splice(this.index, 1)
        this.colors.forEach(color => ColorGroup.add_to_group(color, ''))
    }

    delete_colors(): void {
        // Remove colors from color array
    }

    toString(): string {
        return this.group_name
    }

}
