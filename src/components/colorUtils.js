export function deleteSelf(props) {
    // Delete self
    props.colors.splice(get_index_of_color(props), 1)
}

export function onHover(props) {
    // Set hover status
    unHoverAll(props)    
    props.color.hovered = true
}

export function unHoverAll(props) {
    // Set hover status to false for all entries
    props.colors.forEach(x => x.hovered=false)
}

export function get_index_of_color(props) {
    // Get index of color
   return props.colors.indexOf(props.color)
}
  