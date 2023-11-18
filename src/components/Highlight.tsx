import HighlightJS from '@static/highlight.js/lib/core'
import json from '@static/highlight.js/lib/languages/json'
import { Component, createMemo } from 'solid-js'

// Then register the languages you need
HighlightJS.registerLanguage('json', json)

const Highlight: Component<{ children: any }> = (props) => {
    const getHighlightedCode = createMemo(() => {
        const result = HighlightJS.highlight(props.children, {
            language: 'json',
            ignoreIllegals: true,
        })
        return result.value
    })

    return (
        <pre>
            <code class="hljs json rounded-xl" innerHTML={getHighlightedCode()} />
        </pre>
    )
}

export default Highlight
