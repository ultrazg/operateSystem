<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :title="title"
    :width="width"
    :visible.sync="dialogShow"
    :confirmShow="false"
    :append-to-body="true"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <base-info ref="baseInfo" :data="data" v-if="data.type === 'base'" />
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import baseInfo from './base';
export default {
  name: 'invoicePayLogManagementDetail',
  components: {
    dialogCont,
    baseInfo,
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
      // if (this.$refs.baseInfo) {
      //   this.$refs.baseInfo.cancelForm();
      // }
    },
    canceledit(type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit() {
      // if (this.$refs.baseInfo) {
      //   this.$refs.baseInfo.submitFormItem();
      // }
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
