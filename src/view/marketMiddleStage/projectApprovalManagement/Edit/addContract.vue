<template>
  <!--添加合同-->
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    appendToBody
    :title="`${title}`"
    width="950px"
    :visible.sync="dialogShow"
    :confirmShow="!inputDisabled"
    :customClass="'addContract'"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <FormItem
        ref="supplyFormItem"
        :layout="layout"
        :rules="formRules"
        :disabled="inputDisabled"
        :form.sync="form"
        @submit="submitForm"
      />
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import FormItem from '@/components/formItem';
import {
  addCooperationContractTemp,
  updateCooperationContractTemp,
} from '@/api/marketMiddleStage/projectApprovalManagement';
export default {
  name: 'addContract',
  components: {
    dialogCont,
    FormItem,
  },
  props: {
    data: {},
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    const { configType } = this.data;

    return {
      inputDisabled: configType === 'detail',
      isEdit: ['add', 'edit'].includes(configType),
      isAdd: ['add'].includes(configType),
      scrollHeight: 'auto',
      title: '新增合作合同金额',
      form: {},
      formRules: {
        fbinvoiceTotalAmount: {
          required: true,
          message: '请输入累计分包发票',
          trigger: 'blur',
        },
        payableTotalAmount: {
          required: true,
          message: '请输入累计应付款',
          trigger: 'blur',
        },
        paymentTotalAmount: {
          required: true,
          message: '请输入累计付款',
          trigger: 'blur',
        },
        pretaxTotalAmount: {
          required: true,
          message: '请输入累计预缴税',
          trigger: 'blur',
        },
      },
      layout: [
        {
          title: '合作合同金额信息',
          formItems: [
            {
              label: '累计分包发票',
              prop: 'fbinvoiceTotalAmount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '累计应付款',
              prop: 'payableTotalAmount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '累计付款',
              prop: 'paymentTotalAmount',
              inputType: 'input',
              span: 12,
            },
            {
              label: '累计预缴税',
              prop: 'pretaxTotalAmount',
              inputType: 'input',
              span: 12,
            },
          ],
        },
      ],
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
  methods: {
    // 打开预览
    openedit() {
      this.reqDetail();
    },
    // 请求数据
    reqDetail() {
      const { row } = this.data;

      if (row && row.id) {
        this.form = {
          ...this.form,
          ...row,
        };
      }
    },
    // 提交数据
    submitForm(val) {
      const a = parseFloat(val.fbinvoiceTotalAmount || 0) + parseFloat(val.pretaxTotalAmount || 0);

      if (parseFloat(val.payableTotalAmount) > a) {
        this.$notify({
          title: '成累计应付款金额 不能大于 累计分包发票 + 累计预缴税 的总额功',
          message,
          position: 'bottom-right',
        });

        return;
      }

      if (parseFloat(val.paymentTotalAmount) > parseFloat(val.payableTotalAmount)) {
        this.$notify({
          title: '累计付款金额 不能大于 累计应付款金额',
          message,
          position: 'bottom-right',
        });

        return;
      }
      const { row } = this.data;

      const param = {
        erpNumber: row.erpNumber,
        contractId: row.contractId,
        ...val,
      };

      let message = '新增成功';

      let api = addCooperationContractTemp;
      // 新增累计付款

      if (this.isEdit && !this.isAdd) {
        param.id = row.id;
        message = '修改成功';
        api = updateCooperationContractTemp;
      }
      // 更新累计付款
      api(param).then((res) => {
        if (res.code === '200') {
          this.$notify({
            title: '成功',
            message,
            type: 'success',
            position: 'bottom-right',
          });
          this.form = {};
          this.$refs.supplyFormItem.cancelForm();
          this.$emit('success');
        }
      });
    },
    // 关闭预览
    closeedit() {
      this.form = {};
      this.canceledit();
    },
    // 取消预览
    canceledit(type) {
      this.$refs.supplyFormItem.cancelForm();
      this.$emit('cancel', type);
    },
    // 提交预览
    confirmedit() {
      this.$refs.supplyFormItem.submitForm();
    },
    // 成功提交
    successSubmit() {
      this.closeedit();
      this.$emit('success');
    },
  },
};
</script>

<style lang="less">
.showContract {
  .comp-page-table {
    min-height: auto;
  }
}
</style>
