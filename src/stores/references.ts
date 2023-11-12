import {defineStore} from "pinia"
import {ReferencePair, ReferencePoint} from "@/utils/tools/reference_tool";
import {useToastStore} from "@/stores/toasts";
import {pointCoordinates} from "@/utils/general";

export const useReferenceStore = defineStore("references", {
    state: () => {
        return {
            last_pressed: <null|ReferencePoint>null,
            pairs: [],
            points: []
        }
    },
    actions: {
        add_point(point: ReferencePoint, connect = false) {
            if (connect && this.last_activated) {
                this.create_pair_with_last_activated(point)
            }
            this.points.push(point)
            this.last_pressed = point
        },
        add_points(points: ReferencePoint[]) {
          points.forEach((point: ReferencePoint) => this.add_point(point))
        },
        create_pair_with_last_activated(point: ReferencePoint) {
            const pair = this.create_pair(this.last_activated, point)
            this.add_pair(pair)
            this.last_pressed = point
            this.reset_selection()
        },
        create_pair(start: null|ReferencePoint, end: null|ReferencePoint) {
            if (start && end && start !== end  && !this.check_if_pair_exists(start, end)) {
                return new ReferencePair(start, end)
            }
        },
        add_pair(pair: ReferencePair) {
            this.pairs.push(pair)
        },
        add_pairs(pairs: ReferencePair[]) {
            pairs.forEach((point: ReferencePair) => this.add_pair(point))
        },
        delete_point(point: ReferencePoint) {
            // Delete pairs that include point, then delete point and reset last_pressed if necessary
            const pairs = this.get_pairs_of_point(point)
            this.delete_pairs(pairs)

            const index = this.points.indexOf(point)
            this.points.splice(index, 1)

            // Reset last pressed if necessary
            if (this.last_pressed === point) {
                this.last_pressed = null
            }
            return pairs
        },
        delete_pair(pair: ReferencePair) {
            if(this.pairs.includes(pair)) {
                const index = this.pairs.indexOf(pair)
                this.pairs.splice(index, 1)
            }
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
            this.delete_points(this.selected_points)
        },
        get_relative_coordinates_of_selection(target: ReferencePoint) {
            const points = this.selected_points
            return points.map((point: ReferencePoint) => point.coords_relative_to(target))
        },
        set_coordinates_relative_to(target: ReferencePoint, relative_coords: pointCoordinates[]) {
            // Set points relative to target (Length of array of relative_coords must be equal to length of currently selected points
            const target_coords = target.coords
            this.selected_points.forEach((point: ReferencePoint, index: number) => {
                const coords: pointCoordinates = ReferencePoint.add(target_coords, relative_coords[index])
                point.update_from_coords(coords)
            })
        },
        reset_selection() {
            this.selected_points.forEach((point: ReferencePoint) => point.selected = false)
            this.selected_pairs.forEach((pair: ReferencePair) => pair.selected = false)
        },
        check_if_pair_exists(start: ReferencePoint, end: ReferencePoint) {
            return this.pairs.some((pair: ReferencePair) => pair.contains(start) && pair.contains(end))
        },
        get_pairs_of_point(point: ReferencePoint): ReferencePair[] {
            return this.pairs.filter((pair: ReferencePair) => pair.contains(point))
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
        },
        selected_points(state): ReferencePoint[] {
            return state.points.filter((point: ReferencePoint) => point.selected)
        },
        selected_pairs(state): ReferencePair[] {
            return state.pairs.filter((pair: ReferencePair) => pair.selected)
        }
    }
})