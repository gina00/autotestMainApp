<template>
  <div>
    <el-form :inline="true" :model="taskForm" class="demo-form-inline">
      <el-form-item label="任务名称">
        <el-input
          v-model.trim="taskForm.taskName"
          placeholder="请输入任务名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="taskForm.intervalTime"
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
      class="commonHeight"
      :data="taskTableData.slice((page.pageNum - 1) * page.pageSize, page.pageNum * page.pageSize)"
      size="mini"
      border
      highlight-current-row
      style="width: 100%;height:calc(100vh - 360px)"
    >
      <el-table-column type="selection" width="45" />
      <el-table-column type="index" label="#" width="50" align="center" />
      <el-table-column prop="taskName" label="任务名称" align="center" min-width="180" />
      <!-- <el-table-column prop="taskTypeValue" label="任务类型" align="center">
                  </el-table-column> -->
      <el-table-column prop="startTime" label="开始时间" align="center" min-width="180" />
      <el-table-column label="结束时间" align="center" width="180">
        <template slot-scope="{ row }">
          <template v-if="row.norunCount < 1 || row.stopCount > 0">
            {{ row.endTime }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="totalCount" label="总场景数" align="center" min-width="100" />
      <el-table-column prop="successCount" label="成功场景数" align="center" min-width="100" />
      <el-table-column prop="failedCount" label="失败场景数" align="center" min-width="100" />
      <el-table-column prop="runningCount" label="正在执行场景数" align="center" min-width="120" />
      <el-table-column prop="norunCount" label="未执行场景数" align="center" min-width="100" />
      <el-table-column prop="successRate" label="成功率" align="center" min-width="130">
        <template slot-scope="scope">
          <el-progress
            v-if="scope.row.norunCount > 0 || scope.row.runningCount > 0"
            :percentage="scope.row.successRate"
            :text-inside="true"
            :stroke-width="22"
          />
          <el-progress
            v-else
            :percentage="scope.row.successRate"
            status="success"
            :text-inside="true"
            :stroke-width="22"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="130">
        <template slot-scope="scope">
          <el-button
            size="mini"
            icon="el-icon-zoom-in"
            type="text"
            title="查看详情"
            @click="showTaskScene('showTaskScene',scope.row)"
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
      </el-table-column>
    </el-table>
    <div class="paginationLayout">
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
  </div>
</template>

<script>
import { queryTaskTableData } from '@/api/drainage-test'
// import taskResult from '@/views/drainageTest/components/report/taskResult.vue'
export default {
  components: {
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    paramDataRow: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      tableLoading: false,
      taskForm: {
        taskName: null,
        intervalTime: null
      },
      taskTableData: [],
      page: { pageNum: 1, pageSize: 10, totals: 0 }
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    query() {
      queryTaskTableData().then(response => {
        this.taskTableData = response.data
        this.page.totals = response.total
      })
    },
    resetQuery() {},
    showTaskScene(showTaskScene, row) {
      this.$emit('submitStatus', { status: showTaskScene, row: row })
    },
    deleteReport() {},
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

<style>

</style>
