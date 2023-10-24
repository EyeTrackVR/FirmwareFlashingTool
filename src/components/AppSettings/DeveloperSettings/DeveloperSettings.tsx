import Button from '@components/Button'
import { EraseButton } from '@components/Button/EraseButton'
import { OpenDocs } from '@components/Button/OpenDocs'
import { WebSerial } from '@components/Button/WebSerial'
import FirmwareList from '@components/Selection/FirmwareList'

export interface IProps {
    onClickDownload: () => void
    onClickPlaySound: () => void
}

const FlashSettings = (props: IProps) => {
    return (
        <div class="flex grow rounded-xl flex-col pl-4 pr-4 pb-4 pt-4 bg-[#333742]">
            <div>
                <div class="pb-6 pl-3 pr-3">
                    <p class="text-start text-2xl">Developer settings</p>
                </div>
            </div>
            <div class="flex justify-center flex-wrap">
                <div>
                    <EraseButton />
                </div>
                <div>
                    <WebSerial />
                </div>
                <div>
                    <OpenDocs />
                </div>
                <div>
                    <Button
                        color="#0071fe"
                        shadow="#0071fe"
                        text=" Download Release Asset"
                        onClick={props.onClickDownload}
                    />
                </div>
                <div>
                    <Button
                        color="#0071fe"
                        shadow="#0071fe"
                        text="Play Sound"
                        onClick={props.onClickPlaySound}
                    />
                </div>
            </div>
            <div>
                <FirmwareList />
            </div>
        </div>
    )
}
export default FlashSettings
