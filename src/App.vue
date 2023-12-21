<script setup lang="ts">
import { Edit } from '@element-plus/icons-vue'
</script>

<template>
  <div>
    <el-button type="primary" :icon="Edit">主要按钮</el-button>
    <el-pagination
      v-model:current-page="currentPage4"
      v-model:page-size="pageSize4"
      :page-sizes="[100, 200, 300, 400]"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, sizes, prev, pager, next, jumper"
      :total="400"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
