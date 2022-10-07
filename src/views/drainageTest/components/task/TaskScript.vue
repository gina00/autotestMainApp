<template>
  <div class="TransferBox">
    <div class="SourceBox">
      <div>
        <el-divider><span style="font-weight:bold;">待选脚本</span></el-divider>
      </div>
      <el-row>
        <el-col :span="20">
          <!-- <SubsystemObject
            :dept-info="deptInfo"
            :moudle-type="'task'"
            :new-pro-id="projectId"
            :create-submit-params-data="createSubmitParamsData"
            @emitData="getSubSystemInfo"
          /> -->
        </el-col>
      </el-row>
      <!-- <ScriptTree
        :subsys-cascader-data="subsysCascaderData"
        component-type="taskScript"
        class="treeClass"
        @returnData="returnData"
      /> -->
    </div>

    <el-divider direction="vertical" content-position="center" />

    <div class="TargetBox">
      <div>
        <el-divider><span style="font-weight:bold;">已关联脚本</span></el-divider>
      </div>
      <div>
        <div style="float:right;padding-bottom:10px;padding-right:15px;">
          <el-button
            v-if="permission['/autotest/task/batchDelSceneKeyword']"
            icon="el-icon-delete"
            size="mini"
            type="primary"
            @click="clearScript"
          >一键清空</el-button>
          <el-button
            icon="el-icon-delete-solid"
            size="mini"
            @click="batchDelScript"
          >批量删除</el-button>
          <el-button
            v-if="permission['autotest/SceneMgr/confDevice']"
            icon="el-icon-edit-outline"
            size="mini"
            @click="handleEditDevices"
          >
            配置设备
          </el-button>
        </div>
        <el-table
          ref="selectedScriptTable"
          v-loading="rightLoading"
          border
          height="calc(100vh - 400px)"
          :data="relatedTaskScripts"
          size="mini"
          row-key="taskScriptId"
          class="selectdTable"
        >
          <el-table-column type="selection" width="40" />
          <el-table-column
            prop="number"
            type="index"
            label="序号"
            width="60"
            align="center"
          />
          <el-table-column prop="scriptName" label="脚本名称" />
          <el-table-column prop="systemName" label="被测系统名称" />
          <el-table-column prop="sort" label="脚本顺序" width="80" align="center" />
        </el-table>
        <div class="block" style="text-align: center">
          <span class="demonstration" />
          <el-pagination
            :current-page="selectedScriptPage.pageIndex"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="selectedScriptPage.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="selectedScriptPage.totals"
            @size-change="dealPageSizeChange"
            @current-change="dealPageIndexChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
