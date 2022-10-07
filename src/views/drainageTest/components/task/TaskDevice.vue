<template>
  <div>
    <el-container>
      <el-aside width="20%" style="height:calc(100vh - 168px)">
        <deviceObject :device-prop="deviceProp" @emitData="saveTaskDevice" />
      </el-aside>
      <el-main>
        <el-divider><span style="font-weight:bold;">已选设备</span></el-divider>
        <div style="padding-top:5px;">
          <el-form ref="searchForm" :model="searchForm" inline>
            <el-form-item>
              <el-input
                v-model="searchForm.machineIp"
                placeholder="执行机IP"
                clearable
                style="width: 270px;"
              />
            </el-form-item>
            <el-button
              type="primary"
              icon="el-icon-search"
              size="mini"
              @click="pageQueryDevice(1)"
            >搜索</el-button>
          </el-form>
          <el-table v-loading="loading" :data="deviceData" border size="mini">
            <el-table-column prop="number" type="index" label="序号" width="60" align="center" />
            <el-table-column
              prop="deviceName"
              label="设备名称"
              min-width="120"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="deviceType"
              label="设备类型"
              min-width="120"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column
              prop="machineIp"
              label="设备地址"
              min-width="100"
              align="center"
              show-overflow-tooltip
            />
            <el-table-column prop="xx" label="操作" min-width="120" align="center">
              <template slot-scope="{ row }">
                <el-button
                  icon="el-icon-delete"
                  type="text"
                  title="删除"
                  @click="handleDelete(row)"
                />
              </template>
            </el-table-column>
          </el-table>

          <div class="block" style="text-align: center">
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
          </div>
        </div>
      </el-main>
    </el-container>
  </div>
</template>
<script>
export default {
  components: {
    deviceObject: () => import('@/views/autotest/baseconfig/common/DeviceTree.vue')
  },
  props: {
    taskId: String
  },
  data() {
    return {
      currentTaskId: '',
      pageIndex: 1,
      pageSize: 10,
      deviceData: [],
      loading: false,
      deviceProp: {
        isNeedCheckButton: true
      },
      totals: 0,
      searchForm: {
        machineIp: ''
      }
    }
  },
  watch: {
    taskId: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal != null && newVal != '') {
          this.currentTaskId = newVal
          this.clearForm()
          this.pageQueryDevice(null)
        }
      }
    }
  },
  methods: {
    handleDelete(row) {
      var id = row.id
      var $url = '/autotest-task/taskDevice/deleteTaskDevice'
      var deleteObj = {}
      deleteObj.id = id
      var _ownObj = this
      _ownObj.$http.post($url, deleteObj).then(response => {
        if (response.respResult == '1') {
          _ownObj.$message.success('删除成功')
          _ownObj.pageQueryDevice(1)
        }
      })
    },
    dealPageSizeChange(v_pageSize) {
      var _ownObj = this
      _ownObj.pageSize = v_pageSize
      _ownObj.pageQueryDevice(null)
    },
    dealPageIndexChange(v_pageIndex) {
      var _ownObj = this
      if (_ownObj.totals != 0) {
        _ownObj.pageIndex = v_pageIndex
        _ownObj.pageQueryDevice(v_pageIndex)
      }
    },
    pageQueryDevice(v_pageIndex) {
      var _ownObj = this
      _ownObj.loading = true
      if (v_pageIndex != null && v_pageIndex != '') {
        _ownObj.pageIndex = v_pageIndex
      }
      _ownObj.searchForm.taskId = _ownObj.currentTaskId
      _ownObj.searchForm.pageIndex = _ownObj.pageIndex
      _ownObj.searchForm.pageSize = _ownObj.pageSize
      var $url = '/autotest-task/taskDevice/querySelectedDevice'
      _ownObj.$http
        .post($url, _ownObj.searchForm)
        .then(response => {
          if (response.respResult == '1') {
            var data = response.respData
            _ownObj.deviceData = data.records
            _ownObj.totals = response.dataTotalCount
          }
        })
        .finally(() => {
          _ownObj.loading = false
        })
    },
    saveTaskDevice(row) {
      var taskDeviceObj = {}
      var _ownObj = this
      taskDeviceObj.taskId = _ownObj.currentTaskId
      taskDeviceObj.deviceId = row.deviceId
      var $url = '/autotest-task/taskDevice/saveTaskDevice'
      _ownObj.axios.post($url, taskDeviceObj).then(response => {
        if (response.respResult == '1') {
          _ownObj.$message.success('操作成功')
          _ownObj.pageQueryDevice(1)
        }
      })
    },
    clearForm() {
      this.searchForm = {}
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep {
  .el-divider--horizontal {
    margin: 10px 0;
  }
}
</style>
