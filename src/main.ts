import { createApp } from "vue";
import { createPinia } from "pinia";
import PreviewImgs from "./components/PreviewImgs.vue";
import App from "./App.vue";
import router from "./router";
import "./assets/main.css";

const app = createApp(App);
app.component("PreviewImgs", PreviewImgs);
app.use(createPinia());
app.use(router);
app.mount("#app");
