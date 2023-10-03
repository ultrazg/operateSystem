<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :confirmShow="data.configType !== 'detail'"
    :title="`${title}`"
    width="950px"
    :visible.sync="dialogShow"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <base-info ref="baseInfo" :data="data" v-if="data.type === 'base'" @success="successSubmit" />
      <handle-info ref="handleInfo" :data="data" v-if="data.type === 'handle'" @success="successSubmit" />
      <fabuInfo ref="fabuInfo" :data="data" v-if="data.type === 'fabu'" @success="successSubmit" />
      <closeInfo ref="closeInfo" :data="data" v-if="data.type === 'close'" @success="successSubmit" />
      <importInfo ref="import" :data="data" v-if="data.type === 'import'" @success="successSubmit" />
    </div>
  </dialog-cont>
</template>

<script>
import baseInfo from './base.vue';
import handleInfo from './handle.vue';
import dialogCont from '@/components/dialog';
import closeInfo from '@/view/common/close.vue';
import fabuInfo from '@/view/common/fabu.vue';
import importInfo from '@/view/common/importExcel';
// import {
//   selectListByParentCode,
//   initSuppleNoticeAttach as initGoodsAttach,
// } from "@/api";
// import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'supplyDetail',
  components: {
    baseInfo,
    handleInfo,
    closeInfo,
    fabuInfo,
    dialogCont,
    importInfo,
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
          name = '合作框架新增';
          break;
        case 'edit':
          name = '合作框架编辑';
          break;
        case 'close':
          name = '申请作废';
          break;
        case 'fabu':
          name = '提交审核';
          break;
        case 'detail':
          name = '查看合作框架';
          break;
        case 'import':
          name = '模板导入';
          break;
        default:
      }

      return name;
    },
  },
  methods: {
    // 打开预览
    openedit() {
      console.log('openedit');
    },
    // 关闭预览
    closeedit() {
      if (this.$refs.baseInfo) {
        this.$refs.baseInfo.cancelForm();
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
      if (this.$refs.import) {
        this.$refs.import.cancelForm();
      }
    },
    // 取消预览
    canceledit(type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    // 提交预览
    confirmedit() {
      if (this.$refs.baseInfo) {
        this.$refs.baseInfo.submitFormItem();
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
      if (this.$refs.import) {
        this.$refs.import.submitFormItem();
      }
    },
    // 成功提交
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
