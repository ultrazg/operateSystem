<template>
  <div id="trialBalanceManagement">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="项目至今试算平衡表" name="trialBalance">
        <trialBalance v-if="activeName === 'trialBalance'" /><!-- && $_hasOperation(routerCode, 'trialBalance') -->
      </el-tab-pane>
      <el-tab-pane label="当期试算平衡表" name="trialBalanceStatement">
        <trialBalanceStatement v-if="activeName === 'trialBalanceStatement'" />
        <!-- && $_hasOperation(routerCode, 'trialBalanceStatement') -->
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import trialBalance from './trialBalance';
import trialBalanceStatement from './trialBalanceStatement';
export default {
  name: 'trialBalanceManagement',
  inject: ['common'],
  data() {
    return {
      activeName: 'trialBalance',
    };
  },
  components: {
    trialBalance,
    trialBalanceStatement,
  },
  mounted() {
    // this.$nextTick(() => {});
  },
  methods: {},
};
</script>

<style lang="less" scoped>
#trialBalanceManagement {
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
