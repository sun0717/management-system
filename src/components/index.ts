// 引入项目中全部的全局组件
import SvgIcon from './SvgIcon/index.vue'
const allGlobalComponent = { SvgIcon };
// 对外暴露插件对象
export default {
    install(app) {
        Object.keys(allGlobalComponent).forEach(key => {
            // 注册为全局组件
            app.component(key, allGlobalComponent[key]);
        })
    }
}