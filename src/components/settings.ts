import { Ref, ref } from "vue"
import { Color, ColorArray } from "./color"

export class Radius {
    constructor(public label, public value: number, public min: number = 0, public max: number = 50) {}

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

    update_from_event(event) {
        // Input event handler
        this.value = event.target.value
    }
}

export default class Settings {
    
    constructor(
        public bright_theme: Theme = new Theme(),
        public dark_theme: Theme = new Theme('#444444' ,'#333333', 'red', '#EEEEEE', '#555555', '#ec684b'),
        public color_mode: Boolean = true,
        public color_circle_radius = 15,
        public reference_circle_radius = new Radius('Reference circle radius', 8),
        public scale = 0.5,
        private _bright: Boolean = true
    ) {
        this.bright = _bright
    }

    get theme() {
        return this.bright ? this.bright_theme :  this.dark_theme
    }

    toggle_theme(event): void {
        this.bright = !this.bright
        this.theme.activate()
    }

    set bright(value: Boolean) {
        this._bright = value
        if (value) {
            this.bright_theme.activate()
        }
        else {
            this.dark_theme.activate()
        }
    }

    get bright(): Boolean {
        return this._bright
    }

    get css_circle_diameter() {
        return this.color_circle_radius * 2 + 'px'
    }
}

export class Theme {
    document_colors = {}

    constructor(
        public color_bg_default = Theme.getProperty('--bg-default'),
        public color_bg_secondary = Theme.getProperty('--bg-secondary'),
        public color_bg_attention = Theme.getProperty('--bg-attention'),
        public color_text_default = Theme.getProperty('--text-default'),
        public color_text_contrast = Theme.getProperty('--text-contrast'),
        public color_col_pri = Theme.getProperty('--col-pri')
    ){
        // Add public color properties to document_colors object
        const colors = Object.keys(this).filter(this.is_color)
        colors.forEach(color => this.add_to_colors(color))
    }

    is_color(key): Boolean {
        // Check if property is color (color properties start with 'color_')
        return key.startsWith('color_')
    }

    get_color_name(color): string {
        // Convert property name to corresponding css color name
        return color.replace('color_', '--').replace('_', '-')
    }

    add_to_colors(color) {
        // Add to document colors
        const name = this.get_color_name(color)
        this.document_colors[name] = this[color]
    }

    activate(): void {
        // Activate current theme
        Object.entries(this.document_colors).forEach(([name, color]) => {
            Theme.setProperty(name, <string>color)
        })
    }

    static setProperty(name: string, value: string): void {
        // Set document style property
        document.documentElement.style.setProperty(<string>name, <string>value)
    }

    static getProperty(name: string): string {
        // Get document style property
        return document.documentElement.style.getPropertyValue(<string>name)
    }
    
}