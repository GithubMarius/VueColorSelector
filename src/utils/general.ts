import { ColorAlphaArray } from "./colors/helpers"

export type pointCoordinates = [number, number]

export function canvas_container_position_from_event(event): pointCoordinates {
    
    const container = <HTMLCanvasElement>document.getElementById('canvas-container')

    // Calculate xy position relative to canvas
    const canvasRect = container.getBoundingClientRect()
    const targetRect = event.target.getBoundingClientRect()

    const scale = container.offsetWidth/container.getBoundingClientRect().width
    
    return [(targetRect.x - canvasRect.x) * scale + event.offsetX, (targetRect.y - canvasRect.y) * scale + event.offsetY]
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

export function target_is_input(event: MouseEvent): Boolean {
    return (<HTMLElement>event.target).tagName === 'INPUT';
}    