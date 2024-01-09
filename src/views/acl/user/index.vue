<template>
  <!-- <el-card style="height: 80px">
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
  </el-card> -->
  <el-card style="margin: 10px 0">
    <el-button type="primary" size="default" @click="addUser">
      添加用户
    </el-button>
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
          <el-button size="small" icon="User" @click="setRole(row)">
            分配角色
          </el-button>
          <el-button type="primary" size="small" icon="Edit" @click="updateUser(row)">
            编辑
          </el-button>
          <el-popconfirm :title="`你确定删除${row.username}`" width="260px" @confirm="deleteUser(row.id)">
            <template #reference>
              <el-button type="danger" size="small" icon="Delete">
                删除
              </el-button>
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
  <el-drawer v-model="drawer">
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
        <el-button type="primary">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, nextTick } from 'vue'
import { ElMessage, formContextKey } from 'element-plus'
import { reqUserInfo, reqAddOrUpdateUser } from '@/api/acl/user'
import type { UserResponseData, Records, User } from '@/api/acl/user/type'
import { reqDeleteSpu } from '@/api/product/spu';
// 分页器当前页码
let pageNo = ref<number>(1)
// 每一页展示几条数据
let pageSize = ref<number>(10)
let total = ref<number>(0)
let userArr = ref<Records>([])
let keyword = ref<string>('')
let drawer = ref<boolean>(false)
let formRef = ref()
// 收集用户信息的响应式数据
let userParams = reactive<User>({
  username: '',
  name: '',
  password: ''
})
const getHasUser = async (pager = 1) => {
  pageNo.value = pager
  let result: UserResponseData = await reqUserInfo(pageNo.value, pageSize.value, keyword.value)
  if (result.code === 200) {
    total.value = result.data.total
    userArr.value = result.data.records
  }
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
}

const deleteUser = async (id: number) => {
  let result = await reqDeleteSpu(id)
  if (result.code === 200) {
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
    getHasUser()
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
// 
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
// 表单校验的规则对象
const rules = {
  // 用户名字
  username: [{ required: true, trigger: 'blur', validator: validatorUserName }],
  name: [{ required: true, trigger: 'blur', validator: validatorName }],
  password: [{ required: true, trigger: 'blur', validator: validatorPassword }],
}

onMounted(() => {
  getHasUser()
})
</script>

<style lang="scss" scoped></style>
