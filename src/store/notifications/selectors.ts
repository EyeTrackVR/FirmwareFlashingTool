import { notificationsState } from './notifications'
import { createStoreSelectors } from '@store/utils'

export const {
    enableNotificationsSounds,
    enableNotifications,
    globalNotificationsType,
    notifications,
} = createStoreSelectors(notificationsState)
