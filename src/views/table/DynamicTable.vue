<template>
  <div>
    <el-button v-if="!isFixed" size="mini" type="success" @click="handleAppend">
      添加
    </el-button>
    <el-table
      :data="tableData"
      style="width: 100%"
    >

      <el-table-column
        v-for="column in columnMeta"
        :key="column.label"
        :label="column.label"
        :min-width="column.columnWidth || 180"
        class="tbcol"
      >
        <template slot-scope="{row}">
          <editable-cell
            v-if="(column.is||customOptions.globalEditType)!='select'"
            v-model="row[column.name]"
            :edit-type="column.is||customOptions.globalEditType||'input'"
            :editable="column.isEditable"
            :custom-content-wrapper="customOptions.customContentWrapper"
            :viewas="column.viewas"
            :holder="column.holder"
            :tipshown="column.hastip"
            :tiptext="column.tip"
          />
          <el-checkbox
          v-else-if="(column.is || customOptions.globalEditType)=='check'"
          v-model="row[column.name]"
          >
            是/否
          </el-checkbox>

          <el-select
            v-else
            :remote="column.remote"
            :filterable="column.filterable"
            :remote-method="(data)=>remoteMethod(data,column)"
            v-model="row[column.name]"
            @change="column.options=(column.remote?[]:column.options)"
          >
            <el-option
              v-for="item in column.options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </template>
      </el-table-column>
      <el-table-column v-if="!isFixed" label="动作" width="180" class="tbcol">
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
    columnMeta: Array, // columnMeta格式：[{name,label,is,isEditable}]
    customOptions: Object
  },
  event: ['change'],
  data() {
    return {
      tableData: this.value
    }
  },
  computed: {
    isFixed() {
      return this.customOptions.fixed == null ? false : this.customOptions.fixed
    },
    columnWidth() {
      return this.customOptions.columnWidth == null ? '180px' : this.customOptions.columnWidth
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
    },
    async remoteMethod(data, column) {
      console.log(column)
      const { data: arr } = await this.$axios.get(column.remoteURL)
      console.log(arr)
      column.options = arr
      console.log(column)
    }
  }
}
</script>

<style scoped>

</style>
