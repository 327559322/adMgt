<template>
  <div class="hello">
    <div style="margin-bottom:20px">
      <span>广告名称：{{ adName }}</span>
    </div>
    <div>
      <div class="table-nav">
        <span style="margin-right:20px">微视数据</span>
        <a-upload
          v-model:fileList="fileList"
          name="file"
          :multiple="true"
          :action="'/api/advertising/inputExcel/' + advId"
          @change="handleChange"
        >
          <a-button> <upload-outlined />excel导入</a-button>
        </a-upload>
      </div>
      <a-range-picker
        v-model:value="wsDataDateRange"
        @change="changeWsDataDate"
        style="float:right"
      />
      <a-table
        :columns="wsColumns"
        :data-source="wsTableData"
        style="margin-top:10px;margin-bottom:10px"
      >
        <template v-slot:action>
          <a-button type="primary">统计</a-button>
          <a-button type="primary">编辑</a-button>
          <a-button type="danger">删除</a-button>
        </template>
      </a-table>
    </div>
    <div>
      <span style="margin-right:20px">广告主数据</span>
      <a-select
        v-model:value="currentAdBus"
        style="width: 200px"
        ref="select"
        @change="adBusChange"
      >
        <a-select-option
          v-for="(item, index) in adOwnerSelect"
          :value="item.businessId"
          :key="index"
          >{{ item.businessName }}
        </a-select-option>
      </a-select>
      <a-range-picker
        v-model:value="adBusDataDateRange"
        @change="changeAdBusDataDate"
        style="float:right"
      />
      <a-table
        :columns="adBusColumns"
        :data-source="adBusData"
        style="margin-top:10px;margin-bottom:10px"
      >
        <template v-slot:action>
          <a-button type="primary">统计</a-button>
          <a-button type="primary">编辑</a-button>
          <a-button type="danger">删除</a-button>
        </template>
      </a-table>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { useRoute } from "vue-router";
import { UploadOutlined } from "@ant-design/icons-vue";
import { message } from "ant-design-vue";
import {
  getWsDataList,
  getAdBusData,
  getBusinessItem
} from "../api/detailTotal";
import dayjs from "dayjs";
var moment = require("moment");
const data = reactive({
  adName: "",
  advId: "",
  fileList: [],
  wsDataDateRange: [],
  adBusDataDateRange: [],
  wsColumns: [
    {
      title: "日期",
      dataIndex: "dateFormat"
    },
    {
      title: "小卡曝光量",
      dataIndex: "smallCardExposure"
    },
    {
      title: "小卡点击量",
      dataIndex: "smallCardClick"
    },
    {
      title: "大卡曝光率",
      dataIndex: "bigCardExposure"
    },
    {
      title: "大卡点击量",
      dataIndex: "bigCardClick"
    },
    {
      title: "总点击量（去重）",
      dataIndex: "sumClick"
    },
    {
      title: "小卡点击率",
      dataIndex: "smallClickRateFormat"
    },
    {
      title: "大卡点击率",
      dataIndex: "bigClickRateFormat"
    },
    {
      title: "总点击率",
      dataIndex: "sumClickRateFormat"
    }
  ],
  wsTableData: [],
  adBusColumns: [
    {
      title: "日期",
      dataIndex: "date"
    },
    {
      title: "曝光数",
      dataIndex: "exposure"
    },
    {
      title: "点击",
      dataIndex: "click"
    },
    {
      title: "点击率",
      dataIndex: "clickRate"
    }
  ],
  adBusData: [],
  adOwnerSelect: [],
  currentAdBus: ""
});
let route;
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  components: {
    UploadOutlined
  },
  setup() {
    onMounted(() => {
      route = useRoute();
      data.adName = route.query.name || "";
      data.advId = route.query.id;
      const last7Day = dayjs()
        .subtract(7, "day")
        .format("YYYY-MM-DD")
        .toString();
      const currentDay = dayjs()
        .format("YYYY-MM-DD")
        .toString();
      data.wsDataDateRange = [
        moment(last7Day, "YYYY-MM-DD"),
        moment(currentDay, "YYYY-MM-DD")
      ];
      data.adBusDataDateRange = [
        moment(last7Day, "YYYY-MM-DD"),
        moment(currentDay, "YYYY-MM-DD")
      ];
      getBusinessItem(route.query.id).then(res => {
        data.adOwnerSelect = [
          { businessId: null, businessName: "全部广告主" }
        ].concat(res.data.data);
        data.currentAdBus = data.adOwnerSelect[0]?.businessId;
        qryAdBusList(data.currentAdBus, last7Day, currentDay);
      });
      qryWsDataList(route.query.id, last7Day, currentDay);
    });
    return {
      moment,
      changeWsDataDate,
      changeAdBusDataDate,
      adBusChange,
      handleChange,
      ...toRefs(data)
    };
  }
};
// 微视数据日期选择
function changeWsDataDate(date, dateStr) {
  console.log(data, dateStr);
  qryWsDataList(route.query.id, dateStr[0], dateStr[1]);
}
// 查询微视数据列表
function qryWsDataList(advId, startTime, endTime) {
  getWsDataList({
    startTime,
    endTime,
    advId
  }).then(res => {
    console.log(res);
    if (res.data.data !== "") {
      data.wsTableData = res.data.data.map((res, index) => {
        return {
          ...res,
          key: index
        };
      });
    } else {
      data.wsTableData = [];
    }
  });
}
// 广告主筛选
function adBusChange(busId) {
  console.log(data);
  data.currentAdBus = busId;
  qryAdBusList(
    busId,
    data.adBusDataDateRange[0].format("YYYY-MM-DD"),
    data.adBusDataDateRange[1].format("YYYY-MM-DD")
  );
}
// 广告主数据日期选择
function changeAdBusDataDate(date, dateStr) {
  qryAdBusList(data.currentAdBus, dateStr[0], dateStr[1]);
}
// 查询广告主列表
function qryAdBusList(businessId, startTime, endTime) {
  getAdBusData({
    ...(businessId ? { businessId } : { advId: route.query.id }),
    startTime,
    endTime
  }).then(res => {
    console.log(res);
    data.adBusData = res.data.data.map((res, index) => {
      return {
        ...res,
        key: index
      };
    });
  });
}
function handleChange(info) {
  if (info.file.status !== "uploading") {
    console.log(info.file, info.fileList);
  }
  if (info.file.status === "done") {
    message.success(`${info.file.name} file uploaded successfully`);
  } else if (info.file.status === "error") {
    message.error(`${info.file.name} file upload failed.`);
  }
}
</script>

<style scoped lang="scss">
.table-nav {
  align-items: center;
  width: 50%;
  display: inline-block;
}
</style>
