import { FaSolidDownload, FaSolidGraduationCap, FaSolidPlug, FaSolidTrashCan } from 'solid-icons/fa'
import { Component } from 'solid-js'
import { EspWebButton } from '@components/Buttons/EspWebButton/EspWebButton'
import { FlashButton } from '@components/Buttons/FlashButton/FlashButton'
import { Footer } from '@components/Footer/Footer'

export interface IProps {
    onClickBack: () => void
    onClickDownloadFirmware: () => void
    onClickFlashFirmware: () => void
    onClickOpenDocs: () => void
    onClickEraseSoft: () => void
    manifest: string
    checkSameFirmware: (manifest: { name: string }, improvInfo: { firmware: string }) => void
}

const AppSettingsPage: Component<IProps> = (props) => {
    return (
        <div class="flex flex-col justify-between h-full ml-[24px] mr-[24px] ">
            <div class="flex h-full justify-center items-center">
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
                            onClick={props.onClickFlashFirmware}
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
            <Footer onClickSecond={props.onClickBack} secondLabel="Back" />
        </div>
    )
}

export default AppSettingsPage
