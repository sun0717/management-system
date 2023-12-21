<script setup lang="ts">
import SvgIcon from '@/components/SvgIcon/index.vue';
</script>

<template>
  <div>
    <h1>SVG测试</h1>
    <!-- 测试SVG图标使用 -->
    <!-- svg:图标外层容器节点,内部需要与use标签结合使用 -->
    <svg-icon name="home" fill="yellow" width="100px" height="100px"></svg-icon>
  </div>
</template>

<style scoped lang="scss">
div {
  h1 {
    color: $base-color;
  }
}
</style>
