import {KeyCombinationWithInfo} from '@/utils/keyboardinput'
import {BaseTool, KeyboardListener, Listener, MouseUpListener, ToolInterface} from "@/utils/tools/helpers";
import {canvas_container_position_from_event, pointCoordinates} from "@/utils/general";
import {useReferenceStore} from "@/stores/references";
import {reactive} from "vue";
import {
    createReferencePointAction,
    deleteSelectReferencePairsAndPointsAction,
    moveMultipleReferencePointsAction
} from "@/actions/referenceactions";
import {useHistoryStore} from "@/stores/history";


export const referenceTool = <ToolInterface>{
    ...BaseTool,
    name: 'Reference Tool',
    icon: 'bi-arrows-vertical',
    use_selection: true,
    _dragged_point: null,
    keyboard_shortcut: new KeyCombinationWithInfo('r', []),
    dragged_points: [],
    coords_before_dragging: null,
    listener_calls: [],

    additional_listeners: [
        new Listener('mouseup', function mouseup(event: MouseEvent) {
            this.dragged_point = null
            if (!this.get_store().selectionTool.state.visible && (<HTMLElement>event.target)?.id === 'canvas' && event.button === 0) {
                createReferencePointAction.create(event)
            }
        }, 'canvas-container'),
        new Listener('mousemove', function mousemove(event: MouseEvent) {
            if (this.dragged_point) {
                const referenceStore = useReferenceStore()
                const relative_coords = referenceStore.get_relative_coordinates_of_selection(this.dragged_point)
                this.dragged_point.update_from_event(event)
                referenceStore.set_coordinates_relative_to(this.dragged_point, relative_coords)
            }
        }),
        new KeyboardListener(function delete_selected(_: KeyboardEvent) {
            deleteSelectReferencePairsAndPointsAction.create()
        }, new KeyCombinationWithInfo('Delete', [])),
    ],
    set dragged_point(point: ReferencePoint) {
        const historyStore = useHistoryStore()
        if (point) {
            historyStore.pause()
            this.get_store().selectionTool.mute()
            const referenceStore = useReferenceStore()
            this.state['dragged_points'] = referenceStore.selected_points
            if (!this.state['dragged_points'].includes(point)) {
                this.state['dragged_points'].push(point)
            }
            this.state['coords_before_dragging'] = this.state['dragged_points'].map((point: ReferencePoint) => [...point.coords])
        } else {
            historyStore.continue()
            if (this.state['dragged_points']) {
                this.get_store().selectionTool.listen()
                moveMultipleReferencePointsAction.create(this.state['dragged_points'], this.state['coords_before_dragging'])
                this.state['dragged_points'] = null
                this.state['coords_before_dragging'] = null
            }
        }
        this.state['dragged_point'] = point
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

    constructor(x: number, y: number, public selected: boolean = false, public selecting: boolean = false) {
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
        this.update_from_coords(canvas_container_position_from_event(event))
    }

    update_from_coords(coords: pointCoordinates) {
        [this.coords[0], this.coords[1]] = coords
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