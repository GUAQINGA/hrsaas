<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <template slot="before">
          <span>共 {{ page.total }} 条记录</span>
        </template>
        <template slot="after">
          <el-button size="small" type="success" @click="$router.push('/import')">Excel 导入</el-button>
          <el-button size="small" type="danger" @click="exportExcel">Excel 导出</el-button>
          <el-button
            size="small"
            type="primary"
            @click="showDialog = true"
            :disabled="!checkPermission('add-emp')"
          >新增员工</el-button>
        </template>
      </page-tools>
      <el-table v-loading="loading" :data="list">
        <el-table-column type="index" label="序号" sortable />
        <el-table-column prop="username" label="姓名" sortable />
        <el-table-column label="头像" align="center">
          <template slot-scope="{ row }">
            <img
              v-imageerror="defaultAvatar"
              :src="row.staffPhoto"
              style="padding: 10px;width: 80px;height: 80px;border-radius: 50%"
              @click="onClickQRCode(row.staffPhoto)"
              alt
            />
          </template>
        </el-table-column>
        <el-table-column prop="workNumber" label="工号" sortable />
        <el-table-column
          prop="formOfEmployment"
          :formatter="formatEmployment"
          label="聘用形式"
          sortable
        />
        <el-table-column prop="departmentName" label="部门" sortable />
        <el-table-column prop="timeOfEntry" label="入职时间" sortable>
          <template v-slot="obj">{{ obj.row.timeOfEntry | formatDate }}</template>
        </el-table-column>
        <el-table-column prop="enableState" label="账户状态" sortable>
          <template>
            <el-switch :value="true" />
          </template>
        </el-table-column>
        <el-table-column label="操作" sortable fixed="right" width="280">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              @click="$router.push(`employees/detail/${row.id}`)"
            >查看</el-button>
            <el-button type="text" size="small">转正</el-button>
            <el-button type="text" size="small">调岗</el-button>
            <el-button type="text" size="small">离职</el-button>
            <el-button type="text" size="small" @click="updateRole(row.id)">角色</el-button>
            <el-button type="text" size="small" @click="delEmployeesById(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          :current-page="page.page"
          :page-size="page.size"
          :total="page.total"
          layout="prev, pager, next"
          @current-change="currentPage"
        />
      </el-row>
    </div>
    <!-- 添加员工弹窗 -->
    <add-employee :show-dialog.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showQRCode" width="500px">
      <el-row type="flex" justify="center">
        <canvas ref="qrCodeCanvas"></canvas>
      </el-row>
    </el-dialog>
    <!-- 分配角色弹窗 -->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId"></assign-role>
  </div>
</template>

<script>
import { getEmployees, delEmployeesById } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees'
import AddEmployee from './components/add-employee'
import { formatDate } from '@/filters'
import QRCode from 'qrcode'
import AssignRole from './components/assign-role.vue'

export default {
  name: '',
  components: {
    AddEmployee,
    AssignRole
  },
  props: {},
  data() {
    return {
      list: [],
      page: {
        page: 1,
        size: 10,
        total: 0
      },
      loading: false,
      showDialog: false,
      defaultAvatar: require('@/assets/common/avatar.jpg'),
      showQRCode: false,
      showRoleDialog: false,
      userId: null
    }
  },
  computed: {},
  watch: {},
  created() {
    this.getEmployees()
  },
  mounted() {},
  methods: {
    async getEmployees() {
      this.loading = true
      const { total, rows } = await getEmployees(this.page)

      this.page.total = total
      this.list = rows
      this.loading = false
    },
    currentPage(newPage) {
      this.page.page = newPage
      this.getEmployees()
    },
    formatEmployment(row, column, cellValue, index) {
      const result = EmployeeEnum.hireType.find((item) => {
        return item.id === cellValue
      })
      // console.log(result)

      return result ? result.value : '未知'
    },
    delEmployeesById(id) {
      console.log(id)
      this.$confirm('确认删除该员工信息？')
        .then(async() => {
          await delEmployeesById(id)
          this.$message.success('删除员工信息成功')
          this.getEmployees()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    exportExcel() {
      const headers = {
        手机号: 'mobile',
        姓名: 'username',
        入职日期: 'timeOfEntry',
        聘用形式: 'formOfEmployment',
        转正日期: 'correctionTime',
        工号: 'workNumber',
        部门: 'departmentName'
      }
      import('@/vendor/Export2Excel').then(async(excel) => {
        const { rows } = await getEmployees({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows)
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息',
          multiHeader,
          merges
        })
      })
    },
    formatJson(headers, rows) {
      return rows.map((item) => {
        return Object.keys(headers).map((key) => {
          if (
            headers[key] === 'timeOfEntry' ||
            headers[key] === 'correctionTime'
          ) {
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            const result = EmployeeEnum.hireType.find((obj) => {
              return obj.id === item[headers[key]]
            })
            console.log(result)
            return result ? result.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    onClickQRCode(imgUrl) {
      console.log(imgUrl)
      if (imgUrl) {
        this.showQRCode = true
        this.$nextTick(() => {
          QRCode.toCanvas(this.$refs.qrCodeCanvas, imgUrl)
        })
      } else {
        this.$message.warning('该用户没有上传头像')
      }
    },
    async updateRole(id) {
      this.userId = id
      await this.$refs.assignRole.getUserInfoById(id)
      this.showRoleDialog = true
    },
    checkPermission(){
      
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
