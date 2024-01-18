import { FaSolidXmark } from 'solid-icons/fa'

export const QuestionMarkModal = () => {
    return (
        <div class=" w-[350px] bg-[#0D1B26] p-[12px] rounded-[12px] border border-solid border-[#192736] z-10">
            <div class="flex flex-col gap-[14px]">
                <div class="flex justify-between">
                    <div>
                        <p class="text-left text-[18px] text-white font-[500] leading-[20px] not-italic">
                            Build Types
                        </p>
                    </div>
                    <div class="modal-action mt-0">
                        <form method="dialog">
                            <button class="cursor-pointer p-[4px]  rounded-full border border-solid border-[#0D1B26] focus-visible:border-[#9793FD]">
                                <p class="text-white text-left">
                                    <FaSolidXmark size={20} fill="#FFFFFF" />
                                </p>
                            </button>
                        </form>
                    </div>
                </div>
                <div class="flex flex-col gap-[4px]">
                    <div>
                        <p class="text-left text-[14px] text-[#9793FD] font-[500] leading-[20px] not-italic">
                            Debug
                        </p>
                    </div>
                    <div>
                        <p class="text-left text-[12px] text-white font-[500] leading-[20px] not-italic">
                            The debug environment is the default environment and does not need to be
                            specified. It has a lot of logging so it is useful for getting
                            everything setup for the first time and to see what is going on.
                        </p>
                    </div>
                </div>
                <div class="flex flex-col gap-[4px]">
                    <div>
                        <p class="text-left text-[14px] text-[#9793FD] font-[500] leading-[20px] not-italic">
                            _release
                        </p>
                    </div>
                    <div>
                        <p class="text-left text-[12px] text-white font-[500] leading-[20px] not-italic">
                            Has a lot less debugging, may also be missing some things available only
                            in debug for debug purposes, this should be flashed when everything is
                            working.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default QuestionMarkModal
