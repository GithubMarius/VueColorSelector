export function target_is_input(event: MouseEvent): Boolean {
return (<HTMLElement>event.target).tagName === 'INPUT';
}
