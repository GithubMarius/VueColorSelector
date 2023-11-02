import { KeyCombination } from '@/utils/keyboardinput'



export const colorsTool = {
    icon: 'bi bi-palette',
    keyboard_shortcut: new KeyCombination('c', []),
    listener_calls: [
        function mousemove() {
            console.log('hi')
    },
        function mouseup() {console.log('up')}
    ]
}
 