<template>
  <div class="management-container">
    <div class="page-header">
      <h1>客户管理</h1>
    </div>
    <div class="card">
      <h2>新增客户</h2>
     <form @submit.prevent="addCustomer" class="dispatch-form">
        <label for="name">姓名</label>
        <input type="text" id="name" v-model="newCustomer.name" required placeholder="例如: 张三">

        <label for="email">邮箱</label>
        <input type="email" id="email" v-model="newCustomer.email" required placeholder="example@email.com">

        <label for="phone">电话</label>
        <input type="text" id="phone" v-model="newCustomer.phone" placeholder="可选">

        <label for="address">地址</label>
        <input type="text" id="address" v-model="newCustomer.address" placeholder="可选">

        <div class="form-actions">
          <button type="submit" class="submit-btn">确认新增</button>
        </div>
      </form>
    </div>

    <div class="card">
      <h2>客户列表</h2>
      <table class="content-table">
        <thead>
          <tr>
            <th>客户ID</th>
            <th>姓名</th>
            <th>邮箱</th>
            <th>电话</th>
            <th>地址</th>
            <th>注册日期</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="6">加载中...</td>
          </tr>
          <tr v-else-if="customers.length === 0">
            <td colspan="6">暂无客户</td>
          </tr>
          <tr v-for="customer in customers" :key="customer.id">
            <td>#{{ customer.id }}</td>
            <td>{{ customer.name }}</td>
            <td>{{ customer.email }}</td>
            <td>{{ customer.phone }}</td>
            <td>{{ customer.address }}</td>
            <td>{{ new Date(customer.registrationDate).toLocaleString() }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
// 导入共享的管理页面样式
import '@/assets/styles/management.css';
import { ref, onMounted } from 'vue';
// 1. 修改导入：使用我们封装的 request 实例
import request from '@/api/request';

const customers = ref([]);
const loading = ref(true);
const newCustomer = ref({
  name: '',
  email: '',
  phone: '',
  address: ''
});

// 获取所有客户列表
async function fetchCustomers() {
  try {
    loading.value = true;
    // 2. 修改API调用：使用 request 实例并简化 URL
    const response = await request.get('/customers');
    
    // 3. 修改数据解析：根据 ApiResponse 格式从 .data.data 中获取数据
    if(response.data.code === 200) {
        customers.value = response.data.data;
    } else {
        throw new Error(response.data.message);
    }

  } catch (error) {
    console.error('获取客户列表失败:', error);
    alert('获取客户列表失败！');
  } finally {
    loading.value = false;
  }
}

// 新增客户
async function addCustomer() {
    try {
        // 4. 修改API调用：同样使用 request 实例
        const response = await request.post('/customers', newCustomer.value);
        
        // 5. 修改成功判断逻辑
        if(response.data.code === 200) {
            alert('新增客户成功！');
            // 清空表单
            newCustomer.value = { name: '', email: '', phone: '', address: '' };
            // 重新加载客户列表以显示新数据
            fetchCustomers();
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('新增客户失败:', error);
        alert('新增客户失败！可能是邮箱已被注册。');
    }
}

// 组件加载时自动获取客户列表
onMounted(() => {
  fetchCustomers();
});
</script>

