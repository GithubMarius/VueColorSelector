import {KeyCombination} from '@/utils/keyboardinput'

export interface StoreInterface {
    active_tool: ToolInterface
}

export interface ToolInterface {
    // Keybaord Shortcut to activate tool
    keyboard_shortcut: KeyCombination
    
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
interface ListenerCalls {
    [key: string]: Function;
 }

export class Listener {

    static createListeners(obj ,listener_calls: ListenerCalls) {
        return Object.values(listener_calls).map((fcn: Function) => {
            const listener = new Listener(fcn)
            listener.bind(obj)
            return listener
        })
    }

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

    listen() {
        // Adding event listeners to document
        document.addEventListener(<any>this.name, <any>this.fcn)
    }

    mute() {
        // Removing event listeners from document
        document.removeEventListener(<any>this.name, <any>this.fcn)
    }

}

export const BaseWithListenerCreation = {
    listener_calls: <ListenerCalls>{},
    listeners: <Array<Listener>>[],
    create_listeners() {
        this.listeners = Listener.createListeners(this, this.listener_calls)
    },

    listen() {
        this.listeners.forEach(listener => listener.listen())
    },

    mute(){
        this.listeners.forEach(listener => listener.mute())
    }
}

export const BaseTool = {
    active: false,
    activate() {
        // Save as active tool in store, add listeners to document and set active true
        this.add_listeners()
        const store = this.get_store()
        
        store.active_tool?.deactivate()
        store.active_tool = this
        this.active = true
    },
    deactivate() {
        // Set active tool in store to null, remove listeners from document and set active false if this.active
        if (this.active) {
            this.remove_listeners()
            this.get_store().active_tool = null
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
            listener.listen()
        })
    },
    remove_listeners() {
        // Remove bound listeners from document
        this.listeners.forEach( (listener: Listener) => {
            listener.mute()
        })
    },
    create_listeners(tool) {
        console.log(this)
        // Create listener objects from calls and bind this
        this.listeners = this.get_listener_calls().map(fcn => {
            const listener = new Listener(fcn)
            listener.bind(tool)
            return listener
        })
    },
    toggle() {
        if (this.active) {
            this.deactivate()
        } else {
            this.activate()
        }
    },

    listeners: [],
    listener_calls: [],
    get_store: null
}

