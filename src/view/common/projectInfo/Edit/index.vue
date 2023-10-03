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
      <work-contract-detail
        ref="workContractDetail"
        :data="data"
        v-if="data.type === 'workContractDetail'"
        @success="successSubmit"
      />
      <cooperative-contract-detail
        ref="cooperativeContractDetail"
        :data="data"
        :extraData="extraData"
        v-if="data.type === 'cooperativeContractDetail'"
        @success="successSubmit"
      />
      <edit-project-amount
        ref="editProjectAmount"
        :data="data"
        v-if="data.type === 'editProjectAmount'"
        @success="successSubmit"
      />
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import workContractDetail from '@/view/marketMiddleStage/hirecontractList/Edit/base';
import cooperativeContractDetail from '@/view/marketMiddleStage/contractList/Edit/base';
import editProjectAmount from './editProjectAmount';
export default {
  name: 'projectDialog',
  components: {
    dialogCont,
    workContractDetail,
    cooperativeContractDetail,
    editProjectAmount,
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
      confirmShow: false,
      cancelShow: false,
      extraData: {
        cancelRules: true,
        showBtn: false,
        showSummary: true,
        paySchedule: true,
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
  methods: {
    openedit() {
      console.log('openedit');
      console.log(this.data);
      this.confirmShow = this.data.type === 'editProjectAmount';
      this.cancelShow = this.data.type === 'editProjectAmount';
    },
    closeedit() {
      if (this.$refs.editProjectAmount) {
        this.$refs.editProjectAmount.cancelForm();
      }
    },
    canceledit(type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit() {
      if (this.$refs.editProjectAmount) {
        this.$refs.editProjectAmount.submitFormItem();
      }
    },
    successSubmit() {
      this.closeedit();
      this.$emit('success', this.data.type);
    },
  },
};
</script>

<style lang="less" scoped>
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
