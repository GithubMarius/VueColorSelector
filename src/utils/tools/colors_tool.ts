import {KeyCombinationWithInfo} from '@/utils/keyboardinput'
import {BaseTool, KeyboardListener, Listener, MouseUpListener, ToolInterface} from "@/utils/tools/helpers";
import {useHistoryStore} from "@/stores/history";
import {useColorStore} from "@/stores/color";
import {CreateColorAction, DeleteMultipleColors} from "@/actions/coloractions";

export const colorsTool = <ToolInterface>{
    ...BaseTool,
    name: 'Colors Tool',
    icon: 'bi bi-eyedropper',
    use_selection: true,
    keyboard_shortcut: new KeyCombinationWithInfo('c', []),
    listener_calls: [],
    additional_listeners: [
        new MouseUpListener(function mouseup(event: MouseEvent) {
            if (!this.get_store().selectionTool.state.visible) {
                // Create color
                CreateColorAction.create(event)
            }
        }, 0, [],'canvas-container'),
        new KeyboardListener(function delete_all() {
            const colorStore = useColorStore()
            DeleteMultipleColors.create(colorStore.selected_colors)
        }, new KeyCombinationWithInfo('Delete', []))
    ],
    on_activation() {
        document.getElementById('canvas').classList.add('pipetteCursor')
    },
    on_deactivation() {
        document.getElementById('canvas').classList.remove('pipetteCursor')
    },
    selection_changed() {}
}
 