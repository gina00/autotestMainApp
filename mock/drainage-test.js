const Mock = require('mockjs')

const treeList = []
const monitorList = []
const bussinessTableData = []
const severTableData = []
const nodeList = []
const compareAndFunctionCodeList = []
const childNodeList = []
const analysisParmsOutList = []
const drainageSceneList = []
const selectedSceneList = []
const iterations = []
const queryTaskTableList = []
const querySceneTableList = []
const queryStatisticalList = []
const queryLineRealTime = []
const queryTaskManageTableData = []
const emailConfigByTaskId = []
const list = []
const count = 0

// const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
// const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < 15; i++) {
  monitorList.push(Mock.mock({
    functionCode: '@id(100000000)',
    reqType: '@integer(1, 2)'
  }))
}

for (let i = 0; i < 10; i++) {
  treeList.push(Mock.mock({
    id: '@id',
    'label|1': ['CCS', 'PMS', 'NOTIFY', 'ORD', 'MANAFE', 'CCS1', 'PMS1', 'NOTIFY1', 'ORD1', 'MANAFE1'],
    'children|1-6': [{
      'id|+1': '@id',
      'label|1': [
        'product_area_def',
        'ng_product_channel_cfg',
        'ini_config',
        'connection_source_def',
        'dtl_schema_def',
        'base_query_route_rule',
        'user_product',
        'user_product_deatil',
        'user_product_common_para',
        'crm_bill_operation',
        'user_product_para',
        'user_services',
        'user_service_para',
        'user_bons_deal',
        'boss_sms_send_operation'
      ]
    }]
  }))
}

