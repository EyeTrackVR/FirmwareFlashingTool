import Button from '@components/Buttons/Button'
import ComingSoon from '@components/ComingSoon'

const VrcftSettings = () => {
    return (
        <div class="w-full pr-24 pt-8 flex flex-col gap-12">
            <div class="w-full flex flex-row justify-end ">
                <Button label="Reset Settings to Default" isDangerous />
            </div>
            <ComingSoon />
        </div>
    )
}

export default VrcftSettings
