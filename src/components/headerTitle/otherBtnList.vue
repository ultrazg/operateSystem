<template>
  <div id="otherBtnList" class="flexRow pos-r">
    <!-- <el-button type="primary" @click="toogle"> 更多操作<i :class="getClass()"></i> </el-button>
    <div class="list"> -->
    <slot></slot>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  props: {
    addTitleBtn: {
      type: String,
      default: '新增',
    },
    anBoolean: Number,
  },
  watch: {
    anBoolean(val) {
      this.an = val;
      this.toogle();
    },
  },
  data() {
    return {
      an: 0,
    };
  },
  methods: {
    getClass() {
      const className = {
        0: 'el-icon-caret-bottom',
        1: 'el-icon-caret-top',
      };

      return `${className[this.an]} el-icon--right f-9`;
    },
    toogle() {
      this.an = this.an === 0 ? 1 : 0;
    },
  },
};
</script>

<style lang="less">
#otherBtnList {
  position: relative;
  ul {
    display: flex;
    flex-direction: row;
  }
  li {
    min-width: 70px;
    height: 30px;
    background: linear-gradient(135deg, #f7660d 0%, #f00a00 100%);
    border-radius: 0;
    margin-right: 10px;
    padding: 0 5px;
    cursor: pointer;
    span {
      font-size: 14px;
      cursor: pointer;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #fff;
    }
  }
  .list {
    position: absolute;
    width: 100%;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 2px 4px 0px rgba(137, 137, 137, 0.5);
    z-index: 1;
    li {
      padding: 10px 15px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(34, 34, 38, 1);
      cursor: pointer;
    }
  }
}
</style>
