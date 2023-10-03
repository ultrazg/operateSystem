<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :title="`${title}`"
    width="950px"
    :confirmShow="confirmShow"
    :visible.sync="dialogShow"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <baseInfo
        ref="baseInfo"
        :data="data"
        v-if="data.type === 'base' || data.type === 'detail'"
        @success="successSubmit"
      />
      <backfillInfo ref="backfill" :data="data" v-if="data.type === 'backfill'" @success="successSubmit" />
      <handleInfo ref="handleInfo" :data="data" v-if="data.type === 'handle'" @success="successSubmit" />
      <uploadInfo ref="uploadInfo" :data="data" v-if="data.type === 'upload'" @success="successSubmit" />
      <fabuInfo ref="fabuInfo" :data="data" v-if="data.type === 'fabu'" @success="successSubmit" />
      <importInfo
        ref="import"
        :data="data"
        :api="importOutermanag"
        v-if="data.type === 'import'"
        @success="successSubmit"
      />
    </div>
  </dialog-cont>
</template>

<script>
import baseInfo from './base.vue';
import handleInfo from './handle.vue';
import uploadInfo from './upload.vue';
import backfillInfo from './backfill.vue';
import dialogCont from '@/components/dialog';
import fabuInfo from '@/view/common/fabu.vue';
import importInfo from '@/view/common/importExcel';
import { importOutermanag } from '@/api/outermanagement/financeOuterManagement';
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
    uploadInfo,
    dialogCont,
    importInfo,
    fabuInfo,
    backfillInfo,
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
      importOutermanag,
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
          name = '外经证申请';
          break;
        case 'edit':
          name = '外经证申请编辑';
          break;
        case 'infoEdit':
          name = '外经证回填信息填写';
          break;
        case 'backfill':
          name = '外经证回执信息填写';
          break;
        case 'printFinance':
          name = '外经证打印';
          break;
        case 'entryEdit':
          name = '预缴税录入';
          break;
        case 'addUpload':
          name = '外经证-上传回执';
          break;
        case 'import':
          name = '模板导入';
          break;
        case 'detail':
          name = '外经证申请查看';
          break;
        case 'fabu':
          name = '提交审核';
          break;
        default:
      }
      if (this.data.type === 'detail') {
        name = '外经证申请查看';
      }

      return name;
    },
  },
  methods: {
    openedit() {
      console.log('openedit');
      this.confirmShow = this.data.type !== 'upload' && this.data.configType !== 'detail';
    },
    closeedit() {
      if (this.$refs.baseInfo) {
        this.$refs.baseInfo.cancelForm();
      }
      if (this.$refs.handleInfo) {
        this.$refs.handleInfo.cancelForm();
      }
      if (this.$refs.import) {
        this.$refs.import.cancelForm();
      }
      if (this.$refs.fabuInfo) {
        this.$refs.fabuInfo.cancelForm();
      }
      if (this.$refs.backfill) {
        this.$refs.backfill.cancelForm();
      }
    },
    canceledit(type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit() {
      if (this.$refs.baseInfo) {
        this.$refs.baseInfo.submitFormItem();
      }
      if (this.$refs.handleInfo) {
        this.$refs.handleInfo.submitFormItem();
      }
      if (this.$refs.import) {
        this.$refs.import.submitFormItem();
      }
      if (this.$refs.fabuInfo) {
        this.$refs.fabuInfo.submitFormItem();
      }
      if (this.$refs.backfill) {
        this.$refs.backfill.submitFormItem();
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
