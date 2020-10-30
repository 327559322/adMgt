import { Button, Layout, Menu, Table, Modal } from "ant-design-vue";

export function initAntd(app) {
  app
    .use(Button)
    .use(Table)
    .use(Layout)
    .use(Modal)
    .use(Menu);
}
