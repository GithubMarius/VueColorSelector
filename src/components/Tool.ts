import { eventNames } from 'node:process';
import { isNumberObject } from 'node:util/types';
import { ref, computed } from 'vue'

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


export class Point {
  constructor(public x: number, public y: number) {}
  dot(arr1: [number, number], arr2: [number, number] = this.asarray): number {
    return arr1[0] * arr2[0] + arr1[1] * arr2[1]
  }

  dot_squared(arr: [number, number]): number {
    return this.dot(arr, arr)
  }

  add(arr1: [number, number], arr2: [number, number] = this.asarray): [number, number] {
    return [arr2[0] + arr1[0], arr2[1] + arr1[1]]
  }

  sub(arr1: [number, number], arr2: [number, number] = this.asarray): [number, number] {
    return [arr2[0] - arr1[0], arr2[1] - arr1[1]]
  }

  get asarray(): [number, number] {
    return [this.x, this.y]
  }

  distance(arr: [number, number]) {
    const sub = this.sub(arr)
    return Math.sqrt(this.dot_squared(sub))
  }

  center(arr1: [number, number], arr2: [number, number] = this.asarray): [number, number] {
    return [0.5 * (arr1[0] +arr2[0]), 0.5 * (arr1[1] + arr2[1])]
  }

  scale(s: number): [number, number] {
    return [s * this.x, s * this.y]
  }

  get_org(): [number, number] {
    return [this.x, this.y]
  }

  get_scaled() {
    const s = referenceTool.scale.value
    return this.add(this.scale(s), referenceTool.refPoint.value.scale(1-s))
  }


  static get_coordinates_from_event(event, canvas=document.getElementById('canvas')): [number, number] {
    const rect = canvas.getBoundingClientRect()
    return [event.clientX - rect.x, event.clientY - rect.y]
  }

  static point_from_event(event) {
    const [x, y] = this.get_coordinates_from_event(event)
    return new Point(x, y)
  }

  update_from_event(event) {
    [this.x, this.y] = Point.get_coordinates_from_event(event)
  }
  
  scale_from_event(event: MouseEvent) {
    const xy = Point.get_coordinates_from_event(event)
    const arr_ref = referenceTool.refPoint.value.asarray
    const subevent = this.sub(arr_ref, xy)
    const subpoints = this.sub(arr_ref)
    const scale = this.dot(subevent, subpoints)/this.distance(arr_ref)**2
    if (scale > 0) {
      referenceTool.scale.value = scale
    }
  }

  angle(point: Point) {
    const sub = this.sub(point.asarray)
    return Math.atan(sub[1]/sub[0])
  }
}

export class NWPair {
  constructor(public start: Point, public end: Point) {}

  get length_org() {
    return this.start.distance(this.end.asarray)
  }

  get length_scaled() {
    return this.start.distance(this.end.asarray) * referenceTool.scale.value
  }

  get angle() {
    return this.start.angle(this.end)
  }

  get center_org() {
    return this.start.center(this.end.asarray)
  }

  get center_scaled() {
    return this.start.center(this.end.get_scaled(), this.start.get_scaled())
  }
  
}



console.log('Warning, reference tool set inactive currently.')
export const referenceTool: ToolInterface = {
    active: false, // Make active again
    passive: false,
    icon: 'bi-arrows-vertical',
    key: 'r',
    scale: ref(0.5),
    points: <Array<Point>> new Array(0),
    pairs: <Array<NWPair>>[],
    update_call: null,
    test: new Array(0),
    _last_active: <NWPair|null>null,
    refPoint: ref(0),

    get last_active(): Point {
      return (this._last_active) ? this._last_active : this.points[this.points.length-1]
    },

    set last_active(value) {
      this._last_active = value
    },

    toggle() {
      this.active = !this.active
    },

    new_pair(point1: Point, point2: Point) {
      this.pairs.push(new NWPair(point1, point2))
    },
    
    mousedownleft(event: MouseEvent) {
      const point = Point.point_from_event(event)
      if (this.points.length === 0) {
        this.refPoint = point
      }
      this.points.push(point)
    },

    mousedownleftshift(event: MouseEvent) {
      const point = Point.point_from_event(event)
      if (this.points.length > 0) {
        this.new_pair(this.last_active, point)
      }
      this.points.push(point)
    },

    add_new_point(point: Point) {
      this.last_active = point
      this.points.push(point)
    },

    point_from_event(event: MouseEvent) {
      return Point.point_from_event(event)
    },

    mousedownright(event: MouseEvent) {
      this.references[0].end_from_event(event)
    },

    mousemove(event: MouseEvent) {
      if (this.update_call) {
        if (event.buttons === 1) {
          this.update_call(event)
        }
        else {
          this.update_call = null
        }
      }
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
      } else if (!event.shiftKey && event.ctrlKey) {
        // + NoShift + Ctrl
        this.forward_event(event, 'mousedownleftctrl')
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
