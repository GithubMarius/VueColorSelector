import { Tool, BaseTool } from '@/utils/tooldir/helpers'
import { KeyCombination } from '@/utils/keyboardinput'

export const referenceTool = <Tool>{
    ...BaseTool,
    icon: 'bi bi-circle',
    keybaord_shortcut: new KeyCombination('a', []),
    listeners: {
        mousedown() {
            console.log('a')
        },
        mousemove() {
            console.log('hi')
        }
    }
}
