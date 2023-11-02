import { defineStore } from "pinia"
import { selectionTool } from "@/utils/tools/selection"

export const useToolsStore = defineStore("tools", {
    state: () => ({
            selectionTool: selectionTool,
            tools: {}
        })
    ,
    actions: {
        add_tool(name, tool) {
            this.tools[name] = tool
        }
    }
})