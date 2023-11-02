import {ColorAlphaArray} from "./colors/helpers"
import {StyleValue} from "vue";

interface cssStylePosition {
    left: String,
    top: String
}

export type pointCoordinates = [number, number]

export function canvas_container_position_from_event(event): pointCoordinates {
    
    const container = <HTMLCanvasElement>document.getElementById('canvas-container')

    // Calculate xy position relative to canvas
    const canvasRect = container.getBoundingClientRect()
    const targetRect = event.target.getBoundingClientRect()

    const scale = container.offsetWidth/container.getBoundingClientRect().width
    
    return [(targetRect.x - canvasRect.x) * scale + event.offsetX, (targetRect.y - canvasRect.y) * scale + event.offsetY]
}

export function get_pixel_color(x: number, y: number) {
    // Get color at position (x, y)

    const canvas = <HTMLCanvasElement>document.getElementById('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    return <ColorAlphaArray><unknown>ctx.getImageData(x, y, 1, 1).data;
}

export function combine(obj1: Object, obj2: Object): Object {
    return Object.assign({}, obj1, obj2)
}

export function pointCoordinatesToStyle(point: pointCoordinates): cssStylePosition {
    return {
        left: point[0] + 'px',
        top: point[1] + 'px'
    }
}