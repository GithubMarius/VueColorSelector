<script setup lang="ts">
import { ref } from 'vue';
import { Color } from './color';

const selectionToolRef = ref(null)
const appContainerRef = ref(null)

document.getElementsByClassName('color_block')
document.getElementsByClassName('color_circle')

const selectionTool = ref({
    active: false,
    _start_selection: [0, 0],
    _end_selection: [0, 0],
    min_diagonal: 50**2,

    set start_selection(value) {
        this._start_selection = value
        this._end_selection = value
    },

    set end_selection(value) {
        this._end_selection = value
        if (!this.active) {
            this.check_diameter()
        }
        
        if (this.active) {
            const selected_colors = this.selected_colors
            Color.colors.value.forEach(color => color.selecting = selected_colors.includes(color))
        }

    },

    get end_selection() {
        return this._end_selection
    },

    get start_selection() {
        return this._start_selection
    },

    get leftRight() {
        return [this.start_selection[0], this.end_selection[0]].sort()
    },

    get topBottom() {
        return [this.start_selection[1], this.end_selection[1]].sort()
    },

    get x() {
        return Math.min(this.start_selection[0], this.end_selection[0])
    },

    get y() {
        return Math.min(this.start_selection[1], this.end_selection[1])
    },

    get width() {
        return Math.abs(this.end_selection[0] - this.start_selection[0])
    },

    get height() {
        return Math.abs(this.end_selection[1] - this.start_selection[1])
    },

    get css_left() {
        return this.x + 'px'
    },

    get css_top() {
        return this.y + 'px'
    },

    get css_width() {
        return this.width + 'px'
    },

    get css_height() {
        return this.height + 'px'
    },

    get diagonal() {
        return this.width**2 + this.height**2
    },

    check_diameter() {
        // Chance active state if rectangle diagonal length exceeds min value
        if (this.diagonal > this.min_diagonal) {
            this.active = true
        }
    },

    get selected_colors() {
        // Get colors which color circle or block is within selection rectangle
        return this.selected_element_ids.map(index => Color.colors.value[index])
    },

    get selected_element_ids() {
        // Find all circle and block ids and return array of unique values
        const circle_ids = this.get_ids_for_elements_within_selection_of_class('color_circle')
        const block_ids = this.get_ids_for_elements_within_selection_of_class('color_block')
        return [...new Set((circle_ids.concat(block_ids)))]
    },

    get_visible_elements_of_class(css_class: string): Array<Element> {
        // Find all html elements with css_class that are currently visible
        const collection = document.getElementsByClassName(css_class)
        return [...Object.values(collection)].filter(element => element.checkVisibility())
    },

    filter_for_elements_within_bounds(elements: Array<Element>) {
        // Return all elements within elements, that are currently fully inside the rectangular selection
        return elements.filter(element => this.check_bounds(element))
    },

    get_ids_from_elements(elements) {
        // Return data-id attribute of elements
        return elements.map(element  => Number(element.dataset.colorId))
    },

    get_ids_for_elements_within_selection_of_class(css_class) {
        // Return ids of all visible elements of css_class that are within selection
        var elements = this.get_visible_elements_of_class(css_class)
        elements = this.filter_for_elements_within_bounds(elements)
        return this.get_ids_from_elements(elements)
    },

    check_bounds(element: HTMLElement) {
        // Check if element inside selection
        const rect = element.getBoundingClientRect()
        return this.check_x_bounds(rect) && this.check_y_bounds(rect)
    },

    check_x_bounds(rect) {
        // Check if x-bounds are within selection
        return (this.x < rect.x) && (rect.x + rect.width < this.x + this.width)
    },

    check_y_bounds(rect) {
        // Check if y-bounds are within selection
        return (this.y < rect.y) && (rect.y + rect.height < this.y + this.height)
    },

    manifest_selection() {
        // Permanently select colors within selection
        this.selected_colors.forEach(color => {
            color.selected = true
            color.selecting = false
        })
    },

    drop_selection() {
        Color.colors.value.forEach(color => color.selected = false)
    }
})

function mouseDownLeft(event: MouseEvent) {
    if (!event.shiftKey) {
        selectionTool.value.drop_selection()   
    }
    selectionTool.value.start_selection = [event.clientX, event.clientY]
    selectionTool.value.end_selection = [event.clientX, event.clientY]
}

function mouseDownRight(_: MouseEvent) {
    selectionTool.value.drop_selection()
}

function mouseMove(event: MouseEvent) {
    if (event.buttons === 1) {
        selectionTool.value.end_selection = [event.clientX, event.clientY]
        event.preventDefault()
    }
}

function mouseUp(event: MouseEvent) {
    selectionTool.value.manifest_selection()
    selectionTool.value.active = false
}

</script>


<template>
    <div ref="appContainerRef" class="position-relative"
    @mousemove="mouseMove"
    @mousedown.left="mouseDownLeft"
    @mousedown.right="mouseDownRight"
    @mouseup="mouseUp">
        <slot>
        </slot>
        <div ref="selectionToolRef" class="rectangular_selection" v-if="selectionTool.active" :style="
        {left: selectionTool.css_left, top: selectionTool.css_top,
        width: selectionTool.css_width, height: selectionTool.css_height}">
        </div>
    </div>
</template>

<style>
.rectangular_selection {
    position: absolute;
    background-color: None;
    border: 1px dashed black;
}
</style>