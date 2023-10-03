<template>
  <div class="projectBatchHandle">
    <FormItem
      ref="supplyFormItem"
      :layout="layout"
      :rules="formRules"
      :disabled="inputDisabled"
      :isEdit="isEdit"
      :form.sync="form"
      @submit="submitForm"
    />
    <cooperationContract :show="peopleShow" :data="peopleData" @cancel="closeEdit" @success="successEdit" />
  </div>
</template>

<script>
import FormItem from '@/components/formItem';
import cooperationContract from '../cooperationContract';
export default {
  name: 'projectBatchHandle',
  components: {
    FormItem,
    cooperationContract,
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
        invoiceType: undefined,
        erpNumber: undefined,
        contractNo: undefined,
        invoiceUnit: undefined,
        totalTaxFreeAmount: undefined,
      },
      layout: [
        {
          title: '基础信息',
          formItems: [
            {
              label: '发票类型',
              prop: 'invoiceType',
              inputType: 'select',
              span: 12,
              options: this.common().invoiceType,
              onChange: (val) => {
                this.form.invoiceType = val;
                this.form.invoiceTypeHtml = this.common().invoiceType.filter((ele) => ele.id === val)[0].name;
              },
            },
            {
              label: 'ERP编号',
              prop: 'erpNumber',
              inputType: 'input',
              span: 12,
              // disabled: true,
            },
            {
              label: '付款方式',
              prop: 'erpNumber',
              inputType: 'input',
              span: 12,
              disabled: true,
            },
            {
              label: '合作合同',
              prop: 'contractNo',
              inputType: 'select',
              span: 12,
              offset: 12,
              onFocus: (val) => {
                this.peopleData = {};
                this.peopleShow = true;
                console.log('onFocus', val);
              },
            },
            {
              label: '开发票单位',
              prop: 'invoiceUnit',
              inputType: 'input',
              span: 12,
              disabled: true,
            },
            {
              label: '本批次不含税金额',
              prop: 'totalTaxFreeAmount',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form.totalTaxFreeAmount = val;
                this.handleInput('totalTaxFreeAmount');
              },
            },
            {
              label: '税率',
              prop: 'taxRateDefault',
              inputType: 'select',
              span: 12,
              options: this.common().taxRateCode,
              onChange: (val) => {
                const params = this.common().taxRateCode.filter((ele) => ele.id === val)[0];

                this.form.taxRateDefault = val;
                this.form.taxRate = (params.value || 0) / 100;
                this.form.taxRateDefaultHtml = params.name;
                console.log(params);
                this.handleInput('taxRateDefault');
              },
            },
            {
              label: '本批次税额',
              prop: 'totalTaxAmount',
              inputType: 'inputNumber',
              span: 12,
              onChange: (val) => {
                this.form.totalTaxAmount = val;
                this.handleInput('totalTaxAmount');
              },
            },
            {
              label: '本批次含税价',
              prop: 'totalTaxPriceAmount',
              inputType: 'inputNumber',
              span: 12,
              disabled: true,
            },
            {
              label: '本批次发票备注说明',
              prop: 'remark',
              inputType: 'textarea',
              span: 24,
            },
          ],
        },
      ],
      formRules: {
        contractNo: {
          required: true,
          message: '请选择合作合同',
          trigger: 'change',
        },
        invoiceType: {
          required: true,
          message: '请选择发票类型',
          trigger: 'change',
        },
        totalTaxFreeAmount: {
          required: true,
          message: '请输入本批次不含税金额',
          trigger: 'blur',
        },
        totalTaxAmount: {
          required: true,
          message: '请输入本批次税额',
          trigger: 'change',
        },
        totalTaxPriceAmount: {
          required: true,
          message: '',
          trigger: 'change',
        },
        taxRateDefault: {
          required: true,
          message: '请选择税率',
          trigger: 'change',
        },
      },
      peopleShow: false,
      peopleData: {},
      selectTable: {},
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
        ...val,
        contractId: this.selectTable.id,
      };

      this.$emit('success', params);
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },

    closeEdit() {
      this.peopleShow = false;
      this.peopleData = {};
    },
    successEdit(selectTable) {
      console.log('selectTable', selectTable);
      this.selectTable = selectTable;
      this.$set(this.form, 'contractNo', selectTable.contractNo);
      this.$set(this.form, 'erpNumber', selectTable.erpId);
      this.$set(this.form, 'invoiceUnit', selectTable.unitName);
      this.closeEdit();
    },
    handleInput(type) {
      if (type === 'totalTaxFreeAmount' || type === 'taxRateDefault') {
        const totalTaxAmount = this.form.totalTaxFreeAmount * (this.form.taxRate || 0);

        this.$set(this.form, 'totalTaxAmount', totalTaxAmount.toFixed(2)); // 本批次税额
        this.$set(this.form, 'totalTaxPriceAmount', parseFloat(this.form.totalTaxFreeAmount) + totalTaxAmount); // 本批次含税价
      } else {
        const totalTaxFreeAmount = parseFloat(this.form.totalTaxFreeAmount) || 0;
        const totalTaxAmount = parseFloat(this.form.totalTaxAmount) || 0;

        this.$set(this.form, 'totalTaxPriceAmount', totalTaxFreeAmount + totalTaxAmount);
      }
    },
  },

  created() {
    if (this.data.type === 'edit') {
      this.reqDetail();
    }
  },
};
</script>

<style scoped></style>
