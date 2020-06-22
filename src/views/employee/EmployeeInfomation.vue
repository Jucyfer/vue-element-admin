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
      <el-table-column
        type="index"
        width="50px"
        label="序号"
        align="center"
      ></el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="基金从业编号" min-width="145px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.certCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="{row}">
          <span v-if="!row.isEditMode">{{ row.mobile }}</span>
          <el-input v-if="row.isEditMode" v-model="row.mobile" placehoder="请输入手机号" />
        </template>
      </el-table-column>
      <el-table-column :key="Math.random()" label="职务类型" align="center">
        <template slot-scope="{row}">
          <div v-if="!row.isEditMode" :key="Math.random()">
            <el-tag v-for="item in row.position" :key="item + Math.random()">{{ item | positionFilter }}</el-tag>
          </div>
          <el-select v-if="row.isEditMode" v-model="row.position" multiple clearable placeholder="请选择职务">
            <el-option
              v-for="item in positionOptions"
              :key="item.value + Math.random()"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="291" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button size="mini" :type="row.isEditMode?'success':'warn'" @click="handleEdit(row)">
            {{ row.isEditMode?'保存':'修改' }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->
  </div>
</template>

<script>
import store from '@/store/index'
export default {
  name: 'EmployeeInfomation',
  filters: {
    positionFilter(param) {
      return store.getters.employeepositionTranslation[param]
    }
  },
  data() {
    return {
      list: [],
      listLoading: false,
      positionOptions: [],
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
  created() {
    this.initList()
    this.initStore()
  },
  methods: {
    initStore() {
      this.positionOptions = this.$store.getters.employeePositionOptions
    },
    async initList() {
      this.list = []
      this.listLoading = true
      const { data: result } = await this.$axios.get('/secure/infomation/' + this.$store.getters.comId + '/staffs?userid=' + this.$store.getters.userid)
      this.list = result
      let i = 1
      this.list.forEach(e => {
        e.id = i++
        e.isEditMode = false
      })
      this.listLoading = false
    },
    async handleEdit(row) {
      row.isEditMode = !row.isEditMode
      if (!row.isEditMode) {
        // infomation/{pid}/staffs/{staffId}
        const { data: result } = await this.$axios.post('/secure/infomation/' + this.$store.getters.comId + '/staffs/' + row.staffId + '?userid=' + this.$store.getters.userid, { mobile: row.mobile, position: row.position })
        // eslint-disable-next-line eqeqeq
        if (result == 'success') {
          this.$message('修改成功')
        }
      }
      this.$forceUpdate()
    }
  }

}
</script>

<style scoped>

</style>
