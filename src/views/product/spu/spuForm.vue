<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="请你输入SPU名称" v-model="SpuParams.spuName"></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌">
      <el-select v-model="SpuParams.tmId">
        <el-option
          :label="item.tmName"
          v-for="(item, index) in AllTradeMark"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述">
      <el-input
        type="textarea"
        placeholder="请你输入SPU描述"
        v-model="SpuParams.description"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图标">
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :before-upload="handlerUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" style="width: 100%; height: 100%" />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性">
      <!-- 展示销售属性的下拉菜单 -->
      <el-select
        v-model="saleAttrIdAndValueName"
        :placeholder="
          unSelectSaleAttr.length ? `还未选择${unSelectSaleAttr.length}个` : '暂无数据可选择'
        "
      >
        <el-option
          :label="item.name"
          v-for="(item, index) in unSelectSaleAttr"
          :key="item.id"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        style="margin-left: 10px"
        type="primary"
        size="default"
        icon="Plus"
        :disabled="saleAttrIdAndValueName ? false : true"
        @click="addSaleAttr"
      >
        添加属性
      </el-button>
      <!-- table展示销售属性与属性值的地方 -->
      <el-table border style="margin: 10px 0" :data="saleAttr">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="销售属性名字" width="120px" prop="saleAttrName"></el-table-column>
        <el-table-column label="销售属性值">
          <template #="{ row, $index }">
            <el-tag
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="row.id"
              class="mx-1"
              closable
              style="margin: 0 8px"
              @close="row.spuSaleAttrValueList.splice($index, 1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              :ref="(vc: any) => (inputArr[$index] = vc)"
              v-model="row.saleAttrValue"
              v-if="row.flag === true"
              placeholder="请你输入属性值"
              size="small"
              style="width: 100px"
              @blur="toLook(row)"
            ></el-input>
            <el-button v-else size="small" icon="Plus" @click="toEdit(row, $index)"></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template #="{ row, $index }">
            <el-button
              type="danger"
              size="small"
              icon="Delete"
              @click="saleAttr.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <el-form-item>
      <el-button
        type="primary"
        size="default"
        @click="save"
        :disabled="saleAttr.length > 0 ? false : true"
      >
        保存
      </el-button>
      <el-button size="default" @click="cancel">取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import type { AllTradeMark, HasSaleAttr, SaleAttr, SpuData, SpuImg } from '@/api/product/spu/type'
import {
  reqAllTradeMark,
  reqSpuImageList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
  reqAddOrUpdateSpu
} from '@/api/product/spu'
import { ref } from 'vue'
import type { TradeMark } from '@/api/product/trademark/type'
// 存储已有的SPU这些数据
let AllTradeMark = ref<TradeMark[]>([])
let imgList = ref<SpuImg[]>([])
// 已有的SPU销售属性
let saleAttr = ref<SaleAttr[]>([])
let SpuParams = ref<any>([])
//全部销售属性
let allSaleAttr = ref<HasSaleAttr[]>()
let $emit = defineEmits(['changeScene'])
// 子组件点击取消按钮: 通知父组件切换场景为1,展示已有的SPU数据
const cancel = () => {
  $emit('changeScene', 0)
}
// 子组件书写一个方法
const initHasSpuData = async (spu: SpuData) => {
  // spu: 为父组件传递过来的已有的SPU对象
  let result: AllTradeMark = await reqAllTradeMark()
  // 获取某一个品牌旗下全部售卖商品的图片
  let result1: any = await reqSpuImageList(spu.id as number)
  // 读取已有的SPU销售属性的数据
  let result2: any = await reqSpuHasSaleAttr(spu.id as number)
  let result3: any = await reqAllSaleAttr()
  // 存储全部品牌数据
  AllTradeMark.value = result.data
  // SPU对应商品图片
  imgList.value = result1.data
  // 存储已有的SPU的销售属性
  saleAttr.value = result2.data
  // 存储全部的销售属性
  allSaleAttr.value = result3.data
}

defineExpose({ initHasSpuData })
</script>

<style lang="scss" scoped></style>
