import { NOTIFICATION_TYPE } from './enums'

export interface ToastOptions {
    description?: string
    duration?: number
}

export interface IToast extends ToastOptions {
    type: NOTIFICATION_TYPE
    id: number
    message: string
    duration: number
}
