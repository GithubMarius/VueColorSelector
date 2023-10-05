import { ShallowRef, shallowRef, Ref, ref } from "vue"

export class Color {

    static colors: Ref<Array<Color>> = ref([])
    group: ColorGroup

    constructor(
        public rgba: ColorArray, public xPos: Number, public yPos: Number,
        public hovered: Boolean = false, public selected: Boolean=false,  public selecting: Boolean = false, public visible: Boolean = true,
        group_name: string = ''
        ) {
            Color.colors.value.push(this)
            this.group_name = group_name
        }

    set group_name(value: string) {
        console.log(ColorGroup.groups)
        ColorGroup.add_to_group(this, value)
    }

    get group_name(): string {
        return this.group.group_name
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

    static get group_names() {
        // Return names of groups
        return this.groups.value.map(group => group.group_name)
    }

    static return_existing_group(group_name: string) {
        // Return group instance with same name
        return this.groups.value.find(group => group.group_name === group_name)
    }

    static add_to_group(color: Color, group_name: string) {
        // Set group of color to existing group/new group (if not one with same name exists)
        color.group = this.get_group(group_name)
        color.group.colors.push(color)
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

    constructor(public group_name: string, public visibility_group: Boolean = true, public visibility_colors: Boolean = true) {
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

    toggle_group_visibility(): void {
        // Toggle visibility of group container
        this.visibility_group = !this.visibility_group
    }

    toggle_colors_visibility(): void {
        // Toggle visibility of colors in group
        this.visibility_colors != this.visibility_colors
        this.colors.forEach(color => color.visible = !color.visible)
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

export type ColorArray = [Number, Number, Number, Number]