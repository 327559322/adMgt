<template>
  <div>
    <a-button type="primary" @click="popWin(false)">新建广告</a-button>
    <div class="table-content">
      <a-table :columns="columns" :data-source="tableData">
        <template v-slot:action="{ record }">
          <a-button type="primary" @click="goToTotal(record)">统计</a-button>
          <a-button type="primary" @click="popWin(true, record)">编辑</a-button>
          <a-button type="danger" @click="popDelete(record.advId)"
            >删除</a-button
          >
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
      <a-form
        :model="popForm"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 14 }"
      >
        <a-form-item label="广告名称：">
          <a-input v-model:value="popForm.advName" />
        </a-form-item>
        <a-form-item label="互动游戏：">
          <img class="game-img" src="../assets/game.jpg" />
        </a-form-item>
        <a-form-item label="活动规则：">
          <a-textarea
            v-model:value="popForm.ruleOfActivity"
            placeholder="输入活动规则"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
        <a-form-item label="广告主：">
          <div
            v-for="(item, index) in popForm.businessList"
            :key="index"
            class="ad-block"
          >
            <a-input
              v-model:value="item.businessName"
              placeholder="广告主名称"
            />
            <a-input
              v-model:value="item.landingPage"
              placeholder="活动落地页"
            />

            <a-upload
              v-model:fileList="item.fileList"
              name="avatar"
              list-type="picture-card"
              class="avatar-uploader"
              :show-upload-list="false"
              action="/api/advertising/uploadFile"
              :before-upload="beforeUpload"
              @change="item.handleChange"
            >
              <img
                class="upload-img"
                v-if="item.displayMaterial"
                :src="item.displayMaterial"
                alt="avatar"
              />
              <div v-else>
                <!-- todo -->
                <loading-outlined v-if="item.loading" />
                <plus-outlined v-else />
                <div class="ant-upload-text">展示素材</div>
              </div>
            </a-upload>
            <MinusCircleOutlined
              class="delete-icon"
              @click="popDelete(item.businessId, index)"
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
      <p>{{ visible ? "是否删除该广告主？" : "是否删除该广告？" }}</p>
    </a-modal>
  </div>
</template>

