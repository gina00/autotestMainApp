<template>
  <div style="padding:20px;">
    <el-form
      ref="form"
      :model="formData"
      label-width="110px"
      class="content"
    >
      <el-row>
        <el-col :span="24">
          <el-form-item label="流量任务名称" prop="taskDesc">
            <el-input
              v-model="formData.flowTaskName"
              clearable
              maxlength="1024"
              type="text"
              placeholder="请输入任务名称"
            />
          </el-form-item>
          <el-form-item label="任务简介" prop="taskDesc">
            <el-input
              v-model="formData.taskDesc"
              clearable
              maxlength="1024"
              type="textarea"
              :rows="6"
              placeholder="请输入任务简介"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="目标主机">
            <el-input
              v-model="formData.targetHost"
              clearable
              maxlength="1024"
              type="text"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="登录用户">
            <el-input
              v-model="formData.loginUser"
              clearable
              maxlength="1024"
              type="text"
              placeholder="请输入用户名"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="登录密码">
            <el-input
              v-model="formData.loginPassWord"
              clearable
              maxlength="1024"
              type="password"
              placeholder="请输入登录密码"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="提取路径">
            <el-input
              v-model="formData.extractPath"
              clearable
              maxlength="1024"
              type="textarea"
              :rows="6"
              placeholder="请输入内容"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="提取范围">
            <el-radio-group v-model="formData.extractRange" class="radioPanel" @change="changeRadio">
              <el-radio label="1">全部提取</el-radio>
              <el-radio label="2">指定文件类型</el-radio>
            </el-radio-group>
            <el-input
              v-model="formData.fileType"
              clearable
              maxlength="1024"
              type="text"
              placeholder="*.zip"
              :disabled="formData.extractRange=='1'"
            />
            <span>备注：不同的文件类型，以逗号隔开。</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-row class="btnClass" style="padding: 10px 0 20px 0;">
      <el-button @click="cancel()">取消</el-button>
      <el-button type="primary" @click="confirm()">确定</el-button>
    </el-row>
  </div>
</template>

<script>
import { create, update } from '@/api/drainage-test'
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    paramData: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      formData: {
        flowTaskName: '',
        taskDesc: '',
        targetHost: '',
        loginUser: '',
        loginPassWord: '',
        extractPath: '',
        extractRange: '2',
        fileType: ''
      }
      // rules: {
      //   taskDesc: [{ required: true, message: '请输入FPA功能点', trigger: 'blur' }]
      // }
    }
  },
  watch: {
    paramData() {
      this.initForm()
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    initForm() {
      if (this.paramData.clickType == 'add') {
        this.formData = JSON.parse(JSON.stringify(this.paramData))
        this.$set(this.formData, 'extractRange', '2')
      } else {
        this.$refs['form'].resetFields()
        this.formData = Object.assign({}, this.formData, this.paramData)
      }
    },
    open() {
      this.initForm()
    },
    cancel() {
      this.$emit('submitStatus', { status: 'cancel', row: {}})
    },
    close() {
      debugger
      this.formData = Object.assign({}, this.formData, {})
    },
    confirm() {
      this.$refs.form.validate((valid, message) => {
        if (valid) {
          if (this.paramData.clickType == 'add') {
            create().then(response => {
              if (response.code === 20000) {
                this.$message.success('新增成功')
                this.$emit('submitStatus', { status: 'success', row: this.formData })
              }
            })
          } else {
            update().then(response => {
              if (response.code === 20000) {
                this.$message.success('编辑成功')
                this.$emit('submitStatus', { status: 'success', row: this.formData })
              }
            })
          }
        } else {
          this.$message.error('必填项不能为空')
          return false
        }
      })
    },
    changeRadio(val) {
      this.formData.extractRange = val
    }
  }
}
</script>

<style lang='scss'>
.btnClass {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    background: #fff;
  }
  .radioPanel{
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    .el-radio{
      margin-top: 5px;
    }
  }

</style>
