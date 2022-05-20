<template>
  <el-dialog :visible="showDialog" title="新增员工" width="30%" @close="onCancel">
    <el-form ref="addEmployeeForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width: 85%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width: 85%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width: 85%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width: 85%" placeholder="请选择聘用形式">
          <!-- <el-option
            v-for="item in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.value"
          />-->
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.value"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width: 85%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          style="width: 85%"
          placeholder="请选择部门"
          @focus="getDepartments"
        />
        <el-tree
          v-if="showTreeNode"
          v-loading="loading"
          :data="treeData"
          :props="defaultProps"
          default-expand-all
          @node-click="currentNode"
        />
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width: 85%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-row type="flex" justify="center">
        <el-col :span="18">
          <el-button size="small" @click="onCancel">取消</el-button>
          <el-button size="small" type="primary" @click="onSubmit">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from '@/api/departments'
import { addEmployee } from '@/api/employees'
import { tranListToTreeData } from '@/utils/index'
import EmployeeEnum from '@/api/constant/employees'

export default {
  name: '',
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      formData: {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      },
      rules: {
        username: [
          { requires: true, message: '姓名不能为空', trigger: 'blur' },
          { min: 1, max: 4, message: '姓名长度为 1-4 个字符', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: 'blur' }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: 'blur' }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: 'change' }
        ],
        timeOfEntry: [{ required: true, message: '入职时间', trigger: 'blur' }]
      },
      defaultProps: {
        label: 'name'
      },
      showTreeNode: false,
      loading: false,
      treeData: [],
      EmployeeEnum,
      options: [
        {
          id: 1,
          value: '正式'
        },
        {
          id: 2,
          value: '非正式'
        }
      ]
    }
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async getDepartments() {
      this.loading = true
      const { depts } = await getDepartments()
      this.treeData = tranListToTreeData(depts, '')
      this.showTreeNode = true
      console.log(this.treeData)
      this.loading = false
    },
    currentNode(node) {
      this.formData.departmentName = node.name
      this.showTreeNode = false
    },
    onCancel() {
      this.formData = {
        username: '',
        mobile: '',
        formOfEmployment: '',
        workNumber: '',
        departmentName: '',
        timeOfEntry: '',
        correctionTime: ''
      }
      this.$refs.addEmployeeForm.resetFields()
      this.$emit('update:showDialog', false)
    },
    onSubmit() {
      this.$refs.addEmployeeForm
        .validate()
        .then(async(valid) => {
          if (valid) {
            const res = await addEmployee(this.formData)
            console.log(res)
            this.$parent.getDepartments && this.$parent.getDepartments()
            this.$emit('update:showDialog', false)
            this.$message.success('添加员工信息成功')
          }
        })
        .catch((error) => {
          console.log(error)
          this.$message.error(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
