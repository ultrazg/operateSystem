<template>
  <div class="subcontractInvoiceInfo">
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
import FormItem from '@/components/formItem';
import { subpackageDetail } from '@/api/invoiceManager/index';
export default {
  name: 'subcontractInvoiceInfo',
  inject: ['common'],
  components: {
    FormItem,
  },
  props: {
    show: Boolean,
    data: {},
  },
  data() {
    const { configType } = this.data;

    return {
      /** 输入禁用 */
      inputDisabled: true,
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {},
      layout: [
        {
          title: '基础信息',
          formItems: [
            {
              label: '批次号',
              prop: 'batchId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '开发票单位',
              prop: 'invoiceUnit',
              inputType: 'input',
              span: 12,
            },
            {
              label: '发票类型',
              prop: 'invoiceTypeName',
              inputType: 'input',
              span: 12,
            },
            {
              label: '本批次不含税金额',
              prop: 'totalTaxFreeAmount',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '本批次税额',
              prop: 'totalTaxAmount',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '本批次含税价',
              prop: 'totalTaxPriceAmount',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '税率',
              prop: 'taxRate',
              inputType: 'select',
              span: 12,
              options: this.common().taxRateCode,
            },
            {
              label: '归属项目号',
              prop: 'erpNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '子批次号',
              prop: 'subBathId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '本次拆分金额',
              prop: 'subAmount',
              inputType: 'inputNumber',
              span: 12,
            },
            {
              label: '归属项目号',
              prop: 'billNumber',
              inputType: 'input',
              span: 12,
            },
            {
              label: '发票次数',
              prop: 'count',
              inputType: 'input',
              span: 12,
            },
            {
              label: '创建时间',
              prop: 'createTime',
              inputType: 'input',
              span: 12,
            },
            {
              label: '创建人',
              prop: 'createPeople',
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
  methods: {
    submitFormItem() {
      this.$refs.supplyFormItem.submitForm();
    },
    cancelForm() {
      this.form = {};
      this.$refs.supplyFormItem.cancelForm();
    },
    getInfo() {
      const { billId } = this.data.row;

      subpackageDetail(billId).then((res) => {
        if (res.code === '200') {
          const invoiceType = this.common().invoiceType.filter((ele) => ele.id === res.data.invoiceType);

          this.form = {
            ...res.data,
            invoiceTypeName: invoiceType && invoiceType.length ? invoiceType[0].name : '',
          };
        }
      });
    },
  },
  created() {
    this.getInfo();
  },
};
</script>

<style scoped></style>
