export const apiTextParser = <T>(responseBuffer: string): T => {
    let cleanBuffer = responseBuffer.replace(/\x1b\[[0-9;]*m/g, '')
    cleanBuffer = cleanBuffer.replace(/\r/g, '')

    let startIdx = cleanBuffer.indexOf('{')

    while (startIdx >= 0) {
        let braceCount = 0
        let endIdx = -1

        for (let i = startIdx; i < cleanBuffer.length; i++) {
            if (cleanBuffer[i] === '{') {
                braceCount++
            } else if (cleanBuffer[i] === '}') {
                braceCount--
                if (braceCount === 0) {
                    endIdx = i + 1
                    break
                }
            }
        }

        if (endIdx > startIdx) {
            let jsonStr = cleanBuffer.slice(startIdx, endIdx)

            let cleanJson = jsonStr.replace(/\t/g, ' ').replace(/\n/g, ' ').replace(/\r/g, '')
            cleanJson = cleanJson.replace(/\s+/g, ' ')

            const response = JSON.parse(cleanJson)

            if (response.result) {
                return JSON.parse(response.result)
            }

            startIdx = cleanBuffer.indexOf('{', endIdx)
        } else {
            break
        }
    }

    return cleanBuffer as unknown as T
}

export const stringTextParser = (response: string) => {
    return response.split(/}(?={)/).map((p) => p + (p.endsWith('}') ? '' : '}'))
}

export const parseMultiJSON = (input: string): any[] => {
    const results: any[] = []
    let depth = 0
    let start: number | null = null

    for (let i = 0; i < input.length; i++) {
        if (input[i] === '{') {
            if (depth === 0) start = i
            depth++
        } else if (input[i] === '}') {
            depth--
            if (depth === 0 && start !== null) {
                const chunk = input.slice(start, i + 1)
                try {
                    results.push(JSON.parse(chunk))
                } catch (e) {
                    console.error('Invalid JSON chunk:', chunk, e)
                }
                start = null
            }
        }
    }
    return results
}
