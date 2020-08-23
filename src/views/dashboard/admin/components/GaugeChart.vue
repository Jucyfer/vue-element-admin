<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'
export default {
  name: 'GaugeChart',
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
    },
    gaugeValue: {
      type: Number,
      default: () => 10
    },
    max: {
      type: Number,
      default: () => 100
    }
  },
  data() {
    return {
      chart: null,
      options: {
        tooltip: {
          formatter: '{b} <br/>{a} : {c}'
        },
        series: [
          {
            name: '总用户数',
            type: 'gauge',
            max: this.max,
            splitNumber: 5,
            detail: { formatter: '{value}' },
            axisTick: {
              splitNumber: 5
            },
            axisLabel: {
              formatter: function(value) {
                return parseInt(value)
              }
            },
            data: [{ value: this.gaugeValue, name: '负载指标' }]
          }
        ]
      }
    }
  },
  watch: {
    gaugeValue(newValue) {
      this.chart.clear()
      this.options.series[0].data[0].value = newValue
      this.chart.setOption(this.options)
    },
    max(newValue) {
      this.chart.clear()
      this.options.series[0].max = newValue
      this.chart.setOption(this.options)
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
      this.chart.setOption(this.options)
    }
  }

}
</script>

<style scoped>

</style>
