// 路由鉴权, 项目当中路由能否被访问
import router from '@/router'
import setting from './setting'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from './stores'
// 获取用户相关的小仓库内部 token 数据, 去判断用户是否登录成功
import { useUserStore } from './stores/modules/user'
// 组件外用 pinia 需要引入大仓库
const userStore = useUserStore(pinia)
// 全局守卫: 项目当中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  document.title = to.meta.title + ` | ${setting.title}`
  nprogress.start()
  // 获取 token, 判断用户登录, 还是未登录
  let token = userStore.token
  let username = userStore.username
  // 用户登录判断
  // 有 token
  if (token) {
    // 如果访问登录页面
    if (to.path === '/login') {
        // 跳转到 home
        next({ path: '/' })
    } else {
        // 访问其他页面
        if (username) {
            // 如果有用户名
            // 放行
            next()
        } else {
            try {
                // 
                await userStore.userInfo()
                next({ ...to })
            } catch(error) {
                await userStore.userLogout()
                next({ path: '/login', query: { redirect: to.path } })
            }
        }
    }
  } else {
    // 用户未登录判断
    if (to.path === '/login') {
        next()
    } else {
        next({ path: 'login', query: { redirect: to.path } })
    }
  }
})

// 全局后置守卫
router.afterEach((to: any, from: any) => {
  nprogress.done()
})

// 任意路由切换实现进度条业务
// 路由鉴权
// 全部路由组件: 登录|404|任意路由|首页|数据大屏|权限管理（三个字路由）|商品管理（四个子路由）
