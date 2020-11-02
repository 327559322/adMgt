<template>
  <div class="hello">
    <div style="margin-bottom:20px">
      <span>广告名称：微视互动广告</span>
    </div>
    <div>
      <span style="margin-right:20px">微视数据</span>
      <a-button type="primary">excel导入</a-button>
      <a-range-picker
        v-model:value="wsDataDateRange"
        @change=""
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
        v-model:value="currentAdOwner"
        style="width: 120px"
        @focus=""
        ref="select"
        @change=""
      >
        <a-select-option
          v-for="(item, index) in adOwnerSelect"
          :value="item"
          :key="index"
          >{{ item }}
        </a-select-option>
      </a-select>
      <a-range-picker
        v-model:value="adOwnerDataDateRange"
        @change=""
        style="float:right"
      />
      <a-table
        :columns="adOwnerColumns"
        :data-source="adOwnerData"
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
import { reactive, toRefs } from "vue";
const data = reactive({
  wsDataDateRange: [],
  wsColumns: [
    {
      title: "日期",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "小卡曝光量",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "小卡点击量",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "大卡曝光率",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "大卡点击量",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "总点击量（去重）",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "小卡点击率",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "大卡点击率",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "总点击率",
      dataIndex: "address",
      key: "address"
    }
  ],
  adOwnerDataDateRange: [],
  wsTableData: [],
  adOwnerColumns: [
    {
      title: "日期",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "曙光",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "点击",
      dataIndex: "address",
      key: "address"
    },
    {
      title: "点击率",
      dataIndex: "address",
      key: "address"
    }
  ],
  adOwnerData: [],
  adOwnerSelect: ["全部广告主", "美团", "饿了么", "电商"],
  currentAdOwner: "全部广告主"
});
export default {
  name: "HelloWorld",
  props: {
    msg: String
  },
  setup() {
    return {
      ...toRefs(data)
    };
  }
};
</script>

<style scoped lang="scss"></style>
