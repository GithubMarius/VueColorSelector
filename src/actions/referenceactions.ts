import {ReferencePair, ReferencePoint} from '@/utils/tools/reference_tool'
import {useReferenceStore} from "@/stores/references";
import {Action} from "@/utils/action";
export class createReferencePointAction extends Action{

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

}


export class moveReferencePointAction extends Action {}


export class moveMultipleReferencePointsAction extends Action {}


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
        }
        else {
            throw new Error('ActionNotPossible')
        }
    }

    undo() {
        const referenceStore = useReferenceStore()
        referenceStore.delete_pair(this.pair)
    }

}


export class deleteReferencePairAction {}

export class deleteMultipleReferencePairsAndPointsAction {}

