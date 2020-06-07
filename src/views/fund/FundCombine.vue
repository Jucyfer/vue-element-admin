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
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="console.log(1234)">
        新增
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="false"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;height:100%"
    >
      <el-table-column label="序号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组合基金名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建人" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预警线" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="强平线" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="产品类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最新拟合累计净值" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最新净值更新日期" align="center">
        <template slot-scope="{row}">
          <span>{{ row.temp }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <!--          编辑基金信息-->
          <el-button size="mini" type="success" @click="handleExamine(row)">
            编辑
          </el-button>
          <!--          弹框净值走势-->
          <el-button size="mini" type="success" @click="handleExamine(row)">
            查看
          </el-button>
          <!--          弹框净值走势-->
          <el-button size="mini" type="error" @click="handleExamine(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->
  </div>
</template>

<script>
export default {
  name: 'FundCombine',
  filters: {

  },
  data() {
    return {
      list: [{
        temp: 'test'
      }],
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
      tableKey: 0
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
