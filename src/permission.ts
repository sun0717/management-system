// 路由鉴权, 项目当中路由能否被访问
import router from '@/router'
import setting from './setting'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 获取用户相关的小仓库内部 token 数据, 去判断用户是否登录成功
import { useUserStore } from './stores/modules/user'
// 组件外用 pinia 需要引入大仓库
// 全局守卫: 项目当中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach(async (to: any, from: any, next: any) => {
  nprogress.start()
  const userStore = useUserStore()
  console.log(userStore)
  document.title = to.meta.title + ` | ${setting.title}`
  // 获取 token, 判断用户登录, 还是未登录
  let token = userStore.token
  let username = userStore.username
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
          // userInfo
          await userStore.userInfo()
          // 放行
          // 万一：刷新的时候是异步路由，有可能获取到用户信息、异步路由还没有加载完毕，出现空白的效果
          // 保证加载完后放行
          next({ ...to })
        } catch (error) {
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
      next({ path: '/login', query: { redirect: to.path } })
    }
  }
})

// 全局后置守卫
router.afterEach(() => {
  nprogress.done()
})

// 任意路由切换实现进度条业务
// 路由鉴权
// 全部路由组件: 登录|404|任意路由|首页|数据大屏|权限管理（三个字路由）|商品管理（四个子路由）