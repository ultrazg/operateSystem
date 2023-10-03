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
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {
        judgeResult: undefined,
        auditOpinion: undefined,
      },
      layout: [
        {
          title: '编辑核销信息',
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
          title: '核销详情',
          headerRight: true,
          name: '核销信息查看',
          formItems: [
            {
              label: '外经证编号',
              prop: 'outerId',
              inputType: 'select',
              span: 12,
              onFocus: (val) => {
                this.outerManagementData = {
                  ...this.data,
                  ...this.form,
                };
                this.outerManagementShow = true;
              },
            },
            {
              label: '外经证名称',
              prop: 'outerName',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '有效期起',
              prop: 'startTime',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '有效期止',
              prop: 'endTime',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '涉税金额',
              prop: 'taxAmount',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '经办人电话',
              prop: 'operatorTel',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '经营方式',
              prop: 'modeType',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '联系人',
              prop: 'contactP',
              inputType: 'input',
              disabled: true,
              span: 12,
            },
            {
              label: '承揽框架名称',
              prop: 'hireIdName',
              inputType: 'input',
              disabled: true,
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
