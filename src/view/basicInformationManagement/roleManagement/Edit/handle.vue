<template>
  <div id="base">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import { updateRole } from '@/api/basicInformationManagement/roleManagementIndex';

export default {
  name: 'handleInfo',
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
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {},
      layout: [
        {
          title: ' 角色新增',
          formItems: [
            {
              label: '角色名称',
              prop: 'roleName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '角色描述',
              prop: 'roleDescribe',
              inputType: 'input',
              span: 12,
            },
            {
              label: '角色类型',
              prop: 'type',
              inputType: 'input',
              span: 12,
            },
            {
              label: '角色附带值',
              prop: 'roleValue',
              inputType: 'input',
              span: 12,
            },
            {
              label: '角色备注',
              prop: 'remark',
              inputType: 'input',
              span: 12,
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
        roleDescribe: {
          required: true,
          message: '请输入角色描述',
          trigger: 'blur',
        },
        type: {
          required: true,
          message: '请输入角色类型',
          trigger: 'blur',
        },
        roleValue: {
          required: true,
          message: '请输入角色附带值',
          trigger: 'blur',
        },
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
      const id = configType === 'add' ? '' : this.form.id;
      const param = {
        id,
        remark: val.remark,
        roleDescribe: val.roleDescribe,
        roleName: val.roleName,
        roleValue: val.roleValue,
        type: val.type,
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      updateRole(param).then((res) => {
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
}
</style>
