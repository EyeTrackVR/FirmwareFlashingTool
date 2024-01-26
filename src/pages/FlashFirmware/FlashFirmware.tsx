import { FaSolidDownload, FaSolidGraduationCap, FaSolidPlug, FaSolidTrashCan } from 'solid-icons/fa'
import { Component } from 'solid-js'
import { EspWebButton } from '@components/Buttons/EspWebButton/EspWebButton'
import { FlashButton } from '@components/Buttons/FlashButton/FlashButton'
import { Footer } from '@components/Footer/Footer'
import { APMode } from '@pages/APMode/APMode'
import { TITLEBAR_ACTION } from '@src/static/types/enums'

export interface IProps {
    onClickBack: () => void
    onClickDownloadFirmware: () => void
    onClickOpenDocs: () => void
    onClickEraseSoft: () => void
    onClickConfigurAPMode: () => void
    manifest: string
    checkSameFirmware: (manifest: { name: string }, improvInfo: { firmware: string }) => void
    onClickOpenModal: (id: string) => void
    onClickHeader: (action: TITLEBAR_ACTION) => void
    onClickEnableAPMode: () => void
    isUSBBoard: boolean
    isAPModeActive: boolean
}

const AppSettingsPage: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col justify-between h-full mr-[24px] ml-[24px]">
            <div class="flex flex-col h-full justify-center items-center">
                <div class="flex flex-col gap-[10px]">
                    <div class="flex flex-row">
                        <APMode
                            isAPModeActive={props.isAPModeActive}
                            onClickOpenModal={props.onClickOpenModal}
                            onClickHeader={props.onClickHeader}
                            onClickEnableAPMode={props.onClickEnableAPMode}
                            onClickConfigurAPMode={props.onClickConfigurAPMode}
                        />
                    </div>
                    <div class="bg-[#0D1B26] w-auto p-[24px] flex flex-col gap-[22px] rounded-[24px] border-solid border-1 border-[#192736]">
                        <div>
                            <p class="text-white font-[500] leading-[20px] text-[20px] not-italic text-left">
                                Flash settings
                            </p>
                        </div>
                        <div class="grid grid-cols-2 grid-rows-2 min-[800px]:grid-rows-1 min-[800px]:grid-cols-4 grid-flow-col gap-[16px]">
                            <FlashButton
                                step="1/2"
                                label="Download firmware assets"
                                onClick={props.onClickDownloadFirmware}
                                img={<FaSolidDownload size={48} fill="#FFFFFFe3" />}
                            />
                            <EspWebButton
                                step="2/2"
                                label="Flash mode"
                                img={<FaSolidPlug size={48} fill="#FFFFFFe3" />}
                                manifest={props.manifest}
                                checkSameFirmware={props.checkSameFirmware}
                            />
                            <FlashButton
                                label="Open ETVR Docs"
                                onClick={props.onClickOpenDocs}
                                img={<FaSolidGraduationCap size={48} fill="#FFFFFFe3" />}
                            />
                            <FlashButton
                                label="Erase Firmware Assets"
                                onClick={props.onClickEraseSoft}
                                img={<FaSolidTrashCan size={48} fill="#FFFFFFe3" />}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <Footer
                onClickSecond={props.onClickBack}
                secondLabel={props.isUSBBoard ? 'Select board' : 'Configure network'}
            />
        </div>
    )
}

export default AppSettingsPage
