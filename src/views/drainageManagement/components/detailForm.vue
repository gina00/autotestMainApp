<template>
  <div style="padding:20px;">
    <el-descriptions class="margin-top" title="业务流量详情" :column="2" :size="size" border>
      <el-descriptions-item :span="2">
        <template slot="label">
          业务功能
        </template>
        <span>{{ paramData.functionCode }}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          下载日期
        </template>
        <span>{{ paramData.downloadDate }}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          应答时长（ms）
        </template>
        <span>{{ paramData.times }}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          请求时间
        </template>
        <span>{{ paramData.reqTime }}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          响应时间
        </template>
        <span>{{ paramData.respTime }}</span>
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template slot="label">
          生产URL
        </template>
        <span>{{ paramData.prodUrl }}</span>
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template slot="label">
          仿真URL
        </template>
        <span>{{ paramData.realUrl }}</span>
      </el-descriptions-item>
    </el-descriptions>

    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="12">
        <div style="font-weight:bold;margin-bottom:10px">请求报文：</div>
        <!-- <el-input
          v-model="reqString"
          style="margin-top:15px"
          type="textarea"
          placeholder="请输入应答报文模板"
          :rows="23"
        /> -->
        <xml-editor ref="xmlEditor1" :code="paramData.reqMessage" />

      </el-col>
      <el-col :span="12">
        <div style="font-weight:bold;margin-bottom:10px">响应报文：</div>
        <!-- <el-input
          v-model="paramData.respMessage"
          type="textarea"
          placeholder="请输入应答报文模板"
          :rows="23"
          style="margin-top:15px"
        /> -->
        <xml-editor ref="xmlEditor2" :code="paramData.respMessage" />
      </el-col>
    </el-row>
    <!-- <el-form
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
    </el-row> -->
  </div>
</template>

<script>
import { dict } from '@/api/drainage-test'
import xmlEditor from '@/views/drainageManagement/components/xmlEditor.vue'
export default {
  components: {
    xmlEditor
  },
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
      size: '',
      ruleTypeOptions: [],
      ruleOptions: []
      // rules: {
      //   taskDesc: [{ required: true, message: '请输入FPA功能点', trigger: 'blur' }]
      // }
    }
  },
  computed: {
    reqString: function() {
      var str = JSON.parse(this.paramData.reqMessage)
      return str
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
      // this.getDictData()
      // if (this.paramData.clickType == 'add') {
      //   this.formData = JSON.parse(JSON.stringify(this.paramData))
      // } else {
      //   this.$refs['form'].resetFields()
      //   this.formData = Object.assign({}, this.formData, this.paramData)
      // }
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
      debugger
      this.formData = Object.assign({}, this.formData, {})
    },
    confirm() {
      this.$refs.form.validate((valid, message) => {
        if (valid) {
          this.$emit('submitStatus', { status: 'success', row: this.formData })
          // this.axios
          //   .post('/asset-develop/modifyreport/function/update', this.formData)
          //   .then(response => {
          //     if (response.respResult == '1') {
          //       this.$message.success(response.respData)
          //     }
          //   })
          //   .finally(() => {
          //     this.$emit('submitStatus', { status: 'success', row: this.formData })
          //   })
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
.CodeMirror{
  height: 500px;
  font-size: 14px;
  line-height: 20px;
}
</style>
