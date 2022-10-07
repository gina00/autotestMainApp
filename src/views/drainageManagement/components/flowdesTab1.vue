<template>
  <div>
    <div class="titleAndOperation">
      <span>报文规则列表</span>
      <div>
        <el-button
          type="primary"
          size="small"
          :disabled="btnClickDisabled"
          @click="startFlowExtract()"
        >
          报文脱敏
        </el-button>
      </div>

    </div>
    <el-table
      v-loading="loading"
      class="commonHeight"
      :data="tableData.slice((page.pageNum - 1) * page.pageSize, page.pageNum * page.pageSize)"
      border
      style="width: 100%"
      @select="selectFun"
      @select-all="selectAllFun"
    >
      <el-table-column type="selection" width="50" />
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column prop="ruleCode" label="规则编号" min-width="120" align="left" />
      <el-table-column prop="ruleName" label="规则名称" min-width="280" align="left" />
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
  </div>
</template>

<script>
import { desensitizationRuleList } from '@/api/drainage-test'

export default {
  components: {
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    activeName: {
      type: String,
      required: false
    },
    // eslint-disable-next-line vue/require-default-prop
    logCountDisabeled: {
      type: Boolean,
      required: false
    }
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
      selectDataArr: [],
      btnClickDisabled: false,
      startClick: 0
    }
  },
  watch: {
    activeName() {
      if (this.activeName == 'tab1') {
        this.getData()
      }
    },
    logCountDisabeled() {
      if (!this.logCountDisabeled) {
        this.btnClickDisabled = false
      } else {
        this.btnClickDisabled = true
      }
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true
      desensitizationRuleList().then(response => {
        this.tableData = response.data
        this.page.totals = response.total
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
    // 复选框多选及全选
    selectFun(row) {
      this.selectDataArr = row
    },
    // 复选框多选及全选
    selectAllFun(row) {
      this.selectDataArr = row
    },
    submitSelect(selectDataArr) {
      this.$emit('submitSelect', { status: 'success', rows: selectDataArr, startClick: this.startClick })
    },
    startFlowExtract() {
      this.startClick = this.startClick + 1
      this.submitSelect(this.selectDataArr)
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
    height: calc(100vh - 300px);
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
