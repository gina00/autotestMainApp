<template>
  <div>
    <el-form :inline="true" :model="taskForm" class="demo-form-inline">
      <el-form-item label="场景名称">
        <el-input
          v-model.trim="taskForm.taskName"
          placeholder="请输入场景名称"
          clearable
        />
      </el-form-item>
      <el-form-item label="执行状态">
        <el-select
          v-model="taskForm.execStatus"
          placeholder="选择执行状态查询"
          clearable
        >
          <el-option
            v-for="item in execStatus"
            v-show="item.dictKey != '4'"
            :key="item.dictKey"
            :label="item.dictValue"
            :value="item.dictKey"
          />
        </el-select>
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
      class="commonHeight"
      size="mini"
      border
      highlight-current-row
      style="width: 100%;height:calc(100vh - 360px)"
    >
      <el-table-column type="selection" width="45" />
      <el-table-column type="index" label="#" width="50" align="center" />
      <el-table-column prop="sceneName" label="场景名称" align="center" />
      <!-- <el-table-column prop="taskTypeValue" label="任务类型" align="center">
                  </el-table-column> -->
      <el-table-column prop="startTime" label="开始时间" align="center" min-width="120" />
      <el-table-column label="结束时间" align="center" min-width="120">
        <template slot-scope="{ row }">
          <template v-if="row.norunCount < 1 || row.stopCount > 0">
            {{ row.endTime }}
          </template>
        </template>
      </el-table-column>
      <el-table-column prop="execStatusValue" label="执行状态" align="center" min-width="100">
        <template slot-scope="scope">
          <el-tag :type="scope.row.execStatusValue?'success':'danger'" color="#fff" size="small">
            <i :class="scope.row.execStatusValue?'el-icon-success':'el-icon-error'" :style="scope.row.execStatusValue?'color:green':'color:red'" />
            {{ scope.row.execStatusValue?'成功':'失败' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="statusDesc" label="状态说明" align="center" min-width="100" />
      <el-table-column prop="parentTaskName" label="任务名称" align="center" min-width="100" />
      <el-table-column label="操作" align="center" min-width="130">
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
import { dict, querySceneData } from '@/api/drainage-test'
export default {
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
        execStatus: null,
        intervalTime: null
      },
      taskTableData: [],
      execStatus: [],
      page: { pageNum: 1, pageSize: 10, totals: 0 }

    }
  },
  watch: {
    // paramDataRow() {
    //   if (this.paramDataRow.gotoQuery == 'query') {
    //     this.query()
    //   }
    // }
  },
  mounted() {
    this.getDictData()
    this.query()
  },
  methods: {
    getDictData() {
      dict().then(response => {
        this.execStatus = response.data[5]
      })
    },
    query() {
      querySceneData().then(response => {
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

<style >
.red{
  color: red;
}
.green{
  color: green;
}

</style>
