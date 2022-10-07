const Mock = require('mockjs')

// const treeList = []
const treeChildrenList = []
const monitorList = []
const strategyType = []
// const bussinessTableData = []
// const severTableData = []

// const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
// const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'

for (let i = 0; i < 15; i++) {
  monitorList.push(Mock.mock({
    functionCode: '@id(100000000)',
    reqType: '@integer(1, 2)'
  }))
}
for (let i = 0; i < 6; i++) {
  treeChildrenList.push(Mock.mock({
    id: '@increment(10)',
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
  }))
}
for (let i = 0; i < 6; i++) {
  strategyType.push(Mock.mock(
    {
      'id': '1001702',
      'dictType': 10017,
      'dictKey': 'time',
      'dictValue': '定时执行',
      'dictDesc': '定时执行策略',
      'createUser': null,
      'createDate': 1564043066000,
      'objStatus': 0,
      'appId': 'org_app_system',
      'other': null
    }))
}

module.exports = [
  {
    url: '/vue-element-admin/drainage-test/dict',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          // 1-脱敏规则字典
          1: [
            { label: '仿真数据', value: 1 },
            { label: '数据屏蔽', value: 2 },
            { label: '固定数据', value: 3 },
            { label: '随机数据', value: 4 }
          ],
          // 1-规则类型字典
          2: [
            { label: '提交节点', value: 1 },
            { label: '数据表字段', value: 2 }
          ],
          // 1-业务/服务类型字典
          3: [
            { label: '业务请求', value: 1 },
            { label: '服务请求', value: 2 }
          ],
          4: [
            { id: '1001702',
              dictType: 10017,
              dictKey: 'time',
              dictValue: '定时执行',
              dictDesc: '定时执行策略'
            },
            { id: '1001703',
              dictType: 10017,
              dictKey: 'month',
              dictValue: '每月',
              dictDesc: '定时执行策略'
            },
            { id: '1001704',
              dictType: 10017,
              dictKey: 'week',
              dictValue: '每周',
              dictDesc: '定时执行策略'
            },
            { id: '1001705',
              dictType: 10017,
              dictKey: 'day',
              dictValue: '每天',
              dictDesc: '定时执行策略'
            },
            { id: '1001706',
              dictType: 10017,
              dictKey: 'hour',
              dictValue: '每隔几小时',
              dictDesc: '定时执行策略'
            },
            { id: '1001707',
              dictType: 10017,
              dictKey: 'minute',
              dictValue: '每隔几分钟',
              dictDesc: '定时执行策略'
            }
          ],
          5: [
            { id: '1001901',
              dictType: 10019,
              dictKey: '0',
              dictValue: '未执行',
              dictDesc: '执行状态'
            },
            { id: '1001902',
              dictType: 10019,
              dictKey: '1',
              dictValue: '成功',
              dictDesc: '执行状态'
            },
            { id: '1001903',
              dictType: 10019,
              dictKey: '2',
              dictValue: '失败',
              dictDesc: '执行状态'
            },
            { id: '1001904',
              dictType: 10019,
              dictKey: '3',
              dictValue: '执行中',
              dictDesc: '执行状态'
            },
            { id: '1001905',
              dictType: 10019,
              dictKey: '4',
              dictValue: '超时',
              dictDesc: '执行状态'
            },
            { id: '1001906',
              dictType: 10019,
              dictKey: '5',
              dictValue: '终止',
              dictDesc: '执行状态'
            }
          ],
          6: [
            { label: '业务', value: 1 },
            { label: '服务', value: 2 }
          ],
          7: [
            { label: 'CCS', value: 'CCS' },
            { label: 'NOTIFY', value: 'NOTIFY' },
            { label: 'PMS1', value: 'PMS1' },
            { label: 'CCS1', value: 'CCS1' },
            { label: 'MANAFE', value: 'MANAFE' },
            { label: 'NOTIFY1', value: 'NOTIFY1' }
          ]
        }
      }
    }
  }

]

