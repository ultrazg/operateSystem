<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      :labelWidth="'150px'"
      @submit="submitForm"
    >
      <div slot="permissionsList">
        <el-tree
          :data="treeData"
          ref="permissionsListTree"
          show-checkbox
          default-expand-all
          node-key="id"
          :default-checked-keys="checkedKeys"
          :props="defaultProps"
        >
        </el-tree>
      </div>
    </FormItem>
  </div>
</template>

<script>
import { toTree } from 'util/util';
import FormItem from '@/components/formItem';
import { listPermissionsByRoleCode, addRolePermissions } from '@/api/basicInformationManagement/roleManagementIndex';

export default {
  name: 'configurePermissions',
  components: {
    FormItem,
  },
  props: {
    show: Boolean,
    data: {},
  },
  inject: ['common'],
  data() {
    const { configType } = this.data;

    return {
      defaultProps: {
        label: 'permissionName',
      },
      treeData: [],
      checkedKeys: [],
      rolesListData: [],
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {},
      layout: [
        {
          title: '配置权限',
          formItems: [
            {
              label: '角色名称',
              labelWidth: '150px',
              prop: 'roleName',
              inputType: 'input',
              span: 24,
              disabled: true,
            },
            {
              label: '请选择需要配置资源',
              labelWidth: '150px',
              prop: 'permissionsList',
              inputType: 'custom',
              span: 24,
              options: this.getListPermissionsByRoleCode(),
            },
          ],
        },
      ],
      formRules: {
        roleName: {
          required: true,
          message: '请输入角色名称',
          trigger: 'blur',
        },
        // permissionsList: {
        //   required: true,
        //   message: '请选择需要配置资源',
        //   trigger: 'change',
        // },
      },
    };
  },
  mounted() {
    // this.$nextTick(() => {
    // });
  },
  watch: {
    data(val) {
      // this.data = val;
      this.inputDisabled = val.configType === 'detail';
      this.isEdit = ['add', 'edit'].includes(val.configType);
      this.isAdd = ['add'].includes(val.configType);
      if (!this.isAdd) {
        this.reqDetail();
      }
    },
  },
  methods: {
    rolesListChange(val) {
      console.log(val);
    },
    // 获取配置角色列表
    getListPermissionsByRoleCode() {
      const { row } = this.data;

      listPermissionsByRoleCode(row.roleCode).then((res) => {
        this.treeData = toTree(res.data);
        this.checkedKeys = this.checkTree(res.data);
      });
    },
    // 获取当前被选中的数
    checkTree(treeData) {
      if (!treeData) {
        return [];
      }
      const check = [];

      treeData.forEach((item) => {
        if (item.isCheck) {
          check.push(item.id);
        }
      });

      return check;
    },
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        this.form = {
          ...this.form,
          ...row,
        };
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const param = {
        permissionsList: this.getPermissionsListTree(),
        roleCode: val.roleCode,
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      addRolePermissions(param).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right',
          });
          this.$emit('success');
        }
      });
    },
    // 抛出当前角色所选权限
    getPermissionsListTree() {
      const checkNode = this.$refs.permissionsListTree.getCheckedNodes(); // 获取当前全部被选中的元素
      const checkParNode = this.$refs.permissionsListTree.getHalfCheckedNodes(); // 当前被选中的父节点
      const checkTreeList = [...checkNode, ...checkParNode];
      const treeArr = [];

      checkTreeList.forEach((item) => {
        const { permissionCode } = item;

        treeArr.push(permissionCode);
      });

      return treeArr;
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
  },
  created() {
    if (this.isAdd === false) {
      this.reqDetail();
    }
  },
};
</script>

<style lang="less" scoped>
#base {
  /deep/.el-tree-node > .el-tree-node__children {
    overflow: inherit;
  }
}
</style>
