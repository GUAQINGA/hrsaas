<template>
  <el-dialog title="分配角色" :visible="showRoleDialog" @close="onCancel">
    <el-checkbox-group v-model="roleIds">
      <!-- 循环的角色 -->
      <el-checkbox v-for="item in roleList" :key="item.id" :label="item.id">{{ item.name }}</el-checkbox>
    </el-checkbox-group>
    <template slot="footer">
      <el-row type="flex" justify="end">
        <el-col>
          <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
          <el-button size="small" @click="onCancel">取消</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getRoleList } from '@/api/setting'
import { getUserInfoById } from '@/api/user'
import { assignRole } from '@/api/employees'

export default {
  name: '',
  components: {},
  props: {
    showRoleDialog: {
      type: Boolean,
      default: false
    },
    userId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      roleList: [],
      roleIds: []
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getRoleList()
  },
  mounted() {},
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList({ page: 1, pagesize: 20 })
      this.roleList = rows
    },
    async getUserInfoById(id) {
      const { roleIds } = await getUserInfoById(id)
      this.roleIds = roleIds
    },
    onCancel() {
      this.roleIds = []
      this.$emit('update:showRoleDialog', false)
    },
    async onSubmit() {
      await assignRole({ id: this.userId, roleIds: this.roleIds })
      this.$message.success('保存角色成功')
      this.$emit('update:showRoleDialog', false)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
