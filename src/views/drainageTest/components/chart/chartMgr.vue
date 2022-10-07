<template>
  <div
    class="commonHeight"
    style="width: 100%;height:calc(100vh - 200px)"
  >
    <el-form ref="form" v-model="formData" :inline="true">
      <el-form-item label="业务/服务名称" prop="bussinessName">
        <el-input
          v-model.trim="formData.bussinessName"
          placeholder="请输入业务/服务名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="接口名称">
        <el-input
          v-model.trim="formData.interfaceName"
          placeholder="请输入接口名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="接口ID">
        <el-input
          v-model.trim="formData.interfaceId"
          placeholder="请输入接口ID"
          clearable
        />
      </el-form-item>
      <el-form-item label="时间范围">
        <el-date-picker
          v-model="formData.intervalTime"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          clearable
        />
      </el-form-item>
      <el-form-item style="float:right">
        <el-button type="primary" icon="el-icon-search" @click="query">
          查询
        </el-button>
        <el-button icon="el-icon-refresh" @click="resetQuery">
          重置
        </el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="taskTable"
      v-loading="tableLoading"
      :data="taskTableData.slice((page.pageNum - 1) * page.pageSize, page.pageNum * page.pageSize)"
      size="mini"
      border
      highlight-current-row
    >
      <el-table-column type="selection" width="45" />
      <el-table-column type="index" label="#" width="50" align="center" />
      <el-table-column prop="bussinessName" label="业务/服务名称" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="showChart(scope.row.bussinessName)">{{ scope.row.bussinessName }}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="interfaceId" label="接口id" align="center" min-width="120" />
      <el-table-column prop="type" label="类型" align="center" min-width="60">
        <template slot-scope="scope">
          {{ ruleOptionsMap.get(scope.row.type)?ruleOptionsMap.get(scope.row.type).label:'' }}
        </template>
      </el-table-column>
      <el-table-column prop="maxReqTime" label="最大响应时间(ms)" align="center" min-width="100" />
      <el-table-column prop="averageRespTime" label="平均响应时间(ms)" align="center" min-width="100" />
      <el-table-column prop="averageRespTimeExperience" label="平均响应时间经验值(%)" align="center" min-width="120" />
      <el-table-column prop="businessSuccess" label="业务成功率(%)" align="center" min-width="100" />
      <el-table-column prop="businessSuccessExperience" label="业务成功率经验值(%)" align="center" min-width="120" />
      <el-table-column prop="businessConsistentRate" label="业务一致率(%)" align="center" min-width="100" />
      <el-table-column prop="businessConsistentRateExperience" label="业务一致率经验值(%)" align="center" min-width="100" />
      <!-- <el-table-column label="操作" align="center" min-width="130">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-zoom-in"
            type="text"
            title="查看详情"
            @click="showTaskScene('showTaskSceneDetail',scope.row)"
          >查看详情</el-button>
          <el-button
            v-if="scope._self.isAdmin == 0 && scope.row.endTime != null"
            size="mini"
            icon="el-icon-delete"
            type="text"
            title="删除"
            @click="deleteReport(scope.row)"
          >删除</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <div class="paginationLayout">
      <el-pagination
        style="float:right;margin-top:20px"
        :current-page="page.pageNum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="page.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totals"
        @size-change="handleSizeChange"
        @current-change="handleIndexChange"
      />
    </div>
    <div class="outsideCardPanel">
      <el-card v-for="item in cardList" :key="item.dictKey" class="cardPanel">
        <!-- <span>{{ item.cardTitle }}</span> -->
        <chart v-loading="lineLoading" :data="item" style="width:100%" />
      </el-card>
    </div>
  </div>
</template>

