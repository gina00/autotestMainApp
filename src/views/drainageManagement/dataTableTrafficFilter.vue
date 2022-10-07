<template>
  <div class="page baseDataPanel">
    <el-row :gutter="20">
      <el-col :span="span">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <el-form ref="form" inline :model="formData">
              <el-form-item label="同步时间">
                <el-date-picker
                  v-model="formData.synchronousDate"
                  type="date"
                  placeholder="选择日期"
                />
              </el-form-item>
              <el-form-item>
                <el-button
                  style="float: right;"
                  type="primary"
                  size="small"
                  :disabled="logCountDisabeled"
                  @click="start()"
                >
                  流量复制
                </el-button>
              </el-form-item>
            </el-form>

          </div>
          <el-row :gutter="20">
            <el-col :span="12" style="border-right:1px solid #eeeeee">
              <el-checkbox v-model="checked1" @change="pickAll('tree1',checked1)">配置类</el-checkbox>
              <el-tree
                ref="tree1"
                :data="data"
                show-checkbox
                node-key="id"
                :expand-on-click-node="false"
                :default-expanded-keys="[...defaultExpandedKey]"
              />
            </el-col>
            <el-col :span="12">
              <el-checkbox v-model="checked2" @change="pickAll('tree2',checked2)">用户资料类</el-checkbox>
              <el-tree
                ref="tree2"
                :data="data2"
                show-checkbox
                node-key="id"
                :expand-on-click-node="false"
                :default-expanded-keys="[...defaultExpandedKey2]"
              />
            </el-col>
          </el-row>
          <!-- </el-card></div></el-card> -->
        </el-card>
        <el-form ref="form" :model="form" label-width="120px" style="margin-top:20px">
          <el-form-item label="目标库">
            <el-select v-model="form.targetUser" placeholder="请选择用户模式" style="width:200px;">
              <el-option v-for="(item,index) in targetUserList" :key="index" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col v-if="showlogPanel" :span="24-span">
        <log-panel
          ref="logPanel"
          :start-now-time="startNowTime"
          :query-log-type="queryLogType"
          :showlog-panel="showlogPanel"
          :file-name="fileName"
          :start-click="startClick"
          @closeLogPanel="closeLogPanel"
          @watchLogCount="watchLogCount"
        />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { pageQueryTree, dict } from '@/api/drainage-test'
import logPanel from '@/views/drainageManagement/logPanel.vue'
export default {
  components: {
    logPanel
  },
  data() {
    const data = [{
      id: 1,
      label: '一级 1',
      children: [{
        id: 4,
        label: '二级 1-1',
        children: [{
          id: 9,
          label: '三级 1-1-1'
        }, {
          id: 10,
          label: '三级 1-1-2'
        }]
      }]
    }, {
      id: 2,
      label: '一级 2',
      children: [{
        id: 5,
        label: '二级 2-1'
      }, {
        id: 6,
        label: '二级 2-2'
      }]
    }, {
      id: 3,
      label: '一级 3',
      children: [{
        id: 7,
        label: '二级 3-1'
      }, {
        id: 8,
        label: '二级 3-2'
      }]
    }]
    return {
      formData: {
        synchronousDate: ''
      },
      fileName: '',
      startNowTime: '',
      span: 24,
      showlogPanel: false,
      queryLogType: null,
      checked1: false,
      checked2: false,
      data: JSON.parse(JSON.stringify(data)),
      data2: JSON.parse(JSON.stringify(data)),
      defaultExpandedKey: null,
      defaultExpandedKey2: null,
      logCountDisabeled: false,
      startClick: 0,
      form: {
        targetUser: ''
      },
      targetUserList: []
    }
  },
  mounted() {
    this.getData()
    this.getDictData()
  },
  methods: {
    getDictData() {
      dict().then(response => {
        this.targetUserList = response.data[7]
      })
    },
    getData() {
      this.formData.synchronousDate = this.$dayjs().format('YYYY-MM-DD')
      this.loading = true
      pageQueryTree().then(response => {
        this.data = JSON.parse(JSON.stringify(response.data))
        this.defaultExpandedKey = this.data[0].id
        this.data2 = JSON.parse(JSON.stringify(response.data))
        this.defaultExpandedKey2 = this.data2[0].id
      }).finally(() => {
        this.loading = false
      })
    },
    start() {
      if (!this.form.targetUser) {
        this.$message.warning('请选择目标库！')
        return
      }
      this.startClick = this.startClick + 1
      this.queryLogType = 8
      this.showlogPanel = true
      this.startNowTime = this.$dayjs().format('HH:mm:ss')
      this.fileName = '数据表流量复制 '
      this.span = 16
    },
    watchLogCount(val) {
      if (val == 10) {
        this.logCountDisabeled = false
      } else {
        this.logCountDisabeled = true
      }
    },
    closeLogPanel(val) {
      this.queryLogType = null
      this.showlogPanel = false
      this.logCountDisabeled = false
      this.span = 24
    },
    setCheckedKey() {

    },
    /**
     * 全选 el-tree 节点
     */
    // 全选
    selectAllNodes: function(tree, data) {
      //  获取根节点
      const rootNode = tree.getNode(data[0].id).parent
      travelNodes(rootNode)
      function travelNodes(tmpRoot) {
        // 选中该节点
        tmpRoot.checked = true
        // 叶子节点
        if (tmpRoot.childNodes.length === 0) {
          return
        // eslint-disable-next-line brace-style
        }
        // 不是叶子节点,递归遍历
        else {
          const tmpChildNoes = tmpRoot.childNodes
          for (let i = 0; i < tmpChildNoes.length; i++) {
            travelNodes(tmpChildNoes[i])
          }
        }
      }
    },
    // 清空
    clearAllNodes: function(tree) {
      tree.setCheckedKeys([])
    },
    pickAll(treeName, checkedStatus) {
      const treeObj = this.$refs[treeName]
      if (checkedStatus) {
        this.selectAllNodes(treeObj, this.data)
      } else {
        this.clearAllNodes(treeObj)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.baseDataPanel{
  .el-form-item {
      margin-bottom: 0px !important;
  }
}
</style>
