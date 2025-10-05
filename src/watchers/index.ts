import { watchDOMContent } from './watchDOMContent'
import { watchGHRequest } from './watchGHRequest'

export const runWatchers = () => {
    watchGHRequest()
    watchDOMContent()
}
