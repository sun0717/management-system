<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名:">
        <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="default" :disabled="keyword.length ? false : true" @click="search">
          搜索
        </el-button>
        <el-button size="default" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" @click="addUser"> 添加用户 </el-button>
    <el-button type="danger" size="default" :disabled="selectIdArr.length ? false : true" @click="deleteSelectUser">
      批量删除
    </el-button>
    <!-- table展示用户信息 -->
    <el-table style="margin: 10px 0px" border :data="userArr" @selection-change="selectChange">
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" type="index" align="center"></el-table-column>
      <el-table-column label="id" align="center" prop="id"></el-table-column>
      <el-table-column label="用户名字" align="center" prop="username" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户名称" align="center" prop="name" show-overflow-tooltip></el-table-column>
      <el-table-column label="用户角色" align="center" prop="roleName" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="更新时间" align="center" prop="updateTime" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="300px" align="center">
        <template #="{ row, $index }">
          <el-button size="small" icon="User" @click="setRole(row)"> 分配角色 </el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">
            编辑
          </el-button>
          <el-popconfirm :title="`你确定删除${row.username}`" width="260px" @confirm="deleteUser(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"> 删除 </el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-model:current-page="pageNo" v-model:page-size="pageSize" :page-sizes="[5, 7, 9, 11]"
      :background="true" layout="prev, pager, next, jumper, -> , sizes, total" :total="total" @current-change="getHasUser"
      @size-change="handler" />
  </el-card>
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? '更新用户' : '添加用户' }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input placeholder="请您输入用户姓名" v-model="userParams.username"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input placeholder="请您输入用户昵称" v-model="userParams.name"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input placeholder="请您输入用户密码" v-model="userParams.password"></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate" @change="handleCheckAllChange">
            全选
          </el-checkbox>
          <el-checkbox-group v-model="userRole" @change="handleCheckedUsersChange">
            <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">
              {{ role.roleName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { reqUserInfo, reqAddOrUpdateUser, reqSelectUser, reqAllRole, reqDeleteUser, reqSetUserRole } from '@/api/acl/user'
import type { UserResponseData, Records, User, AllRole, AllRoleResponseData, SetRoleData } from '@/api/acl/user/type'
import { useLayoutSettingStore } from '@/stores/modules/setting'
// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(10)
let total = ref<number>(0)
// 存储全部用户的数组
let userArr = ref<Records>([])
let keyword = ref<string>('')
// 定义响应式数据控制抽屉的显示与隐藏
let drawer = ref<boolean>(false)
// 控制分配角色抽屉显示与隐藏
let drawer1 = ref<boolean>(false)
// 存储全部职位的数据
let allRole = ref<AllRole>([])
// 当前用户已有的职位
let userRole = ref<AllRole>([])
let selectIdArr = ref<User[]>([])
let formRef = ref()
let checkAll = ref<boolean>(false)
const isIndeterminate = ref<boolean>(true)
// 收集用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: ''
})
let settingStore = useLayoutSettingStore()
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
  if (result.code === 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
}

const handler = () => {
  getHasUser()
}

const search = () => {
  getHasUser()
  keyword.value = ''
}

const reset = () => {
  settingStore.refsh = !settingStore.refsh
}

// 添加用户按钮的回调
const addUser = () => {
  // 抽屉显示出来
  drawer.value = true
  // 清空数据
  Object.assign(userParams, {
    username: '',
    name: '',
    password: ''
  })
  // 清除上一次的错误的提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

// 更新已有的用户按钮的回调
// row: 即为已有用户的账号信息
const updateUser = (row) => {
  // 抽屉显示
  drawer.value = true
  // 存储收集已有的账号信息
  Object.assign(userParams, row)
  // 清除上一次的错误地提示信息
  nextTick(() => {
    formRef.value.clearValidate('username')
    formRef.value.clearValidate('name')
    formRef.value.clearValidate('password')
  })
}

const deleteUser = async (id: number) => {
  let result = await reqDeleteUser(id)
  if (result.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

const selectChange = (value: any) => {
  selectIdArr.value = value
}

const deleteSelectUser = async () => {
  let idList: any = selectIdArr.value.map((item) => {
    return item.id
  })
  let res: any = await reqSelectUser(idList)
  if (res.code === 200) {
    ElMessage({ type: 'success', message: '删除成功' })
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  }
}

// 保存按钮的回调
const save = async () => {
  // 点击保存按钮, 务必需要保证表单全部符合条件再去发请求
  await formRef.value.validate()
  // 保存按钮：添加新的用户|更新已有的用户信息
  let result: any = await reqAddOrUpdateUser(userParams)
  // 添加或者更新成功
  if (result.code === 200) {
    // 关闭抽屉
    drawer.value = false
    // 提示消息
    ElMessage({
      type: 'success',
      message: userParams.id ? '更新成功' : '添加成功'
    })
    // 获取最新的全部账号信息
    getHasUser(userParams.id ? pageNo.value : 1)
    // 浏览器自动刷新一次
    window.location.reload()
  } else {
    // 关闭抽屉
    drawer.value = false
    // 提示消息
    ElMessage({ type: 'error', message: userParams.id ? '更新失败' : '添加失败' })
  }
}

// 取消按钮的问题
const cancel = () => {
  drawer.value = false
}

// 校验用户名字回调函数
const validatorUserName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位数'))
  }
}

const validatorName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户名字至少五位数'))
  }
}

const validatorPassword = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack()
  } else {
    callBack(new Error('用户密码至少六位'))
  }
}

const setRole = async (row: User) => {
  drawer1.value = true
  // 存储已有的用户信息
  Object.assign(userParams, row)
  // 获取全部的职位的数据与当前用户已有的职位的数据
  let res: AllRoleResponseData = await reqAllRole(userParams.id as number)
  if (res.code === 200) {
    // 全部的
    allRole.value = res.data.allRolesList
    // 勾选上的
    userRole.value = res.data.assignRoles
    drawer1.value = true
  }
}

const handleCheckAllChange = (val: boolean) => {
  userRole.value = val ? allRole.value : []
  isIndeterminate.value = false
}

const handleCheckedUsersChange = (value: string[]) => {
  // 已经勾选的这些项目的长度
  const checkedCount = value.length
  checkAll.value = checkedCount === allRole.value.length
  // 顶部的复选框不确定的样式
  isIndeterminate.value =
    checkedCount > 0 && checkedCount < allRole.value.length
}

const confirmClick = async () => {
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number
    }),
  }
  let res: any = await reqSetUserRole(data)
  if (res.code === 200) {
    ElMessage({
      type: 'success',
      message: '分配职务成功'
    })
    drawer1.value = false
    getHasUser(pageNo.value)
  }
}
// 表单校验的规则对象
const rules = {
  // 用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUserName }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }]
}

onMounted(() => {
  getHasUser()
})
</script>

<style lang="scss" scoped></style>
