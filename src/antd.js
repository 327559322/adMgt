import {
  Button,
  Layout,
  Menu,
  Table,
  Modal,
  Form,
  Input,
  Upload,
  DatePicker,
  Select,
  message,
  InputNumber
} from "ant-design-vue";

export function initAntd(app) {
  app
    .use(Button)
    .use(Table)
    .use(Layout)
    .use(Modal)
    .use(Form)
    .use(Input)
    .use(Upload)
    .use(DatePicker)
    .use(Select)
    .use(message)
    .use(InputNumber)
    .use(Menu);
  app.config.globalProperties.$message = message;
}
