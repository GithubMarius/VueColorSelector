import {useHistoryStore} from "@/stores/history";

export interface ActionInterface {

    test: Function
    forward: Function
    undo: Function

}

export abstract class Action {

    constructor() {
    }
    static create<T extends Action, Args extends any[]>(this: {new(...args: Args): T}, ...args: Args)
    {
        const action = new this(...args)
        const historyStore = useHistoryStore()
        return historyStore.perform_action(action)
    }

    abstract forward(): void
    abstract undo(): void
}