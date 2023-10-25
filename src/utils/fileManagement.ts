import { useColorStore } from "@/stores/color"
import { Color, ColorDataInterface } from "./colors/ColorManagement"
import { useHistoryStore } from "@/stores/history"

const export_mime_type = 'application/json'

export function create_data_file() {
    // Create json file with color data
    const file = new File([String(stringify_colors())], 'colors.json', {
        type: export_mime_type,
    })
    return file
}

export function check_data_import_file_type(file: File): Boolean {
    // Check whether file fits .json file
    return (file?.type === export_mime_type) && file?.name.endsWith('.json')
}

export function read_data_file(file) {
    // Read file with color point data

    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
      //Set the Base64 string return from FileReader as source.
      const data = JSON.parse(<string>reader.result)
      if (data.colors) {
        parse_colors(data.colors)
      }
    }

}

function parse_colors(colorDataArray: ColorDataInterface[]) {
    //colorDataArray.forEach(color => color.RGBA = <any>Object.values(color.RGBA))
    const historyStore = useHistoryStore()
    historyStore.import_colors(colorDataArray)
}

function stringify_colors() {
    // Create JSON object with current color data
    const colorStore = useColorStore()
    return JSON.stringify({
        colors: colorStore.colors.map(color => color.toData())
    })
}
