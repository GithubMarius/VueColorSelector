import {KeyCombination} from '@/utils/keyboardinput'
import {reactive, toRaw} from "vue";
import {useToastStore} from "@/stores/toasts";

export interface StoreInterface {
    active_tool: ToolInterface
}

export interface ToolInterface {
    // Name
    name: String

    // Keyboard shortcut to activate tool
    keyboard_shortcut: KeyCombination

    // Icons
    icon: String

    // state
    state: null | {
        active: Boolean
    }

    // Activate and deactivate tool
    activate(): void

    deactivate(): void

    // Get, add and remove listeners to document
    create_listeners(): void

    listen(): void

    mute(): void

    listener_calls: Function[]
    listeners: Listener[]

    // Using selection?
    with_selection: Boolean

    // Get store
    get_store(): any | StoreInterface
}

interface ListenerCalls {
    [key: string]: Function;
}

export class Listener {

    static createListeners(obj: any, listener_calls: ListenerCalls) {
        return Object.values(listener_calls).map((fcn: Function) => {
            const listener = new Listener(fcn)
            listener.bind(obj)
            return listener
        })
    }

    fcn: Function
    name: String

    constructor(fcn: Function, public id: null | string = null, public className: null | string = null) {
        this.fcn = fcn
        this.name = <String>fcn.name
    }

    bind(target: any) {
        // Bind target to fcn
        this.fcn = this.fcn.bind(target)
    }

    listen() {
        // Adding event listeners to document
        this.target.addEventListener(<any>this.name, <any>this.fcn)
    }

    mute() {
        // Removing event listeners from document
        this.target.removeEventListener(<any>this.name, <any>this.fcn)
    }

    get target() {
        if (!this.id) {
            return document
        } else {
            return document.getElementById(this.id)
        }
    }
}

export class KeyboardListener {

    constructor(public fcn: Function, public combination: KeyCombination) {
        this.mute()
    }

    listen() {
        this.combination.listen()
    }

    mute() {
        this.combination.mute()
    }

    bind(target: any) {
        this.combination.bind(this.fcn, target)
    }

}

export const BaseWithListenerCreation = {
    state: null,
    listener_calls: <ListenerCalls>{},
    listeners: <Array<Listener>>[],
    additional_listeners: <Array<Listener | KeyboardListener>>[],
    create_listeners() {
        this.state =
            reactive({
                active: false
            })
        this.additional_listeners.forEach((listener: Listener | KeyboardListener) => listener.bind(this))
        this.listeners = Listener.createListeners(this, this.listener_calls).concat(this.additional_listeners)
    },

    listen() {
        this.listeners.forEach((listener: Listener | KeyboardListener) => listener.listen())
    },

    mute() {
        this.listeners.forEach((listener: Listener | KeyboardListener) => listener.mute())
    },
}

export const BaseTool = {
    ...BaseWithListenerCreation,

    activate(this: typeof BaseWithListenerCreation | typeof BaseTool) {
        const store = this.get_store()
        if (toRaw(store.activeTool) !== this) {
            store.activeTool?.deactivate()
            store.activeTool = this
            if (this.use_selection) {
                store.selectionTool.state.active = true
            }

            this.state.active = true
            this.listen()

            const toastStore = useToastStore()
            toastStore.push_info(this.name)
        }
    },
    deactivate(this: typeof BaseWithListenerCreation | typeof BaseTool) {
        const store = this.get_store()
        store.selectionTool.state.active = false
        store.selectionTool.trigger_drop_from_selection()
        store.activeTool = null
        this.state.active = false
        this.mute()
    },
    get_store: null
}
