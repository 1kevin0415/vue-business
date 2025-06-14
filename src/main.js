import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

import './assets/styles/management.css'; // 引入美化后的全局样式

const app = createApp(App)

app.use(createPinia()) // 注册 Pinia
app.use(router)

app.mount('#app')