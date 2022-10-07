<template>
  <div class="page">
    <p style="margin-bottom:10px">全局监控指标配置</p>
    <div class="targetCard">
      <el-card
        v-for="(item, index) in targetCardList"
        :key="index"
        class="targetCardItem"
        shadow="always"
      >
        <div class="itemContent">
          <div class="block">
            <span class="avatar avatar-circle medium avatar--bg" :class="item.className">
              <i :class="item.icon" style="font-size:24px" />
            </span>
          </div>
          <div class="textPanel">
            <span class="nameStyle">{{ item.titleName }}</span>
            <!-- <span class="valueStyle">{{ item.value }}</span> -->
          </div>
        </div>
      </el-card>
    </div>
    <el-row>
      <div class="titleAndOperation">
        <span>监控例外（不监控）</span>
        <div>
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="clickShowDialog('add', {})"
          >
            新增
          </el-button>
        </div>
      </div>
      <el-table
        v-loading="loading"
        class="commonHeight"
        :data="tableData.slice((page.pageNum - 1) * page.pageSize, page.pageNum * page.pageSize)"
        border
        style="width: 100%;height:calc(100vh - 360px)"
      >
        <!-- <el-table-column type="selection" width="50" /> -->
        <el-table-column label="序号" type="index" width="50" />
        <el-table-column prop="reqType" label="请求类型" min-width="180" align="center">
          <template slot-scope="scope">
            {{ ruleOptionsMap.get(scope.row.reqType)?ruleOptionsMap.get(scope.row.reqType).label:'' }}
          </template>
        </el-table-column>
        <el-table-column prop="functionCode" label="业务/服务/功能号" min-width="180" align="center" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-edit"
              title="编辑"
              @click="clickShowDialog('edit',scope.row)"
            />
            <el-button
              type="text"
              icon="el-icon-delete"
              title="删除"
              @click="removeData(scope.row.$index,tableData)"
            />
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
    </el-row>

    <el-dialog
      ref="drawer"
      :title="drawerData.title"
      :visible.sync="drawerData.visible"
      width="60%"
    >
      <component
        :is="componentId"
        ref="currentDrawer"
        :param-data="drawerData.data"
        @submitStatus="submitStatus"
      />
    </el-dialog>
  </div>

</template>

<script>
import { dict, getMonitorData, remove } from '@/api/drainage-test'
import MonitorForm from '@/views/drainageTest/components/monitorForm.vue'
export default {
  components: {
    MonitorForm
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
      ruleOptions: [],
      targetCardList: [
        // {
        //   id: 'sampleCount',
        //   titleName: '样本总数',
        //   value: 0,
        //   className: 'totalNum',
        //   icon: 'el-icon-money'
        // },
        {
          id: 'throughput',
          titleName: '最大响应时间',
          value: 0,
          className: 'transactions',
          icon: 'el-icon-data-analysis'
        },
        {
          id: 'errorPct',
          titleName: '错误率',
          value: 0,
          className: 'error',
          icon: 'el-icon-document-delete'
        },
        {
          id: 'meanResTime',
          titleName: '平均响应时间(毫秒)',
          value: 0,
          className: 'averageResponse',
          icon: 'el-icon-odometer'
        }
      ]
    }
  },
  computed: {
    ruleOptionsMap: function() {
      const objMap = new Map()
      this.ruleOptions.forEach(element => {
        objMap.set(element.value, element)
      })
      return objMap
    }
  },
  mounted() {
    this.getData()
    this.getDictData()
  },
  methods: {
    getDictData() {
      dict().then(response => {
        this.ruleOptions = response.data[3]
      })
    },
    getData() {
      this.loading = true
      getMonitorData().then(response => {
        this.tableData = response.data
        this.page.totals = response.total
      }).finally(() => {
        this.loading = false
      })
    },
    // 根据不同的点击操作显示不同的弹窗
    clickShowDialog(clickType, data) {
      this.drawerData.visible = !this.drawerData.visible
      if (clickType == 'add') {
        this.componentId = 'MonitorForm'
        this.drawerData.title = '新增监控例外'
        this.drawerData.data = {}
        this.drawerData.data.clickType = 'add'
      } else if (clickType == 'edit') {
        this.componentId = 'MonitorForm'
        this.drawerData.title = '编辑监控例外'
        this.drawerData.data = data
        this.drawerData.data.clickType = 'edit'
      }
    },
    submitStatus(val) {
      if (val.status == 'success') {
        // 点击确定修改后返回
        this.drawerData.visible = !this.drawerData.visible
        if (this.drawerData.data.clickType == 'add') {
          this.tableData.unshift(val.row)
        }
        // this.clickDataMap.set(this.drawerData.clickCount, val.row)
        // this.query()
      } else {
        // // 点击取消
        this.drawerData.visible = !this.drawerData.visible
        const currentDrawer = this.$refs['currentDrawer']
        currentDrawer.initForm()
      }
    },
    removeData(index, tableData) {
      this.$confirm('确定要删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        remove().then(response => {
          if (response.code === 20000) {
            this.$message.success('删除成功')
            tableData.splice(index, 1)
          }
        })
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
.targetCard {
    display: flex;
    margin-bottom: 20px;
    .targetCardItem {
      width: calc(100% - 20px);
      margin-right: 20px;
    } /* 去除每行尾的多余边距 */
    .targetCardItem:last-child {
      margin-right: 0;
    }
    .itemContent {
      display: flex;
      .block {
        border-right: 1px solid rgba(224, 230, 237, 0.5);
        .avatar {
          display: inline-block;
          box-sizing: border-box;
          text-align: center;
          overflow: hidden;
          color: #fff;
          background: #c0c4cc;
          width: 40px;
          height: 40px;
          line-height: 40px;
          font-size: 14px;
          margin-right: 20px;
          img {
            height: 100%;
            vertical-align: middle;
          }
        }
        .avatar-circle {
          border-radius: 50%;
        }
        .avatar-square {
          border-radius: 4px;
        }
        .medium {
          height: 50px;
          width: 50px;
          line-height: 50px;
        }
        .avatar--bg {
          display: flex;
          align-items: center;
          justify-content: center;
        }
        // 背景颜色设置
        .totalNum {
          background: #9694ff;
        }
        .error {
          background: #ff7976;
        }
        .transactions {
          background: #5ddab4;
        }
        .averageResponse {
          background: #57caeb;
        }
      }
      .textPanel {
        display: flex;
        flex-direction: column;
        justify-content: center;
        margin-left: 20px;

        .valueStyle {
          font-size: 24px;
          font-weight: bold;
          color: #666;
        }
        .nameStyle {
          font-weight: bold;
          font-size: 14px;
          color: #999;
          margin-bottom: 8px;
        }
      }
    }
}
</style>
