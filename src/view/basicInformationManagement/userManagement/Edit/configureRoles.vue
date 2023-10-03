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
    >
      <div slot="rolesList">
        <el-checkbox-group v-model="rolesListData" @change="rolesListChange" v-if="rolesList && rolesList.length > 0">
          <el-checkbox v-for="(item, index) in rolesList" :title="item.roleName" :label="item.roleCode" :key="index">{{
            item.roleName
          }}</el-checkbox>
        </el-checkbox-group>
        <div v-else>暂无数据，晚点再来吧</div>
      </div>
    </FormItem>
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import { getRolesList, addUserRoles } from '@/api/basicInformationManagement/userManagement';

export default {
  name: 'configureRoles',
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
      rolesListData: [],
      rolesList: [],
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {},
      layout: [
        {
          title: '用户配置角色',
          formItems: [
            {
              label: '用户名称',
              prop: 'username',
              inputType: 'input',
              span: 12,
              disabled: true,
            },
            {
              label: '姓名',
              prop: 'realName',
              inputType: 'input',
              span: 12,
              disabled: true,
            },
            {
              label: '配置角色',
              prop: 'rolesList',
              inputType: 'custom',
              span: 24,
              options: this.getRolesList(),
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
    getRolesList() {
      const { row } = this.data;

      getRolesList(row.username).then((res) => {
        this.rolesList = res.data;
        this.rolesList.forEach((item) => {
          if (item.checked) {
            this.rolesListData.push(item.roleCode);
          }
        });
      });
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
        rolesList: this.rolesListData,
        username: row.username,
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      addUserRoles(param).then((res) => {
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
