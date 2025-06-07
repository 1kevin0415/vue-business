<template>
  <div class="add-product-container">
    <h1>新增商品</h1>
    <form @submit.prevent="addProduct">
      <div class="form-group">
        <label for="name">商品名称:</label>
        <input type="text" id="name" v-model="formData.name" required>
      </div>
      <div class="form-group">
        <label for="description">商品描述:</label>
        <input type="text" id="description" v-model="formData.description">
      </div>
      <div class="form-group">
        <label for="imageUrl">商品图片文件名:</label>
        <input type="text" id="imageUrl" v-model="formData.imageUrl" placeholder="例如: mouse.png">
      </div>
      <div class="form-group">
        <label for="price">价格:</label>
        <input type="number" id="price" v-model="formData.price" required min="0" step="0.01">
      </div>
      <div class="form-group">
        <label for="stock">库存:</label>
        <input type="number" id="stock" v-model="formData.stock" required min="0">
      </div>
      <button type="submit">确认添加</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // <-- 1. 添加这一行，导入 useRouter

const router = useRouter(); // <-- 2. 添加这一行，获取路由实例

const formData = ref({
  name: '',
  description: '',
  price: null,
  stock: null,
  imageUrl: ''
});

async function addProduct() {
  try {
    await axios.post('http://localhost:8080/api/products', formData.value);
    alert('商品添加成功！');
    // 添加成功后，跳转回商品列表页面
    router.push('/products');
  } catch (err) {
    alert('添加商品失败');
    console.error(err);
  }
}
</script>

<style scoped>
.add-product-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.form-group { margin-bottom: 15px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: 600; }
.form-group input { width: 95%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; }
button { width: 100%; padding: 12px; background-color: #28a745; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
button:hover { background-color: #218838; }
</style>
