<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="一级分类">
        <el-select
          :disabled="scene === 0 ? false : true"
          v-model="categoryStore.c1Id"
          @change="handler(1)"
        >
          <el-option
            v-for="(c1, index) in categoryStore.c1Arr"
            :key="c1.id"
            :label="c1.name"
            :value="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          :disabled="scene === 0 ? false : true"
          v-model="categoryStore.c2Id"
          @change="handler(2)"
        >
          <el-option
            v-for="(c2, index) in categoryStore.c2Arr"
            :key="c2.id"
            :label="c2.name"
            :value="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select :disabled="scene === 0 ? false : true" v-model="categoryStore.c3Id">
          <el-option
            v-for="(c3, index) in categoryStore.c3Arr"
            :key="c3.id"
            :label="c3.name"
            :value="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
// 引入分类相关的方法
import { useCategoryStore } from '@/stores/modules/category'
const categoryStore = useCategoryStore()
onMounted(() => {
  categoryStore.getC1()
})

// 此方法即为一级分类下拉菜单的 change 事件(选中值的时候会触发, 保证一级分类ID)
const handler = (n: number) => {
  // 一级变化时, 将二级和三级分类清空
  if (n === 1) {
    categoryStore.c2Id = ''
    categoryStore.c3Id = ''
    categoryStore.c3Arr = []
    categoryStore.getC2()
  } else if (n === 2) {
    categoryStore.c3Id = ''
    categoryStore.getC3()
  }
}

// 接受父组件传递过来的scene
defineProps(['scene'])
</script>

<style scoped></style>
