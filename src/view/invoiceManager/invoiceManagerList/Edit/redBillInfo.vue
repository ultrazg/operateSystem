<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :title="`${title}`"
    width="950px"
    :visible.sync="dialogShow"
    ref="dialog"
    :appendToBody="true"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <div id="base">
        <FormItem
          ref="blueBillFormItem"
          :layout="layout"
          :rules="formRules"
          :disabled="inputDisabled"
          :isEdit="isEdit"
          :form.sync="form"
          @submit="submitForm"
        />
      </div>
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import FormItem from '@/components/formItem';
import { getInvoiceList, updateRedInvoice, addRedInvoice } from '@/api/invoiceManager/invoiceIndex';
export default {
  name: 'redBillInfo',
  components: {
    dialogCont,
    FormItem,
  },
  props: {
    show: Boolean,
    redAddData: {
      type: Object,
    },
  },
  inject: ['common'],
  data() {
    const { configType } = this.redAddData;

    return {
      subpackageInvoiceShow: false,
      subpackageInvoiceData: {},
      scrollHeight: 'auto',
      title: '蓝票票据信息添加',
      /** 输入禁用 */
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      form: {},
      layout: [
        {
          title: '红票票据信息添加',
          formItems: [
            {
              label: '申请编号',
              prop: 'applyId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '蓝票编号',
              prop: 'invoiceId',
              inputType: 'input',
              span: 12,
            },
            {
              label: '金额',
              prop: 'redAmount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '备注',
              prop: 'remark',
              inputType: 'textarea',
              span: 24,
            },
          ],
        },
      ],
      formRules: {},
    };
  },
  computed: {
    dialogShow: {
      get() {
        return this.show;
      },
      set(v) {
        console.log('set');
      },
    },
  },
  mounted() {
    // this.$nextTick(() => {
    //     console.log(this.redAddData);
    // });
  },
  watch: {
    redAddData: {
      handler(val) {
        // this.redAddData = val;
        this.inputDisabled = val.configType === 'detail';
        this.isEdit = ['add', 'edit'].includes(val.configType);
        this.isAdd = ['add'].includes(val.configType);
        if (!this.isAdd) {
          this.reqDetail();
        }
      },
      deep: true,
    },
  },
  methods: {
    reqDetail() {
      const { row } = this.redAddData;

      if (row) {
        this.form = {
          ...this.form,
          ...row,
        };
      }
    },
    submitForm(val) {
      console.log('this.form', this.form);
      this.$emit('success', this.form);
    },
    cancelForm() {
      this.form = {};
      this.$refs.blueBillFormItem.cancelForm();
    },

    openedit() {
      console.log('openedit');
    },
    closeedit() {
      if (this.$refs.blueBillFormItem) {
        this.$refs.blueBillFormItem.cancelForm();
      }
    },
    canceledit(type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit() {
      if (this.$refs.blueBillFormItem) {
        this.$refs.blueBillFormItem.submitForm();
      }
    },
    successSubmit() {
      this.closeedit();
      this.$emit('success');
    },
    getSelectObj(selectTable) {
      this.form = {
        ...this.form,
        ...selectTable,
        ...selectTable.projectApprovalDto,
      };
      const { rate } = this.redAddData.row;
      const params = this.common().taxRateCode.filter((ele) => ele.id === rate)[0];
      const taxValue = Number(params.value);

      const amountNTax = (
        (parseFloat(selectTable.totalTaxPriceAmount || 0) * 100) /
        (100 + parseFloat(taxValue || 0))
      ).toFixed(2);
      const amountTax = (parseFloat(selectTable.totalTaxPriceAmount || 0) - amountNTax).toFixed(2);

      this.form.amount = selectTable.totalTaxPriceAmount;
      this.form.amountNTax = amountNTax;
      this.form.amountTax = amountTax;
      const text = this.form.fundsType;
      const kpwd = '按项目开票'; // 开票选择维度-按项目
      const remark = `${selectTable.erpNumber}\n${selectTable.projectApprovalDto.name}\n${selectTable.hireContractOrderId}\n${text}\n${kpwd}`;

      this.form.remark = remark;
      this.closeSubPackage();
    },
    closeSubPackage() {
      this.subpackageInvoiceShow = false;
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
  .comp-wrapper {
    position: relative;
  }
  .add-btn {
    display: inline-block;
    padding: 3px 12px;
    color: #fff;
    background: linear-gradient(135deg, #f7660d 5%, #f00a00 100%);
    margin-bottom: 8px;
    cursor: pointer;
    position: absolute;
    right: 18px;
    top: 7px;
    z-index: 10;
    border-radius: 4px;
  }
}
</style>
