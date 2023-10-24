import Input from '@components/input'

export interface IProps {
    onChange: (value: string) => void
}

const NetworkSettings = (props: IProps) => {
    return (
        <div>
            <form action="#" class="flex grow rounded-xl flex-col pl-4 pr-4 pb-4 pt-4 bg-[#333742]">
                <div>
                    <div class="pb-6 pl-3 pr-3">
                        <p class="text-start text-2xl">Network settings</p>
                        <div class="text-white flex flex-col items-center justify-center h-full w-full p-2">
                            <div class="card rounded-md bg-slate-700">
                                <h1 class="text-2xl font-bold">Coming Soon</h1>
                                <p class="mt-4 text-gray-400 text-lg">😞</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <Input
                        onChange={props.onChange}
                        placeholder="ssid"
                        header="SSID"
                        type="text"
                        id="ssid"
                        required={true}
                    />
                </div>
                <div>
                    <Input
                        onChange={props.onChange}
                        placeholder="password"
                        header="WiFi Password"
                        type="text"
                        id="password"
                        required={true}
                    />
                </div>
                <div>
                    <Input
                        onChange={props.onChange}
                        placeholder="password"
                        header="Confirm Password"
                        type="text"
                        id="confirmPassword"
                        required={true}
                    />
                </div>
                <div class="flex justify-end">
                    <button
                        type="submit"
                        class="text-white max-w-40 w-full bg-blue-700 hover:bg-blue-800 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 ">
                        Save
                    </button>
                </div>
            </form>
        </div>
    )
}
export default NetworkSettings
