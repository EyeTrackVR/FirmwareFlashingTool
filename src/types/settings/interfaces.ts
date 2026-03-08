import { NOTIFICATION_ACTION } from '../notifications/enums'

export type PersistentSettings = {
    settings?: PersistentSettings
    user?: string
    enableNotificationsSounds?: boolean
    enableNotifications?: boolean
    globalNotificationsType?: NOTIFICATION_ACTION
    debugMode?: string
}
