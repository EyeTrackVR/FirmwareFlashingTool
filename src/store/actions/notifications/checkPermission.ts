import { setEnableNotifications } from '@store/notifications/notifications'
import { isPermissionGranted, requestPermission } from '@tauri-apps/plugin-notification'

export const checkPermission = async () => {
    // for some god forsaken reason webkit does not support it
    // and will happily crash on you with null pointer :)
    if (navigator.userAgent.toLowerCase().includes('linux')){
        return
    }

    let permissionGranted = await isPermissionGranted()
    if (!permissionGranted) {
        const permission = await requestPermission()
        permissionGranted = permission === 'granted'
    }
    setEnableNotifications(permissionGranted)
}
