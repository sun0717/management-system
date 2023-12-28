// 路由鉴权, 项目当中路由能否被访问
import router from '@/router';
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 全局守卫: 项目当中任意路由切换都会触发的钩子
// 全局前置守卫
router.beforeEach((to: any, from: any, next: any) => {
    nprogress.start()
    next()
})

// 全局后置守卫
router.afterEach((to: any, from: any) => {
    nprogress.done()
})

// 任意路由切换实现进度条业务
