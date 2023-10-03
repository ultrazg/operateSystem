<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :confirmShow="confirmShow"
    :title="`${title}`"
    width="950px"
    :visible.sync="dialogShow"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <baseInfo ref="baseInfo" :data="data" v-if="data.type === 'base'" @success="successSubmit" />
      <handleInfo ref="handleInfo" :data="data" v-if="data.type === 'handle'" @success="successSubmit" />
      <decomposeInfo ref="decomposeInfo" :data="data" v-if="data.type === 'decompose'" @success="successSubmit" />
      <fabuInfo ref="fabuInfo" :data="data" v-if="data.type === 'fabu'" @success="successSubmit" />
      <closeInfo ref="closeInfo" :data="data" v-if="data.type === 'close'" @success="successSubmit" />
      <project-detail-show
        ref="projectDetailShow"
        :data="data"
        :amountShowProgress="true"
        v-if="data.type === 'projectDetailShow'"
        @success="successSubmit"
      />
      <importInfo ref="import" :data="data" v-if="data.type === 'import'" @success="successSubmit" />
      <!-- 自建-合同详情 -->
      <selfBaseInfo ref="selfBaseInfo" :data="data" v-if="data.type === 'selfBase'" @success="successSubmit" />
      <importInfo
        ref="importSelf"
        :data="data"
        v-if="data.type === 'importSelf'"
        :api="importSelf"
        @success="successSubmit"
      />
      <!-- 以租代建-合作详情 -->
      <insteadBaseInfo ref="insteadBase" :data="data" v-if="data.type === 'insteadBase'" @success="successSubmit" />
      <importInfo
        ref="importInstead"
        :data="data"
        v-if="data.type === 'importInstead'"
        :api="importStation"
        @success="successSubmit"
      />
      <!-- 协作-生成合作合同 -->
      <addInsteadContract
        ref="addInsteadContract"
        :data="data"
        v-if="data.type === 'addInsteadContract'"
        @success="successSubmit"
      />
      <!-- 以租代建-生成合作合同 -->
      <creatContract ref="creatContract" :data="data" v-if="data.type === 'creatContract'" @success="successSubmit" />
      <!-- 自建-生成合作合同 -->
      <addSelfContract
        ref="addSelfContract"
        :data="data"
        v-if="data.type === 'addSelfContract'"
        @success="successSubmit"
      />
      <!-- 自建-批量拆站 -->
      <batchUpdate ref="batchUpdate" :data="data" v-if="data.type === 'batchUpdate'" @success="successSubmit" />
    </div>
  </dialog-cont>
</template>

<script>
import baseInfo from './base.vue';
import selfBaseInfo from './selfBaseInfo.vue';
import insteadBaseInfo from './insteadBase.vue';
import handleInfo from './handle.vue';
import addInsteadContract from './addInsteadContract';
import creatContract from './creatContract.vue';
import addSelfContract from './addSelfContract.vue';
import batchUpdate from './batchUpdate.vue';
import fabuInfo from '@/view/common/fabu.vue';
import closeInfo from '@/view/common/close.vue';
import importInfo from '@/view/common/importExcel';
import decomposeInfo from './decompose';
import dialogCont from '@/components/dialog';
import projectDetailShow from '@/view/common/projectInfo/projectDetailShow';
import { importSelf } from '@/api/marketMiddleStage/projectApprovalManagement/oneSelf';
import { importStation } from '@/api/marketMiddleStage/projectApprovalManagement/instead';
// import {
//   selectListByParentCode,
//   initSuppleNoticeAttach as initGoodsAttach,
// } from "@/api";
export default {
  name: 'supplyDetail',
  components: {
    baseInfo,
    handleInfo,
    fabuInfo,
    closeInfo,
    decomposeInfo,
    dialogCont,
    projectDetailShow,
    selfBaseInfo,
    importInfo,
    insteadBaseInfo,
    addInsteadContract,
    creatContract,
    addSelfContract,
    batchUpdate,
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
      isAdd: false,
      form: {},
      confirmShow: this.data.configType !== 'handle' && this.data.type !== 'decompose',
      importSelf,
      importStation,
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
          name = '立项申请';
          break;
        case 'addInstead':
          name = '新增以租代建';
          break;
        case 'addSelf':
          name = '新增自建';
          break;
        case 'edit':
          name = '项目立项编辑';
          break;
        case 'close':
          name = '申请作废';
          break;
        case 'fabu':
          name = '提交审核';
          break;
        case 'handle':
          name = '项目过程管理';
          break;
        case 'decompose':
          name = '项目分解管理';
          break;
        case 'detail':
          name = '查看立项申请';
          break;
        case 'projectDetailShow':
          name = '项目详情展示';
          break;
        case 'import':
          name = 'EXCEL文件上传';
          break;
        case 'creatContract':
          name = '生成合作合同';
          break;
        default:
      }

      return name;
    },
  },
  methods: {
    // 打开预览
    openedit() {
      const addType = ['add', 'addSelf', 'addInstead'];

      this.isAdd = addType.includes(this.data.configType);
      const confirmNotShowType = ['handle', 'detail'];

      this.confirmShow = !confirmNotShowType.includes(this.data.configType) && this.data.type !== 'decompose';
    },
    // 关闭预览
    closeedit() {
      if (this.$refs.baseInfo) {
        this.$refs.baseInfo.cancelForm();
      }
      if (this.$refs.handleInfo) {
        this.$refs.handleInfo.cancelForm();
      }
      if (this.$refs.decomposeInfo) {
        this.$refs.decomposeInfo.cancelForm();
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
      if (this.$refs.importSelf) {
        this.$refs.importSelf.cancelForm();
      }
      if (this.$refs.selfBaseInfo) {
        this.$refs.selfBaseInfo.cancelForm();
      }
      if (this.$refs.insteadBase) {
        this.$refs.insteadBase.cancelForm();
      }
      if (this.$refs.creatContract) {
        this.$refs.creatContract.cancelForm();
      }
      if (this.$refs.addSelfContract) {
        this.$refs.addSelfContract.cancelForm();
      }
      if (this.$refs.batchUpdate) {
        this.$refs.batchUpdate.cancelForm();
      }
      if (this.$refs.importInstead) {
        this.$refs.importInstead.cancelForm();
      }
    },
    // 取消预览
    canceledit(type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    // 提交
    confirmedit() {
      if (this.$refs.baseInfo) {
        this.$refs.baseInfo.submitFormItem();
      }
      if (this.$refs.handleInfo) {
        this.$refs.handleInfo.submitFormItem();
      }
      if (this.$refs.decomposeInfo) {
        this.$refs.decomposeInfo.submitFormItem();
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
      if (this.$refs.selfBaseInfo) {
        this.$refs.selfBaseInfo.submitFormItem();
      }
      if (this.$refs.insteadBase) {
        this.$refs.insteadBase.submitFormItem();
      }
      if (this.$refs.importSelf) {
        this.$refs.importSelf.submitFormItem();
      }
      if (this.$refs.creatContract) {
        this.$refs.creatContract.submitFormItem();
      }
      if (this.$refs.addSelfContract) {
        this.$refs.addSelfContract.submitFormItem();
      }
      if (this.$refs.batchUpdate) {
        this.$refs.batchUpdate.submitFormItem();
      }
      if (this.$refs.importInstead) {
        this.$refs.importInstead.submitFormItem();
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
