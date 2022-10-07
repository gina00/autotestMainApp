<template>
  <div
    style="padding:20px;height: calc(100vh - 260px);
    overflow: auto;"
  >
    <el-descriptions class="margin-top" title="流量测试执行详情" :column="2" :size="size" border>
      <el-descriptions-item>
        <template slot="label">
          业务功能
        </template>
        <span>{{ result.functionCode }}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          测试结果
        </template>
        <span :style="resultObj.execStatusValue == true?'font-weight:bold;color:green':'font-weight:bold;color:red'">{{ result.testResult }}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          下载日期
        </template>
        <span>{{ result.downloadDate }}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          应答时长（ms）
        </template>
        <span>{{ result.times }}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          请求时间
        </template>
        <span>{{ result.reqTime }}</span>
      </el-descriptions-item>
      <el-descriptions-item>
        <template slot="label">
          响应时间
        </template>
        <span>{{ result.respTime }}</span>
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template slot="label">
          生产URL
        </template>
        <span>{{ result.prodUrl }}</span>
      </el-descriptions-item>
      <el-descriptions-item :span="2">
        <template slot="label">
          仿真URL
        </template>
        <span>{{ result.realUrl }}</span>
      </el-descriptions-item>
    </el-descriptions>

    <el-row :gutter="20" style="margin-top:20px">
      <el-col :span="24" style="margin-bottom:20px">
        <div style="font-weight:bold;margin-bottom:10px">请求报文：</div>
        <xml-editor ref="xmlEditor1" :code="result.reqMessage" />
      </el-col>
      <el-col :span="12">
        <div style="font-weight:bold;margin-bottom:10px">流量响应报文:</div>
        <!-- <el-input
          v-model="reqString"
          style="margin-top:15px"
          type="textarea"
          placeholder="请输入应答报文模板"
          :rows="23"
        /> -->
        <xml-editor ref="xmlEditor1" :code="result.flowRespMessage" />

      </el-col>
      <el-col :span="12">
        <div style="font-weight:bold;margin-bottom:10px">引流测试响应报文：</div>
        <!-- <el-input
          v-model="paramData.respMessage"
          type="textarea"
          placeholder="请输入应答报文模板"
          :rows="23"
          style="margin-top:15px"
        /> -->
        <xml-editor ref="xmlEditor2" :code="result.testRespMessage" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { querySceneData } from '@/api/drainage-test'
import xmlEditor from '@/views/drainageManagement/components/xmlEditor.vue'
export default {
  components: {
    xmlEditor
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    paramDataRow: {
      type: Object,
      required: false
    }
  },
  data() {
    return {
      formData: {
        ruleType: 1,
        origin: null,
        rule: 1,
        newVal: null
      },
      size: '',
      ruleTypeOptions: [],
      ruleOptions: [],
      resultObj: {},
      result: {}
      // rules: {
      //   taskDesc: [{ required: true, message: '请输入FPA功能点', trigger: 'blur' }]
      // }
    }
  },
  computed: {
    // reqString: function() {
    //   var str = JSON.parse(this.result.reqMessage)
    //   return str
    // }
  },
  watch: {
    paramDataRow() {
    }
  },
  mounted() {
    this.$nextTick(() => {
      if (this.paramDataRow.gotoQuery == 'query') {
        this.query()
      }
    })
  },
  methods: {
    query() {
      querySceneData().then(response => {
        debugger
        var data = response.data
        var newArr = data.filter(item => item.sceneName === this.paramDataRow.sceneName)
        this.resultObj = JSON.parse(JSON.stringify(newArr[0]))
        this.result = newArr[0].detail
        if (newArr[0].execStatusValue == true) {
          this.result.testResult = '一致'
        } else {
          this.result.testResult = '不一致'
        }
        window.console.log(response.data.list)
      })
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
</style>
