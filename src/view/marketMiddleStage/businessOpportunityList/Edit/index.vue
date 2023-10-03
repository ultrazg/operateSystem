<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :title="`${title}`"
    width="950px"
    :visible.sync="dialogShow"
    :confirmShow="confirmShow"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <base-info ref="baseInfo" :data="data" v-if="data.type === 'base'" @success="successSubmit" />
      <handle-info ref="handleInfo" :data="data" v-if="data.type === 'handle'" @success="successSubmit" />
      <examine-info ref="examineInfo" :data="data" v-if="data.type === 'examine'" @success="successSubmit" />
      <import-info ref="importInfo" :data="data" v-if="data.type === 'import'" @success="successSubmit" />
    </div>
  </dialog-cont>
</template>

<script>
import baseInfo from './base.vue';
import handleInfo from './handle.vue';
import examineInfo from './examine.vue';
import importInfo from '@/view/common/importExcel';
import dialogCont from '@/components/dialog';
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
    dialogCont,
    examineInfo,
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
      title: '商机详情',
      form: {},
      confirmShow: false,
    };
  },
  watch: {
    show(value) {
      if (value) {
        const info = {
          detail: '商机详情',
          edit: '商机编辑',
          add: '商机新增',
          examine: '提交审核',
          import: 'EXCEL文件上传',
        };

        this.confirmShow = this.data.configType !== 'detail';
        this.title = info[this.data.configType];
      }
    },
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
      console.log('openedit');
    },
    // 关闭预览 不提交数据
    closeedit() {
      if (this.$refs.baseInfo) {
        this.$refs.baseInfo.cancelForm();
      }
      if (this.$refs.handleInfo) {
        this.$refs.handleInfo.cancelForm();
      }
      if (this.$refs.examineInfo) {
        this.$refs.examineInfo.cancelForm();
      }
      if (this.$refs.importInfo) {
        this.$refs.importInfo.cancelForm();
      }
    },
    canceledit(type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    // 确定操作提交数据
    confirmedit() {
      if (this.$refs.baseInfo) {
        this.canceledit('close');
      }
      if (this.$refs.handleInfo) {
        this.$refs.handleInfo.submitFormItem();
      }
      if (this.$refs.examineInfo) {
        this.$refs.examineInfo.submitFormItem();
      }
      if (this.$refs.importInfo) {
        this.$refs.importInfo.submitFormItem();
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
