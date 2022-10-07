<template>
  <div class="page">
    <el-row>
      <el-form ref="form" inline :model="formData">
        <el-form-item prop="sceneCode" label="场景编号">
          <el-input
            v-model="formData.sceneCode"
            clearable
            maxlength="1024"
            type="text"
            placeholder="请输入场景编号"
          />
        </el-form-item>
        <el-form-item prop="sceneName" label="场景名称">
          <el-input
            v-model="formData.sceneName"
            clearable
            maxlength="1024"
            type="text"
            placeholder="请输入场景名称"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" @click="query">
            查询
          </el-button>
          <el-button size="small" @click="resetQuery"> 重置</el-button>
        </el-form-item>
        <el-form-item style="float:right;">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="clickShowDrawer('add', {})"
          >
            新增
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
    <el-table
      v-loading="loading"
      class="commonHeight"
      :data="tableData.slice((page.pageNum - 1) * page.pageSize, page.pageNum * page.pageSize)"
      border
      style="width: 100%"
    >
      <!-- <el-table-column type="selection" width="50" /> -->
      <el-table-column label="序号" type="index" width="50" align="center" />
      <el-table-column prop="sceneCode" label="场景编号" min-width="180" align="center" />
      <el-table-column prop="sceneName" label="场景名称" min-width="180" align="center">
        <!-- <template slot-scope="scope">
          {{ ruleTypeOptionsMap.get(scope.row.ruleType)?ruleTypeOptionsMap.get(scope.row.ruleType).label:'' }}
        </template> -->
      </el-table-column>
      <el-table-column prop="updateTime" label="更新日期" min-width="180" align="center" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-edit"
            title="编辑"
            @click="clickShowDrawer('edit',scope.row)"
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
    <el-drawer
      ref="drawer"
      :title="drawerData.title"
      :visible.sync="drawerData.visible"
      direction="rtl"
      custom-class="demo-drawer"
      :size="drawerData.size"
    >
      <component
        :is="componentId"
        ref="currentDrawer"
        :param-data="drawerData.data"
        @submitStatus="submitStatus"
      />
    </el-drawer>
  </div>
</template>

<script>
import { dict, drainageScene, remove } from '@/api/drainage-test'
import drainageSceneForm from '@/views/drainageTest/components/drainageSceneForm.vue'

export default {
  components: {
    drainageSceneForm
  },
  data() {
    return {
      loading: false,
      componentId: '',
      formData: {
        sceneCode: null,
        sceneName: null
      },
      ruleOptions: [],
      ruleTypeOptions: [],
      tableData: [],
      drawerData: {
        visible: false,
        title: '',
        size: '60%',
        data: {}
      },
      page: { pageNum: 1, pageSize: 10, totals: 0 },
      selectDataArr: []
    }
  },
  computed: {
    ruleOptionsMap: function() {
      const objMap = new Map()
      this.ruleOptions.forEach(element => {
        objMap.set(element.value, element)
      })
      return objMap
    },
    ruleTypeOptionsMap: function() {
      const objMap = new Map()
      this.ruleTypeOptions.forEach(element => {
        objMap.set(element.value, element)
      })
      return objMap
    }
  },
  mounted() {
    this.getDictData()
    this.query()
  },
  methods: {
    getDictData() {
      dict().then(response => {
        this.ruleOptions = response.data[1]
        this.ruleTypeOptions = response.data[2]
      })
    },
    query() {
      this.loading = true
      drainageScene().then(response => {
        this.tableData = response.data
        this.page.totals = response.total
      }).finally(() => {
        this.loading = false
      })
    },
    resetQuery() {},
    // 根据不同的点击操作显示不同的弹窗
    clickShowDrawer(clickType, data) {
      this.drawerData.visible = !this.drawerData.visible
      if (clickType == 'add') {
        this.componentId = 'drainageSceneForm'
        this.drawerData.title = '新增场景'
        this.drawerData.data = {}
        this.drawerData.data.clickType = 'add'
      } else if (clickType == 'edit') {
        this.componentId = 'drainageSceneForm'
        this.drawerData.title = '编辑场景'
        this.drawerData.data = data
        this.drawerData.data.clickType = 'edit'
      }
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
    submitStatus(val) {
      if (val.status == 'success') {
        if (this.drawerData.data.clickType == 'add') {
          val.row.sceneCode = '10000000000'
          this.tableData.unshift(val.row)
        }
        this.drawerData.visible = false
      } else if (val.status == 'showDialog') {
        this.drawerData.size = '80%'
      } else if (val.status == 'closeLogPanel') {
        this.drawerData.size = '60%'
      } else {
        this.drawerData.visible = false
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
    }
  }
}
</script>

<style lang='scss' scoped>
.page{
  padding: 20px;
}
</style>
