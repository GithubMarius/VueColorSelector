import {pointCoordinates} from "@/utils/general";
import {AngleProperty, RangeProperty} from "@/utils/properties";
import {defineStore} from "pinia";

export class CapturedImage {
    constructor(public imgUrl: string,
                public scale = new RangeProperty('Adjust scale', 1, 0, 5, 0.05),
                public angle = new AngleProperty('Adjust rotation', 0),
                public offSet: pointCoordinates = [0, 0], public activated: Boolean = false) {
    }

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
    state: () => {
        return {
            images: [],
            editing_image: false,
            capturing_images: false,
            flash: false
        }
    },
    actions: {
        take_image() {
            // Take image from current video
            const video: HTMLVideoElement = <HTMLVideoElement>document.getElementById('video')
            if (video) {
                const canvas = document.createElement('canvas');
                canvas.height = video.videoHeight;
                canvas.width = video.videoWidth;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                this.add_image_from_url(canvas.toDataURL())
                this.flash = true
                setTimeout(() => {this.flash = false}, 20)

            } else {
                console.log('Could not take image.')
            }
        },
        add_image_from_url(imgUrl) {
            this.images.push(new CapturedImage(imgUrl))
        },
        activate_by_index(index) {
            this.images.forEach((image, i) => image.activated = index === i)
        },
        is_active_index(index) {
            return this.active_image_index === index
        },
        reset() {
            this.images.length = 0
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