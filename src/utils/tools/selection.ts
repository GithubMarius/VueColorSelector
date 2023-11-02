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
            this.start.from_event(event)

        },
        mousemove(event: MouseEvent) {
            this.end.from_event(event)
        }
    },
    start: reactive(new Point()),
    end: reactive(new Point()),
    get style(){
        return {
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
    }
}
selectionTool.create_listeners()
selectionTool.listen()
console.log(selectionTool)