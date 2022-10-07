<template>
  <div>
    <el-container>
      <el-main>
        <div style="padding-top:15px;">
          <el-form
            ref="taskEmailForm"
            :model="taskEmailForm"
            :rules="taskEmailFormRules"
            label-width="100px"
          >
            <el-row>
              <el-col :span="24">
                <el-form-item label="收件人" prop="sendTo">
                  <el-input
                    v-model.trim="taskEmailForm.sendTo"
                    clearable
                    type="textarea"
                    maxlength="1024"
                    style="width:60%"
                  />
                  <el-button
                    type="primary"
                    size="mini"
                    :loading="sendLoading"
                    style="margin-left:15px;"
                    @click="getSendTo"
                  >
                    配置收件人</el-button>
                  <span class="text-danger" style="font-size: 12px; padding-left:15px;">
                    多个邮箱地址使用;隔开
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="24">
                <el-form-item label="抄送地址" prop="ccTo">
                  <el-input
                    v-model="taskEmailForm.ccTo"
                    clearable
                    type="textarea"
                    maxlength="1024"
                    style="width:60%"
                  />
                  <el-button
                    type="primary"
                    size="mini"
                    :loading="ccLoading"
                    style="margin-left:15px;"
                    @click="getCcTo"
                  >
                    配置抄送地址</el-button>
                  <span class="text-danger" style="font-size: 12px; padding-left:15px;">
                    多个邮箱地址使用;隔开
                  </span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <!-- v-if="permission['/autotest/subsystemMgr/saveTaskEmail']" -->
          <div slot="footer" class="dialog-footer" style="float:right;padding-top:10px;">
            <el-button
              type="primary"
              size="small"
              :loading="loading"
              @click="saveTaskEmail('taskEmailForm')"
            >
              保存</el-button>
          </div>
        </div>
      </el-main>
    </el-container>

    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="800px"
      border
      @close="clearForm"
    >
      <div style="margin-bottom:15px">
        <el-input
          v-model="employeeName"
          placeholder="用户名"
          clearable
          style="width:35%"
        />
        <el-button type="primary" style="margin-left:15px;" @click="pageQueryEp(1)">搜索</el-button>
      </div>

      <el-table ref="employeeTb" :data="employeeData" :loading="loading2" size="mini" border>
        <el-table-column type="selection" width="55" />
        <el-table-column
          prop="number"
          type="index"
          label="序号"
          width="60"
          align="center"
        />
        <el-table-column prop="name" label="用户名" min-width="200" show-overflow-tooltip />
        <el-table-column prop="email" label="内网邮箱" min-width="200" show-overflow-tooltip />
      </el-table>

      <div class="block" style="text-align: center">
        <span class="demonstration" />
        <el-pagination
          :current-page="pageIndex"
          :page-sizes="[10, 20, 50, 100]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
          @size-change="dealPageSizeChange"
          @current-change="dealPageIndexChange"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeEpDialog">取 消</el-button>
        <el-button type="primary" @click="chooseEp">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { mapState } from 'vuex'
