import {useColorStore, useGroupStore} from "@/stores/color";
import {canvas_container_position_from_event, get_pixel_color, pointCoordinates} from "@/utils/general";
import {ColorAlphaArray} from "@/utils/colors/helpers"
import {Action, ActionInterface} from "@/utils/action"
import {Color, ColorDataInterface} from "@/utils/colors/ColorManagement";

class CreateColorBaseAction extends Action {
    index: number

    constructor(public RGBA: ColorAlphaArray, public xy: pointCoordinates, public groupname: string = '') {
        super()
    }

    override forward() {
        // Create color
        const colorStore = useColorStore()
        this.index = colorStore.create_color(this.RGBA, ...this.xy, this.groupname)
    }

    override undo() {
        // Remove color
        const colorStore = useColorStore()
        colorStore.delete_color_by_index(this.index)
    }

    toString() {
        // Return string representation
        return `Added color point.`
    }

}


export class CreateColorAction extends CreateColorBaseAction {
    // Create color/undo creation

    constructor(event: MouseEvent) {
        // Retrieve position and pixeldata of the point
        const xy = canvas_container_position_from_event(event)
        const RGBA = get_pixel_color(...xy)
        super(RGBA, xy)
    }

    override forward() {
        // Create color
        const colorStore = useColorStore()
        this.index = colorStore.create_color(this.RGBA, ...this.xy, '')
    }

    override undo() {
        // Remove color
        const colorStore = useColorStore()
        colorStore.delete_color_by_index(this.index)
    }

    toString() {
        // Return string representation
        return `Added color point.`
    }

}

export class ImportColors extends Action {
    // Import colors given in colorDataArray

    actions: CreateColorBaseAction[] = []

    constructor(public colorDataArray: ColorDataInterface[]) {
        super()
        colorDataArray.forEach(colorData => this.actions.push(new CreateColorBaseAction(colorData.RGBA, [colorData.xPos, colorData.yPos], colorData.groupname)))
    }

    override forward() {
        // Add colors
        this.actions.forEach(action => action.forward())
    }

    override undo() {
        // Remove colors in reversed order
        this.actions.reverse()
        this.actions.forEach(action => action.undo())
        this.actions.reverse()
    }

    toString() {
        return `Imported ${this.actions.length} color points.`
    }
}

export class DeleteColorAction extends Action {
    // Delete color/undo deletion

    index: number
    xy: pointCoordinates
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
        return `Deleted color point.`
    }

}

export class DeleteMultipleColors extends Action {
    // Delete several colors at once

    actions: DeleteColorAction[] = []

    constructor(public colors: Color[]) {
        super()

        colors.reverse()
        colors.forEach(color => this.actions.push(new DeleteColorAction(color)))
    }

    override forward() {
        // Add colors
        this.actions.forEach(action => action.forward())
    }

    override undo() {
        // Remove colors in reversed order
        this.actions.reverse()
        this.actions.forEach(action => action.undo())
        this.actions.reverse()
    }

    toString() {
        return `Deleted selected points.`
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
        const colors = this.indices.map(index => colorStore.colors[index])
        this.previous_groups = colors.map(color => color.group.name)
        colorStore.move_colors_to_group_by_name(this.new_group_name, colors)
    }

    undo() {
        // Return colors to their previous groups
        const colorStore = useColorStore()
        const colors = this.indices.map(index => colorStore.colors[index])
        colorStore.move_colors_to_groups_by_names(this.previous_groups, colors)
    }
    toString() {
        return `Moved colors to group "${this.new_group_name}."`
    }

}


export class RenameGroup extends Action {
    // Name/rename group

    constructor(public previous_name: string, public new_name: string) {
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