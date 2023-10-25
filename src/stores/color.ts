import { defineStore } from "pinia";
import { Color, ColorDataInterface, ColorGroup } from '../utils/colors/ColorManagement'
import { canvas_position_from_event, get_pixel_color } from '../utils/general'


export const useColorStore = defineStore('color', {
  state: () => {
    return {
      colors: <Array<Color>>[],
      groupStore: useGroupStore()
    }
  },
  actions: {
    color_from_event(event) {
      // Create color from event
      const [pixelData, x, y] = this.color_data_from_event(event)
      return this.create_color(pixelData, x, y, '')
    },
    color_data_from_event(event) {    
      // Get color data from event data  
      const [x, y] = canvas_position_from_event(event)
      const pixelData = get_pixel_color(x, y)
      return [pixelData, x, y]
    },

    delete_color_by_index(index: number) {
      // Remove color at given index
      const color = this.colors[index]
      this.groupStore.drop_color_from_group(color)
      this.colors.splice(index, 1)
    },

    delete_color(color: Color) {
      // Delete color
      const index = this.colors.indexOf(color)
      this.color_delete_by_index(index)
    },
    color_unhover_all() {
      this.colors.forEach(color => color.hovered = false)
    },
    color_hover(color: Color) {
      this.color_unhover_all()
      color.hovered = true
    },
    move_colors_to_group_by_name(name, colors: Array<Color>) {
      const group = this.groupStore.get_group(name)
      colors.forEach(
        color => color.change_group(group)
      )
      this.groupStore.remove_empty_groups()

    },
    move_colors_to_groups_by_names(group_names: Array<string>, colors: Array<Color>) {
      group_names.forEach((name, index) => colors[index].change_group(this.groupStore.get_group(name)))
      this.groupStore.remove_empty_groups()
    },
    move_selected_colors_to_group(name) {
      const selected_colors = this.selected_colors
      this.move_colors_to_group(name, selected_colors)
    },
    color_index(color) {
      return this.colors.indexOf(color)
    },
    drop_selection() {
      this.colors.forEach(color => color.selected = false)
    },
    create_color(pixelData, x, y, groupname, index=this.colors.length) {
      const group = this.groupStore.get_group(groupname)
      const color = new Color(<any>pixelData, x, y, group)
      this.colors.splice(index, 0, color)
      return index
    },
    color_from_color_data(colorData: ColorDataInterface) {
      this.create_color(Object.values(colorData.RGBA), colorData.xPos, colorData.yPos, colorData.groupname)
    }
    ,
    update_show_details(color: Color) {
      this.colors.forEach((col: Color) => 
          {
            if (col === color) {
              col.show_details = !col.show_details
            }
            else {
              col.show_details = false
            }
          }
        )
    },
    get_detailed_color(): Color {
      if (this.colors) {
        return this.colors.find((color: Color) => color.show_details )
      }
    }
  },
  getters: {
    groups() {
      return this.groupStore.groups
    },
    selected_colors() {
      return this.colors.filter(color => color.selected)
    },
    selected_color_ids() {
      return [...this.colors.keys()].filter(index => this.colors[index].selected)
    }
  },
})

export const useGroupStore = defineStore('group', {
  state: () => {
    return {
      groups: <Array<ColorGroup>>[]
    }
  },
  actions: {
      get_group(name: string): ColorGroup {
        // Returns groups with name if existing else creates one
        if (this.exists(name)) {
          return this.get_group_by_name(name)
        }
        else {
          const group = new ColorGroup(name)
          this.groups.push(group)
          return group
        }

      },
      get_group_by_name(name: string): ColorGroup {
        // Return existing group with name
        return this.groups.find(group => group.name === name)
      },
      exists(name) {
        // Check if group with name already exists
        return this.group_names.includes(name)
      },
      rename_group(group, name) {
        // Change name of group
        if (!this.exists(name)) {
          group.name = name
        }
      },
      remove_empty_groups() {
        // Check for empty groups and delete them
        const empty_groups = this.groups.filter(group => (group.num_colors === 0) && !group.is_default)
        empty_groups.forEach(this.delete_group)
      },
      delete_group(group: ColorGroup) {
        // Delete group
        const index = this.groups.indexOf(group)
        this.delete_group_by_index(index)

      },
      delete_group_by_index(index: number) {
        // Delete group by index
        this.groups.splice(index, 1)
      },
      drop_color_from_group(color: Color) {
        // Remove color from its group
        color.drop_from_group()
        this.remove_empty_groups()
      },
      toggle_group_visibility_by_index(index: number) {
        // Check if group with index exists. If yes: toggle visibility of colors of group.
        if (index < this.groups.length) {
          this.groups[index].toggle_visibilty_colors()
        }
      }
  },
  getters: {
    group_names(): Array<string> {
      return this.groups.map(group => group.name)
    }
  }

})