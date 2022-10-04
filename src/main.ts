import { createApp } from "vue";
import { createPinia } from "pinia";
import piniaPersist from "pinia-plugin-persist";
import type { PiniaPluginContext } from "pinia";
import PreviewImgs from "./components/PreviewImgs.vue";
import InputDialog from "./components/InputDialog.vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

const app = createApp(App);
app.component("PreviewImgs", PreviewImgs);
app.component("InputDialog", InputDialog);
const pinia = createPinia();
pinia.use(piniaPersist);
app.use(pinia);
app.use(router);
app.mount("#app");
