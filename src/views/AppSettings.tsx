import DeveloperSettings from '@components/AppSettings/DeveloperSettings'
import FlashFirmware from '@components/AppSettings/FlashFirmware'
import NetworkSettings from '@components/AppSettings/NetworkSettings'

export interface IProps {
    onChange: (format: string, value: number) => void
    onNetworkSettingsChange: (value: string) => void
}

const AppSettings = (props: IProps) => {
    return (
        <div class="w-full flex justify-center align-center flex-col items-center max-w-[1200px]">
            <div class="w-full pb-12">
                <FlashFirmware />
            </div>
            <div class="w-full pb-12">
                <DeveloperSettings />
            </div>
            <div class="w-full pb-12">
                <NetworkSettings
                    onChange={(value) => {
                        props.onNetworkSettingsChange(value)
                    }}
                />
            </div>
        </div>
    )
}

export default AppSettings
