import request from '@/utils/request'

export function flowExtractTaskList() {
  return request({
    url: '/vue-element-admin/drainage-test/flowExtractTaskList',
    method: 'get'
  })
}

export function flowExtractLogList(query) {
  return request({
    url: '/vue-element-admin/drainage-test/flowExtractLogList',
    method: 'get',
    params: { query }
  })
}
export function cleanUpTab2List(query) {
  return request({
    url: '/vue-element-admin/drainage-test/cleanUpTab2List',
    method: 'get',
    params: { query }
  })
}
export function cleanUpTab3List(query) {
  return request({
    url: '/vue-element-admin/drainage-test/cleanUpTab3List',
    method: 'get',
    params: { query }
  })
}
export function dict(query) {
  return request({
    url: '/vue-element-admin/drainage-test/dict',
    method: 'get',
    params: { query }
  })
}
export function desensitizationRuleList(data) {
  return request({
    url: '/vue-element-admin/drainage-test/desensitizationRuleList',
    method: 'post',
    data
  })
}
export function dbRuleList(data) {
  return request({
    url: '/vue-element-admin/drainage-test/dbRuleList',
    method: 'post',
    data
  })
}
export function trafficFilterList(data) {
  return request({
    url: '/vue-element-admin/drainage-test/trafficFilterList',
    method: 'post',
    data
  })
}
export function pageQueryTree(data) {
  return request({
    url: '/vue-element-admin/drainage-test/pageQueryTree',
    method: 'post',
    data
  })
}
export function getMonitorData(data) {
  return request({
    url: '/vue-element-admin/drainage-test/getMonitorData',
    method: 'post',
    data
  })
}
export function bussinessTableData(data) {
  return request({
    url: '/vue-element-admin/drainage-test/bussinessTableData',
    method: 'post',
    data
  })
}
export function severTableData(data) {
  return request({
    url: '/vue-element-admin/drainage-test/severTableData',
    method: 'post',
    data
  })
}
export function getCompareRulesInfor(data) {
  return request({
    url: '/vue-element-admin/drainage-test/getCompareRulesInfor',
    method: 'post',
    data
  })
}
export function analysisParmsOut(data) {
  return request({
    url: '/vue-element-admin/drainage-test/analysisParmsOut',
    method: 'post',
    data
  })
}
export function drainageScene(data) {
  return request({
    url: '/vue-element-admin/drainage-test/drainageScene',
    method: 'post',
    data
  })
}
export function querySelectedScene(data) {
  return request({
    url: '/vue-element-admin/drainage-test/querySelectedScene',
    method: 'post',
    data
  })
}
export function queryTaskTableData(data) {
  return request({
    url: '/vue-element-admin/drainage-test/queryTaskTableData',
    method: 'post',
    data
  })
}
export function querySceneData(data) {
  return request({
    url: '/vue-element-admin/drainage-test/querySceneData',
    method: 'post',
    data
  })
}
// 任务配置页面表格数据
export function queryTaskManageTableData(data) {
  return request({
    url: '/vue-element-admin/drainage-test/queryTaskManageTableData',
    method: 'post',
    data
  })
}
export function getEmailConfigByTaskId(data) {
  return request({
    url: '/vue-element-admin/drainage-test/getEmailConfigByTaskId',
    method: 'post',
    data
  })
}
// 请求曲线页面列表接口
export function queryStatisticalData(data) {
  return request({
    url: '/vue-element-admin/drainage-test/queryStatisticalData',
    method: 'post',
    data
  })
}
// 请求曲线页面曲线接口
export function queryLineRealTime(data) {
  return request({
    url: '/vue-element-admin/drainage-test/queryLineRealTime',
    method: 'post',
    data
  })
}
export function create(data) {
  return request({
    url: '/vue-element-admin/drainage-test/create',
    method: 'post',
    data
  })
}
export function update(data) {
  return request({
    url: '/vue-element-admin/drainage-test/update',
    method: 'post',
    data
  })
}
export function remove(data) {
  return request({
    url: '/vue-element-admin/drainage-test/remove',
    method: 'post',
    data
  })
}
export function submit(data) {
  return request({
    url: '/vue-element-admin/drainage-test/submit',
    method: 'post',
    data
  })
}
export function getLog(type) {
  return request({
    url: '/vue-element-admin/drainage-test/getLog',
    method: 'get',
    params: { type }
  })
}
