import { KeyCombination } from '@/utils/keyboardinput'

export interface Tool {
    // Keybaord Shortcut to activate tool
    keybaord_shortcut: null | KeyCombination
    
    // Icons
    icon: String

    // Boolean active state
    active: Boolean

    // Activate and deactivate tool
    activate(): void
    deactivate(): void

    // Add and remove listeners to document
    add_listeners(): void
    remove_listeners(): void
    listeners: any
    get_store
}

export const BaseTool = {
    active: false,
    activate() {
        // Save as active tool in store, add listeners to document and set active true
        const store = this.get_store()
        store.active_tool?.deactivate()
        store.active_tool = this
        this.add_listeners()
        this.active = true
    },
    deactivate() {
        // Set active tool in store to null, remove listeners from document and set active false if this.active
        if (this.active) {
            const store = this.get_store()
            store.active_tool = null
            this.remove_listeners()
            this.active = false
        }
    },
    add_listeners() {
        // Add listeners to document
        Object.entries(this.listeners).forEach( ([key, entry]) => {
            const bound_listener = (<Function>entry).bind(this)
            this.bound_listeners[key] = bound_listener
            document.addEventListener(key, bound_listener)
        })
    },
    remove_listeners() {
        // Remove bound listeners from document
        Object.entries(this.bound_listeners).forEach( ([key, entry]) => {
            document.removeEventListener(key, <any>entry)
        })
    },
    // Object with listeners
    listeners: {},
    bound_listeners: {},
    get_store: null
}

const FirstTool = <Tool>{
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

const SecondTool = <Tool>{
    ...BaseTool,
    icon: 'bi bi-circle',
    keybaord_shortcut: new KeyCombination('b', []),
    listeners: {
        mousedown() {
            console.log('b')
        },
        mousemove() {
            console.log('hi')
        }
    }
}
