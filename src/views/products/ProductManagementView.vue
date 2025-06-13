<template>
  <div class="management-container">
  <div class="page-header">
    <h1>商品管理</h1>
    <router-link to="/products/add" class="add-btn">+</router-link>
  </div>

    <div class="card">
      <div v-if="loading" class="empty-state">
        <p class="empty-state-text">加载中...</p>
      </div>
      <div v-else-if="products.length > 0">
        <table class="content-table">
          <thead>
            <tr>
              <th>商品</th>
              <th>库存</th>
              <th class="actions-cell">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in products" :key="product.id">
              <td>
                <div class="item-info">
                  <img v-if="product.imageUrl" :src="'http://localhost:8080/api/products/images/show/' + product.imageUrl" :alt="product.name" class="item-image">
                  <div v-else class="item-image placeholder">无图</div>
                  <div class="item-details">
                    <span class="item-name">{{ product.name }}</span>
                    <span class="item-price">¥{{ product.price }}</span>
                  </div>
                </div>
              </td>
              <td><span class="item-stock">{{ product.stock }}</span></td>
              <td class="actions-cell">
                  <button class="action-btn edit" @click="editProduct(product.id)">
                     <i class="fas fa-pencil-alt"></i>
                  </button>
                  <button class="action-btn delete" @click="deleteProduct(product.id)">
                      <i class="fas fa-trash-alt"></i>
                  </button>
              </td>   
            </tr>
          </tbody>
        </table>
      </div>
      <div v-else class="empty-state">
        <div class="empty-state-icon">📦</div>
        <p class="empty-state-text">暂无商品，快去新增一个吧！</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';
import '@/assets/styles/management.css';

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const router = useRouter();

async function fetchProducts() {
  try {
    loading.value = true;
    const response = await axios.get('http://localhost:8080/api/products');
    products.value = response.data;
  } catch (err) {
    error.value = '无法加载商品数据。';
    console.error(err);
  } finally {
    loading.value = false;
  }
}

async function deleteProduct(id) {
  if (confirm('您确定要删除这个商品吗？')) {
    try {
      await axios.delete(`http://localhost:8080/api/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert('删除失败！');
      console.error(err);
    }
  }
}

// MODIFIED: 修正了函数参数，之前是 product 对象，现在直接是 id
function editProduct(id) {
  router.push(`/products/edit/${id}`);
}

onMounted(() => {
  fetchProducts();
});

// onActivated 在这个组件结构中可能不会被触发，因为没有被 <keep-alive> 包裹
// 但保留它没有坏处，如果未来添加了 keep-alive 就能生效
/*
import { onActivated } from 'vue';
onActivated(() => {
  fetchProducts();
});
*/
</script>

<style scoped>
/* ▼▼▼ CSS 修改部分 ▼▼▼ */

/* 1. 新增 .item-image 样式，控制图片大小 */
.item-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  margin-right: 15px;
  flex-shrink: 0;
  background-color: #f8f9fa; /* 给图片一个浅色背景，避免透明图片问题 */
}

/* 如果图片不存在，占位符的样式 */
.item-image.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
  font-size: 12px;
  border: 1px dashed #dee2e6;
}

/* 商品信息通用容器 */
.item-info {
  display: flex;
  align-items: center;
}
.item-details {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.item-name {
  font-weight: 600;
  color: #0366d6;
}
.item-price {
  color: #22863a;
  font-size: 0.9em;
}
.item-stock {
    display: inline-block;
    background-color: #f6f8fa;
    padding: 3px 8px;
    border-radius: 20px;
    font-size: 0.9em;
    white-space: nowrap;
    border: 1px solid #e9ecef;
}

</style>