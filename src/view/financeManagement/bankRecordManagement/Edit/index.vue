<template>
  <dialog-cont
    @on-cancel="canceledit('cancel')"
    @on-close="canceledit('close')"
    @on-confirm="confirmedit"
    @on-open="openedit"
    :title="`${title}`"
    width="1150px"
    :visible.sync="dialogShow"
    :confirmShow="confirmShow"
    ref="dialog"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <detail-table ref="detailTable" :data="data" v-if="data.type === 'base'" />
    </div>
  </dialog-cont>
</template>

<script>
import dialogCont from '@/components/dialog';
import detailTable from '@/view/financeManagement/bankRecordDetailManagement';
// import {
//   selectListByParentCode,
//   initSuppleNoticeAttach as initGoodsAttach,
// } from "@/api";
// import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'supplyDetail',
  components: {
    detailTable,
    dialogCont,
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
  },
  data() {
    return {
      scrollHeight: 'auto',
      form: {},
      confirmShow: false,
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
  watch: {
    show(value) {
      if (value) {
        this.confirmShow = this.data.type !== 'base';
      }
    },
  },
  methods: {
    openedit() {
      console.log('openedit');
    },
    closeedit() {
      // if (this.$refs.detailTable) {
      //   this.$refs.detailTable.cancelForm();
      // }
    },
    canceledit(type) {
      this.closeedit();
      this.$emit('cancel', type);
    },
    confirmedit() {
      if (this.$refs.detailTable) {
        this.$refs.detailTable.submitFormItem();
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
