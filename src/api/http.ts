import axios from "axios";
// import store from "@/store/index";

/* 
    引入qs模块，用来序列化post类型的数据，
 */
import QS from "qs";

/* 
    根据不同环境切换不同的baseUrl
    项目环境可能有开发环境、测试环境和生产环境等。
    我们通过node的环境变量来匹配我们的默认的接口url前缀 
*/
const ENV = import.meta.env.VITE_USER_NODE_ENV; //保存当前环境
switch (ENV) {
  case "development":
    axios.defaults.baseURL = "yrm-web-backend";
    break;
  case "xiaozhu":
    axios.defaults.baseURL = "https://www.xiaozhu.com";
    break;
  case "longjun":
    axios.defaults.baseURL = "https://www.longjun.com";
    break;
  default:
    axios.defaults.baseURL = "yrm-web-backend";
    break;
}

/* 
    设置请求超时时间，如果超过了10秒就会通知用户请求超时请刷新等
*/
axios.defaults.timeout = 10000;

/* 
    设置默认请求头
*/
axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";

/* 
    设置请求拦截 
    每次发送请求之前判断vuex中是否存在token
    如果存在，则统一在http请求的header都加上token，这样后台根据token判断你的登录情况
    即使本地存在token，也有可能token是过期的，所以在响应拦截器中要对返回状态进行判断
*/
axios.interceptors.request.use(
  (config) => {
    // const token = store.state.token;
    // token && (config.headers.Authorization = token);
    return config;
  },
  (error) => {
    return Promise.error(error);
  }
);

/* 
  设置响应拦截
*/

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    console.log(response, "response");
    if (response.status === 200) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(response);
    }
  },
  // 服务器状态码不是200的情况
  (error) => {
    if (error.response.status) {
      switch (error.response.status) {
        // 401: 未登录
        // 未登录则跳转登录页面，并携带当前页面的路径
        // 在登录成功后返回当前页面，这一步需要在登录页操作。
        case 401:
          //   router.replace({
          //     path: "/login",
          //     query: { redirect: router.currentRoute.fullPath },
          //   });
          break;
        // 403 token过期
        // 登录过期对用户进行提示
        // 清除本地token和清空vuex中token对象
        // 跳转登录页面
        case 403:
          //   Toast({
          //     message: "登录过期，请重新登录",
          //     duration: 1000,
          //     forbidClick: true,
          //   });
          // 清除token
          localStorage.removeItem("token");
          //   store.commit("loginSuccess", null);
          // 跳转登录页面，并将要浏览的页面fullPath传过去，登录成功后跳转需要访问的页面
          setTimeout(() => {
            // router.replace({
            //   path: "/login",
            //   query: {
            //     redirect: router.currentRoute.fullPath,
            //   },
            // });
          }, 1000);
          break;
        // 404请求不存在
        case 404:
          //   Toast({
          //     message: "网络请求不存在",
          //     duration: 1500,
          //     forbidClick: true,
          //   });
          break;
        // 其他错误，直接抛出错误提示
        default:
        //   Toast({
        //     message: error.response.data.message,
        //     duration: 1500,
        //     forbidClick: true,
        //   });
      }
      return Promise.reject(error.response);
    }
  }
);

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url: string, params: any) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params,
      })
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url: string, params: any) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, QS.stringify(params)) // 是否需要序列化看项目后端怎么要了，不需要自行注释。
      .then((res) => {
        resolve(res.data);
      })
      .catch((err) => {
        reject(err.data);
      });
  });
}
