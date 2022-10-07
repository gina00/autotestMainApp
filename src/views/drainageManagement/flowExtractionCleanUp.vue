<template>
  <div class="page">

    <el-row :gutter="20">
      <el-col :span="span">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="流量提取" name="tab1">
            <cleanUpTab :log-count-disabeled="logCountDisabeled" @submitSelect="submitSelect" />
          </el-tab-pane>
          <el-tab-pane label="流量解析" name="tab2">
            <cleanUpTab2 :log-count-disabeled="logCountDisabeled" @submitSelect="submitSelect" />
          </el-tab-pane>
          <el-tab-pane label="流量清理" name="tab3">
            <cleanUpTab3 @submitSelect="submitSelect" />
          </el-tab-pane>
        </el-tabs>
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
import cleanUpTab from '@/views/drainageManagement/components/cleanUpTab.vue'
import cleanUpTab2 from '@/views/drainageManagement/components/cleanUpTab2.vue'
import cleanUpTab3 from '@/views/drainageManagement/components/cleanUpTab3.vue'
import logPanel from '@/views/drainageManagement/logPanel.vue'
export default {
  components: {
    cleanUpTab,
    cleanUpTab2,
    cleanUpTab3,
    logPanel
  },
  data() {
    return {
      activeName: 'tab1',
      loading: false,
      tableData: [{
        name: '流量提取任务20220210',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        name: '流量提取任务20220208',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        name: '流量提取任务20220220',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        name: '流量提取任务20220215',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      fileName: '',
      startNowTime: null,
      span: 24,
      showlogPanel: false,
      queryLogType: null,
      logCountDisabeled: false,
      startClick: 0

    }
  },
  mounted() {
  },
  methods: {

    submitSelect(val) {
      if (val.status == 'success') {
        if (val.rows.length == 0) {
          this.$message.warning('请至少选择一条数据')
          return
        }
        this.showlogPanel = true
        this.span = 16
        this.startNowTime = this.$dayjs().format('HH:mm:ss')
      }
      if (val.rows) {
        if (this.activeName == 'tab1') {
          this.fileName = val.rows[0].flowTaskName
          this.startClick = val.startClick
          this.queryLogType = 1
        } else if (this.activeName == 'tab2') {
          this.fileName = '解析流量'
          this.startClick = val.startClick
          this.queryLogType = 2
        } else {
          this.fileName = '流量清理'
          this.startClick = val.startClick
          this.queryLogType = 3
        }
      }
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
    handleClick(tab) {
      if (this.$refs.logPanel) {
        this.$refs.logPanel.clearQueryLog()
      }
      this.closeLogPanel()
    }
  }

}
</script>

