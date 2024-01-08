<template>
  <el-card>
    <el-table border :data="skuArr">
      <el-table-column label="序号" type="index" align="center" width="80px">

      </el-table-column>
      <el-table-column label="名称" show-overflow-tooltip width="150px" prop="skuName">

      </el-table-column>
      <el-table-column label="描述" show-overflow-tooltip width="150px" prop="skuDesc">

      </el-table-column>
      <el-table-column label="图片" width="150px">
        <template #="{ row, $index }">
          <img :src="row.skuDefaultImg" alt="" style="width: 100px; height: 100px;">
        </template>
      </el-table-column>
      <el-table-column label="重量" width="150px" prop="weight">

      </el-table-column>
      <el-table-column label="价格" width="150px" prop="price">

      </el-table-column>
      <el-table-column label="操作" width="250px" fixed="right">
        <template #="{ row, $index }">
          <el-button type="primary" size="small" :icon="row.isSale == 1 ? 'Bottom' : 'Top'"
            @click="updateSale(row)"></el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateSku"></el-button>
          <el-button type="primary" size="small" icon="InfoFilled"></el-button>
          <el-button type="primary" size="small" icon="Delete"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :background="true" layout="prev, pager, next, jumper, ->, sizes, total" :total="total" @current-change="getHasSku"
      @size-change="handler" />
  </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { reqSkuList, reqSaleSku, reqCancelSale } from '@/api/product/sku'
import type { SkuResponseData, SkuData } from '@/api/product/sku/type'
import { ElMessage } from 'element-plus'
// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(10)
let total = ref<number>(0)
let skuArr = ref<SkuResponseData[]>([])
// 组件挂载完毕
onMounted(() => {
  getHasSku()
})

const getHasSku = async (pager = 1) => {
  //当前分页器的页码
  pageNo.value = pager
  let result: SkuResponseData = await reqSkuList(pageNo.value, pageSize.value)
  if (result.code === 200) {
    total.value = result.data.total
    skuArr.value = result.data.records
  }
}
// 分页器下拉菜单发生变化触发
const handler = (pageSizes: number) => {
  getHasSku()
}

// 商品的上架与下架操作
const updateSale = async (row: SkuData) => {
  // 如果当前商品的 isSale==1 , 说明当前商品是上架的状态->更新为下架
  // 否则else情况与上面情况相反
  if (row.isSale == 1) {
    // 下架操作
    await reqCancelSale((row.id as number))
    ElMessage({
      type: 'success',
      message: '下架成功'
    })
    getHasSku(pageNo.value)
  } else {
    // 商家操作
    await reqSaleSku((row.id as number))
    ElMessage({
      type: 'success',
      message: '上架成功'
    })
    getHasSku(pageNo.value)
  }
}

// 更新已有的SKU
const updateSku = () => {
  ElMessage({type: 'warning', message: '努力更新中'})
}
</script>

<style lang="scss" scoped></style>
