<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import Config from '@/config';
import commonApi from '@/mixins/commonApi';
import store from '@/store';
export default {
  name: 'App',
  mixins: [commonApi()],
  provide() {
    const self = this;

    return {
      common() {
        return self.common;
      },
    };
  },
};
</script>

<style lang="less" scoped>
#app {
  min-height: 100%;
}
</style>
<style lang="less">
.comp-page-table {
  //table的class
  /deep/.el-table__fixed,
  /deep/.el-table__fixed-right {
    height: 100% !important; //设置高优先，以覆盖内联样式
  }
}
</style>
