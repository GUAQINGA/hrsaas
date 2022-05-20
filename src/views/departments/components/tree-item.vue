<template>
  <el-row type="flex" justify="space-between" align="middle" :style="isRootAddHeight">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link">
              操作
              <i class="el-icon-arrow-down el-icon--right" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="isRoot"
                command="add"
                :disabled="!checkPermission('add-dept')"
              >添加部门</el-dropdown-item>
              <el-dropdown-item v-else command="add" :disabled="!checkPermission('add-dept')">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="delete">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { deleteDepartment } from '@/api/departments'

export default {
  name: '',
  components: {},
  props: {
    treeNode: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isRootAddHeight: null
    }
  },
  computed: {},
  watch: {},
  created() {
    if (this.isRoot) {
      this.isRootAddHeight = 'width: 100%; height: 40px'
    } else {
      this.isRootAddHeight = 'width: 100%'
    }
  },
  mounted() {},
  methods: {
    handleCommand(command) {
      if (command === 'add') {
        this.$emit('addDepts', this.treeNode)
      } else if (command === 'edit') {
        this.$emit('editDepts', this.treeNode)
      } else {
        this.$confirm('确认删除该部门？').then(async() => {
          await deleteDepartment(this.treeNode.id)
          this.$emit('deleteDeptsSucces')
          this.$message({ message: '删除成功', type: 'success' })
        })
      }
      //   this.$message('click on item ' + command)
      //   console.log(this.treeNode.id)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
