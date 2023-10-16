import { Ref, ref } from "vue"

function RGBtoHSL(RGB: [number, number, number]): [number, number, number] {
    // Convert RGB Color to HSL

    const rgb = <[number, number, number]>RGB.map(color => color/255)
    const hsl = rgbtohsl(rgb)
    const mult = [360, 100, 100]
    return <[number, number, number]>hsl.map((color, index) => color*mult[index])
    // return [H, S, L]
}

function rgbtohsl(rgb: [number, number, number]): [number, number, number] {
    const [r, g, b] = rgb
    const max = Math.max(...rgb)
    const index_max = rgb.indexOf(max)

    const min = Math.min(...rgb)


    const diff = max-min
    const sum = max+min
    const l = sum/2

    if (diff === 0) {
        // Gray tone
        var [s, h] = [0, 0]
    }
    else {
        // No gray tone
        var s = (l > 0.5) ? diff / (2 - sum) : diff / sum

        var h: number
        switch (index_max) {
            case 0: {
                h = (g-b)/diff
                break;
            }
            case 1: {
                h = 2 + (b-r)/diff
                break;
            }
            case 2: {
                h = 4 + (r-g)/diff
                break;
            }
        }
    }
    return [h, s, l]
}

export class Color {

    static colors: Ref<Array<Color>> = ref([])
    group: ColorGroup

    constructor(
        public RGBA: ColorArray, public xPos: Number, public yPos: Number,
        public hovered: Boolean = false, public selected: Boolean=false,
        public selectingCircle: Boolean = false,
        public selectingBlock: Boolean = false, public visible: Boolean = true,
        group_name: string = ''
        ) {
            Color.colors.value.push(this)
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

    get RGB(): [number, number, number] {
        return <[number, number, number]>this.RGBA.slice(0,3)
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
        return Color.colors.value.indexOf(this) 
    }

    delete(): void {
        // Remove color from color array
        Color.colors.value.splice(this.index, 1)
    }

}

export class ColorGroup {
    
    static groups: Ref<Array<ColorGroup>> = ref([])

    static exists(group_name: string): Boolean {
        // Check if group instance with name exists
        return this.group_names.includes(group_name)
    }

    static drop_empty_groups(): void {
        ColorGroup.groups.value.forEach((group, index, object) => {
            if (group.group_name !== '' && group.colors.length === 0) {
                object.splice(index, 1)
            }
        })
    }

    static get group_names() {
        // Return names of groups
        return this.groups.value.map(group => group.group_name)
    }

    static return_existing_group(group_name: string) {
        // Return group instance with same name
        return this.groups.value.find(group => group.group_name === group_name)
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
        ColorGroup.groups.value.push(this)
    }

    get index() {
        // Return color group index
        return ColorGroup.groups.value.indexOf(this)
    }

    get colors(): Array<Color> {
        // Get colors within this group
        return Color.colors.value.filter(color => color.group_name === this.group_name)
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
        ColorGroup.groups.value.splice(this.index, 1)
        this.colors.forEach(color => ColorGroup.add_to_group(color, ''))
    }

    delete_colors(): void {
        // Remove colors from color array
    }

    toString(): string {
        return this.group_name
    }
}

export type ColorArray = [number, number, number, number]