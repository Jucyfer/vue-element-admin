<template>
  <div class="app-container">
    <!--    <el-button type="primary" @click="handleAddRole">New Role</el-button>-->
    <el-button type="primary" @click="handleAddRole">添加角色</el-button>
    <el-button type="primary" @click="getRoles">刷新列表</el-button>

    <el-table :data="rolesList" style="width: 100%;margin-top:30px;" border>
      <!--      <el-table-column align="center" label="Role Key" width="220">-->
      <el-table-column align="center" label="角色ID" width="220">
        <template slot-scope="scope">
          {{ scope.row.roleId }}
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" label="Role Name" width="220">-->
      <el-table-column align="center" label="角色名称" width="220">
        <template slot-scope="scope">
          {{ scope.row.roleName }}
        </template>
      </el-table-column>
      <!--      <el-table-column align="header-center" label="Description">-->
      <el-table-column align="header-center" label="描述">
        <template slot-scope="scope">
          {{ scope.row.notes }}
        </template>
      </el-table-column>
      <!--      <el-table-column align="center" label="Operations">-->
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <!--          <el-button type="primary" size="small" @click="handleEdit(scope)">Edit</el-button>-->
          <el-button v-if="scope.row.roleName !== 'root'" type="primary" size="small" @click="handleEdit(scope)">编辑</el-button>
          <!--          <el-button type="danger" size="small" @click="handleDelete(scope)">Delete</el-button>-->
          <el-button v-if="scope.row.roleName !== 'root'" type="danger" size="small" @click="handleDelete(scope)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="dialogVisible" :title="dialogType==='edit'?'编辑角色':'新增角色'">
      <el-form :model="role" label-width="80px" label-position="left">
        <el-form-item label="角色ID">
          <el-input v-model="role.roleId" placeholder="Auto Generated" :disabled="dialogType!=='edit'" />
        </el-form-item>
        <el-form-item label="角色名称">
          <el-input v-model="role.roleName" placeholder="Role Name" :disabled="dialogType==='edit'" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input
            v-model="role.notes"
            :autosize="{ minRows: 2, maxRows: 4}"
            type="textarea"
            placeholder="请输入角色描述"
          />
        </el-form-item>
        <!--        <el-form-item label="从现有角色选择">-->
        <!--          <el-transfer v-model="debug_selectedRole" :data="rolesList"></el-transfer>-->
        <!--        </el-form-item>-->
        <el-form-item label="菜单权限">
          <!--          <el-tree-->
          <!--            ref="tree"-->
          <!--            :check-strictly="checkStrictly"-->
          <!--            :data="routesData"-->
          <!--            :props="defaultProps"-->
          <!--            show-checkbox-->
          <!--            node-key="path"-->
          <!--            class="permission-tree"-->
          <!--          />-->
          <el-tree
            ref="tree"
            :check-strictly="checkStrictly"
            :data="routesData"
            :props="defaultProps"
            :default-checked-keys="role.privs"
            show-checkbox
            node-key="menuId"
            class="permission-tree"
          />
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button type="danger" @click="dialogVisible=false">取消</el-button>
        <el-button type="primary" @click="confirmRole">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import path from 'path'
import { deepClone } from '@/utils'
// import { getRoutes, getRoles, addRole, deleteRole, updateRole } from '@/api/role'

const defaultRole = {
  roleId: '',
  roleName: '',
  notes: '',
  privs: []
}

