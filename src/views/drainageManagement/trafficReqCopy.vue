<template>
  <div class="page">
    <el-row :gutter="20">
      <el-col :span="span">
        <div class="titleAndOperation">
          <span>流量功能编号</span>
          <div>
            <el-checkbox v-model="checkedAll" style="margin-right:20px" @change="checkedChange">全选</el-checkbox>
            <el-button
              type="primary"
              size="small"
              :disabled="logCountDisabeled"
              @click="start()"
            >
              流量报文复制
            </el-button>
          </div>

        </div>
        <el-row :gutter="20" class="tab2ElRowClass">
          <el-col v-for="(item,index) in tableData" :key="index" :span="3">
            <el-checkbox v-model="item.checked">{{ item.flowTaskName }}</el-checkbox>
            <!-- <span>{{ item.flowTaskName }}</span> -->
          </el-col>
        </el-row>
        <el-form ref="form" :model="form" :rules="rules" label-width="120px" style="margin-top:20px">
          <el-form-item label="目标路径">
            <el-input v-model="form.targetUser" style="width:500px;" />
          </el-form-item>
        </el-form>
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
  </div>
</template>

<script>
import { dict } from '@/api/drainage-test'
import { cleanUpTab2List } from '@/api/drainage-test'
import logPanel from '@/views/drainageManagement/logPanel.vue'

export default {
  components: {
    logPanel
  },
  data() {
    return {
      loading: false,
      componentId: '',
      tableData: [],
      drawerData: {
        visible: false,
        title: '',
        data: {}
      },
      page: { pageNum: 1, pageSize: 10, totals: 0 },
      btnClickDisabled: false,
      startClick: 0,
      form: {
        targetUser: ''
      },
      targetUserList: [],
      rules: {
        targetUser: [
          { required: true, message: '请输入目标库', trigger: 'blur' }
        ]
      },
      span: 24,
      showlogPanel: false,
      queryLogType: null,
      logCountDisabeled: false,
      checkedAll: false
    }
  },
  mounted() {
    this.getData()
    this.getDictData()
  },
  methods: {
    getDictData() {
      dict().then(response => {
        this.targetUserList = response.data[7]
      })
    },
    getData() {
      this.loading = true
      cleanUpTab2List().then(response => {
        this.tableData = response.data
      }).finally(() => {
        this.loading = false
      })
    },
    submitStatus(val) {
      if (val.status == 'success') {
        // 点击确定修改后返回
        this.drawerData.visible = !this.drawerData.visible
        this.tableData.push(val.row)
        // this.clickDataMap.set(this.drawerData.clickCount, val.row)
        // this.query()
      } else {
        // // 点击取消
        this.drawerData.visible = !this.drawerData.visible
        const currentDrawer = this.$refs['currentDrawer']
        currentDrawer.initForm()
      }
    },
    submitSelect(selectDataArr) {
      this.$emit('submitSelect', { status: 'success', rows: selectDataArr, startClick: this.startClick })
    },
    start() {
      if (!this.form.targetUser) {
        this.$message.warning('请输入目标库!')
        return
      }
      this.startClick = this.startClick + 1
      this.queryLogType = 9
      this.showlogPanel = true
      this.startNowTime = this.$dayjs().format('HH:mm:ss')
      this.fileName = '流量报文复制 '
      this.span = 16
    },
    startFlowExtract() {
      this.startClick = this.startClick + 1
      this.submitSelect(this.tableData)
      this.loading = true
      cleanUpTab2List().then(response => {
        this.tableData.push(...response.data)
      }).finally(() => {
        this.loading = false
      })
    },
    watchLogCount(val) {
      if (val == 10) {
        this.logCountDisabeled = false
      } else {
        this.logCountDisabeled = true
      }
    },
    closeLogPanel(val) {
      this.queryLogType = null
      this.showlogPanel = false
      this.logCountDisabeled = false
      this.span = 24
    },
    checkedChange(val) {
      this.tableData.forEach(element => {
        if (val) {
          element.checked = true
        } else {
          element.checked = false
        }
      })
    }

  }
}
</script>

<style lang='scss' scoped>
 .titleAndOperation{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
  .tab2ElRowClass{
    overflow: auto;
    border-top: 1px solid #dfe6ec;
    border-left: 1px solid #dfe6ec;
    margin-left: 0 !important;
    margin-right: 0 !important;
    .el-col-3 {
      border-bottom: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      padding: 20px;
    }
  }

</style>
