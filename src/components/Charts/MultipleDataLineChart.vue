<template>
  <div id="lineChart" :style="{height:height,width:width}"></div>
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'
export default {
  name: 'MultipleDataLineChart',
  mixins: [resize],
  props: {
    smooth: {
      type: Boolean,
      default: () => true
    },
    title: {
      type: String,
      default: () => '综合图表'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '500px'
    },
    source: {
      type: Object
    },
    series: {
      type: Array
    }
  },
  data() {
    return {
      chart: null,
      options: {
        tooltip: {
          trigger: 'axis',
          position: function(pt) {
            return [pt[0], '10%']
          },
          confine: true
        },
        title: {
          left: 'center',
          text: this.title
        },
        legend: {
          orient: 'vertical',
          right: '0',
          top: '50%'
        },
        toolbox: {
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            },
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false
        },
        yAxis: {
          type: 'value',
          boundaryGap: ['10%', '10%'],
          scale: true
          // min: function(value) {
          //   return value.min - 0.1
          // },
          // max: function(value) {
          //   return value.max + 0.1
          // }
        },
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '100%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }],
        dataset: {
          source: this.source
        },
        series: this.series
      }
    }
  },
  watch: {
    series: {
      deep: true,
      handler: function(newValue) {
        console.log('检测到series更改')
        this.chart.clear()
        this.options.series = newValue
        this.chart.setOption(this.options)
        console.log(JSON.stringify(this.options))
        this.$forceUpdate()
      }
    },
    source: {
      deep: true,
      handler: function(newValue) {
        console.log('检测到source更改')
        this.chart.clear()
        this.options.dataset.source = newValue
        this.chart.setOption(this.options)
        console.log(JSON.stringify(this.options))
        this.$forceUpdate()
      }
    }
  },
  mounted() {
    this.initChart()
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el)
      this.chart.setOption(this.options)
      // eslint-disable-next-line no-unused-vars
      this.chart.on('dataZoom', event => {
        const dataZoom0 = this.chart.getOption().dataZoom[0]
        const startValue = dataZoom0.startValue
        const endValue = dataZoom0.endValue
        this.$emit('zoom', startValue, endValue)
      })
    }
  }
}
</script>

<style scoped>

</style>
