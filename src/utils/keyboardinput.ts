import {reactive} from "vue"
export const allModifiers = {
    shift: 'shiftKey',
    alt: 'altKey',
    ctrl: 'ctrlKey',
    meta: 'metaKey'
}

export type modifiersType = 'shift' | 'alt' | 'cmd'
export const customModifiers: { shift: string[]; alt: string[]; cmd: (string)[] } = {
    shift: [allModifiers.shift],
    alt: [allModifiers.alt],
    cmd: [allModifiers.ctrl, allModifiers.meta]
}

export const modifierLabels = {
    [JSON.stringify(customModifiers.shift)]: 'Shift',
    [JSON.stringify(customModifiers.alt)]: 'Alt',
    [JSON.stringify(customModifiers.cmd)]: 'Ctrl'
}

export class KeyCombination {
    default: Array<Array<string>>

    static bound_combinations: KeyCombination[] = reactive([])
    _fcn: Function

    static check_bound_combinations(event: KeyboardEvent) {
        // Check if key combination is already bound to function call
        this.bound_combinations.forEach(comb => comb.call_if_pressed(event))
    }

    constructor(public key: string, public modifiers = [], public active: Boolean = true) {
        this.default = modifiers
    }

    is_pressed(event: KeyboardEvent) {
        // Check if key and correct modifiers are pressed
        return event.key !== '' && this.key.includes(event.key) && this.modifiers_pressed(event)
    }

    modifiers_pressed(event: KeyboardEvent) {
        // Check if modifiers are pressed
        const pressed_modifiers = this.get_pressed_modifiers(event)
        return this.check_same_length(pressed_modifiers) && this.check_all_modifiers_pressed(pressed_modifiers) // Check modifiers align
    }

    check_all_modifiers_pressed(pressed_modifiers: string[]) {
        // Check if every pressed modifier is also in necessary modifiers
        return pressed_modifiers.every(m => this.modifiers.some(ms => ms.includes(m)))
    }

    get_pressed_modifiers(event: KeyboardEvent) {
        return Object.values(allModifiers).filter(m => event[m]) // Filter for pressed modifiers in of event
    }

    private check_same_length(pressed_modifiers: string[]) {
        // Check if the number of pressed modifiers is correct
        return pressed_modifiers.length === this.modifiers.length
    }

    bind(fcn: Function, target: any = null) {
        KeyCombination.bound_combinations.push(this)
        this._fcn = fcn
        if (target) {
            this._fcn = this._fcn.bind(target)
        }
    }

    call_if_pressed(event: KeyboardEvent) {
        if (this.active && this.is_pressed(event)) {
            this._fcn(event)
        }
    }

    mute() {
        this.active = false
    }

    listen() {
        this.active = true
    }

    static get combinations() {
        // Returns bound combinations
        return KeyCombination.bound_combinations.filter(comb => comb instanceof this)
    }

}

export class KeyCombinationWithInfo extends KeyCombination {
    constructor(public key: string, public modifiers = [], public description: string='', public active: Boolean = true) {
        super(key, modifiers, active);
    }
}