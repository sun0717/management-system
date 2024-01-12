// 引入接口
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user'
// 创建用户相关的小仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
// 引入数据类型
// import type { loginForm, loginResponseData } from '@/api/user/type'
import type { LoginFormData, LoginResponseData, userInfoResponseData } from '@/api/user/type'

// 引入操作本地存储的工具方法
import { SET_TOEKN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
// 引入路由(常量路由)
import { constantRoute } from '@/router/routes'
// 创建用户小仓库
export const useUserStore = defineStore('UserStore', () => {
  // 存储数据
  let token = GET_TOKEN()
  const menuRoutes = constantRoute
  const username = ref('')
  const avatar = ref('')
  // 用户登录方法
  async function userLogin(data: any) {
    const result: LoginResponseData = await reqLogin(data)
    // 登录请求：成功200->token
    // 登录请求：失败201->登陆失败错误的信息
    if (result.code == 200) {
      token = result.data as string
      //   localStorage.setItem('TOKEN', (result.data.token as string))
      SET_TOEKN(result.data as string)
      return 'ok'
    } else {
      return Promise.reject(new Error(result.data.message))
    }
  }

  // 获取用户头像信息
  async function userInfo() {
    const result: userInfoResponseData = await reqUserInfo()
    console.log(result)
    if (result.code == 200) {
      username.value = result.data.name
      avatar.value = result.data.avatar
      return 'ok'
    } else {
      return Promise.reject(new Error(result.message))
    }
  }

  async function userLogout() {
    const result: any = await reqLogout()
    if (result.code == 200) {
      token = ''
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
    userLogin,
    userInfo,
    userLogout
  }
})
