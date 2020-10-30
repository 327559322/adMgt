import { createRouter, createWebHashHistory } from "vue-router";
import LayOut from "@/components/LayOut";
export const routes = [
  {
    path: "/",
    name: "root",
    redirect: "/newAd",
    component: LayOut,
    children: [
      {
        path: "/newAd",
        name: "新建互动广告",
        component: () =>
          import(/* webpackChunkName: "newAd" */ "../views/newAd.vue")
      },
      {
        path: "/dataTotal",
        name: "数据统计",
        component: () =>
          import(/* webpackChunkName: "dataTotal" */ "../views/dataTotal.vue")
      }
    ]
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
