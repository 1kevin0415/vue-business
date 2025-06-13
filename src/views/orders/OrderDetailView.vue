<template>
  <div class="management-container">
    <div class="page-header">
        <h1>订单详情</h1>
        <button @click="goBack" class="back-btn">返回列表</button>
    </div>
    <div v-if="loading" class="card empty-state">...</div>
    <div v-else-if="order" class="card order-detail-card">

        <div class="detail-grid">
            <div class="info-section">
                <h2>订单信息</h2>
                <div class="info-grid">
                    <span>订单ID:</span><strong>#{{ order.id }}</strong>
                    <span>客户姓名:</span><strong>{{ order.customerName || 'N/A' }}</strong>
                    <span>下单日期:</span><strong>{{ new Date(order.orderDate).toLocaleString() }}</strong>
                    <span>订单状态:</span><span class="status-badge" :class="order.status">{{ order.status }}</span>
                    <span class="full-row">配送地址:</span><strong class="full-row">{{ order.shippingAddress }}</strong>
                </div>
            </div>

            <div class="actions-section">
                <h2>订单操作</h2>
                <form @submit.prevent="updateStatus" class="dispatch-form">
                    <label for="status">更新状态</label>
                    <select id="status" v-model="selectedStatus">
                        <option>待支付</option>
                        <option>已支付</option>
                        <option>已发货</option>
                        <option>已完成</option>
                        <option>已取消</option>
                    </select>
                    <div class="form-actions">
                        <button type="submit" class="submit-btn">确认更新</button>
                    </div>
                </form>
            </div>
        </div>

        <div class="total-summary">
            <span>总金额:</span>
            <span class="total-price">¥{{ order.totalPrice.toFixed(2) }}</span>
        </div>

    </div>
    <div v-if="!loading && order" class="card">
        <h2>商品列表</h2>
        <table class="content-table">
            <thead>
                <tr>
                    <th>商品名称</th>
                    <th>数量</th>
                    <th>下单时单价</th>
                    <th>小计</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in order.orderItems" :key="item.id">
                    <td>{{ item.productName || '商品信息已删除' }}</td>
                    <td>{{ item.quantity }}</td>
                    <td>¥{{ item.price.toFixed(2) }}</td>
                    <td>¥{{ (item.price * item.quantity).toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
  </div>
</template>

<script setup>
import '@/assets/styles/management.css'; // 确保引入了共享样式
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();
const order = ref(null);
const loading = ref(true);
const orderId = route.params.id;

// --- 新增一个变量来绑定下拉框的值 ---
const selectedStatus = ref('');

async function fetchOrderDetail() {
  try {
    loading.value = true;
    const response = await axios.get(`http://localhost:8080/api/orders/${orderId}`);
    if (response.data) {
        order.value = response.data;
        // 将当前订单的状态赋值给下拉框的默认值
        selectedStatus.value = response.data.status;
    } else {
        alert('找不到该商品的信息，可能已被删除。');
        router.push('/orders');
    }
  } catch (error) {
    console.error('获取订单详情失败:', error);
    alert('获取订单详情失败！');
    router.push('/orders');
  } finally {
    loading.value = false;
  }
}

// --- 新增一个方法用于更新状态 ---
async function updateStatus() {
    if (!selectedStatus.value) {
        alert('请选择一个新的状态！');
        return;
    }
    try {
        // 调用我们新创建的后端API
        const response = await axios.put(`http://localhost:8080/api/orders/${orderId}/status`, {
            status: selectedStatus.value
        });

        // 更新成功后，用后端返回的最新订单数据来更新页面
        order.value = response.data;
        alert('订单状态更新成功！');

    } catch (error) {
        console.error('更新订单状态失败:', error);
        alert('更新订单状态失败！');
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
.order-detail-card {
    padding-bottom: 0; /* 移除主卡片的下内边距，因为总金额部分会自带外边距 */
}

.detail-grid {
    display: grid;
    grid-template-columns: 2fr 1fr; /* 左侧信息区占2份，右侧操作区占1份 */
    gap: 40px; /* 两栏之间的间距 */
    border-bottom: 1px solid #e9ecef;
    padding-bottom: 30px;
}

.info-section h2, .actions-section h2 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 600;
    color: #343a40;
    border-bottom: none; /* 移除子标题的下划线 */
    padding-bottom: 0;
}

.info-grid {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 15px 20px;
    align-items: center;
}

.info-grid span { color: #6c757d; }
.info-grid strong { color: #212529; font-weight: 500; }
.info-grid .full-row { grid-column: 1 / -1; }

.actions-section .dispatch-form {
    display: flex; /* 操作区使用Flex布局更简单 */
    flex-direction: column;
    gap: 15px;
}

.actions-section .form-actions {
    justify-content: flex-start; /* 按钮靠左 */
}

.total-summary {
    padding: 20px 0;
    text-align: right;
    font-size: 22px;
    font-weight: bold;
}

.total-price { color: #d9534f; margin-left: 10px; }

.back-btn { /* 返回按钮现在在页面头部，样式可以简化或在management.css中统一 */
    padding: 8px 18px;
    background-color: #6c757d;
    color: white;
    border: none;
}
.back-btn:hover { background-color: #5a6268; }
</style>