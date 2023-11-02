
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


export class Point {
  // Point with x and y coordinate
  constructor(public x: number, public y: number) {}


  static get_coordinates_from_event(event: MouseEvent, canvas=document.getElementById('canvas')): [number, number] {
    // Calculate canvas coordinates from event mouseevent
    const rect = canvas.getBoundingClientRect()
    return [event.clientX - rect.x, event.clientY - rect.y]
  }

  static point_from_event(event) {
    // New point based on event
    const [x, y] = this.get_coordinates_from_event(event)
    return new Point(x, y)
  }

  get asarray(): [number, number] {
    // Point coordinates in array
    return [this.x, this.y]
  }

  
  dot(arr1: [number, number], arr2: [number, number] = this.asarray): number {
    // Calculate dot product
    return arr1[0] * arr2[0] + arr1[1] * arr2[1]
  }

  dot_squared(arr: [number, number]): number {
    // Calculate euclidean norm squared
    return this.dot(arr, arr)
  }

  add(arr1: [number, number], arr2: [number, number] = this.asarray): [number, number] {
    // Add
    return [arr2[0] + arr1[0], arr2[1] + arr1[1]]
  }

  sub(arr1: [number, number], arr2: [number, number] = this.asarray): [number, number] {
    // Subtract
    return [arr2[0] - arr1[0], arr2[1] - arr1[1]]
  }

  distance(arr: [number, number]) {
    // Distance to given coordinates arr=[x,y].
    const sub = this.sub(arr)
    return Math.sqrt(this.dot_squared(sub))
  }

  center(arr1: [number, number], arr2: [number, number] = this.asarray): [number, number] {
    // Center/Midpoint between both point coordinates
    return [0.5 * (arr1[0] +arr2[0]), 0.5 * (arr1[1] + arr2[1])]
  }

  scale(s: number): [number, number] {
    // Return scaled coordinates
    return [s * this.x, s * this.y]
  }

  get_org(): [number, number] {
    // Get coordinates
    return [this.x, this.y]
  }

  get_scaled() {
    // Get scaled coordinates
    const s = referenceTool.scale.value
    return this.add(this.scale(s), referenceTool.refPoint.value.scale(1-s))
  }

  update_from_event(event) {
    // Update coordinates based on event
    [this.x, this.y] = Point.get_coordinates_from_event(event)
  }
  
  scale_from_event(event: MouseEvent) {
    // Calculate and update scale based on event
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
    // Calculate angle (measured from horizont)
    const sub = this.sub(point.asarray)
    return Math.atan(sub[1]/sub[0])
  }
}

export class Pair {
  // Pair of points (segments)
  constructor(public start: Point, public end: Point, public visible: Boolean = true, public hovered: Boolean = false) {}

  get length_org() {
    // Distance of points
    return this.start.distance(this.end.asarray)
  }

  get length_scaled() {
    // Distance of points
    return this.start.distance(this.end.asarray) * referenceTool.scale.value
  }

  get angle() {
    // get angle (measured from horizont)
    return this.start.angle(this.end)
  }

  get center_org() {
    // Center/Midpoint of points
    return this.start.center(this.end.asarray)
  }

  get center_scaled() {
    // Center/Midpoint of scaled points
    return this.start.center(this.end.get_scaled(), this.start.get_scaled())
  }
  
  is_same(point1: Point, point2: Point) {
    // Check is pair of same points
    return [point1, point2].every(point => this.contains(point))
  }

  contains(point: Point) {
    // Check if contains point
    return [this.start, this.end].includes(point)
  }

}


