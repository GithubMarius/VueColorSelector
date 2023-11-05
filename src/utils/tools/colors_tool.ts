import {KeyCombination} from '@/utils/keyboardinput'
import {BaseTool, KeyboardListener, Listener, ToolInterface} from "@/utils/tools/helpers";
import {useHistoryStore} from "@/stores/history";
import {useColorStore} from "@/stores/color";

export const colorsTool = <ToolInterface>{
    ...BaseTool,
    name: 'Colors Tool',
    icon: 'bi bi-palette',
    use_selection: true,
    keyboard_shortcut: new KeyCombination('c', []),
    listener_calls: [
        function mousemove() {
        },
        function keyup(event) {
        }
    ],
    additional_listeners: [
        new Listener(function mouseup(event: MouseEvent) {
            // Create color
            if (event.button === 0) {
                const historyStore = useHistoryStore()
                historyStore.add_color(event)
            }
        }, 'canvas-container'),
        new KeyboardListener(function delete_all(event: KeyboardEvent) {
            const historyStore = useHistoryStore()
            const colorStore = useColorStore()
            historyStore.delete_selected_colors(colorStore.selected_colors)
        }, new KeyCombination('Delete', []))
    ]
}
 