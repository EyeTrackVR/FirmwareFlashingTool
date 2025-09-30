import { createStoreSelectors } from '@store/utils'
import { notificationsState } from './notifications'

export const {
    enableNotifications,
    enableNotificationsSounds,
    globalNotificationsType,
    notifications,
} = createStoreSelectors(notificationsState)