<script>
import { dict, queryStatisticalData, queryLineRealTime } from '@/api/drainage-test'
import chart from '@/views/drainageTest/components/chart/chart.vue'
export default {
  components: {
    chart
  },
  data() {
    return {
      tableLoading: false,
      lineLoading: false,
      formData: {
        bussinessName: '',
        interfaceName: '',
        interfaceId: '',
        intervalTime: ''
      },
      taskTableData: [],
      ruleOptions: [],
      page: { pageNum: 1, pageSize: 5, totals: 0 },
      cardList: [],
      cardListMapObj: new Map(),
      timeId: null
    }
  },
  computed: {
    ruleOptionsMap: function() {
      const objMap = new Map()
      this.ruleOptions.forEach(element => {
        objMap.set(element.value, element)
      })
      return objMap
    }
    // ruleTypeOptionsMap: function() {
    //   const objMap = new Map()
    //   this.ruleTypeOptions.forEach(element => {
    //     objMap.set(element.value, element)
    //   })
    //   return objMap
    // }
  },
  destroyed() {
    // 清除定时器
    const _this = this
    clearInterval(_this.timeId)
    _this.timeId = null
  },
  mounted() {
    this.getDictData()
    this.query()
  },
  methods: {
    getDictData() {
      dict().then(response => {
        this.ruleOptions = response.data[6]
      })
    },
    query() {
      queryStatisticalData().then(response => {
        this.taskTableData = response.data
        this.page.totals = response.total
      })
    },

    showChart(bussinessName) {
      // 清除定时器
      const _this = this
      clearInterval(_this.timeId)
      _this.timeId = null
      this.queryLineTime(bussinessName)
    },
    // 定时任务
    setTimeoutFunc() {
      debugger
      const _this = this
      _this.timeId = setTimeout(() => {
        _this.queryLineTime()
        // _this.judgeProcess()
        // if (!_this.judgeProcesStatus) {
        //   _this.queryLineRealTime()
        // }
      }, 3000)
    },
    // 查询服务器实时数据
    queryLineTime(bussinessName) {
      this.lineLoading = true
      queryLineRealTime()
        .then(response => {
          var data = response.data
          this.cardListMapObj = new Map()
          // this.judgeProcesStatus = data.end
          // var data = this.respData
          for (const key in data) {
            if (
              (data[key] == 'meanResTimeLine' && data[key] != null) ||
                  (data[key] == 'throughputLine' && data[key] != null)
            ) {
              if (data[key].series) {
                data[key].series.forEach(e => {
                  e.smooth = true
                })
              }
              // data[key].legendData[0] = bussinessName
            }
            // this.targetCardList.map(item => {
            //   if (item.id == key) {
            //     item.value = data[key]
            //   }
            // })
            this.cardListMapObj.set(key, data[key])
          }
          this.cardList = [...this.cardListMapObj.values()]

          // if (response.respResult === '1') {
          //   // cardList渲染折线图卡片
          //   var data = response.respData
          //   this.cardListMapObj = new Map()
          //   this.formData.metricList.forEach(item => {
          //     var mapKey = item
          //     var itemValue = data[mapKey]
          //     if (itemValue.series != null) {
          //       itemValue.series.forEach(e => {
          //         e.smooth = true
          //       })
          //     }
          //     this.cardListMapObj.set(mapKey, itemValue)
          //   })

          //   this.cardList = [...this.cardListMapObj.values()]
          // }
        })
        .finally(() => {
          this.lineLoading = false
          // 前端定时器
          this.setTimeoutFunc()
        })
    },
    resetQuery() {},
    /**
     * 分页
     */
    handleIndexChange(val) {
      this.page.pageNum = val
      this.query()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.query()
    }
  }

}
</script>

<style lang="scss" scoped>
.outsideCardPanel {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .cardPanel {
    width: calc((100% - 24px) / 2);
    margin-right: 0px;
    margin-bottom: 20px;
    flex: none;
  }
  /* 去除每行尾的多余边距 */
  .cardPanel:nth-child(2n) {
    margin-right: 0;
  }
}
</style>
