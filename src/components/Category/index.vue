<template>
  <!-- <el-card>
        <el-form :inline="true">
            <el-form-item label="一级分类">
                <el-select :disabled="scene === 0 ? false : true" v-model="categoryStore.c1Id" @change="handler(1)">
                    <el-option v-for="(c1, index) in categoryStore.c1Arr" :key="c1.id" :label="c1.name"
                        :value="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select :disabled="scene === 0 ? false : true" v-model="categoryStore.c2Id" @change="handler(2)">
                    <el-option v-for="(c2, index) in categoryStore.c2Arr" :key="c2.id" :label="c2.name"
                        :value="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select :disabled="scene === 0 ? false : true" v-model="categoryStore.c3Id">
                    <el-option v-for="(c3, index) in categoryStore.c3Arr" :key="c3.id" :label="c3.name"
                        :value="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card> -->
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { reqC1 } from '@/api/product/attr/index'
onMounted(() => {
  getC1()
})

const getC1 = async () => {
  let result = await reqC1()
  console.log(result)
}
</script>

<style scoped></style>
