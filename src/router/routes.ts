// 对外暴露路由
export const constantRoute = [
  {
    // 登录
    path: '/login',
    component: () => import('@/views/login/index.vue'),
    name: 'login', // 命名路由
    meta: {
      title: '登录', // 菜单标题
    }
  },
  {
    // 登录成功以后展示数据的路由
    path: '/',
    component: () => import('@/layout/index.vue'),
    name: 'layout',
    meta: {
      title: 'layout', // 菜单标题
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页', 
        }
      }
    ]
  },
  {
    path: '/404',
    component: () => import('@/views/404/index.vue'),
    meta: {
      title: '404', 
    }
  },
  {
    // 任意路由匹配, 上面的没匹配到, 就匹配这里
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
    meta: {
      title: '任意路由'
    }
  }
]
