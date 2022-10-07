<template>
  <div class="page">

    <el-row :gutter="20">
      <el-col :span="span">
        <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
          <el-tab-pane label="流量报文脱敏" name="tab1">
            <flowdesTab1 :log-count-disabeled="logCountDisabeled" :active-name="activeName" @submitSelect="submitSelect" />
          </el-tab-pane>
          <el-tab-pane label="数据表脱敏" name="tab2">
            <flowdesTab2 :log-count-disabeled="logCountDisabeled" :active-name="activeName" @submitSelect="submitSelect" />
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
import flowdesTab1 from '@/views/drainageManagement/components/flowdesTab1.vue'
import flowdesTab2 from '@/views/drainageManagement/components/flowdesTab2.vue'
import logPanel from '@/views/drainageManagement/logPanel.vue'
export default {
  components: {
    flowdesTab1,
    flowdesTab2,
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
  methods: {
    submitSelect(val) {
      if (val.status == 'success') {
        this.showlogPanel = true
        this.span = 16
        this.startNowTime = this.$dayjs().format('HH:mm:ss')
      }
      if (val.rows) {
        if (this.activeName == 'tab1') {
          this.fileName = '脱敏处理'
          this.startClick = val.startClick
          this.queryLogType = 4
        } else if (this.activeName == 'tab2') {
          this.fileName = '脱敏处理'
          this.startClick = val.startClick
          this.queryLogType = 5
        } else {
          this.fileName = '流量清理'
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
    handleClick() {
      if (this.$refs.logPanel) {
        this.$refs.logPanel.clearQueryLog()
      }
      this.closeLogPanel()
    }
  }

}
</script>

<style lang='scss' scoped>
.page{
  padding: 20px;
}
.logPanel{

  line-height: 23px;
  font-size: 14px;
}
</style>
