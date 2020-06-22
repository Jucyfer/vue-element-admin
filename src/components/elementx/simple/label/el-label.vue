<template>
  <div class="el-label-basic" :style="styleObject">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'ElLabel',
  props: {
    // 颜色标识，默认为general-text；也兼容普通颜色
    color: {
      type: String,
      default: () => 'general-text'
    },
    size: {
      type: String,
      default: () => 'body'
    },
    shadow: {
      type: String,
      default: () => 'none'
    }
  },
  data() {
    const sizeMap = {
      'main-title': '20px',
      'title': '18px',
      'sub-title': '16px',
      'body': '14px',
      'tiny-body': '13px',
      'supplementary': '12px'
    }
    const fontFamily = ['Helvetica Neue', 'Helvetica', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', 'Arial', 'sans-serif']
    const shadowMap = {
      '1': '2px 2px 3px #ccc',
      '2': '-2px 2px 3px #ccc',
      '3': '-2px -2px 3px #ccc',
      '4': '2px -2px 3px #ccc'
    }
    const colorMap = {
      'brand': '#409EFF',
      'success': '#67C23A',
      'warning': '#E6A23C',
      'danger': '#F56C6C',
      'info': '#909399',
      'major-text': '#303133',
      'general-text': '#606266',
      'minor-text': '#909399',
      'placeholder-text': '#C0C4CC'
    }
    return {
      colorMap,
      sizeMap,
      fontFamily,
      shadowMap
    }
  },
  computed: {
    styleObject() {
      return {
        'font-size': this.insideSize,
        'color': this.insideColor,
        'font-family': this.fontFamily,
        'text-shadow': this.insideShadow
      }
    },
    insideColor() {
      const c = this.colorMap[this.color]
      return c || this.color
    },
    insideSize() {
      const s = this.sizeMap[this.size]
      return s || this.size
    },
    insideShadow() {
      const s = this.shadowMap[this.shadow]
      return s || this.shadow
    }
  }
}
</script>

<style scoped>
.el-label-basic{
  line-height: 1.5;
  font-size: 14px;
  padding: 5px;
}
</style>