for (let i = 0; i < 4; i++) {
  compareAndFunctionCodeList.push(Mock.mock({
    id: '@increment(10)',
    compareRuleCode: '@increment(10)',
    // 'city|591-600': 1,
    'functionCode|902055220-902055240': 1,
    // functionCode: 902055220 + i,
    // functionCode: '@increment(10)',
    rulesSpecVal: null
  }))
}
for (let i = 0; i < 4; i++) {
  childNodeList.push(Mock.mock({
    id: '@increment(10)',
    'paramName|1': ['request_seq', 'request_seq2', 'request_seq3', 'request_seq4'],
    'paramDesc|1': ['request_seq', 'request_seq2', 'request_seq3', 'request_seq4'],
    occurrenceSort: 1,
    paramPath: null,
    'disorder|1': '@boolean',
    'needChecked|1': '@boolean',
    'existed|1': '@boolean',
    messageType: '@integer(1, 2)',
    responseMessage: '<?xml version=\"1.0\" encoding=\"GBK\"?> \r\n<operation_in type=\"struct\">\r\n  <service_name type=\"string\">ac_query_invoice</service_name>\r\n  <sysfunc_id type=\"int\">91001001</sysfunc_id>\r\n  <request_type type=\"int\">2001</request_type>\r\n  <verify_code type=\"string\">789730661774598915448481</verify_code>\r\n  <operator_id type=\"string\">9999999</operator_id>\r\n  <request_time type=\"datetime\">20050101223344</request_time>\r\n  <request_seq type=\"long\">100000000000</request_seq>\r\n  <request_source type=\"int\">101213</request_source>\r\n  <request_target type=\"int\">101101</request_target>\r\n  <msg_version type=\"string\">0100</msg_version>\r\n  <cont_version type=\"string\">0100</cont_version>\r\n  <content type=\"string\"><![CDATA[<?xml version=\"1.0\" encoding=\"GBK\"?>\r\n        <request type=\"struct\">\r\n <home_city type=\"int\">$:1</home_city>\r\n    <start_month type=\"int\">$:2</start_month>\r\n            <end_month type=\"int\">$:3</end_month>\r\n            <msisdn type=\"string\">$:4</msisdn>\r\n        </request>]]></content>\r\n</operation_in>'
  }))
}
for (let i = 0; i < 50; i++) {
  nodeList.push(Mock.mock({
    id: '@increment',
    functionCode: 902055220 + i,
    compareAndFunctionCodeList: compareAndFunctionCodeList,
    updateTime: '2021-' + "@date('MM-dd')",
    children: childNodeList
  }))
}
// 引流测试比对规则列表
for (let i = 0; i < 50; i++) {
  bussinessTableData.push(Mock.mock({
    functionCode: 902055220 + i
  }))
}
for (let i = 0; i < 50; i++) {
  severTableData.push(Mock.mock({
    functionCode: 902055220 + i
  }))
}
for (let i = 0; i < 15; i++) {
  analysisParmsOutList.push(Mock.mock({
    id: '@increment(10)',
    'paramName|1': ['PubInfo', 'RegionCode', 'ClientIP', 'InterfaceType', 'InterfaceId', 'CountyCode', 'TransactionId', 'TransactionTime', 'OpId', 'OrgId', 'Request', 'BusiCode', 'BusiParams', 'phone_id'],
    'paramDesc|1': ['PubInfo', 'RegionCode', 'ClientIP', 'InterfaceType', 'InterfaceId', 'CountyCode', 'TransactionId', 'TransactionTime', 'OpId', 'OrgId', 'Request', 'BusiCode', 'BusiParams', 'phone_id'],
    occurrenceSort: 1,
    paramValue: 1,
    'disorder|1': '@boolean',
    'needChecked|1': '@boolean',
    'existed|1': '@boolean',
    'paramPath|1': ['/PubInfo', '/PubInfo/RegionCode', '/ClientIP', '/InterfaceType', '/InterfaceId', '/CountyCode', '/TransactionId', '/TransactionTime', '/OpId', '/OrgId', '/Request', '/BusiCode', '/BusiParams', '/phone_id'],
    responseMessage: '<?xml version=\"1.0\" encoding=\"GBK\"?> \r\n<operation_in type=\"struct\">\r\n  <service_name type=\"string\">ac_query_invoice</service_name>\r\n  <sysfunc_id type=\"int\">91001001</sysfunc_id>\r\n  <request_type type=\"int\">2001</request_type>\r\n  <verify_code type=\"string\">789730661774598915448481</verify_code>\r\n  <operator_id type=\"string\">9999999</operator_id>\r\n  <request_time type=\"datetime\">20050101223344</request_time>\r\n  <request_seq type=\"long\">100000000000</request_seq>\r\n  <request_source type=\"int\">101213</request_source>\r\n  <request_target type=\"int\">101101</request_target>\r\n  <msg_version type=\"string\">0100</msg_version>\r\n  <cont_version type=\"string\">0100</cont_version>\r\n  <content type=\"string\"><![CDATA[<?xml version=\"1.0\" encoding=\"GBK\"?>\r\n        <request type=\"struct\">\r\n <home_city type=\"int\">$:1</home_city>\r\n    <start_month type=\"int\">$:2</start_month>\r\n            <end_month type=\"int\">$:3</end_month>\r\n            <msisdn type=\"string\">$:4</msisdn>\r\n        </request>]]></content>\r\n</operation_in>'
  }))
}
// 任务配置列表
for (let i = 0; i < 3; i++) {
  iterations.push(Mock.mock({
    iterationId: 1000000 + i,
    iterationName: '基础迭代' + i,
    updateTime: '2021-' + "@datetime('MM-dd')"
  }))
}
// for (let i = 0; i < 10; i++) {
//   selectedSceneList.push(Mock.mock({
//     sceneId: 1000000 + i,
//     sceneName: '测试场景' + i,
//     updateTime: '2021-' + "@datetime('MM-dd')",
//     iterations: iterations
//   }))
// }
for (let i = 0; i < 20; i++) {
  selectedSceneList.push(Mock.mock({
    'id|+1': 1,
    parentTaskName: '任务名称' + i,
    'sceneId': '@increment(10)',
    'sceneName': '测试场景' + i,
    updateTime: '2021-' + "@datetime('MM-dd')",
    endTime: '2021-' + "@datetime('MM-dd')",
    iterations: iterations
  }))
}
for (let i = 0; i < 20; i++) {
  queryTaskManageTableData.push(Mock.mock({
    taskId: '@increment(10)' + '1',
    taskName: '任务名称' + i,
    createTime: '2021-' + "@datetime('MM-dd')",
    taskStatus: 1,
    executeStrategy: 'time',
    'taskForm': {
      taskName: '任务名称' + i,
      taskStatus: 1,
      executeStrategy: 'time',
      day: 2,
      executeDateTime: '2021-' + "@datetime('MM-dd HH:mm:ss')",
      executeTime: "@datetime('HH:mm:ss')",
      executeInterval: 50,
      executeInstructions: '执行说明内容',
      isCoverage: 1,
      isSecurity: 1,
      serial: 0
    },
    selectedSceneList: selectedSceneList
  }))
}

