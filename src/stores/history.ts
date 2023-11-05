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

export const useHistoryStore = defineStore('history', {
    state: () => {
        return {
            history: <Array<Action>>[],
            index: 0
        }
    },
    actions: {
        // Add actions here

        // ----------------------->

        // Add color
        add_color(event) {
            return this.perform_action(CreateColorAction, event)
        },

        // Delete color
        delete_color(...args) {
            return this.perform_action(DeleteColorAction, ...args)
        },

        delete_selected_colors(...args) {
            return this.perform_action(DeleteMultipleColors, ...args)
        },

        // Import colors
        import_colors(...args) {
            return this.perform_action(ImportColors, ...args)
        },

        // Add selection to group
        add_selection_to_group(...args) {
            return this.perform_action(AddSelectionToGroup, ...args)
        },

        // Rename group
        rename_group(...args) {
            return this.perform_action(RenameGroup, ...args)
        },

        // ----------------------->

        // Store methods
        undo() {
            if (this.undo_possible) {
                this.history[this.index].undo()
                this.index++
                const toastStore = useToastStore()
                toastStore.push_success('Undo.', 100)
            }
        },
        forward() {
            if (this.forward_possible) {
                this.index--
                this.history[this.index].forward()
                const toastStore = useToastStore()
                toastStore.push_success('Redo.', 100)
            }
        },
        add_action(action) {
            this.history.splice(0, this.index)
            this.history.unshift(action)
            this.index = 0
        },
        perform_action(ActionToPerform: typeof Action, ...args) {
            try {
                const action = ActionToPerform.createAndPerformAction(...args)
                this.add_action(action)
                return {success: true, msg: ''}
            } catch (err) {
                console.log(`Could not perform action. Received error: ${err}`)
                return {success: false, msg: err.message}
            }
        },
        reset() {
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