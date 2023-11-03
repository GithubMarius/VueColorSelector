import {defineStore} from "pinia"


export interface ToastInterface {
    type: string
    msg: string
    error: any
    source: any
    visible: boolean
    timeout: number
}

class Toast implements ToastInterface {
    constructor(
        public type: string,
        public msg: string,
        public timeout: number = 3000,
        public error: any = null,
        public source: any = null,
        public visible: boolean = true,
    ) {
        console.log(this.timeout)
    }
}
export const useToastStore = defineStore("toasts", {
    state: () => {
        return {
            toasts: []
        }
    },
    actions: {
        add_toast() {
            this.toasts.push(new Toast(...arguments))
        }
    }
})