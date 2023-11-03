import { appLogDir } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/api/shell'
import { FaSolidScroll } from 'solid-icons/fa'
import { createSignal } from 'solid-js'
import { debug } from 'tauri-plugin-log-api'
import CustomButton from '@components/CustomButton'

export const ConfigButton = () => {
    const [isButtonActive, setIsButtonActive] = createSignal(false)

    const handleConfigDir = () => {
        appLogDir().then((dir) => {
            debug(`[Config Button]: ${dir}`)
            open(dir).then(() => console.log('opened'))
        })
    }

    return (
        <CustomButton
            isButtonActive={isButtonActive()}
            tooltip="Open Config Dir"
            icon={<FaSolidScroll size={45} fill="#FFFFFFe3" />}
            onClick={(isActive) => {
                setIsButtonActive(isActive)
                handleConfigDir()
            }}
        />
    )
}
