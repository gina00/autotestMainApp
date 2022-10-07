<template>
  <div style="padding:20px;">
    <el-form
      ref="form"
      :model="formData"
      :rules="rules"
      label-width="110px"
      class="content"
    >
      <el-row :gutter="20">
        <el-col :span="span">
          <el-form-item label="流量配置类型">
            <div style="marign-bottom:10px;">
              <el-radio v-model="formData.extractRange" label="1">全流量配置</el-radio>
              <el-date-picker
                v-model="formData.allFlowDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabled="formData.extractRange!='1'"
              />
            </div>
          </el-form-item>
          <el-form-item label="">
            <div>
              <el-radio v-model="formData.extractRange" label="2" style="margin-right:45px;">指定流量</el-radio>
              <el-date-picker
                v-model="formData.someFlowDate"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :disabled="formData.extractRange!='2'"
              />
            </div>
          </el-form-item>
          <el-form-item label="">
            <div>
              <p>流量业务范围</p>
              <el-input
                v-model="formData.flowBussiness"
                type="textarea"
                placeholder="请输入流量业务范围"
                :rows="10"
                :disabled="formData.extractRange!='2'"
              />
              <p>备注：不同的业务功能号，以逗号隔开。</p>
            </div>
          </el-form-item>
          <el-form-item prop="sceneName" label="场景名称">
            <el-input
              v-model="formData.sceneName"
              clearable
              maxlength="1024"
              type="text"
              placeholder="请输入场景名称"
            />
          </el-form-item>
          <el-form-item prop="sceneName" label="场景简介">
            <el-input
              v-model="formData.sceneIntroduction"
              clearable
              maxlength="1024"
              type="textarea"
              :rows="5"
              placeholder="请输入场景简介"
            />
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              size="small"
              :disabled="logCountDisabeled"
              @click="showDialog()"
            >
              开始测试
            </el-button>
          </el-form-item>
        </el-col>
        <el-col v-if="showlogPanel" :span="24-span">
          <log-panel
            ref="logPanel"
            :start-now-time="startNowTime"
            :query-log-type="queryLogType"
            :showlog-panel="showlogPanel"
            :file-name="fileName"
            :start-click="startClick"
            @closeLogPanel="closeLogPanel"
            @watchLogCount="watchLogCount"
          />
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
import logPanel from '@/views/drainageManagement/logPanel.vue'
export default {
  components: {
    logPanel
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
        extractRange: '1',
        allFlowDate: '',
        someFlowDate: '',
        flowBussiness: null,
        sceneName: null,
        sceneIntroduction: null
      },
      ruleTypeOptions: [],
      ruleOptions: [],
      fileName: '',
      startNowTime: null,
      span: 24,
      showlogPanel: false,
      queryLogType: null,
      logCountDisabeled: false,
      startClick: 0,
      rules: {
        allFlowDate: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        sceneName: [{ required: true, message: '请输入场景名称', trigger: 'blur' }]
      }
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
        this.$set(this.formData, 'extractRange', '1')
      } else {
        // this.$refs['form'].resetFields()
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
    },
    showDialog() {
      if (this.formData.allFlowDate == '') {
        this.$message.warning('请选择日期')
        return
      }
      this.$emit('submitStatus', { status: 'showDialog' })
      this.startClick = this.startClick + 1
      this.span = 12
      this.startNowTime = this.$dayjs().format('HH:mm:ss')
      this.showlogPanel = true
      this.fileName = '场景流量测试'
      this.queryLogType = 7
    },
    watchLogCount(val) {
      if (val == 10) {
        this.logCountDisabeled = false
      } else {
        this.logCountDisabeled = true
      }
    },
    closeLogPanel() {
      this.$emit('submitStatus', { status: 'closeLogPanel' })
      this.startNowTime = null
      this.queryLogType = null
      this.showlogPanel = false
      this.logCountDisabeled = false
      this.span = 24
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
