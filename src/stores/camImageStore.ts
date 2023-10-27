import { pointCoordinates } from "@/utils/general";
import { defineStore } from "pinia";

export class CapturedImage {
    constructor(public imgUrl: string, public scale: number = 1, public offSet: pointCoordinates = [0,0], public activated: Boolean = false) {}

    as_image_element() {
        const img = new Image()
        img.src = this.imgUrl
        return img
    }
}

export const useCamImageStore = defineStore('camImageStore', {
    state: () => { return {
            images: []
        }
    },
    actions: {
        add_image_from_url(imgUrl) {
            this.images.push(new CapturedImage(imgUrl))
        },
        activate_by_index(index) {
            this.images.forEach((image, i) => image.activated = index === i)
        }
    }, 
    getters: {
        imageElements() {
            return this.images.map(img => img.as_image_element())
        },
        imageUrls() {
            return this.images.map(img => img.imgUrl)
        },
        activated_image_exists() {
            return this.images.some(image => image.activated) 
        },
        active_image() {
            return this.images.find(image => image.activated)
        },
        active_image_index() {
            return this.images.indexOf(this.active_image)
        }
    }
})