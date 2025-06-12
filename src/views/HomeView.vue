<template>
  <div class="dashboard-container">
    <h1 class="dashboard-title">欢迎来到电商管理后台</h1>
    <p class="dashboard-subtitle">在这里，您可以一目了然地查看系统的核心运营数据。</p>

    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon products">📦</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.productCount }}</div>
          <div class="stat-label">商品总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon orders">🧾</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.orderCount }}</div>
          <div class="stat-label">订单总数</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon customers">👥</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.customerCount }}</div>
          <div class="stat-label">客户总数</div>
        </div>
      </div>
    </div>

    <div class="quick-actions">
        <h2>快捷操作</h2>
        <div class="action-links">
            <router-link to="/products" class="action-link">管理商品</router-link>
            <router-link to="/orders" class="action-link">管理订单</router-link>
            <router-link to="/customers" class="action-link">管理客户</router-link>
            <router-link to="/deliveries" class="action-link">管理配送</router-link>
        </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const stats = ref({
  productCount: 0,
  orderCount: 0,
  customerCount: 0
});
const loading = ref(true);

async function fetchStats() {
  try {
    loading.value = true;
    const response = await axios.get('http://localhost:8080/api/dashboard/stats');
    stats.value = response.data;
  } catch (error) {
    console.error('获取统计数据失败:', error);
    alert('获取仪表盘统计数据失败！');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 40px auto;
  padding: 40px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}
.dashboard-title {
  font-size: 36px;
  font-weight: 700;
  color: #2c3e50;
  text-align: center;
}
.dashboard-subtitle {
  font-size: 18px;
  color: #6c757d;
  text-align: center;
  margin-bottom: 50px;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  margin-bottom: 50px;
}
.stat-card {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}
.stat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.08);
}
.stat-icon {
    font-size: 48px;
    padding: 20px;
    border-radius: 50%;
    margin-right: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.stat-icon.products { background-color: #e7f3ff; color: #007bff; }
.stat-icon.orders { background-color: #eaf6ea; color: #28a745; }
.stat-icon.customers { background-color: #fff0e4; color: #ff7f0e; }
.stat-info {
    display: flex;
    flex-direction: column;
}
.stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #212529;
}
.stat-label {
    font-size: 16px;
    color: #6c757d;
}
.quick-actions h2 {
    font-size: 24px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 1px solid #dee2e6;
}
.action-links {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
}
.action-link {
    display: block;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    text-align: center;
    font-size: 18px;
    font-weight: 500;
    color: #007bff;
    text-decoration: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
}
.action-link:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(0, 123, 255, 0.15);
    color: #0056b3;
}
</style>