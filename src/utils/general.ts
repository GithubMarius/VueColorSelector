import { ColorAlphaArray } from "./colors/helpers"

export type mouseCoordinates = [number, number]

export function canvas_position_from_event(event): mouseCoordinates {
    
    const canvas = <HTMLCanvasElement>document.getElementById('canvas')
    
    // Calculate xy position relative to canvas
    const canvasRect = canvas.getBoundingClientRect()
    const targetRect = event.target.getBoundingClientRect()
    
    return [targetRect.x - canvasRect.x + event.offsetX, targetRect.y - canvasRect.y + event.offsetY]
}

export function get_pixel_color(x, y) {
    // Get color at position (x, y)

    const canvas = <HTMLCanvasElement>document.getElementById('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    return <ColorAlphaArray><unknown>ctx.getImageData(x, y, 1, 1).data;
}

export function combine(obj1: Object, obj2: Object): Object {
    return Object.assign({}, obj1, obj2)
}