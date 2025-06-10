<template>
  <div class="order-management-container">
    <h1>订单管理</h1>
    <table class="order-table">
      <thead>
        <tr>
          <th>订单ID</th>
          <th>客户ID</th>
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
          <td>{{ order.id }}</td>
          <td>{{ order.customerId }}</td>
          <td>{{ new Date(order.orderDate).toLocaleString() }}</td>
          <td>¥{{ order.totalPrice.toFixed(2) }}</td>
          <td>
            <span class="status" :class="order.status">{{ order.status }}</span>
          </td>
         <td>
            <router-link :to="'/orders/' + order.id" class="action-btn">
                查看详情
            </router-link>
        </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const orders = ref([]);
const loading = ref(true);

async function fetchOrders() {
  try {
    loading.value = true;
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

<style scoped>
.order-management-container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
h1 {
  text-align: center;
  margin-bottom: 20px;
}
.order-table {
  width: 100%;
  border-collapse: collapse;
}
.order-table th, .order-table td {
  border: 1px solid #e1e4e8;
  padding: 12px 15px;
  text-align: left;
}
.order-table th {
  background-color: #f6f8fa;
  font-weight: 600;
}
.status {
  padding: 5px 10px;
  border-radius: 20px;
  color: white;
  font-size: 0.9em;
}
.status.待支付 { background-color: #f0ad4e; }
.status.已支付 { background-color: #5cb85c; }
.status.已发货 { background-color: #337ab7; }
.status.已完成 { background-color: #777; }
.action-btn {
  padding: 5px 10px;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
}
.action-btn:hover {
  background-color: #f0f0f0;
}
.action-btn {
    display: inline-block;
    text-decoration: none;
    color: #333;
    text-align: center;
}
</style>