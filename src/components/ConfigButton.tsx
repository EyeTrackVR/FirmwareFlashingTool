import { appLogDir } from '@tauri-apps/api/path'
import { open } from '@tauri-apps/api/shell'
import { FaSolidScrollTorah } from 'solid-icons/fa'
import { createSignal } from 'solid-js'
import CustomButton from '@components/CustomButton'

export const ConfigButton = () => {
    const [isButtonActive, setIsButtonActive] = createSignal(false)

    const handleConfigDir = () => {
        appLogDir().then((dir) => {
            console.log(dir)
            open(dir).then(() => console.log('opened'))
        })
    }
    return (
        <CustomButton
            isButtonActive={isButtonActive()}
            tooltip="Erase Firmware Assets"
            icon={<FaSolidScrollTorah size={45} fill="#FFFFFFe3" />}
            onClick={(isActive) => {
                setIsButtonActive(isActive)
                handleConfigDir()
            }}
        />
    )
}
