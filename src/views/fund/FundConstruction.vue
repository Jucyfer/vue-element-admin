<template>
  <div>
    <el-row gutter="20" :class="['el-row-wrap']" :style="{'height':computedHeight+'px'}" >
      <el-col span="24">
        <el-label size="main-title" color="placeholder-text" shadow="1">图表占位符</el-label>
      </el-col>
    </el-row>
    <el-row gutter="20" :class="['el-row-wrap']" :style="{'height':computedHeight+'px'}">
      <el-col span="7">
        <el-label size="main-title" color="placeholder-text" shadow="1">左穿梭列表占位符</el-label>
      </el-col>
      <el-col span="1">
        <el-label size="main-title" color="placeholder-text" shadow="1">左操作占位符</el-label>
      </el-col>
      <el-col span="1">
        <el-label size="main-title" color="placeholder-text" shadow="1">右操作占位符</el-label>
      </el-col>
      <el-col span="15">
        <el-label size="main-title" color="placeholder-text" shadow="1">右穿梭列表占位符</el-label>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import elLabel from '@/components/elementx/simple/label/el-label'
export default {
  name: 'FundConstruction',
  components: {
    elLabel
  },
  computed: {
    computedHeight() {
      const privateHeight = window.document.documentElement.clientHeight || window.document.body.clientHeight
      return (privateHeight - 84) / 2
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-row-wrap{
    padding-top: 10px;
    padding-bottom: 10px;
    display: flex;
    align-items: center;
    border-bottom-width: 2px;
    border-bottom-color: #3b91b6;
    border-bottom-style: dashed;
    &:last-child {
      border-bottom: none;
    }
  }
  .el-col{
    text-align:center;
    height:100%;
    border-right-style: dashed;
    border-right-color: #3b91b6;
    border-right-width: 2px;
    &:last-child {
      border-right: none;
    }
  }
</style>
