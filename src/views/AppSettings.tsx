import DeveloperSettings from '@components/AppSettings/DeveloperSettings/DeveloperSettings'
import NetworkSettings from '@components/AppSettings/NetworkSettings/NetworkSettings'

export interface IProps {
    onChange: (format: string, value: number) => void
    onNetworkSettingsChange: (value: string) => void
    onClickDownload: () => void
    onClickPlaySound: () => void
}

const AppSettings = (props: IProps) => {
    return (
        <div class="w-full flex justify-center align-center flex-col items-center max-w-[1200px]">
            <div class="w-full pb-12">
                <NetworkSettings
                    onChange={(value) => {
                        props.onNetworkSettingsChange(value)
                    }}
                />
            </div>
            <div class="w-full pb-12">
                <DeveloperSettings
                    onClickDownload={props.onClickDownload}
                    onClickPlaySound={props.onClickPlaySound}
                />
            </div>
        </div>
    )
}

export default AppSettings
