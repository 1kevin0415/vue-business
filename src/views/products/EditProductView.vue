<template>
  <div class="edit-product-container">
    <h1>编辑商品</h1>
    <form @submit.prevent="updateProduct">
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
      <button type="submit">确认更新</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute(); // 用来获取当前路由信息，比如 URL 中的 ID
const router = useRouter(); // 用来做页面跳转

// 从路由参数中获取商品ID
const productId = route.params.id;

const formData = ref({}); // 表单数据初始为空对象

// 在组件加载后，从后端获取该ID的商品数据
onMounted(async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/products/${productId}`);
    formData.value = response.data; // 将获取的数据填充到表单
  } catch (err) {
    alert('加载商品信息失败！');
    console.error(err);
  }
});

// 提交更新
async function updateProduct() {
  try {
    await axios.put(`http://localhost:8080/api/products/${productId}`, formData.value);
    alert('商品更新成功！');
    router.push('/products'); // 更新成功后，跳转回商品列表
  } catch (err) {
    alert('更新商品失败');
    console.error(err);
  }
}
</script>

<style scoped>
  .edit-product-container { max-width: 600px; margin: 20px auto; padding: 20px; background: #fff; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
  .form-group { margin-bottom: 15px; }
  .form-group label { display: block; margin-bottom: 5px; font-weight: 600; }
  .form-group input { width: 95%; padding: 10px; border-radius: 5px; border: 1px solid #ccc; }
  button { width: 100%; padding: 12px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; font-size: 16px; }
  button:hover { background-color: #0056b3; }
</style>