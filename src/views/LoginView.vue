<template>
  <div class="login-container">
    <div class="login-card">
      <h1 class="login-title">电商管理后台登录</h1>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="username">用户名</label>
          <input type="text" id="username" v-model="loginForm.username" required>
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input type="password" id="password" v-model="loginForm.password" required>
        </div>
        <button type="submit" class="login-btn" :disabled="loading">
          {{ loading ? '登录中...' : '登 录' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = useRouter();
const userStore = useUserStore();

const loginForm = ref({
  username: '',
  password: ''
});
const loading = ref(false);

async function handleLogin() {
  if (loading.value) return;
  loading.value = true;
  try {
    await userStore.login(loginForm.value);
    router.push('/'); // 登录成功，跳转到主页
  } catch (error) {
    alert(error.message || '登录失败，请重试');
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}
.login-card {
  width: 400px;
  padding: 40px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
.login-title {
  text-align: center;
  font-size: 24px;
  color: #2c3e50;
  margin-bottom: 30px;
}
.form-group {
  margin-bottom: 20px;
}
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}
.form-group input {
  width: 100%;
  padding: 12px;
  box-sizing: border-box;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  font-size: 16px;
}
.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}
.login-btn:hover {
  background-color: #0056b3;
}
.login-btn:disabled {
  background-color: #a0cfff;
  cursor: not-allowed;
}
</style>
