// 对外暴露路由
export const constantRoute = [
  {
    // 登录
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login' // 命名路由
  },
  {
    // 登录成功以后展示数据的路由
    path: '/',
    component: () => import('@/views/home/index.vue'),
    name: 'layout'
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue')
  },
  {
    // 任意路由匹配, 上面的没匹配到, 就匹配这里
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any'
  }
]
