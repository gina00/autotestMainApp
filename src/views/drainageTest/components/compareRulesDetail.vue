<template>
  <div style="padding:0 20px;">
    <el-row :gutter="20">
      <p style="margin-left:10px;color:red">同现有自动化平台--子系统配置中的输出参数的配置，支持节点自动生成，比较规则：只比节点，不比值， 比较节点+值</p>
    </el-row>
    <el-collapse v-model="activeNames">
      <el-collapse-item name="1">
        <template slot="title">
          <i class="header-icon el-icon-discount" />
          比对规则与功能号列表
        </template>
        <el-table
          v-loading="loading"
          :data="compareAndFunctionCodeList.slice((page1.pageNum - 1) * page1.pageSize, page1.pageNum * page1.pageSize)"
          border
        >
          <!-- <el-table-column label="序号" type="index" width="50" align="center" /> -->
          <el-table-column prop="compareRuleCode" label="比对规则编号" min-width="120" align="center" />
          <el-table-column prop="functionCode" label="业务/服务功能号" min-width="130" align="center" />
          <el-table-column prop="rulesSpecVal" label="规则特征值" min-width="180" align="center" />
          <el-table-column label="操作" min-width="180" align="center">
            <el-button type="text">查看详情</el-button>
          </el-table-column>
        </el-table>
        <div class="paginationLayout">
          <el-pagination
            style="float:right;margin-top:20px"
            :current-page="page1.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="page1.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page1.totals"
            @size-change="handleSizeChange1"
            @current-change="handleIndexChange1"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item name="2">
        <template slot="title">
          <i class="header-icon el-icon-discount" />
          关键节点信息配置详情
        </template>
        <el-descriptions class="margin-top" :column="2" :size="size" border>
          <el-descriptions-item>
            <template slot="label">
              业务/服务功能
            </template>
            <span>{{ paramData[0].functionCode }}</span>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">
              更新日期
            </template>
            <span>{{ paramData[0].updateTime }}</span>
          </el-descriptions-item>
        </el-descriptions>
        <el-table
          ref="customColumnTable"
          :data="paramData[0].children.slice((page2.pageNum - 1) * page2.pageSize, page2.pageNum * page2.pageSize)"
          border
          :loading="loading"
          width="100%"
          row-key="id"
          style="margin-top:10px"
        >
          <el-table-column
            prop="paramName"
            label="参数名称"
            min-width="100"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column prop="occurrenceSort" label="出现次序" min-width="60" align="center" />
          <el-table-column
            prop="paramDesc"
            label="参数说明"
            min-width="80"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column
            prop="paramPath"
            label="xpath路径"
            min-width="110"
            align="center"
            show-overflow-tooltip
          />
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="{ $index, row }">
              <el-button
                icon="el-icon-plus"
                type="text"
                title="添加"
                @click="addParamOutEvent($index,'add')"
              />
              <el-button
                icon="el-icon-edit"
                type="text"
                title="修改"
                @click="handleParamOutEdit(row,'edit')"
              />
              <el-button
                icon="el-icon-delete"
                type="text"
                title="删除"
                @click="handleParamOutDelete($index, paramData[0].children)"
              />
            </template>
          </el-table-column>
        </el-table>
        <div class="paginationLayout">
          <el-pagination
            style="float:right;margin-top:20px"
            :current-page="page2.pageNum"
            :page-sizes="[10, 20, 50, 100]"
            :page-size="page2.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page2.totals"
            @size-change="handleSizeChange2"
            @current-change="handleIndexChange2"
          />
        </div>
      </el-collapse-item>
      <el-collapse-item name="3">
        <template slot="title">
          <i class="header-icon el-icon-discount" />
          响应报文
        </template>
        <div>
          <el-form ref="paramOutForm" :model="checkOutForm">
            <el-row>
              <el-col>
                <el-form-item prop="responseMessage">
                  <el-input
                    v-model="checkOutForm.responseMessage"
                    type="textarea"
                    placeholder="请输入应答报文模板"
                    :rows="23"
                    style="margin-top:15px"
                  />
                </el-form-item>
              </el-col>
            </el-row>
            <el-row />
          </el-form>
          <div slot="footer" class="dialog-footer" style="float:right;margin-bottom:20px">
            <el-button
              @click="formatMessage('out')"
            >格式化</el-button>
            <el-button
              type="primary"
              @click="generateParamOut"
            >生成检查点</el-button>
          </div>
        </div>
      </el-collapse-item>

    </el-collapse>
    <!-- 生成检查的弹窗 -->
    <el-dialog
      title="选择输出参数"
      :visible.sync="choseParamOutVisible"
      width="820px"
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="closeParamOutTable"
    >
      <el-table
        ref="chooseParamOut"
        border
        size="mini"
        height="600"
        :data="paramOutData"
      >
        <el-table-column type="selection" width="60" align="left" />
        <el-table-column prop="paramName" label="节点名称" width="100" align="left" />
        <el-table-column
          prop="paramValue"
          label="节点值"
          width="100"
        />
        <el-table-column
          prop="occurrenceSort"
          label="出现次序"
          width="100"
          align="left"
        />
        <el-table-column
          prop="paramPath"
          label="xpath路径"
          width="100"
          align="left"
        />
        <el-table-column width="100" align="left" label="是否无序">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.disorder" active-text="是" />
          </template>
        </el-table-column>
        <el-table-column width="100" align="left" label="是否校验">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.needChecked" active-text="是" />
          </template>
        </el-table-column>
        <el-table-column width="100" align="left" label="是否存在">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.existed" active-text="是" />
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeParamOutTable">取 消</el-button>
        <el-button
          type="primary"
          @click="saveParamOut"
        >提交</el-button>
      </div>
    </el-dialog>
    <!-- 新增参数说明弹窗 -->
    <el-dialog
      :title="paramOutTitle"
      :visible.sync="paramOutVisible"
      width="520px"
      :append-to-body="true"
      :close-on-click-modal="false"
      @close="closeParamOut"
    >
      <el-form
        ref="paramOutForm"
        :model="paramOutForm"
        :rules="paramOutFormRules"
        label-width="100px"
      >
        <el-row>
          <el-col>
            <el-form-item label="参数名称" prop="paramName">
              <el-input
                v-model.trim="paramOutForm.paramName"
                maxlength="100"
                clearable
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="参数说明" prop="paramDesc">
              <el-input
                v-model.trim="paramOutForm.paramDesc"
                clearable
                maxlength="100"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="出现次序" prop="occurrenceSort">
              <el-input v-model.number="paramOutForm.occurrenceSort" clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="xpath路径" prop="paramPath">
              <el-input
                v-model.trim="paramOutForm.paramPath"
                clearable
                maxlength="256"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="参数类型">
              <el-radio-group v-model="paramOutForm.messageType" @change="changeMessageType">
                <el-radio :label="1">报文头</el-radio>
                <el-radio :label="2">报文体</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="24">
            <el-form-item label="是否无序">
              <el-switch v-model="paramOutForm.disorderFlag" active-text="是" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是否校验">
              <el-switch v-model="paramOutForm.needChecked" active-text="是" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是否存在">
              <el-switch v-model="paramOutForm.existed" active-text="是" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <span class="text-danger" style="font-size: 12px ;margin-left:15px;">
              (若xpath=/，取整个返回报文)
            </span>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeParamOut">取 消</el-button>
        <el-button
          type="primary"
          @click="submitParamOuts('paramOutForm2')"
        >提交</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { dict, analysisParmsOut, create, update, remove, submit } from '@/api/drainage-test'
