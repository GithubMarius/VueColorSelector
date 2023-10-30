import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "@/App.vue";

// Import frequently used components
import FormGroup from '@/components/ui/FormGroup.vue'
import CardContainer from '@/components/ui/CardContainer.vue'

const app = createApp(App)

// Register default components

app.component('FormGroup', FormGroup)
app.component('CardContainer', CardContainer)

// Install the store instance as a plugin
app.use(createPinia())

// Mount app
app.mount("#app");
