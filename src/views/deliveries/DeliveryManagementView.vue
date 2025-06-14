<template>
  <div class="management-container">
    <div class="page-header">
      <h1>配送管理</h1>
    </div>
    
    <div class="card">
      <h2>为订单发货</h2>
      <form @submit.prevent="dispatchOrder" class="dispatch-form">
        <label for="orderId">选择订单</label>
        <select id="orderId" v-model.number="newDelivery.orderId" required>
          <option :value="null" disabled>-- 请选择要发货的订单 --</option>
          <option v-for="order in pendingOrders" :key="order.id" :value="order.id">
            订单 #{{ order.id }} (客户ID: {{ order.customerId }}, 总额: ¥{{ order.totalPrice }})
          </option>
        </select>
        
        <label for="shippingCompany">物流公司</label>
        <input type="text" id="shippingCompany" v-model="newDelivery.shippingCompany" required placeholder="例如: 顺丰速运">
        
        <label for="trackingNumber">运单号</label>
        <input type="text" id="trackingNumber" v-model="newDelivery.trackingNumber" required>

        <div class="form-actions">
            <button type="submit" class="submit-btn" :disabled="!newDelivery.orderId">确认发货</button>
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
import '@/assets/styles/management.css';
import { ref, onMounted } from 'vue';
// 1. 修改导入
import request from '@/api/request';

const deliveries = ref([]);
const loading = ref(true);
const newDelivery = ref({
  orderId: null,
  shippingCompany: '',
  trackingNumber: ''
});

// 新增一个响应式变量，用来存储所有待发货的订单
const pendingOrders = ref([]);

// 获取所有已创建的配送记录
async function fetchDeliveries() {
  try {
    loading.value = true;
    // 2. 修改API调用
    const response = await request.get('/deliveries');
    // 3. 修改数据解析
    if (response.data.code === 200) {
      deliveries.value = response.data.data;
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error('获取配送列表失败:', error);
    alert('获取配送列表失败！');
  } finally {
    loading.value = false;
  }
}

// 新增一个函数，用来获取所有待发货的订单
async function fetchPendingOrders() {
    try {
        // 4. 修改API调用
        // 注意：这里的"待支付"状态只是一个示例，您可能需要根据实际业务逻辑调整为 "已支付" 等
       const response = await request.get('/orders?status=已支付');
        // 5. 修改数据解析
        if (response.data.code === 200) {
          pendingOrders.value = response.data.data;
        } else {
          throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('获取待发货订单失败:', error);
    }
}

// 为订单发货
async function dispatchOrder() {
    if (!newDelivery.value.orderId || !newDelivery.value.shippingCompany || !newDelivery.value.trackingNumber) {
        alert('请填写所有发货信息！');
        return;
    }
    try {
        // 6. 修改API调用
        const response = await request.post('/deliveries', newDelivery.value);
        // 7. 修改成功判断逻辑
        if(response.data.code === 200) {
            alert(`订单 #${newDelivery.value.orderId} 发货成功！`);
            newDelivery.value = { orderId: null, shippingCompany: '', trackingNumber: '' };
            // 发货成功后，同时刷新配送列表和待发货订单列表
            fetchDeliveries();
            fetchPendingOrders();
        } else {
          throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('发货失败:', error);
        alert('发货失败！请检查订单ID是否存在或是否已发货。');
    }
}

// 组件加载时，需要同时获取两个数据
onMounted(() => {
  fetchDeliveries();
  fetchPendingOrders();
});
</script>

<style scoped>
/* 确保Grid布局的表单样式存在 */
.dispatch-form {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 20px;
    align-items: center;
}
.dispatch-form label {
    font-weight: 600;
    text-align: right;
    color: #495057;
}
.dispatch-form input, .dispatch-form select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ced4da;
    border-radius: 6px;
    font-size: 1rem;
}
.dispatch-form .form-actions {
    grid-column: 2 / 3;
    justify-content: flex-start;
}
</style>
