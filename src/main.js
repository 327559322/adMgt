import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { initAntd } from "./antd";
import "./permission";
var fly = require("flyio");
fly.config.timeout = 10000;
fly.config.baseURL = "";
const app = createApp(App)
  .use(store)
  .use(router);

initAntd(app);
app.mount("#app");
