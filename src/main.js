import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { initAntd } from "./antd";
const app = createApp(App)
  .use(store)
  .use(router);

initAntd(app);
app.mount("#app");
