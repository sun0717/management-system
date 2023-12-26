// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
const allGlobalComponent = { SvgIcon }
// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 对外暴露插件对象
export default {
  install(app) {
    Object.keys(allGlobalComponent).forEach((key) => {
      // 注册为全局组件
      app.component(key, allGlobalComponent[key])
    })
    // 注册全部图标
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  }
}