import { update, getEmailConfigByTaskId } from '@/api/drainage-test'
export default {
  props: {
    // eslint-disable-next-line vue/require-default-prop
    taskId: String
  },
  data() {
    return {
      currentTaskId: null,
      taskEmailForm: {
        sendTo: '',
        ccTo: ''
      },

      taskEmailFormRules: {
        sendTo: [{ required: true, message: '请输入收件人地址', trigger: 'blur' }]
      },
      loading: false,
      sendLoading: false,
      ccLoading: false,
      dialogTitle: '用户信息',
      dialogVisible: false,
      employeeData: [],
      pageIndex: 1,
      pageSize: 10,
      totals: 0,
      loading2: false,
      flag: null,
      employeeName: ''
    }
  },
  computed: {
    // ...mapState(['userInfo', 'permission'])
  },

  watch: {
    taskId: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal != null && newVal != '') {
          this.currentTaskId = newVal
          this.taskEmailForm = {}
          this.getData()
        }
      }
    }
  },
  methods: {
    clearForm() {
      // this.taskEmailForm = {}
      this.employeeName = ''
    },
    saveTaskEmail(formName) {
      var _ownObj = this
      _ownObj.$refs[formName].validate(valid => {
        if (valid) {
          // 验证邮箱地址合法性
          var reg = /^([A-Za-z0-9_\-.\u4e00-\u9fa5])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,8})$/
          var sendAddress = _ownObj.taskEmailForm.sendTo
          var ccAddress = _ownObj.taskEmailForm.ccTo
          if (sendAddress != null && sendAddress != '') {
            var sendAddrs = sendAddress.split(';')
            for (var index = 0; index < sendAddrs.length; index++) {
              if (sendAddrs[index] != '' && !reg.test(sendAddrs[index].trim())) {
                _ownObj.$message({
                  showClose: true,
                  message: sendAddrs[index] + '地址不合法',
                  type: 'warning'
                })
                return
              }
            }
          }
          if (ccAddress != null && ccAddress != '') {
            var ccAddrs = ccAddress.split(';')
            for (var index2 = 0; index2 < ccAddrs.length; index2++) {
              if (ccAddrs[index2] != '' && !reg.test(ccAddrs[index2].trim())) {
                _ownObj.$message({
                  showClose: true,
                  message: ccAddrs[index2] + '地址不合法',
                  type: 'warning'
                })
                return
              }
            }
          }
          _ownObj.loading = true
          // var $url = '/autotest-task/taskEmail/saveTaskEmailConfig'
          _ownObj.taskEmailForm.taskId = _ownObj.currentTaskId
          update().then(response => {
            if (response.code == 20000) {
              _ownObj.$message.success('保存成功')
              _ownObj.getEmailConfig()
            }
          })
            .finally(() => {
              _ownObj.loading = false
            })
        }
      })
    },
    getSendTo() {
      var _ownObj = this
      _ownObj.dialogVisible = true
      _ownObj.flag = 'send'
      _ownObj.pageQueryEp(null)
    },
    getCcTo() {
      var _ownObj = this
      _ownObj.dialogVisible = true
      _ownObj.flag = 'cc'
      _ownObj.pageQueryEp(null)
    },
    dealPageSizeChange(v_pageSize) {
      var _ownObj = this
      _ownObj.pageSize = v_pageSize
      _ownObj.pageQueryEp(1)
    },
    dealPageIndexChange(v_pageIndex) {
      var _ownObj = this
      if (_ownObj.totals != 0) {
        _ownObj.pageIndex = v_pageIndex
        _ownObj.pageQueryEp(v_pageIndex)
      }
    },
    pageQueryEp(v_pageIndex) {
      var _ownObj = this
      var $url = '/autotest-task/task/queryEmployeeByAppId'
      _ownObj.loading2 = true
      if (v_pageIndex != null && v_pageIndex != '') {
        _ownObj.pageIndex = v_pageIndex
      }
      var queryObj = {}
      queryObj.empNameLike = _ownObj.employeeName
      queryObj.currentPage = _ownObj.pageIndex
      queryObj.pageSize = _ownObj.pageSize
      _ownObj.axios
        .post($url, queryObj)
        .then(response => {
          if (response.respResult == '1') {
            var data = response.respData
            _ownObj.employeeData = data.records
            _ownObj.totals = data.total
          }
        })
        .finally(() => {
          _ownObj.loading2 = false
        })
    },
    closeEpDialog() {
      this.dialogVisible = false
      this.clearForm()
    },
    chooseEp() {
      var _ownObj = this
      if (
        _ownObj.$refs.employeeTb.selection === null ||
        _ownObj.$refs.employeeTb.selection.length < 1
      ) {
        _ownObj.$message({
          showClose: true,
          message: '请选择用户',
          type: 'warning'
        })
        return
      }
      var data = _ownObj.$refs.employeeTb.selection
      var emailStr = ''
      for (var index = 0; index < data.length; index++) {
        if (data[index].email != null && data[index].email != '') {
          emailStr += data[index].email + ';'
        }
      }
      if (_ownObj.flag == 'send') {
        emailStr = _ownObj.taskEmailForm.sendTo + emailStr
        _ownObj.$set(_ownObj.taskEmailForm, 'sendTo', emailStr)
      } else {
        emailStr = _ownObj.taskEmailForm.ccTo + emailStr
        _ownObj.$set(_ownObj.taskEmailForm, 'ccTo', emailStr)
      }
      _ownObj.dialogVisible = false
    },
    getData() {
      getEmailConfigByTaskId().then(resp => {
        this.taskEmailForm = resp.data[0]
      })
    },
    getEmailConfig() {
      var _ownObj = this
      var $url = '/autotest-task/taskEmail/getEmailConfigByTaskId'
      _ownObj.axios.post($url, { taskId: _ownObj.currentTaskId }).then(response => {
        if (response.respResult == '1') {
          var data = response.respData
          if (data != null && data.length > 0) {
            _ownObj.taskEmailForm = data[0]
          } else {
            _ownObj.taskEmailForm = { sendTo: '', ccTo: '' }
          }
        }
      })
    }
  }
}
</script>
