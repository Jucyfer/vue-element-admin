<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 3000

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        // title: {
        //   text: '上周接口调用统计',
        //   textStyle: {
        //     fontSize: 12
        //   },
        //   top: '-5%',
        //   left: 'middle'
        // },
        tooltip: {
          // trigger: 'axis',
          trigger: 'item',
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: '<b>上周接口调用次数</b><br/>{a}: {c} '
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [{
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisTick: {
            alignWithLabel: true
          }
        }],
        yAxis: [{
          type: 'value',
          axisTick: {
            show: false
          }
        }],
        series: [{
          name: '用户类',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [68, 88, 76, 102, 88, 22, 15],
          animationDuration
        }, {
          name: '机构类',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [15, 17, 20, 25, 18, 0, 2],
          animationDuration
        }, {
          name: '基金类',
          type: 'bar',
          stack: 'vistors',
          barWidth: '60%',
          data: [33, 41, 37, 54, 41, 3, 5],
          animationDuration
        }]
      })
    }
  }
}
</script>