<script>
import { reactive, toRefs, inject } from "vue";
import { useRouter } from "vue-router";
import { message } from "ant-design-vue";
import {
  PlusOutlined,
  LoadingOutlined,
  MinusCircleOutlined
} from "@ant-design/icons-vue";
import {
  getAdList,
  addAd,
  deleteAd,
  qryAdDetail,
  updateAd,
  deleteAdBusiness
} from "../api/newAd";
var _ = require("lodash");

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
    console.log(data.popForm);
    router = useRouter();
    changeMenuRoute = inject("changeMenuRoute");
    qryAdList();
    return {
      ...toRefs(data),
      popWin,
      handleOk,
      beforeUpload,
      deleteAdItem,
      addAdItem,
      deleteOk,
      popDelete,
      goToTotal
    };
  }
};
const data = reactive({
  visible: false, // 新建编辑广告弹窗
  confirmLoading: false, // 请求中标识
  isPopDelete: false, // 是否弹出删除提示弹窗
  deleteLoading: false, // 删除请求中标识
  isEdit: false, // 是否是编辑状态
  deleteItemId: "",
  deleteItemIndex: "",
  columns: [
    // 表格字段
    {
      title: "广告名称",
      dataIndex: "advName"
    },
    {
      title: "广告地址",
      dataIndex: "advAddress"
    },
    {
      title: "操作",
      slots: { customRender: "action" }
    }
  ],
  tableData: [],
  popForm: {
    businessList: [
      {
        businessId: "",
        businessName: "",
        landingPage: "",
        fileList: [],
        displayMaterial: "",
        loading: false,
        handleChange: getHandleChange(0)
      }
    ]
  }
});
const popFormTmp = _.cloneDeep(data.popForm); // 弹窗变量备份
let router;
let changeMenuRoute;
function qryAdList() {
  getAdList()
    .then(res => {
      data.tableData = res.data.data.map((res, index) => {
        return {
          key: index,
          ...res
        };
      });
    })
    .catch(e => console.log("error", e));
}
// 弹出新建/编辑窗口
function popWin(isEdit, itemData) {
  data.popForm = _.cloneDeep(popFormTmp);
  data.isEdit = isEdit;
  if (isEdit) {
    qryAdDetail(itemData.advId).then(res => {
      data.popForm["advId"] = res.data.data.advId;
      data.popForm["advName"] = res.data.data.advName;
      data.popForm["ruleOfActivity"] = res.data.data.ruleOfActivity || "";
      data.popForm.businessList = res.data.restsData.map((res, index) => {
        return {
          businessId: res.businessId,
          businessName: res.businessName,
          landingPage: res.landingPage,
          displayMaterial: res.displayMaterial,
          fileList: [],
          loading: false,
          handleChange: getHandleChange(index)
        };
      });
    });
  }
  data.visible = true;
}
// 新建/更新
function handleOk() {
  data.confirmLoading = true;
  if (data.isEdit) {
    updateAd(data.popForm).then(res => {
      data.visible = false;
      data.confirmLoading = false;
      message.success(`更新成功`);
    });
  } else {
    addAd(data.popForm).then(res => {
      if (res.data.data === true) {
        message.success(`添加成功`);
      }
      data.visible = false;
      data.confirmLoading = false;
    });
  }
}
// 获取图片上传处理函数
function getHandleChange(index) {
  return function handleChange(info) {
    if (info.file.status === "uploading") {
      data.popForm.businessList[index].loading = true;
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      data.popForm.businessList[index].displayMaterial =
        info.file.response.data;
      data.popForm.businessList[index].loading = false;
      /* getBase64(info.file.originFileObj, imageUrl => {
        data.popForm.businessList[index].displayMaterial = imageUrl;
        data.popForm.businessList[index].loading = false;
      }); */
    }
    if (info.file.status === "error") {
      data.popForm.businessList[index].loading = false;
    }
  };
}
// base64转换
/* function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
} */
// 图片格式检查
function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    alert("You can only upload JPG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    alert("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}
// 删除广告主项
function deleteAdItem(index, id) {
  popDelete(id);
  /* data.popForm.businessList.splice(index, 1);
  deleteAdBusiness(id).then(res => {
    console.log(res);
  }); */
}
// 添加广告主项
function addAdItem() {
  const index = data.popForm.businessList.length;
  data.popForm.businessList.push({
    businessName: "",
    landingPage: "",
    fileList: [],
    displayMaterial: "",
    loading: false,
    handleChange: getHandleChange(index)
  });
}
// 弹出删除提示框
function popDelete(id, index) {
  data.deleteItemId = id;
  data.deleteItemIndex = index;
  if (data.deleteItemId) {
    data.isPopDelete = true;
  } else if (data.visible) {
    // 有弹窗说明删除的是广告主项
    data.popForm.businessList.splice(index, 1);
  }
}
// 点击确认删除
function deleteOk() {
  data.deleteLoading = true;
  if (data.visible) {
    // 有弹窗说明删除的是广告主项
    data.popForm.businessList.splice(data.deleteItemIndex, 1);
    deleteAdBusiness(data.deleteItemId).then(res => {
      data.isPopDelete = false;
      data.deleteLoading = false;
      message.success("删除成功");
    });
  } else {
    deleteAd(data.deleteItemId).then(res => {
      data.isPopDelete = false;
      data.deleteLoading = false;
      message.success("删除成功");
      qryAdList();
    });
  }
}
function goToTotal(record) {
  router.push({
    path: "dataTotal",
    query: {
      id: record.advId,
      name: record.advName
    }
  });
  changeMenuRoute("数据统计");
}
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
  height: 140px;
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
  .avatar-uploader {
    margin-top: 4px;
    > .ant-upload {
      width: 128px;
      height: 128px;
    }
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
