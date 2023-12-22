// import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
// 引入仓库
// 配置 element-plus 国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import pinia from './stores'
import '@/styles/index.scss'
const app = createApp(App)

// console.log(import.meta.env)
app.use(createPinia())
app.use(ElementPlus, {
  locale: zhCn
})
app.use(router)
app.use(pinia)
// svg 插件需要配置代码
import 'virtual:svg-icons-register'
// 引入自定义插件对象:注册整个项目全局组件
import globalComponent from '@/components'

app.use(globalComponent)
// 引入模板的全局的样式
import '@/styles/index.scss'

app.mount('#app')
