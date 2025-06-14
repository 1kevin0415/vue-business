<template>
  <div id="app-wrapper">
    <!-- 1. 修改：仅在用户登录后（即token存在时）显示头部导航栏 -->
    <header class="app-header" v-if="userStore.token">
      <div class="logo">
        <router-link to="/">🚀 电商管理后台</router-link>
      </div>
      <nav class="main-nav">
        <router-link to="/">主页</router-link>
        <router-link to="/products">商品管理</router-link>
        <router-link to="/customers">客户管理</router-link>
        <router-link to="/orders">订单管理</router-link>
        <router-link to="/deliveries">配送管理</router-link>
      </nav>

      <!-- 2. 新增：个人中心下拉菜单 -->
      <div class="user-profile">
        <div @click="toggleDropdown" class="profile-trigger">
          <span class="username">欢迎，{{ userStore.userInfo.username || '管理员' }}</span>
          <i class="arrow-icon" :class="{ 'is-open': dropdownOpen }">▼</i>
        </div>
        <transition name="dropdown">
          <div v-if="dropdownOpen" class="profile-dropdown">
            <a @click.prevent="handleLogout" href="#">退出登录</a>
          </div>
        </transition>
      </div>
      
    </header>
    <main class="app-content">
      <router-view/>
    </main>
  </div>
</template>

<!-- 3. 新增：完整的 <script setup> 部分，用于处理逻辑 -->
<script setup>
import { ref, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';

// 获取用户状态仓库
const userStore = useUserStore();
// 控制下拉菜单的显示/隐藏
const dropdownOpen = ref(false);
// 获取当前路由信息
const route = useRoute();

// 点击用户名时，切换下拉菜单的显示状态
function toggleDropdown() {
  dropdownOpen.value = !dropdownOpen.value;
}

// 处理退出登录
function handleLogout() {
  userStore.logout(); // 调用仓库中的 logout 方法
  dropdownOpen.value = false; // 关闭下拉菜单
}

// 监听路由变化，当切换页面时自动关闭下拉菜单
watch(route, () => {
  dropdownOpen.value = false;
});
</script>

<style>
/* 全局样式重置和背景 (来自您的代码) */
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  background-color: #f8f9fa; /* 为整个应用提供一个浅灰色背景 */
}

#app-wrapper {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 新的头部导航栏样式 (来自您的代码) */
.app-header {
  display: flex;
  /* 4. 修改：不再使用 justify-content: space-between; 以便个人中心能正确对齐 */
  align-items: center;
  padding: 0 40px;
  height: 64px;
  background-color: #2c3e50; /* 深色背景 */
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.app-header .logo a {
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  text-decoration: none;
  transition: opacity 0.3s;
}

.app-header .logo a:hover {
  opacity: 0.8;
}

.main-nav {
    /* 5. 新增：让导航占据可用空间，把用户菜单推到最右侧 */
    flex-grow: 1;
    margin-left: 60px;
}

.main-nav a {
  margin: 0 18px;
  color: #a7b1bd;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s;
  padding-bottom: 4px;
  border-bottom: 2px solid transparent;
}

.main-nav a:hover {
  color: #ffffff;
}

/* 高亮当前路由链接 (来自您的代码) */
.main-nav a.router-link-exact-active {
  color: #42b983; /* Vue 绿色 */
  border-bottom-color: #42b983;
}

/* 主内容区域 (来自您的代码) */
.app-content {
  flex-grow: 1;
  padding: 20px 40px;
}

/* 6. 新增：用户菜单的全部样式 */
.user-profile {
  position: relative;
}
.profile-trigger {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}
.profile-trigger:hover {
  background-color: rgba(255, 255, 255, 0.1);
}
.username {
  margin-right: 8px;
  font-weight: 500;
}
.arrow-icon {
  font-size: 12px;
  transition: transform 0.3s;
  display: inline-block;
}
.arrow-icon.is-open {
  transform: rotate(180deg);
}
.profile-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 10px;
  background-color: #fff;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  min-width: 120px;
  z-index: 1001;
}
.profile-dropdown a {
  display: block;
  padding: 10px 20px;
  color: #2c3e50;
  text-decoration: none;
  transition: background-color 0.2s;
}
.profile-dropdown a:hover {
  background-color: #f8f9fa;
}
.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
