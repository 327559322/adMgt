import router from "./router";
var fly = require("flyio");
fly.config.timeout = 10000;
fly.config.baseURL = "";
//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  response => {
    //只将请求结果的data字段返回
    return response;
  },
  err => {
    console.log(err);
    if (err.status === 401) {
      window.localStorage.removeItem("AD-MGT-TOKEN");
      router.push({
        path: "/login"
      });
    }
    //发生网络错误后会走到这里
    //return Promise.resolve("ssss")
  }
);
