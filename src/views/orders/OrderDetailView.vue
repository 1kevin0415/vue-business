<template>
  <div class="order-detail-container">
    <div v-if="loading" class="loading-message">正在加载订单详情...</div>
    <div v-else-if="order" class="order-detail-card">
      <h1 class="title">订单详情</h1>
      
      <div class="order-summary">
        <div class="summary-item"><strong>订单ID:</strong> {{ order.id }}</div>
        <div class="summary-item"><strong>客户ID:</strong> {{ order.customerId }}</div>
        <div class="summary-item"><strong>下单日期:</strong> {{ new Date(order.orderDate).toLocaleString() }}</div>
        <div class="summary-item"><strong>订单状态:</strong> <span class="status" :class="order.status">{{ order.status }}</span></div>
        <div class="summary-item"><strong>配送地址:</strong> {{ order.shippingAddress }}</div>
        <div class="summary-item total"><strong>订单总额:</strong> <span class="total-price">¥{{ order.totalPrice.toFixed(2) }}</span></div>
      </div>

      <h2 class="subtitle">商品列表</h2>
      <table class="item-table">
        <thead>
          <tr>
            <th>商品ID</th>
            <th>数量</th>
            <th>下单时单价</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in order.orderItems" :key="item.id">
            <td>{{ item.productId }}</td>
            <td>{{ item.quantity }}</td>
            <td>¥{{ item.price.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
      
      <button @click="goBack" class="back-btn">返回订单列表</button>
    </div>
    <div v-else class="error-message">
        订单未找到。
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const order = ref(null);
const loading = ref(true);
const orderId = route.params.id; // 从路由中获取订单ID

async function fetchOrderDetail() {
  try {
    loading.value = true;
    const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
    order.value = response.data;
  } catch (error) {
    console.error('获取订单详情失败:', error);
    alert('获取订单详情失败！');
  } finally {
    loading.value = false;
  }
}

function goBack() {
    router.push('/orders');
}

onMounted(() => {
  fetchOrderDetail();
});
</script>

<style scoped>
.order-detail-container {
  display: flex;
  justify-content: center;
  padding: 40px;
  background-color: #f4f6f9;
}
.order-detail-card {
  width: 100%;
  max-width: 900px;
  background: #fff;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}
.loading-message, .error-message {
  font-size: 18px;
  color: #555;
  padding: 50px;
  text-align: center;
}
.title, .subtitle {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}
.subtitle {
    margin-top: 30px;
    border-top: 1px solid #eee;
    padding-top: 20px;
}
.order-summary {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 20px;
    font-size: 16px;
}
.summary-item {
    background-color: #f9f9f9;
    padding: 10px;
    border-radius: 6px;
}
.summary-item.total {
    grid-column: 1 / -1;
    font-size: 20px;
    font-weight: bold;
    text-align: right;
}
.total-price {
    color: #d9534f;
}
.item-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}
.item-table th, .item-table td {
  border: 1px solid #e1e4e8;
  padding: 12px 15px;
  text-align: left;
}
.item-table th {
  background-color: #f6f8fa;
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
.back-btn {
    display: block;
    width: 200px;
    margin: 30px auto 0;
    padding: 12px;
    background-color: #777;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;
}
.back-btn:hover {
    background-color: #555;
}
</style>