<template>
  <div>
    <el-container :aside-collapse.sync="asideCollapse">
      <el-main>
        <el-divider><span style="font-weight:bold;">已选场景</span></el-divider>
        <div style="padding-top:5px;">
          <el-form ref="searchForm" :model="searchForm" inline>
            <el-form-item>
              <el-input
                v-model="searchForm.sceneName"
                placeholder="场景名称"
                clearable
                style="width: 270px;"
              />
            </el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              @click="pageQueryScene(1)"
            >搜索</el-button>
          </el-form>
          <div style="float:right;padding-bottom:10px;padding-right:15px;">
            <!-- v-if="permission['/autotest/task/batchDelSceneKeyword']" -->
            <el-button
              icon="el-icon-delete"
              size="mini"
              type="primary"
              @click="clearScene"
            >一键清空</el-button>
            <el-button
              icon="el-icon-delete-solid"
              size="mini"
              @click="batchDelScene"
            >批量删除</el-button>
          </div>
          <!-- <main
            style="height:45vh;border-left:solid 1px #e9e9eb;width:100%;"
            v-loading="taskFormLoading"
          >
            <el-container>
              <el-main style="height:45vh;width:100%;">
                <table class="table table-striped" align="left">
                  <thead class="thead-dark" align="left">
                    <tr>
                      <th scope="col">序号</th>
                      <th scope="col">场景名称</th>
                      <th scope="col">执行迭代</th>
                      <th scope="clo">操作</th>
                    </tr>
                  </thead>
                  <draggable
                    v-model="sceneData"
                    element="tbody"
                    ref="sceneList"
                    @end="evt => handleDragEnd(evt)"
                    style="min-height:500px;width:100%"
                  >
                    <tr v-for="row in sceneData" :key="row.id">
                      <td scope="row" width="10%">{{ row.sceneSort }}</td>
                      <td scope="row" width="30%">{{ row.sceneName }}</td>
                      <td scope="row" width="30%">{{ row.selectedIterationStr }}</td>
                      <td>
                        <el-button
                          @click="handleEdit(row)"
                          icon="el-icon-edit"
                          type="text"
                          title="编辑"
                          v-if="permission['/autotest/task/editSceneIteration']"
                        ></el-button>
                        <el-button
                          @click="handleDelete(row)"
                          icon="el-icon-delete"
                          type="text"
                          title="删除"
                          v-if="permission['/autotest/task/delSceneKeyword']"
                        ></el-button>
                      </td>
                    </tr>
                  </draggable>
                </table>
              </el-main>
            </el-container>
          </main> -->

          <el-table
            ref="sceneTable"
            v-loading="loading"
            :data="sceneData"
            row-key="id"
            border
            size="mini"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="number" type="index" label="序号" width="60" align="center" />
            <el-table-column
              prop="sceneName"
              label="场景名称"
              min-width="120"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              label="执行迭代"
              prop="selectedIterationStr"
              min-width="120"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column prop="xx" label="操作" min-width="120" align="center">
              <template slot-scope="{ row }">
                <el-button
                  icon="el-icon-edit"
                  type="text"
                  title="编辑"
                  @click="handleEdit(row)"
                />
                <el-button
                  icon="el-icon-delete"
                  type="text"
                  title="删除"
                  @click="handleDelete(row)"
                />
              </template>
            </el-table-column>
          </el-table>
          <!-- <div class="paginationLayout">
            <span class="demonstration" />
            <el-pagination
              :current-page="pageIndex"
              :page-sizes="[10, 20, 50, 100]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totals"
              @size-change="dealPageSizeChange"
              @current-change="dealPageIndexChange"
            />
          </div> -->
        </div>
      </el-main>
      <el-dialog
        title="选择执行迭代"
        :visible.sync="handleExecVisible"
        width="300px"
        :append-to-body="true"
        :close-on-click-modal="false"
      >
        <el-tree
          ref="handleExecTree"
          :data="handleExecData"
          show-checkbox
          node-key="id"
          default-expand-all
          :props="defaultProps"
          :default-checked-keys="selectedIterationIdArr"
        />
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeHandleExec">取消</el-button>
          <el-button type="primary" @click="submitHandleExec">提交</el-button>
        </div>
      </el-dialog>
    </el-container>
    <!-- <EditDevice
      :id="currentTaskId"
      :form-title="formTitle"
      :types="types"
      :device="device"
      :project-id="projectId"
      :type="'task'"
      :device-conf-visible="deviceConfVisible"
      @childByValue="childByValue"
    /> -->
    <el-dialog
      title="查询场景"
      :visible.sync="searchVisible"
      width="900px"
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="closeSearchDialog"
    >
      <el-form :inline="true" :model="searchSceneForm" class="demo-form-inline">
        <el-form-item label="场景名">
          <el-input
            ref="sceneName"
            v-model="searchSceneForm.sceneName"
            placeholder="请输入场景名搜索"
            clearable
          />
        </el-form-item>
        <el-form-item label="场景类型">
          <el-select v-model="searchSceneForm.type" placeholder="请选择场景类型搜索">
            <el-option label="功能" value="1" />
            <el-option label="场景集" value="2" />
            <el-option label="场景" value="3" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openSearch">查询</el-button>
        </el-form-item>
      </el-form>
      <el-alert
        v-if="hasCondition"
        :title="`可查询到${searchTableData.length}条记录`"
        type="info"
        :closable="false"
      />
      <el-alert v-else title="未输入条件" type="warning" />
      <el-table
        ref="searchTable"
        v-loading="searchLoading"
        :data="searchTableData"
        border
        @row-dblclick="rowDbclick"
      >
        <el-table-column type="index" width="60" label="#" align="center" />
        <el-table-column prop="pathName" label="名称" min-width="120" show-overflow-tooltip>
          <template slot-scope="scope">
            <i style="margin-right:5px" :class="scope.row.iconType" />
            {{ scope.row.pathName }}
          </template>
        </el-table-column>
        <el-table-column
          prop="typeName"
          label="类型"
          width="120"
          align="center"
          show-overflow-tooltip
        />
      </el-table>
    </el-dialog>
  </div>
