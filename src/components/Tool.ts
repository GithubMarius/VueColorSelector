import { eventNames } from 'node:process';
import { ref } from 'vue'

export interface ToolInterface {
active: Boolean
passive: Boolean
key: string
toggle()
icon: String
[propName: string]: any

}

export const Tool: ToolInterface = {
  active: true,
  passive: false,
  key: '',
  automatic_active: true,
  icon: '',
  toggle() {}
}

export class Reference {
    constructor(public start: [Number|any, Number|any], public end: [Number|any, Number|any], public isset=true, public visible=true){}

    get cssStartX() {
      return (this.start) ? this.start[0] + 'px' : 'none'
    }

    get cssStartY() {
      return (this.start) ? this.start[1] + 'px' : 'none'
    }

    get cssEndX() {
      return (this.end) ? this.end[0] + 'px' : 'none'
    }

    get cssEndY() {
      return (this.end) ? this.end[1] + 'px' : 'none'
    }

    get centerX() {
      return (this.start[0] + this.end[0])/2
    }

    get centerY() {
      return (this.start[1] + this.end[1])/2
    }

    get cssCenterX() {
      return (this.start && this.end) ? this.centerX + 'px' : 'none'
    }

    get cssCenterY() {
      return (this.start && this.end) ? this.centerY + 'px' : 'none'
    }

    get length() {
      return Math.sqrt((this.end[0]-this.start[0])**2 + (this.end[1]-this.start[1])**2)
    }

    get cssLength() {
      return (this.start && this.end) ? this.length + 'px' : 'none'
    }

    get angle() {
      return Math.atan((this.end[1]-this.start[1])/(this.end[0]-this.start[0]))
    }

    get cssTransform() {
      return (this.start && this.end) ? 'translate(-50%, -50%) rotate(' + this.angle + 'rad)' : 'none'
    }

    start_from_event(event) {
      const target = <HTMLElement>event.target 
      if (target.id === 'canvas') {
        const rect = target.getBoundingClientRect()
        this.start = [event.clientX - rect.x, event.clientY - rect.y]
      }
    }

    end_from_event(event) {
      const target = <HTMLElement>event.target 
      if (target.id === 'canvas') {
        const rect = target.getBoundingClientRect()
        this.end = [event.clientX - rect.x, event.clientY - rect.y]
      }
    }
}

class referencePair {
  constructor(public destructable: Boolean = true,
    public digital = new Reference(null, null, false, true),
    public real = new Reference(null, null, false, true)) {}
}

console.log('Warning, reference tool set inactive currently.')
export const referenceTool: ToolInterface = {
    active: false, // Make active again
    passive: false,
    icon: 'bi-arrows-vertical',
    key: 'r',
    toggle() {
      this.active = !this.active
    },
    references: [new referencePair(false)],
    
    mousedownleft(event: MouseEvent) {
      this.references[0].digital.start_from_event(event)
    },

    mousedownright(event: MouseEvent) {
      this.references[0].digital.end_from_event(event)
    },

    get reference_real_set() {
      return !(!this.reference_real.start || !this.reference_real.end)
    }


}


export const toolManagementRef = ref({
  tools: [],
  active_tool: null,
  last_ts: null,
  
  get activatable_tools() {
    return this.tools.filter(tool => !tool.passive)
  },
  get passive_tools(): Array<any> {
    return this.tools.filter(tool => tool.passive)
  },
  get active_tools(): Array<any> {
    return (this.active_tool) ? this.passive_tools.concat([this.active_tool]) : this.passive_tools
  },
  forward_event(event, eventType) {
    this.active_tools.forEach(tool => {
        if (tool?.[eventType]) {
          tool[eventType](event)
        }
    })
  },
  toggle_tool(idx) {
    if (this.activatable_tools[idx].active) {
      this.active_tool = null
    } else {
      this.activatable_tools.forEach(tool => tool.active = false)
      this.active_tool = this.activatable_tools[idx]
    }
    this.activatable_tools[idx].toggle()
  },
  get tool_keys() {
    // Return activation/deactivation key for each activatable key
    return this.activatable_tools.map(tool => tool.key)
  },
  mousedown(event) {
    if (event.buttons === 1) {
      // Left click
      if (!event.shiftKey && !event.ctrlKey) {
        // + NoShift + NoCtrl
        this.forward_event(event, 'mousedownleft')
      } else if (event.shiftKey && !event.ctrlKey) {
        // + Shift + NoCtrl
        this.forward_event(event, 'mousedownleftshift')
      }
    }
    else if (event.buttons === 2) {
      this.forward_event(event, 'mousedownright')
    }
    else {
      this.forward_event(event, 'mousedown')
    }
  },
  keydown(event) {
    if (this.tool_keys.includes(event.key)) {
      const idx = this.tool_keys.indexOf(event.key)
      console.log(idx)
      this.toggle_tool(idx)
    }
    else {
      this.forward_event(event, 'keydown')
    }
  }
  ,
  map_events(eventTypes) {
    eventTypes.forEach(eventType => {
      if (!this[eventType]) {
        // Create handler
        this[eventType] = (event) => this.forward_event(event, eventType)
        document.addEventListener(eventType, this[eventType], false)
      } else {
        // Use existing method in anonymous function as handler
        document.addEventListener(eventType, (event) => this[eventType](event), false)
      }
    })
  }
})

// 
//'mousedown', 'mousemove', 'mouseup', 
const eventTypes = ['click', 'keypress', 'mousedown', 'mousemove', 'mouseup', 'onmousenter', 'mouseleave', 'keydown']
toolManagementRef.value.map_events(eventTypes)