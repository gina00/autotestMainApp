<template>
  <div class="page">
    <el-tabs v-model="tabsValue" type="border-card">
      <el-tab-pane label="任务结果展示" name="1">
        <taskResultMgr :tabs-value="tabsValue" />
      </el-tab-pane>
      <el-tab-pane label="场景结果展示" name="2">
        <sceneResultMgr :tabs-value="tabsValue" />
      </el-tab-pane>
      <el-tab-pane label="业务健康典线" name="3">
        <chartMgr :tabs-value="tabsValue" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
// import { bussinessTableData, severTableData, getCompareRulesInfor } from '@/api/drainage-test'
import taskResultMgr from '@/views/drainageTest/components/report/taskResultMgr.vue'
import sceneResultMgr from '@/views/drainageTest/components/report/sceneResultMgr.vue'
import chartMgr from '@/views/drainageTest/components/chart/chartMgr.vue'
export default {
  components: {
    taskResultMgr,
    sceneResultMgr,
    chartMgr
  },
  data() {
    return {
      tabsValue: '1'
    }
  }
}
</script>

<style>

</style>
