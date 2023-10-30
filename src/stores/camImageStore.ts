import { pointCoordinates } from "@/utils/general";
import { AngleProperty, RangeProperty } from "@/utils/properties";
import { defineStore } from "pinia";

export class CapturedImage {
    constructor(public imgUrl: string,
        public scale = new RangeProperty('Adjust scale', 1, 0, 5, 0.05),
        public angle = new AngleProperty('Adjust rotation', 0),
        public offSet: pointCoordinates = [0,0], public activated: Boolean = false) {}

    as_image_element() {
        const img = new Image()
        img.src = this.imgUrl
        return img
    }

    set offSetX(value) {
        this.offSet[0] = value
    }

    set offSetY(value) {
        this.offSet[1] = value
    }

    get offSetX() {
        return this.offSet[0]
    }

    get offSetY() {
        return this.offSet[1]
    }

    resetOffset() {
        this.offSet = [0, 0]
    }

    resetAngle() {
        this.angle.value = 0
    }
}

export const useCamImageStore = defineStore('camImageStore', {
    state: () => { return {
            images: [],
            editing_image: false
        }
    },
    actions: {
        add_image_from_url(imgUrl) {
            this.images.push(new CapturedImage(imgUrl))
        },
        activate_by_index(index) {
            this.images.forEach((image, i) => image.activated = index === i)
        },
        is_active_index(index) {
            return this.active_image_index === index
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