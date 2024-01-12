<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="职位搜索">
        <el-input placeholder="请输入搜索职位的关键字" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword ? false : true" @click="search">
          搜索
        </el-button>
        <el-button size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" icon="Plus" @click="addRole"> 添加职位 </el-button>
    <!-- table展示用户信息 -->
    <el-table style="margin: 10px 0px" border :data="allRole">
      <!-- <el-table-column type="selection" align="center"></el-table-column> -->
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column label="职位名称" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="280px" align="center">
        <template #="{ row, $index }">
          <el-button size="small" icon="User" @click="setPermission(row)"> 分配权限 </el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateRole(row)">
            编辑
          </el-button>
          <el-popconfirm :title="`你确定删除${row.username}`" width="260px" @confirm="removeRole(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[10, 20, 30, 40]"
      :background="true" layout="prev, pager, next, jumper, -> , sizes, total" :total="total" @current-change="getHasRole"
      @size-change="sizeHandler" />
  </el-card>
  <el-dialog v-model="dialogVisible" :title="RoleParams.id ? '更新职位' : '添加职位'">
    <el-form :model="RoleParams" :rules="rules" ref="form">
      <el-form-item label="职位名称" prop="roleName">
        <el-input placeholder="请你输入职位名称" v-model="RoleParams.roleName"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button size="default" @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" size="default" @click="save">确定</el-button>
    </template>
  </el-dialog>
  <!-- 抽屉组件：分配职位的菜单权限与按钮的权限 -->
  <el-drawer v-model="drawer">
    <template #header>
      <h4>分配菜单与按钮的权限</h4>
    </template>
    <template #default>
      <!-- 树形控件 -->
      <el-tree ref="tree" :data="menuArr" show-checkbox node-key="id" default-expand-all :default-checked-keys="selectArr"
        :props="defaultProps" />
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="handler">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus';
import { reqRoleInfo, reqAllMenuList, reqAddOrUpdateRole, reqRemoveRole, reqSetPermission } from '@/api/acl/role'
import { useLayoutSettingStore } from '@/stores/modules/setting'
import type { RoleData, Records, RoleResponseData, MenuResponseData, MenuList } from '@/api/acl/role/type'
let settingStore = useLayoutSettingStore()
// 分页器当前页码
let pageNo = ref<number>(1)
let tree = ref<any>()
// 每一页展示几条数据
let pageSize = ref<number>(10)
let keyword = ref<string>('')
// 职位总个数
let total = ref<number>(0)
// 获取 form 组件实例
let form = ref<any>()
// 用于存储勾选的节点的ID(四级的)
let selectArr = ref<number[]>()
// 存储全部已有的职位
let allRole = ref<Records>([])
// let roleArr = ref<Records>([])
// 控制对话框的显示与隐藏
let dialogVisible = ref<boolean>(false)
// 控制抽屉显示与隐藏
let drawer = ref<boolean>(false)

// 收集新增岗位数据
let menuArr = ref<MenuList>([])
let RoleParams = reactive<RoleData>({
  roleName: ''
})

const defaultProps = {
  children: 'children',
  label: 'name'
}

onMounted(() => {
  getHasRole()
})

const search = () => {
  getHasRole()
  keyword.value = ''
}

const addRole = () => {
  // 抽屉显示出来
  dialogVisible.value = true
  // 清空数据
  Object.assign(RoleParams, {
    roleName: '',
    id: 0
  })
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

const sizeHandler = async () => {
  getHasRole()
}

const handler = async () => {
  // 职位的ID
  const roleId = RoleParams.id as number
  // 选中节点的ID
  let arr = tree.value.getCheckedKeys()
  // 半选的ID
  let arr1 = tree.value.getHalfCheckedKeys()
  let permissionId = arr.concat(arr1)
  // 下发权限
  let res: any = await reqSetPermission(roleId, permissionId)
  if (res.code === 200) {
    drawer.value = false
    ElMessage({
      type: 'success',
      message: '分配权限成功'
    })
    window.location.reload()
  }
}

const getHasRole = async (pager = 1) => {
  pageNo.value = pager
  let result: RoleResponseData = await reqRoleInfo(pageNo.value, pageSize.value, keyword.value)
  if (result.code === 200) {
    total.value = result.data.total
    allRole.value = result.data.records
  }
}

const setPermission = async (row: RoleData) => {
  drawer.value = true
  Object.assign(RoleParams, row)
  let res: MenuResponseData = await reqAllMenuList(RoleParams.id as number)
  if (res.code === 200) {
    menuArr.value = res.data
    selectArr.value = filterSelectArr(menuArr.value, [])
  }
}

const updateRole = (row: RoleData) => {
  dialogVisible.value = true
  Object.assign(RoleParams, row)
  nextTick(() => {
    form.value.clearValidate('roleName')
  })
}

const removeRole = async (id: number) => {
  let res: any = await reqRemoveRole(id)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasRole(allRole.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

const filterSelectArr = (allData: any, initArr: any) => {
  allData.forEach((item: any) => {
    if (item.select && item.level === 4) {
      initArr.push(item.id)
    }
    if (item.children && item.children.length > 0) {
      filterSelectArr(item.children, initArr)
    }
  });
  return initArr
}

const validateRoleName = (rule: any, value: any, callback: any) => {
  if (value.trim().length >= 2) {
    callback()
  } else {
    callback(new Error('职位名称至少两位'))
  }
}

const save = async () => {
  // 表单校验结果，结果通过在发请求，结果没有通过不应该再发请求
  await form.value.validate()
  let res: any = await reqAddOrUpdateRole(RoleParams)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: RoleParams.id ? "更新成功" : "添加成功"
    })
  }
}

const reset = () => {
  settingStore.refsh = !settingStore.refsh
}
const rules = {
  roleName: [{ validator: validateRoleName, trigger: 'blur' }]
}
</script>

<style lang="scss" scoped></style>
