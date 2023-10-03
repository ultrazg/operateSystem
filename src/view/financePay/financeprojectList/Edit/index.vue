<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :title="title"
    :width="width"
    :visible.sync="dialogShow"
    :append-to-body="true"
    :confirmShow="confirmShow"
    :cancelShow="cancelShow"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <collection-detail
        ref="collectionDetail"
        :data="data"
        v-if="data.type === 'collectionDetail'"
        @success="successSubmit"
      />
      <invoice-pay-log-detail
        ref="collectionDetail"
        :data="data"
        :isErpNumberSearch="true"
        v-if="data.type === 'invoicePayLogDetail'"
        @success="successSubmit"
      />
      <payment-amount-detail
        ref="paymentAmountDetail"
        :data="data"
        v-if="data.type === 'paymentAmountDetail'"
        @success="successSubmit"
      />
      <cooperation-invoice
        ref="cooperationInvoice"
        :data="data"
        v-if="data.type === 'cooperationInvoice'"
        @success="successSubmit"
      />
      <financial-account
        ref="financialAccount"
        :data="data"
        v-if="data.type === 'financialAccount'"
        @success="successSubmit"
      />
      <base-info ref="baseInfo" :data="data" v-if="data.type === 'baseInfo'" @success="successSubmit" />
      <project-detail-show
        ref="projectDetailShow"
        :data="data"
        v-if="data.type === 'projectDetailShow'"
        @success="successSubmit"
      />
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import collectionDetail from './collectionDetail';
import invoicePayLogDetail from '@/view/financePay/invoicePayLogManagement/Edit/base';
import paymentAmountDetail from '@/view/financePay/common/paymentAmountDetail';
import cooperationInvoice from '@/view/financePay/common/cooperationInvoice';
import financialAccount from '@/view/financePay/common/financialAccount';
import baseInfo from './base';
import projectDetailShow from '@/view/common/projectInfo/projectDetailShow';
export default {
  name: 'financeprojectListDialog',
  components: {
    dialogCont,
    collectionDetail,
    invoicePayLogDetail,
    paymentAmountDetail,
    cooperationInvoice,
    financialAccount,
    baseInfo,
    projectDetailShow,
  },
  props: {
    data: {},
    show: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '待办信息查看',
    },
    width: {
      type: String,
      default: '900px',
    },
  },
  data() {
    return {
      scrollHeight: 'auto',
      form: {},
      confirmShow: true,
      cancelShow: true,
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
    openedit() {
      console.log('openedit');
      this.confirmShow = false;
      this.cancelShow = this.data.type === 'projectDetailShow';
    },
    closeedit() {
      // if (this.$refs.handleInfo) {
      //   this.$refs.handleInfo.cancelForm();
      // }
    },
    canceledit(type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit() {
      // if (this.$refs.handleInfo) {
      //   this.$refs.handleInfo.submitFormItem();
      // }
    },
    successSubmit() {
      this.closeedit();
      this.$emit('success');
    },
  },
};
</script>

<style scoped lang="less">
@deep: ~'>>>';

@{deep}.el-dialog__body {
  padding-right: 4px;
}
.scrollView {
  overflow: hidden;
  overflow-y: auto;
  padding-right: 10px;
  // 重写滚动条样式
  &::-webkit-scrollbar-track-piece {
    //滚动条凹槽的颜色，还可以设置边框属性
    background-color: transparent;
  }
  &::-webkit-scrollbar {
    //滚动条的宽度
    width: 4px;
    height: 4px;
    border-radius: 2px;
    margin-right: 2px;
    position: relative;
  }
  &::-webkit-scrollbar-thumb {
    //滚动条的设置
    background: #d5d5d5;
    background-clip: padding-box;
    min-height: 28px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #d5d5d5;
  }
}
</style>
