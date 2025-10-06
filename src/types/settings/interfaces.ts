import { NOTIFICATION_ACTION } from '../notifications/enums'

export * as O from 'fp-ts/Option'

export type PersistentSettings = {
    user?: string
    enableNotificationsSounds?: boolean
    enableNotifications?: boolean
    globalNotificationsType?: NOTIFICATION_ACTION
    debugMode?: string
}