</template>
<script>
import { querySelectedScene, remove } from '@/api/drainage-test'
// import SubsystemCascader from '@/views/autotest/baseconfig/common/SubsystemCascader.vue'
// import EditDevice from '@/views/autotest/baseconfig/common/EditDevice.vue'
import { mapState } from 'vuex'
import Sortable from 'sortablejs'
export default {
  components: {
    // SubsystemObject: SubsystemCascader,
    // EditDevice: EditDevice
  },
  props: ['taskInfo', 'projectId'],
  data() {
    return {
      asideCollapse: false,
      currentTaskId: '',
      pageIndex: 1,
      pageSize: 10,
      sceneData: [],
      loading: false,
      totals: 0,
      searchForm: {
        sceneName: ''
      },
      expandedData: [],
      treeData: [],
      treeProps: {
        label: 'name',
        parent: 'parentId',
        isLeaf: 'leaf'
      },
      filterText: '',
      systemId: null,
      deptInfo: [],
      handleExecVisible: false,
      handleExecData: [], // 迭代数组
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      row: {},
      selectedIterationIdArr: [],
      formTitle: '',
      types: [],
      device: {},
      subsystemType: null,
      deviceConfVisible: false,
      taskFormLoading: false,
      hasCondition: false,
      searchSceneForm: {},
      searchLoading: false,
      searchVisible: false,
      searchTableData: []
      // selected: []
    }
  },
  watch: {
    taskId: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal != null && newVal != '') {
          this.currentTaskId = newVal
          this.clearForm()
          this.pageQueryScene(null)
        }
      }
    },
    filterText(val) {
      this.$refs.sceneTree.filter(val)
    },
    taskInfo: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal != null) {
          if (newVal.taskId != null && newVal.taskId != '') {
            this.currentTaskId = newVal.taskId
            this.clearForm()
            // this.pageQueryScene(null)
            this.querySelectedScene(null)
          }
        }
      }
    }
  },
  mounted() {
    // this.querySceneTree()
    this.rowDrop()
    this.querySelectedScene()
  },
  methods: {
    querySelectedScene() {
      querySelectedScene().then(response => {
        var data = response.data
        var newArr = data.filter(item => item.parentTaskName === this.taskInfo.taskName)
        this.sceneData = JSON.parse(JSON.stringify(newArr))
        this.sceneData.map((item, index) => {
          const selectedArr = []
          const arr = []
          const newArr = [
            {
              name: '所有迭代',
              children: []
            }
          ]
          const selectedIterationIdArr = []
          if (item.iterations != null) {
            item.iterations.map((it, i) => {
              // if (it.selected == 0) {
              //   // 是否选择：0选择，1未选择
              //   selectedArr.push(it.iterationName)
              //   // selectedIterationIdArr.push(it.id)
              // }
              arr.push({
                id: it.id,
                name: it.iterationName
              })
            })
          }
          if (item.selected != null) {
            item.selected.map((it, i) => {
              selectedArr.push(it.iterationName)
              selectedIterationIdArr.push(it.iterationId)
            })
          }
          newArr[0].children = arr
          item.handleExecData = newArr
          item.selectedIterationIdArr = selectedIterationIdArr
          if (selectedArr.length != 0) {
            item.selectedIterationStr = selectedArr.join('、')
          } else {
            item.selectedIterationStr = '所有迭代'
          }
        })
      })
    },
    rowDrop() {
      // 此时找到的元素是要拖拽元素的父容器
      const tbody = document.querySelector('.el-table__body-wrapper tbody')
      const _this = this
      Sortable.create(tbody, {
        //  指定父元素下可被拖拽的子元素
        draggable: '.el-table__row',
        onEnd({ newIndex, oldIndex }) {
          const newRow = _this.sceneData[newIndex]
          const currRow = _this.sceneData.splice(oldIndex, 1)[0]
          _this.sceneData.splice(newIndex, 0, currRow)

          var updateObj = {}
          updateObj.sceneId = currRow.sceneId
          updateObj.taskId = currRow.taskId
          updateObj.oldSceneSort = currRow.sceneSort
          updateObj.sceneSort = newRow.sceneSort
          _this.axios
            .post(`/autotest-task/taskScene/resetTaskSceneSort`, updateObj)
            .then(response => {
              if (response.respResult == '1') {
                _this.pageQueryScene(null)
              }
            })
            .finally(() => {})
        }
      })
    },
    handleEdit(row) {
      this.handleExecData = row.handleExecData
      this.selectedIterationIdArr = row.selectedIterationIdArr
      // if (row.selected != null) {
      //   row.selected.map((item, index) => {
      //     this.selected.push(item.iterationId)
      //   })
      // }
      this.row = row
      this.handleExecVisible = true
    },
    closeHandleExec() {
      this.handleExecVisible = false
    },
    submitHandleExec() {
      const sceneIterations = []
      const iterations = this.$refs.handleExecTree.getCheckedNodes(true)
      iterations.map((item, index) => {
        sceneIterations.push({
          // sceneId: this.row.sceneId,
          // sceneSort: this.row.sceneSort,
          taskSceneId: this.row.id,
          iterationId: item.id
        })
      })
      const updateIterationData = {
        taskId: this.row.taskId,
        sceneIterations: sceneIterations
      }
      this.axios
        .post('/autotest-task/taskScene/updateIteration', updateIterationData)
        .then(response => {
          if (response.respResult === '1') {
            this.$message.success('修改场景已选迭代成功')
            this.handleExecVisible = false
            this.pageQueryScene(1)
          }
        })
    },
    handleDelete(row) {
      this.$confirm(`是否要删除场景?`, '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      }).then(() => {
        var id = row.id
        var $url = '/autotest-task/taskScene/deleteTaskScene'
        var deleteObj = {}
        deleteObj.id = id
        var _ownObj = this
        _ownObj.$http.post($url, deleteObj).then(response => {
          if (response.respResult == '1') {
            _ownObj.$message.success('删除成功')
            _ownObj.pageQueryScene(1)
          }
        })
      })
    },
    dealPageSizeChange(v_pageSize) {
      var _ownObj = this
      _ownObj.pageSize = v_pageSize
      _ownObj.pageQueryScene(null)
    },
    dealPageIndexChange(v_pageIndex) {
      var _ownObj = this
      if (_ownObj.totals != 0) {
        _ownObj.pageIndex = v_pageIndex
        _ownObj.pageQueryScene(v_pageIndex)
      }
    },
    pageQueryScene(v_pageIndex) {
      var _ownObj = this
      _ownObj.loading = true
      if (v_pageIndex != null && v_pageIndex != '') {
        _ownObj.pageIndex = v_pageIndex
      }
      _ownObj.searchForm.taskId = _ownObj.currentTaskId
      _ownObj.searchForm.pageIndex = _ownObj.pageIndex
      _ownObj.searchForm.pageSize = _ownObj.pageSize
      var $url = '/autotest-task/taskScene/querySelectedScene'
      _ownObj.$http
        .post($url, _ownObj.searchForm)
        .then(response => {
          if (response.respResult == '1') {
            var data = response.respData
            data.records.map((item, index) => {
              const selectedArr = []
              const arr = []
              const newArr = [
                {
                  name: '所有迭代',
                  children: []
                }
              ]
              const selectedIterationIdArr = []
              if (item.iterations != null) {
                item.iterations.map((it, i) => {
                  // if (it.selected == 0) {
                  //   // 是否选择：0选择，1未选择
                  //   selectedArr.push(it.iterationName)
                  //   // selectedIterationIdArr.push(it.id)
                  // }
                  arr.push({
                    id: it.id,
                    name: it.iterationName
                  })
                })
              }
              if (item.selected != null) {
                item.selected.map((it, i) => {
                  selectedArr.push(it.iterationName)
                  selectedIterationIdArr.push(it.iterationId)
                })
              }
              newArr[0].children = arr
              item.handleExecData = newArr
              item.selectedIterationIdArr = selectedIterationIdArr
              if (selectedArr.length != 0) {
                item.selectedIterationStr = selectedArr.join('、')
              } else {
                item.selectedIterationStr = '所有迭代'
              }
            })
            _ownObj.sceneData = data.records
            _ownObj.totals = response.dataTotalCount
          }
        })
        .finally(() => {
          _ownObj.loading = false
        })
    },
    saveTaskScene(row) {
      var taskSceneObj = {}
      var _ownObj = this
      taskSceneObj.taskId = _ownObj.currentTaskId
      var $url = '/autotest-task/taskScene/saveTaskScene'
      _ownObj.axios.post($url, taskSceneObj).then(response => {
        if (response.respResult == '1') {
          _ownObj.$message.success('操作成功')
          _ownObj.pageQueryScene(1)
        }
      })
    },
    querySceneTree() {
      var _ownObj = this
      if (_ownObj.systemId === null) {
        _ownObj.treeData = []
        return
      }
      var $url = '/autotest-task/taskScene/querySceneTreeNode'
      var queryObj = {}
      queryObj.subsystemId = _ownObj.systemId
      _ownObj.$http.post($url, queryObj).then(response => {
        if (response.respResult == '1') {
          var data = response.respData
          _ownObj.treeData = data
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    },
    loadNode(node, resolve) {
      node.resolve = resolve
      var _ownObj = this
      var $url = null
      if (node.level != 0 && node.type != '3') {
        var queryObj = { sceneId: node.data.id }
        $url = '/autotest-task/taskScene/querySceneTreeByPid'
        _ownObj.$http.post($url, queryObj).then(response => {
          if (response.respResult == '1') {
            var data = response.respData
            if (data != null && data.length > 0) {
              return resolve(data)
            } else {
              return resolve([])
            }
          }
        })
      } else {
        return resolve(this.treeData)
      }
    },
    addNodeConfirm(node, data) {
      if (data.type == '1') {
        // 1为功能，2为场景集
        this.$confirm('确定要把功能目录【' + data.name + '】下所有场景添加至任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.addNode(node, data)
          })
          .catch(() => {}) // 一定别忘了这个
      } else if (data.type == '2') {
        this.$confirm('确定要把场景集【' + data.name + '】下所有场景添加至任务?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.addNode(node, data)
          })
          .catch(() => {}) // 一定别忘了这个
      } else if (data.type == '3') {
        // 3为场景
        this.addNode(node, data)
      }
    },
    addNode(node, data) {
      var _ownObj = this
      var taskSceneObj = {}
      taskSceneObj.taskId = _ownObj.currentTaskId
      taskSceneObj.sceneId = data.id
      taskSceneObj.type = data.type
      var $url = '/autotest-task/taskScene/saveTaskScene'
      _ownObj.axios.post($url, taskSceneObj).then(response => {
        if (response.respResult == '1') {
          _ownObj.$message.success('操作成功')
          _ownObj.pageQueryScene(1)
        }
      })
    },
    updateChildren(node, data) {
      if (node != null && node.resolve != null) {
        node.childNodes = []
        this.loadNode(node, node.resolve)
      }
    },
    clearForm() {
      this.searchForm = {}
    },
    getSubSystemInfo(object) {
      this.systemId = object.subsystemId
      this.querySceneTree()
    },
    batchDelScene() {
      var _ownObj = this
      if (
        _ownObj.$refs.sceneTable.selection === null ||
        _ownObj.$refs.sceneTable.selection.length < 1
      ) {
        _ownObj.$message({
          showClose: true,
          message: '请选择需删除的场景',
          type: 'warning'
        })
        return
      }
      var $url = '/autotest-task/taskScene/deleteTaskScene'
      var deleteObj = {}
      deleteObj.sceneJsonData = JSON.stringify(_ownObj.$refs.sceneTable.selection)
      deleteObj.taskId = _ownObj.$refs.sceneTable.selection[0].taskId
      _ownObj.$http.post($url, deleteObj).then(response => {
        if (response.respResult == '1') {
          _ownObj.$message.success('删除成功')
          _ownObj.pageQueryScene(1)
        }
      })
    },
    clearScene() {
      var _ownObj = this
      this.$confirm(`是否要一键清空任务中的所有场景?`, '提示', {
        confirmButtonText: '是',
        cancelButtonText: '否',
        type: 'warning'
      })
        .then(() => {
          remove().then(response => {
            if (response.code == 20000) {
              this.sceneData = []
              _ownObj.$message.success('清除成功')
            }
          })
        })
        .catch(e => e)
    },
    async handleEditDevices() {
      this.formTitle = '配置设备'
      // this.types = JSON.parse(this.subsystemType)
      this.types = await this.querySubSystemType()
      if (this.types && this.types.length > 0) {
        this.device = await this.getTaskInfo()
        this.deviceConfVisible = true
      } else {
        this.openMessage('warning', '当前场景配置无需配置设备')
      }
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
    childByValue(childValue) {
      this.deviceConfVisible = childValue.deviceConfVisible
    },
    openSearch() {
      this.searchLoading = true
      this.searchVisible = true
      this.$nextTick(() => {
        this.$refs.sceneName.$el.querySelector('input').focus() // 自动获取光标
      })
      this.searchTableData = []
      const form = { subsystemId: this.systemId }
      let formHasCondition = false
      if (this.searchSceneForm.sceneName) {
        this.$set(form, 'sceneName', this.searchSceneForm.sceneName)
        formHasCondition = true
      }
      if (this.searchSceneForm.type) {
        this.$set(form, 'type', this.searchSceneForm.type)
        formHasCondition = true
      }
      this.hasCondition = formHasCondition
      this.axios
        .post('/autotest-baseconfig/scene/searchSceneTree', form)
        .then(response => {
          if (response.respResult === '1') {
            this.searchTableData = response.respData
          }
        })
        .finally(() => {
          this.searchLoading = false
        })
    },
    closeSearchDialog() {
      this.searchVisible = false
      this.searchSceneForm = {}
    },
    rowDbclick(row, column, event) {
      this.expandedData = []
      if (row.pathIds) {
        row.pathIds.forEach((item, index) => {
          this.expandedData.push(item + '-' + row.isPublicScene)
        })
      }
      if (row.id) {
        const key = row.id
        this.$refs.sceneTree.setCurrentKey(key)
        this.$nextTick(function() {
          const array = document.querySelectorAll('.sceneTree .is-current')
          if (array && array.length > 0) {
            array[0].scrollIntoView({ block: 'center', behavior: 'smooth' })
          }
        })
      }
    }
  },
  computed: {
    ...mapState(['userInfo', 'permission'])
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-divider--horizontal {
    margin: 10px 0;
  }
  .el-tree-node__label {
    font-size: 14px;
    display: inline-block;
    max-width: 20vw;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    vertical-align: top;
  }
}
</style>
