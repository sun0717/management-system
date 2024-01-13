<template>
  <div>
    <Category :scene="scene" />
    <el-card style="margin: 10px 0">
      <div v-show="scene === 0">
        <el-button
          type="primary"
          size="default"
          icon="Plus"
          :disabled="!categoryStore.c3Id"
          @click="addAttr"
        >
          添加平台属性
        </el-button>
        <el-table border style="margin: 10px 0" :data="attrArr">
          <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
          <el-table-column label="属性名称" prop="attrName"></el-table-column>
          <el-table-column label="属性值名称">
            <template #="{ row, $index }">
              <el-tag style="margin: 5px" v-for="(item, index) in row.attrValueList" :key="item.id">
                {{ item.valueName }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #="{ row, $index }">
              <el-button
                type="primary"
                size="small"
                icon="Edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-popconfirm
                :title="`你确定删除${row.attrName}?`"
                width="200px"
                @confirm="deleteAttr(row.id)"
              >
                <template #reference>
                  <el-button type="danger" size="small" icon="Delete"></el-button>
                </template>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="scene === 1">
        <el-form :inline="true">
          <el-form-item label="属性名称">
            <el-input placeholder="请你输入属性名称" v-model="attrParams.attrName"></el-input>
          </el-form-item>
        </el-form>
        <el-button
          :disabled="attrParams.attrName ? false : true"
          type="primary"
          size="default"
          icon="Plus"
          @click="addAttrValue"
        >
          添加属性值
        </el-button>
        <el-button size="default" @click="cancel">取消</el-button>
        <el-table border style="margin: 10px 0" :data="attrParams.attrValueList">
          <el-table-column label="序号" width="80px" type="index" align="center"></el-table-column>
          <el-table-column label="属性值名称">
            <!-- row 当前属性值对象 -->
            <template #="{ row, $index }">
              <el-input
                :ref="(vc: any) => (inputArr[$index] = vc)"
                v-if="row.flag"
                placeholder="请你输入属性值名称"
                v-model="row.valueName"
                @blur="toLook(row, $index)"
              ></el-input>
              <div v-else @click="toEdit(row, $index)">{{ row.valueName }}</div>
            </template>
          </el-table-column>
          <el-table-column label="属性值操作">
            <template #="{ row, $index }">
              <el-button
                type="danger"
                size="small"
                icon="Delete"
                @click="attrParams.attrValueList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          size="default"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
        <el-button size="default" @click="cancel">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
// 组合式函数 watch
import { ref, watch, reactive, nextTick, onBeforeUnmount } from 'vue'
import { useCategoryStore } from '@/stores/modules/category'
// 引入获取已有属性与属性值接口
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import type { AttrResponseData, AttrValue, Attr } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'
let attrArr = ref<Attr[]>([])
// 定义 card 组件内容切换变量
let scene = ref<number>(0) // scene = 0: 显示 table, scene = 1: 展示添加与修改table
// 定义一个响应式数据控制编辑模式与查看模式的切换
let categoryStore = useCategoryStore()

// 收集新增的属性的数据
let attrParams = reactive<Attr>({
  attrName: '',
  attrValueList: [],
  categoryId: '',
  categoryLevel: 3
})

// 准备一个数组：将来存储对应的组件实例 el-input
let inputArr = ref<any>([])

watch(
  () => categoryStore.c3Id,
  () => {
    // 清空上一次查询的属性与属性值
    attrArr.value = []
    // 保证三级分类存在才能发请求
    if (!categoryStore.c3Id) return
    // 获取分类的ID
    getAttr()
  }
)

// 获取已有的属性与属性值方法
const getAttr = async () => {
  const { c1Id, c2Id, c3Id } = categoryStore
  // 获取分类下的已有的属性与属性值
  let result: AttrResponseData = await reqAttr(c1Id, c2Id, c3Id)
  if (result.code === 200) {
    attrArr.value = result.data
  }
}

const addAttr = () => {
  // 每一次点击的时候, 先清空一下数据再收集数据
  Object.assign(attrParams, {
    attrName: '', // 新增属性的名字
    attrValueList: [
      // 新增的属性值数组
    ],
    categoryId: '', // 三级分类的ID
    categoryLevel: 3 // 代表的是三级分类
  })
  // 切换为添加与修改属性的结构
  scene.value = 1
  // 收集新增属性的三级分类的 ID
  attrParams.categoryId = categoryStore.c3Id
}

// table 表格修改已有属性按钮的回调
const updateAttr = (row: Attr) => {
  scene.value = 1
  // 将已有的属性对象赋值给 attrParams 对象
  Object.assign(attrParams, JSON.parse(JSON.stringify(row)))
}

// 取消按钮的回调
const cancel = () => {
  scene.value = 0
}

// 添加属性值按钮的回调
const addAttrValue = () => {
  // 点击添加属性值按钮的时候, 向数组添加一个属性值对象
  attrParams.attrValueList.push({
    valueName: '',
    flag: true
  })
  // 获取最后 el-input 组件聚焦
  // 表单聚焦
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

// 保存按钮回调
const save = async () => {
  // 收集参数
  let result: any = await reqAddOrUpdateAttr(attrParams)
  // 发请求
  if (result.code === 200) {
    // 切换场景
    scene.value = 0
    // 提示信息
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功'
    })
    // 获取全部已有的属性与属性值
    getAttr()
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改成功' : '添加成功'
    })
  }
}

// 属性值表单元素失去焦点的方法
const toLook = (row: AttrValue, $index: number) => {
  // 非法情况判断
  if (row.valueName.trim() === '') {
    // 删除调用对应属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空'
    })
    return
  }
  // 非法情况
  let repeat = attrParams.attrValueList.find((item) => {
    if (item !== row) {
      return item.valueName === row.valueName
    }
  })

  if (repeat) {
    // 将重复的属性值从数组中移除
    attrParams.attrValueList.splice($index, 1)
    // 提示信息
    ElMessage({
      type: 'error',
      message: '属性值不能重复'
    })

    return
  }
  // 相应的属性值对象 flag: 变为 false, 展示 div
  row.flag = false
}

const toEdit = (row: AttrValue, $index: number) => {
  // 相应的属性值对象 flag: 变为 true, 展示 input
  row.flag = true
  // nextTick: 响应式数据发生变化, 获取更新的DOM(组件实例)
}

const deleteAttr = async (attrId: number) => {
  // 发相应的删除已有的属性的请求
  let result: any = await reqRemoveAttr(attrId)
  // 删除成功
  if (result.code === 200) {
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    // 获取一次已有的属性和属性值
    getAttr()
  } else {
    ElMessage({
      type: 'success',
      message: '删除失败'
    })
  }
}

// 路由组件销毁的时候, 把仓库分类相关的数据清空
onBeforeUnmount(() => {
  // 清空仓库的数据
  categoryStore.$reset()
})
</script>

<style lang="scss" scoped></style>
