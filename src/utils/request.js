import axios from 'axios';
import { Loading, Message } from 'element-ui'; // 使用 Element UI 的消息提示
import router from '@/router'; // 导入 Vue Router 实例
import store from '@/store'; // 假设 store 文件路径为 src/store/index.js
import { debounce } from 'lodash';

// 创建 Axios 实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API || '/api', // 基础请求地址，根据需要调整
    timeout: 10000, // 请求超时时间
});



///////////重定向/////////////////////////////////////////////////////////////////////////////////////////
let isRedirecting = false; // 标记是否正在重定向
let redirectPromise = null; // 存储重定向的 Promise，确保只触发一次重定向

const redirectToLogin = debounce((code) => {
    if (isRedirecting) {
        return redirectPromise; // 如果正在重定向，返回已有的 Promise，避免重复执行
    }

    isRedirecting = true;
    redirectPromise = new Promise((resolve) => {
        // 根据不同的错误代码显示不同的错误信息
        if (code === 401) {
            Message.error('请先登录!');
        } else if (code === 706) {
            Message.error('登录状态已过期，请重新登录!');
        }

        // 清除本地存储
        localStorage.clear();

        // 执行重定向到登录页面
        router.push('/login').finally(() => {
            // 重定向完成后重置标志
            isRedirecting = false;
            resolve(); // 标记重定向已完成
        });
    });

    return redirectPromise; // 返回 Promise，其他请求会等待重定向完成
}, 1000);



//////////////展示loading////////////////////////////////////////////////////////////////////
// 记录正在执行的请求数量
let pendingRequestCount = 0;
let loadingInstance;

// 请求拦截器
service.interceptors.request.use(
    (config) => {
        // 获取 TablePagination 组件的 DOM 元素作为 target
        const targetElement = document.querySelector('.table-container'); // 通过类名获取

        // 如果目标元素存在，并且这是第一个请求，则显示 loading
        if (targetElement && pendingRequestCount === 0) {
            loadingInstance = Loading.service({
                target: targetElement, // 设置加载动画的目标区域
                text: '拼命加载中...', // 自定义显示的文字
                spinner: 'el-icon-loading', // 自定义加载图标
                background: 'rgba(0, 0, 0, 0.8)', // 自定义背景颜色
            });
        }

        // 增加请求数量计数
        pendingRequestCount++;

        // 在请求头中添加 token

        const token = store.getters.getGlobalVar.jwt;
        if (token) {
            config.headers['token'] = token;  // 设置自定义的 token 请求头
        } else {
            config.headers['token'] = '';  // 没有令牌设置为空
        }

        return config;
    },
    (error) => {
        console.error('请求错误:', error);
        // 请求出错时减少请求数量计数并隐藏 loading
        handleLoading();
        return Promise.reject(error);
    }
);

// 响应拦截器
service.interceptors.response.use(
    (response) => {
        // 减少请求数量计数
        handleLoading();
        const res = response.data;

        if (res.code === 401 || res.code === 706) {
            return redirectToLogin(res.code); // 触发登录重定向
        }

        // 如果响应的状态码不是 200，处理错误信息
        if (res.code !== 200) {
            Message.error(res.message || '请求失败');
            return Promise.reject(new Error(res.message || 'Error'));
        }

        return res;
    },
    (error) => {
        // 减少请求数量计数
        handleLoading();
        console.error('响应错误:', error);
        Message.error(error.response?.data?.message || '请求失败');
        return Promise.reject(error);
    }
);

/**
 * 处理 Loading 的显示和隐藏
 */
function handleLoading() {
    pendingRequestCount--;
    if (pendingRequestCount <= 0 && loadingInstance) {
        loadingInstance.close();
        loadingInstance = null; // 重置 loadingInstance
    }
}

export default service;