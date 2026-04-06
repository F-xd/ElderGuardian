export default defineAppConfig({
  pages: [
    "pages/login/login",
    "pages/index/index",
    "pages/digitalHealth/index",
    "pages/elder/list/list",
    "pages/elder/detail/detail",
    "pages/health/health",
    "pages/alarm/list/list",
    "pages/alarm/detail/detail",
    "pages/profile/index/index",
    "pages/profile/changePassword/changePassword",
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#4A90E2",
    navigationBarTitleText: "ElderGuardian",
    navigationBarTextStyle: "white",
  },
  tabBar: {
    color: "#666",
    selectedColor: "#4A90E2",
    backgroundColor: "#fff",
    borderStyle: "black",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页",
      },
      {
        pagePath: "pages/digitalHealth/index",
        text: "数字健康",
      },
      {
        pagePath: "pages/elder/list/list",
        text: "老人管理",
      },
      {
        pagePath: "pages/alarm/list/list",
        text: "告警中心",
      },
      {
        pagePath: "pages/profile/index/index",
        text: "个人中心",
      },
    ],
  },
});
