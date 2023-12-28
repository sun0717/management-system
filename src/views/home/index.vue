<script setup lang="ts">
import { onMounted } from 'vue'
import { useUserStore } from '@/stores/modules/user'
let userStore = useUserStore()
onMounted(() => {
  userStore.userInfo()
})
</script>

<template>
  <div>home</div>
</template>

<style scoped lang="scss"></style>
