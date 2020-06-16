<template>
  <el-table
    :show-header="false"
    :data="list"
    align="center"
    border
    fit
    style="width: 100%;height:100%"
  >
    <el-table-column align="center">
      <template slot-scope="{row}">
        <span>{{ row.tag | tagFilter }}</span>
      </template>
    </el-table-column>
    <el-table-column align="center">
      <template slot-scope="{row}">
        <span>{{ row.content }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import store from '@/store/index'
export default {
  filters: {
    tagFilter(param) {
      return store.getters.fundStatisticMap[param]
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  }
}
</script>

<style scoped>

</style>
