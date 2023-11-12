import {defineStore} from "pinia";
import {
    AddSelectionToGroup,
    CreateColorAction,
    DeleteColorAction,
    DeleteMultipleColors,
    ImportColors,
    RenameGroup
} from "@/actions/coloractions";
import {Action} from "@/utils/action";
import {useToastStore} from "@/stores/toasts";
import {Color, ColorDataInterface} from "@/utils/colors/ColorManagement";

export const useHistoryStore = defineStore('history', {
    state: () => {
        return {
            history: <Array<Action>>[],
            pauseUndoRedo: false,
            index: 0
        }
    },
    actions: {
        // Store methods
        undo() {
            if (this.undo_possible && !this.pauseUndoRedo) {
                this.history[this.index].undo()
                this.index++
                const toastStore = useToastStore()
                toastStore.push_success('Undo.', 100)
            }
        },
        forward() {
            if (this.forward_possible && !this.pauseUndoRedo) {
                this.index--
                this.history[this.index].forward()
                const toastStore = useToastStore()
                toastStore.push_success('Redo.', 100)
            }
        },
        add_action(action: Action) {
            this.history.splice(0, this.index)
            this.history.unshift(action)
            this.index = 0
        },
        perform_action(action: Action): {success: boolean, msg: string} {
            try {
                this.add_action(action)
                action.forward()
                return {success: true, msg: ''}
            } catch (err) {
                if(err.message !== 'ActionNotPossible') {
                    console.log(`Could not perform action. Received error unusual error: ${err}`)
                }
                else {
                    console.log('Action was not possible.')
                }
                return {success: false, msg: err.message}
            }
        },
        pause() {
            this.pauseUndoRedo = true
        },
        continue() {
            this.pauseUndoRedo = false
        },
        reset() {
            this.pauseUndoRedo = false
            this.history.length = 0
        }
    },
    getters: {
        possible_undos() {
            return this.history_length - this.index
        },
        history_length() {
            return this.history.length
        },
        possible_forwards() {
            return this.index
        },
        undo_possible() {
            return this.possible_undos > 0
        },
        forward_possible() {
            return this.possible_forwards > 0
        }

    }
})