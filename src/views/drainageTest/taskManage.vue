<template>
  <div class="page">
    <el-row :gutter="20">
      <el-col :span="24" style="margin-bottom:10px">
        <el-table
          v-loading="taskLoading"
          class="commonHeight"
          :data="taskTableData.slice((page.pageNum - 1) * page.pageSize, page.pageNum * page.pageSize)"
          border
          style="width: 100%;height:calc(100vh - 600px)"
        >
          <el-table-column label="序号" type="index" width="50" align="center" />
          <el-table-column prop="taskName" label="任务名称" min-width="180" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="showDetail(scope.row.taskId,scope.row.taskName)">{{ scope.row.taskName }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="180" align="center" />
          <el-table-column prop="taskStatus" label="状态" min-width="180" align="center">
            <template slot-scope="scope">
              {{ statusMap.get(scope.row.taskStatus)?statusMap.get(scope.row.taskStatus).dictValue:'' }}
            </template>
          </el-table-column>
          <el-table-column prop="executeStrategy" label="执行策略" min-width="180" align="center">
            <template slot-scope="scope">
              {{ strategiesMap.get(scope.row.executeStrategy)?strategiesMap.get(scope.row.executeStrategy).dictValue:'' }}
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
      </el-col>
      <el-col :span="24">
        <el-tabs v-model="tabName" type="border-card">
          <el-tab-pane label="任务配置" name="taskTab">
            <div style="padding-top: 15px">
              <el-form
                ref="taskForm"
                :model="taskForm"
                :rules="taskFormRulesList"
                label-width="150px"
              >
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="任务名称" prop="taskName">
                      <el-input
                        v-model="taskForm.taskName"
                        clearable
                        maxlength="32"
                        style="width: 60%"
                        readonly="readonly"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item label="任务状态" prop="taskStatus">
                      <el-radio-group
                        v-for="item in status"
                        :key="item.dictKey"
                        v-model="taskForm.taskStatus"
                      >
                        <div style="margin-left: 5px">
                          <el-radio :label="item.dictKey">{{ item.dictValue }}</el-radio>
                        </div>
                      </el-radio-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item label="执行策略" prop="executeStrategy">
                      <el-select v-model="taskForm.executeStrategy" @change="changeStrategyType">
                        <el-option
                          v-for="item in strategies"
                          :key="item.dictKey"
                          :label="item.dictValue"
                          :value="item.dictKey"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col v-show="showDay" :span="12">
                    <el-form-item label="日期" prop="day">
                      <el-select v-model="taskForm.day">
                        <el-option
                          v-for="item in days"
                          :key="item.dictKey"
                          :label="item.dictValue"
                          :value="item.dictKey"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col v-show="showWeek" :span="12">
                    <el-form-item label="星期" prop="week">
                      <el-select v-model="taskForm.week">
                        <el-option
                          v-for="item in weeks"
                          :key="item.dictKey"
                          :label="item.dictValue"
                          :value="item.dictKey"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>

                  <el-col v-show="showDateTime" :span="12">
                    <el-form-item label="执行时间" prop="executeDateTime">
                      <el-date-picker
                        v-model="taskForm.executeDateTime"
                        type="datetime"
                        placeholder="选择日期时间"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        :picker-options="pickerOptionsStart"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col v-show="showTime" :span="12">
                    <el-form-item label="执行时间" prop="executeTime">
                      <el-time-picker
                        v-model="taskForm.executeTime"
                        placeholder="执行时间"
                        value-format="HH:mm:ss"
                      />
                    </el-form-item>
                  </el-col>

                  <el-col v-show="showInterval" :span="12">
                    <el-form-item label="间隔时间" prop="executeInterval">
                      <el-input
                        v-model.number="taskForm.executeInterval"
                        placeholder="间隔时间"
                        style="width: 60%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col v-if="folderForm.taskType == '1'" :span="12">
                    <el-form-item label="精准测试" prop="isCoverage">
                      <el-switch
                        v-model="taskForm.isCoverage"
                        :active-value="1"
                        :inactive-value="0"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col v-if="folderForm.taskType == '1'" :span="12">
                    <el-form-item label="安全测试" prop="isSecurity">
                      <el-switch
                        v-model="taskForm.isSecurity"
                        :active-value="1"
                        :inactive-value="0"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col v-if="folderForm.taskType == '1'" :span="12">
                    <el-form-item label="串行执行" prop="isSecurity">
                      <el-switch
                        v-model="taskForm.serial"
                        :active-value="1"
                        :inactive-value="0"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12">
                    <el-form-item prop="executeInstructions">
                      <span slot="label">
                        <span class="span-box">
                          <el-tooltip placement="top">
                            <div slot="content">
                              建议格式：CRM-需求-阶段-场景说明-版本号-时间
                            </div>
                            <i class="el-icon-question" />
                          </el-tooltip>

                          <span> 执行说明 </span>
                        </span>
                      </span>
                      <el-input
                        v-model.number="taskForm.executeInstructions"
                        maxlength="32"
                        style="width: 60%"
                      />
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <div slot="footer" class="dialog-footer" style="float: right; padding-top: 10px">
                <el-button
                  icon="el-icon-video-play"
                  type="text"
                  @click="executeRightNow"
                >立即执行</el-button>
                <el-button
                  v-if="folderForm.taskType == '1'"
                  style="margin-right: 10px"
                  type="text"
                  icon="el-icon-zoom-in"
                  @click="viewReport"
                >
                  查看执行报告
                </el-button>
                <el-button
                  v-if="folderForm.taskType == '2'"
                  style="margin-right: 10px"
                  type="text"
                  icon="el-icon-zoom-in"
                  @click="viewPerformanceReport"
                >
                  查看性能报告
                </el-button>
                <el-button
                  type="primary"
                  :loading="saveTaskLoading"
                  @click="saveTaskInfo('taskForm')"
                >
                  保存</el-button>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="场景配置" name="taskScene">
            <div>
              <taskSceneObject :task-info="taskInfo" :project-id="projectId" />
            </div>
          </el-tab-pane>
          <el-tab-pane label="邮件配置" name="taskEmail">
            <div>
              <taskEmailObject :task-id="taskId" />
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>

  </div>
</template>
<script>
import { dict, update, queryTaskManageTableData } from '@/api/drainage-test'
// import TaskDevice from '@/views/autotest/businessconfig/task/TaskDevice.vue'
import TaskEmail from '@/views/drainageTest/components/task/TaskEmail.vue'
import TaskScene from '@/views/drainageTest/components/task/TaskScene.vue'
export default {
  components: {
    taskEmailObject: TaskEmail,
    taskSceneObject: TaskScene
    // VirtualDepartObject: VirtualDepartSelect
  },
  data() {
    return {
      taskLoading: false,
      taskTableData: [],
      page: { pageNum: 1, pageSize: 10, totals: 0 },
      asideCollapse: false,
      taskId: '',
      filterText: '',
      systemId: '',
      treeProps: {
        label: 'name',
        parent: 'parentId',
        isLeaf: 'leaf'
      },
      treeData: [
        {
          name: '所有',
          parentId: -1,
          leaf: false,
          id: 0,
          type: 0
        }
      ],
      expandedData: ['0'],
      showTaskInfo: false,
      tabName: 'taskTab',
      folderForm: {
        taskName: ''
      },
      folderRules: {
        taskName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择节点类型', trigger: 'blur' }]
      },
      submitFolderLoding: false,
      showNodeType: true,
      nodeTypeList: [],
      parentNode: null,
      parentId: 0,
      folderId: null,
      selectedNodeId: '',
      taskForm: {
        executeStrategy: '',
        executeInstructions: '',
        day: '',
        week: '',
        taskStatus: 2,
        executeInterval: '',
        month: '',
        executeTime: '',
        executeDateTime: '',
        taskType: '',
        taskConfigId: '',
        isCoverage: 0, // 是否开启精准：0否1是
        isSecurity: 0,
        isInOrder: 0 // 是否串行执行
      },
      nodeTitle: '',
      nodeTypeVisible: false,
      saveTaskLoading: false,
      taskFormRules: {
        taskStatus: [{ required: true, message: '请选择任务状态', trigger: 'blur' }],
        executeStrategy: [{ required: true, message: '请选择执行策略', trigger: 'blur' }]
      },
      taskFormRules2: {
        taskStatus: [{ required: true, message: '请选择任务状态', trigger: 'blur' }],
        executeStrategy: [{ required: true, message: '请选择执行策略', trigger: 'blur' }],
        day: [{ required: true, message: '请选择日期', trigger: 'blur' }],
        executeTime: [{ required: true, message: '请选择执行时间', trigger: 'blur' }]
      },
      taskFormRules3: {
        taskStatus: [{ required: true, message: '请选择任务状态', trigger: 'blur' }],
        executeStrategy: [{ required: true, message: '请选择执行策略', trigger: 'blur' }],
        week: [{ required: true, message: '请选择星期', trigger: 'blur' }],
        executeTime: [{ required: true, message: '请选择执行时间', trigger: 'blur' }]
      },
      taskFormRules4: {
        taskStatus: [{ required: true, message: '请选择任务状态', trigger: 'blur' }],
        executeStrategy: [{ required: true, message: '请选择执行策略', trigger: 'blur' }],
        executeDateTime: [{ required: true, message: '请选择执行时间', trigger: 'blur' }]
      },
      taskFormRules5: {
        taskStatus: [{ required: true, message: '请选择任务状态', trigger: 'blur' }],
        executeStrategy: [{ required: true, message: '请选择执行策略', trigger: 'blur' }],

        executeInterval: [
          { required: true, message: '请输入间隔时间', trigger: 'blur' },
          {
            pattern: /^[1-5]{0,1}[0-9]{1}$/,
            message: '请输入1-59之间的数字'
          }
        ]
      },
      taskFormRules6: {
        taskStatus: [{ required: true, message: '请选择任务状态', trigger: 'blur' }],
        executeStrategy: [{ required: true, message: '请选择执行策略', trigger: 'blur' }],
        executeTime: [{ required: true, message: '请选择执行时间', trigger: 'blur' }]
      },

      strategies: [],
      showDay: false,
      showWeek: false,
      showTime: false,
      days: [],
      showDateTime: false,
      showInterval: false,
      weeks: [
        {
          dictKey: '2',
          dictValue: '星期一'
        },
        {
          dictKey: '3',
          dictValue: '星期二'
        },
        {
          dictKey: '4',
          dictValue: '星期三'
        },
        {
          dictKey: '5',
          dictValue: '星期四'
        },
        {
          dictKey: '6',
          dictValue: '星期五'
        },
        {
          dictKey: '7',
          dictValue: '星期六'
        },
        {
          dictKey: '1',
          dictValue: '星期日'
        }
      ],
      status: [
        {
          dictKey: 2,
          dictValue: '暂停'
        },
        {
          dictKey: 1,
          dictValue: '激活'
        }
      ],
      taskName: '',
      hisDialogVisable: false,
      module: 'task',
      deptInfo: [],
      taskList: [],
      rootNode: null,
      objectId: null,
      taskInfo: {
        taskId: '',
        deptInfo: []
      },
      pickerOptionsStart: {
        disabledDate(time) {
          return time.getTime() < Date.now() + 10 * 60 * 1000
        }
      },
      projectId: null,
      projectType: 0,
      projectPermission: false,
      projectName: null,
      // 迁移任务
      migrationVisible: false,
      migrationLoading: false,
      parentSubsystemId: null,
      isStartMoveNode: false,
      isRefreshRootNode: false,
      checkKeys: [],
      currentParentKey: null,
      countTimes: new Date().getMilliseconds(),
      isAutoTestAdmin: 1,
      taskTypes: [],
      disabledType: false
    }
  },
  computed: {
    // eslint-disable-next-line vue/return-in-computed-property
    taskFormRulesList: function() {
      var type = this.taskForm.executeStrategy
      if (type == 'time') {
        return this.taskFormRules4
      } else if (type == 'month') {
        return this.taskFormRules2
      } else if (type == 'week') {
        return this.taskFormRules3
      } else if (type == 'day') {
        return this.taskFormRules6
      } else if (type == 'hour' || type == 'minute') {
        return this.taskFormRules5
      } else if (type == 'now') {
        return this.taskFormRules
      }
    },
    strategiesMap: function() {
      const objMap = new Map()
      this.strategies.forEach(element => {
        objMap.set(element.dictKey, element)
      })
      return objMap
    },
    statusMap: function() {
      const objMap = new Map()
      this.status.forEach(element => {
        objMap.set(element.dictKey, element)
      })
      return objMap
    }
    // ...mapState(['userInfo', 'permission'])
  },
  watch: {
    // filterText(val) {
    //   this.$refs.tree.filter(val)
    // }
  },
  mounted() {
    this.getDictData()
    // this.queryStrategy()
    this.getInitData()
    this.getData()
  },
  methods: {
    getDictData() {
      dict().then(response => {
        this.strategies = response.data[4]
        this.executeStrategy = response.data[5]
        this.taskForm.executeStrategy = this.strategies[0].dictKey
      })
    },
    getInitData() {
      var _ownObj = this
      for (var index = 1; index <= 31; index++) {
        var dayData = {}
        if (index < 10) {
          dayData.dictKey = '0' + index
        } else {
          dayData.dictKey = index
        }
        dayData.dictValue = index + '日'
        _ownObj.days.push(dayData)
      }
    },
    changeStrategyType() {
      var _ownObj = this
      var type = _ownObj.taskForm.executeStrategy
      _ownObj.hideElment()
      // if (type == 'now') {
      //   // _ownObj.hideElment()
      // } else
      if (type == 'time') {
        // _ownObj.hideElment()
        _ownObj.showDateTime = true
      } else if (type == 'month') {
        // _ownObj.hideElment()
        _ownObj.showDay = true
        _ownObj.showTime = true
        this.taskForm.day = this.days[0].dictKey
      } else if (type == 'week') {
        // _ownObj.hideElment()
        _ownObj.showWeek = true
        _ownObj.showTime = true
      } else if (type == 'day') {
        // _ownObj.hideElment()
        _ownObj.showTime = true
      } else if (type == 'hour' || type == 'minute') {
        // _ownObj.hideElment()
        _ownObj.showInterval = true
      }
    },
    hideElment() {
      var _ownObj = this
      _ownObj.showTime = false
      _ownObj.showWeek = false
      _ownObj.showDay = false
      _ownObj.showDateTime = false
      _ownObj.showInterval = false
    },
    saveTaskInfo() {
      update().then(response => {
        this.saveTaskLoading = true
        this.$message({
          message: '保存成功',
          type: 'success',
          duration: 2000
        })
      }).finally(() => {
        this.saveTaskLoading = false
      })
    },
    viewPerformanceReport() {},
    viewReport() {},
    executeRightNow() {
      update().then(response => {
        this.$message({
          message: '执行成功',
          type: 'success',
          duration: 2000
        })
      }).finally(() => {
      })
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
    getData() {
      queryTaskManageTableData().then(resp => {
        this.taskTableData = resp.data
        this.page.totals = resp.total
      })
    },
    showDetail(taskId, taskName) {
      this.taskForm = this.taskTableData[0].taskForm
      this.taskForm.taskName = taskName
      this.taskId = taskId
      this.$set(this.taskInfo, 'taskId', taskId)
      this.$set(this.taskInfo, 'taskName', taskName)
    }
    // viewReport() {
    //   const type = 'report'
    //   this.$store.dispatch('openTab', {
    //     title: '执行报告管理',
    //     path: `/autotest/report?projectId=${this.projectId}&sceneName=${this.taskName}&type=${type}`
    //   })
    // },
    // viewPerformanceReport() {
    //   const type = 'PerformanceReport'
    //   this.$store.dispatch('openTab', {
    //     title: '性能测试报告',
    //     path: `/autotest/performanceReport?projectId=${this.projectId}&taskName=${this.taskName}&type=${type}`
    //   })
    // },
    // startMoveNode() {
    //   this.countTimes++
    //   this.isStartMoveNode = true
    //   this.isRefreshRootNode = false
    //   this.$confirm('确定要迁移任务?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     if (this.checkKeys == undefined) {
    //       this.openMessage('warning', '请选择迁移任务')
    //       return
    //     }
    //     if (this.currentParentKey == undefined) {
    //       this.openMessage('warning', '请选择迁移目标节点')
    //       return
    //     }
    //     this.migrationLoading = true
    //     const url = '/autotest-task/task/move'
    //     const form = {
    //       taskList: this.checkKeys,
    //       toId: this.currentParentKey
    //     }
    //     this.axios
    //       .post(url, form)
    //       .then(response => {
    //         if (response.respResult === '1') {
    //           this.openMessage('success', response.respData)
    //           this.isRefreshRootNode = true
    //           this.countTimes++
    //           this.currentParentKey = undefined
    //           this.checkKeys = []
    //         }
    //       })
    //       .finally(() => {
    //         this.migrationLoading = false
    //       })
    //   })
    // },
    // returnCheckKeys(val) {
    //   this.checkKeys = val.checkKeys
    // },
    // returnCurrentParentKey(val) {
    //   this.currentParentKey = val.currentKey
    // },
    // closeMigrationDialog() {
    //   this.migrationVisible = false
    //   this.isRefreshRootNode = false
    //   this.updateTreeNode()
    //   this.countTimes++
    // },
    // openMessage(type, message) {
    //   this.$message({
    //     showClose: true,
    //     message: message,
    //     type: type
    //   })
    // },
    // filterNode(value, data) {
    //   if (!value) return true
    //   return data.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    // },
    // loadNode(node, resolve) {
    //   var _ownObj = this
    //   node.resolve = resolve
    //   if (_ownObj.rootNode === null) {
    //     _ownObj.rootNode = node
    //   }
    //   if (_ownObj.projectId == null) {
    //     return
    //   }
    //   if (!_ownObj.projectPermission) {
    //     return
    //   }
    //   if (!_ownObj.projectType === 1) {
    //     return
    //   }
    //   if (node.level == 0) {
    //     return resolve(_ownObj.taskList)
    //   }
    //   var $url = null
    //   var queryObj = { enableExpandLeaf: true, projectId: _ownObj.projectId }
    //   if (node.level != 0 && node.type != '2') {
    //     if (node.level != 1) {
    //       queryObj.parentId = node.data.id
    //     } else {
    //       queryObj.parentId = 0
    //     }
    //     $url = '/autotest-task/task/queryTaskTreeByPid'
    //     _ownObj.$http.post($url, queryObj).then(response => {
    //       if (response.respResult == '1') {
    //         var data = response.respData
    //         if (data != null && data.length > 0) {
    //           return resolve(data)
    //         } else {
    //           return resolve([])
    //         }
    //       }
    //     })
    //   } else {
    //     return resolve(this.treeData)
    //   }
    // },
    // appendNode(node, data) {
    //   this.folderForm = {}
    //   this.folderId = null
    //   var type = data.type
    //   this.nodeTypeList = []
    //   if (node.level == 1) {
    //     this.parentId = 0
    //   } else {
    //     this.parentId = data.id
    //   }
    //   this.parentNode = node
    //   this.nodeTypeVisible = true
    //   this.showNodeType = true
    //   this.nodeTitle = '新增节点'
    //   this.$set(this.folderForm, 'taskType', this.taskTypes[0].dictKey)
    //   if (type <= 1 && node.level <= 3) {
    //     // 目录最多限制3层
    //     this.nodeTypeList.push({ id: '1', name: '功能' })
    //     this.nodeTypeList.push({ id: '2', name: '任务' })
    //     this.showNodeType = true
    //   } else {
    //     this.showNodeType = false
    //     this.folderForm.type = 2
    //   }
    // },

    // editNode(node, data) {
    //   this.folderForm = {}
    //   this.folderId = null
    //   this.currentNodeId = data.id
    //   this.nodeTypeVisible = true
    //   this.parentNode = node.parent
    //   this.parentId = data.parentId
    //   this.showNodeType = false
    //   this.nodeTitle = '修改节点'
    //   this.disabledType = true
    //   this.getNodeById(data.id)
    // },
    // getNodeById(id) {
    //   var _ownObj = this
    //   var $url = '/autotest-task/task/getTaskNode'
    //   var obj = {}
    //   obj.id = id
    //   _ownObj.axios.post($url, obj).then(response => {
    //     if (response.respResult == '1') {
    //       _ownObj.folderForm = response.respData
    //       _ownObj.folderId = response.respData.id
    //       _ownObj.folderForm.type = response.respData.type + ''
    //       _ownObj.folderForm.taskType = response.respData.taskType + ''
    //     }
    //   })
    // },
    // moveNode(node, data) {
    //   this.isRefreshRootNode = true
    //   this.parentNode = node
    //   this.migrationVisible = true
    // },
    // removeNode(node, data) {
    //   this.$confirm('确定要删除?', '提示', {
    //     confirmButtonText: '确定',
    //     cancelButtonText: '取消',
    //     type: 'warning'
    //   }).then(() => {
    //     var _ownObj = this
    //     var $url = '/autotest-task/task/deleteTaskNode'
    //     var obj = {}
    //     obj.id = data.id
    //     _ownObj.parentId = data.parentId
    //     _ownObj.parentNode = node.parent
    //     _ownObj.axios.post($url, obj).then(response => {
    //       if (response.respResult == '1') {
    //         _ownObj.$message.success('删除成功')
    //         if (_ownObj.$refs.tree.getCurrentKey() === _ownObj.selectedNodeId) {
    //           _ownObj.showTaskInfo = false
    //         }
    //         _ownObj.updateTreeNode()
    //         setTimeout(() => {
    //           this.$refs.tree.setCurrentKey(_ownObj.parentId)
    //         }, 500)
    //       }
    //     })
    //   })
    // },
    // updateTreeNode() {
    //   // 刷新数据
    //   this.parentNode.childNodes = []
    //   if (this.parentNode != null && this.parentNode.resolve != null) {
    //     this.loadNode(this.parentNode, this.parentNode.resolve)
    //   }
    // },

    // updateChildren(node, data) {
    //   // 刷新数据
    //   node.childNodes = []
    //   this.loadNode(node, node.resolve)
    // },
    // handleNodeClick(data, node, obj) {
    //   this.tabName = 'taskTab'
    //   this.clearTaskForm()
    //   if (data.type === '2') {
    //     this.selectedNodeId = data.id
    //     this.showTaskInfo = true
    //     this.taskId = data.id
    //     this.getNodeById(data.id)
    //     this.$set(this.taskInfo, 'taskId', data.id)
    //     this.$set(this.taskInfo, 'projectId', this.projectId)
    //     this.$set(this.taskInfo, 'deptInfo', this.deptInfo)
    //     this.getTaskInfo()
    //   } else {
    //     this.selectedNodeId = null
    //     this.showTaskInfo = false
    //     this.disabledType = false
    //   }
    // },

    // getTaskInfo() {
    //   var _ownObj = this
    //   if (_ownObj.strategies == null || _ownObj.strategies.length < 1) {
    //     _ownObj.queryStrategy()
    //   }
    //   var $url = '/autotest-task/task/getTaskData'
    //   var obj = {}
    //   obj.id = _ownObj.selectedNodeId
    //   _ownObj.axios.post($url, obj).then(response => {
    //     if (response.respResult == '1') {
    //       var data = response.respData
    //       if (data.isCoverage === null) {
    //         data.isCoverage = 0
    //       }
    //       if (data.isSecurity === null) {
    //         data.isSecurity = 0
    //       }
    //       _ownObj.taskForm = data
    //       _ownObj.taskName = data.taskName
    //       _ownObj.setDefaultStratedy()
    //       if (_ownObj.taskForm.taskStatus == null || _ownObj.taskForm.taskStatus == undefined) {
    //         _ownObj.hideElment()
    //       } else {
    //         _ownObj.changeStrategyType()
    //       }
    //     }
    //   })
    // },
    // closeNodeType() {
    //   this.folderForm = {
    //     taskType: this.folderForm.taskType
    //   }
    //   this.folderId = null
    //   this.folderVisible = false
    //   this.nodeTypeVisible = false
    //   this.$refs['folderForm'].resetFields()
    // },
    // submitFolder(formName) {
    //   var _ownObj = this
    //   _ownObj.$refs[formName].validate(valid => {
    //     if (valid) {
    //       _ownObj.submitFolderLoding = true
    //       var $url = ''
    //       _ownObj.folderForm.parentId = _ownObj.parentId
    //       _ownObj.folderForm.projectId = _ownObj.projectId
    //       if (_ownObj.nodeTitle == '新增节点') {
    //         $url = '/autotest-task/task/saveTaskNode'
    //         _ownObj.folderForm.id = null
    //       } else if (_ownObj.nodeTitle == '修改节点') {
    //         $url = '/autotest-task/task/updateTaskNode'
    //         _ownObj.folderForm.id = _ownObj.folderId
    //       }
    //       _ownObj.axios
    //         .post($url, _ownObj.folderForm)
    //         .then(response => {
    //           if (response.respResult == '1') {
    //             _ownObj.taskName = response.respData.taskName
    //             if (_ownObj.folderId == null) {
    //               _ownObj.$message.success('添加成功')
    //               if (_ownObj.folderForm.type == '2' || _ownObj.folderForm.type == 2) {
    //                 _ownObj.showTaskInfo = true
    //                 _ownObj.selectedNodeId = response.respData.id
    //                 _ownObj.setDefaultStratedy()
    //                 _ownObj.hideElment()
    //               } else {
    //                 _ownObj.showTaskInfo = false
    //               }
    //             } else {
    //               _ownObj.$message.success('修改成功')
    //             }
    //             _ownObj.updateTreeNode()
    //             setTimeout(() => {
    //               _ownObj.$refs.tree.setCurrentKey(response.respData.id)
    //               _ownObj.taskId = response.respData.id
    //               _ownObj.$set(_ownObj.taskInfo, 'taskId', response.respData.id)
    //               _ownObj.$set(_ownObj.taskInfo, 'deptInfo', _ownObj.deptInfo)
    //             }, 500)
    //             if (_ownObj.folderId == null) {
    //               _ownObj.expandedData.push(_ownObj.parentId)
    //             }
    //             _ownObj.nodeTypeVisible = false
    //           }
    //         })
    //         .finally(() => {
    //           _ownObj.submitFolderLoding = false
    //         })
    //     }
    //   })
    // },
    // clearTaskForm() {
    //   this.taskForm = {}
    //   this.$refs['taskForm'].resetFields()
    // },
    // saveTaskInfo(formName) {
    //   var _ownObj = this
    //   var $url = '/autotest-task/task/updateTaskInfo'
    //   _ownObj.$refs[formName].validate(valid => {
    //     if (valid) {
    //       // 校验定时时间
    //       if (_ownObj.taskForm.executeStrategy === 'time') {
    //         var time = new Date(_ownObj.taskForm.executeDateTime).getTime()
    //         var currentTime = new Date().getTime() + 10 * 60 * 1000
    //         if (time <= currentTime) {
    //           _ownObj.$message({
    //             showClose: true,
    //             message: '定时时间必须大于10分钟后',
    //             type: 'warning'
    //           })
    //           return false
    //         }
    //       }
    //       _ownObj.saveTaskLoading = true
    //       _ownObj.taskForm.id = _ownObj.selectedNodeId
    //       _ownObj.taskForm.taskName = _ownObj.taskName
    //       _ownObj.axios
    //         .post($url, _ownObj.taskForm)
    //         .then(response => {
    //           if (response.respResult === '1') {
    //             _ownObj.$message.success('操作成功')
    //             _ownObj.taskForm = response.respData
    //           }
    //         })
    //         .finally(() => {
    //           _ownObj.saveTaskLoading = false
    //         })
    //     }
    //   })
    // },
    // queryStrategy() {
    //   var _ownObj = this
    //   var $url = '/autotest-task/task/getInitData'
    //   _ownObj.axios.post($url, {}).then(response => {
    //     if (response.respResult == '1') {
    //       var data = response.respData
    //       _ownObj.strategies = data.strategyType
    //       _ownObj.taskTypes = data.taskType
    //     }
    //   })
    // },
    // getInitData() {
    //   var _ownObj = this
    //   for (var index = 1; index <= 31; index++) {
    //     var dayData = {}
    //     if (index < 10) {
    //       dayData.dictKey = '0' + index
    //     } else {
    //       dayData.dictKey = index
    //     }
    //     dayData.dictValue = index + '日'
    //     _ownObj.days.push(dayData)
    //   }
    // },
    // changeStrategyType() {
    //   var _ownObj = this
    //   var type = _ownObj.taskForm.executeStrategy
    //   _ownObj.hideElment()
    //   // if (type == 'now') {
    //   //   // _ownObj.hideElment()
    //   // } else
    //   if (type == 'time') {
    //     // _ownObj.hideElment()
    //     _ownObj.showDateTime = true
    //   } else if (type == 'month') {
    //     // _ownObj.hideElment()
    //     _ownObj.showDay = true
    //     _ownObj.showTime = true
    //   } else if (type == 'week') {
    //     // _ownObj.hideElment()
    //     _ownObj.showWeek = true
    //     _ownObj.showTime = true
    //   } else if (type == 'day') {
    //     // _ownObj.hideElment()
    //     _ownObj.showTime = true
    //   } else if (type == 'hour' || type == 'minute') {
    //     // _ownObj.hideElment()
    //     _ownObj.showInterval = true
    //   }
    // },
    // hideElment() {
    //   var _ownObj = this
    //   _ownObj.showTime = false
    //   _ownObj.showWeek = false
    //   _ownObj.showDay = false
    //   _ownObj.showDateTime = false
    //   _ownObj.showInterval = false
    // },
    // setDefaultStratedy() {
    //   var _ownObj = this
    //   if (
    //     _ownObj.taskForm.executeStrategy == null ||
    //     _ownObj.taskForm.executeStrategy == undefined
    //   ) {
    //     _ownObj.$set(_ownObj.taskForm, 'executeStrategy', 'now')
    //   }
    // },
    // showHis(node, data) {
    //   this.hisDialogVisable = true
    //   this.objectId = data.id
    // },
    // changeDept(value) {
    //   this.isAutoTestAdmin = value.isAdmin
    //   this.projectId = value.projectId
    //   this.projectType = value.projectType
    //   this.projectName = value.projectName
    //   this.projectPermission = value.hasPermission
    //   this.taskList = [
    //     {
    //       id: '0',
    //       name: this.projectName,
    //       parentId: '0',
    //       projectId: this.projectId,
    //       type: '1',
    //       leaf: false
    //     }
    //   ]
    //   this.updateChildren(this.rootNode, null)
    //   this.showTaskInfo = false
    // },
    // executeRightNow() {
    //   var _ownObj = this
    //   var $url = '/autotest-task/task/executeRightNow'
    //   var taskObj = {}
    //   taskObj.taskId = _ownObj.taskId
    //   _ownObj.axios
    //     .post($url, _ownObj.taskForm)
    //     .then(response => {
    //       if (response.respResult === '1') {
    //         _ownObj.$message.success('执行成功')
    //       }
    //     })
    //     .finally(() => {
    //       _ownObj.saveTaskLoading = false
    //     })
    // }
  }
}
</script>
