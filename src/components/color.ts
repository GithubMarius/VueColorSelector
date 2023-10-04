
export class Color {

    constructor(
        public rgba: ColorArray, public xPos: Number, public yPos: Number,
        public hovered: Boolean = false, public selected: Boolean=false,  public selecting: Boolean = false, public visible: Boolean = true,
        public group: string = ''
        ) {}

    get css_rgba (): string {
        // CSS rgba color string
        return `rgba(${this.rgba})`
    }

    get css_rgb (): string {
        // CSS rgb color string
        return `rgba(${this.rgba.slice(0,3)})`
    }

    get css_xPos (): string {
        // Return xPos as string + 'px'
        return this.xPos + 'px'
    }

    get css_yPos (): string {
        // Return yPos as string + 'px'
        return this.yPos + 'px'
    }

}


export type ColorArray = [Number, Number, Number, Number]