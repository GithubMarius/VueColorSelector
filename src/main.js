import { createApp } from "vue";
import { createPinia } from "pinia";
  

import App from "./App.vue";

const app = createApp(App)

// Install the store instance as a plugin
app.use(createPinia())

// Mount app
app.mount("#app");
