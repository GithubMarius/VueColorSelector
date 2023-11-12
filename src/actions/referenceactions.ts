import {ReferencePair, ReferencePoint} from '@/utils/tools/reference_tool'
import {useReferenceStore} from "@/stores/references";
import {Action} from "@/utils/action";
import {pointCoordinates} from "@/utils/general";
import {toRaw} from "vue";

export class createReferencePointAction extends Action {

    point: ReferencePoint
    connect: boolean

    constructor(event: MouseEvent) {
        super()

        this.point = ReferencePoint.point_from_event(event)
        this.connect = event.shiftKey
    }

    forward() {
        const referenceStore = useReferenceStore()
        referenceStore.add_point(this.point, this.connect)
    }

    undo() {
        const referenceStore = useReferenceStore()
        referenceStore.delete_point(this.point)
    }

    toString() {
        return `Added reference point.`
    }

}


export class deleteReferencePointAction extends Action {

    pairs: ReferencePair[]

    constructor(public point: ReferencePoint) {
        super()

    }

    forward() {
        const referenceStore = useReferenceStore()
        this.pairs = referenceStore.delete_point(this.point)
    }

    undo() {
        const referenceStore = useReferenceStore()
        referenceStore.add_point(this.point)
        this.pairs.forEach((pair: ReferencePair) => referenceStore.add_pair(pair))
    }

    toString() {
        return `Deleted reference point.`
    }

}


export class moveMultipleReferencePointsAction extends Action {

    coords_after: pointCoordinates[] = null

    constructor(public points: ReferencePoint[], public coords_before: pointCoordinates[]) {
        if (points.length !== coords_before.length) {
            throw Error("Points and coordinates don't have the same length.")
        }
        super()
        this.coords_after = points.map((p: ReferencePoint) => [...p.coords])
    }

    forward() {
        this.points.forEach((point: ReferencePoint, index: number) => point.update_from_coords(this.coords_after[index]))
    }

    undo() {
        this.points.forEach((point: ReferencePoint, index: number) => point.update_from_coords(this.coords_before[index]))
    }

    toString() {
        return `Moved reference points.`
    }
}


export class createReferencePairAction extends Action {
    pair: ReferencePair

    constructor(public end: ReferencePoint) {
        super()
        const referenceStore = useReferenceStore()
        this.pair = referenceStore.create_pair(referenceStore.last_activated, this.end)
    }

    forward() {
        if (this.pair) {
            const referenceStore = useReferenceStore()
            referenceStore.add_pair(this.pair)
        } else {
            throw new Error('ActionNotPossible')
        }
    }

    undo() {
        const referenceStore = useReferenceStore()
        referenceStore.delete_pair(this.pair)
    }

    toString() {
        return `Added reference line.`
    }

}


export class deleteReferencePairAction extends Action {

    constructor(public pair: ReferencePair) {
        super()
    }

    forward() {
        const referenceStore = useReferenceStore()
        referenceStore.delete_pair(this.pair)
    }

    undo() {
        const referenceStore = useReferenceStore()
        referenceStore.add_pair(this.pair)
    }

    toString() {
        return `Deleted reference line.`
    }
}

export class deleteSelectReferencePairsAndPointsAction extends Action {

    points: ReferencePoint[] = []
    pairs: ReferencePair[] = []

    constructor() {
        super()
        const referenceStore= useReferenceStore()
        this.add_points_and_pairs_from_points(referenceStore, referenceStore.selected_points)
        this.add_pairs(referenceStore.selected_pairs)

    }

    forward() {
        const referenceStore = useReferenceStore()
        referenceStore.delete_points(this.points)
        referenceStore.delete_pairs(this.pairs)
    }

    undo() {
        const referenceStore = useReferenceStore()
        referenceStore.add_points(this.points.toReversed())
        referenceStore.add_pairs(this.pairs)
    }

    add_points_and_pairs_from_points(referenceStore: ReturnType<typeof useReferenceStore>, points: ReferencePoint[]) {
        points.forEach((point: ReferencePoint) => {
            const pairs: ReferencePair[] = referenceStore.get_pairs_of_point(point)
            this.add_point(point)
            this.add_pairs(pairs)
        })
    }

    add_point(point: ReferencePoint) {
        if (!this.points.includes(point)) {
            this.points.push(point)
        }
    }

    add_pair(pair: ReferencePair) {
        if (!this.pairs.includes(pair)) {
            this.pairs.push(pair)
        }
    }

    add_pairs(pairs: ReferencePair[]) {
        pairs.forEach((pair: ReferencePair) => this.add_pair(pair))
    }

    toString() {
        return `Deleted selected points and reference lines.`
    }
}

