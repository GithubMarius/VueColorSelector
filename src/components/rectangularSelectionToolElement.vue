<script setup lang="ts">
import { computed, inject, ref } from 'vue';
import { Color } from './color';
import { ToolInterface } from './Tool';
import { target_is_input } from './target_is_input';
import { nextTick } from 'vue';

const selectionToolElementRef = ref(null)
const appContainerRef = ref(null)
const groupNameInputRef = ref(null)



const tools: any = inject('tools')

const selectionTool: ToolInterface = {
    key: 's',
    active: false,
    passive: false,
    icon: 'bi-square',
    _start_selection: [0, 0],
    end_selection: [0, 0],

    get has_size() {
        return (this.width + this.height) !== 0
    },

    set start_selection(value) {
        // Set start selection value (end selection value is be set to same value as well)
        this._start_selection = value
        this.end_selection = value
    },

    get start_selection() {
        // Return start selection value
        return this._start_selection
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

    get style() {
        return {
            left: this.x + 'px',
            top: this.y + 'px',
            width: this.width + 'px',
            height: this.height + 'px'
        }
    },

    get diagonal() {
        // Return diagonal length squared of selection
        return this.width**2 + this.height**2
    },

    get selectables() {
        return this.get_visible_elements_of_class('selectable')
    },

    toggle() {
        this.active = !this.active
    },

    get_visible_elements_of_class(css_class: string): Array<Element> {
        // Find all html elements with css_class that are currently visible
        const collection = document.getElementsByClassName(css_class)
        return [...Object.values(collection)].filter(element => element.checkVisibility())
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
        /* this.selected_colors.forEach(color => {
            color.selected = true
            color.selecting = false
        })
        */
        this.selectables.forEach(this.dispatchToSelectionEvent)
        groupNameInputRef.value?.focus()
        this.start_selection = [0,0]
        this.selectables.forEach(this.dispatchDropSelecting)
    },
    dispatchDropSelecting(element) {
        element.dispatchEvent(new CustomEvent("selecting", { detail: false}))
    },
    dispatchSelectingEvent(element) {
        element.dispatchEvent(new CustomEvent("selecting", { detail: this.check_bounds(element.firstElementChild)}))
    },
    dispatchToSelectionEvent(element) {
        element.dispatchEvent(new CustomEvent("toselection"))
    },
    drop_selection() {
        // Drop selection (set not selected to all colors)
        Color.colors.value.forEach(color => color.selected = false)
    },
    mousedownleft(event: MouseEvent) {
        if (!target_is_input(event)) {
            this.mousedownright(event)
            this.mousedownleftshift(event)
        }
    },
    mousedownright(_: MouseEvent) {
        this.drop_selection()
    },
    mousedownleftshift(event: MouseEvent) {    
        if (!target_is_input(event)) {
            selectionToolObjectRef.value.start_selection = [event.clientX, event.clientY];
        }
    },
    mousemove(event: MouseEvent) {
    if (event.buttons === 1) {            
            // Emit selecting event to selectables
            this.selectables.forEach((element: HTMLElement) => this.dispatchSelectingEvent(element))

            // Update end selection value & prevent default
            selectionToolObjectRef.value.end_selection = [event.clientX, event.clientY]
            event.preventDefault()
        }
    },
    mouseup(event: MouseEvent) {
        tools.value.last_ts = event.timeStamp
        this.manifest_selection()
    },
    mouseleave(_) {
        groupNameInputRef.value?.focus()
    }
}

const selectionToolObjectRef = ref(selectionTool)

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

tools.value.tools.push(selectionTool)

</script>


<template>
    <div ref="appContainerRef" class="row w-100 vh-100 m-0 position-relative">
        <div>
            <Transition @after-enter="groupNameInputRef.focus()">
                <div class="position-absolute z-1 rounded group-name-input-div" v-if="numberSelectedEntries > 0">
                    <input ref="groupNameInputRef" id="groupName" class="form-control" type="text" placeholder="GROUP NAME"
                    @click.prevent
                    @keydown.stop
                    @keypress.stop
                    @keyup.enter="update_selection_groups">
                </div>
            </Transition>
        </div>
        <slot>
        </slot>
        <div ref="selectionToolElementRef" class="rectangular_selection" v-if="selectionToolObjectRef.active && selectionToolObjectRef.has_size" :style="selectionToolObjectRef.style">
        </div>
    </div>
</template>

<style>
.rectangular_selection {
    position: absolute;
    padding: 0px;
    min-width: 0px;
    background-color: None;
    border: 1px dashed black;
}

.group-name-input-div{
    top: 10px;
    left: 50%;
    transform: translateX(-50%)
}
</style>