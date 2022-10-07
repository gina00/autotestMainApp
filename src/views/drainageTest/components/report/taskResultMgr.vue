<template>
  <div>
    <el-tabs v-model="editableTabsValue" @tab-click="changeTabs">
      <el-tab-pane
        v-for="(item, index) in editableTabs"
        :key="index"
        :label="item.title"
        :name="item.name"
      >
        <!-- {{ item.content }} -->
        <component :is="componentId" :param-data-row="paramDataRow" :result="result" @submitStatus="submitStatus" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import { bussinessTableData, severTableData, getCompareRulesInfor } from '@/api/drainage-test'
import TaskResult from '@/views/drainageTest/components/report/taskResult.vue'
import taskSceneDetail from '@/views/drainageTest/components/report/taskSceneDetail.vue'
import testResult from '@/views/drainageTest/components/report/taskTestResult'
export default {
  components: {
    TaskResult,
    taskSceneDetail,
    testResult
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    tabsValue: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      editableTabsValue: '1',
      componentId: 'TaskResult',
      editableTabs: [{
        title: '任务报告列表',
        name: '1'
      }],
      tabIndex: 2,
      paramDataRow: {},
      result: {}
    }
  },
  watch: {
    tabsValue() {
      if (this.tabsValue == '1') {
        this.editableTabsValue = '1'
        this.componentId = 'TaskResult'
      }
    }
  },
  methods: {

    // 子组件查看详情抛出状态，增加页签并查询
    submitStatus(val) {
      if (val.status == 'showTaskScene') {
        var newItem = {
          title: '任务下场景报告列表',
          name: '2'
        }
        if (!this.ListContainsObj(this.editableTabs, newItem)) {
          this.editableTabs.push(newItem)
        }
        this.editableTabsValue = '2'
        this.componentId = 'taskSceneDetail'
        this.paramDataRow = val.row
        this.paramDataRow.gotoQuery = 'query'
        window.console.log(val)
      } else if (val.status == 'showTaskSceneDetail') {
        debugger
        var newItem2 = {
          title: '执行详情',
          name: '3'
        }
        if (!this.ListContainsObj(this.editableTabs, newItem2)) {
          this.editableTabs.push(newItem2)
        }
        this.editableTabsValue = '3'
        this.componentId = 'testResult'
        this.result = val.row
        this.result.gotoQuery = 'query'
      }
    },
    // 数组是否包含对象
    ListContainsObj(a, obj) {
      if (a.length > 0) {
        for (var i = 0; i < a.length; i++) {
          if (JSON.stringify(a[i]) === JSON.stringify(obj)) {
            return true
          }
        }
        return false
      } else {
        return false
      }
    },
    changeTabs(tab) {
      if (tab.name == '1') {
        this.componentId = 'TaskResult'
      } else if (tab.name == '2') {
        this.componentId = 'taskSceneDetail'
      } else if (tab.name == '3') {
        this.componentId = 'testResult'
      }
    }
  }
}
</script>

<style>

</style>