for (let i = 0; i < 10; i++) {
  emailConfigByTaskId.push(Mock.mock({
    'appId': '@increment(10)',
    ccTo: 'zhangfenfang@fmcc.boss; linxiaodong@fmcc.boss; yeairi@fmcc.boss; lilijun@fmcc.boss; limingqi@fmcc.boss; wangxinlei1@fmcc.boss; xuxiaoke@fmcc.boss; wuminjin@fmcc.boss; linxinyue@fmcc.boss; yangy@fmcc.boss; yaowangzhi@fmcc.boss; tangyutao@fmcc.boss; chentaob@fmcc.boss; xzq@fmcc.boss; wuwenda@fmcc.boss; linjia@fmcc.boss; linyong@fmcc.boss; wangyan@fmcc.boss; ruanchuiqin@fmcc.boss;',
    createDate: 1599785017000,
    createUser: '5e8dd7582b214b8e8f3b84f3e77c2e43',
    id: 'fbba4997ecb64a248b501ec480b16223',
    objStatus: 0,
    sendTo: 'cxh@fmcc.boss; chenqiang@fmcc.boss; dyq@fmcc.boss; hyl@fmcc.boss;',
    taskId: '9d16013512f0478cac45b93b63eac365',
    templateCode: '11014',
    updateDate: 1633998743000,
    updateUser: '5e8dd7582b214b8e8f3b84f3e77c2e43'
    // 'taskId|+1': 1000000,
    // taskName: '任务名称' + i,
    // createTime: '2021-' + "@datetime('MM-dd')",
    // taskStatus: 1,
    // executeStrategy: 'time',
    // 'taskForm': {
    //   taskName: '任务名称' + i,
    //   taskStatus: 1,
    //   executeStrategy: 'time',
    //   day: 2,
    //   executeDateTime: '2021-' + "@datetime('MM-dd HH:mm:ss')",
    //   executeTime: "@datetime('HH:mm:ss')",
    //   executeInterval: 50,
    //   isCoverage: 1,
    //   isSecurity: 1,
    //   serial: 0
    // },
    // taskInfo: {}
  }))
}
for (let i = 0; i < 50; i++) {
  drainageSceneList.push(Mock.mock({
    sceneCode: 1000000 + i,
    sceneName: '测试场景' + i,
    sceneIntroduction: '测试场景' + i,
    updateTime: '2021-' + "@datetime('MM-dd')"
  }))
}

