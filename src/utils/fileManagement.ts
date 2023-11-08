import {ColorDataInterface} from "@/utils/colors/ColorManagement"

import {useColorStore} from "@/stores/color"
import {useHistoryStore} from "@/stores/history"
import {useCamImageStore} from "@/stores/camimages"
import {useSettingsStore} from "@/stores/settings"
import {useToastStore} from "@/stores/toasts";

const export_mime_type = 'application/json'

export function create_data_file() {
    // Create json file with color data
    return new File([stringify_contents()], 'data.json')
}

export function check_data_import_file_type(file: File): Boolean {
    // Check whether file fits .json file
    return (file?.type === export_mime_type) && file?.name.endsWith('.json')
}

export function read_data_file(file) {
    // Read file with color point data

    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
        //Set the Base64 string return from FileReader as source.
        const data = JSON.parse(<string>reader.result)

        if (data.colors) {
            parse_colors(data.colors)
        }

        if (data.images) {
            parse_images(data.images)
        }

    }

}

function parse_colors(colorDataArray: ColorDataInterface[]) {
    //colorDataArray.forEach(color => color.RGBA = <any>Object.values(color.RGBA))
    const historyStore = useHistoryStore()
    historyStore.import_colors(colorDataArray)
}

function parse_images(imageUrlDataArray) {
    const camImageStore = useCamImageStore()
    imageUrlDataArray.forEach(imgUrl => camImageStore.add_image_from_url(imgUrl))
}

function get_colors() {
    // Get colors
    const colorStore = useColorStore()
    return colorStore.colors.map(color => color.toData())
}

function get_images() {
    const camImageStore = useCamImageStore()
    return camImageStore.images.map(img => img.imgUrl)
}

function stringify_contents() {
    return new Blob([JSON.stringify({
        colors: get_colors(),
        images: get_images()
    })], {type: export_mime_type})
}

export function return_download_file() {
    // Used example from https://javascript.plainenglish.io/javascript-create-file-c36f8bccb3be
    const file = create_data_file()
    const link = document.createElement('a')
    const url = URL.createObjectURL(file)

    link.href = url
    link.download = file.name
    document.body.appendChild(link)
    link.click()

    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    const toastStore = useToastStore()
    toastStore.push_success('Data exported.')
}


function onDataFileChange(event) {
    //  Open file dialog to import data

    if (check_data_import_file_type(event.target.files[0])) {
        read_data_file(event.target.files[0])

        const toastStore = useToastStore()
        toastStore.push_success('Data imported.')
    } else {
        throw (new Error('Wrong file type.'))
    }
}

export function onImgFileChange(event) {
    var reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    reader.onload = function (e) {
        const settingsStore = useSettingsStore()
        settingsStore.url = <string>e.target.result;
        resetStores()

        const toastStore = useToastStore()
        toastStore.push_success('Image loaded.')
    }
}

export function openImgFileDialog() {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "")
    input.click()
    input.onchange = onImgFileChange
}

export function openDataImportFileDialog() {
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", ".json")
    input.click()
    input.onchange = onDataFileChange
}

export function resetStores() {
    const historyStore = useHistoryStore()
    const colorStore = useColorStore()
    const camImageStore = useCamImageStore()

    historyStore.reset()
    colorStore.reset()
    camImageStore.reset()
}