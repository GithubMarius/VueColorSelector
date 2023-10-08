import { ref } from 'vue';

export const tools = ref({
existing: [],
get active() {
return this.existing.reduce((accumulator, tool) => tool.active || accumulator, false);
},
get active_tools() {
return this.existing.filter(tool => tool.active);
},
last_ts: null,
mouseEnter(event) {
this.active_tools.forEach(tool => {
if (tool.mouseenter) {
tool.mouseEnter(event);
}
});
},
mouseDown(event) {
this.active_tools.forEach(tool => {
if (tool.mouseDown) {
tool.mouseDown(event);
}
});
},
mouseMove(event) {
this.active_tools.forEach(tool => {
if (tool.mouseMove) {
tool.mouseMove(event);
}
});
}
});
