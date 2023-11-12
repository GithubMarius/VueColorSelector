import {createApp} from "vue";
import {createPinia} from "pinia";
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import App from "@/App.vue";

// Import frequently used components
import FormGroup from '@/components/ui/FormGroup.vue'
import CardContainer from '@/components/ui/CardContainer.vue'

// ToastStore
import {useToastStore} from "@/stores/toasts";
import {useSettingsStore} from "@/stores/settings";
import {create} from "domain";


const app = createApp(App)

// Register default components

app.component('FormGroup', FormGroup)
app.component('CardContainer', CardContainer)

// Install the store instance as a plugin
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

app.use(pinia)

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
