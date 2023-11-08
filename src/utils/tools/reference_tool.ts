import {KeyCombination} from '@/utils/keyboardinput'
import {BaseTool, KeyboardListener, Listener, MouseUpListener, ToolInterface} from "@/utils/tools/helpers";
import {canvas_container_position_from_event, pointCoordinates} from "@/utils/general";
import {useReferenceStore} from "@/stores/references";
import {reactive} from "vue";


export const referenceTool = <ToolInterface>{
    ...BaseTool,
    name: 'Reference Tool',
    icon: 'bi-arrows-vertical',
    use_selection: true,
    _dragged_point: null,
    keyboard_shortcut: new KeyCombination('r', []),
    listener_calls: [
    ],
    additional_listeners: [
        new Listener(function mouseup(event: MouseEvent) {
            this.dragged_point = null
            if ((<HTMLElement>event.target)?.id === 'canvas') {
                const point = ReferencePoint.point_from_event(event)
                const referenceStore = useReferenceStore()
                referenceStore.add_point(point, event.shiftKey)
            }
        }, 'canvas-container'),
        new Listener(function mousemove(event: MouseEvent) {
            if (this.dragged_point) {
                this.dragged_point.update_from_event(event)
            }
        }),
        new KeyboardListener(function delete_selected(_: KeyboardEvent) {
            const referenceStore = useReferenceStore()
            referenceStore.deleted_selected_pairs()
            referenceStore.deleted_selected_points()
        }, new KeyCombination('Delete', [])),
        new MouseUpListener(function mouseup(event: MouseEvent) {
            console.log(event.target)
            console.log((<HTMLElement>event.target).classList.contains('referencePoint'))
        }, 0, ['cmd'])
    ],
    set dragged_point(point: ReferencePoint) {
        this.state['dragged_point'] = point
        if (point) {
            this.get_store().selectionTool.mute()
        } else {
            this.get_store().selectionTool.listen()
        }
    },
    get dragged_point(): ReferencePoint {
        return this.state.dragged_point
    }
}

interface ReferencePointInterface {
    coords: pointCoordinates
    selected: boolean
    selecting: boolean

    get highlighted(): boolean

    add(point: ReferencePoint): pointCoordinates

    subtract(point: ReferencePoint): pointCoordinates

    coords_relative_to(point: ReferencePoint): pointCoordinates

    distance(point: ReferencePoint): number

    angleBetween(point: ReferencePoint): number
}

interface ReferencePairInterface {
    start: ReferencePoint
    end: ReferencePoint
    selected: boolean
    selecting: boolean

    get highlighted(): boolean

    get points(): [ReferencePoint, ReferencePoint]

    get center(): pointCoordinates

    get angle(): number

    get width(): number
}

export class ReferencePoint implements ReferencePointInterface {

    coords: pointCoordinates

    static point_from_event(event: MouseEvent): ReferencePoint {
        const [x, y]: [number, number] = canvas_container_position_from_event(event)
        return new ReferencePoint(x, y)
    }

    static add(point1: pointCoordinates, point2: pointCoordinates): pointCoordinates {
        // Point 1 + point 2
        return [point1[0] + point2[0], point1[1] + point2[1]]
    }

    static subtract(point1: pointCoordinates, point2: pointCoordinates): pointCoordinates {
        // Point 1 - point 2
        return [point1[0] - point2[0], point1[1] - point2[1]]
    }

    static dot(point1: pointCoordinates, point2: pointCoordinates): number {
        // Calculate dot product
        return point1[0] * point2[0] + point1[1] * point2[1]
    }

    constructor(x: number, y: number, public selected: boolean = false, public selecting: boolean = true) {
        this.coords = reactive([x, y])
    }

    get highlighted() {
        return this.selecting || this.selected
    }

    add(point: ReferencePoint): pointCoordinates {
        // Add point to this point's coordinates
        return ReferencePoint.add(this.coords, point.coords)
    }

    subtract(point: ReferencePoint): pointCoordinates {
        // Subtract point to this point's coordinates
        return ReferencePoint.subtract(this.coords, point.coords)
    }

    coords_relative_to(point: ReferencePoint): pointCoordinates {
        return this.subtract(point)
    }

    distance(point: ReferencePoint): number {
        const sub = this.subtract(point)
        return Math.sqrt(ReferencePoint.dot(sub, sub))
    }

    angleBetween(point: ReferencePoint): number {
        // Return angle between both points in rad
        const sub = this.subtract(point)
        return Math.atan2(sub[1], sub[0])
    }

    update_from_event(event: MouseEvent) {
        [this.coords[0], this.coords[1]] = canvas_container_position_from_event(event)
    }
}

export class ReferencePair implements ReferencePairInterface {
    constructor(public start: ReferencePoint, public end: ReferencePoint,
                public selecting = false, public selected = false) {
    }

    get points(): [ReferencePoint, ReferencePoint] {
        return [this.start, this.end]
    }

    get highlighted() {
        return this.selecting || this.selected
    }

    get center(): pointCoordinates {
        const sum = this.start.add(this.end)
        return [0.5 * sum[0], 0.5 * sum[1]]
    }

    get angle(): number {
        // Angle in rad
        return this.start.angleBetween(this.end)
    }

    get width(): number {
        return this.start.distance(this.end)
    }

    contains(point: ReferencePoint) {
        return this.points.includes(point)
    }

}