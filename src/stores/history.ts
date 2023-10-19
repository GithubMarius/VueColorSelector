
import { defineStore } from "pinia";
import { useColorStore } from "./color";
import { canvas_position_from_event, get_pixel_color, mouseCoordinates } from "@/utils/general";

class CustomAction {

  index: number
  xy: mouseCoordinates
  pixelData

  constructor(event: MouseEvent) {
    // Retrieve position and pixeldata of the point
    this.xy = canvas_position_from_event(event)
    this.pixelData = get_pixel_color(...this.xy)
  }

  forward() {
    // Add color to colorstore and remember index
    const colorStore = useColorStore()
    this.index = colorStore.create_color(this.pixelData, ...this.xy, '') - 1
    console.log(this.index)
  }

  undo() {
    // Remove color again (based on index)
    console.log(this.index)
    const colorStore = useColorStore()
    colorStore.color_delete_by_index(this.index)
  }

  static createAndDoAction(event) {
    const action = new CustomAction(event)
    action.forward()
    return action
  }

}

export const useHistoryStore = defineStore('history', {
  state: () => {
    return {
      history: [],
      index: 0
    }
  },
  actions: {
    add_color(event) {
      const action = CustomAction.createAndDoAction(event)
      this._add_action(action)
    },
    undo() {
      if (this.undo_possible) {
        this.history[this.index].undo()
        this.index++
      }
    },
    forward() {
      if (this.forward_possible) {
        this.index--
        this.history[this.index].forward()
      }
    },
    _add_action(action) {
      this.history.splice(0, this.index)
      this.history.unshift(action)
      this.index = 0
    }
  },
  getters: {
    possible_undos() {
      return this.history_length - this.index
    },
    history_length() {
      return this.history.length
    },
    possible_forwards() {
      return this.index
    },
    undo_possible() {
      return this.possible_undos > 0
    },
    forward_possible() {
      return this.possible_forwards > 0
    }

  }
})