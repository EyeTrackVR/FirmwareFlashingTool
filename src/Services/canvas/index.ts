export const DEFAULT_CANVAS_BOX_POSITION = { x: 0, y: 0, width: 0, height: 0 }

export interface IBoxPosition {
    x: number
    y: number
    width: number
    height: number
}

export class Canvas {
    canvas: HTMLCanvasElement | undefined = undefined
    context: CanvasRenderingContext2D | null = null
    mousePosition = { x: 0, y: 0 }
    isMouseDown = false
    canvasBoxPosition = DEFAULT_CANVAS_BOX_POSITION

    private onMouseUpCallback?: (boxPosition: IBoxPosition) => void

    setCanvasBoxPosition(boxPosition: IBoxPosition) {
        this.canvasBoxPosition = boxPosition

        if (!this.context || !this.canvas) return

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

        this.drawBox(boxPosition)
    }

    private drawBox(boxPosition: IBoxPosition) {
        if (!this.context) return

        const { x, y, width, height } = boxPosition

        this.context.shadowBlur = 2
        this.context.lineJoin = 'round'
        this.context.lineWidth = 2
        this.context.strokeStyle = '#9092FF'

        this.context.strokeRect(x, y, width, height)

        this.context.beginPath()
        this.context.arc(x, y, 5, 0, 2 * Math.PI)
        this.context.fillStyle = '#9092FF'
        this.context.fill()

        this.context.beginPath()
        this.context.arc(x + width, y + height, 5, 0, 2 * Math.PI)
        this.context.fillStyle = '#9092FF'
        this.context.fill()
    }

    constructor() {
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
    }

    onMouseUpComplete(callback: (boxPosition: IBoxPosition) => void) {
        this.onMouseUpCallback = callback
        return this
    }

    setCanvas(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.context = canvas.getContext('2d')

        this.canvas.addEventListener('mousedown', this.onMouseDown)
        this.canvas.addEventListener('mouseup', this.onMouseUp)
        this.canvas.addEventListener('mousemove', this.onMouseMove)

        return this
    }

    getMousePosition(evt: MouseEvent) {
        if (!this.canvas) return { x: 0, y: 0 }

        const rect = this.canvas.getBoundingClientRect()
        const scaleX = this.canvas.width / rect.width
        const scaleY = this.canvas.height / rect.height

        return {
            x: (evt.clientX - rect.left) * scaleX,
            y: (evt.clientY - rect.top) * scaleY,
        }
    }

    onMouseUp(e: MouseEvent) {
        const target = e.target as HTMLInputElement
        if (target.nodeName !== 'CANVAS' || !this.context || !this.canvas) return
        this.isMouseDown = false
        const { x, y } = this.getMousePosition(e)
        const width = x - this.mousePosition.x
        const height = y - this.mousePosition.y

        if (Math.abs(width) === 0 || Math.abs(height) === 0) return

        this.context.beginPath()
        this.context.arc(x, y, 5, 0, 2 * Math.PI)
        this.context.fillStyle = '#9092FF'
        this.context.fill()

        this.canvasBoxPosition = { x: this.mousePosition.x, y: this.mousePosition.y, width, height }

        if (this.onMouseUpCallback) {
            this.onMouseUpCallback(this.canvasBoxPosition)
        }
    }

    onMouseDown(e: MouseEvent) {
        const target = e.target as HTMLInputElement
        if (target.nodeName !== 'CANVAS' || !this.canvas) return

        this.isMouseDown = true
        this.mousePosition = this.getMousePosition(e)
    }

    onMouseMove(e: MouseEvent) {
        const target = e.target as HTMLInputElement
        if (!this.isMouseDown || target.nodeName !== 'CANVAS' || !this.context || !this.canvas) {
            return
        }

        if (!this.isMouseDown) return

        const { x, y } = this.getMousePosition(e)

        const width = x - this.mousePosition.x
        const height = y - this.mousePosition.y

        if (height === 0) return

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        this.drawBox({ x: this.mousePosition.x, y: this.mousePosition.y, width, height })
    }

    destroy() {
        if (this.canvas) {
            this.canvas.removeEventListener('mousedown', this.onMouseDown)
            this.canvas.removeEventListener('mouseup', this.onMouseUp)
            this.canvas.removeEventListener('mousemove', this.onMouseMove)
        }
    }
}
