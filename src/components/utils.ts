export function combine(obj1: Object, obj2: Object): Object {
    return Object.assign({}, obj1, obj2)
}

function target_is_input(event: MouseEvent): Boolean {
    return (<HTMLElement>event.target).tagName === 'INPUT'
}