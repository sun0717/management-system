import { ref } from 'vue'
// 引入接口
import { reqLogin } from '@/api/user';
// 创建用户相关的小仓库
import { defineStore } from 'pinia';
// 引入数据类型
import type { loginForm } from '@/api/user/type'
// 创建用户小仓库
export const useUserStore = defineStore('User', () => {
    // 存储数据
    let token = localStorage.getItem('TOKEN')
    // 用户登录方法
    async function userLogin(data: loginForm) {
        const result = await reqLogin(data);
        // 登录请求：成功200->token
        // 登录请求：失败201->登陆失败错误的信息
        if (result.code == 200) {
            token = result.data.token
            localStorage.setItem("TOKEN", result.data.token)
            return 'ok'
        } else {
            return Promise.reject(new Error(result.data.message))
        }
    }
    
    return {
        token,
        userLogin
    } 
})

// 对外暴露