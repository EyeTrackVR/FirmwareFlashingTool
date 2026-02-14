import { enableNotifications } from '@store/notifications/selectors'

export const handleSound = async (
    soundfile_mp: string,
    soundfile_ogg?: string,
    soundfile_ma?: string,
) => {
    if (!enableNotifications()) return
    if (!soundfile_ogg) soundfile_ogg = soundfile_mp
    if (!soundfile_ma) soundfile_ma = soundfile_mp
    if ('Audio' in window) {
        const a = new Audio()
        if (a.canPlayType && a.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''))
            a.src = ('audio/' + soundfile_ogg) as string
        else if (a.canPlayType && a.canPlayType('audio/mpeg;').replace(/no/, ''))
            a.src = ('audio/' + soundfile_mp) as string
        else if (a.canPlayType && a.canPlayType('audio/mp4; codecs="mp4a.40.2"').replace(/no/, ''))
            a.src = ('audio/' + soundfile_ma) as string
        else a.src = ('audio/' + soundfile_mp) as string

        a.play()
        return
    }
}
