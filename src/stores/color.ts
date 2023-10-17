import { defineStore } from "pinia";
import { Color, ColorGroup } from '../utils/colors/ColorManagement'
import { canvas_position_from_event, get_pixel_color } from '../utils/general'
import { ref } from "vue"


export const useColorStore = defineStore("color", {
  state: () => {
    return {
      colors: <Array<Color>>[],
      history: [],
      groupStore: useGroupStore()
    }
  },
  actions: {
    color_from_event(event: MouseEvent) {
      const [x, y] = canvas_position_from_event(event)
      const pixelData = get_pixel_color(x, y)
      const group = this.groupStore.get_group('')
      console.log(group)
      const color = new Color(<any>pixelData, x, y, group)
      this.colors.push(color)
    },
    color_delete(color: Color) {
      // Delete color
      const index = this.colors.indexOf(color)
      console.log(this.colors.splice(index, 1))
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
}); 

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