<template>
  <div class="management-container">
    <div class="page-header">
      <h1>订单管理</h1>
    </div>
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
// 2. 将导入从 'axios' 修改为我们自己的 request 实例
import request from '@/api/request';

const orders = ref([]);
const loading = ref(true);

async function fetchOrders() {
  try {
    loading.value = true;
    // 3. 使用 request 实例，并简化 URL
    const response = await request.get('/orders');
    
    // 4. 根据我们约定的 ApiResponse 格式，从 response.data.data 中获取订单列表
    if (response.data.code === 200) {
      orders.value = response.data.data;
    } else {
      throw new Error(response.data.message || '获取订单列表失败');
    }

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
