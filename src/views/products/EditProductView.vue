<template>
  <div class="edit-product-container">
    <div v-if="!isLoading" class="form-card">
      <h1 class="form-title">编辑商品</h1>
      <form @submit.prevent="updateProduct">

        <div class="form-group">
          <label for="name">商品名称</label>
          <input type="text" id="name" v-model="formData.name" required>
        </div>

        <div class="form-group">
          <label for="description">商品描述</label>
          <textarea id="description" v-model="formData.description" rows="3"></textarea>
        </div>

        <div class="form-group">
          <label for="imageFile">更换商品图片</label>
          <input type="file" id="imageFile" @change="handleFileUpload" accept="image/*" class="file-input">
          <div class="image-preview">
            <p>当前图片:</p>
            <img v-if="previewUrl || (formData.imageUrl && !previewUrl)" :src="previewUrl || 'http://localhost:8080/api/products/images/show/' + formData.imageUrl" alt="图片预览">
            <p v-else>暂无图片</p>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="price">价格 (¥)</label>
            <input type="number" id="price" v-model="formData.price" required min="0" step="0.01">
          </div>
          <div class="form-group">
            <label for="stock">库存</label>
            <input type="number" id="stock" v-model="formData.stock" required min="0">
          </div>
        </div>

        <button type="submit" class="submit-btn">确认更新</button>
      </form>
    </div>
    <div v-else class="loading-message">
      正在加载商品数据...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// 1. 修改导入
import request from '@/api/request';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const productId = route.params.id;

const isLoading = ref(true);
const formData = ref({});
const selectedFile = ref(null);
const previewUrl = ref(null);

onMounted(async () => {
  try {
    // 2. 修改API调用
    const response = await request.get(`/products/${productId}`);
    
    // 3. 修改数据解析
    if (response.data.code === 200) {
      formData.value = response.data.data;
    } else {
      alert('找不到该商品的信息，可能已被删除。');
      router.push('/products');
    }
  } catch (err) {
    alert('加载商品信息失败！');
    console.error(err);
    router.push('/products');
  } finally {
    isLoading.value = false;
  }
});

function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
}

async function updateProduct() {
  const uploadData = new FormData();
  uploadData.append('name', formData.value.name);
  uploadData.append('description', formData.value.description);
  uploadData.append('price', formData.value.price);
  uploadData.append('stock', formData.value.stock);

  if (formData.value.imageUrl) {
    uploadData.append('imageUrl', formData.value.imageUrl);
  }

  if (selectedFile.value) {
    uploadData.append('imageFile', selectedFile.value);
  }

  try {
    // 4. 修改API调用
    const response = await request.post(`/products/update/${productId}`, uploadData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    
    // 5. 修改成功判断逻辑
    if (response.data.code === 200) {
        alert('商品更新成功！');
        router.push('/products');
    } else {
        throw new Error(response.data.message);
    }
    
  } catch (err) {
    alert('更新商品失败');
    console.error(err);
  }
}
</script>

<style scoped>
.edit-product-container { display: flex; justify-content: center; align-items: flex-start; padding: 40px 20px; }
.form-card { width: 100%; max-width: 700px; background: #ffffff; padding: 30px 40px; border-radius: 12px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08); border: 1px solid #e9ecef;}
.loading-message { font-size: 18px; color: #555; padding: 50px; }
.form-title { text-align: center; font-size: 24px; color: #333; margin-bottom: 30px; }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: 600; color: #555; font-size: 14px; }
.form-group input[type="text"], .form-group input[type="number"], .form-group textarea { width: 100%; padding: 12px 15px; border-radius: 6px; border: 1px solid #ddd; font-size: 16px; box-sizing: border-box; transition: border-color 0.3s, box-shadow 0.3s; }
.file-input { width: 100%; }
.image-preview { margin-top: 15px; }
.image-preview p { margin: 0 0 5px 0; font-size: 12px; color: #888;}
.image-preview img { max-width: 200px; max-height: 200px; border-radius: 6px; border: 1px solid #ddd; }
.form-group input:focus, .form-group textarea:focus { outline: none; border-color: #007bff; box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.2); }
.form-row { display: flex; gap: 20px; }
.form-row .form-group { flex: 1; }

.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #007bff; /* 使用一个明确的颜色，以防CSS变量未定义 */
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s;
  margin-top: 10px;
}

.submit-btn:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>
