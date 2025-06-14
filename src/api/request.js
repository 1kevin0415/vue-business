import axios from 'axios';
import { useUserStore } from '@/stores/user'; // 稍后会创建这个文件

// 创建 axios 实例
const service = axios.create({
  baseURL: 'http://localhost:8080/api', // 统一的API前缀
  timeout: 10000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求前做些什么
    const userStore = useUserStore();
    if (userStore.token) {
      // 让每个请求携带自定义token
      config.headers['Authorization'] = `Bearer ${userStore.token}`;
    }
    return config;
  },
  error => {
    // 对请求错误做些什么
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 可以在这里添加响应拦截器，例如处理401/403错误，跳转到登录页等

export default service;
