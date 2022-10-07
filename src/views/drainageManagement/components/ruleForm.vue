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
          <el-form-item label="规则类型" prop="rule">
            <el-select
              v-model="formData.ruleType"
              placeholder="请选择脱敏规则"
            >
              <el-option
                v-for="item in ruleTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="原始值" prop="origin">
            <el-input
              v-model="formData.origin"
              clearable
              maxlength="1024"
              type="textarea"
              :rows="6"
              placeholder="请输入原始值"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="脱敏规则">
            <el-select
              v-model="formData.rule"
              placeholder="请选择脱敏规则"
            >
              <el-option
                v-for="item in ruleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="新值">
            <el-input
              v-model="formData.newVal"
              clearable
              maxlength="1024"
              type="text"
              placeholder="请输入新值"
            />
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
import { dict, create, update } from '@/api/drainage-test'
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
        ruleType: 1,
        origin: null,
        rule: 1,
        newVal: null
      },
      ruleTypeOptions: [],
      ruleOptions: []
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
      this.getDictData()
      if (this.paramData.clickType == 'add') {
        this.formData = JSON.parse(JSON.stringify(this.paramData))
        this.formData.ruleType = 1
        this.formData.rule = 1
      } else {
        this.$refs['form'].resetFields()
        this.formData = Object.assign({}, this.formData, this.paramData)
      }
    },
    getDictData() {
      dict().then(response => {
        this.ruleOptions = response.data[1]
        this.ruleTypeOptions = response.data[2]
      })
    },
    cancel() {
      this.$emit('submitStatus', { status: 'cancel', row: {}})
    },
    close() {
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
