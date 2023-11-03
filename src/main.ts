import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "@/App.vue";

// Import frequently used components
import FormGroup from '@/components/ui/FormGroup.vue'
import CardContainer from '@/components/ui/CardContainer.vue'
import {useToastStore} from "@/stores/toasts";


const app = createApp(App)

// Register default components

app.component('FormGroup', FormGroup)
app.component('CardContainer', CardContainer)

// Install the store instance as a plugin
app.use(createPinia())

const toastStore = useToastStore()

// Add global error handling
app.config.errorHandler = (err, instance, info) => {
    toastStore.add_toast('error', err + '<br>From instance: ' + instance.$.type.__name + '<br>Info: ' + info, 10000)
}

// Mount app
app.mount("#app");
