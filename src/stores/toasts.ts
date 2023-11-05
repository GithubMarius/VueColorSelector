import {defineStore} from "pinia"


export interface ToastInterface {
    type: string
    msg: string
    visible: boolean
    timeout: number
}

class Toast implements ToastInterface {
    constructor(
        public type: string,
        public msg: string,
        public timeout: number = 3000,
        public visible: boolean = true
    ) {
    }
}

class ErrorToast extends Toast {
    constructor(msg: string) {
        super('error', msg, 10000)
    }

}

class SuccessToast extends Toast {
    constructor(msg: string, timeout: number = 3000) {
        super('success', msg, timeout)
    }
}

class InfoToast extends Toast {
    constructor(msg: string, timeout: number = 1000) {
        super('info', msg, timeout)
    }

}


export const useToastStore = defineStore("toasts", {
    state: () => {
        return {
            toasts: <ToastInterface[]>[]
        }
    },
    actions: {
        push_success(msg: string, ...timeout) {
            this.toasts.push(new SuccessToast(msg, ...timeout))
        },
        push_error(msg: string) {
            this.toasts.push(new ErrorToast(msg))
        },
        push_info(msg: string) {
            this.toasts.push(new InfoToast(msg))
        }
    }
})