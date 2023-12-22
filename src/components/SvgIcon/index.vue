<template>
  <svg :style="{ width, height }">
    <!-- xlinkhref指定用哪一个图标 -->
    <use :xlink:href="prefix + name" :fill="color"></use>
  </svg>
</template>

<script setup lang="ts">
// 接收父组件传递过来的参数
defineProps({
  prefix: {
    type: String,
    default: '#icon-'
  },
  // 提供使用的图标名字
  name: String,
  // 接受父组件传递颜色
  color: {
    type: String,
    default: ''
  },
  width: {
    type: String,
    default: '16px'
  },
  height: {
    type: String,
    default: '16px'
  }
})
</script>
<style scoped></style>
