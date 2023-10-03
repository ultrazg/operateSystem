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
    :confirmShow="data.configType !== 'detail' && data.configType !== 'electricDetail'"
  >
    <!-- :confirmShow="false" -->
    <div class="scrollView" :style="{ height: scrollHeight }">
      <baseInfo ref="baseInfo" :data="data" v-if="data.type === 'base'" @success="successSubmit" />
      <handleInfo ref="handleInfo" :data="data" v-if="data.type === 'handle'" @success="successSubmit" />
      <importInfo
        ref="importInfo"
        :data="data"
        v-if="data.type === 'import'"
        @success="successSubmit"
        :api="electricInfoImport"
      />
      <electricBase ref="electricBase" :data="data" v-if="data.type === 'electricBase'" @success="successSubmit" />
      <electricityFee
        ref="electricityFee"
        :data="data"
        v-if="data.type === 'electricityFee'"
        @success="successSubmit"
      />
    </div>
  </dialog-cont>
</template>

<script>
import baseInfo from './base.vue';
import handleInfo from './handle.vue';
import electricBase from './electricBase.vue';
import electricityFee from './electricityFee.vue';
import dialogCont from '@/components/dialog';
import importInfo from '@/view/common/importExcel';
import { electricInfoImport } from '@/api/costManagement/stationElectric';
// import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'supplyDetail',
  components: {
    baseInfo,
    handleInfo,
    dialogCont,
    importInfo,
    electricBase,
    electricityFee,
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
      electricInfoImport,
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
          name = '新增电费';
          break;
        case 'edit':
          name = '电费详情编辑';
          break;
        case 'import':
          name = '导入模板';
          break;
        case 'create':
          name = '生成暂估应付';
          break;
        case 'electricBase':
          name = '电费具体详情';
          break;
        // case 'decompose':
        //   name = '项目分解管理';
        //   break;
        case 'detail':
          name = '查看站点详情';
          break;
        case 'electricDetail':
          name = '查看电费详情';
          break;
        default:
      }

      return name;
    },
  },
  methods: {
    openedit() {
      console.log('openedit');
    },
    closeedit() {
      if (this.$refs.baseInfo) {
        this.$refs.baseInfo.cancelForm();
      }
      if (this.$refs.handleInfo) {
        this.$refs.handleInfo.cancelForm();
      }
      if (this.$refs.importInfo) {
        this.$refs.importInfo.cancelForm();
      }
      if (this.$refs.electricityFee) {
        this.$refs.electricityFee.cancelForm();
      }
      if (this.$refs.electricBase) {
        this.$refs.electricBase.cancelForm();
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
      if (this.$refs.importInfo) {
        this.$refs.importInfo.submitFormItem();
      }
      if (this.$refs.electricityFee) {
        this.$refs.electricityFee.submitFormItem();
      }
      if (this.$refs.electricBase) {
        this.$refs.electricBase.submitFormItem();
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
