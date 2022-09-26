// index.ts
import axios from "axios";
import type { AxiosRequestConfig } from "axios";
import router from "../router";
import { Notify } from "vant";
import { removeStorage, setStorage, getStorage } from "../utils/storage";

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status: number, other: string) => {
  // 状态码判断
  switch (status) {
    case 302:
      Notify("接口重定向了！");
      break;
    case 400:
      Notify(
        "发出的请求有错误，服务器没有进行新建或修改数据的操作==>" + status
      );
      break;
    case 401: //重定向
      Notify("token:登录失效==>" + status + ":");
      removeStorage("login");
      getStorage("login");
      router.replace({
        path: "/Login",
      });
      break;
    // 403 token过期
    // 清除token并跳转登录页
    case 403:
      Notify("登录过期,用户得到授权，但是访问是被禁止的==>" + status);
      // store.commit('token', null);
      setTimeout(() => {
        router.replace({
          path: "/login",
        });
      }, 1000);
      break;
    case 404:
      Notify("网络请求不存在==>" + status);
      break;

    case 500:
      Notify("服务器发生错误，请检查服务器==>" + status);
      break;
    case 502:
      Notify("网关错误==>" + status);
      break;
    case 503:
      Notify("服务不可用，服务器暂时过载或维护==>" + status);
      break;
    case 504:
      Notify("网关超时==>" + status);
      break;
    default:
      Notify("其他错误错误==>" + status);
  }
};

// 定义接口
interface PendingType {
  url?: string;
  method?: string;
  params: any;
  data: any;
  cancel: any;
}
// 取消重复请求
const pending: Array<PendingType> = [];
const CancelToken = axios.CancelToken;

// 移除重复请求
const removePending = (config: AxiosRequestConfig) => {
  for (const key in pending) {
    const item: number = +key;
    const list: PendingType = pending[key];
    // 当前请求在数组中存在时执行函数体
    if (
      list.url === config.url &&
      list.method === config.method &&
      JSON.stringify(list.params) === JSON.stringify(config.params) &&
      JSON.stringify(list.data) === JSON.stringify(config.data)
    ) {
      // 执行取消操作
      list.cancel("操作太频繁，请稍后再试");
      // 从数组中移除记录
      pending.splice(item, 1);
    }
  }
};

/* 实例化请求配置 */
const instance = axios.create({
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
  // 请求时长
  timeout: 1000 * 30,
  baseURL: import.meta.env.VITE_API_BASE,
  // 表示跨域请求时是否需要使用凭证
  // withCredentials: false,
});

/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  (config) => {
    removePending(config);
    config.cancelToken = new CancelToken((c) => {
      pending.push({
        url: config.url,
        method: config.method,
        params: config.params,
        data: config.data,
        cancel: c,
      });
    });
    // const token = store.state.token;
    // localStorage.setItem('token', token);

    // if (getStorage("login")) {
    //   config.headers.Authorization = getStorage("login");
    // }
    return config;
  },
  (error) => {
    Notify(error.data.error.message);
    return Promise.reject(error.data.error.message);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  function (config) {
    removePending(config.config);
    // 请求成功
    if (config.status === 200 || config.status === 204) {
      return Promise.resolve(config);
    } else {
      return Promise.reject(config);
    }
  },
  function (error) {
    const { response } = error;
    if (response) {
      errorHandle(response.status, response.data.message);

      // 超时重新请求
      const config = error.config;
      // 全局的请求次数,请求的间隙
      const [RETRY_COUNT, RETRY_DELAY] = [3, 1000];

      if (config && RETRY_COUNT) {
        // 设置用于跟踪重试计数的变量
        config.__retryCount = config.__retryCount || 0;
        // 检查是否已经把重试的总数用完
        if (config.__retryCount >= RETRY_COUNT) {
          return Promise.reject(response || { message: error.message });
        }
        // 增加重试计数
        config.__retryCount++;
        // 创造新的Promise来处理指数后退
        const backoff = new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, RETRY_DELAY || 1);
        });
        // instance重试请求的Promise
        return backoff.then(() => {
          return instance(config);
        });
      }

      return Promise.reject(response);
    } else {
      // 处理断网的情况
    }
  }
);
// 只需要考虑单一职责，这块只封装axios
export default instance;
