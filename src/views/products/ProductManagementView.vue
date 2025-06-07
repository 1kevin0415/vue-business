<template>
  <div class="product-list-container">
    <div class="header">
      <h1>商品列表</h1>
      <router-link to="/products/add" class="add-btn">+</router-link>
    </div>

    <div v-if="loading" class="loading">加载中...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <ul v-if="products.length > 0">
      <li v-for="product in products" :key="product.id">
        <img v-if="product.imageUrl" :src="'/images/' + product.imageUrl" :alt="product.name" class="product-image">
        <div v-else class="product-image placeholder">无图</div>
        <div class="product-info">
          <span class="name">{{ product.name }}</span>
        </div>
        <span class="price">¥ {{ product.price }}</span>
        <span class="stock">库存: {{ product.stock }}</span>
        <div class="actions">
          <button class="edit-btn" @click="editProduct(product)">✏️</button>
          <button class="delete-btn" @click="deleteProduct(product.id)">🗑️</button>
        </div>
      </li>
    </ul>
    <div v-else-if="!loading" class="empty">暂无商品</div>
  </div>
</template>

<script setup>

import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
const router = useRouter();

const products = ref([]);
const loading = ref(true);
const error = ref(null);

// 删除逻辑保持不变
async function deleteProduct(id) {
  if (confirm('您确定要删除这个商品吗？')) {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      products.value = products.value.filter(p => p.id !== id);
    } catch (err) {
      alert('删除失败！');
      console.error(err);
    }
  }
}

// 编辑逻辑可以暂时简化或后续开发
function editProduct(product) {
  // 实际项目中，编辑也应该是一个独立的页面
  router.push(`/products/edit/${product.id}`);
}

// 获取列表的逻辑保持不变
onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/products');
    products.value = response.data;
  } catch (err) {
    error.value = '无法加载商品数据。';
    console.error(err);
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.product-list-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e1e4e8;
  padding-bottom: 15px;
}
.header h1 { margin: 0; }
.add-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: #28a745;
  color: white;
  text-decoration: none;
  border-radius: 50%;
  font-size: 30px;
  line-height: 40px;
  transition: transform 0.2s;
}
.add-btn:hover { transform: scale(1.1); }
/* 省略其他列表和按钮样式 */
</style>