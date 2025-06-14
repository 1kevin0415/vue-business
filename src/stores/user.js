import { defineStore } from 'pinia';
import { ref } from 'vue';
import { loginApi, getInfoApi, logoutApi } from '@/api/admin';
import router from '@/router';

export const useUserStore = defineStore('user', () => {
  const token = ref(localStorage.getItem('TOKEN') || '');
  const userInfo = ref({});

  // 登录操作
  async function login(loginForm) {
    try {
      const response = await loginApi(loginForm);

      // --- ↓↓↓ 这是本次最关键的修改 ↓↓↓ ---
      // 检查返回的状态码是否为200，并且内层data对象中确实包含了token
      if (response.data.code === 200 && response.data.data && response.data.data.token) {
        token.value = response.data.data.token;
        localStorage.setItem('TOKEN', token.value);
        await getUserInfo(); // 登录成功后获取用户信息
        return 'ok';
      } else {
        // 如果后端返回的不是预期的成功结构，则认为是失败
        return Promise.reject(new Error(response.data.message || '登录失败，返回数据格式不正确'));
      }
      // --- ↑↑↑ 修改结束 ↑↑↑ ---

    } catch (error) {
      // 捕获网络请求本身的错误，例如403, 404, 500等
      const errorMessage = error.response?.data?.message || '用户名或密码无效';
      return Promise.reject(new Error(errorMessage));
    }
  }

  // 获取用户信息
  async function getUserInfo() {
    const response = await getInfoApi();
    // 后端返回的结构是 { code: 200, data: { id: ..., username: ... } }
    if (response.data.code === 200 && response.data.data) {
      userInfo.value = response.data.data;
    } else {
      return Promise.reject(new Error('获取用户信息失败'));
    }
  }

  // 退出登录
  async function logout() {
    try {
      await logoutApi();
    } catch (error) {
      console.error('登出接口调用失败', error);
    } finally {
      // 不管后端成功与否，前端都清除状态
      token.value = '';
      userInfo.value = {};
      localStorage.removeItem('TOKEN');
      router.push('/login');
    }
  }

  return {
    token,
    userInfo,
    login,
    getUserInfo,
    logout
  };
});