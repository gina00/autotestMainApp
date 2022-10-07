const Mock = require('mockjs')
// 流程提取任务列表
const flowExtractionList = []
const flowExtractionListCount = 15
// 流程提取解析列表
const cleanUpTab2List = []
const cleanUpTab3List = []
const cleanUpTab2ListCount = 40
// 脱敏规则列表/报文规则列表
const desensitizationRuleList = []
// 数据表规则列表
const dbRuleList = []
// 流量筛选列表
const trafficFilterList = []

// const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
// const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'
for (let i = 0; i < flowExtractionListCount; i++) {
  flowExtractionList.push(Mock.mock({
    flowTaskName: '流量提取任务@increment',
    taskDesc: '流量提取任务20220210',
    targetHost: '10.1.1.113',
    loginUser: 'admin',
    loginPassWord: '111111',
    extractPath: '/root',
    extractRange: '2',
    fileType: 'root.zip'
  }))
}
for (let i = 0; i < cleanUpTab2ListCount; i++) {
  cleanUpTab2List.push(Mock.mock({
    flowTaskName: 1000000 + i,
    checked: false
  }))
}
for (let i = 0; i < cleanUpTab2ListCount; i++) {
  cleanUpTab3List.push(Mock.mock({
    flowTaskName: 1000000 + i
  }))
}
for (let i = 0; i < 45; i++) {
  desensitizationRuleList.push(Mock.mock({
    'ruleCode|+1': 1000000000 + i,
    origin: '<msisdn>@id(10000000)</msisdn>',
    rule: '@integer(1, 3)',
    'ruleName|1': ['手机号码规则', '身份证号规则', '姓名规则', '手机号码规则1', '身份证号规则1', '姓名规则1', '手机号码规则2', '身份证号规则2', '姓名规则2'],
    ruleType: '@integer(1, 2)',
    newVal: '<msisdn>@increment(10000000)</msisdn>'
  }))
}
for (let i = 0; i < 35; i++) {
  dbRuleList.push(Mock.mock({
    'ruleCode|+1': 2000000000 + i,
    origin: '<msisdn>@id(20000000)</msisdn>',
    rule: '@integer(1, 3)',
    'ruleName|1': ['手机号码规则', '身份证号规则', '姓名规则', '手机号码规则1', '身份证号规则1', '姓名规则1', '手机号码规则2', '身份证号规则2', '姓名规则2'],
    ruleType: '@integer(1, 2)',
    newVal: '<msisdn>@increment(20000000)</msisdn>'
  }))
}
for (let i = 0; i < 51; i++) {
  trafficFilterList.push(Mock.mock({
    'city|591-600': 1,
    functionCode: '@id(100000000)',
    serverType: '@integer(1, 2)',
    reqTime: '2021-' + "@datetime('MM-dd HH:mm:ss')",
    respTime: '2021-' + "@datetime('MM-dd HH:mm:ss')",
    // times: '@time()',
    'times|500-6000': 1,
    downloadDate: '2021-' + "@datetime('MM-dd')",
    prodUrl: 'http://10.46.238.142:8089/fcgi-bin/BSSP_SFC',
    realUrl: 'http://10.46.238.142:8089/fcgi-bin/BSSP_SFC',
    reqMessage: '<?xml version=\"1.0\" encoding=\"GBK\"?><operation_in type=\"struct\"><organ_id type=\"int\"/><sysfunc_id type=\"int\">92002040</sysfunc_id><request_source type=\"int\">101219</request_source><operator_id type=\"string\">9998901</operator_id><request_target type=\"int\">101101</request_target><request_time type=\"datetime\">20211030144759</request_time><verify_code type=\"string\">101219200608310000000001</verify_code><service_name type=\"string\">BM_QueryUserStatus</service_name><content type=\"string\"><request type=\"struct\"><home_city type=\"int\">591</home_city><msisdn type=\"int\"></msisdn><user_id type=\"string\">591500028609324</user_id><obj_type type=\"int\">1</obj_type></request></content><cont_version type=\"string\">0100</cont_version><msg_version type=\"string\">0100</msg_version><request_type type=\"int\">1002</request_type><request_seq type=\"long\">1335941279540</request_seq></operation_in>',
    respMessage: '<?xml version="1.0" encoding="GBK" ?><operation_out><service_name>BM_QueryUserStatus</service_name><request_type>1002</request_type><sysfunc_id>92004401</sysfunc_id><request_seq>1335941279540</request_seq><response_time>20211030144817</response_time><response_seq>200547644929</response_seq><request_source>101219</request_source><response><resp_type>0</resp_type><resp_code>0000</resp_code><resp_desc></resp_desc></response><content><response><service_status>44</service_status></response></content></operation_out>'
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/drainage-test/flowExtractTaskList',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          list: flowExtractionList
        },
        total: flowExtractionList.length
      }
    }
  },

  {
    url: '/vue-element-admin/drainage-test/cleanUpTab2List',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: cleanUpTab2List
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/cleanUpTab3List',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: cleanUpTab3List
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/desensitizationRuleList',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: desensitizationRuleList,
        total: desensitizationRuleList.length
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/dbRuleList',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: dbRuleList,
        total: dbRuleList.length
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/trafficFilterList',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: trafficFilterList,
        total: trafficFilterList.length
      }
    }
  }

]

