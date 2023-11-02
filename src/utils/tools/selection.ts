import {pointCoordinates, pointCoordinatesToStyle} from '@/utils/general';
import {BaseWithListenerCreation} from '@/utils/tools/helpers';
import {reactive} from "vue";


function page_coordinates(event: MouseEvent): pointCoordinates {
    return [event.pageX, event.pageY]
}

class Point {
    constructor (public coords: pointCoordinates = [0,0]) {}

    from_event(event: MouseEvent) {
        this.coords = page_coordinates(event)
    }
    get style() {
        return pointCoordinatesToStyle(this.coords)
    }

}
export const selectionTool = {
    ...BaseWithListenerCreation,
    listener_calls: {
        mousedown(event: MouseEvent) {
            if (event.buttons === 1) {
                this.start.from_event(event)
                this.end.from_event(event)
                this.refresh_selectables()
            }

        },
        mousemove(event: MouseEvent) {
            console.log(event.buttons)
            if (event.buttons === 1) {
                this.end.from_event(event)
                this.refresh_visibility()
                if (this.visible) {
                    console.log(this.selectables)
                }
            }
        },
        mouseup(_: MouseEvent) {
            this.reset()
        },
        mouseenter(event: MouseEvent) {
            // TODO: ADD
        },
        mouseleave(event: MouseEvent) {
            // TODO: ADD
        }
    },
    selectables: [],
    visible: false,
    start: reactive(new Point()),
    end: reactive(new Point()),

    get style(){
        return {
            display: (this.visible) ? 'block' : 'none',
            left: this.left + 'px',
            top: this.top + 'px',
            width: this.width + 'px',
            height: this.height + 'px',
        }
    },
    get left() {
        return Math.min(this.start.coords[0], this.end.coords[0])
    },
    get top() {
        return Math.min(this.start.coords[1], this.end.coords[1])
    },
    get width() {
        return Math.abs(this.end.coords[0]-this.start.coords[0])
    },
    get height() {
        return Math.abs(this.end.coords[1]-this.start.coords[1])
    },
    get diameter_squared() {
        return this.width**2 + this.height**2
    },

    refresh_visibility() {
        if (!this.visible && this.diameter_squared > 900) {
            this.visible = true
        }
    },
    reset() {
        this.visible = false
        this.start.coords = [0,0]
        this.end.coords = [0,0]
    },

    // Find selectable elements,
    refresh_selectables() {
        this.selectables = this.get_selectables()
    },

    get get_selectables() {
        return this.get_visible_elements_of_class('selectable')
    },

    get_visible_elements_of_class(css_class: string): Array<Element> {
        // Find all html elements with css_class that are currently visible
        const collection = document.getElementsByClassName(css_class)
        return [...Object.values(collection)].filter(element => element.childElementCount > 0 && element.checkVisibility())
    }

    // TODO: Check which selectables are in bounds.
}
selectionTool.create_listeners()
selectionTool.listen()
console.log(selectionTool)