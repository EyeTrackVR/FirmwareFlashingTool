import Button from '@components/Buttons/Button'

const AlgorithmTrackingSettings = () => {
    return (
        <div class="w-full pr-24 pt-8 flex flex-col gap-12">
            <div class="w-full flex flex-row justify-end ">
                <Button label="Reset settings to default" isDangerous />
            </div>
        </div>
    )
}

export default AlgorithmTrackingSettings
