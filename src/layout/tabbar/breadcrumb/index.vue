<template>
  <el-icon style="margin-right: 10px; cursor: pointer" size="20px" @click="changeIcon">
    <!-- 动态加载渲染的组件 -->
    <component :is="LayoutSettingStore.isCollapse ? Expand : Fold"></component>
  </el-icon>
  <el-breadcrumb separator="/" :separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(item, index) in $route.matched"
      :key="index"
      v-show="item.meta.title"
      :to="item.path"
    >
      <el-icon style="vertical-align: middle">
        <component :is="item.meta.icon"></component>
      </el-icon>
      <!-- 面包屑展示匹配路由的标题 -->
      <span style="margin: 0 5px; vertical-align: middle">
        {{ item.meta.title }}
      </span>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script setup lang="ts">
import { ArrowRight, Fold, Expand } from '@element-plus/icons-vue'
import { useLayoutSettingStore } from '@/stores/modules/setting'
import { useRoute } from 'vue-router'
let LayoutSettingStore = useLayoutSettingStore()
let $route = useRoute()
const changeIcon = () => {
  LayoutSettingStore.isCollapse = !LayoutSettingStore.isCollapse
}
</script>

<style scoped lang="scss">
.tabbar {
  width: 100%;
  height: 100%;
  background: red;
}
</style>