export const referenceTool: ToolInterface = {
    // Note: In mouse call functions ref values are read/updated without ".value"

    active: false, // Make active again
    passive: false,
    icon: 'bi-arrows-vertical',
    key: 'r',
    scale: ref(0.5),
    points: <Array<Point>> new Array(0),
    pairs: <Array<Pair>>[],
    update_call: null,
    show_digital: true,
    show_real: true,
    _last_active: <Pair|null>null,
    refPoint: ref(0),

    get last_active(): Point {
      // get last active/clicked point
      return (this._last_active) ? this._last_active : this.points[this.points.length-1]
    },

    set last_active(value) {
      // set last active/clicked point
      this._last_active = value
    },

    toggle() {
      // Toggle tool state
      this.active = !this.active
    },

    new_pair(point1: Point, point2: Point) {
      // New pair of points (resulting in a displayed segment)
      this.pairs.push(new Pair(point1, point2))
    },
    
    mousedownleft(event: MouseEvent) {
      // New point
      const point = Point.point_from_event(event)
      this.add_new_point(point)
    },

    mousedownleftshift(event: MouseEvent) {
      // New point + new segment/pair with last active point if possible
      const point = Point.point_from_event(event)
      if (this.points.length > 0) {
        // If already one more point exists
        this.new_pair(this.last_active, point)
      }
      this.add_new_point(point)
    },

    connect_existing_points(point1: Point, point2: Point) {
      // Create new pair of not existing already
      if (this.pairs.every((pair: Pair) => !pair.is_same(point1, point2))) {
        this.new_pair(point1, point2)
      }
    },

    add_new_point(point: Point) {
      if ((<HTMLElement>event.target).id === 'canvas') {
        // Add new point to points list
        this.last_active = point
        if (this.points.length === 0) {
          // Update refPoint if first point
          this.refPoint = point
        }
        this.points.push(point)
      }
    },

    remove_point(point: Point) {
      // Remove point and pairs that include point
      this.remove_pairs_with_point(point)
      const idx = this.points.indexOf(point)
      this.points.splice(idx, 1)

      // If point was refpoint: set new refpoint
      if (idx === 0) {
        this.refPoint = this.points[0]
      }
      
      // If point was last active: reset last active
      if (point === this.last_active) {
        this.last_active = null
      }

    },

    remove_pair(pair: Pair) {
      // Remove pair
      this.pairs.splice(this.pairs.indexOf(pair), 1)
    },

    point_from_event(event: MouseEvent) {
      // Create new point
      return Point.point_from_event(event)
    },

    remove_pairs_with_point(point: Point) {
      // Remove pairs that includes point
      const pairs = this.pairs.filter(pair => pair.contains(point))
      pairs.forEach(pair => this.remove_pair(pair))
    },

    mousemove(event: MouseEvent) {
      // Mouse move events calls (for dragging)

      if (this.update_call) {
        if (event.buttons === 1) {
          this.update_call(event)
        }
        else {
          this.update_call = null
        }
      }
    },

    mouseup(_: MouseEvent) {
      this.update_call = null
    },

    mouseleave(_: MouseEvent) {
      this.update_call = null
    }

}


export const toolManagementRef = ref({
  tools: [],
  active_tool: null,
  last_ts: null,
  ctrl: <Boolean>false,
  
  get activatable_tools() {
    // Return array of activatable tools
    return this.tools.filter(tool => !tool.passive)
  },
  get passive_tools(): Array<any> {
    // Return tools, that are always activated (none yet)
    return this.tools.filter(tool => tool.passive)
  },
  get listening_tools(): Array<any> {
    // Get all active tool + passive tools
    return (this.active_tool) ? this.passive_tools.concat([this.active_tool]) : this.passive_tools
  },
  forward_event(event, eventType) {
    // Forward events to listening tools
    this.listening_tools.forEach(tool => {
        if (tool?.[eventType]) {
          tool[eventType](event)
        }
    })
  },
  toggle_tool(idx) {
    // Toggle/switch tool
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

  check_ctrl(event) {
    this.ctrl = event.ctrlKey
    if (this.ctrl) {
      document.body.classList.add('deleteCursor')
    } else {
      document.body.classList.remove('deleteCursor')
    }
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
      // Right click
      this.forward_event(event, 'mousedownright')
    }
    else {
      // Otherwise forward mousedown
      this.forward_event(event, 'mousedown')
    }
  },

  keydown(event) {
    // Check if ctrl pressed
    this.check_ctrl(event)

    // Keydown event (forward if non of the tool keys was pressed)
    if (this.tool_keys.includes(event.key)) {
      const idx = this.tool_keys.indexOf(event.key)
      this.toggle_tool(idx)
    }
    else {
      this.forward_event(event, 'keydown')
    }
  },

  mouse_up(event: MouseEvent) {
    this.check_ctrl(event)
    this.forward_event(event)
  },

  keyup(event: KeyboardEvent) {
    this.check_ctrl(event)
  },

  map_events(eventTypes) {
    // Add event forwarding to events in eventTypes
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
const eventTypes = ['click', 'keypress', 'mousedown', 'mousemove', 'mouseup', 'onmousenter', 'mouseleave', 'keydown', 'keyup']
toolManagementRef.value.map_events(eventTypes)
