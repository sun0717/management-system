<template>
  <div>
    <!-- 三级分类结构 -->
    <Category :scene="scene" />
    <el-card style="margin: 10px 0px">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="categoryStore.c3Id ? false : true"
          @click="addSpu"
          >添加SPU</el-button
        >
        <el-table style="margin: 10px 0px" border :data="records">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="SPU名称" prop="spuName"></el-table-column>
          <el-table-column label="SPU描述" prop="description"></el-table-column>
          <el-table-column label="SPU操作">
            <!-- row: 即为已有的Spu对象 -->
            <template #="{ row, $index }">
              <el-button icon="Plus" title="添加SKU" size="small" @click="addSku(row)"></el-button>
              <el-button
                type="primary"
                icon="Edit"
                title="修改SPU"
                size="small"
                @click="updateSpu(row)"
              ></el-button>
              <el-button
                type="info"
                icon="View"
                title="查看SKU列表"
                size="small"
                @click="findSku(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.spuName}?`"
                width="200px"
                @confirm="deleteSpu(row)"
              >
                <template #reference>
                  <el-button type="danger" icon="Delete" title="删除SPU" size="small"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          v-model:current-page="pageNo"
          v-model:page-size="pageSize"
          :page-sizes="[3, 5, 7, 9]"
          :background="true"
          layout="prev, pager, next, jumper, ->, sizes, total"
          :total="total"
          @current-change="getHasSpu"
          @size-change="changeSize"
        />
      </div>
      <SpuForm ref="spu" v-show="scene === 1" @changeScene="changeScene"></SpuForm>
      <SkuForm ref="sku" v-show="scene === 2" @changeScene="changeScene"></SkuForm>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 场景的数据
import { ref, watch } from 'vue'
import { reqHasSpu } from '@/api/product/spu'
import Category from '@/components/Category/index.vue'
import type { HasSpuResponseData, Records } from '@/api/product/spu/type'
import { useCategoryStore } from '@/stores/modules/category'
import SpuForm from './spuForm.vue'
import SkuForm from './skuForm.vue'
let categoryStore = useCategoryStore()
// 场景的数据
let scene = ref<number>(0)
// 分页器默认页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(3)
// 存储已有的SPU的数据
let records = ref<Records>([])
let spu = ref<any>()
let sku = ref<any>()
let total = ref<number>(0)
// 监听三级分类ID变化
watch(
  () => categoryStore.c3Id,
  () => {
    // 务必保证有三级分类ID
    if (!categoryStore.c3Id) return
    getHasSpu()
  }
)

// 此方法执行:可以获取某一个三级分类下全部的已有的SPU
const getHasSpu = async (pager = 1) => {
  pageNo.value = pager
  let result: HasSpuResponseData = await reqHasSpu(pageNo.value, pageSize.value, categoryStore.c3Id)
  if (result.code === 200) {
    records.value = result.data.records
    total.value = result.data.total
  }
}
const addSpu = () => {
  scene.value = 1
  spu.value.initAddSpu(categoryStore.c3Id)
}

const addSku = (row: SpuData) => {
  scene.value = 2
  sku.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

const updateSpu = async () => {}

const findSku = async () => {}

const deleteSpu = async () => {}

const changeSize = () => {
  getHasSpu()
}
</script>

<style lang="scss" scoped></style>
