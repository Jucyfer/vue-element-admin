<template>
  <div class="app-container">
    <el-button type="primary" @click="handleAddUser">新增用户</el-button>

    <el-table :data="usersList" style="width: 100%;margin-top:30px;" border>
      <el-table-column align="center" label="用户id" width="220">
        <template slot-scope="scope">
          {{ scope.row.key }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="用户名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="所属角色" width="220">
        <template slot-scope="scope">
          {{ scope.row.roles }}
        </template>
      </el-table-column>
      <el-table-column align="header-center" label="用户描述">
        <template slot-scope="scope">
          {{ scope.row.description }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑用户':'新建用户'">
      <el-form :model="user" label-width="80px" label-position="left">
        <el-form-item label="用户名称">
          <el-input v-model="user.name" placeholder="请输入用户名称" />
        </el-form-item>
        <el-form-item label="用户密码">
          <el-input v-model="user.pass" placeholder="请输入用户名密码" show-password />
        </el-form-item>
        <el-form-item label="用户描述">
          <el-input
            v-model="user.description"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入用户描述"
          />
        </el-form-item>
        <el-form-item label="角色列表">
          <el-select v-model="selectedRoles" multiple placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmUser">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import path from 'path'
import { deepClone } from '@/utils'
import { getUsers, addUser, deleteUser, updateUser } from '@/api/user'

const defaultUser = {
  key: '',
  pass: '',
  name: '',
  description: '',
  roles: []
}

export default {
  data() {
    return {
      user: Object.assign({}, defaultUser),
      selectedRoles: [],
      usersList: [],
      rolesList: [{
        value: 'admin',
        label: 'admin'
      }, {
        value: 'editor',
        label: 'editor'
      }, {
        value: 'visitor',
        label: 'visitor'
      }],
      dialogVisible: false,
      dialogType: 'new'
    }
  },
  computed: {
    rolesData() {
      return this.roles
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getUsers()
  },
  methods: {
    async getUsers() {
      const res = await getUsers()
      this.usersList = res.data
    },
    handleAddUser(scope) {
      this.user = Object.assign({}, defaultUser)
      this.dialogType = 'new'
      this.dialogVisible = true
      this.selectedRoles = []
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.user = deepClone(scope.row)
      this.selectedRoles = scope.row.roles
      this.dialogVisible = true
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认删除用户?', '警告', {
        confirmButtonText: '确认删除',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          await deleteUser(row.key)
          this.usersList.splice($index, 1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
        .catch(err => { console.error(err) })
    },
    async confirmUser() {
      const isEdit = this.dialogType === 'edit'

      const checkedRoles = this.selectedRoles
      console.log(checkedRoles)
      this.user.roles = deepClone(this.selectedRoles)

      if (isEdit) {
        await updateUser(this.user.key, this.user)
        for (let index = 0; index < this.usersList.length; index++) {
          if (this.usersList[index].key === this.user.key) {
            this.usersList.splice(index, 1, Object.assign({}, this.user))
            break
          }
        }
      } else {
        const { data } = await addUser(this.user)
        this.user.key = data.key
        this.usersList.push(this.user)
      }

      const { description, key, name, roles } = this.user
      this.dialogVisible = false
      this.selectedRoles = []
      this.$notify({
        title: 'Success',
        dangerouslyUseHTMLString: true,
        message: `
            <div>User Key: ${key}</div>
            <div>User Name: ${name}</div>
            <div>User Roles: ${roles}</div>
            <div>Description: ${description}</div>
          `,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container {
    .roles-table {
      margin-top: 30px;
    }
    .permission-tree {
      margin-bottom: 30px;
    }
  }
</style>
