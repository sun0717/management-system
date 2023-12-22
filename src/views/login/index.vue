<script setup lang="ts">
import { ref, reactive } from 'vue'
import { User, Lock, Warning } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/modules/user'
import { ElNotification } from 'element-plus'
const userStore = useUserStore()
// 定义变量控制加载效果
let loading = ref(false)
// 获取路由器
let $router = useRouter()
const loginForm = reactive({
  username: '',
  password: ''
})
// 登录按钮回调
const login = async () => {
  loading.value = true
  // 请求成功 -> 首页展示数据
  // 请求失败 -> 弹出登录失败信息
  try {
    await userStore.userLogin(loginForm);
    // 编程式导航跳转
    $router.push('/')
    ElNotification({
      type: 'success',
      message: '登录成功'
    })
    // 登录成功加载效果也消失
    loading.value = false
  } catch (error) {
    loading.value = false
    ElNotification({
      type: 'error',
      message: (error as Error).message
    })
  }
  
}
</script>

<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-card class="login_form">
          <h1>Vue-Admin</h1>
          <el-form :model="loginForm" :rules="rules" ref="loginForms">
            <el-form-item prop="username">
              <el-input
                :prefix-icon="User"
                v-model="loginForm.username"
                clearable
                placeholder="Username"
                size="large"
              ></el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                :prefix-icon="Lock"
                show-password
                v-model="loginForm.password"
                size="large"
                placeholder="Password"
                clearable
              ></el-input>
            </el-form-item>
            <el-form-item prop="verifyCode">
              <el-input
                :prefix-icon="Warning"
                show-password
                v-model="loginForm.verifyCode"
                placeholder="VerifyCode"
                size="large"
                maxlength="4"
              >
                <template #append>
                  <Identify :identifyCode="identifyCode" @click="refreshCode" />
                </template>
              </el-input>
            </el-form-item>
          </el-form>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;
  position: fixed;

  .login_form {
    position: relative;
    width: 55%;
    top: 25vh;
    left: 10vw;
    padding: 10px;
    background: transparent;

    h1 {
      background: linear-gradient(to right, blue, rgb(35, 60, 70));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-size: 40px;
      text-align: center;
      font-weight: 700;
      margin-bottom: 40px;
      margin-top: -10px;
    }

    .login_btn {
      width: 100%;
    }
  }
}

.el-card {
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

:deep(.el-input-group__append, .el-input-group__prepend) {
  padding: 0;
}
</style>
