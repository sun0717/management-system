import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'


const noFormat =()=>
{
    console.log('这是没有格式化但却提交的代码');
}
const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
