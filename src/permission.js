import router from "./router";
var fly = require("flyio");

router.beforeEach(async (to, from, next) => {
  const hasToken = window.localStorage.getItem("AD-MGT-TOKEN");
  if (to.path !== "/login") {
    if (hasToken) {
      fly.config.headers["token"] = hasToken;
      next();
    } else {
      next({ path: "/login" });
    }
  } else {
    if (hasToken) {
      next({ path: "/newAd" });
    } else {
      next();
    }
  }
});
