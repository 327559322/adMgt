<template>
  <div>
    <a-button type="primary" @click="popWin">新建广告</a-button>
    <div class="table-content">
      <a-table :columns="columns" :data-source="tableData">
        <template v-slot:action>
          <a-button type="primary">统计</a-button>
          <a-button type="primary">编辑</a-button>
          <a-button type="danger">删除</a-button>
        </template>
      </a-table>
    </div>
    <a-modal
      title="Title"
      v-model:visible="visible"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      <p>123</p>
    </a-modal>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
const data = reactive({
  visible: false,
  confirmLoading: false,
  columns: [
    {
      title: "广告名称",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "广告地址",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "操作",
      key: "action",
      slots: { customRender: "action" }
    }
  ],
  tableData: [
    {
      key: "1",
      name: "John Brown",
      address: "New York No. 1 Lake Park"
    },
    {
      key: "2",
      name: "Jim Green",
      address: "London No. 1 Lake Park"
    },
    {
      key: "3",
      name: "Joe Black",
      address: "Sidney No. 1 Lake Park"
    }
  ]
});
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  setup() {
    return {
      ...toRefs(data),
      popWin,
      handleOk
    };
  }
};

function popWin() {
  data.visible = true;
}
function handleOk() {
  data.confirmLoading = true;
  setTimeout(() => {
    data.visible = false;
    data.confirmLoading = false;
  }, 2000);
}
</script>

<style scoped lang="scss">
.table-content {
  margin-top: 20px;
}
.ant-btn {
  margin-right: 8px;
}
</style>
