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
// import {
//   editDeviceInfo,
//   getFactorySelect,
//   roomSelectByCommand,
//   getDevModelSelect,
//   getDevTypeSelect
// } from "@/api/plan_center";

export default {
  name: 'baseInfo',
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
      isEdit: ['create', 'edit'].includes(configType),
      isCreate: ['create'].includes(configType),
      form: {
        judgeResult: undefined,
        auditOpinion: undefined,
      },
      layout: [
        {
          title: '生成暂估应付',
          formItems: [
            {
              label: '处理结果',
              prop: 'judgeResult',
              inputType: 'select',
              span: 12,
              options: this.common().judgeResult,
              onChange: (val) => {
                const options = this.common().judgeResult;
                const findItem = options.filter((option) => option.id === val);

                this.form = {
                  ...this.form,
                  judgeResult: findItem[0].id,
                  auditOpinion: findItem[0].name,
                };
              },
            },
            {
              label: '处理意见',
              prop: 'auditOpinion',
              inputType: 'input',
              span: 12,
            },
          ],
        },
        {
          title: '业务详情',
          headerRight: true,
          name: '合作框架查看',
          formItems: [
            {
              label: '审核状态',
              prop: 'status',
              inputType: 'input',
              span: 12,
            },
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
              label: '省份',
              prop: 'province',
              inputType: 'input',
              span: 12,
            },
            {
              label: '城市',
              prop: 'city',
              inputType: 'input',
              span: 12,
            },
            {
              label: '对应入围编号',
              prop: 'admissionId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '专业',
              prop: 'major',
              inputType: 'input',
              span: 12,
            },
            {
              label: '签订日期',
              prop: 'signDate',
              inputType: 'input',
              span: 12,
            },
            {
              label: '主体',
              prop: 'subject',
              inputType: 'input',
              span: 12,
            },
            {
              label: '档案份数',
              prop: 'documents',
              inputType: 'input',
              span: 12,
            },
            {
              label: '存档日期',
              prop: 'documentDate',
              inputType: 'input',
              span: 12,
            },
            {
              label: '合作单位',
              prop: 'consignorName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '有效日期起',
              prop: 'validitySDate',
              inputType: 'input',
              span: 12,
            },
            {
              label: '有效日期止',
              prop: 'validityEDate',
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
      formRules: {
        // no: { required: true, message: "请输入公告名称", trigger: "blur" },
        // address: { required: true, message: "请输入公告号", trigger: "blur" },
        // buildArea: {
        //   required: true,
        //   message: "请选择公告类型",
        //   trigger: "blur",
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
      console.log('val', val);
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

      editDeviceInfo(param).then((res) => {
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
