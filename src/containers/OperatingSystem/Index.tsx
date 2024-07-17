import { createEffect } from 'solid-js'
import { Titlebar } from '@components/Titlebar/Titlebar'
import { operatingSystemModal } from '@src/static'
import { checkSystem } from '@src/utils'

const OperatingSystem = () => {
    createEffect(() => {
        const system = checkSystem()

        if (/Linux/.test(system!)) {
            const el = document.getElementById(operatingSystemModal)
            if (el instanceof HTMLDialogElement) {
                el.showModal()
            }
        }
    })

    return (
        <dialog id={operatingSystemModal} class="modal">
            <Titlebar onClickHeader={() => {}} />
            <div class="modal-box w-auto h-auto bg-transparent overflow-visible">
                <div class="w-[500px] bg-[#0D1B26] p-[12px] rounded-[12px] border border-solid border-[#192736] z-10">
                    <div class="flex flex-col gap-[14px]">
                        <div class="flex flex-col gap-[14px]">
                            <p class="text-left text-[18px] text-[#9793FD] font-medium leading-[20px] not-italic">
                                Important!
                            </p>
                            <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                                Currently there is no available support.
                            </p>
                            <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                                Try accessing the system from a supported platform such as
                                <code class="code"> Windows, macOS, iOS</code>. Thank you for your
                                understanding.
                            </p>
                            <p class="text-left text-[14px] text-white font-normal leading-[26px] not-italic">
                                Stay tuned for future updates!.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </dialog>
    )
}

export default OperatingSystem
