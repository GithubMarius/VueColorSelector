import { ref } from 'vue'

export interface ToolInterface {
automatic_active: Boolean;
[propName: string]: any;
}

export const Tool: ToolInterface = {

}

class Reference {
    constructor(public start: [Number, Number], end: [Number, Number], isset=true, visible=true){}

    
}

export const referenceTool = {
    active: true,
    reference_real: new Reference([0,0],[0,0], false, true),
    
    clickLeft(event: MouseEvent) {
        if (this.active) {

        }
        console.log(event)
        console.log(event.target.id === 'canvas')
    },

    clickRight(event: MouseEvent) {
        if (this.active) {
            console.log(event.clientX)
            console.log(event.clientY)
        }
        console.log(event.target.id === 'canvas')
    }


}

export const toolsRaw = {
    existing: [],
    get active() {
      return this.existing.reduce((accumulator, tool) => tool.active || accumulator, false)
    },
    get active_tools() {
      return this.existing.filter(tool => tool.active)    
    },
    last_ts: null,
    mouseEnter(event) {
      this.active_tools.forEach(tool => {
        if (tool.mouseenter) {
          tool.mouseEnter(event)
        }
      })
    },
    mouseDown(event) {
      this.active_tools.forEach(tool => {
        if (tool.mouseDown) {
          tool.mouseDown(event)
        }
      })
    },
    mouseMove(event) {
      this.active_tools.forEach(tool => {
        if (tool.mouseMove) {
          tool.mouseMove(event)
        }
      })
    }
  }

const eventTypes = ['click', 'clickLeft', 'clickRight']
eventTypes.forEach(eventType => toolsRaw[eventType] = () => {
    toolsRaw.active_tools.forEach(tool => {
        if (tool[eventType]) {
            tool[eventType](event)
        }
    })
})

export const tools = ref(toolsRaw)