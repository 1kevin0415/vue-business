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
       <img v-if="product.imageUrl" :src="'http://localhost:8080/api/products/images/show/' + product.imageUrl" :alt="product.name" class="product-image">
        <div v-else class="product-image placeholder">无图</div>

        <div class="product-info">
          <span class="name">{{ product.name }}</span>
          <span class="price">¥ {{ product.price }}</span>
        </div>
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
import { ref, onMounted, onActivated } from 'vue'; // 导入 onActivated
import axios from 'axios';
import { useRouter } from 'vue-router';

const products = ref([]);
const loading = ref(true);
const error = ref(null);
const router = useRouter();

// 将获取数据的逻辑封装成一个独立的函数
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
      // 删除成功后直接刷新列表
      fetchProducts();
    } catch (err) {
      alert('删除失败！');
      console.error(err);
    }
  }
}

function editProduct(product) {
  router.push(`/products/edit/${product.id}`);
}

// 页面首次加载时获取数据
onMounted(() => {
  fetchProducts();
});

// 每次从其他页面返回到这个页面时，也重新获取数据
onActivated(() => {
  fetchProducts();
});
</script>

<style scoped>
.product-list-container { max-width: 900px; margin: 20px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
.header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e1e4e8; padding-bottom: 15px; margin-bottom: 20px;}
.header h1 { margin: 0; font-size: 24px; color: #333; }
.add-btn { display: flex; align-items: center; justify-content: center; width: 40px; height: 40px; background-color: #28a745; color: white; text-decoration: none; border-radius: 50%; font-size: 30px; line-height: 40px; transition: all 0.2s; }
.add-btn:hover { transform: scale(1.1); background-color: #218838; }
ul { list-style: none; padding: 0; }
li { display: flex; align-items: center; padding: 15px 10px; border-bottom: 1px solid #f0f0f0; }
li:last-child { border-bottom: none; }
.product-image { width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 15px; flex-shrink: 0; }
.product-image.placeholder { background-color: #f6f8fa; display: flex; align-items: center; justify-content: center; color: #586069; font-size: 12px; }
.product-info { display: flex; flex-direction: column; flex-grow: 1; gap: 5px; }
.name { font-weight: 600; color: #0366d6; }
.price { color: #22863a; font-weight: normal; font-size: 0.9em; }
.stock { color: #586069; background-color: #f6f8fa; padding: 3px 8px; border-radius: 20px; font-size: 0.9em; white-space: nowrap; }
.actions { display: flex; align-items: center; margin-left: 15px; }
.edit-btn, .delete-btn { width: 32px; height: 32px; padding: 0; border: 1px solid #e1e4e8; border-radius: 50%; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; transition: all 0.2s; }
.edit-btn { background-color: #f6f8fa; color: #0366d6; margin-right: 8px; }
.edit-btn:hover { background-color: #0366d6; color: white; }
.delete-btn { background-color: #f6f8fa; color: #d73a49; }
.delete-btn:hover { background-color: #d73a49; color: white; }
.loading, .error, .empty { text-align: center; color: #586069; padding: 40px; font-size: 1.1em; }
</style>