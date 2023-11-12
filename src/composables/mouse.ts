import {onMounted, onUnmounted, ref} from "vue"
import {check_pressed_vs_necessary_modifiers, customModifiers, get_pressed_modifiers} from "@/utils/keyboardinput";

export function mouseStatesComposable(){

    const shift = ref(false)
    const alt = ref(false)
    const cmd = ref(false)


    function update_mouse_states(event: KeyboardEvent|MouseEvent) {
        const pressed_modifiers = get_pressed_modifiers(event)

        const shiftPressed = check_pressed_vs_necessary_modifiers(pressed_modifiers, ['shift'])
        const altPressed = check_pressed_vs_necessary_modifiers(pressed_modifiers, ['alt'])
        const cmdPressed = check_pressed_vs_necessary_modifiers(pressed_modifiers, ['cmd'])

        shift.value = shiftPressed
        alt.value = altPressed
        cmd.value = cmdPressed
        if (altPressed) {
            event.preventDefault()
        }
    }

    const event_types = ['keydown', 'keyup']

    onMounted(() => event_types.forEach(type =>
        document.addEventListener(type, update_mouse_states, {capture: true})))
    onUnmounted(() => event_types.forEach(type =>
        document.removeEventListener(type, update_mouse_states, {capture: true})))

    return { shift, alt, cmd }
}