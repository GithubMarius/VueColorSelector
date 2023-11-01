import { ToolInterface, BaseToolWithSelection } from '@/utils/tooldir/helpers'
import { KeyCombination } from '@/utils/keyboardinput'

export const referenceTool = <ToolInterface>{
    ...BaseToolWithSelection,
    icon: 'bi bi-circle',
    keybaord_shortcut: new KeyCombination('a', []),
    listener_calls: [
        function mousemove() {console.log('hi')},
        function mouseup() {console.log('up')}
    ]
}
