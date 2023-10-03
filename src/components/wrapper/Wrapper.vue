<template>
  <div class="comp-wrapper" :class="className">
    <div class="comp-wrapper-header" v-if="title">
      <div class="comp-wrapper-header__left">
        <slot name="header-left">
          <span class="comp-wrapper-header__icon">
            <img src="~@/common/images/dailog_title.png" alt="" />
          </span>
          <span class="comp-wrapper-header__title">
            {{ title }}
          </span>
        </slot>
        <slot name="icon-r"></slot>
      </div>

      <div class="comp-wrapper-header__right">
        <slot name="header-right"> </slot>
      </div>
      <div v-if="isFold" class="isFoldIcon" @click="handleToggleFold">
        <em class="icon" :class="isFoldVal ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"></em>
      </div>
    </div>
    <div class="comp-wrapper-content" v-show="!isFoldVal">
      <slot> </slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'wrapperComponent',
  props: {
    title: {
      type: String,
      default: '',
    },
    className: {
      type: String,
      default: '',
    },
    isFold: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      isFoldVal: false,
    };
  },
  methods: {
    handleToggleFold() {
      this.isFoldVal = !this.isFoldVal;
    },
  },
  watch: {
    isFold: {
      handler(newVal, oldVal) {
        this.isFoldVal = newVal;
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less" scoped>
.comp-wrapper {
  background: #fff;
  // margin-top: 20px;
  &:first-child {
    margin-top: 0;
  }
  &-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    // border-bottom: 1px solid #cecece;
    background: linear-gradient(270deg, #fef3ef 0%, #fef3ef 100%);
    // border: 1px solid;
    // border-image: linear-gradient(270deg, rgba(255, 243, 243, 1), rgba(255, 159, 106, 1)) 1 1;
    position: relative;
    margin-bottom: 10px;
    &::after {
      content: '';
      width: 2px;
      height: 100%;
      background: #d91920;
      position: absolute;
      left: 0;
      top: 0;
    }

    &__icon {
      margin: 0 10px;
      text-align: center;
    }

    &__title {
      font-size: 14px;
      font-weight: 600;
      font-family: arial, 'Microsoft YaHei', 'PingFang SC', 'STHeitiSC-Light', 'Helvetica-Light', sans-serif,
        'Droid Sans Fallback';
      position: relative;
      color: #303030;
    }

    &__left {
      display: flex;
    }
    .isFoldIcon {
      position: absolute;
      right: 10px;
      cursor: pointer;
      .icon {
        font-size: 22px;
        font-weight: 600;
        color: #acacac;
      }
    }
  }
  &-content {
    // padding: 10px 0px 0;
  }
}
</style>
