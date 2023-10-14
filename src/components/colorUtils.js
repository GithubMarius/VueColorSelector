import { Color } from "./color"

export function onHover(props) {
    // Set hover status
    unHoverAll(props)    
    props.color.hovered = true
}

export function unHoverAll(props) {
    // Set hover status to false for all entries
    Color.colors.value.forEach(color => color.hovered=false)
}

export function get_index_of_color(props) {
    // Get index of color
   return props.colors.indexOf(props.color)
}
  