// import xmlEditor from '@/views/drainageManagement/components/xmlEditor.vue'
export default {
  components: {
    // xmlEditor
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    paramData: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      loading: false,
      activeNames: ['1', '3'],
      compareAndFunctionCodeList: [],
      responseData: null,
      specData: null,
      // 响应报文
      checkOutForm: {
        responseMessage: null
      },
      choseParamOutVisible: false,
      paramOutData: [],
      paramOutTitle: null,
      paramOutVisible: false,
      paramOutForm: {
        paramName: null,
        paramDesc: null,
        occurrenceSort: 1,
        paramPath: null,
        messageType: null,
        disorderFlag: false,
        needChecked: true,
        existed: true, // 是否存在校验 0 校验不存在 1存在
        disorder: 0
      },
      formData: {
        ruleType: 1,
        origin: null,
        rule: 1,
        newVal: null
      },
      size: '',
      ruleTypeOptions: [],
      ruleOptions: [],
      page1: { pageNum: 1, pageSize: 10, totals: 0 },
      page2: { pageNum: 1, pageSize: 10, totals: 0 },
      paramOutFormRules: {
        taskDesc: [{ required: true, message: '请输入FPA功能点', trigger: 'blur' }]
      }
    }
  },
  computed: {
    reqString: function() {
      var str = JSON.parse(this.paramData.reqMessage)
      return str
    }
  },
  watch: {
    paramData() {
      this.initForm()
    }
  },
  mounted() {
    this.initForm()
  },
  methods: {
    initForm() {
      // this.responseData = this.paramData[0]
      this.specData = this.paramData[0].children
      this.checkOutForm.responseMessage = this.specData[0].responseMessage
      this.compareAndFunctionCodeList = this.paramData[0].compareAndFunctionCodeList
      this.page1.totals = this.compareAndFunctionCodeList.length
      this.page2.totals = this.paramData[0].children.length
      // this.getDictData()
      // if (this.paramData.clickType == 'add') {
      //   this.formData = JSON.parse(JSON.stringify(this.paramData))
      // } else {
      //   this.$refs['form'].resetFields()
      //   this.formData = Object.assign({}, this.formData, this.paramData)
      // }
    },
    getDictData() {
      dict().then(response => {
        this.ruleOptions = response.data[1]
        this.ruleTypeOptions = response.data[2]
      })
    },
    cancel() {
      this.$emit('submitStatus', { status: 'cancel', row: {}})
    },
    close() {
      debugger
      this.formData = Object.assign({}, this.formData, {})
    },
    confirm() {
      this.$refs.form.validate((valid, message) => {
        if (valid) {
          this.$emit('submitStatus', { status: 'success', row: this.formData })
        } else {
          this.$message.error('必填项不能为空')
          return false
        }
      })
    },
    addParamOutEvent(index, clickType) {
      this.paramOutTitle = '新增输出参数'
      this.paramOutVisible = true
      // this.sort = index + 1
      this.paramOutForm.existed = true
      this.clickType = clickType
      // this.paramOutForm = JSON.parse(JSON.stringify('{}'))
      this.$set(this.paramOutForm, 'paramName', null)
      this.$set(this.paramOutForm, 'paramDesc', null)
      this.$set(this.paramOutForm, 'occurrenceSort', null)
      this.$set(this.paramOutForm, 'messageType', 2)
      this.$set(this.paramOutForm, 'disorderFlag', false)
      this.$set(this.paramOutForm, 'needChecked', true)
      this.$set(this.paramOutForm, 'existed', true)
      this.$set(this.paramOutForm, 'disorder', 0)
      // this.paramOutForm.paramName = null
      // this.paramOutForm.paramDesc = null
      // this.paramOutForm.occurrenceSort = null
      // this.paramOutForm.messageType = null
      // this.paramOutForm.disorderFlag = false
      // this.paramOutForm.needChecked = true
      // this.paramOutForm.existed = true
      // this.paramOutForm.disorder = 0
    },
    handleParamOutEdit(row, clickType) {
      this.paramOutVisible = true
      this.paramOutTitle = '修改参数'
      // this.sort = row.sort
      if (row.existed != null && row.existed == 1) {
        this.paramOutForm.existed = true
      } else {
        this.paramOutForm.existed = false
      }
      this.paramOutForm = JSON.parse(JSON.stringify(row))
      this.clickType = clickType
    },
    changeMessageType() {
      if (this.paramOutForm.messageType === 1) {
        this.needChecked = false
        this.disorderFlag = true
      }
    },
    handleParamOutDelete(index, tableData) {
      var _ownObj = this
      _ownObj
        .$confirm('确定要删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        .then(() => {
          remove().then(response => {
            if (response.code === 20000) {
              this.$message.success('删除成功')
              tableData.splice(index, 1)
            }
          })
        })
    },
    closeParamOut() {
      this.paramOutForm = {}
      this.paramOutForm.disorderFlag = false
      this.paramOutForm.needChecked = true
      this.$refs['paramOutForm'].resetFields()
      this.paramOutVisible = false
    },
    generateParamOut() {
      analysisParmsOut().then(response => {
        this.paramOutData = response.data
      })
      this.choseParamOutVisible = true
    },
    saveParamOut() {
      submit().then(response => {
        if (response.code === 20000) {
          this.$message.success('提交成功')
          this.choseParamOutVisible = false
        }
      })
    },
    submitParamOuts() {
      this.$refs.paramOutForm.validate((valid, message) => {
        if (valid) {
          if (this.clickType == 'add') {
            create().then(response => {
              if (response.code === 20000) {
                this.$message.success('新增成功')
                this.paramData[0].children.unshift(this.paramOutForm)
                this.paramOutVisible = false
              }
            })
          } else {
            update().then(response => {
              if (response.code === 20000) {
                this.$message.success('编辑成功')
                this.paramOutVisible = false
              }
            })
          }
          // this.axios
          //   .post('/asset-develop/modifyreport/function/update', this.formData)
          //   .then(response => {
          //     if (response.respResult == '1') {
          //       this.$message.success(response.respData)
          //     }
          //   })
          //   .finally(() => {
          //     this.$emit('submitStatus', { status: 'success', row: this.formData })
          //   })
        } else {
          this.$message.error('必填项不能为空')
          return false
        }
      })
    },
    closeParamOutTable() {},
    /**
     * 分页
     */
    handleIndexChange1(val) {
      this.page1.pageNum = val
      this.getData()
    },
    handleSizeChange1(val) {
      this.page1.pageSize = val
      this.getData()
    },
    handleIndexChange2(val) {
      this.page2.pageNum = val
      this.getData()
    },
    handleSizeChange2(val) {
      this.page2.pageSize = val
      this.getData()
    }
  }
}
</script>

<style lang='scss'>
.btnClass {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    background: #fff;
  }
  .radioPanel{
    display: flex;
    flex-direction: column;
    padding: 10px 0;
    .el-radio{
      margin-top: 5px;
    }
  }
.CodeMirror{
  height: 500px;
  font-size: 14px;
  line-height: 20px;
}
.el-collapse-item__header{
  font-weight: 700 !important;
}
</style>
