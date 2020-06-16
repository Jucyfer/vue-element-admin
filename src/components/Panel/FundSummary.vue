<template>
  <div :style="{width:width,align:'center'}">
    <el-row :gutter="20" type="flex" justify="center">
      <el-col :span="6">开始日</el-col>
      <el-col :span="6">{{ fundData.startDate }}</el-col>
      <el-col :span="6">结束日</el-col>
      <el-col :span="6">{{ fundData.endDate }}</el-col>
    </el-row>
    <el-row :gutter="20" type="flex" justify="center">
      <el-col :span="6">基本情况</el-col>
      <el-col :span="6"></el-col>
      <el-col :span="6"></el-col>
      <el-col :span="6"></el-col>
    </el-row>
    <el-row :gutter="20" type="flex" justify="center">
      <el-col :span="12">
        <indicator :list="basicInfo1"></indicator>
      </el-col>
      <el-col :span="12">
        <indicator :list="basicInfo2"></indicator>
      </el-col>
    </el-row>
    <el-row :gutter="20" type="flex" justify="center">
      <el-col :span="6">收益指标</el-col>
      <el-col :span="6"></el-col>
      <el-col :span="6"></el-col>
      <el-col :span="6"></el-col>
    </el-row>
    <el-row :gutter="20" type="flex" justify="center">
      <el-col :span="12">
        <indicator :list="incomeIndicator1"></indicator>
      </el-col>
      <el-col :span="12">
        <indicator :list="incomeIndicator2"></indicator>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import indicator from './FundStatisticTable'
export default {
  name: 'FundSummary',
  components: {
    indicator
  },
  props: {
    width: {
      type: String,
      default: () => '100%'
    },
    fundData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  computed: {
    basicInfo1() {
      const arr = []
      arr.push({
        tag: 'timeParam',
        content: this.fundData.timeParam
      })
      arr.push({
        tag: 'lastValue',
        content: this.fundData.lastValue
      })
      arr.push({
        tag: 'profit3M',
        content: this.fundData.profit3M
      })
      arr.push({
        tag: 'profit1Y',
        content: this.fundData.profit1Y
      })
      arr.push({
        tag: 'profitCY',
        content: this.fundData.profitCY
      })
      return arr
    },
    basicInfo2() {
      const arr = []
      arr.push({
        tag: 'maintainDays',
        content: this.fundData.maintainDays
      })
      arr.push({
        tag: 'tradingDays',
        content: this.fundData.tradingDays
      })
      arr.push({
        tag: 'positiveDays',
        content: this.fundData.positiveDays
      })
      arr.push({
        tag: 'negativeDays',
        content: this.fundData.negativeDays
      })
      arr.push({
        tag: 'zeroDays',
        content: this.fundData.zeroDays
      })
      return arr
    },
    incomeIndicator1() {
      const arr = []
      arr.push({
        tag: 'finalProfit',
        content: this.fundData.finalProfit
      })
      arr.push({
        tag: 'annualRate',
        content: this.fundData.annualRate
      })
      arr.push({
        tag: 'averageDailyRate',
        content: this.fundData.averageDailyRate
      })
      arr.push({
        tag: 'winRate',
        content: this.fundData.winRate
      })
      arr.push({
        tag: 'profitLossRatio',
        content: this.fundData.profitLossRatio
      })
      return arr
    },
    incomeIndicator2() {
      const arr = []
      arr.push({
        tag: 'maxDrawDown',
        content: this.fundData.maxDrawDown
      })
      arr.push({
        tag: 'maxRise',
        content: this.fundData.maxRise
      })
      arr.push({
        tag: 'downsideSTDEV',
        content: this.fundData.downsideSTDEV
      })
      arr.push({
        tag: 'allsideSTDEV',
        content: this.fundData.allsideSTDEV
      })
      arr.push({
        tag: 'sharpRate',
        content: this.fundData.sharpRate
      })
      return arr
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>

<style scoped>

</style>
