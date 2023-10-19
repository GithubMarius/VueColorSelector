import { defineStore } from "pinia";
import { Color, ColorGroup } from '../utils/colors/ColorManagement'
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
      const [pixelData, x, y] = this.color_data_from_event(event)
      return this.create_color(pixelData, x, y, '')
    },
    color_data_from_event(event) {      
      const [x, y] = canvas_position_from_event(event)
      const pixelData = get_pixel_color(x, y)
      return [pixelData, x, y]
    },

    color_delete_by_index(index: number) {
      this.colors.splice(index, 1)
    },

    color_delete(color: Color) {
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
    move_colors_to_group(name, colors: Array<Color>) {
      const group = this.groupStore.get_group(name)
      colors.forEach(
        color => color.change_group(group)
      )

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
    create_color(pixelData, x, y, groupname) {
      const group = this.groupStore.get_group(groupname)
      const color = new Color(<any>pixelData, x, y, group)
      return this.colors.push(color)
    }
  },
  getters: {
    groups() {
      return this.groupStore.groups
    },
    selected_colors() {
      return this.colors.filter(color => color.selected)
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
        return this.groups.find(group => group.name === name)
      },
      exists(name) {
        return this.group_names.includes(name)
      },
      rename_group(group, name) {
        if (!this.exists(name)) {
          group.name = name
        }
      }

  },
  getters: {
    group_names(): Array<string> {
      return this.groups.map(group => group.name)
    }
  }

})