<template>
  <el-table v-loading="listLoading" :data="list" style="width: 100%;padding-top: 15px;">
    <!--    <el-table-column label="Order_No" min-width="200">-->
    <el-table-column label="机构名称" min-width="200">
      <template slot-scope="{row}">
        <router-link :to="'/orgList/detail/'+row.pid">
        {{ row.pname }}
        </router-link>
      </template>
    </el-table-column>
    <!--    <el-table-column label="Price" width="195" align="center">-->
    <el-table-column label="填报人" min-width="200" align="center">
      <template slot-scope="{row}">
        {{ row.name }}
      </template>
    </el-table-column>
    <!--    <el-table-column label="Status" width="100" align="center">-->
    <el-table-column label="更新时间" min-width="200" align="center">
      <template slot-scope="{row}">
          {{ row.lastupdatetime }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
// import { transactionList } from '@/api/remote-search'

export default {
  filters: {
    // statusFilter(status) {
    //   const statusMap = {
    //     success: 'success',
    //     pending: 'danger'
    //   }
    //   return statusMap[status]
    // },
    // orderNoFilter(str) {
    //   return str.substring(0, 30)
    // }
  },
  data() {
    return {
      list: [],
      listLoading: false
    }
  },
  created() {
    this.fetchData()
    this.getList()
  },
  methods: {
    fetchData() {
      // transactionList().then(response => {
      //   this.list = response.data.items.slice(0, 8)
      // })
    },
    async getList() {
      this.listLoading = true
      const { data: resp } = await this.$axios.get('/secure/approval/indexes?userid=' + this.$store.getters.userid)
      console.log(resp)
      this.list = resp.slice(0, 8)
      this.listLoading = false
    }
  }
}
</script>
