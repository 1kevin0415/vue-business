<template>
  <div class="checkout-container">
    <div class="checkout-card">
      <h1 class="title">确认订单</h1>

      <div class="item-list">
        <div v-for="item in cartItems" :key="item.id" class="cart-item">
          <span class="item-name">{{ item.name }}</span>
          <span class="item-details">¥{{ item.price }} x {{ item.quantity }}</span>
          <span class="item-total">¥{{ (item.price * item.quantity).toFixed(2) }}</span>
        </div>
      </div>

      <div class="summary">
        <div class="summary-row">
          <span>配送地址:</span>
          <input type="text" v-model="shippingAddress" placeholder="请输入您的收货地址" class="address-input">
        </div>
        <div class="summary-row total">
          <span>订单总额:</span>
          <span class="total-price">¥{{ totalPrice.toFixed(2) }}</span>
        </div>
      </div>

      <button @click="placeOrder" class="place-order-btn" :disabled="isSubmitting">
        {{ isSubmitting ? '正在下单...' : '确认下单' }}
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const router = useRouter();

// 模拟的购物车数据，实际项目中这部分应来自状态管理或路由参数
const cartItems = ref([
  { id: 1, name: '高性能笔记本电脑', price: 7999.00, quantity: 1, productId: 1 },
  { id: 2, name: '机械键盘', price: 499.00, quantity: 2, productId: 2 }
]);

const shippingAddress = ref('');
const isSubmitting = ref(false);

// 计算总价
const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + item.price * item.quantity, 0);
});

// 下单函数
async function placeOrder() {
  if (!shippingAddress.value) {
    alert('请输入配送地址！');
    return;
  }
  if (isSubmitting.value) return;

  isSubmitting.value = true;

  // 1. 准备要发送给后端的 orderItems 数组
  const orderItemsPayload = cartItems.value.map(item => ({
    productId: item.productId,
    quantity: item.quantity,
    price: item.price
  }));

  // 2. 准备完整的订单对象
  const orderPayload = {
    customerId: 1, // 暂时硬编码一个客户ID
    totalPrice: totalPrice.value,
    status: '待支付', // 初始状态
    shippingAddress: shippingAddress.value,
    orderItems: orderItemsPayload
  };

  try {
    // 3. 调用我们创建的后端API
    const response = await axios.post('http://localhost:8080/api/orders', orderPayload);
    
    // 检查后端返回的数据，确保订单创建成功
    if (response.data && response.data.id) {
        alert(`下单成功！订单号: ${response.data.id}`);
        // 成功后可以跳转到订单列表页或订单详情页
        router.push('/products'); // 这里我们先简单跳转回商品列表
    } else {
        throw new Error('后端未能成功创建订单。');
    }

  } catch (error) {
    console.error('下单失败:', error);
    alert('下单失败，请稍后再试。');
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.checkout-container {
  display: flex;
  justify-content: center;
  padding: 40px;
  background-color: #f4f6f9;
}
.checkout-card {
  width: 100%;
  max-width: 800px;
  background: #fff;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}
.title {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
}
.item-list {
  margin-bottom: 30px;
  border-bottom: 1px solid #eee;
}
.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-top: 1px solid #eee;
}
.item-name {
  font-weight: 600;
  color: #555;
}
.item-details {
  color: #888;
}
.item-total {
  font-weight: bold;
}
.summary {
  margin-bottom: 30px;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  font-size: 16px;
}
.address-input {
    width: 70%;
    padding: 8px 12px;
    border-radius: 6px;
    border: 1px solid #ddd;
    font-size: 14px;
}
.summary-row.total {
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
  border-top: 2px solid #333;
  padding-top: 20px;
}
.total-price {
  color: #d9534f;
}
.place-order-btn {
  width: 100%;
  padding: 15px;
  background-color: #5cb85c;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.3s;
}
.place-order-btn:hover {
  background-color: #4cae4c;
}
.place-order-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>