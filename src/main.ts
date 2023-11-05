import {createApp} from "vue";
import {createPinia} from "pinia";

import App from "@/App.vue";

// Import frequently used components
import FormGroup from '@/components/ui/FormGroup.vue'
import CardContainer from '@/components/ui/CardContainer.vue'

// ToastStore
import {useToastStore} from "@/stores/toasts";
import {useSettingsStore} from "@/stores/settings";


const app = createApp(App)

// Register default components

app.component('FormGroup', FormGroup)
app.component('CardContainer', CardContainer)

// Install the store instance as a plugin
app.use(createPinia())

// Add global error handling (pushing errors as toasts)

const toastStore = useToastStore()

const settingsStore = useSettingsStore()

if (!settingsStore.debug_mode.value) {
    app.config.errorHandler = (err, instance, info) => {
        toastStore.push_error(err + '<br>From instance: ' + instance.$.type.__name + '<br>Info: ' + info)
    }
}

// Mount app
app.mount("#app");
