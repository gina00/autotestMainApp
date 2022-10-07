<template>
  <div>
    <div class="titleAndOperation">
      <span>流量提取任务列表</span>
      <div>
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="clickShowDrawer('add', {})"
        >
          新增
        </el-button>
        <el-button
          size="small"
          :disabled="btnClickDisabled"
          @click="startFlowExtract()"
        >
          开始提取流量
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
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column label="序号" type="index" width="50" />
      <el-table-column prop="flowTaskName" label="任务名称" min-width="180" align="center" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            title="编辑"
            @click="clickShowDrawer('edit',scope.row)"
          />
          <el-button
            type="text"
            icon="el-icon-delete"
            title="删除"
            @click="removeData(scope.row.$index,tableData)"
          />
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
import { flowExtractTaskList, remove } from '@/api/drainage-test'
import taskForm from '@/views/drainageManagement/components/taskForm.vue'

export default {
  components: {
    taskForm
  },
  props: {
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
      flowExtractTaskList().then(response => {
        this.tableData = response.data.list
        this.page.totals = response.total
      }).finally(() => {
        this.loading = false
      })
    },
    // 根据不同的点击操作显示不同的弹窗
    clickShowDrawer(clickType, data) {
      this.drawerData.visible = !this.drawerData.visible
      if (clickType == 'add') {
        this.componentId = 'taskForm'
        this.drawerData.title = '新增流量任务'
        this.drawerData.data = {}
        this.drawerData.data.clickType = 'add'
      } else if (clickType == 'edit') {
        this.componentId = 'taskForm'
        this.drawerData.title = '编辑流量任务'
        this.drawerData.data = data
        this.drawerData.data.clickType = 'edit'
      }
    },
    // openDrawer() {
    //   var _this = this
    //   const currentDrawer = _this.$refs.currentDrawer
    //   currentDrawer.open()
    // },
    // closeDrawer() {
    //   const currentDrawer = this.$refs['currentDrawer']
    //   currentDrawer.close()
    // },
    submitStatus(val) {
      if (val.status == 'success') {
        // 点击确定修改后返回
        this.drawerData.visible = !this.drawerData.visible
        if (this.drawerData.data.clickType == 'add') {
          this.tableData.unshift(val.row)
        }
        // this.clickDataMap.set(this.drawerData.clickCount, val.row)
        // this.query()
      } else {
        // // 点击取消
        this.drawerData.visible = !this.drawerData.visible
        const currentDrawer = this.$refs['currentDrawer']
        currentDrawer.initForm()
      }
    },
    removeData(index, tableData) {
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove().then(response => {
          if (response.code === 20000) {
            this.$message.success('删除成功')
            tableData.splice(index, 1)
          }
        })
      })
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
      this.submitSelect(this.selectDataArr, { type: 1 })
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
</style>
