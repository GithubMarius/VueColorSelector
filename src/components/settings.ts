import { Ref, ref } from "vue"
import { Color, ColorArray } from "./color"

export default class Settings {
    
    constructor(
        public bright_theme: Theme = new Theme(),
        public dark_theme: Theme = new Theme('#222222' ,'#111111'),
        public color_mode: Boolean = true,
        public color_circle_radius = 15,
        is_bright = true
    ) {
        this.bright = is_bright
    }

    get theme() {
        return this.bright ? this.bright_theme :  this.dark_theme
    }

    toggle_theme(event): void {
        this.bright = !this.bright
        this.theme.activate()
    }

    set bright(value) {
        if (value) {
            this.bright_theme.activate()
        }
        else {
            this.dark_theme.activate()
        }
    }

    get css_circle_diameter() {
        return this.color_circle_radius * 2 + 'px'
    }

}

export class Theme {
    document_colors = {}

    constructor(
        public bg_default = Theme.getProperty('--bg-default'),
        public bg_secondary = Theme.getProperty('--bg-secondary'),
        public bg_attention = Theme.getProperty('--bg-attention')
    ){
        this.document_colors = {
            '--bg-default': this.bg_default,
            '--bg-secondary': this.bg_secondary,
            '--bg-attention': this.bg_attention
        }
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