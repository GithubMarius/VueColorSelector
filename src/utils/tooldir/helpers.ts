import { KeyCombination } from '@/utils/keyboardinput'

export interface StoreInterface {
    active_tool: ToolInterface
}

export interface ToolInterface {
    // Keybaord Shortcut to activate tool
    keybaord_shortcut: null | KeyCombination
    
    // Icons
    icon: String

    // Boolean active state
    active: Boolean

    // Activate and deactivate tool
    activate(): void
    deactivate(): void

    // Get, add and remove listeners to document
    add_listeners(): void
    create_listeners(): void
    remove_listeners(): void
    listener_calls: Function[]
    listeners: Listener[]

    // Get store
    get_store(): any | StoreInterface
}

class Listener {
    fcn: Function
    name: String

    constructor(fcn: Function) {
        this.fcn = fcn
        this.name = <String>fcn.name
    }

    bind(target) {
        // Bind target to fcn
        this.fcn = this.fcn.bind(target)
    }

    add() {
        // Adding event listeners to document
        document.addEventListener(<any>this.name, <any>this.fcn)
    }

    remove() {
        // Removing event listeners from document
        document.removeEventListener(<any>this.name, <any>this.fcn)
    }
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
    get_listener_calls() {
        // Return all listener calls (adjust in case additional should be added)
        return this.listener_calls
    },
    add_listeners() {
        // Add listeners to document
        this.listeners.forEach( (listener: Listener) => {
            listener.add()
        })
    },
    remove_listeners() {
        // Remove bound listeners from document
        this.listeners.forEach( (listener: Listener) => {
            listener.remove()
        })
    },
    create_listeners() {
        // Create listener objects from calls and bind this
        this.listeners = this.get_listener_calls().map(fcn => {
            const listener = new Listener(fcn)
            listener.bind(this)
            return listener
        })
    },

    listeners: [],
    listener_calls: [],
    get_store: null
}

export const BaseToolWithSelection = {
    // Add selection to tool
    ... BaseTool,
    selection_listener_calls: [
        function keydown() {},
        function mousedown() {},
        function mousemove() {},
        function mouseup() {}
    ],
    get_selection_listener_calls() {
        return this.listener_calls.concat(this.selection_listener_calls)
    },
    get_listener_calls() {
        // Return all listener calls (adjust in case additional should be added)
        return this.get_selection_listener_calls()
    }
}