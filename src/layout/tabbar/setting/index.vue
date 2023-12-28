<template>
  <el-button circle size="small" :icon="Refresh" @click="updateRefsh" />
  <el-button circle size="small" :icon="FullScreen" @click="fullScreen" />
  <el-popover placement="bottom" title="主题设置" :width="200" trigger="hover">
    <el-form>
      <el-form-item label="主题颜色">
        <el-color-picker
          v-model="color"
          show-alpha
          :predefine="predefineColors"
          size="small"
          @change="setColor"
        />
      </el-form-item>
      <el-form-item label="暗黑模式">
        <el-switch
          v-model="dark"
          size="small"
          inline-prompt
          active-icon="MoonNight"
          inactive-icon="Sunny"
          @change="changeDark"
        />
      </el-form-item>
    </el-form>
    <template #reference>
      <el-button circle size="small" :icon="Setting" />
    </template>
  </el-popover>
  <img :src="userStore.avatar" alt="" />
  <el-dropdown>
    <span class="el-dropdown-link">
      {{ userStore.username }}
      <el-icon class="el-icon--right">
        <arrow-down />
      </el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Refresh, Setting, FullScreen, ArrowDown } from '@element-plus/icons-vue'

import { useLayoutSettingStore } from '@/stores/modules/setting'
const layoutSettingStore = useLayoutSettingStore()
import { useUserStore } from '@/stores/modules/user'
const userStore = useUserStore()
import { useRoute, useRouter } from 'vue-router'
// 获取路由器对象
let $router = useRouter()
let $route = useRoute()

let dark = ref<boolean>(false)
const updateRefsh = () => {
  layoutSettingStore.refsh = !layoutSettingStore.refsh
}

const fullScreen = () => {
  // dom 对象的一个属性,判断当前是否为全屏模式
  let full = document.fullscreenElement
  if (!full) {
    document.documentElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
  '#ff4500',
  '#ff8c00',
  '#ffd700',
  '#90ee90',
  '#00ced1',
  '#1e90ff',
  '#c71585',
  'rgba(255, 69, 0, 0.68)',
  'rgb(255, 120, 0)',
  'hsv(51, 100, 98)',
  'hsva(120, 40, 94, 0.5)',
  'hsl(181, 100%, 37%)',
  'hsla(209, 100%, 56%, 0.73)',
  '#c7158577'
])

const changeDark = () => {
  let html = document.documentElement
  dark.value ? (html.className = 'dark') : (html.className = '')
}

const setColor = () => {
  let html = document.documentElement
  html.style.setProperty('--el-color-primary', color.value)
}

/**
 * 退出登录
 * 1. 向服务器发请求[退出登录接口]
 * 2. 仓库当中关于用于相关的数据清空[token|username|avatar]
 * 3. 跳转到登录页面
 */
const logout = async () => {
  userStore.userLogout()
  // 携带 query 参数,
  $router.push({ path: '/login', query: { redirect: $route.path } })
}
</script>

<style scoped lang="scss">
img {
  width: 24px;
  height: 24px;
  border-radius: 20px;
  margin: 0 10px;
}
</style>
