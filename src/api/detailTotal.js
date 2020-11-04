var fly = require("flyio");
// fly.config.timeout = 10000;
// 获取微视数据列表
export function getWsDataList(params) {
  return fly.get("/api/advertising/getList", params);
}

// 获取广告主数据列表
export function getAdBusData(params) {
  return fly.get("/api/advertising/getCount", params);
}

// 获取广告主项
export function getBusinessItem(advId) {
  return fly.get("/api/advertising/getBusinessItem", {
    advId
  });
}

// 导入excel
/* export function inputExcel(file, advId) {
  return fly.post("/api/advertising/inputExcel", {
    file,
    advId
  });
} */
