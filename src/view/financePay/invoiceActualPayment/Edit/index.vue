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
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <rename-info ref="renameInfo" :data="data" v-if="data.type === 'rename'" @success="successSubmit" />
      <confirm-payment
        ref="confirmPayment"
        :data="data"
        v-if="data.type === 'confirmPayment'"
        @success="successSubmit"
      />
      <handle-info ref="handleInfo" :data="data" v-if="data.type === 'handle'" @success="successSubmit" />
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import renameInfo from './rename';
import ConfirmPayment from './confirmPayment';
import handleInfo from '@/view/financePay/common/handle';
// import {
//   selectListByParentCode,
//   initSuppleNoticeAttach as initGoodsAttach,
// } from "@/api";
// import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'paymentInfo',
  components: {
    dialogCont,
    renameInfo,
    ConfirmPayment,
    handleInfo,
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
    },
    closeedit() {
      if (this.$refs.renameInfo) {
        this.$refs.renameInfo.cancelForm();
      }
      if (this.$refs.confirmPayment) {
        this.$refs.confirmPayment.cancelForm();
      }
      if (this.$refs.handleInfo) {
        this.$refs.handleInfo.cancelForm();
      }
    },
    canceledit(type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit() {
      if (this.$refs.renameInfo) {
        this.$refs.renameInfo.submitFormItem();
      }
      if (this.$refs.confirmPayment) {
        this.$refs.confirmPayment.submitFormItem();
      }
      if (this.$refs.handleInfo) {
        this.$refs.handleInfo.submitFormItem();
      }
    },
    successSubmit() {
      this.closeedit();
      this.$emit('success');
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
