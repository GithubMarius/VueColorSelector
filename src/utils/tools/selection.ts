import {pointCoordinates, pointCoordinatesToStyle} from '@/utils/general';
import {BaseWithListenerCreation} from '@/utils/tools/helpers';
import {reactive} from "vue";


function page_coordinates(event: MouseEvent): pointCoordinates {
    return [event.pageX, event.pageY]
}

class Point {
    constructor(public coords: pointCoordinates = [0, 0]) {
    }

    get style() {
        return pointCoordinatesToStyle(this.coords)
    }

    from_event(event: MouseEvent) {
        this.coords = page_coordinates(event)
    }

    reset() {
        this.coords = [0, 0]
    }

}

interface ListenerCallsInterface {
    [propName: string]: Function
}

export const selectionTool = {
    ...BaseWithListenerCreation,
    listener_calls: <ListenerCallsInterface>{
        mousedown(this: typeof selectionTool, event: MouseEvent) {
            if ((<HTMLElement>event?.target)?.tagName == 'INPUT') {
                this.ignore_current_events = true
            } else if (event.buttons === 1) {
                this.start.from_event(event)
                this.end.from_event(event)
                this.refresh_selectables()
                if (!event.shiftKey) {
                    this.trigger_drop_from_selection()
                }
            } else if (event.buttons === 2) {
                this.trigger_drop_from_selection()
            }
        },
        mousemove(this: typeof selectionTool, event: MouseEvent) {
            if (event.buttons === 1 && !this.ignore_current_events) {
                this.end.from_event(event)
                this.check_visibility()
                if (this.visible) {
                    this.trigger_selecting()
                }
            }
        },
        mouseup(this: typeof selectionTool, _: MouseEvent) {
            this.finish_selection()
            this.ignore_current_events = false
        },
        mouseenter(this: typeof selectionTool, event: MouseEvent) {
            // TODO: ADD
        },
        mouseleave(this: typeof selectionTool, event: MouseEvent) {
            // TODO: ADD
        }
    },
    selectables: reactive(<HTMLElement[]>[]),
    visible: false,
    start: reactive(new Point()),
    end: reactive(new Point()),
    ignore_current_events: false,

    get style() {
        return {
            display: (this.visible) ? 'block' : 'none',
            left: this.left + 'px',
            top: this.top + 'px',
            width: this.width + 'px',
            height: this.height + 'px',
        }
    },
    get left(): number {
        return Math.min(this.start.coords[0], this.end.coords[0])
    },
    get top(): number {
        return Math.min(this.start.coords[1], this.end.coords[1])
    },
    get width(): number {
        return Math.abs(this.end.coords[0] - this.start.coords[0])
    },
    get height(): number {
        return Math.abs(this.end.coords[1] - this.start.coords[1])
    },
    get diameter_squared(): number {
        return this.width ** 2 + this.height ** 2
    },

    finish_selection() {
        this.trigger_to_selection()
        this.trigger_drop_selecting()
        this.reset()
        this.get_store()?.active_tool?.selection_changed()
    },

    check_visibility() {
        // Make visible if not visible yet and diameter squared bigger than limit
        if (!this.visible && this.diameter_squared > 900) {
            this.visible = true
        }
    },
    reset() {
        // Reset visibility and coordinates
        this.visible = false
        this.start.reset()
        this.end.reset()
    },

    // Find selectable elements,
    refresh_selectables() {
        this.selectables.splice(0, Infinity, ...this.get_selectables())
    },

    get_selectables(): HTMLElement[] {
        // Get all HTML Elements with class selectable
        return this.get_visible_elements_of_class('selectable')
    },

    get_visible_elements_of_class(css_class: string): HTMLElement[] {
        // Find all html elements with css_class that are currently visible
        const collection: HTMLCollectionOf<HTMLElement> = <HTMLCollectionOf<HTMLElement>>document.getElementsByClassName(css_class)
        return [...Object.values(collection)].filter((element: HTMLElement) => element.childElementCount > 0 && element.checkVisibility())
    },

    // Trigger Events
    trigger_selecting() {
        // Highlight selectables within current selection bounds
        this.selectables.forEach((selectable: HTMLElement) =>
            selectable.dispatchEvent(new CustomEvent("selecting", {
                detail: this.check_bounds(selectable)
            }))
        )
    },
    trigger_drop_selecting() {
        // Remove selecting highlighting
        this.selectables.forEach((selectable: HTMLElement) =>
            selectable.dispatchEvent(new CustomEvent("selecting", {
                detail: false
            }))
        )
    },
    trigger_to_selection() {
        // Trigger to add selectables that are currently highlighted to be permanently added to selection
        this.selectables.forEach((selectable: HTMLElement) =>
            selectable.dispatchEvent(new CustomEvent("toselection"))
        )
    },
    trigger_drop_from_selection() {
        // Trigger to set all selectables as not selected
        this.selectables.forEach((selectable: HTMLElement) =>
            selectable.dispatchEvent(new CustomEvent("fromselection"))
        )
    },

    // Check if element in bounds

    check_bounds(element: HTMLElement) {
        // Check if element inside selection
        const rect = this.get_rect_from_selectable(element)
        return this.check_x_bounds(rect) && this.check_y_bounds(rect)
    },

    check_x_bounds(rect: DOMRect) {
        // Check if x-bounds are within selection
        return (this.left <= rect.left) && (rect.right <= this.left + this.width)
    },

    check_y_bounds(rect: DOMRect) {
        // Check if y-bounds are within selection
        return (this.top <= rect.top) && (rect.bottom <= this.top + this.height)
    },

    get_rect_from_selectable(selectable: HTMLElement) {
        // Get bounding client rect of first child
        return selectable.firstElementChild.getBoundingClientRect()
    }
}
