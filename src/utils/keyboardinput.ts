const allModifiers = {
    shift: 'shiftKey',
    alt: 'altKey',
    ctrl: 'ctrlKey',
    meta: 'metaKey'
}

export const customModifiers = {
    shift: [allModifiers.shift],
    alt: [allModifiers.alt],
    cmd: [allModifiers.ctrl, allModifiers.meta]
}

export class KeyCombination {
    default: Array<Array<string>>
    static bound_combinations = []
    _fcn: Function

    static check_bound_combinations(event: KeyboardEvent) {
        // Check if key combination is already bound to function call
        this.bound_combinations.forEach(comb => comb.call_if_pressed(event))
    }

    constructor(public key, public modifiers = []) {
        this.default = modifiers
    }
    is_pressed(event: KeyboardEvent) {
        // Check if key and correct modifiers are pressed
        return event.key !== '' && this.key.includes(event.key) && this.modifers_pressed(event)
    }

    private modifers_pressed(event: KeyboardEvent) {
        // Check if modifiers are pressed
        const pressed_modifiers = Object.values(allModifiers).filter(m => event[m]) // Filter for pressed modifers in of event
        return this.check_same_length(pressed_modifiers) && this.check_all_modifiers_pressed(pressed_modifiers) // Check modifiers align
    }

    private check_all_modifiers_pressed(pressed_modifiers: string[]) {
        // Check if every pressed modifier is also in necessary modifiers
        return pressed_modifiers.every(m => this.modifiers.some(ms => ms.includes(m)))
    }

    private check_same_length(pressed_modifiers: string[]) {
        // Check if the number of pressed modifiers is correct
        return pressed_modifiers.length === this.modifiers.length
    }

    bind(fcn: Function) {
        KeyCombination.bound_combinations.push(this)
        this._fcn = fcn
    }

    call_if_pressed(event: KeyboardEvent) {
        if (this.is_pressed(event)) {
            this._fcn(event)
        }
    }
}