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
      <subpackage-invoice
        :blueAddData="blueAddData"
        :show="subpackageInvoiceShow"
        :data="subpackageInvoiceData"
        @success="getSelectObj"
        @cancel="closeSubPackage"
      />
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import FormItem from '@/components/formItem';
import { getInvoiceList } from '@/api/invoiceManager/invoiceIndex';
import SubpackageInvoice from './subpackageInvoice.vue';

export default {
  name: 'blueBillInfo',
  components: {
    dialogCont,
    FormItem,
    SubpackageInvoice,
  },
  props: {
    show: Boolean,
    blueAddData: {
      type: Object,
    },
  },
  inject: ['common'],
  data() {
    const { configType } = this.blueAddData;

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
          title: '蓝票票据信息添加',
          formItems: [
            {
              label: '开票名称',
              prop: 'name',
              inputType: 'input',
              span: 12,
            },
            {
              label: '款项类型',
              prop: 'fundsType',
              inputType: 'select',
              span: 12,
              options: this.common().fundsType,
            },
            {
              label: 'ERP',
              prop: 'erpNumber',
              inputType: 'select',
              span: 12,
              onFocus: (val) => {
                if (!this.form.fundsType) {
                  this.$notify.error({
                    title: '失败',
                    message: '请选择款项类型!!!',
                    position: 'bottom-right',
                  });

                  return false;
                }

                this.subpackageInvoiceData = {
                  ...this.blueAddData,
                  ...this.form,
                };
                this.subpackageInvoiceShow = true;
                console.log('onFocus', val);
              },
            },
            {
              label: '质保金总额',
              prop: 'mortgage',
              inputType: 'input',
              span: 12,
            },
            {
              label: '发票金额',
              prop: 'amount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '不含税',
              prop: 'amountNTax',
              inputType: 'input',
              span: 12,
            },
            {
              label: '税金',
              prop: 'amountTax',
              inputType: 'input',
              span: 12,
            },
            {
              label: '摘要',
              prop: 'remark',
              inputType: 'textarea',
              span: 24,
            },
          ],
        },
      ],
      formRules: {
        name: {
          required: true,
          message: '请输入开票名称',
          trigger: '[blur, change]',
        },
        fundsType: {
          required: true,
          message: '请选择款项类型',
          trigger: '[blur, change]',
        },
        erpNumber: {
          required: true,
          message: '请输入ERP',
          trigger: '[blur, change]',
        },
      },
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
    //     console.log(this.blueAddData);
    // });
  },
  watch: {
    blueAddData: {
      handler(val) {
        // this.blueAddData = val;
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
      const { row } = this.blueAddData;

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
      const { rate } = this.blueAddData.row;
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
