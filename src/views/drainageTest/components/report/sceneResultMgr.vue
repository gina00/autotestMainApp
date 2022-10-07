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
import sceneResult from '@/views/drainageTest/components/report/sceneResult.vue'
import sceneTestResult from '@/views/drainageTest/components/report/sceneTestResult'
export default {
  components: {
    sceneResult,
    sceneTestResult
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
      componentId: 'sceneResult',
      editableTabs: [{
        title: '场景报告列表',
        name: '1'
      }],
      tabIndex: 2,
      paramDataRow: {},
      result: {}
    }
  },
  watch: {
    tabsValue() {
      if (this.tabsValue == '2') {
        this.editableTabsValue = '1'
        this.componentId = 'sceneResult'
      }
    }
  },
  methods: {
    // handleTabsEdit(targetName, action) {
    //   if (action === 'add') {
    //     const newTabName = ++this.tabIndex + ''
    //     this.editableTabs.push({
    //       title: 'New Tab',
    //       name: newTabName,
    //       content: 'New Tab content'
    //     })
    //     this.editableTabsValue = newTabName
    //   }
    //   if (action === 'remove') {
    //     const tabs = this.editableTabs
    //     let activeName = this.editableTabsValue
    //     if (activeName === targetName) {
    //       tabs.forEach((tab, index) => {
    //         if (tab.name === targetName) {
    //           const nextTab = tabs[index + 1] || tabs[index - 1]
    //           if (nextTab) {
    //             activeName = nextTab.name
    //           }
    //         }
    //       })
    //     }

    //     this.editableTabsValue = activeName
    //     this.editableTabs = tabs.filter(tab => tab.name !== targetName)
    //   }
    // }
    // 子组件查看详情抛出状态，增加页签并查询
    submitStatus(val) {
      if (val.status == 'showTaskSceneDetail') {
        var newItem = {
          title: '执行详情',
          name: '2'
        }
        if (!this.ListContainsObj(this.editableTabs, newItem)) {
          this.editableTabs.push(newItem)
        }
        this.editableTabsValue = '2'
        this.componentId = 'sceneTestResult'
        this.paramDataRow = val.row
        this.paramDataRow.gotoQuery = 'query'
        window.console.log(val)
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
        this.componentId = 'sceneResult'
      } else if (tab.name == '2') {
        this.componentId = 'sceneTestResult'
      }
    }
  }
}
</script>

<style>

</style>
