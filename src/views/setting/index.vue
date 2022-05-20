<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="角色管理">
            <el-row style="height:60px;">
              <el-button
                type="primary"
                icon="el-icon-plus"
                size="small"
                @click="showDialog = true"
              >新增角色</el-button>
            </el-row>
            <el-table border :data="list">
              <el-table-column align="center" type="index" label="序号" width="120" />
              <el-table-column align="center" prop="name" label="名称" width="240" />
              <el-table-column align="center" prop="description" label="描述" />
              <el-table-column align="center" label="操作">
                <template slot-scope="{ row }">
                  <el-button size="small" type="success" @click="assignPermission(row.id)">分配权限</el-button>
                  <el-button size="small" type="primary" @click="editCurrentRole(row.id)">编辑权限</el-button>
                  <el-button size="small" type="danger" @click="delCurrentRole(row.id)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-row type="flex" justify="end" align="middle" style="height:60px">
              <el-pagination
                layout="prev, pager, next"
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                @current-change="changePage"
              />
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="公司信息">
            <el-alert
              show-icon
              :closable="false"
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
            />
            <el-form label-width="120px" style="margin-top:50px">
              <el-form-item label="企业名称">
                <el-input v-model="formData.name" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input v-model="formData.companyAddress" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="电话">
                <el-input v-model="formData.companyPhone" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input v-model="formData.mailbox" disabled style="width: 400px" />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  disabled
                  style="width: 400px"
                  type="textarea"
                  :rows="2"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 编辑权限 -->
    <el-dialog title="编辑部门" :visible="showDialog" @close="onCancel">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="120px">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" style="width: 90%" />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="20">
          <el-button size="small" @click="onCancel">取消</el-button>
          <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>
    <!-- 分配权限 -->
    <el-dialog title="分配权限" :visible="showPermissionDialog" @close="onCancelPermission">
      <el-tree
        ref="permissionTree"
        :data="permissionData"
        :props="defaultProps"
        show-checkbox
        check-strictly
        default-expand-all
        :default-checked-keys="checked"
        node-key="id"
      />
      <template slot="footer">
        <el-row type="flex" justify="center">
          <el-col>
            <el-button size="small" @click="onCancelPermission">取消</el-button>
            <el-button type="primary" size="small" @click="onSubmitPermission">确定</el-button>
          </el-col>
        </el-row>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfoById,
  delRoleById,
  getRoleInfoById,
  updateRoleInfoById,
  addRole,
  addAssignPermission
} from '@/api/setting'
import { getPermissionList } from '@/api/permission'
import { tranListToTreeData } from '@/utils'
import { mapGetters } from 'vuex'

export default {
  components: {},
  props: {},
  data() {
    return {
      list: [],
      page: {
        page: 1,
        pagesize: 10,
        total: 0
      },
      formData: {},
      showDialog: false,
      showPermissionDialog: false,
      roleForm: {
        name: '',
        description: ''
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }]
      },
      permissionData: [],
      defaultProps: {
        label: 'name'
      },
      userId: null,
      checked: []
    }
  },
  computed: {
    ...mapGetters(['companyId'])
  },
  watch: {},
  created() {
    this.getRoleList()
    this.getCompanyInfoById()
  },
  mounted() {},
  methods: {
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page)
      this.list = rows
      this.page.total = total
    },
    async getCompanyInfoById() {
      this.formData = await getCompanyInfoById(this.companyId)
      console.log(this.formData)
    },
    changePage(newPage) {
      this.page.page = newPage
      this.getRoleList()
    },

    async delCurrentRole(id) {
      try {
        await this.$confirm('确认删除该角色吗？')
        const res = await delRoleById(id)
        this.getRoleList()
        this.$message.success('删除角色成功')
        console.log(res)
      } catch (error) {
        console.log(error)
      }
    },
    async editCurrentRole(id) {
      this.roleForm = await getRoleInfoById(id)
      this.showDialog = true
      // await updateRoleInfoById()
    },
    onCancel() {
      this.roleForm = {
        name: '',
        description: ''
      }
      this.showDialog = false
      this.$refs.roleForm.resetFields()
    },
    onSubmit() {
      this.$refs.roleForm.validate(async(valid) => {
        if (valid) {
          if (this.roleForm.id) {
            // 编辑模式
            await updateRoleInfoById(this.roleForm)
            this.$message.success('更新角色成功')
          } else {
            // 新增模式
            await addRole(this.roleForm)
            this.$message.success('新增角色成功')
          }

          this.getRoleList()
          this.showDialog = false
        }
      })
    },
    async assignPermission(id) {
      this.permissionData = tranListToTreeData(await getPermissionList(id), '0')
      this.userId = id
      const { permIds } = await getRoleInfoById(this.userId)
      this.checked = permIds

      this.showPermissionDialog = true
    },
    onCancelPermission() {
      this.checked = []
      this.showPermissionDialog = false
    },
    async onSubmitPermission() {
      await addAssignPermission({
        id: this.userId,
        permIds: this.$refs.permissionTree.getCheckedKeys()
      })
      this.$message.success('分配权限成功')
      this.showPermissionDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
