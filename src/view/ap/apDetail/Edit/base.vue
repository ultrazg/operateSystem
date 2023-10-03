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
      form: {},
      layout: [
        {
          title: '待办基础信息',
          formItems: [
            {
              label: '待办状态',
              prop: 'statusName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '对应业务',
              prop: 'businessName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '待办说明',
              prop: 'explain',
              inputType: 'input',
              span: 12,
            },
            {
              label: '处理人',
              prop: 'auditPeople',
              inputType: 'input',
              span: 12,
            },
            {
              label: '处理时间',
              prop: 'updateTime',
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
              label: '创建人',
              prop: 'createPeople',
              inputType: 'input',
              span: 12,
            },
            {
              label: '创建时间',
              prop: 'createTime',
              inputType: 'input',
              span: 12,
            },
          ],
        },
        {
          title: '处理信息',
          formItems: [
            {
              label: '处理人',
              prop: 'auditPeople',
              inputType: 'input',
              span: 12,
            },
            {
              label: '处理结果',
              prop: 'auditResult',
              inputType: 'input',
              span: 12,
            },
            {
              label: '处理时间',
              prop: 'auditTime',
              inputType: 'input',
              span: 12,
            },
            {
              label: '处理意见',
              prop: 'auditOpinion',
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
        detail(row.id).then((res) => {
          if (res && res.code === '200') {
            this.form = {
              ...this.form,
              ...res.data,
            };
          }
        });
      }
    },
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    submitForm(val) {
      console.log('this.data', this.data);
      const { configType, row } = this.data;
      const id = configType === 'add' ? '' : this.form.id;

      let param = {
        ...val,
      };

      let api = add;
      // 新增采购信息

      let message = '新增成功';

      if (id) {
        param = {
          ...param,
          id: `${id}`,
        };
        message = '更新成功';
        api = update;
      }

      api(param).then((res) => {
        if (res && res.code === '200') {
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
