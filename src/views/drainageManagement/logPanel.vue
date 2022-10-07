<template>
  <div>
    <el-card
      shadow="always"
      class="logPanel commonHeight"
      style="height:calc(100vh - 200px)"
    >
      <div slot="header" class="clearfix">
        <span>日志面板</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          icon="el-icon-close"
          title="关闭"
          @click="closeLogPanel"
        />
      </div>
      <div class="contentText">
        <span>{{ startNowTime +'&nbsp;' }}</span>
        <span>{{ fileName+'开始...' }}</span>
      </div>
      <div v-for="(item,index) in logList" :key="index" class="text item">
        <span>{{ item }}</span>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getLog } from '@/api/drainage-test'
export default {
// components: {
//     // xmlEditor
//   },
  props: {
    startNowTime: {
      type: String,
      required: true
    },
    fileName: {
      type: String,
      required: true
    },
    showlogPanel: {
      type: Boolean,
      required: true
    },
    queryLogType: {
      type: Number,
      required: true
    },
    startClick: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      logList: [],
      timeId: null,
      fileCount: 0,
      count: 0
    }
  },
  watch: {
    queryLogType() {
      if (this.queryLogType == null) {
        this.clearQueryLog()
      }
    },
    startClick() {
      debugger
      if (this.startClick > 1) {
        this.count = 0
        this.logList = []
        this.getLogList(this.queryLogType)
      }
    },
    count() {
      if (this.count == 10) {
        if (this.queryLogType == 1) {
          this.logList.push('流量提取完成 ,' + '共提取文件 ' + this.fileCount + ' 个')
          this.clearQueryLog()
        } else if (this.queryLogType == 2) {
          this.logList.push('流量解析完成 ,' + '共解析文件 ' + this.fileCount + ' 个')
          this.clearQueryLog()
        } else if (this.queryLogType == 3) {
          this.logList.push('流量清理完成 。')
          this.clearQueryLog()
        } else if (this.queryLogType == 4) {
          this.logList.push('流量脱敏处理完成 。')
          this.clearQueryLog()
        } else if (this.queryLogType == 5) {
          this.logList.push('数据表脱敏处理完成 。')
          this.clearQueryLog()
        } else if (this.queryLogType == 6) {
          this.logList.push('基准数据同步完成 。')
          this.clearQueryLog()
        } else if (this.queryLogType == 7) {
          this.logList.push('本次流量测试执行完成 。')
          this.clearQueryLog()
        } else if (this.queryLogType == 8) {
          this.logList.push('本次数据表流量复制执行完成 。')
          this.clearQueryLog()
        } else if (this.queryLogType == 9) {
          this.logList.push('本次流量报文复制执行完成 。')
          this.clearQueryLog()
        }
      }
    }
  },
  mounted() {
    if (this.showlogPanel) {
      this.count = 0
      this.getLogList(this.queryLogType)
    }
  },
  methods: {
    // queryLogCount() {
    //   for (let i = 0; i < this.count; i++) {
    //     if (this.logList.length == i) {
    //       if (this.queryLogType == 1) {
    //         this.logList.push('流量提取完成')
    //         this.clearQueryLog()
    //       }
    //     }
    //   }
    // },
    getLogList(type) {
      getLog(type).then(response => {
        var data = response.data
        this.logList.push(data.time + ' ' + data.logInformation)
        this.fileCount = data.fileCount
      })
        .finally(() => {
          this.count = this.count + 1
          this.setTimeoutFunc(type)
          this.$emit('watchLogCount', this.count)
        })
    },
    // 定时任务
    setTimeoutFunc(type) {
      const _this = this
      _this.timeId = setTimeout(() => {
        _this.getLogList(type)
      }, 1000)
    },
    // 清除定时器
    clearQueryLog() { // 清除定时器
      const _this = this
      clearInterval(_this.timeId)
      _this.timeId = null
    },
    closeLogPanel() {
      this.$emit('closeLogPanel')
      this.clearQueryLog()
      this.logList = []
    }
  }
}
</script>
<style lang='scss' scoped>
.logPanel{
  line-height: 23px;
  font-size: 14px;
}
</style>
