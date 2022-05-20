<template>
  <!-- 新增部门信息弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="onCancel">
    <!-- 部门信息表单 -->
    <el-form ref="departmentForm" label-width="120px" :model="formData" :rules="rules">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" style="width: 90%" placeholder="1-50 个字符" />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input v-model="formData.code" style="width: 90%" placeholder="1-50 个字符" />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          v-model="formData.manager"
          style="width: 90%"
          placeholder="请选择"
          @focus="getEmployeesSimple"
        >
          <el-option
            v-for="item in employees"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 90%"
          placeholder="1-300 个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-row type="flex" justify="center">
        <el-col :span="20">
          <el-button size="small" @click="onCancel()">取消</el-button>
          <el-button type="primary" size="small" @click="onSubmit">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import {
  getDepartments,
  addDepartment,
  getDepartmentInfoById
} from '@/api/departments'
import { getEmployeesSimple } from '@/api/employees'
import { editDepartmentInfoById } from '@/api/departments'

export default {
  name: '',
  components: {},
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    treeNode: {
      type: Object,
      default: null
    }
  },
  data() {
    const isNameRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat

      if (this.formData.id) {
        // 编辑模式
        isRepeat = depts
          .filter((item) => {
            return (
              item.pid === this.formData.pid && item.id !== this.treeNode.id
            )
          })
          .some((item) => {
            return item.name === value
          })
      } else {
        // 新增模式
        isRepeat = depts
          .filter((item) => {
            return item.pid === this.treeNode.id
          })
          .some((item) => {
            return item.name === value
          })
      }

      isRepeat
        ? callback(new Error(`同级部门下已经有${value}存在了`))
        : callback()
    }
    const isCodeRepeat = async(rule, value, callback) => {
      const { depts } = await getDepartments()
      let isRepeat
      if (this.formData.id) {
        // 编辑模式
        isRepeat = depts
          .filter((item) => {
            return item.id !== this.treeNode.id
          })
          .some((item) => {
            return item.code === value && value
          })
      } else {
        // 新增模式
        isRepeat = depts.some((item) => {
          return item.code === value && value
        })
      }

      isRepeat
        ? callback(new Error(`组织架构里已经有${value}这个部门编码了`))
        : callback()
    }
    return {
      formData: {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      },
      rules: {
        name: [
          { required: true, message: '部门名称不能位空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门名称长度为 1-50 个字符',
            trigger: 'blur'
          },
          { validator: isNameRepeat, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '部门编码不能位空', trigger: 'blur' },
          {
            min: 1,
            max: 50,
            message: '部门编码长度为 1-50 个字符',
            trigger: 'blur'
          },
          { validator: isCodeRepeat, trigger: 'blur' }
        ],
        manager: [
          { required: true, message: '部门负责人不能位空', trigger: 'blur' }
        ],
        introduce: [
          { required: true, message: '部门介绍不能位空', trigger: 'blur' },
          {
            min: 1,
            max: 300,
            message: '部门介绍长度为 1-300 个字符',
            trigger: 'blur'
          }
        ]
      },
      employees: []
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  watch: {},
  created() {},
  mounted() {},
  methods: {
    async getEmployeesSimple() {
      this.employees = await getEmployeesSimple()
    },
    onCancel() {
      this.formData = {
        name: '',
        code: '',
        manager: '',
        introduce: ''
      }
      this.$emit('update:showDialog', false)
      this.$refs.departmentForm.resetFields()
    },
    onSubmit() {
      this.$refs.departmentForm.validate(async(valid) => {
        if (valid) {
          if (this.formData.id) {
            await editDepartmentInfoById(this.formData)
            this.$message.success('修改成功')
          } else {
            await addDepartment({ ...this.formData, pid: this.treeNode.id })
            this.$message.success('添加成功')
          }
          this.$emit('update-department')
          this.$emit('update:showDialog', false)
        }
      })
    },
    async getDepartmentInfoById(id) {
      this.formData = await getDepartmentInfoById(id)
      // console.log(this.formData)
    }
  }
}
</script>

<style lang="less" scoped>
</style>
