<template>
  <div>
    <div class="titleAndOperation">
      <span>已解析入库功能号列表</span>
      <div>
        <el-button
          type="primary"
          size="small"
          :disabled="btnClickDisabled"
          @click="startFlowExtract()"
        >
          开始清理
        </el-button>
      </div>

    </div>
    <el-row :gutter="20" class="tab2ElRowClass">
      <el-col v-for="(item,index) in tableData" :key="index" :span="3">
        <span>{{ item.flowTaskName }}</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { cleanUpTab3List } from '@/api/drainage-test'

export default {
  components: {
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
      cleanUpTab3List().then(response => {
        this.tableData = response.data
      }).finally(() => {
        this.loading = false
      })
    },
    submitStatus(val) {
      if (val.status == 'success') {
        // 点击确定修改后返回
        this.drawerData.visible = !this.drawerData.visible
        this.tableData.push(val.row)
        // this.clickDataMap.set(this.drawerData.clickCount, val.row)
        // this.query()
      } else {
        // // 点击取消
        this.drawerData.visible = !this.drawerData.visible
        const currentDrawer = this.$refs['currentDrawer']
        currentDrawer.initForm()
      }
    },
    submitSelect(selectDataArr) {
      this.$emit('submitSelect', { status: 'success', rows: selectDataArr, startClick: this.startClick })
    },
    startFlowExtract() {
      this.startClick = this.startClick + 1
      this.submitSelect(this.tableData)
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
  .tab2ElRowClass{
    overflow: auto;
    border-top: 1px solid #dfe6ec;
    border-left: 1px solid #dfe6ec;
    margin-left: 0 !important;
    margin-right: 0 !important;
    .el-col-3 {
      border-bottom: 1px solid #dfe6ec;
      border-right: 1px solid #dfe6ec;
      padding: 20px;
    }
  }

</style>