for (let i = 0; i < 50; i++) {
  list.push(Mock.mock({
    'id|+1': 1,
    parentTaskName: '引流测试任务' + i,
    'sceneName': '引流测试场景' + (i++),
    startTime: '2021-' + "@datetime('MM-dd')",
    endTime: '2021-' + "@datetime('MM-dd')",
    'execStatusValue|0-1': 0,
    statusDesc: '引流测试场景' + i + 1,
    'stopCount|0-1': 1
  }))
}
for (let i = 0; i < 50; i++) {
  queryTaskTableList.push(Mock.mock({
    sceneId: 1000000 + i,
    taskName: '引流测试任务' + i,
    startTime: '2021-' + "@datetime('MM-dd')",
    endTime: '2021-' + "@datetime('MM-dd')",
    'totalCount|1-100': 100,
    successCount: '@increment',
    failedCount: '@increment(1)',
    runningCount: '@increment(1)',
    'norunCount|0-100': 1,
    'successRate|1': [40, 50, 60, 80, 90, 100],
    'isCoverage|1': '@boolean',
    'stopCount|0-1': 1,
    // 'norunCount|1': '@boolean',
    'list|1-10': [{
      'id|+1': 1,
      parentTaskName: '引流测试任务' + i,
      'sceneName': '引流测试场景' + count + 1,
      startTime: '2021-' + "@date('MM-dd')",
      endTime: '2021-' + "@date('MM-dd')",
      'execStatusValue|1': '@boolean',
      statusDesc: '引流测试场景描述' + count + 1,
      'stopCount|0-1': 1,
      'detail': {
        functionCode: 92002040 + i,
        serverType: '@integer(1, 2)',
        reqTime: '2021-' + "@datetime('MM-dd HH:mm:ss')",
        respTime: '2021-' + "@datetime('MM-dd HH:mm:ss')",
        'times|500-6000': 1,
        downloadDate: '2021-' + "@date('MM-dd')",
        prodUrl: 'http://10.46.238.142:8089/fcgi-bin/BSSP_SFC',
        realUrl: 'http://10.46.238.142:8089/fcgi-bin/BSSP_SFC',
        reqMessage: '<?xml version=\"1.0\" encoding=\"GBK\"?><operation_in type=\"struct\"><organ_id type=\"int\"/><sysfunc_id type=\"int\">92002040</sysfunc_id><request_source type=\"int\">101219</request_source><operator_id type=\"string\">9998901</operator_id><request_target type=\"int\">101101</request_target><request_time type=\"datetime\">20211030144759</request_time><verify_code type=\"string\">101219200608310000000001</verify_code><service_name type=\"string\">BM_QueryUserStatus</service_name><content type=\"string\"><request type=\"struct\"><home_city type=\"int\">591</home_city><msisdn type=\"int\"></msisdn><user_id type=\"string\">591500028609324</user_id><obj_type type=\"int\">1</obj_type></request></content><cont_version type=\"string\">0100</cont_version><msg_version type=\"string\">0100</msg_version><request_type type=\"int\">1002</request_type><request_seq type=\"long\">1335941279540</request_seq></operation_in>',
        flowRespMessage: '<?xml version=\"1.0\" encoding=\"GBK\"?><operation_in type=\"struct\"><organ_id type=\"int\"/><sysfunc_id type=\"int\">92002040</sysfunc_id><request_source type=\"int\">101219</request_source><operator_id type=\"string\">9998901</operator_id><request_target type=\"int\">101101</request_target><request_time type=\"datetime\">20211030144759</request_time><verify_code type=\"string\">101219200608310000000001</verify_code><service_name type=\"string\">BM_QueryUserStatus</service_name><content type=\"string\"><request type=\"struct\"><home_city type=\"int\">591</home_city><msisdn type=\"int\"></msisdn><user_id type=\"string\">591500028609324</user_id><obj_type type=\"int\">1</obj_type></request></content><cont_version type=\"string\">0100</cont_version><msg_version type=\"string\">0100</msg_version><request_type type=\"int\">1002</request_type><request_seq type=\"long\">1335941279540</request_seq></operation_in>',
        testRespMessage: '<?xml version="1.0" encoding="GBK" ?><operation_out><service_name>BM_QueryUserStatus</service_name><request_type>1002</request_type><sysfunc_id>92004401</sysfunc_id><request_seq>1335941279540</request_seq><response_time>20211030144817</response_time><response_seq>200547644929</response_seq><request_source>101219</request_source><response><resp_type>0</resp_type><resp_code>0000</resp_code><resp_desc></resp_desc></response><content><response><service_status>44</service_status></response></content></operation_out>'

      }
    }]
  }))
}
for (let i = 0; i < 50; i++) {
  querySceneTableList.push(Mock.mock({
    'id|+1': 1,
    sceneId: 1000000 + i,
    'sceneName': '引流测试场景' + i,
    startTime: '2021-' + "@date('MM-dd')",
    endTime: '2021-' + "@date('MM-dd')",
    'execStatusValue|1': '@boolean',
    statusDesc: '引流测试场景描述' + i,
    'stopCount|0-1': 1,
    'detail': {
      parentSceneName: '引流测试场景' + i,
      functionCode: 92002040 + i,
      serverType: '@integer(1, 2)',
      reqTime: '2021-' + "@datetime('MM-dd HH:mm:ss')",
      respTime: '2021-' + "@datetime('MM-dd HH:mm:ss')",
      'times|500-6000': 1,
      downloadDate: '2021-' + "@date('MM-dd')",
      prodUrl: 'http://10.46.238.142:8089/fcgi-bin/BSSP_SFC',
      realUrl: 'http://10.46.238.142:8089/fcgi-bin/BSSP_SFC',
      reqMessage: '<?xml version=\"1.0\" encoding=\"GBK\"?><operation_in type=\"struct\"><organ_id type=\"int\"/><sysfunc_id type=\"int\">92002040</sysfunc_id><request_source type=\"int\">101219</request_source><operator_id type=\"string\">9998901</operator_id><request_target type=\"int\">101101</request_target><request_time type=\"datetime\">20211030144759</request_time><verify_code type=\"string\">101219200608310000000001</verify_code><service_name type=\"string\">BM_QueryUserStatus</service_name><content type=\"string\"><request type=\"struct\"><home_city type=\"int\">591</home_city><msisdn type=\"int\"></msisdn><user_id type=\"string\">591500028609324</user_id><obj_type type=\"int\">1</obj_type></request></content><cont_version type=\"string\">0100</cont_version><msg_version type=\"string\">0100</msg_version><request_type type=\"int\">1002</request_type><request_seq type=\"long\">1335941279540</request_seq></operation_in>',
      flowRespMessage: '<?xml version=\"1.0\" encoding=\"GBK\"?><operation_in type=\"struct\"><organ_id type=\"int\"/><sysfunc_id type=\"int\">92002040</sysfunc_id><request_source type=\"int\">101219</request_source><operator_id type=\"string\">9998901</operator_id><request_target type=\"int\">101101</request_target><request_time type=\"datetime\">20211030144759</request_time><verify_code type=\"string\">101219200608310000000001</verify_code><service_name type=\"string\">BM_QueryUserStatus</service_name><content type=\"string\"><request type=\"struct\"><home_city type=\"int\">591</home_city><msisdn type=\"int\"></msisdn><user_id type=\"string\">591500028609324</user_id><obj_type type=\"int\">1</obj_type></request></content><cont_version type=\"string\">0100</cont_version><msg_version type=\"string\">0100</msg_version><request_type type=\"int\">1002</request_type><request_seq type=\"long\">1335941279540</request_seq></operation_in>',
      testRespMessage: '<?xml version="1.0" encoding="GBK" ?><operation_out><service_name>BM_QueryUserStatus</service_name><request_type>1002</request_type><sysfunc_id>92004401</sysfunc_id><request_seq>1335941279540</request_seq><response_time>20211030144817</response_time><response_seq>200547644929</response_seq><request_source>101219</request_source><response><resp_type>0</resp_type><resp_code>0000</resp_code><resp_desc></resp_desc></response><content><response><service_status>44</service_status></response></content></operation_out>'
    }
  }))
}
for (let i = 0; i < 10; i++) {
  queryStatisticalList.push(Mock.mock({
    'id|+1': 1000000,
    bussinessName: '测试服务' + i,
    interfaceName: '1',
    interfaceId: 92002040 + i,
    type: '@integer(1, 2)',
    maxReqTime: '1',
    'averageRespTime|1-100': 1,
    'averageRespTimeExperience|1-100': 1,
    'businessSuccess|1-100': 1,
    'businessSuccessExperience|1-100': 1,
    'businessConsistentRate|1-100': 1,
    'businessConsistentRateExperience': '@float(1, 100, 1, 2)',
    startTime: '@date()',
    endTime: '@date()'
  }))
}
for (let i = 0; i < 1; i++) {
  queryLineRealTime.push(Mock.mock({
    'memory:usedperc': {
      titleText: '平均响应时间(ms)',
      'legendData': ['测试服务'],
      'series': [{
        'name': '测试服务',
        'type': 'line',
        'stack': '',
        'data|1-300': ['@float(1, 100, 2)']

      }],
      'selected': '',
      'xaxisDataHms': '',
      'xaxisData|1-200': ['@date("yyyy-mm-dd")']
    },
    'cpu': {
      titleText: '业务一致性(%)',
      'legendData': ['测试服务'],
      'series': [{
        'name': '测试服务',
        'type': 'line',
        'stack': '',
        'data|1-300': ['@float(1, 100, 2)']

      }],
      'selected': '',
      'xaxisDataHms': '',
      'xaxisData|1-200': ['@date(yyyy-mm-dd)']
    }
  }))
}
module.exports = [
  {
    url: '/vue-element-admin/drainage-test/pageQueryTree',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: treeList
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/getMonitorData',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: monitorList,
        total: monitorList.length
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/bussinessTableData',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        total: bussinessTableData.length,
        data: bussinessTableData
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/severTableData',
    type: 'post',
    response: config => {
      const { page = 1, limit = 10 } = config
      // severTableData.slice((page - 1) * limit, page * limit)
      const pageList = severTableData.slice((page - 1) * limit, page * limit)
      debugger
      return {
        code: 20000,
        total: severTableData.length,
        data: pageList
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/getCompareRulesInfor',
    type: 'post',
    response: _ => {
      // severTableData.slice((page - 1) * limit, page * limit)
      // const pageList = severTableData.slice((page - 1) * limit, page * limit)
      // const pageList = data[config]

      return {
        code: 20000,
        data: nodeList
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/analysisParmsOut',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: analysisParmsOutList
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/drainageScene',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: drainageSceneList,
        total: drainageSceneList.length
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/querySelectedScene',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: selectedSceneList
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/queryTaskTableData',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: queryTaskTableList,
        total: queryTaskTableList.length
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/querySceneData',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: querySceneTableList,
        total: querySceneTableList.length
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/queryStatisticalData',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: queryStatisticalList,
        total: queryStatisticalList.length
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/queryLineRealTime',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: queryLineRealTime[0]
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/queryTaskManageTableData',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: queryTaskManageTableData,
        total: queryTaskManageTableData.length
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/getEmailConfigByTaskId',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: emailConfigByTaskId,
        total: emailConfigByTaskId.length
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/remove',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/submit',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  {
    url: '/vue-element-admin/drainage-test/getLog',
    type: 'get',
    response: config => {
      const { type } = config.query
      var data = {}
      // 流量提取
      if (type == 1) {
        data = Mock.mock({
          'time|+30': '@now(HH:mm:ss)',
          'logInformation': '流量提取进行中......',
          'fileCount|1-100': 1
        })
      } else if (type == 2) {
        // 解析流量
        data = Mock.mock({
          'time|+30': '@now(HH:mm:ss)',
          'logInformation': '测试日志文件1解析流量进行中......',
          'fileCount|1-100': 1
        })
      } else if (type == 3) {
        // 流量清理
        data = Mock.mock({
          'time|+30': '@now(HH:mm:ss)',
          'logInformation': '流量清理进行中.......',
          'fileCount|1-100': 1
        })
      } else if (type == 4) {
        // 流量脱敏
        data = Mock.mock({
          'time|+30': '@now(HH:mm:ss)',
          'logInformation': '流量脱敏处理进行中.......',
          'fileCount|1-100': 1
        })
      } else if (type == 5) {
        // 数据表脱敏
        data = Mock.mock({
          'time|+30': '@now(HH:mm:ss)',
          'logInformation': '数据表脱敏处理进行中.......',
          'fileCount|1-100': 1
        })
      } else if (type == 6) {
        // 基准数据同步
        data = Mock.mock({
          'time|+30': '@now(HH:mm:ss)',
          'logInformation': '同步进行中.......',
          'fileCount|1-100': 1
        })
      } else if (type == 7) {
        // 场景流量测试
        data = Mock.mock({
          'time|+30': '@now(HH:mm:ss)',
          'logInformation': '流量测试进行中.......',
          'fileCount|1-100': 1
        })
      } else if (type == 8) {
        // 场景流量测试
        data = Mock.mock({
          'time|+30': '@now(HH:mm:ss)',
          'logInformation': '数据表流量复制进行中.......',
          'fileCount|1-100': 1
        })
      } else if (type == 9) {
        // 场景流量测试
        data = Mock.mock({
          'time|+30': '@now(HH:mm:ss)',
          'logInformation': '流量报文复制进行中.......',
          'fileCount|1-100': 1
        })
      }
      return {
        code: 20000,
        data: data
      }
    }
  }

]

