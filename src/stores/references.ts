import {defineStore} from "pinia"
import {ReferencePair, ReferencePoint} from "@/utils/tools/reference_tool";
import {useToastStore} from "@/stores/toasts";

export const useReferenceStore = defineStore("references", {
    state: () => {
        return {
            last_pressed: null,
            pairs: [],
            points: []
        }
    },
    actions: {
        add_point(point: ReferencePoint, connect = false) {
            if (connect) {
                const other_point = this.last_activated
                if (other_point) {
                    this.add_pair(new ReferencePair(point, other_point))
                }
            }
            this.points.push(point)
        },
        add_pair(pair: ReferencePair) {
            this.pairs.push(pair)
        },
        delete_point(point: ReferencePoint) {
            // Delete pairs that include point and then delete point
            const pairs = this.pairs.filter((pair: ReferencePair) => pair.contains(point))
            this.delete_pairs(pairs)

            const index = this.points.indexOf(point)
            this.points.splice(index,1)
        },
        delete_pair(pair: ReferencePair) {
            const index = this.pairs.indexOf(pair)
            this.pairs.splice(index,1)
        },
        delete_points(points: ReferencePoint[]) {
            points.forEach((point: ReferencePoint) => {
                this.delete_point(point)
            })
        },
        delete_pairs(pairs: ReferencePair[]) {
            pairs.forEach((pair: ReferencePair) => this.delete_pair(pair))
        },
        deleted_selected_pairs() {
            const pairs = this.pairs.filter((pair: ReferencePair) => pair.selected)
            this.delete_pairs(pairs)
        },
        deleted_selected_points() {
            const points = this.points.filter((point: ReferencePoint) => point.selected)
            this.delete_points(points)
        }

    },
    getters: {
        last_activated(state) {
            if (state.last_pressed) {
                return state.last_pressed
            } else if (state.points.length > 0) {
                return state.points[state.points.length - 1]
            } else {
                const toastStore = useToastStore()
                toastStore.push_info('No reference point to connect to.')
            }
        }
    }
})