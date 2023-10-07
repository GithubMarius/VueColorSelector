import { Ref, ref } from "vue"
import { Color, ColorArray } from "./color"

export default class Settings {
    
    constructor(
        public bright_theme: Theme = new Theme(),
        public dark_theme: Theme = new Theme('#222222' ,'#111111', 'red', '#FFFFFF', '#222222'),
        public color_mode: Boolean = true,
        public color_circle_radius = 15,
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
        public color_text_contrast = Theme.getProperty('--text-contrast')
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