// import EditDevice from '@/views/autotest/baseconfig/common/EditDevice.vue'
// import SubsystemCascader from '@/views/autotest/baseconfig/common/SubsystemCascader.vue'
// import ScriptTree from '@/views/autotest/baseconfig/scriptManage/scriptTree.vue'
import Sortable from 'sortablejs'
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: ['taskInfo', 'projectId'],
  data() {
    return {
      formTitle: '',
      types: [],
      device: {},
      currentTaskId: '',
      deptInfo: [],
      deviceConfVisible: false,
      multiSystemId: [],
      // leftTableData: [],
      relatedTaskScripts: [],
      // leftLoading: false,
      scriptSystemId: null,
      multipleSelection: [], // 全部多选选中
      TargetMultipleSelection: [], // 已选多选选中
      rightValue: [],
      rightLoading: false,
      transferName: '',
      systemId: '',
      selectedScriptPage: {
        pageSize: 10,
        pageIndex: 1,
        totals: 0
      },
      subsysCascaderData: {},
      createSubmitParamsData: {}
    }
  },
  computed: {
    ...mapState(['userInfo', 'permission'])
  },
  watch: {
    taskInfo: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal != null) {
          if (newVal.taskId != null && newVal.taskId != '') {
            this.currentTaskId = newVal.taskId
            this.pageQueryRelatedScripts(1)
          }
        }
      }
    }
  },
  created() {
    this.createSubmitParamsData = {
      projectId: this.projectId
    }
  },

  mounted() {
    this.rowDrag()
  },
  methods: {
    /**
    查询已经被任务关联的脚本
     */
    pageQueryRelatedScripts(v_pageIndex) {
      this.rightLoading = true
      var _ownObj = this
      _ownObj.relatedTaskScripts = []
      var queryObj = {}
      queryObj.taskId = _ownObj.currentTaskId
      if (v_pageIndex != null && v_pageIndex != '') {
        _ownObj.selectedScriptPage.pageIndex = v_pageIndex
      }
      queryObj.pageIndex = _ownObj.selectedScriptPage.pageIndex
      queryObj.pageSize = _ownObj.selectedScriptPage.pageSize
      _ownObj.axios
        .post(`/autotest-task/taskScript/pageQueryTaskScript`, queryObj)
        .then(resp => {
          if (resp.respResult === '1') {
            _ownObj.relatedTaskScripts = resp.respData.records
            _ownObj.selectedScriptPage.totals = resp.dataTotalCount
          }
        })
        .finally(() => {
          this.rightLoading = false
        })
    },
    /** 分页方法
     */
    dealPageSizeChange(v_pageSize) {
      var _ownObj = this
      _ownObj.selectedScriptPage.pageSize = v_pageSize
      _ownObj.pageQueryRelatedScripts(null)
    },
    /** 分页方法
     */
    dealPageIndexChange(v_pageIndex) {
      var _ownObj = this
      if (_ownObj.selectedScriptPage.totals != 0) {
        _ownObj.selectedScriptPage.pageIndex = v_pageIndex
        _ownObj.pageQueryRelatedScripts(v_pageIndex)
      }
    },
    /** 一键清空任务所有脚本
     */
    clearScript() {
      var _ownObj = this
      this.$confirm(`是否要一键清空任务中的所有脚本?`, '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      })
        .then(() => {
          var deleteObj = {
            taskId: _ownObj.currentTaskId
          }
          var $url = '/autotest-task/taskScript/emptyTaskScrip'
          _ownObj.$http.post($url, deleteObj).then(response => {
            if (response.respResult == '1') {
              _ownObj.$message.success('清空成功')
              _ownObj.pageQueryRelatedScripts(1)
            }
          })
        })
        .catch(e => e)
    },
    /** 批量删除任务脚本
     */
    batchDelScript() {
      var _ownObj = this
      if (
        _ownObj.$refs.selectedScriptTable.selection === null ||
        _ownObj.$refs.selectedScriptTable.selection.length < 1
      ) {
        _ownObj.$message({
          showClose: true,
          message: '请选择需删除的脚本',
          type: 'warning'
        })
        return
      }
      var $url = '/autotest-task/taskScript/deleteTaskScript'
      var deleteObj = {}
      // eslint-disable-next-line no-array-constructor
      var taskScriptIdList = new Array()
      for (const scriptObj of _ownObj.$refs.selectedScriptTable.selection) {
        taskScriptIdList.push(scriptObj.taskScriptId)
      }
      deleteObj.taskScriptIdList = taskScriptIdList
      deleteObj.taskId = _ownObj.currentTaskId
      _ownObj.$http.post($url, deleteObj).then(response => {
        if (response.respResult == '1') {
          _ownObj.$message.success('删除成功')
          _ownObj.pageQueryRelatedScripts(1)
        }
      })
    },
    async handleEditDevices() {
      this.formTitle = '配置设备'
      this.types = ['jmeter', 'PerfMonServerAgent']
      if (this.types && this.types.length > 0) {
        this.device = await this.getTaskInfo()
        this.deviceConfVisible = true
      }
    },
    openMessage(type, message, duration) {
      if (!duration) {
        duration = 3000
      }
      this.$message({
        duration: duration,
        showClose: true,
        message: message,
        type: type
      })
    },
    getTaskInfo() {
      var _ownObj = this
      var $url = '/autotest-task/task/getTaskData'
      var obj = {}
      obj.id = _ownObj.currentTaskId
      return new Promise(resolve => {
        _ownObj.axios
          .post($url, obj)
          .then(async response => {
            if (response.respResult === '1') {
              resolve(response.respData)
            }
          })
          .finally(() => {})
      })
    },
    childByValue(childValue) {
      this.deviceConfVisible = childValue.deviceConfVisible
    },
    querySubSystemType() {
      return new Promise(resolve => {
        const obj = {
          taskId: this.currentTaskId
        }
        this.axios
          .post(`/autotest-task/taskScene/querySubSystemType`, obj)
          .then(async response => {
            if (response.respResult === '1') {
              resolve(response.respData)
            }
          })
          .finally(() => {})
      })
    },
    getSubSystemInfo(val) {
      this.systemId = val.subsystemId
      this.subsysCascaderData = val
    },
    /**
      已关联脚本排序
     */
    rowDrag() {
      const tbody = document.querySelector('.selectdTable tbody')
      const _this = this
      Sortable.create(tbody, {
        //  指定父元素下可被拖拽的子元素
        draggable: '.el-table__row',
        onEnd({ newIndex, oldIndex }) {
          const newRow = _this.relatedTaskScripts[newIndex]
          const currRow = _this.relatedTaskScripts.splice(oldIndex, 1)[0]
          _this.relatedTaskScripts.splice(newIndex, 0, currRow)

          var updateObj = {}
          updateObj.id = currRow.taskScriptId
          updateObj.taskId = currRow.taskId
          updateObj.sort = currRow.sort
          updateObj.endSort = newRow.sort
          _this.axios
            .post(`/autotest-task/taskScript/resortTaskScript`, updateObj)
            .then(response => {
              if (response.respResult == '1') {
                _this.pageQueryRelatedScripts(null)
              }
            })
            .finally(() => {})
        }
      })
    },
    addTaskScript(script) {
      var _ownObj = this
      var taskScriptObj = {}
      taskScriptObj.taskId = _ownObj.currentTaskId
      taskScriptObj.scriptId = script.id
      taskScriptObj.type = script.type
      _ownObj.axios
        .post(`/autotest-task/taskScript/addTaskScript`, taskScriptObj)
        .then(resp => {
          if (resp.respResult === '1') {
            _ownObj.$message.success('添加成功')
            _ownObj.pageQueryRelatedScripts(null)
          }
        })
        .finally(() => {
          this.rightLoading = false
        })
    },
    returnData(val) {
      this.addTaskScript(val)
    }
  }
}
</script>
<style lang="scss" scoped>
.TransferBox {
  clear: both;
  display: flex;
}
.SourceBox {
  width: 35%;
}
.TargetBox {
  width: 65%;
}
.treeClass {
  height: calc(100vh - 400px);
  overflow: auto;
  padding-top: 5px;
}
.el-divider--vertical {
  display: inline-block;
  width: 1px;
  height: calc(100vh - 300px);
  position: relative;
  vertical-align: middle;
}
</style>
