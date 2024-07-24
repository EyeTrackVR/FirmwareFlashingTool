export class Transform {
    private chunks = ''

    transform(chunk: string, controller: TransformStreamDefaultController<string>) {
        this.chunks += chunk
        const lines = this.chunks.split('\r\n')
        this.chunks = lines.pop()!
        lines.forEach((line) => controller.enqueue(line + '\r\n'))
    }

    flush(controller: TransformStreamDefaultController<string>) {
        controller.enqueue(this.chunks.replace(/\s+/g, ''))
    }
}
