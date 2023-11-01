import { defineStore } from "pinia"
import { Tool } from "@/utils/tooldir/helpers"
import { referenceTool } from "@/utils/tooldir/reference_tool"

export const useToolsStore = defineStore("tools", {
    state: () => {
        const state = {
            active_tool: <null|Tool> null,
            tools: {
                referenceTool: referenceTool}
        }
        // Bind keyboard shortcuts for tools
        Object.values(state.tools).forEach(
            (tool: Tool) => {
                tool.keybaord_shortcut.bind(tool.activate.bind(tool))
                tool.get_store = useToolsStore
            })
      return state
    },
    actions: {}
})