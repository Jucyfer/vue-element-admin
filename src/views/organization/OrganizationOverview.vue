<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="console.log(1234)" />
      <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="console.log(1234)">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="console.log(1234)">
        查找
      </el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-refresh" @click="initList">
        刷新列表
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;height:100%"
    >
      <el-table-column label="序号" width="63px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基金管理人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="成立日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="基金策略"
        align="center"
      >
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经营地址" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="投顾资质" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="管理规模" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="协会管理规模" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="对接人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!--          弹框净值走势-->
          <el-button size="mini" type="success" @click="handleExamine(row)">
            查看
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      tableKey: 0,
      list: [
        {
          temp: 'temp'
        }
      ],
      listLoading: false
    }
  },
  methods: {
    handleExamine(row) {
      return
    }
  }

}
</script>

<style scoped>

</style>
