var fly = require("flyio");
// 登录接口
export function login(params) {
  return fly.post("/api/advertising/login", params);
}
