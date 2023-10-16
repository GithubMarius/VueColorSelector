import { defineStore } from "pinia";
import { Color, ColorGroup } from '../utils/colors/ColorManagement'
import { canvas_position_from_event, get_pixel_color } from '../utils/general'


export const useColorStore = defineStore("color", {
  state: () => {
    return {
      colors: [],
      groups: ColorGroup.groups,
      history: []
    }
  },
  actions: {
    color_from_event(event: MouseEvent) {
      const [x, y] = canvas_position_from_event(event)
      const pixelData = get_pixel_color(x, y)
      const color = new Color(pixelData, x, y)
      this.colors.push(color)
    }

  },
  getters: {
    'test': function() {
      return this.colors
    },
  },
});