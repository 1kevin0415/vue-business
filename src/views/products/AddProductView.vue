<template>
  <div class="add-product-container">
    <div class="form-card">
      <h1 class="form-title">新增商品</h1>
      <form @submit.prevent="addProduct">

        <div class="form-group">
          <label for="name">商品名称</label>
          <input type="text" id="name" v-model="formData.name" required placeholder="例如: 高性能笔记本电脑">
        </div>

        <div class="form-group">
          <label for="description">商品描述</label>
          <textarea id="description" v-model="formData.description" rows="3" placeholder="例如: 最新款，性能强劲"></textarea>
        </div>

        <div class="form-group">
          <label for="imageFile">商品图片</label>
          <input type="file" id="imageFile" @change="handleFileUpload" accept="image/*" class="file-input">
          <div v-if="previewUrl" class="image-preview">
            <img :src="previewUrl" alt="图片预览">
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="price">价格 (¥)</label>
            <input type="number" id="price" v-model="formData.price" required min="0" step="0.01" placeholder="例如: 7999">
          </div>
          <div class="form-group">
            <label for="stock">库存</label>
            <input type="number" id="stock" v-model="formData.stock" required min="0" placeholder="例如: 50">
          </div>
        </div>

        <button type="submit" class="submit-btn">确认添加</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// 1. 修改导入
import request from '@/api/request';
import { useRouter } from 'vue-router';

const router = useRouter();

const formData = ref({
  name: '',
  description: '',
  price: null,
  stock: null
});
// 用于存储用户选择的文件对象
const selectedFile = ref(null);
// 用于图片预览的URL
const previewUrl = ref(null);

// 当用户选择文件时触发此函数
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    // 创建一个临时的URL用于图片预览
    previewUrl.value = URL.createObjectURL(file);
  } else {
    selectedFile.value = null;
    previewUrl.value = null;
  }
}

// 修改 addProduct 函数以支持文件上传
async function addProduct() {
  if (!formData.value.name || formData.value.price == null || formData.value.stock == null) {
      alert('商品名称、价格和库存为必填项！');
      return;
  }

  // 创建一个 FormData 对象来打包所有数据
  const uploadData = new FormData();
  
  // 将表单的每个文本字段都添加到 FormData 中
  uploadData.append('name', formData.value.name);
  uploadData.append('description', formData.value.description);
  uploadData.append('price', formData.value.price);
  uploadData.append('stock', formData.value.stock);

  // 如果用户选择了文件，也添加到 FormData 中
  if (selectedFile.value) {
    uploadData.append('imageFile', selectedFile.value);
  }

  try {
    // 2. 修改API调用：使用 request 实例并简化 URL
    const response = await request.post('/products', uploadData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    // 3. 修改成功判断逻辑
    if (response.data.code === 200) {
      alert('商品添加成功！');
      router.push('/products');
    } else {
      throw new Error(response.data.message);
    }

  } catch (err) {
    alert('添加商品失败');
    console.error(err);
  }
}
</script>

<style scoped>
/* 页面主容器，使用 Flex 布局让卡片垂直居中 */
.add-product-container {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 40px 20px;
}

/* 表单卡片样式 */
.form-card {
  width: 100%;
  max-width: 700px;
  background: #ffffff;
  padding: 30px 40px;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid #e9ecef;
}

/* 表单标题 */
.form-title {
  text-align: center;
  font-size: 24px;
  color: #333;
  margin-bottom: 30px;
}

/* 表单组，用于包裹标签和输入框 */
.form-group {
  margin-bottom: 20px;
}

/* 标签样式 */
.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #555;
  font-size: 14px;
}

/* 输入框和文本域的通用样式 */
.form-group input[type="text"],
.form-group input[type="number"],
.form-group textarea {
  width: 100%;
  padding: 12px 15px;
  border-radius: 6px;
  border: 1px solid #ddd;
  font-size: 16px;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
}

/* 文件输入框的特定样式 */
.file-input {
  width: 100%;
}
/* 图片预览样式 */
.image-preview {
  margin-top: 15px;
}
.image-preview img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 6px;
  border: 1px solid #ddd;
}

/* 输入框获取焦点时的效果 */
.form-group input[type="text"]:focus,
.form-group input[type="number"]:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #42b983; /* Vue 绿色 */
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

/* 用于将价格和库存放在一行的容器 */
.form-row {
  display: flex;
  gap: 20px;
}
.form-row .form-group {
  flex: 1;
}

/* 提交按钮样式 */
.submit-btn {
  width: 100%;
  padding: 12px;
  background-color: #28a745;
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
  background-color: #218838;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
</style>
