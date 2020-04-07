<template>
  <div>
    <el-button size="mini" type="success" @click="handleAppend">
      添加
    </el-button>
    <el-table
      :data="tableData"
      width="auto"
    >

      <el-table-column
        v-for="column in columnMeta"
        :key="column.label"
        :label="column.label"
        width="180px"
        class="tbcol"
      >
        <template slot-scope="{row}">
          <editable-cell v-model="row[column.name]" />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100%" class="tbcol">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import EditableCell from '@/views/table/EditableCell'

export default {
  name: 'DynamicTable',
  components: {
    EditableCell
  },
  props: {
    value: Array,
    columnMeta: Array // columnMeta格式：[{name,label}]
  },
  event: ['change'],
  data() {
    return {
      tableData: this.value
    }
  },
  watch: {
    tableData(oldData, newData) {
      this.$emit('change', newData)
    }
  },
  methods: {
    handleAppend() {
      var emptyRow = this.columnMeta.reduce((a, b) => {
        a[b.name] = ''
        return a
      }, {})
      this.tableData.push(emptyRow)
    },
    handleDelete(index) {
      this.tableData.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
