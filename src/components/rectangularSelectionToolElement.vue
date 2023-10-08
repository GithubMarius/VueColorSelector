<script setup lang="ts">
import { computed, inject, ref, nextTick } from 'vue';
import { Color } from './color';
import { ToolInterface } from './Tool';

const selectionToolElementRef = ref(null)
const appContainerRef = ref(null)
const groupNameInputRef = ref(null)



const tools: any = inject('tools')

const selectionTool: Tool = {
    automatic_active: false,
    monitor: false,
    min_diagonal: 50**2,
    _active: false,
    _start_selection: [0, 0],
    _end_selection: [0, 0],

    get active(): Boolean {
        return this._active || this.automatic_active
    },

    set active(value: Boolean) {
        this._active = value
    },

    set start_selection(value) {
        // Set start selection value (end selection value is be set to same value as well)
        this._start_selection = value
        this.end_selection = value
        this.monitor = true
    },

    set end_selection(value) {
        // Set end selection value and check if selection tool should be set to automatic_active
        this._end_selection = value
        if (!this.automatic_active) {
            this.check_diameter()
        }
        
        if (this.automatic_active) {
            const selected_colors = this.selected_colors
            Color.colors.value.forEach(color => color.selecting = selected_colors.includes(color))
        }

    },

    get start_selection() {
        // Return start selection value
        return this._start_selection
    },

    get end_selection() {
        // Return end selection value
        return this._end_selection
    },

    get leftRight() {
        // Return x value of left and right side of selection
        return [this.start_selection[0], this.end_selection[0]].sort()
    },

    get topBottom() {
        // Return y value of top and bottom side of selection
        return [this.start_selection[1], this.end_selection[1]].sort()
    },

    get x() {
        // Return x value of left side
        return Math.min(this.start_selection[0], this.end_selection[0])
    },

    get y() {
        // Return y value of top side
        return Math.min(this.start_selection[1], this.end_selection[1])
    },

    get width() {
        // Return width of selection
        return Math.abs(this.end_selection[0] - this.start_selection[0])
    },

    get height() {
        // Return height of selection
        return Math.abs(this.end_selection[1] - this.start_selection[1])
    },

    get css_left() {
        // Return css left string value
        return this.x + 'px'
    },

    get css_top() {
        // Return css top string value
        return this.y + 'px'
    },

    get css_width() {
        // Return css width string value
        return this.width + 'px'
    },

    get css_height() {
        // Return css height string value
        return this.height + 'px'
    },

    get diagonal() {
        // Return diagonal length squared of selection
        return this.width**2 + this.height**2
    },

    check_diameter() {
        // Change automatic_active state if rectangle diagonal length exceeds min value
        if (this.diagonal > this.min_diagonal) {
            this.automatic_active = true
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
        this.reset_automatic_active_and_monitor()
        groupNameInputRef.value?.focus()

    },

    drop_selection() {
        // Drop selection (set not selected to all colors)
        Color.colors.value.forEach(color => color.selected = false)
        this.reset_automatic_active_and_monitor()
    },

    reset_automatic_active_and_monitor() {
        this.automatic_active = false
        this.monitor = false
    },
    mouseDownLeft(event: MouseEvent) {
        if (!target_is_input(event)) {
            mouseDownRight(event)
            mouseDownLeftShift(event)
        }
    },
    mouseMove(event: MouseEvent) {
    if (event.buttons === 1 && this.monitor) {
            this.end_selection = [event.clientX, event.clientY]
            event.preventDefault()
        }
    }
}

const selectionToolObjectRef = ref(selectionTool)

function mouseDownLeft(event: MouseEvent) {
    if (!target_is_input(event)) {
        mouseDownRight(event)
        mouseDownLeftShift(event)
    }
}

function mouseDownLeftShift(event: MouseEvent) {
    if (!target_is_input(event)) {
        selectionToolObjectRef.value.start_selection = [event.clientX, event.clientY];
    }
}

function target_is_input(event: MouseEvent): Boolean {
    return (<HTMLElement>event.target).tagName === 'INPUT'
}

function target_has_class_form_range(event: MouseEvent): Boolean {
    return (<HTMLElement>event.target).classList.contains('form-range')
}

function mouseDownRight(_: MouseEvent) {
    selectionToolObjectRef.value.drop_selection()
}

function mouseUp(event: MouseEvent) {
    if (selectionToolObjectRef.value?.active) {
        tools.value.last_ts = event.timeStamp
    }
    selectionToolObjectRef.value.manifest_selection()
}

function mouseLeave(_: MouseEvent) {
    groupNameInputRef.value?.focus()    
}

const numberSelectedEntries = computed(() => selectedEntries.value.length)

const selectedEntries = computed(() => {
  return Color.colors.value.filter(color => color.selected)
})

function update_selection_groups(event) {
    // Add enter group name to selected entries
    if (event.target.value.length > 0) {
        selectedEntries.value.forEach(color => {
        color.group_name = event.target.value
        color.selected = false
        })
    }
}

tools.value.existing.push(selectionToolObjectRef.value)

</script>


<template>
    <div ref="appContainerRef" class="position-relative"
    @mouseenter="tools.mouseEnter"
    @mousemove = "tools.mouseMove"
    @mousedown.left.exact="mouseDownLeft"
    @mousedown.left.shift.exact="mouseDownLeftShift"
    @mousedown.right="mouseDownRight"
    @mouseup="mouseUp"
    @mouseleave="mouseLeave"
    @click.left.exact="tools.clickLeft"
    @click.right.exact="tools.clickRight"
    >
        <div>
            <Transition @after-enter="groupNameInputRef.focus()">
                <div class="position-absolute z-1 rounded group-name-input-div" v-if="numberSelectedEntries > 0">
                    <input ref="groupNameInputRef" id="groupName" class="form-control" type="text" placeholder="GROUP NAME"
                    @click.prevent
                    @keyup.enter="update_selection_groups">
                </div>
            </Transition>
        </div>
        <slot>
        </slot>
        <div ref="selectionToolElementRef" class="rectangular_selection" v-if="selectionToolObjectRef.active" :style="
        {left: selectionToolObjectRef.css_left, top: selectionToolObjectRef.css_top,
        width: selectionToolObjectRef.css_width, height: selectionToolObjectRef.css_height}">
        </div>
    </div>
</template>

<style>
.rectangular_selection {
    position: absolute;
    background-color: None;
    border: 1px dashed black;
}

.group-name-input-div{
    top: 10px;
    left: 50%;
    transform: translateX(-50%)
}
</style>