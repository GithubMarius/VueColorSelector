import {defineStore} from "pinia"
import {selectionTool} from "@/utils/tools/selection"
import {colorsTool} from "@/utils/tools/colors_tool";
import {ToolInterface} from "@/utils/tools/helpers";
import {referenceTool} from "@/utils/tools/reference_tool";

export const useToolsStore = defineStore("tools", {
    state: () => {
        const state = {
            activeTool: null,
            selectionTool: selectionTool,
            tools: {
                colorsTool: colorsTool,
                referenceTool: referenceTool
            }
        }
        Object.values(state.tools).forEach((tool: ToolInterface) => {
            tool.create_listeners()
            tool.get_store = useToolsStore
            tool.keyboard_shortcut.bind(tool.activate.bind(tool))
        })

        state.selectionTool.create_listeners()
        state.selectionTool.listen()
        return state
    }
})