<template>
  <div class="management-container">
    <h1>配送管理</h1>

    <div class="card">
      <h2>为订单发货</h2>
     <form @submit.prevent="dispatchOrder" class="dispatch-form">
        <label for="orderId">订单ID</label>
        <input type="number" id="orderId" v-model.number="newDelivery.orderId" required placeholder="输入需要发货的订单ID">

        <label for="shippingCompany">物流公司</label>
        <input type="text" id="shippingCompany" v-model="newDelivery.shippingCompany" required placeholder="例如: 顺丰速运">

        <label for="trackingNumber">运单号</label>
        <input type="text" id="trackingNumber" v-model="newDelivery.trackingNumber" required>

        <div class="form-actions">
        <button type="submit" class="submit-btn">确认发货</button>
    </div>
    </form>
    </div>

    <div class="card">
        <h2>配送列表</h2>
        <table class="content-table">
            <thead>
                <tr>
                    <th>配送ID</th>
                    <th>订单ID</th>
                    <th>物流公司</th>
                    <th>运单号</th>
                    <th>发货日期</th>
                    <th>状态</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="loading">
                    <td colspan="6">加载中...</td>
                </tr>
                <tr v-else-if="deliveries.length === 0">
                    <td colspan="6">暂无配送信息</td>
                </tr>
                <tr v-for="delivery in deliveries" :key="delivery.id">
                    <td>#{{ delivery.id }}</td>
                    <td>#{{ delivery.orderId }}</td>
                    <td>{{ delivery.shippingCompany }}</td>
                    <td>{{ delivery.trackingNumber }}</td>
                    <td>{{ new Date(delivery.dispatchDate).toLocaleString() }}</td>
                    <td>
                        <span class="status-badge 已发货">{{ delivery.status }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>

  </div>
</template>

<script setup>
import '@/assets/styles/management.css'; // 复用我们创建的美化样式
import { ref, onMounted } from 'vue';
import axios from 'axios';

const deliveries = ref([]);
const loading = ref(true);
const newDelivery = ref({
  orderId: null,
  shippingCompany: '',
  trackingNumber: ''
});

// 获取所有配送列表
async function fetchDeliveries() {
  try {
    loading.value = true;
    const response = await axios.get('http://localhost:8080/api/deliveries');
    deliveries.value = response.data;
  } catch (error) {
    console.error('获取配送列表失败:', error);
    alert('获取配送列表失败！');
  } finally {
    loading.value = false;
  }
}

// 为订单发货
async function dispatchOrder() {
    if (!newDelivery.value.orderId || !newDelivery.value.shippingCompany || !newDelivery.value.trackingNumber) {
        alert('请填写所有发货信息！');
        return;
    }
    try {
        const response = await axios.post('http://localhost:8080/api/deliveries', newDelivery.value);
        if(response.data && response.data.id) {
            alert(`订单 #${newDelivery.value.orderId} 发货成功！`);
            // 清空表单
            newDelivery.value = { orderId: null, shippingCompany: '', trackingNumber: '' };
            // 重新加载列表
            fetchDeliveries();
        }
    } catch (error) {
        console.error('发货失败:', error);
        alert('发货失败！请检查订单ID是否存在或是否已发货。');
    }
}

// 组件加载时自动获取列表
onMounted(() => {
  fetchDeliveries();
});
</script>