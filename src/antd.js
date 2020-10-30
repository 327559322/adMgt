import { Button, Layout, Menu } from "ant-design-vue";

export function initAntd(app) {
  app
    .use(Button)
    .use(Layout)
    .use(Menu);
}
