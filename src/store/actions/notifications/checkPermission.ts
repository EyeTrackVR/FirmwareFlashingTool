import { setEnableNotifications } from '@store/notifications/notifications'
import { isPermissionGranted, requestPermission } from '@tauri-apps/plugin-notification'

export const checkPermission = async () => {
    let permissionGranted = await isPermissionGranted()
    if (!permissionGranted) {
        const permission = await requestPermission()
        permissionGranted = permission === 'granted'
    }
    setEnableNotifications(permissionGranted)
}
