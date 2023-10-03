<template>
  <div id="accountManagement">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="项目至今会业核对表" name="accountSummary">
        <accountSummary
          v-if="activeName === 'accountSummary'"
        /><!-- && $_hasOperation(routerCode, 'accountSummary') -->
      </el-tab-pane>
      <el-tab-pane label="会业核对当期数" name="accountPeriod">
        <accountPeriod v-if="activeName === 'accountPeriod'" />
        <!-- && $_hasOperation(routerCode, 'accountPeriod') -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import accountSummary from './accountSummary';
import accountPeriod from './accountPeriod';
export default {
  name: 'accountManagement',
  inject: ['common'],
  data() {
    return {
      activeName: 'accountSummary',
    };
  },
  components: {
    accountSummary,
    accountPeriod,
  },
  mounted() {
    // this.$nextTick(() => {});
  },
  methods: {},
};
</script>

<style lang="less" scoped>
#accountManagement {
  /deep/.el-tabs {
    .el-tabs__nav {
      .el-tabs__item {
        &.is-active {
          color: #ea2134;
        }
      }
    }
  }
}
</style>
