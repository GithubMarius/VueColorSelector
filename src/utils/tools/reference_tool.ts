import { ToolInterface } from '@/utils/tools/helpers'
import { KeyCombination } from '@/utils/keyboardinput'

export const referenceTool = {
    icon: 'bi bi-circle',
    keyboard_shortcut: new KeyCombination('a', []),
    listener_calls: [
        function mousemove() {console.log('hi')},
        function mouseup() {console.log('up')}
    ]
}
