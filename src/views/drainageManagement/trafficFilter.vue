<template>
  <div class="page">
    <el-row>
      <el-form ref="form" inline :model="formData">
        <el-form-item prop="ruleCode" label="业务/服务功能号">
          <el-input
            v-model="formData.functionCode"
            clearable
            maxlength="1024"
            type="text"
            placeholder="请输入业务/服务功能号"
          />
        </el-form-item>
        <el-form-item label="流量下载时间">
          <el-date-picker
            v-model="formData.downloadDate"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" @click="query">
            查询
          </el-button>
          <el-button size="small" @click="resetQuery"> 重置</el-button>
        </el-form-item>
        <!-- <el-form-item style="float:right;">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="clickShowDrawer('add', {})"
          >
            新增
          </el-button>
        </el-form-item> -->
      </el-form>
    </el-row>
    <el-table
      v-loading="loading"
      class="commonHeight"
      :data="tableData.slice((page.pageNum - 1) * page.pageSize, page.pageNum * page.pageSize)"
      border
      style="width: 100%"
    >
      <!-- <el-table-column type="selection" width="50" /> -->
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column prop="city" label="地市" min-width="180" align="center" />
      <el-table-column prop="functionCode" label="业务/服务功能号" min-width="180" align="center" />
      <el-table-column prop="serverType" label="业务(服务)类型" min-width="180" align="center">
        <template slot-scope="scope">
          {{ ruleOptionsMap.get(scope.row.serverType)?ruleOptionsMap.get(scope.row.serverType).label:'' }}
        </template>
      </el-table-column>
      <el-table-column prop="reqTime" label="请求时间" min-width="180" align="center">
        <!-- <template slot-scope="scope">
          {{ ruleOptionsMap.get(scope.row.rule).label }}
        </template> -->
      </el-table-column>
      <el-table-column prop="times" label="响应时长(ms)" min-width="180" align="center" />
      <el-table-column prop="downloadDate" label="流量下载日期" min-width="180" align="center" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-view"
            title="查看详情"
            @click="clickShowDrawer('showDetail',scope.row)"
          >
            <!-- 查看详情 -->
          </el-button>
          <!-- <el-button
            type="text"
            icon="el-icon-delete"
            title="删除"
            @click="remove(scope.row)"
          /> -->
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="float:right;margin-top:20px"
      :current-page="page.pageNum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="page.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totals"
      @size-change="handleSizeChange"
      @current-change="handleIndexChange"
    />
    <el-drawer
      ref="drawer"
      :title="drawerData.title"
      :visible.sync="drawerData.visible"
      direction="rtl"
      custom-class="demo-drawer"
      size="80%"
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
import { dict, trafficFilterList } from '@/api/drainage-test'
import detailForm from '@/views/drainageManagement/components/detailForm.vue'

export default {
  components: {
    detailForm
  },
  data() {
    return {
      loading: false,
      value1: '',
      componentId: '',
      formData: {
        functionCode: null,
        downloadDate: null
      },
      ruleOptions: [],
      ruleTypeOptions: [],
      tableData: [],
      drawerData: {
        visible: false,
        title: '',
        data: {}
      },
      page: { pageNum: 1, pageSize: 10, totals: 0 },
      selectDataArr: []
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
  mounted() {
    this.getDictData()
    this.query()
  },
  methods: {
    getDictData() {
      dict().then(response => {
        this.ruleOptions = response.data[3]
      })
    },
    query() {
      this.loading = true
      trafficFilterList().then(response => {
        this.tableData = response.data
        this.page.totals = response.total
      }).finally(() => {
        this.loading = false
      })
    },
    resetQuery() {},
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
    /**
     * 分页
     */
    handleIndexChange(val) {
      this.page.pageNum = val
      this.getData()
    },
    handleSizeChange(val) {
      this.page.pageSize = val
      this.getData()
    },
    submitStatus(val) {
      if (val.status == 'success') {
        // 点击确定修改后返回
        this.drawerData.visible = !this.drawerData.visible
        this.tableData.unshift(val.row)
        // this.clickDataMap.set(this.drawerData.clickCount, val.row)
        // this.query()
      } else {
        // // 点击取消
        this.drawerData.visible = !this.drawerData.visible
        const currentDrawer = this.$refs['currentDrawer']
        currentDrawer.initForm()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.page{
  padding: 20px;
}
</style>
