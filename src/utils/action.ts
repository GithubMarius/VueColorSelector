export interface ActionInterface {

    forward: Function
    undo: Function

}

export class Action implements ActionInterface {

    forward() {}
    undo() {}

    constructor(..._) {}

    static createAndPerformAction(...args) {
        // Add action, perform action and return it
        const action = new this(...args)
        action.forward()
        return action
    }

}