<template>
  <div class="page">
    <!-- <p style="margin-bottom:10px;">比对规则配置信息</p> -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card shadow="always">
          <p>业务功能列表</p>
          <el-table
            v-loading="loading1"
            class="commonHeight"
            :data="bussinessTableData.slice((page1.pageNum - 1) * page1.pageSize, page1.pageNum * page1.pageSize)"
            border
            style="width: 100%;height:calc(100vh - 360px)"
          >
            <el-table-column label="序号" type="index" width="50" align="center" />
            <el-table-column prop="functionCode" label="业务功能" min-width="180" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="showDetail(scope.row.functionCode)">{{ scope.row.functionCode }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="paginationLayout">
            <el-pagination
              style="float:right;margin-top:20px"
              :current-page="page1.pageNum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="page1.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page1.totals"
              @size-change="handleSizeChange1"
              @current-change="handleIndexChange1"
            />
          </div>

        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="always">
          <p>服务功能列表</p>
          <el-table
            v-loading="loading2"
            class="commonHeight"
            :data="severTableData.slice((page2.pageNum - 1) * page2.pageSize, page2.pageNum * page2.pageSize)"
            border
            style="width: 100%;height:calc(100vh - 360px)"
          >
            <el-table-column label="序号" type="index" width="50" align="center" />
            <el-table-column prop="functionCode" label="业务功能" min-width="180" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="text" @click="showDetail(scope.row.functionCode)">{{ scope.row.functionCode }}</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="paginationLayout">
            <el-pagination
              style="float:right;margin-top:20px"
              :current-page="page2.pageNum"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="page2.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="page2.totals"
              @size-change="handleSizeChange2"
              @current-change="handleIndexChange2"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
    <el-drawer
      ref="drawer"
      :title="drawerData.title"
      :visible.sync="drawerData.visible"
      direction="rtl"
      custom-class="demo-drawer"
      size="60%"
    >
      <component
        :is="componentId"
        ref="currentDrawer"
        :param-data="drawerData.data"
        @submitStatus="submitStatus"
      />
    </el-drawer>

  </div>
</template>

<script>
import { bussinessTableData, severTableData, getCompareRulesInfor } from '@/api/drainage-test'
import compareRulesDetail from '@/views/drainageTest/components/compareRulesDetail.vue'
export default {
  components: {
    compareRulesDetail
  },
  data() {
    return {
      loading1: false,
      loading2: false,
      bussinessTableData: [],
      severTableData: [],
      page1: { pageNum: 1, pageSize: 10, totals: 0 },
      page2: { pageNum: 1, pageSize: 10, totals: 0 },
      selectDataArr1: [],
      selectDataArr2: [],
      componentId: '',
      drawerData: {
        visible: false,
        title: '',
        data: {}
      }
    }
  },
  mounted() {
    this.getData()
    this.getCompareRulesList2()
  },
  methods: {
    getData() {
      this.loading1 = true
      bussinessTableData().then(response => {
        this.page1.totals = response.total
        this.bussinessTableData = response.data
      }).finally(() => {
        this.loading1 = false
      })
    },
    getCompareRulesList2() {
      this.loading2 = true
      var req = {
        page: this.page2.pageNum,
        limit: this.page2.pageSize
      }
      severTableData(req).then(response => {
        this.page2.totals = response.total
        this.severTableData = response.data
      }).finally(() => {
        this.loading2 = false
      })
    },
    // 根据不同的点击操作显示不同的弹窗
    clickShowDrawer(clickType, data) {
      this.drawerData.visible = !this.drawerData.visible
      if (clickType == 'showDetail') {
        this.componentId = 'detailForm'
        this.drawerData.title = '查看详情'
        this.drawerData.data = data
        this.drawerData.data.clickType = 'showDetail'
      }
    },
    showDetail(functionCode) {
      getCompareRulesInfor().then(response => {
        window.console.log(response.data)
        var itemData = response.data.filter(item => item.functionCode == functionCode)
        this.drawerData.visible = !this.drawerData.visible
        this.componentId = 'compareRulesDetail'
        this.drawerData.title = '查看详情'
        this.drawerData.data = itemData
        this.drawerData.data.clickType = 'showDetail'
        // this.page1.totals = response.total
        // this.bussinessTableData = response.data
      }).finally(() => {
        // this.loading1 = false
      })
    },
    submitStatus() {},
    /**
     * 分页
     */
    handleIndexChange1(val) {
      this.page1.pageNum = val
      this.getData()
    },
    handleSizeChange1(val) {
      this.page1.pageSize = val
      this.getData()
    },
    handleIndexChange2(val) {
      this.page2.pageNum = val
      this.getCompareRulesList2()
    },
    handleSizeChange2(val) {
      this.page2.pageSize = val
      this.getCompareRulesList2()
    }
  }
}
</script>

<style>

</style>
