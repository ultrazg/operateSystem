<template>
  <div id="contractNo">
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
import { getCooperationFrameworkDetails } from '@/api/cooperationUnitManagement/index';

export default {
  name: 'contractNo',
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
      form: {
        major: undefined,
      },
      layout: [
        {
          title: '合作框架查看',
          formItems: [
            {
              label: '框架名称',
              prop: 'contractName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '框架编号',
              prop: 'contractId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '专业',
              prop: 'major',
              inputType: 'select',
              span: 12,
              options: this.common().majorCode,
              // onChange: (val) => {
              //   this.form.major = val;
              // },
            },
            {
              label: '省份',
              prop: 'province',
              inputType: 'select',
              span: 12,
              options: this.common().provincialCode,
              onChange: (val) => {
                this.setCity(val);
              },
            },
            {
              label: '城市',
              prop: 'city',
              inputType: 'select',
              multiple: true,
              span: 12,
              options: [],
            },
            {
              label: '合作单位',
              prop: 'unitName',
              inputType: 'input',
              span: 12,
              // options: this.common().constructionCode,
            },
            {
              label: '签订日期',
              prop: 'createDate',
              inputType: 'input',
              span: 12,
            },
            {
              label: '主体',
              prop: 'subject',
              inputType: 'select',
              span: 12,
              options: this.common().subjectCode,
            },
            {
              label: '档案份数',
              prop: 'estimate',
              inputType: 'input',
              span: 12,
            },
            {
              label: '存档日期',
              prop: 'sTime',
              inputType: 'input',
              span: 12,
            },
            {
              label: '有效日期',
              prop: 'sTime',
              inputType: 'input',
              span: 12,
            },
            {
              label: '有效日期止',
              prop: 'sTime',
              inputType: 'input',
              span: 12,
            },
            {
              label: '采购项目编号',
              prop: 'eTime',
              inputType: 'input',
              span: 12,
            },
            {
              label: '备注',
              prop: 'remark',
              inputType: 'input',
              span: 12,
            },
            {
              label: '审核状态',
              prop: 'status',
              inputType: 'select',
              span: 12,
              options: this.common().verifyStatusCode,
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
        this.getCooperationFramework();
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
    async setCity(province) {
      const options = this.common().provincialCode;
      const findItem = options.filter((option) => option.id === province);

      this.form = {
        ...this.form,
        province: findItem[0].id,
        city: undefined,
      };
      const city = await this.$getCode(findItem[0].id);

      console.log('city', city);
      this.$set(this.layout[0].formItems[4], 'options', city);
    },
    // 获取合作框架详情
    getCooperationFramework() {
      const { row } = this.data;
      const { contractNo } = row;

      console.log(row, row.id);

      getCooperationFrameworkDetails(row.id).then((res) => {
        if (res.code === '200') {
          const { data } = res;

          console.log(data);

          const majorOpts = this.common().majorCode;

          console.log(majorOpts);
          if (data.province) {
            this.setCity(data.province);
          }
          this.form = { ...data };
          console.log(this.form);

          // console.log(data, total);

          // this.tableData = data;
          // this.page.total = total;
        }
      });
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
      this.getCooperationFramework();
    }
  },
};
</script>

<style lang="less" scoped>
#contractNo {
}
</style>
