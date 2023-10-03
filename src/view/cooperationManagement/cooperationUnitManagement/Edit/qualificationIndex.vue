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
    :appendToBody="true"
  >
    <div class="scrollView" :style="{ height: scrollHeight }">
      <!-- <base-info ref="baseInfo" :data="data" v-if="data.type === 'base'" @success="successSubmit" /> -->
      <qualification-edit
        ref="handleInfo"
        :qualificationData="data"
        v-if="data.type === 'edit'"
        @success="successSubmit"
        @getUnitQlicasData="getUnitQlicasData"
      />
    </div>
  </dialog-cont>
</template>

<script>
// import baseInfo from './base.vue';
// import handleInfo from './handle.vue';
import dialogCont from '@/components/dialog';
import QualificationEdit from './qualificationEdit.vue';

export default {
  name: 'qualificationIndex',
  components: {
    dialogCont,
    QualificationEdit,
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
      title: '合作资质信息添加',
      form: {},
    };
  },
  computed: {
    dialogShow: {
      get() {
        return this.show;
      },
      set(v) {
        console.log('set', v);
      },
    },
  },
  // beforeMount() {
  //   console.log(this.data);
  // },
  methods: {
    openedit() {
      // console.log('openedit');
    },
    closeedit() {
      if (this.$refs.baseInfo) {
        this.$refs.baseInfo.cancelForm();
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
      if (this.$refs.handleInfo) {
        this.$refs.handleInfo.submitFormItem();
      }
    },
    successSubmit(val) {
      this.closeedit();
      this.$emit('success', val);
    },
    // 获取合作资质数据
    getUnitQlicasData(val) {
      console.log(val);
      if (val) {
        // this.editUnitQlicas = val;
        this.successSubmit(val);
      }
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
