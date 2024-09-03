import ModalHeader from '@components/ModalHeader/Index'

export const QuestionMarkModal = () => {
    return (
        <div class="w-[350px] bg-[#0D1B26] p-[12px] rounded-[12px] border border-solid border-[#192736] z-10">
            <div class="flex flex-col gap-[14px]">
                <ModalHeader label="Build Types" />
                <div class="flex flex-col gap-[4px]">
                    <div>
                        <p class="text-left text-[14px] text-[#9793FD] font-medium leading-[20px] not-italic">
                            Debug
                        </p>
                    </div>
                    <div>
                        <p class="text-left text-[12px] text-white font-normal leading-[20px] not-italic">
                            The debug environment is the default environment and does not need to be
                            specified. It has a lot of logging so it is useful for getting
                            everything setup for the first time and to see what is going on.
                        </p>
                    </div>
                </div>
                <div class="flex flex-col gap-[4px]">
                    <div>
                        <p class="text-left text-[14px] text-[#9793FD] font-medium leading-[20px] not-italic">
                            _release
                        </p>
                    </div>
                    <div>
                        <p class="text-left text-[12px] text-white font-normal leading-[20px] not-italic">
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