export default {
  data() {
    return {
      role: Object.assign({}, defaultRole),
      routes: [],
      rolesList: [],
      debug_selectedRole: [],
      dialogVisible: false,
      dialogType: 'new',
      checkStrictly: false,
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  computed: {
    routesData() {
      return this.routes
    }
  },
  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getRoles()
  },
  methods: {
    async getRoutes() {
      // 原本的代码
      // const res = await getRoutes()
      const res = await this.$axios.get('/secure/menu/all')
      this.serviceRoutes = res.data
      console.log(res.data)
      // this.routes = this.generateRoutes(res.data)
      this.routes = this.generateRoutes2(res.data)
    },
    async getRoles() {
      // const res = await getRoles()
      const res = await this.$axios.get('/secure/role/scene/list')
      if (res.data && res.data.length && res.data.length >= 0) {
        this.rolesList = res.data
        this.$message.success('加载成功！')
      } else {
        this.$message.error('加载失败！')
      }
    },
    generateRoutes2(routes) {
      const res = []
      for (const route of routes) {
        route.title = route.meta.title
        const data = {
          menuId: route.menuId,
          title: route.meta && route.meta.title
        }
        if (route.menuId === 'EFFFFF') {
          data.disabled = true
        }
        if (route.children && route.children.length > 0) {
          data.children = this.generateRoutes2(route.children)
        }
        res.push(data)
      }
      return res
    },
    // Reshape the routes structure so that it looks the same as the sidebar
    generateRoutes(routes, basePath = '/') {
      const res = []

      for (let route of routes) {
        // skip some route
        if (route.hidden) { continue }

        const onlyOneShowingChild = this.onlyOneShowingChild(route.children, route)

        if (route.children && onlyOneShowingChild && !route.alwaysShow) {
          route = onlyOneShowingChild
        }

        const data = {
          path: path.resolve(basePath, route.path),
          title: route.meta && route.meta.title

        }

        // recursive child routes
        if (route.children) {
          data.children = this.generateRoutes(route.children, data.path)
        }
        res.push(data)
      }
      return res
    },
    generateArr(routes) {
      let data = []
      routes.forEach(route => {
        data.push(route)
        if (route.children) {
          const temp = this.generateArr(route.children)
          if (temp.length > 0) {
            data = [...data, ...temp]
          }
        }
      })
      return data
    },
    handleAddRole() {
      this.role = Object.assign({}, defaultRole)
      this.dialogType = 'new'
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.tree) {
          console.log('get tree.')
          this.$refs.tree.setCheckedKeys(['EFFFFF'])
        }
      }
      )
    },
    handleEdit(scope) {
      this.dialogType = 'edit'
      this.dialogVisible = true
      // this.checkStrictly = true
      this.role = deepClone(scope.row)
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(scope.row.privs)
        // const routes = this.generateRoutes(this.role.routes)
        // set checked state of a node not affects its father and child nodes
        // this.checkStrictly = false
      })
    },
    handleDelete({ $index, row }) {
      this.$confirm('确认移除该角色？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          // await deleteRole(row.roleId)
          const resp = await this.$axios.delete('/secure/role/scene/' + row.roleId)
          if (resp.data === 'success') {
            this.rolesList.splice($index, 1)
            this.$message({
              type: 'success',
              message: 'Delete succeed!'
            })
            this.getRoles()
          } else {
            this.$message({
              type: 'error',
              message: 'Delete failed!'
            })
          }
        })
        .catch(err => { console.error(err) })
    },
    generateTree(routes, basePath = '/', checkedKeys) {
      const res = []

      for (const route of routes) {
        const routePath = path.resolve(basePath, route.path)

        // recursive child routes
        if (route.children) {
          route.children = this.generateTree(route.children, routePath, checkedKeys)
        }

        if (checkedKeys.includes(routePath) || (route.children && route.children.length >= 1)) {
          res.push(route)
        }
      }
      return res
    },
    async confirmRole() {
      // console.log(this.debug_selectedRole)
      console.log('当前选择的节点（key）：', this.$refs.tree.getCheckedKeys(false))
      const payload = deepClone(this.role)
      payload.privs = this.$refs.tree.getCheckedKeys(false)
      console.log(payload)
      const isEdit = this.dialogType === 'edit'
      let resp
      if (isEdit) {
        resp = await this.$axios.post('/secure/role/scene', payload)
      } else {
        resp = await this.$axios.post('/secure/role/scene/add', payload)
      }
      const data = resp.data
      console.log(data)
      if (data === 'success') {
        this.$message.success('操作成功！')
      } else {
        this.$message.error('操作失败！')
      }
      this.dialogVisible = false
      this.rolesList = []
      this.getRoles()

      // console.log('当前选择的节点（node）：', this.$refs.tree.getCheckedNodes(false))
      return
      //
      // const checkedKeys = this.$refs.tree.getCheckedKeys()
      // this.role.routes = this.generateTree(deepClone(this.serviceRoutes), '/', checkedKeys)
      //
      // if (isEdit) {
      //   await updateRole(this.role.key, this.role)
      //   for (let index = 0; index < this.rolesList.length; index++) {
      //     if (this.rolesList[index].key === this.role.key) {
      //       this.rolesList.splice(index, 1, Object.assign({}, this.role))
      //       break
      //     }
      //   }
      // } else {
      //   const { data } = await addRole(this.role)
      //   this.role.key = data.key
      //   this.rolesList.push(this.role)
      // }
      //
      // const { description, key, name } = this.role
      // this.dialogVisible = false
      // this.$notify({
      //   title: 'Success',
      //   dangerouslyUseHTMLString: true,
      //   message: `
      //       <div>Role Key: ${key}</div>
      //       <div>Role Name: ${name}</div>
      //       <div>Description: ${description}</div>
      //     `,
      //   type: 'success'
      // })
    },
    // reference: src/view/layout/components/Sidebar/SidebarItem.vue
    onlyOneShowingChild(children = [], parent) {
      let onlyOneChild = null
      const showingChildren = children.filter(item => !item.hidden)

      // When there is only one child route, the child route is displayed by default
      if (showingChildren.length === 1) {
        onlyOneChild = showingChildren[0]
        onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
        return onlyOneChild
      }

      // Show parent if there are no child route to display
      if (showingChildren.length === 0) {
        onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return onlyOneChild
      }

      return false
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
