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
    :confirmShow="confirmShow"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <blueBillInfoAdd ref="blueBillInfoAdd" :data="data" v-if="data.type === 'base'" @success="successSubmit" />
      <handleInfo ref="handleInfo" :data="data" v-if="data.type === 'handle'" @success="successSubmit" />
      <subcontractInvoiceInfo
        ref="subcontractInvoiceInfo"
        :data="data"
        v-if="data.type === 'subcontractInvoiceInfo'"
        @success="successSubmit"
      />
      <fabuInfo ref="fabuInfo" :data="data" v-if="data.type === 'fabu'" @success="successSubmit" />
      <closeInfo ref="closeInfo" :data="data" v-if="data.type === 'close'" @success="successSubmit" />
    </div>
  </dialog-cont>
</template>

<script>
import blueBillInfoAdd from './blueBillInfoAdd';
import handleInfo from './handle.vue';
import dialogCont from '@/components/dialog';
import closeInfo from '@/view/common/close.vue';
import fabuInfo from '@/view/common/fabu.vue';
import subcontractInvoiceInfo from './subcontractInvoiceInfo';
export default {
  name: 'supplyDetail',
  components: {
    blueBillInfoAdd,
    handleInfo,
    closeInfo,
    fabuInfo,
    dialogCont,
    subcontractInvoiceInfo,
  },
  props: {
    data: {},
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      scrollHeight: 'auto',
      form: {},
      confirmShow: true,
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
    title() {
      let name = '';

      switch (this.data.configType) {
        case 'add':
          name = '开票申请';
          break;
        case 'edit':
          name = '开票详情编辑';
          break;
        case 'redAdd':
          name = '红票申请';
          break;
        case 'close':
          name = '申请作废';
          break;
        case 'fabu':
          name = '提交审核';
          break;
        case 'detail':
          name = '开票详情查看';
          break;
        case 'subcontractInvoiceInfo':
          name = '查看分包发票';
          break;
        default:
      }

      return name;
    },
  },
  methods: {
    openedit() {
      console.log('openedit');
      this.confirmShow = this.data.type !== 'subcontractInvoiceInfo' && this.data.configType !== 'redAdd';
    },
    closeedit() {
      if (this.$refs.blueBillInfoAdd) {
        this.$refs.blueBillInfoAdd.cancelForm();
      }
      if (this.$refs.handleInfo) {
        this.$refs.handleInfo.cancelForm();
      }
      if (this.$refs.fabuInfo) {
        this.$refs.fabuInfo.cancelForm();
      }
      if (this.$refs.closeInfo) {
        this.$refs.closeInfo.cancelForm();
      }
    },
    canceledit(type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit() {
      if (this.$refs.blueBillInfoAdd) {
        this.$refs.blueBillInfoAdd.submitFormItem();
      }
      if (this.$refs.handleInfo) {
        this.$refs.handleInfo.submitFormItem();
      }
      if (this.$refs.fabuInfo) {
        this.$refs.fabuInfo.submitFormItem();
      }
      if (this.$refs.closeInfo) {
        this.$refs.closeInfo.submitFormItem();
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
