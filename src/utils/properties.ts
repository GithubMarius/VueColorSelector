import FormSlider from "@/components/ui/FormSlider.vue"
import ToggleButton from "@/components/ui/ToggleButton.vue"
import {markRaw, Raw} from "vue"
import SwitchButton from "@/components/ui/SwitchButton.vue";

export interface SettingsProperty {
    label: string
    value: any
}

export interface AutoFormSettingsProperty extends SettingsProperty {
    form_component: Raw<any>
}

export class AutoFormProperty {
    form_component: Raw<any>
    value: any

    update_from_event(event) {
        this.value = event
    }
}

export class BooleanProperty extends AutoFormProperty implements SettingsProperty {
    constructor(public label: string, public value: Boolean = true) {
        super()
    }

    toggle() {
        this.value = !this.value
    }
}

export class BooleanPropertyWithSwitch extends BooleanProperty implements AutoFormSettingsProperty {

    form_component = markRaw(SwitchButton)

}

export class BooleanPropertyWithIcons extends BooleanProperty implements AutoFormSettingsProperty {

    form_component = markRaw(ToggleButton)

    constructor(public label: string, public value: Boolean = true, public icons: Array<String> = [], public btnColor: string = 'primary') {
        super(label, value)
    }

    get props() {
        return {
            icons: this.icons,
            btnColor: this.btnColor
        }
    }


}

export class RangeProperty extends AutoFormProperty implements AutoFormSettingsProperty {

    form_component = markRaw(FormSlider)

    constructor(public label: string, public value: number, public min: number = 0, public max: number = 50, public step: number = 1) {
        super()
    }

    get props() {
        return {
            min: this.min,
            max: this.max,
            step: this.step
        }
    }

    override update_from_event(event) {
        // Input event handler
        this.value = event.target.value
    }
}

export class AngleProperty extends RangeProperty implements SettingsProperty {
    // Angle property (in degree)
    constructor(public label: string, public value: number, public min: number = -180, public max: number = 180, public step: number = 0.5) {
        super(label, value, min, max, step)
    }

    flipRight() {
        this.value = (this.value < 90) ? this.value + 90 : this.value - 270
    }

    flipLeft() {
        this.value = (this.value >= -90) ? this.value - 90 : this.value + 270
    }

    get css_angle() {
        return this.value + 'deg'
    }
}

export class RadiusProperty extends RangeProperty implements SettingsProperty {

    get css_diameter() {
        // Return css diameter
        return this.value * 2 + 'px'
    }

    get css_size() {
        // Return width & height properties
        return {
            width: this.css_diameter,
            height: this.css_diameter
        }
    }
}

export class SelectionProperty implements SettingsProperty {
    constructor(public label: string, public options: Array<string>, public current_index: number = 0) {
    }

    get value() {
        return this.options[this.current_index]
    }

    set value(value: string) {
        this.current_index = this.options.indexOf(value)
    }
}