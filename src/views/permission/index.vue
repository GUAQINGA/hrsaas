<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools>
        <template slot="after">
          <el-button type="primary" size="small" @click="addPermission(1, 0)">添加权限</el-button>
        </template>
      </page-tools>
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="标识" prop="code"></el-table-column>
        <el-table-column label="描述" prop="description"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="{ row }">
            <el-button v-if="row.type === 1" type="text" @click="addPermission(2, row.id)">添加权限</el-button>
            <el-button type="text" @click="editPermission(row.id)">编辑</el-button>
            <el-button type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog :visible="showDialog" :title="showTitle" @close="onCancel">
      <el-form ref="permissionForm" :model="formData" :rules="rules" label-width="120px">
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description" style="width: 90%"></el-input>
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
            style="width: 90%"
          ></el-switch>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-row type="flex" justify="center">
          <el-col :span="20">
            <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
            <el-button size="small" @click="onCancel">取消</el-button>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getPermissionList,
  addPermission,
  updatePermission,
  delPermission,
  getPermissionDetail
} from '@/api/permission'
import { tranListToTreeData } from '@/utils'

export default {
  components: {},
  props: {},
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      },
      rules: {
        name: [{ required: true, message: '名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑权限' : '新增权限'
    }
  },
  watch: {},
  created() {
    this.getPermissionList()
  },
  mounted() {},
  methods: {
    async getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), '0')
    },
    delPermission(id) {
      this.$confirm('确认删除该权限吗？')
        .then(async() => {
          return delPermission(id)
        })
        .then(() => {
          this.$message.success('删除权限成功')
          this.getPermissionList()
        })
    },
    addPermission(type, pid) {
      this.formData.type = type
      this.formData.pid = pid
      this.showDialog = true
    },
    async editPermission(id) {
      this.formData = await getPermissionDetail(id)
      this.showDialog = true
    },
    onCancel() {
      this.formData = {
        name: '',
        code: '',
        description: '',
        type: '',
        pid: '',
        enVisible: '0'
      }
      this.showDialog = false
      this.$refs.permissionForm.resetField()
    },
    onSubmit() {
      console.log('111')
      this.$refs.permissionForm
        .validate()
        .then(() => {
          if (this.formData.id) {
            return updatePermission(this.formData)
          }
          return addPermission(this.formData)
        })
        .then(() => {
          this.$message.success('添加权限成功')
          this.getPermissionList()
          this.showDialog = false
        })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
