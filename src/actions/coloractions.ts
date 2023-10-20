import { isReactive } from "vue";
import { useColorStore, useGroupStore } from "@/stores/color";
import { mouseCoordinates, canvas_position_from_event, get_pixel_color } from "@/utils/general";
import { ColorAlphaArray } from "@/utils/colors/helpers"
import { Action, ActionInterface } from "@/utils/action"
import { Color, ColorGroup } from "@/utils/colors/ColorManagement";


export class CreateColorAction extends Action {
    // Create color/undo creation

    index: number
    xy: mouseCoordinates
    pixelData: ColorAlphaArray

    constructor(event: MouseEvent) {
        // Retrieve position and pixeldata of the point
        super(event)
        this.xy = canvas_position_from_event(event)
        this.pixelData = get_pixel_color(...this.xy)
    }

    override forward() {
        // Create color
        const colorStore = useColorStore()
        this.index = colorStore.create_color(this.pixelData, ...this.xy, '')
    }

    override undo() {
        // Remove color
        const colorStore = useColorStore()
        colorStore.delete_color_by_index(this.index)
    }

    toString() {
        // Return string representation
        return `Added color point. (Index: ${this.index})`
    }

}

export class DeleteColorAction extends Action implements ActionInterface {
    // Delete color/undo deletion

    index: number
    xy: mouseCoordinates
    pixelData: ColorAlphaArray
    group_name: string

    constructor(color: Color) {
        super()
        
        // Read out necessary data to recreate color
        const colorStore = useColorStore()
        this.index = colorStore.color_index(color)
        this.pixelData = [...color.RGBA]
        this.xy = [color.xPos, color.yPos]
        this.group_name = color.group.name
    }

    forward() {
        // Remove color
        const colorStore = useColorStore()
        colorStore.delete_color_by_index(this.index)
    }

    undo() {
        // Create color again
        const colorStore = useColorStore()
        colorStore.create_color(this.pixelData, ...this.xy, this.group_name, this.index)
    }

    toString() {
        return `Deleted color point. Index: ${this.index})`
    }

}
export class AddSelectionToGroup extends Action {
    // Add selected colors to group/undo movement to groups

    indices: number[]
    previous_groups: string[]

    constructor(public new_group_name: string) {
        super()
        const colorStore = useColorStore()
        this.indices = colorStore.selected_color_ids // Remember ids of selected colors
    }

    forward() {
        // Move colors to group
        const colorStore = useColorStore()
        const colors =  this.indices.map(index => colorStore.colors[index])
        this.previous_groups = colors.map(color => color.group.name)
        colorStore.move_colors_to_group_by_name(this.new_group_name, colors)
    }

    undo() {
        // Return colors to their preivous groups
        const colorStore = useColorStore()
        const colors =  this.indices.map(index => colorStore.colors[index])
        colorStore.move_colors_to_groups_by_names(this.previous_groups, colors)
    }
    toString() {
        return `Moving colors to group "${this.new_group_name}."`
    }

}


export class RenameGroup extends Action {
    // Name/rename group

    constructor(public previous_name: string, public new_name:string) {
        super()
        const groupStore = useGroupStore()
        if (groupStore.exists(new_name)) {
            throw new Error('Group name already used.')
        }
    }

    forward() {
        const groupStore = useGroupStore()
        const group = groupStore.get_group_by_name(this.previous_name)
        groupStore.rename_group(group, this.new_name)
    }

    undo() {
        const groupStore = useGroupStore()
        const group = groupStore.get_group_by_name(this.new_name)
        groupStore.rename_group(group, this.previous_name)
    }

    toString() {
        return `Renamed group "${this.previous_name}" to "${this.new_name}".`
    }

}