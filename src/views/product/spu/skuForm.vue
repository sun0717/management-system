<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuParams.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" type="number" v-model="skuParams.price"></el-input>
      </el-form-item>
      <el-form-item label="重量(克)">
        <el-input placeholder="重量(克)" type="number" v-model="skuParams.weight"></el-input>
      </el-form-item>
      <el-form-item label="sku描述">
        <el-input placeholder="sku描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form :inline="true">
          <el-form-item v-for="(item, index) in attrArr" :key="item.id" :label="item.attrName">
            <el-select v-model="item.attrIdAndValueId">
              <el-option v-for="(attrValue, index) in item.attrValueList" :key="attrValue.id"
                :value="`${item.id}:${attrValue.id}`" :label="attrValue.valueName"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form :inline="true">
          <el-form-item v-for="(item, index) in saleArr" :key="item.id" :label="item.saleAttrName">
            <el-select v-model="item.saleIdAndValueId">
              <el-option :value="`${item.id}:${saleAttrValue.id}`" :label="saleAttrValue.saleAttrValueName"
                v-for="(saleAttrValue, index) in item.spuSaleAttrValueList" :key="saleAttrValue.id"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table border :data="imgArr">
          <el-table-column type="selection" width="80px" align="center"></el-table-column>
          <el-table-column label="图片">
            <template #="{ row, $index }">
              <img :src="row.imgUrl" alt="" style="width: 100px; height: 100px;" />
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="imgName"></el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button type="primary" size="small" @click="handler(row)">
                设置默认
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" @click="save">保存</el-button>
        <el-button size="default" @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// 引入请求API
import { reqAttr } from '@/api/product/attr'
import { reqSpuImageList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu'
import type { SkuData } from '@/api/product/spu/type'
// 平台属性
let attrArr = ref<any>([])
// 销售属性
let saleArr = ref<any>([])
// 照片的数据
let imgArr = ref<any>([])
let table = ref<any>()
let skuParams = reactive<SkuData>({
  category3Id: '',
  spuId: '',
  tmId: '',
  skuName: '',
  price: '',
  weight: '',
  skuDesc: '',
  skuAttrValueList: [
    // {
    //   attrId: '',
    //   valueId: '',
    // },
  ],
  skuSaleAttrValueList: [
    // {
    //   saleAttrId: '',
    //   saleAttrValueId: '',
    // },
  ],
  skuDefaultImg: '',
})
let $emit = defineEmits(['changeScene'])

// 当前子组件的方法对外暴露
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
  // 收集数据
  skuParams.category3Id = spu.category3Id
  skuParams.spuId = spu.id
  skuParams.tmId = spu.tmId
  // 获取平台属性
  let result: any = await reqAttr(c1Id, c2Id, spu.category3Id)
  // 获取对应的销售属性
  let result1: any = await reqSpuHasSaleAttr(spu.id)
  // 获取照片墙的数据
  let result2: any = await reqSpuImageList(spu.id)
  // 平台属性
  attrArr.value = result.data
  saleArr.value = result1.data
  imgArr.value = result2.data
}

const handler = (row: any) => {
  // 排他操作
  imgArr.value.forEach((item: any) => {
    // 复选框选中
    table.value.toggleRowSelection(item, false)
  })
  // 选中图片才勾选
  table.value.toggleRowSelection(row, true)
  skuParams.skuDefaultImg = row.imgUrl
}
// 保存按钮的回调
const save = async () => {
  // 整理参数
  // 平台属性
  skuParams.skuAttrValueList = attrArr.value.reduce((acc: any, cur: any) => {
    if (cur.attrIdAndValueId) {
      let [attrId, valueId] = cur.attrIdAndValueId.split(':')
      acc.push({
        attrId, valueId
      })
    }
    return acc
  }, [])
  // 销售属性
  skuParams.skuSaleAttrValueList = saleArr.value.reduce((acc: any, cur: any) => {
    if (cur.saleIdAndValueId) {
      let [saleAttrId, saleAttrValueId] = cur.saleIdAndValueId.split(':')
      acc.push({
        saleAttrId, saleAttrValueId
      })
    }
    return acc
  }, [])
  // 添加SKU的请求
  let result: any = await reqAddSku(skuParams)
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '添加SKU成功'
    })
    // 通知父组件切换场景为零
    $emit('changeScene', { flag: 0, params: '' })
  } else {
    ElMessage({
      type: 'error',
      message: '添加SKU失败'
    })
  }
}
// 取消按钮的回调
const cancel = () => {
  $emit('changeScene', { flag: 0, params: '' })
}
// 对外暴露的方法
defineExpose({
  initSkuData
})
</script>

<style scoped lang="scss"></style>
