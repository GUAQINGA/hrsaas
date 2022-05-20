<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card class="department-card">
        <tree-item :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <div class="el-row">
          <div class="el-col">
            <el-tree :data="departs" :props="defaultProps" default-expand-all>
              <tree-item
                slot-scope="{ data }"
                :tree-node="data"
                @deleteDeptsSucces="getDepartments"
                @addDepts="addDepts"
                @editDepts="editDepts"
              />
            </el-tree>
          </div>
        </div>
      </el-card>
    </div>
    <add-department
      ref="dialog"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @update-department="getDepartments"
    />
  </div>
</template>

<script>
import TreeItem from './components/tree-item.vue'
import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/index'
import AddDepartment from './components/add-department.vue'

export default {
  components: {
    TreeItem,
    AddDepartment
  },
  data() {
    return {
      defaultProps: {
        label: 'name'
      },
      company: {
        id: '',
        name: '',
        manager: '负责人'
      },
      departs: [],
      showDialog: false,
      node: null
    }
  },
  created() {
    this.getDepartments()
  },
  methods: {
    async getDepartments() {
      const res = await getDepartments()
      this.company.name = res.companyName
      this.departs = tranListToTreeData(res.depts, '')
    },
    addDepts(node) {
      this.showDialog = true
      this.node = node
    },
    editDepts(node) {
      this.showDialog = true
      this.node = node
      this.$refs.dialog.getDepartmentInfoById(node.id)
    }
  }
}
</script>

<style scoped>
.department-card{
  padding: 30px 140px;
  font-size: 14px;
}
</style>
