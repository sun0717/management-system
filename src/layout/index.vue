<template>
    <el-container class="layout-container-demo" style="height: 100vh">
        <el-aside width="200px" :class="{ isCollapse: LayOutSettingStore.isCollapse ? true : false }">
            <el-scrollbar>
                <el-menu :default-active="$route.path" active-text-color="#fff" background-color="#001529"
                    text-color="#959ea6" :collapse="LayOutSettingStore.isCollapse" :router="true">
                    <Logo />
                    <Menu :menuList="userStore.menuRoutes" />
                </el-menu>
            </el-scrollbar> 
        </el-aside>

        <el-container class="container">
            <TabBar style="width: 100%" />
            <el-main :style="{
                left: !LayOutSettingStore.isCollapse ? '200px' : '56px',
                width: LayOutSettingStore.isCollapse
                    ? 'calc(100% - 56px)'
                    : 'calc(100% - 200px)',
            }">
                <el-scrollbar>
                    <Main />
                </el-scrollbar>
            </el-main>
        </el-container>
    </el-container>
</template>

<script setup lang="ts">
// 获取路由对象

// 引入左侧菜单 logo 子组件
import Logo from './logo/index.vue'
// 引入菜单组件
import Menu from './menu/index.vue'
// 右侧内容展示区域
import Main from './main/index.vue'

import { useLayOutSettingStore } from '@/stores/modules/setting'
// 获取用户相关的小仓库
import { useUserStore } from '@/stores/modules/user'
// 引入顶部 tabbar 组件
import TabBar from './tabbar/index.vue'
let userStore = useUserStore()

let LayOutSettingStore = useLayOutSettingStore()

// 获取路由对象
let $route = useRoute();
console.log($route.path);
</script>
<script lang="ts">
</script>
<style scoped lang="scss">
.layout-container-demo {
  height: 100%;
}
.layout-container-demo .el-menu {
  border-right: none;
}
.layout-container-demo .el-main {
  position: absolute;
  padding: 20px;
  left: 200px;
  top: 60px;
  transition: all 0.3s;
  width: calc(100% - $base-menu-width);
  height: calc(100vh - 60px);
}

.el-aside {
  background-color: #001529 !important;
  transition: all 0.3s;
}
.el-header {
  background-color: #fff !important;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 3px 3px 0px;
  z-index: 999;
}
.isCollapse {
  width: 56px;
}
</style>