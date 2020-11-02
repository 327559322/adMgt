<template>
  <div>
    <a-button type="primary" @click="popWin(false)">新建广告</a-button>
    <div class="table-content">
      <a-table :columns="columns" :data-source="tableData">
        <template v-slot:action="{ record }">
          <a-button type="primary">统计</a-button>
          <a-button type="primary" @click="popWin(true, record)">编辑</a-button>
          <a-button type="danger" @click="popDelete">删除</a-button>
        </template>
      </a-table>
    </div>
    <a-modal
      title="新建广告"
      v-model:visible="visible"
      dialogClass="ad-dialog"
      ok-text="确认"
      cancel-text="取消"
      :confirm-loading="confirmLoading"
      @ok="handleOk"
    >
      {{ popForm.adOwnlList }}
      <a-form
        :model="popForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-item label="广告名称：">
          <a-input v-model:value="popForm.adName" />
        </a-form-item>
        <a-form-item label="互动游戏：">
          <img class="game-img" />
        </a-form-item>
        <a-form-item label="活动规则：">
          <a-input v-model:value="popForm.rule" />
        </a-form-item>
        <a-form-item label="广告主：">
          <div
            v-for="(item, index) in popForm.adOwnlList"
            :key="index"
            class="ad-block"
          >
            <a-input
              v-model:value="popForm.adOwnlList[index].adOwnerName"
              placeholder="广告主名称"
            />
            <a-input
              v-model:value="popForm.adOwnlList[index].adUrl"
              placeholder="活动落地页"
            />

            <a-upload
              v-model:fileList="popForm.adOwnlList[index].fileList"
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              :before-upload="beforeUpload"
              @change="popForm.adOwnlList[index].handleChange"
            >
              <img
                class="upload-img"
                v-if="popForm.adOwnlList[index].imageUrl"
                :src="popForm.adOwnlList[index].imageUrl"
                alt="avatar"
              />
              <div v-else>
                <!-- todo -->
                <loading-outlined v-if="popForm.adOwnlList[index].loading" />
                <plus-outlined v-else />
                <div class="ant-upload-text">展示素材</div>
              </div>
            </a-upload>
            <MinusCircleOutlined
              class="delete-icon"
              @click="deleteAdItem(index)"
              v-if="index !== 0"
            />
          </div>
          <a-button type="dashed" @click="addAdItem">
            添加
          </a-button>
        </a-form-item>
      </a-form>
    </a-modal>
    <a-modal
      title="删除"
      ok-text="确认"
      cancel-text="取消"
      v-model:visible="isPopDelete"
      :confirm-loading="deleteLoading"
      @ok="deleteOk"
    >
      <p>是否删除？</p>
    </a-modal>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import {
  PlusOutlined,
  LoadingOutlined,
  MinusCircleOutlined
} from "@ant-design/icons-vue";
var _ = require("lodash");
const data = reactive({
  visible: false, // 新建编辑广告弹窗
  confirmLoading: false, // 请求中标识
  isPopDelete: false, // 是否弹出删除提示弹窗
  deleteLoading: false, // 删除请求中标识
  columns: [
    // 表格字段
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
    // 表格数据
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
  ],
  popForm: {
    adOwnlList: [
      {
        adOwnerName: "",
        adUrl: "",
        fileList: [],
        imageUrl: "",
        loading: false,
        handleChange: getHandleChange(0)
      }
    ]
  }
});
const popFormTmp = _.cloneDeep(data.popForm);
function popWin(isEdit, itemData) {
  data.popForm = _.cloneDeep(popFormTmp);
  if (isEdit) {
    data.popForm["adName"] = itemData.name;
  }
  data.visible = true;
}
function handleOk() {
  data.confirmLoading = true;
  setTimeout(() => {
    data.visible = false;
    data.confirmLoading = false;
  }, 2000);
}
function getHandleChange(index) {
  return function handleChange(info) {
    console.log(info);
    if (info.file.status === "uploading") {
      data.popForm.adOwnlList[index].loading = true;
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        data.popForm.adOwnlList[index].imageUrl = imageUrl;
        data.popForm.adOwnlList[index].loading = false;
      });
    }
    if (info.file.status === "error") {
      data.popForm.adOwnlList[index].loading = false;
    }
  };
}
function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}
function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    alert("You can only upload JPG file!");
    // this.$message.error("You can only upload JPG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    alert("Image must smaller than 2MB!");
    // this.$message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}
function deleteAdItem(index) {
  data.popForm.adOwnlList.splice(index, 1);
}
function addAdItem() {
  const index = data.popForm.adOwnlList.length;
  data.popForm.adOwnlList.push({
    adOwnerName: "",
    adUrl: "",
    fileList: [],
    imageUrl: "",
    loading: false,
    handleChange: getHandleChange(index)
  });
}
function popDelete() {
  data.isPopDelete = true;
}
function deleteOk() {
  data.deleteLoading = true;
  setTimeout(() => {
    data.isPopDelete = false;
    data.deleteLoading = false;
  }, 1000);
}
/* function deleteItem(index) {
  this.$message.loading("Action in progress..", 0);
} */
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  components: {
    LoadingOutlined,
    PlusOutlined,
    MinusCircleOutlined
  },
  setup() {
    return {
      ...toRefs(data),
      popWin,
      handleOk,
      beforeUpload,
      deleteAdItem,
      addAdItem,
      deleteOk,
      popDelete
    };
  },
  methods: {
    deleteItem(index) {
      // this.$message.info("This is a normal message");
    }
  }
};
</script>

<style scoped lang="scss">
.table-content {
  margin-top: 20px;
}
.ant-btn {
  margin-right: 8px;
}
.game-img {
  width: 100px;
  height: 100px;
}
.ad-block {
  position: relative;
  .upload-img {
    max-width: 200px;
  }
  .delete-icon {
    position: absolute;
    top: 50%;
    font-size: 20px;
    color: red;
    cursor: pointer;
  }
  .avatar-uploader > .ant-upload {
    width: 128px;
    height: 128px;
  }
  .ant-upload-select-picture-card i {
    font-size: 32px;
    color: #999;
  }

  .ant-upload-select-picture-card .ant-upload-text {
    margin-top: 8px;
    color: #666;
  }
}
</style>
<style lang="scss">
.ad-dialog {
  .ant-modal-body {
    overflow-y: auto;
    max-height: 500px;
  }
}
</style>
