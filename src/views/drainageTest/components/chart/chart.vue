<template>
  <v-chart
    ref="comparisonChart"
    :options="echartOption"
    :auto-resize="true"
    theme="light"
    class="chart"
  />
</template>

<script>
import Vue from 'vue'
// 引入vue-echarts组件
// 手动引入 ECharts 各模块来减小打包体积
import VChart from 'vue-echarts'
import 'echarts/lib/chart/line'
import 'echarts/lib/component/title'
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/markPoint'
import 'echarts/lib/component/markLine'
import 'echarts/lib/component/graphic'
import { Empty } from 'element-ui'
Vue.use(Empty)

export default {
  components: {
    VChart
  },
  props: {
    // eslint-disable-next-line vue/require-default-prop
    data: {
      type: Object
    }
  },

  data() {
    return {
      echartOption: {}
    }
  },
  watch: {
    data() {
      this.updateLineChart()
    }
  },
  mounted() {
    this.updateLineChart()
  },
  methods: {
    updateLineChart() {
      this.echartOption = {}
      this.$nextTick(() => {
        this.echartOption = {
          animationDuration: 1000,
          title: {
            text: this.data != null ? this.data.titleText : null,
            textStyle: {
              color: '#666',
              fontSize: 16
            }
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: this.data != null ? this.data.legendData : null,
            selected: this.data != null ? this.data.selected : null
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          toolbox: {
            feature: {
              saveAsImage: {}
            }
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: this.data != null ? this.data.xaxisData : null,
            axisLine: {
              color: '#666669',
              lineStyle: {
                type: 'solid',
                color: '#EEEEF1', // 左边线的颜色
                width: '1' // 坐标线的宽度
              }
            },
            axisLabel: {
              rotate: 30,
              color: '#666669',
              padding: [10, 0, 0, 10]
            }
          },
          yAxis: {
            type: 'value',
            name: this.data != null ? this.data.unit : null,
            axisLabel: {
              formatter: '{value} ',
              color: '#666669'
            },
            splitLine: {
              lineStyle: {
                color: '#EEEEF1'
              }
            },
            axisLine: {
              color: '#666669',
              lineStyle: {
                type: 'solid',
                color: '#EEEEF1', // 左边线的颜色
                width: '1' // 坐标线的宽度
              }
            },
            axisPointer: {
              snap: true
            }
          },
          series: this.data != null ? this.data.series : null
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
