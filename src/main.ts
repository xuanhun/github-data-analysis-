import { createApp } from "vue";
import router from "./router";
import App from "./App.vue";
import { piniaInstance } from "./store";
import "./css/index.css";
import { i18n } from "./i18n";

const app = createApp(App);
app.config.globalProperties.$t = i18n.t;

app.use(router).use(piniaInstance).mount("#app");
