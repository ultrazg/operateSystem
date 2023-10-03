<template>
  <div class="invoiceBatchHandle">
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
export default {
  name: 'invoiceBatchHandle',
  components: {
    FormItem,
  },
  inject: ['common'],
  props: {
    data: {},
  },
  data() {
    return {
      /** 输入禁用 */
      inputDisabled: false,
      isEdit: true,
      form: {
        busiName: undefined,
        auditOpinion: undefined,
      },
      layout: [
        {
          title: '基础信息',
          formItems: [
            {
              label: '虚拟发票',
              prop: 'virtualType',
              inputType: 'select',
              span: 12,
              options: [
                {
                  id: '0',
                  name: '否',
                },
                {
                  id: '1',
                  name: '是',
                },
              ],
              onChange: (val) => {
                this.form.virtualType = val;
                this.form.virtualTypeHtml = val === '1' ? '是' : '否';
              },
            },
            {
              label: '开票日期',
              prop: 'invoiceDate',
              inputType: 'date',
              span: 12,
            },
            {
              label: '分包发票代码',
              prop: 'invoiceCode',
              inputType: 'input',
              span: 12,
            },
            {
              label: '分包发票号码',
              prop: 'invoiceNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '本章发票不含税金',
              prop: 'taxFreeAmount',
              inputType: 'input',
              span: 12,
              onChange: (val) => {
                this.form.taxFreeAmount = val;
                this.handleInput('taxFreeAmount');
              },
            },
            {
              label: '本章发票税额',
              prop: 'taxAmount',
              inputType: 'input',
              span: 12,
              onChange: (val) => {
                this.form.taxAmount = val;
                this.handleInput('taxAmount');
              },
            },
            {
              label: '本章发票含税价',
              prop: 'taxPriceAmount',
              inputType: 'input',
              span: 12,
              disabled: true,
            },
          ],
        },
      ],
      formRules: {
        invoiceCode: {
          required: true,
          message: '请输入分包发票代码',
          trigger: 'blur',
        },
        invoiceNumber: {
          required: true,
          message: '请输入分包发票号码',
          trigger: 'blur',
        },
        taxFreeAmount: {
          required: true,
          message: '请输入本章发票不含税金',
          trigger: 'blur',
        },
        taxAmount: {
          required: true,
          message: '请输入本章发票税额',
          trigger: 'blur',
        },
        taxPriceAmount: {
          required: true,
          message: '',
          trigger: 'blur',
        },
        virtualType: {
          required: true,
          message: '请选择虚拟发票',
          trigger: 'change',
        },
        invoiceDate: {
          required: true,
          message: '请选择开票日期',
          trigger: 'change',
        },
      },
    };
  },
  methods: {
    reqDetail() {
      const { row } = this.data;

      if (row) {
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
      const params = {
        type: this.data.type,
        index: this.data.index,
        ...val,
        ...this.selectTable,
      };

      this.$emit('success', params);
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },

    handleInput() {
      const taxFreeAmount = parseFloat(this.form.taxFreeAmount) || 0; // 本章发票不含税金
      const taxAmount = parseFloat(this.form.taxAmount) || 0; // 本章发票税额

      this.$set(this.form, 'taxPriceAmount', taxFreeAmount + taxAmount); // 本章发票含税价
    },
  },

  created() {
    console.log(this.data);
    if (this.data.type === 'edit') {
      this.reqDetail();
    }
  },
};
</script>

<style scoped></style>
