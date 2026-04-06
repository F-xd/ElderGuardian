import {
  useDidShow,
  useDidHide,
  addInterceptor,
  getStorageSync,
} from "@tarojs/taro";
// 全局样式
import "./app.less";

// 添加请求拦截器
const requestInterceptor = function (chain) {
  const requestParams = chain.requestParams;
  const { method, data, url } = requestParams;

  // 获取token
  const token = getStorageSync("token");

  // 如果有token，添加到请求头
  if (token) {
    requestParams.header = {
      ...requestParams.header,
      Authorization: `Bearer ${token}`,
    };
  }

  console.log(`http ${method || "GET"} --> ${url} data: `, data);
  console.log("请求头:", requestParams.header);

  return chain.proceed(requestParams).then((res) => {
    console.log(`http <-- ${url} result:`, res);
    return res;
  });
};

// 注册拦截器
addInterceptor(requestInterceptor);

function App(props) {
  // 对应 onShow
  useDidShow(() => {});

  // 对应 onHide
  useDidHide(() => {});

  return props.children;
}

export default App;
