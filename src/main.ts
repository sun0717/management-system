import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'

// 配置 element-plus 国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(router)

app.mount('#app')
