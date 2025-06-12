<template>
  <div class="management-container">
    <h1>订单管理</h1>
    <div class="card">
      <table class="content-table">
        <thead>
          <tr>
            <th>订单ID</th>
            <th>客户姓名</th>
            <th>下单日期</th>
            <th>总金额</th>
            <th>状态</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6">加载中...</td>
          </tr>
          <tr v-else-if="orders.length === 0">
            <td colspan="6">暂无订单</td>
          </tr>
          <tr v-for="order in orders" :key="order.id">
            <td>#{{ order.id }}</td>
            <td>{{ order.customerName || 'N/A' }}</td>
            <td>{{ new Date(order.orderDate).toLocaleString() }}</td>
            <td>¥{{ order.totalPrice.toFixed(2) }}</td>
            <td>
              <span class="status-badge" :class="order.status">{{ order.status }}</span>
            </td>
            <td>
             <router-link :to="'/orders/' + order.id" class="action-link-btn">
                   查看详情
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// 1. 确保导入了共享样式文件
import '@/assets/styles/management.css';
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);
const loading = ref(true);

async function fetchOrders() {
  try {
    loading.value = true;
    // 2. 确保调用的是正确的后端接口
    const response = await axios.get('http://localhost:8080/api/orders');
    orders.value = response.data;
  } catch (error) {
    console.error('获取订单列表失败:', error);
    alert('获取订单列表失败！');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchOrders();
});
</script>
