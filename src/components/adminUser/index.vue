<template>
  <div id="adminUser">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
    />
  </div>
</template>

<script>
import { adminUserDetail } from 'api/user';
import FormItem from '@/components/formItem';

export default {
  name: 'adminUser',
  inject: ['common'],
  data() {
    return {
      inputDisabled: true,
      isEdit: false,
      form: {},
      layout: [
        {
          title: '用戶中心',
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
                  value: '男',
                  name: '男',
                },
                {
                  value: '女',
                  name: '女',
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
          ],
        },
      ],
      formRules: {},
    };
  },
  watch: {
    $route: {
      immediate: true,
      handler(val, oldval) {
        const { name, query } = val;

        if (name === 'adminUser' && query.userId) {
          this.reqDetail(query.userId);
        }
      },
      // 深度观察监听
      deep: true,
    },
  },
  methods: {
    reqDetail(id) {
      adminUserDetail(id).then((res) => {
        if (res && res.code === '200') {
          this.form = {
            ...this.form,
            ...res.data,
          };
        }
      });
    },
  },
  components: {
    FormItem,
  },
};
</script>
<style lang="less" scoped>
#updatePassword {
  .content-view {
    width: 50%;
  }
}
</style>
