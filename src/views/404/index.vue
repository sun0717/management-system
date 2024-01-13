<script setup lang="ts">
import { useRouter } from 'vue-router'
let $router = useRouter()
const goHome = () => {
  $router.push('/home')
}
</script>

<template>
  <div class="box">
    <h1>404 PAGE NOT FOUND</h1>
    <img src="../../assets/images/error_images/404.png" alt="" />
    <el-button type="success" round @click="goHome">take me home</el-button>
  </div>
</template>

<style scoped lang="scss">
.box {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  img {
    width: 800px;
    height: 400px;
  }
  button {
    width: 50px;
    height: 50px;
  }
}
</style>
