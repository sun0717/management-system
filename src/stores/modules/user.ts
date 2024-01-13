// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 创建用户相关的小仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
// 引入数据类型
import type { LoginFormData, LoginResponseData, userInfoResponseData } from '@/api/user/type'
// 引入操作本地存储的工具方法
import { SET_TOEKN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
import router from '@/router'
// 引入路由(常量路由, 异步路由, 任意路由)
import { constantRoute, asyncRoute, anyRoute } from '@/router/routes'
import cloneDeep from 'lodash/cloneDeep'
/**
 * 过滤当前用户需要展示的异步路由
 * @param asyncRoute 动态路由
 * @param routes 接口返回的路由列表
 * @returns
 */
function filterAsyncRoute(asyncRoute: any, routes: any) {
  return asyncRoute.filter((item: any) => {
    if (routes.includes(item.name)) {
      if (item.children && item.children.length > 0) {
        item.children = filterAsyncRoute(item.children, routes)
      }
      return true
    }
  })
}

// 创建用户小仓库
export const useUserStore = defineStore('UserStore', () => {
  // 存储数据
  const token = ref(GET_TOKEN()!) // 闹半天，问题出这里了？？？哈哈哈哈哈
  let menuRoutes = ref(constantRoute)
  const username = ref('')
  const avatar = ref('')
  const buttons = ref<string[]>([])
  // 用户登录方法
  async function userLogin(data: any) {
    const result: LoginResponseData = await reqLogin(data)
    // 登录请求：成功200->token
    // 登录请求：失败201->登陆失败错误的信息
    if (result.code === 200) {
      token.value = result.data as string
      console.log(token)
      SET_TOEKN(result.data as string)
      return 'ok'
    } else {
      return Promise.reject(new Error(result.data as string))
    }
  }

  // 获取用户头像信息
  async function userInfo() {
    const result: userInfoResponseData = await reqUserInfo()
    if (result.code == 200) {
      username.value = result.data.name
      avatar.value = result.data.avatar
      buttons.value = result.data.buttons
      // 计算当前用户需要展示的异步路由
      const userAsyncRoute = filterAsyncRoute(cloneDeep(asyncRoute), result.data.routes)
      // 菜单需要的数据
      menuRoutes.value = [...constantRoute, ...userAsyncRoute, anyRoute];
      console.log(+ '1')
      console.log(menuRoutes);
      // 目前路由器管理的只有常量路由：用户计算完毕异步路由、任意路由动态增加
      [...userAsyncRoute, anyRoute].forEach((route: any) => {
        router.addRoute(route)
      })
      console.log(router.getRoutes())
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }

  async function userLogout() {
    const result: any = await reqLogout()
    if (result.code == 200) {
      token.value = ''
      username.value = ''
      avatar.value = ''
      REMOVE_TOKEN()
      return 'ok'
    } else {
      return Promise.reject(new Error('出错了'))
    }
  }

  return {
    token,
    menuRoutes,
    username,
    avatar,
    buttons,
    userLogin,
    userInfo,
    userLogout
  }
})
