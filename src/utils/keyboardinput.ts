import {reactive} from "vue"
export const allModifiers = {
    shift: 'shiftKey',
    alt: 'altKey',
    ctrl: 'ctrlKey',
    meta: 'metaKey'
}

export const specialKeys = {
    number: '0123456789',
    plusMinus: '+-'
}
export const specialKeysDisplay = {
    [specialKeys.number]: '0-9',
    [specialKeys.plusMinus]: '+/-'
}

export function get_display_string_for_key_of_combination(key: string): string {
    return (key in specialKeysDisplay) ? specialKeysDisplay[key] : key
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

export function get_pressed_modifiers(event: KeyboardEvent | MouseEvent) {
    return Object.values(allModifiers).filter(m => event[m]) // Filter for pressed modifiers in of event
}

export function check_modifiers_pressed(event: KeyboardEvent | MouseEvent, necessary_modifiers: modifiersType[]) {
    const pressed_modifiers = get_pressed_modifiers(event)
    return check_pressed_vs_necessary_modifiers(pressed_modifiers, necessary_modifiers)
}

export function check_pressed_vs_necessary_modifiers(pressed_modifiers: string[], necessary_modifiers: modifiersType[]): boolean {
    return (pressed_modifiers.length === necessary_modifiers.length) &&
        pressed_modifiers.every(m => necessary_modifiers.some(ms => customModifiers[ms].includes(m)))
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

    get modifiers_as_strings() {
        return this.modifiers.map((modifier: modifiersType) => modifierLabels[JSON.stringify(modifier)])
    }

    is_pressed(event: KeyboardEvent) {
        // Check if key and correct modifiers are pressed
        return this.check_key(event.key) && this.modifiers_pressed(event)
    }

    check_key(key: string): boolean {
        if (key !== '') {
            return Object.values(specialKeys).includes(this.key) ? this.key.includes(key) : this.key === key
        } else {
            return false
        }
    }

    modifiers_pressed(event: KeyboardEvent) {
        // Check if modifiers are pressed
        const pressed_modifiers = get_pressed_modifiers(event)
        return this.check_same_length(pressed_modifiers) && this.check_all_modifiers_pressed(pressed_modifiers) // Check modifiers align
    }

    check_all_modifiers_pressed(pressed_modifiers: string[]) {
        // Check if every pressed modifier is also in necessary modifiers
        return pressed_modifiers.every(m => this.modifiers.some(ms => ms.includes(m)))
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
            this.trigger(event)
        }
    }

    mute() {
        this.active = false
    }

    listen() {
        this.active = true
    }

    trigger(event: KeyboardEvent) {
        this._fcn(event)
    }

    static get combinations(): KeyCombination[] {
        // Returns bound combinations
        return KeyCombination.bound_combinations.filter(comb => comb instanceof this)
    }
}

export class KeyCombinationWithInfo extends KeyCombination {
    constructor(public key: string, public modifiers = [], public description: string='', public active: Boolean = true) {
        super(key, modifiers, active);
    }
}