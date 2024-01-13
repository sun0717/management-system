import { createApp } from 'vue'
import pinia from '@/stores'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
// 引入仓库
// 配置 element-plus 国际化
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import '@/styles/index.scss'
// 暗黑模式样式引入
import 'element-plus/theme-chalk/dark/css-vars.css'
const app = createApp(App)

// console.log(import.meta.env)
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
// 引入路由鉴权文件
// import './permission'
// 引入自定义指令文件
import { isHasButton } from './directive/has' 
isHasButton(app)
app.mount('#app')
