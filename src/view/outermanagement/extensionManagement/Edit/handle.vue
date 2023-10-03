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
  name: 'extensionInfo',
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
          title: '编辑延期信息',
          formItems: [
            {
              label: '处理结果',
              prop: 'judgeResult',
              inputType: 'select',
              span: 12,
              options: this.common().approvalStatus,
              onChange: (val) => {
                const options = this.common().approvalStatus;
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
          title: '延期详情',
          headerRight: true,
          name: '延期信息查看',
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
              prop: 'contactPName',
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
      this.submitForm();
    },
    submitForm(val) {
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;
      const param = {
        // ...val,
        //  此处需要东西
      };
      const message = configType === 'add' ? '新增成功' : '修改成功';

      editExtension(param).then((res) => {
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
