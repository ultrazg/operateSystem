<template>
  <div id="unitName">
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
import { getCooperationDetailsById, getCooperationUnitById } from '@/api/cooperationUnitManagement/index';

export default {
  name: 'unitName',
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
          title: '合作单位基础数据',
          formItems: [
            {
              label: '单位名称',
              prop: 'name',
              inputType: 'input',
              span: 12,
            },
            {
              label: '识别码',
              prop: 'identificationCode',
              inputType: 'input',
              span: 12,
            },
            {
              label: '注册资金',
              prop: 'registerCapital',
              inputType: 'input',
              span: 12,
            },
            {
              label: '法人',
              prop: 'legalPerson',
              inputType: 'input',
              span: 12,
            },
            {
              label: '开户名',
              prop: 'bank',
              inputType: 'input',
              span: 12,
            },
            {
              label: '开户账号',
              prop: 'bankCode',
              inputType: 'input',
              span: 12,
            },
            {
              label: '注册地址',
              prop: 'registerAddress',
              inputType: 'input',
              span: 12,
            },
            {
              label: '办公地址',
              prop: 'officeAddress',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作级别',
              prop: 'level',
              inputType: 'select',
              span: 12,
              options: this.common().cooperationLevelCode,
              // onChange: (val) => {
              //   this.form.level = val;
              // },
            },
            {
              label: '联系人',
              prop: 'contactsPeople',
              inputType: 'input',
              span: 12,
            },
            {
              label: '联系电话',
              prop: 'tel',
              inputType: 'input',
              span: 12,
            },
            {
              label: '备注',
              prop: 'remark',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
      formRules: {},
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
        this.getCooperationDetails();
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

    // 获取合作框架详情
    getCooperationDetails() {
      const { row } = this.data;
      const { contractNo } = row;

      console.log(row, row.id);

      getCooperationUnitById(row.id).then((res) => {
        if (res.code === '200') {
          const { data } = res;

          console.log(data);

          const majorOpts = this.common().majorCode;

          console.log(majorOpts);

          this.form = { ...data };
          console.log(this.form);

          // console.log(data, total);

          // this.tableData = data;
          // this.page.total = total;
        }
      });

      // if (row && row.id) {
      //   console.log(row, row.id);
      // }
    },

    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const param = {
        // ...val,
        cityId: val.cityName instanceof Object ? val.cityName.id : this.form.cityId,
        cityName: val.cityName instanceof Object ? val.cityName.name : this.form.cityName,
        devClass: val.devClass instanceof Object ? val.devClass.name : this.form.devClass,
        devClassId: val.devClass instanceof Object ? val.devClass.id : this.form.devClassId,
        devIp: val.devIp,
        devName: val.devName,
        devType: val.devType instanceof Object ? val.devType.name : this.form.devType,
        devTypeId: val.devType instanceof Object ? val.devType.id : this.form.devTypeId,
        factoryId: val.factoryName instanceof Object ? val.factoryName.id : this.form.factoryId,
        factoryName: val.factoryName instanceof Object ? val.factoryName.name : this.form.factoryName,
        roomId: val.roomName instanceof Object ? val.roomName.id : this.form.roomId,
        roomName: val.roomName instanceof Object ? val.roomName.name : this.form.roomName,
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      // editDeviceInfo(param).then((res) => {
      //   if (res.code === '200') {
      //     this.$notify({
      //       title: '成功',
      //       message,
      //       type: 'success',
      //       position: 'bottom-right',
      //     });
      //     this.$emit('success');
      //   }
      // });
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
  },
  created() {
    if (this.isAdd === false) {
      this.getCooperationDetails();
    }
  },
};
</script>

<style lang="less" scoped>
#unitName {
}
</style>
