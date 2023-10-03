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
import { updateUser } from '@/api/basicInformationManagement/userManagement';

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
          title: '用户新增',
          formItems: [
            {
              label: '用户名称',
              prop: 'username',
              inputType: 'input',
              span: 12,
            },
            {
              label: '姓名',
              prop: 'realName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '性别',
              prop: 'sex',
              inputType: 'radio',
              span: 12,
              options: [
                {
                  name: '男',
                  value: '男',
                },
                {
                  name: '女',
                  value: '女',
                },
              ],
            },
            {
              label: '部门',
              prop: 'department',
              inputType: 'select',
              span: 12,
              options: this.common().productionCenterCode,
              onChange: (val) => {
                this.form.department = val;
              },
            },
            {
              label: '职务',
              prop: 'position',
              inputType: 'select',
              span: 12,
              options: this.common().position,
              onChange: (val) => {
                this.form.position = val;
              },
            },
            {
              label: 'email',
              prop: 'email',
              inputType: 'input',
              span: 12,
            },
            {
              label: '手机号码',
              prop: 'mobile',
              inputType: 'input',
              span: 12,
            },
            {
              label: '办公电话',
              prop: 'officePhone',
              inputType: 'input',
              span: 12,
            },
            {
              label: '密码',
              prop: 'password',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      formRules: {
        username: {
          required: true,
          message: '请输入用户名称',
          trigger: 'blur',
        },
        realName: {
          required: true,
          message: '请输入姓名',
          trigger: 'blur',
        },
        sex: {
          required: true,
          message: '请选择性别',
          trigger: 'blur',
        },
        department: {
          required: true,
          message: '请选择部门',
          trigger: 'blur',
        },
        position: {
          required: true,
          message: '请选择职务',
          trigger: 'blur',
        },
        mobile: {
          required: true,
          message: '请输入手机号码',
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
        id: `${id}`,
        department: val.department,
        email: val.email,
        mobile: val.mobile,
        officePhone: val.officePhone,
        password: val.password,
        position: val.position,
        realName: val.realName,
        sex: val.sex,
        username: val.username,
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      updateUser(param).then((res) => {
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
