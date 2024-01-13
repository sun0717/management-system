<template>
  <el-card class="box-card">
    <!-- 添加品牌 -->
    <el-button
      type="primary"
      size="default"
      icon="Plus"
      @click="addTradeMark"
      v-has="`btn.Trademark.add`"
    >
      添加品牌
    </el-button>
    <el-table style="margin: 10px 0" border :data="tradeMarkArr">
      <el-table-column label="序号" width="80px" align="center" type="index"></el-table-column>
      <el-table-column label="品牌名称" prop="tmName"></el-table-column>
      <el-table-column label="品牌LOGO">
        <template #="{ row, $index }">
          <img :src="row.logoUrl" alt="图片丢失了~" style="width: 100px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column label="品牌操作">
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateTradeMark(row)"
          ></el-button>
          <el-popconfirm
            :title="`您确定删除${row.tmName}`"
            width="250px"
            icon="delete"
            @confirm="removeTradeMark(row.id)"
          >
            <template #reference>
              <el-button type="danger" size="small" icon="Delete"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- pagination -->
    <el-pagination
      v-model:current-page="pageNo"
      v-model:page-size="limit"
      :page-sizes="[3, 5, 7, 9]"
      :background="true"
      layout="prev, pager, next, jumper, ->, sizes, total"
      :total="total"
      @current-change="getHasTradeMark"
      @size-change="sizeChange"
    />
  </el-card>
  <!-- 对话框组件：在添加品牌与修改已有品牌的业务时候使用结构 -->
  <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'">
    <el-form style="width: 90%" :model="trademarkParams" :rules="rules" ref="formRef">
      <el-form-item label="品牌名称" label-width="100px" prop="tmName">
        <el-input placeholder="请您输入品牌名称" v-model="trademarkParams.tmName"></el-input>
      </el-form-item>
      <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
        <!-- 图片上传至服务器, 需携带 api
              action：地址
              show-file-list：上传成功的进度条
              :on-success：文件上传成功的钩子
              :before-upload: 上传文件之前的钩子, 参数为上传的文件, 
                  若返回 false 或者返回 Promise 且被 reject, 则停止上传。
                  用来限制用户上传文件的格式和大小
        -->
        <el-upload
          class="avatar-uploader"
          action="/api/admin/product/fileUpload"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" size="default" @click="cancel">取消</el-button>
      <el-button type="primary" size="default" @click="confirm">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import {
  reqHasTradeMark,
  reqAddOrUpdateTrademark,
  reqDeleteTrademark
} from '@/api/product/trademark'
import type { TradeMarkResponseData, Records, TradeMark } from '@/api/product/trademark/type'
// 当前页码
let pageNo = ref<number>(1)
// 约束每页展示条数
let limit = ref<number>(3)
let total = ref<number>(0)
// 控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false)
let tradeMarkArr = ref<Records>([])
let trademarkParams = reactive<TradeMark>({
  tmName: '',
  logoUrl: ''
})
let formRef = ref()
// 上传的钩子
import type { UploadProps } from 'element-plus'
// const imageUrl = ref('')
import { ElMessage } from 'element-plus'
// 获取已有品牌的接口封装为一个函数
const getHasTradeMark = async (pager = 1) => {
  // 当前页码
  pageNo.value = pager
  let res: TradeMarkResponseData = await reqHasTradeMark(pageNo.value, limit.value)
  if (res.code === 200) {
    total.value = res.data.total
    tradeMarkArr.value = res.data.records
  }
}

onMounted(() => {
  getHasTradeMark()
})

// 当下拉菜单发生变化的时候触发此方法
// 这个自定义事件, 分页器组件会将下拉菜单选中数据返回
const sizeChange = () => {
  getHasTradeMark()
}

// 添加品牌按钮的回调
const addTradeMark = () => {
  dialogFormVisible.value = true
  trademarkParams.id = 0
  trademarkParams.tmName = ''
  trademarkParams.logoUrl = ''
  // 二次更新
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })
}

const cancel = () => {
  // 对话框隐藏
  dialogFormVisible.value = false
}

const confirm = async () => {
  await formRef.value.validate()
  let result: any = await reqAddOrUpdateTrademark(trademarkParams)
  // 添加品牌成功
  if (result.code === 200) {
    // 关闭对话框
    dialogFormVisible.value = false
    // 弹出提示信息
    ElMessage({
      type: 'success',
      message: trademarkParams.id ? '修改品牌成功' : '添加品牌成功'
    })
    // 再次发请求获取已有全部的品牌数据
    getHasTradeMark(trademarkParams.id ? pageNo.value : 1)
  } else {
    // 添加品牌失败
    ElMessage({
      type: 'error',
      message: trademarkParams.id ? '修改品牌失败' : '添加品牌失败'
    })
    // 关闭对话框
    // dialogFormVisible.value = false
  }
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (response, uploadFile) => {
  // response: 即为当前这次上传图片post请求服务器返回的数据
  // 收集上传图片的地址, 添加一个新的品牌的时候带给服务器
  // imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  trademarkParams.logoUrl = response.data
  // 上传成功, 清除错误提示
  formRef.value.clearValidate('logoUrl')
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  // 钩子是在图片上传成功之前触发, 上传文件之前可以约束文件类型与大小
  // 要求：上传文件格式 png|jpg|gif 4M
  if (
    rawFile.type === 'image/png' ||
    rawFile.type === 'image/jpeg' ||
    rawFile.type === 'image/gif'
  ) {
    if (rawFile.size / 1024 / 1024 < 4) {
      return true
    } else {
      ElMessage({
        type: 'error',
        message: '上传的文件大小应小于4M'
      })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '上传的文件类型必须是PNG|JPG|GIF'
    })
    return false
  }
}

const validatorTmName = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 2) {
    callBack()
  } else {
    callBack(new Error('品牌名称位数大于等于两位'))
  }
}

const validatorLogoUrl = (rule: any, value: any, callBack: any) => {
  if (value) {
    callBack()
  } else {
    callBack(new Error('Logo的图片务必上传'))
  }
}

const rules = {
  tmName: [
    {
      // required: 这个字段务必校验, 表单项前面出来五角星
      // trigger: 代表触发校验规则时机[blur、change]
      required: true,
      trigger: 'blur',
      validator: validatorTmName
    }
  ],
  logoUrl: [
    {
      required: true,
      trigger: 'change',
      validator: validatorLogoUrl
    }
  ]
}

const updateTradeMark = (row: TradeMark) => {
  nextTick(() => {
    formRef.value.clearValidate('tmName')
    formRef.value.clearValidate('logoUrl')
  })

  dialogFormVisible.value = true
  Object.assign(trademarkParams, row)
}

// 气泡确认框确定按钮的回调
const removeTradeMark = async (id: number) => {
  // 点击确定按钮删除已有品牌请求
  let res = await reqDeleteTrademark(id)
  if (res.code === 200) {
    // 删除成功提示信息
    ElMessage({
      type: 'success',
      message: '删除品牌成功'
    })
    // 再次获取已有的品牌数据
    // 如果品牌数组长度大于1, 留在当前页, 否则回到当前页上一页 - 1。
    getHasTradeMark(tradeMarkArr.value.length > 1 ? pageNo.value : pageNo.value - 1)
  } else {
    ElMessage({
      type: 'error',
      message: '删除品牌失败'
    })
  }
}
</script>

<style lang="scss" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
