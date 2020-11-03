var fly = require("flyio");
fly.config.timeout = 10000;

// 获取广告列表
export function getAdList() {
  return fly.get("/api/advertising/getAdvertisingList");
}

// 新建广告
export function addAd(params) {
  return fly.post("/api/advertising/addAdvertising", params);
}

// 图片上传
/* export function imgUpload(fileNames) {
  return fly.post("/advertising/addAdvertising", {
    fileNames
  });
} */

// 查询广告详情
export function qryAdDetail(advId) {
  return fly.get("/api/advertising/getAdvItem", {
    advId
  });
}

// 更新广告项
export function updateAd(params) {
  return fly.post("/api/advertising/updateAdv", params);
}

// 删除广告主项
export function deleteAdBusiness(businessId) {
  return fly.get("/api/advertising/delBusiness", {
    businessId
  });
}

// 删除广告
export function deleteAd(advId) {
  return fly.get("/api/advertising/delAdvertising", {
    advId
  });
}
